// Mock Supabase client to run the Beduine application completely offline / disconnected from the remote database.
// It persists users and sessions in the browser's localStorage.
// It pre-seeds a demo user and automatically logs them in for demonstration purposes.

type AuthListener = (event: string, session: any) => void;

const DEMO_USER = {
  id: 'demo-user-id-12345',
  email: 'demo@beduine.com',
  phone: '+91 9876543210',
  user_metadata: {
    full_name: 'Arunasish Roy Chowdhury',
    phone: '+91 9876543210',
    city: 'Fulia, Nadia',
    dob: '1998-05-15',
    planName: null,
    planPrice: null,
    planType: null,
    subscriptionStatus: 'inactive',
    real_wallet_balance: 0,
    demo_wallet_balance: 0,
    discount_credits: 0,
    weekly_eligible_entry_count: 0,
    used_credits: 0,
    pending_credits: 0,
    selected_member_benefit_status: 'none',
    ledger: [],
    demo_transactions: [],
    is_demo_user: true,
    preferredLanguage: 'Bengali',
    dietaryPreferences: 'Non-Vegetarian',
    accessibilityRequirements: 'None',
    savedTravelers: [
      { name: 'Sulata Roy Chowdhury', relation: 'Spouse', age: '26' },
      { name: 'Nirmal Roy Chowdhury', relation: 'Father', age: '58' }
    ],
    savedPickups: [
      { name: 'Fulia Bus Stand', address: 'Fulia, Nadia, 741402' },
      { name: 'Kolkata Airport', address: 'Netaji Subhash Chandra Bose Intl Airport, Kolkata' }
    ]
  },
  created_at: new Date().toISOString()
};

class MockAuth {
  private listeners: Set<AuthListener> = new Set();
  private currentSession: any = null;

  constructor() {
    // 1. Seed demo user in list of users if not already present
    const users = this.getUsers();
    if (!users.some(u => u.email === 'demo@beduine.com')) {
      users.push(DEMO_USER);
      this.saveUsers(users);
    }

    // 2. Load session from localStorage, or default to demo user session for demo purposes
    const savedSession = localStorage.getItem('beduine_mock_session');
    if (savedSession) {
      try {
        this.currentSession = JSON.parse(savedSession);
      } catch (e) {
        this.currentSession = null;
      }
    }
    
    // Auto-login with demo user if no session is set
    if (!this.currentSession) {
      this.currentSession = {
        user: DEMO_USER,
        access_token: 'mock-access-token-demo',
        expires_in: 3600
      };
      localStorage.setItem('beduine_mock_session', JSON.stringify(this.currentSession));
    }

    // 3. Ensure all existing demo users are reset to inactive unless already done
    const initializedDemoReset = localStorage.getItem('beduine_demo_initialized_reset');
    if (!initializedDemoReset) {
      const allUsers = this.getUsers();
      const updated = allUsers.map(u => {
        const email = u.email || '';
        const isDemo = u.user_metadata?.is_demo_user || email.includes('demo') || email.includes('test') || email.includes('admin');
        if (isDemo) {
          return {
            ...u,
            user_metadata: {
              ...u.user_metadata,
              planName: null,
              planPrice: null,
              planType: null,
              subscriptionStatus: 'inactive',
              real_wallet_balance: 0,
              demo_wallet_balance: 0,
              discount_credits: 0,
              weekly_eligible_entry_count: 0,
              used_credits: 0,
              pending_credits: 0,
              selected_member_benefit_status: 'none',
              ledger: [],
              demo_transactions: []
            }
          };
        }
        return u;
      });
      this.saveUsers(updated);
      localStorage.setItem('beduine_demo_initialized_reset', 'true');
      
      if (this.currentSession?.user) {
        const curEmail = this.currentSession.user.email || '';
        const isDemo = this.currentSession.user.user_metadata?.is_demo_user || curEmail.includes('demo') || curEmail.includes('test') || curEmail.includes('admin');
        if (isDemo) {
          this.currentSession.user = updated.find(u => u.id === this.currentSession.user.id) || this.currentSession.user;
          this.saveSession(this.currentSession);
        }
      }
    }
  }

  private triggerChange(event: string) {
    this.listeners.forEach((listener) => {
      try {
        listener(event, this.currentSession);
      } catch (e) {
        console.error("Error triggering auth listener:", e);
      }
    });
  }

  private saveSession(session: any) {
    this.currentSession = session;
    if (session) {
      localStorage.setItem('beduine_mock_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('beduine_mock_session');
    }
  }

  private getUsers(): any[] {
    const usersStr = localStorage.getItem('beduine_mock_users');
    if (!usersStr) return [];
    try {
      return JSON.parse(usersStr);
    } catch (e) {
      return [];
    }
  }

  private saveUsers(users: any[]) {
    localStorage.setItem('beduine_mock_users', JSON.stringify(users));
  }

  async getSession(): Promise<any> {
    return { data: { session: this.currentSession }, error: null as any };
  }

  onAuthStateChange(callback: AuthListener) {
    this.listeners.add(callback);
    // Trigger callback immediately with initial session
    callback('INITIAL_SESSION', this.currentSession);
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners.delete(callback);
          },
        },
      },
    };
  }

  async signUp({ email, password: _password, options }: any): Promise<any> {
    const users = this.getUsers();
    let existingUser = users.find((u) => u.email === email);
    
    const initialMetadata = {
      planName: null,
      planPrice: null,
      planType: null,
      subscriptionStatus: 'inactive',
      real_wallet_balance: 0,
      demo_wallet_balance: 0,
      discount_credits: 0,
      weekly_eligible_entry_count: 0,
      used_credits: 0,
      pending_credits: 0,
      selected_member_benefit_status: 'none',
      ledger: [],
      demo_transactions: [],
      is_demo_user: email.includes('demo') || email.includes('test') || email.includes('admin'),
      ...(options?.data || {})
    };

    // Strict zero-state overrides for signup
    initialMetadata.planName = null;
    initialMetadata.planPrice = null;
    initialMetadata.planType = null;
    initialMetadata.subscriptionStatus = 'inactive';
    initialMetadata.real_wallet_balance = 0;
    initialMetadata.demo_wallet_balance = 0;
    initialMetadata.discount_credits = 0;
    initialMetadata.weekly_eligible_entry_count = 0;
    initialMetadata.used_credits = 0;
    initialMetadata.pending_credits = 0;
    initialMetadata.selected_member_benefit_status = 'none';
    initialMetadata.ledger = [];
    initialMetadata.demo_transactions = [];

    if (existingUser) {
      existingUser.user_metadata = { ...existingUser.user_metadata, ...initialMetadata };
    } else {
      existingUser = {
        id: 'mock-user-' + Math.random().toString(36).substring(2, 9),
        email,
        phone: options?.data?.phone || '',
        user_metadata: initialMetadata,
        created_at: new Date().toISOString(),
      };
      users.push(existingUser);
    }
    this.saveUsers(users);

    const session = {
      user: existingUser,
      access_token: 'mock-access-token',
      expires_in: 3600,
    };
    this.saveSession(session);
    this.triggerChange('SIGNED_IN');

    return { data: { user: existingUser }, error: null as any };
  }

  async signInWithPassword({ email, password: _password }: any): Promise<any> {
    const users = this.getUsers();
    let user = users.find((u) => u.email === email);
    
    if (!user) {
      user = {
        id: 'mock-user-' + Math.random().toString(36).substring(2, 9),
        email,
        phone: '',
        user_metadata: {
          full_name: email.split('@')[0],
          city: 'Fulia',
          planName: null,
          planPrice: null,
          planType: null,
          subscriptionStatus: 'inactive',
          real_wallet_balance: 0,
          demo_wallet_balance: 0,
          discount_credits: 0,
          weekly_eligible_entry_count: 0,
          used_credits: 0,
          pending_credits: 0,
          selected_member_benefit_status: 'none',
          ledger: [],
          demo_transactions: [],
          is_demo_user: email.includes('demo') || email.includes('test') || email.includes('admin'),
          dob: '1995-01-01',
          preferredLanguage: 'English',
          dietaryPreferences: 'None',
          accessibilityRequirements: 'None',
          savedTravelers: [],
          savedPickups: []
        },
        created_at: new Date().toISOString(),
      };
      users.push(user);
      this.saveUsers(users);
    }

    const session = {
      user,
      access_token: 'mock-access-token',
      expires_in: 3600,
    };
    this.saveSession(session);
    this.triggerChange('SIGNED_IN');

    return { data: { user }, error: null as any };
  }

  async signInWithOAuth({ provider, options: _options }: any): Promise<any> {
    const mockEmail = `${provider || 'oauth'}-user@beduine.com`;
    return this.signInWithPassword({ email: mockEmail });
  }

  async signInWithOtp({ phone: _phone }: any): Promise<any> {
    return { data: null, error: null as any };
  }

  async verifyOtp({ phone, token: _token, type: _type }: any): Promise<any> {
    const users = this.getUsers();
    let user = users.find((u) => u.phone === phone || u.email === `${phone}@phone.com`);
    
    if (!user) {
      user = {
        id: 'mock-user-' + Math.random().toString(36).substring(2, 9),
        email: `${phone}@phone.com`,
        phone: phone,
        user_metadata: {
          full_name: '',
          phone: phone,
          city: 'Fulia',
          planName: null,
          planPrice: null,
          planType: null,
          subscriptionStatus: 'inactive',
          real_wallet_balance: 0,
          demo_wallet_balance: 0,
          discount_credits: 0,
          weekly_eligible_entry_count: 0,
          used_credits: 0,
          pending_credits: 0,
          selected_member_benefit_status: 'none',
          ledger: [],
          demo_transactions: [],
          is_demo_user: phone.includes('demo') || phone.includes('test') || phone.includes('admin'),
          dob: '1995-01-01',
          preferredLanguage: 'English',
          dietaryPreferences: 'None',
          accessibilityRequirements: 'None',
          savedTravelers: [],
          savedPickups: []
        },
        created_at: new Date().toISOString(),
      };
      users.push(user);
      this.saveUsers(users);
    }

    const session = {
      user,
      access_token: 'mock-access-token',
      expires_in: 3600,
    };
    this.saveSession(session);
    this.triggerChange('SIGNED_IN');

    return { data: { user }, error: null as any };
  }

  async updateUser({ data }: any): Promise<any> {
    if (!this.currentSession || !this.currentSession.user) {
      return { data: null, error: { message: "No active session found" } as any };
    }

    const user = this.currentSession.user;
    user.user_metadata = { ...user.user_metadata, ...(data || {}) };
    if (data.email) user.email = data.email;
    if (data.phone) user.phone = data.phone;

    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
    }

    this.saveSession({ ...this.currentSession, user });
    this.triggerChange('USER_UPDATED');

    return { data: { user }, error: null as any };
  }

  async signOut(): Promise<any> {
    this.saveSession(null);
    this.triggerChange('SIGNED_OUT');
    return { error: null as any };
  }

  // Administrative and Demo helper functions
  getUsersList(): any[] {
    return this.getUsers();
  }

  saveUsersList(users: any[]) {
    this.saveUsers(users);
    // Sync current session if modified
    if (this.currentSession?.user) {
      const updatedUser = users.find(u => u.id === this.currentSession.user.id);
      if (updatedUser) {
        this.currentSession.user = updatedUser;
        this.saveSession(this.currentSession);
        this.triggerChange('USER_UPDATED');
      }
    }
  }

  resetDemoAccounts() {
    const users = this.getUsers();
    const updatedUsers = users.map(u => {
      const email = u.email || '';
      const isDemo = u.user_metadata?.is_demo_user || email.includes('demo') || email.includes('test') || email.includes('admin');
      if (isDemo) {
        return {
          ...u,
          user_metadata: {
            ...u.user_metadata,
            planName: null,
            planPrice: null,
            planType: null,
            subscriptionStatus: 'inactive',
            real_wallet_balance: 0,
            demo_wallet_balance: 0,
            discount_credits: 0,
            weekly_eligible_entry_count: 0,
            used_credits: 0,
            pending_credits: 0,
            selected_member_benefit_status: 'none',
            ledger: [],
            demo_transactions: []
          }
        };
      }
      return u;
    });
    this.saveUsers(updatedUsers);

    // Also update current session if the current user is a demo user
    if (this.currentSession?.user) {
      const curEmail = this.currentSession.user.email || '';
      const isDemo = this.currentSession.user.user_metadata?.is_demo_user || curEmail.includes('demo') || curEmail.includes('test') || curEmail.includes('admin');
      if (isDemo) {
        this.currentSession.user = updatedUsers.find(u => u.id === this.currentSession.user.id) || this.currentSession.user;
        this.saveSession(this.currentSession);
      }
    }
    this.triggerChange('USER_UPDATED');
  }
}

export const supabase = {
  auth: new MockAuth()
};
