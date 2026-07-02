interface ImportMetaEnv {
  readonly VITE_ENABLE_DEMO_WALLET?: string;
  readonly VITE_PAYMENT_PROVIDER?: string;
  readonly VITE_ALLOW_CLIENT_ROLE_SEEDING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
