/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_DEMO_WALLET: string;
  readonly VITE_BACKEND_MODE?: 'demo' | 'production';
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPABASE_FUNCTIONS_URL?: string;
  readonly VITE_PAYMENT_PROVIDER?: 'mock' | 'razorpay' | 'cashfree' | 'phonepe' | 'stripe';
  readonly VITE_ALLOW_CLIENT_ROLE_SEEDING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
