import { createClient } from '@supabase/supabase-js';
import { AppRole, AppUserMetadata, SupabaseRawUser } from '@/types';
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

const DEMO_ADMIN_EMAIL = 'admin@beduine.com';
const DEMO_ADMIN_PASSWORD = 'admin123';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
assertProductionEnvReady(import.meta.env);

export const isRealSupabaseConnected = shouldUseRealSupabase(import.meta.env);

const normalizeDemoRole = (role: unknown): AppRole => role === 'admin' ? 'admin' : 'customer';
const isDemoAdminCredential = (email: string, password?: string) =>
  email.trim().toLowerCase() === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD;

const buildUid = () => `BDU-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

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

const DUMMY_USER = (email: string, role: AppRole = 'customer'): SupabaseRawUser => ({
  id: `usr_${role}_demo_id`,
  email,
  phone: '+91 9876543210',
  user_metadata: defaultMetadata({
    full_name: email.split('@')[0].toUpperCase(),
    role,
    is_demo_user: true,
  }),
  created_at: new Date().toISOString(),
});

class MockAuth {
  private listeners: Set<AuthListener> = new Set();
  private currentSession: AuthSession = null;
  private usersList: SupabaseRawUser[] = [];

  constructor() {
    const saved = localStorage.getItem('beduine_mock_session');
    if (saved) {
      try {
        this.currentSession = JSON.parse(saved);
      } catch {
        this.currentSession = null;
      }
    }
    const savedUsers = localStorage.getItem('beduine_mock_users');
    if (savedUsers) {
      try {
        this.usersList = JSON.parse(savedUsers);
      } catch {
        this.usersList = [];
      }
    }
  }

  private persistUsers() {
    localStorage.setItem('beduine_mock_users', JSON.stringify(this.usersList));
  }

  private upsertUser(user: SupabaseRawUser) {
    const index = this.usersList.findIndex((item) => item.id === user.id || item.email === user.email);
    if (index >= 0) this.usersList[index] = user;
    else this.usersList.unshift(user);
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
    this.usersList = users;
    this.persistUsers();
  }

  resetAllAccounts() {
    this.usersList = [];
    localStorage.removeItem('beduine_mock_users');
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

  async signUp({ email, options }: SignUpArgs): AuthResult<{ user: SupabaseRawUser | null }> {
    const role = normalizeDemoRole(options?.data?.role);
    const user = DUMMY_USER(email, role);
    if (options?.data) {
      user.user_metadata = { ...user.user_metadata, ...options.data, role };
    }
    this.currentSession = { user, access_token: `mock-token-${user.id}`, expires_in: 3600 };
    localStorage.setItem('beduine_mock_session', JSON.stringify(this.currentSession));
    this.upsertUser(user);
    this.triggerChange('SIGNED_IN');
    return { data: { user }, error: null };
  }

  async signInWithPassword({ email, password }: SignInPasswordArgs): AuthResult<{ user: SupabaseRawUser | null }> {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = this.usersList.find((user) => user.email?.toLowerCase() === normalizedEmail);
    const role = isDemoAdminCredential(email, password) ? 'admin' : normalizeDemoRole(existing?.user_metadata?.role);
    const user = existing ? { ...existing, user_metadata: { ...existing.user_metadata, role } } : DUMMY_USER(email, role);
    this.currentSession = { user, access_token: `mock-token-${user.id}`, expires_in: 3600 };
    localStorage.setItem('beduine_mock_session', JSON.stringify(this.currentSession));
    this.upsertUser(user);
    this.triggerChange('SIGNED_IN');
    return { data: { user }, error: null };
  }

  async signInWithOAuth({ provider }: OAuthArgs): AuthResult<{ user: SupabaseRawUser | null }> {
    const user = DUMMY_USER(`${provider}-user@beduine.com`, 'customer');
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
    const user = DUMMY_USER(`${phone.replace(/\s+/g, '')}@phone.com`, 'customer');
    user.phone = phone;
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
    const updated = {
      ...this.currentSession.user,
      user_metadata: {
        ...this.currentSession.user.user_metadata,
        ...(data || {}),
        role: normalizeDemoRole(data?.role || this.currentSession.user.user_metadata?.role),
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
