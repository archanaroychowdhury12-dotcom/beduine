import { createDemoBackendAdapter } from './demoBackendAdapter';
import { createSupabaseBackendAdapter } from './supabaseBackendAdapter';

export * from './backendContracts';
export * from './backendAdapter';

export const beduineBackend =
  import.meta.env.VITE_BACKEND_MODE === 'production'
    ? createSupabaseBackendAdapter()
    : createDemoBackendAdapter();
