import { createClient } from '@supabase/supabase-js';
import { AppUserMetadata, SupabaseRawUser } from '@/types';
import { assertProductionEnvReady, shouldUseRealSupabase } from '@/config/productionEnv';

type AuthSession = { user: SupabaseRawUser; access_token: string; expires_in: number } | null;
type AuthError = { message: string } | null;
type AuthResult<TData> = Promise<{ data: TData; error: AuthError }>;
type AuthListener = (event: string, session: AuthSession) => void;
type SignUpArgs = { email: string; password?: string; options?: { data?: Partial<AppUserMetadata> } };
type SignInPasswordArgs = { email: string; password?: string };
type OAuthArgs = { provider: string; options?: { redirectTo?: string } };
type OtpArgs = { phone: string };
type VerifyOtpArgs = { phone: string; token: string; type: 'sms' | string };
type UpdateUserArgs = { data?: Partial<AppUserMetadata> & { email?: string; phone?: string } };

export const DEMO_ACCOUNT_CREDENTIALS = {
  customer: {
    email: 'demo@beduine.com',
    password: 'beduine123',
  },
  admin: {
    email: 'admin@beduine.com',
    password: 'admin123',
  },
} as const;

const DEMO_AUTH_SCHEMA_VERSION = 'beduine_demo_auth_v2';
const DEMO_CUSTOMER_ID = 'demo-customer-id-12345';
const DEMO_ADMIN_ID = 'demo-admin-id-90001';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
assertProductionEnvReady(import.meta.env);

export const isRealSupabaseConnected = shouldUseRealSupabase(import.meta.env);

const normalizeEmail = (email?: string | null) => String(email || '').trim().toLowerCase();

const buildUid = () => `BDU-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
const buildUserId = () => (
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `usr_${crypto.randomUUID()}`
    : `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
);

async function hashDemoPassword(password: string): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure demo password hashing is unavailable in this browser.');
  }
  const bytes = new TextEncoder().encode(password);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

const defaultMetadata = (data: Partial<AppUserMetadata> = {}): AppUserMetadata => ({
  uid: data.uid || buildUid(),
  planName: null,
  planPrice: null,
  planType: null,
  subscriptionStatus: 'inactive',
  subscription_source: null,
  payment_type: null,
  subscription_payment_record: null,
  payment_hold_status: null,
  real_wallet_balance: 0,
  demo_wallet_balance: 5000,
  discount_credits: 0,
  weekly_eligible_entry_count: 0,
  weekly_participation_status: 'not_activated',
  used_credits: 0,
  pending_credits: 0,
  selected_member_benefit_status: 'none',
  ledger: [],
  demo_transactions: [],
  real_transactions: [],
  preferredLanguage: 'English',
  dietaryPreferences: 'None',
  accessibilityRequirements: 'None',
  savedTravelers: [],
  savedPickups: [],
  ...data,
});

const createDemoUser = (
  email: string,
  metadata: Partial<AppUserMetadata> = {},
  id = buildUserId(),
): SupabaseRawUser => ({
  id,
  email: normalizeEmail(email),
  phone: typeof metadata.phone === 'string' ? metadata.phone : '',
  user_metadata: defaultMetadata({
    ...metadata,
    role: 'customer',
    is_demo_user: true,
  }),
  created_at: new Date().toISOString(),
});

function createSeedAccounts(): SupabaseRawUser[] {
  return [
    createDemoUser(DEMO_ACCOUNT_CREDENTIALS.customer.email, {
      uid: 'BDU-2026-DEMO01-1001',
      full_name: 'Demo Customer',
      phone: '+91 9876543210',
      city: 'Kolkata',
      role: 'customer',
      demo_wallet_balance: 5000,
    }, DEMO_CUSTOMER_ID),
    {
      ...createDemoUser(DEMO_ACCOUNT_CREDENTIALS.admin.email, {
        uid: 'BDU-2026-ADMIN1-9001',
        full_name: 'Beduine Admin',
        phone: '+91 9000000000',
        city: 'Kolkata HQ',
        demo_wallet_balance: 0,
      }, DEMO_ADMIN_ID),
      user_metadata: defaultMetadata({
        uid: 'BDU-2026-ADMIN1-9001',
        full_name: 'Beduine Admin',
        phone: '+91 9000000000',
        city: 'Kolkata HQ',
        role: 'admin',
        is_demo_user: true,
        demo_wallet_balance: 0,
      }),
    },
  ];
}

function normalizeMockUser(user: SupabaseRawUser): SupabaseRawUser {
  const email = normalizeEmail(user.email);
  const isAdmin = user.id === DEMO_ADMIN_ID || email === DEMO_ACCOUNT_CREDENTIALS.admin.email;
  const metadata = defaultMetadata(user.user_metadata || {});
  const { auth_password: _plaintextPassword, ...safeMetadata } = metadata;

  return {
    ...user,
    email,
    user_metadata: {
      ...safeMetadata,
      uid: safeMetadata.uid || buildUid(),
      role: isAdmin ? 'admin' : 'customer',
      is_demo_user: true,
    },
  };
}

class MockAuth {
  private listeners: Set<AuthListener> = new Set();
  private currentSession: AuthSession = null;
  private usersList: SupabaseRawUser[] = [];

  constructor() {
    if (localStorage.getItem('beduine_demo_auth_schema') !== DEMO_AUTH_SCHEMA_VERSION) {
      localStorage.removeItem('beduine_mock_session');
      localStorage.removeItem('beduine_mock_users');
      localStorage.setItem('beduine_demo_auth_schema', DEMO_AUTH_SCHEMA_VERSION);
    }

    const savedUsers = localStorage.getItem('beduine_mock_users');
    if (savedUsers) {
      try {
        this.usersList = JSON.parse(savedUsers);
      } catch {
        this.usersList = [];
      }
    }
    this.ensureSeedAccounts();

    const saved = localStorage.getItem('beduine_mock_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AuthSession;
        const syncedUser = parsed?.user
          ? this.usersList.find((user) => user.id === parsed.user.id)
          : undefined;
        this.currentSession = parsed && syncedUser ? { ...parsed, user: syncedUser } : null;
      } catch {
        this.currentSession = null;
      }
    }
  }

  private ensureSeedAccounts() {
    for (const seed of createSeedAccounts()) {
      const index = this.usersList.findIndex((user) => (
        user.id === seed.id || normalizeEmail(user.email) === normalizeEmail(seed.email)
      ));
      if (index < 0) {
        this.usersList.push(seed);
        continue;
      }

      const existing = this.usersList[index];
      this.usersList[index] = normalizeMockUser({
        ...existing,
        id: seed.id,
        email: seed.email,
        phone: existing.phone || seed.phone,
        user_metadata: {
          ...seed.user_metadata,
          ...existing.user_metadata,
          uid: seed.user_metadata?.uid,
          role: seed.user_metadata?.role,
          is_demo_user: true,
        },
      });
    }
    this.persistUsers();
  }

  private persistUsers() {
    this.usersList = this.usersList.map(normalizeMockUser);
    localStorage.setItem('beduine_mock_users', JSON.stringify(this.usersList));
  }

  private upsertUser(user: SupabaseRawUser) {
    const normalized = normalizeMockUser(user);
    const index = this.usersList.findIndex((item) => item.id === normalized.id || item.email === normalized.email);
    if (index >= 0) this.usersList[index] = normalized;
    else this.usersList.unshift(normalized);
    this.persistUsers();
  }

  private triggerChange(event: string) {
    this.listeners.forEach((listener) => {
      try {
        listener(event, this.currentSession);
      } catch (e) {
        console.error('Error triggering auth listener:', e);
      }
    });
  }

  getUsersList(): SupabaseRawUser[] {
    return [...this.usersList];
  }

  saveUsersList(users: SupabaseRawUser[]) {
    this.usersList = users.map(normalizeMockUser);
    this.ensureSeedAccounts();
    this.persistUsers();
  }

  resetAllAccounts() {
    const activeSessionId = this.currentSession?.user.id;
    this.usersList = createSeedAccounts();
    this.persistUsers();
    if (activeSessionId) {
      const user = this.usersList.find((account) => account.id === activeSessionId);
      this.currentSession = user
        ? { user, access_token: `mock-token-${user.id}`, expires_in: 3600 }
        : null;
      if (this.currentSession) {
        localStorage.setItem('beduine_mock_session', JSON.stringify(this.currentSession));
      } else {
        localStorage.removeItem('beduine_mock_session');
      }
    }
    this.triggerChange('USER_UPDATED');
  }

  async getSession(): AuthResult<{ session: AuthSession }> {
    return { data: { session: this.currentSession }, error: null };
  }

  onAuthStateChange(callback: AuthListener) {
    this.listeners.add(callback);
    callback('INITIAL_SESSION', this.currentSession);
    return {
      data: {
        subscription: {
          unsubscribe: () => this.listeners.delete(callback),
        },
      },
    };
  }

  async signUp({ email, password, options }: SignUpArgs): AuthResult<{ user: SupabaseRawUser | null }> {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) {
      return { data: { user: null }, error: { message: 'Email is required.' } };
    }
    if (!password || password.length < 6) {
      return { data: { user: null }, error: { message: 'Password must be at least 6 characters.' } };
    }
    if (this.usersList.some((user) => normalizeEmail(user.email) === cleanEmail)) {
      return { data: { user: null }, error: { message: 'An account already exists for this email. Please log in.' } };
    }

    const user = createDemoUser(cleanEmail, {
      ...(options?.data || {}),
      role: 'customer',
      is_demo_user: true,
      auth_password_hash: await hashDemoPassword(password),
    });
    this.currentSession = { user, access_token: `mock-token-${user.id}`, expires_in: 3600 };
    localStorage.setItem('beduine_mock_session', JSON.stringify(this.currentSession));
    this.upsertUser(user);
    this.triggerChange('SIGNED_IN');
    return { data: { user }, error: null };
  }

  async signInWithPassword({ email, password }: SignInPasswordArgs): AuthResult<{ user: SupabaseRawUser | null }> {
    const normalizedEmail = normalizeEmail(email);
    const existing = this.usersList.find((user) => normalizeEmail(user.email) === normalizedEmail);
    if (!existing) {
      return { data: { user: null }, error: { message: 'No account found for this email.' } };
    }
    if (!password) {
      return { data: { user: null }, error: { message: 'Password is required.' } };
    }

    const fixedCredential = Object.values(DEMO_ACCOUNT_CREDENTIALS)
      .find((credential) => credential.email === normalizedEmail);
    const storedHash = typeof existing.user_metadata?.auth_password_hash === 'string'
      ? existing.user_metadata.auth_password_hash
      : null;
    const valid = fixedCredential
      ? password === fixedCredential.password
      : Boolean(storedHash && storedHash === await hashDemoPassword(password));
    if (!valid) {
      return { data: { user: null }, error: { message: 'Invalid email or password.' } };
    }

    const user = normalizeMockUser(existing);
    this.currentSession = { user, access_token: `mock-token-${user.id}`, expires_in: 3600 };
    localStorage.setItem('beduine_mock_session', JSON.stringify(this.currentSession));
    this.upsertUser(user);
    this.triggerChange('SIGNED_IN');
    return { data: { user }, error: null };
  }

  async signInWithOAuth({ provider }: OAuthArgs): AuthResult<{ user: SupabaseRawUser | null }> {
    const email = `${provider}-user@beduine.com`;
    const user = this.usersList.find((account) => account.email === email)
      || createDemoUser(email, { full_name: `${provider} Demo User` });
    this.currentSession = { user, access_token: `mock-token-${user.id}`, expires_in: 3600 };
    localStorage.setItem('beduine_mock_session', JSON.stringify(this.currentSession));
    this.upsertUser(user);
    this.triggerChange('SIGNED_IN');
    return { data: { user }, error: null };
  }

  async signInWithOtp(_args: OtpArgs): AuthResult<null> {
    return { data: null, error: null };
  }

  async verifyOtp({ phone }: VerifyOtpArgs): AuthResult<{ user: SupabaseRawUser | null }> {
    const email = `${phone.replace(/\s+/g, '')}@phone.com`;
    const user = this.usersList.find((account) => account.phone === phone)
      || createDemoUser(email, { phone });
    this.currentSession = { user, access_token: `mock-token-${user.id}`, expires_in: 3600 };
    localStorage.setItem('beduine_mock_session', JSON.stringify(this.currentSession));
    this.upsertUser(user);
    this.triggerChange('SIGNED_IN');
    return { data: { user }, error: null };
  }

  async updateUser({ data }: UpdateUserArgs): AuthResult<{ user: SupabaseRawUser } | null> {
    if (!this.currentSession?.user) {
      return { data: null, error: { message: 'No active session' } };
    }
    const updated: SupabaseRawUser = {
      ...this.currentSession.user,
      user_metadata: {
        ...this.currentSession.user.user_metadata,
        ...(data || {}),
        role: this.currentSession.user.id === DEMO_ADMIN_ID ? 'admin' : 'customer',
      },
    };
    if (data?.email) updated.email = data.email;
    if (data?.phone) updated.phone = data.phone;

    this.currentSession = { ...this.currentSession, user: updated };
    localStorage.setItem('beduine_mock_session', JSON.stringify(this.currentSession));
    this.upsertUser(updated);
    this.triggerChange('USER_UPDATED');
    return { data: { user: updated }, error: null };
  }

  async signOut(): Promise<{ error: AuthError }> {
    this.currentSession = null;
    localStorage.removeItem('beduine_mock_session');
    this.triggerChange('SIGNED_OUT');
    return { error: null };
  }
}

const mockSupabase = { auth: new MockAuth() };

export const supabase = isRealSupabaseConnected
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : mockSupabase;
