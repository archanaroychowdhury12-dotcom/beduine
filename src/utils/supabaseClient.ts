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
    planName: 'Gold',
    planPrice: '₹799/yr',
    planType: 'gold',
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
    
    if (existingUser) {
      existingUser.user_metadata = { ...existingUser.user_metadata, ...(options?.data || {}) };
    } else {
      existingUser = {
        id: 'mock-user-' + Math.random().toString(36).substring(2, 9),
        email,
        phone: options?.data?.phone || '',
        user_metadata: options?.data || {},
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
      // Auto-register convenience: if user doesn't exist, create a mock one so they can test easily
      user = {
        id: 'mock-user-' + Math.random().toString(36).substring(2, 9),
        email,
        phone: '',
        user_metadata: {
          full_name: email.split('@')[0],
          city: 'Fulia',
          planName: 'Gold',
          planPrice: '₹799/yr',
          planType: 'gold',
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
          planName: 'Gold',
          planPrice: '₹799/yr',
          planType: 'gold',
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
}

export const supabase = {
  auth: new MockAuth()
};
