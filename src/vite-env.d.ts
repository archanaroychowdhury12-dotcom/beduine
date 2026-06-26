/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_DEMO_WALLET: string;
  // Add other VITE_ env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
