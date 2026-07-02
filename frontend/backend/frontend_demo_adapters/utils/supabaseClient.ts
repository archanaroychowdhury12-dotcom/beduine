// Mock Supabase client for the Beduine disconnected demo.
// It now behaves closer to production auth boundaries:
// - explicit password field is required for email login
// - every user receives a stable unique Beduine UID
// - admin is a separate seeded account and is never auto-logged in
// - client sign-up cannot self-seed admin role unless explicitly enabled for QA

import { AppRole, AppUserMetadata, SupabaseRawUser } from '../../business_logic/types';

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

const MOCK_CUSTOMER_PASSWORD = 'beduine123';
const MOCK_ADMIN_PASSWORD = 'admin123';

function normalizeEmail(email?: string | null) {
  return String(email || '').trim().toLowerCase();
}

function normalizeMockRole(role: unknown): AppRole {
  return role === 'admin' || role === 'customer' ? role : 'customer';
}

function canSeedClientRole(): boolean {
  return import.meta.env.VITE_ALLOW_CLIENT_ROLE_SEEDING === 'true';
}

function randomPart(length = 8) {
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase();
}

function makeUserId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `usr_${crypto.randomUUID()}`;
  }
  return `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function makeBeduineUid() {
  return `BDU-${new Date().getFullYear()}-${randomPart(6)}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function baseMetadata(data: Partial<AppUserMetadata> = {}): AppUserMetadata {
  return {
    planName: null,
    planPrice: null,
    planType: null,
    subscriptionStatus: 'inactive',
    subscription_source: null,
    payment_type: null,
    subscription_payment_record: null,
    payment_hold_status: null,
    real_wallet_balance: 0,
    demo_wallet_balance: 0,
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
    uid: data.uid || makeBeduineUid(),
  };
}

const DEMO_CUSTOMER: SupabaseRawUser = {
  id: 'demo-customer-id-12345',
  email: 'demo@beduine.com',
  phone: '+91 9876543210',
  user_metadata: baseMetadata({
    uid: 'BDU-DEMO-CUSTOMER-001',
    full_name: 'Demo Customer',
    phone: '+91 9876543210',
    city: 'Kolkata',
    dob: '1998-05-15',
    is_demo_user: true,
    role: 'customer',
    auth_password: MOCK_CUSTOMER_PASSWORD,
  }),
  created_at: new Date().toISOString(),
};

const DEMO_ADMIN: SupabaseRawUser = {
  id: 'demo-admin-id-90001',
  email: 'admin@beduine.com',
  phone: '+91 9000000000',
  user_metadata: baseMetadata({
    uid: 'BDU-DEMO-ADMIN-001',
    full_name: 'Beduine Admin',
    phone: '+91 9000000000',
    city: 'Kolkata HQ',
    dob: '1990-01-01',
    is_demo_user: true,
    role: 'admin',
    auth_password: MOCK_ADMIN_PASSWORD,
  }),
  created_at: new Date().toISOString(),
};

function normalizeMockUser(user: SupabaseRawUser): SupabaseRawUser {
  const email = normalizeEmail(user.email);
  const metadata = user.user_metadata || {};
  const seededRole = email === normalizeEmail(DEMO_ADMIN.email) || user.id === DEMO_ADMIN.id ? 'admin' : undefined;

  return {
    ...user,
    email,
    user_metadata: {
      ...baseMetadata(metadata),
      ...metadata,
      uid: metadata.uid || makeBeduineUid(),
      role: normalizeMockRole(metadata.role || seededRole || 'customer'),
      is_demo_user: Boolean(metadata.is_demo_user || user.id === DEMO_ADMIN.id || user.id === DEMO_CUSTOMER.id),
    },
  };
}

class MockAuth {
  private listeners: Set<AuthListener> = new Set();
  private currentSession: AuthSession = null;

  constructor() {
    const users = this.getUsers();
    const byEmail = new Set(users.map((u) => normalizeEmail(u.email)));
    if (!byEmail.has(normalizeEmail(DEMO_CUSTOMER.email))) users.push(DEMO_CUSTOMER);
    if (!byEmail.has(normalizeEmail(DEMO_ADMIN.email))) users.push(DEMO_ADMIN);
    this.saveUsers(users.map(normalizeMockUser));

    const savedSession = localStorage.getItem('beduine_mock_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession) as AuthSession;
        if (parsed?.user) {
          const matched = this.getUsers().find((u) => u.id === parsed.user.id);
          this.currentSession = matched ? { ...parsed, user: matched } : null;
        }
      } catch {
        this.currentSession = null;
      }
    }

    // One-time migration/reset marker for the new rules. No auto-login is performed.
    const migrationKey = 'beduine_auth_uid_password_admin_split_v1';
    if (!localStorage.getItem(migrationKey)) {
      const updated = this.getUsers().map((u) => normalizeMockUser({
        ...u,
        user_metadata: {
          ...u.user_metadata,
          planName: null,
          planPrice: null,
          planType: null,
          subscriptionStatus: 'inactive',
          subscription_source: null,
          payment_type: null,
          subscription_payment_record: null,
          payment_hold_status: null,
          discount_credits: 0,
          weekly_eligible_entry_count: 0,
          weekly_participation_status: 'not_activated',
          used_credits: 0,
          pending_credits: 0,
          selected_member_benefit_status: 'none',
          ledger: [],
          demo_transactions: [],
          real_transactions: [],
        },
      }));
      this.saveUsers(updated);
      localStorage.setItem(migrationKey, 'true');
      if (this.currentSession?.user) {
        const synced = updated.find((u) => u.id === this.currentSession?.user.id);
        this.saveSession(synced ? { ...this.currentSession, user: synced } : null);
      }
    }
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

  private saveSession(session: AuthSession) {
    this.currentSession = session;
    if (session) {
      localStorage.setItem('beduine_mock_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('beduine_mock_session');
    }
  }

  private getUsers(): SupabaseRawUser[] {
    const usersStr = localStorage.getItem('beduine_mock_users');
    if (!usersStr) return [];
    try {
      return JSON.parse(usersStr);
    } catch {
      return [];
    }
  }

  private saveUsers(users: SupabaseRawUser[]) {
    localStorage.setItem('beduine_mock_users', JSON.stringify(users.map(normalizeMockUser)));
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
    if (!cleanEmail) return { data: { user: null }, error: { message: 'Email is required.' } };
    if (!password || password.length < 6) {
      return { data: { user: null }, error: { message: 'Password must be at least 6 characters.' } };
    }

    const users = this.getUsers();
    if (users.some((u) => normalizeEmail(u.email) === cleanEmail)) {
      return { data: { user: null }, error: { message: 'An account already exists for this email. Please log in.' } };
    }

    const requestedData = options?.data || {};
    const initialMetadata = baseMetadata({
      ...requestedData,
      role: canSeedClientRole() ? normalizeMockRole(requestedData.role) : 'customer',
      is_demo_user: Boolean(requestedData.is_demo_user),
      auth_password: password,
    });

    const user: SupabaseRawUser = normalizeMockUser({
      id: makeUserId(),
      email: cleanEmail,
      phone: typeof requestedData.phone === 'string' ? requestedData.phone : '',
      user_metadata: initialMetadata,
      created_at: new Date().toISOString(),
    });

    users.push(user);
    this.saveUsers(users);

    const session = { user, access_token: `mock-access-token-${user.id}`, expires_in: 3600 };
    this.saveSession(session);
    this.triggerChange('SIGNED_IN');

    return { data: { user }, error: null };
  }

  async signInWithPassword({ email, password }: SignInPasswordArgs): AuthResult<{ user: SupabaseRawUser | null }> {
    const cleanEmail = normalizeEmail(email);
    const users = this.getUsers();
    const user = users.find((u) => normalizeEmail(u.email) === cleanEmail);

    if (!user) {
      return { data: { user: null }, error: { message: 'No account found for this email.' } };
    }
    if (!password) {
      return { data: { user: null }, error: { message: 'Password is required.' } };
    }

    const storedPassword = user.user_metadata?.auth_password;
    if (storedPassword && storedPassword !== password) {
      return { data: { user: null }, error: { message: 'Invalid email or password.' } };
    }

    const normalized = normalizeMockUser(user);
    const session = { user: normalized, access_token: `mock-access-token-${normalized.id}`, expires_in: 3600 };
    this.saveSession(session);
    this.triggerChange('SIGNED_IN');

    return { data: { user: normalized }, error: null };
  }

  async signInWithOAuth({ provider, options: _options }: OAuthArgs): AuthResult<{ user: SupabaseRawUser | null }> {
    const email = normalizeEmail(`${provider || 'oauth'}-user@beduine.com`);
    const users = this.getUsers();
    let user = users.find((u) => normalizeEmail(u.email) === email);
    if (!user) {
      user = normalizeMockUser({
        id: makeUserId(),
        email,
        user_metadata: baseMetadata({
          full_name: `${provider || 'OAuth'} User`,
          role: 'customer',
          auth_password: `oauth:${provider || 'oauth'}`,
        }),
        created_at: new Date().toISOString(),
      });
      users.push(user);
      this.saveUsers(users);
    }
    const session = { user, access_token: `mock-access-token-${user.id}`, expires_in: 3600 };
    this.saveSession(session);
    this.triggerChange('SIGNED_IN');
    return { data: { user }, error: null };
  }

  async signInWithOtp({ phone: _phone }: OtpArgs): AuthResult<null> {
    return { data: null, error: null };
  }

  async verifyOtp({ phone, token: _token, type: _type }: VerifyOtpArgs): AuthResult<{ user: SupabaseRawUser | null }> {
    const users = this.getUsers();
    const email = `${phone}@phone.com`;
    let user = users.find((u) => u.phone === phone || normalizeEmail(u.email) === normalizeEmail(email));

    if (!user) {
      user = normalizeMockUser({
        id: makeUserId(),
        email,
        phone,
        user_metadata: baseMetadata({
          full_name: '',
          phone,
          role: 'customer',
          auth_password: `otp:${phone}`,
        }),
        created_at: new Date().toISOString(),
      });
      users.push(user);
      this.saveUsers(users);
    }

    const session = { user, access_token: `mock-access-token-${user.id}`, expires_in: 3600 };
    this.saveSession(session);
    this.triggerChange('SIGNED_IN');

    return { data: { user }, error: null };
  }

  async updateUser({ data }: UpdateUserArgs): AuthResult<{ user: SupabaseRawUser } | null> {
    if (!this.currentSession?.user) {
      return { data: null, error: { message: 'No active session found' } };
    }

    const user = normalizeMockUser({ ...this.currentSession.user });
    user.user_metadata = { ...user.user_metadata, ...(data || {}), uid: user.user_metadata?.uid || makeBeduineUid() };
    if (data?.email) user.email = normalizeEmail(data.email);
    if (data?.phone) user.phone = data.phone;

    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
    }

    this.saveSession({ ...this.currentSession, user });
    this.triggerChange('USER_UPDATED');

    return { data: { user }, error: null };
  }

  async signOut(): Promise<{ error: AuthError }> {
    this.saveSession(null);
    this.triggerChange('SIGNED_OUT');
    return { error: null };
  }

  getUsersList(): SupabaseRawUser[] {
    return this.getUsers();
  }

  saveUsersList(users: SupabaseRawUser[]) {
    this.saveUsers(users);
    if (this.currentSession?.user) {
      const currentId = this.currentSession.user.id;
      const updatedUser = users.find((u) => u.id === currentId);
      if (updatedUser) {
        this.currentSession.user = normalizeMockUser(updatedUser);
        this.saveSession(this.currentSession);
        this.triggerChange('USER_UPDATED');
      }
    }
  }

  resetAllAccounts() {
    const users = this.getUsers();
    const updatedUsers = users.map((u) => normalizeMockUser({
      ...u,
      user_metadata: {
        ...u.user_metadata,
        planName: null,
        planPrice: null,
        planType: null,
        subscriptionStatus: 'inactive',
        subscription_source: null,
        payment_type: null,
        subscription_payment_record: null,
        payment_hold_status: null,
        real_wallet_balance: 0,
        demo_wallet_balance: 0,
        discount_credits: 0,
        weekly_eligible_entry_count: 0,
        weekly_participation_status: 'not_activated',
        used_credits: 0,
        pending_credits: 0,
        selected_member_benefit_status: 'none',
        ledger: [],
        demo_transactions: [],
        real_transactions: [],
      },
    }));
    this.saveUsers(updatedUsers);

    if (this.currentSession?.user) {
      const currentId = this.currentSession.user.id;
      this.currentSession.user = updatedUsers.find((u) => u.id === currentId) || this.currentSession.user;
      this.saveSession(this.currentSession);
    }
    this.triggerChange('USER_UPDATED');
  }
}

export const supabase = {
  auth: new MockAuth(),
};
