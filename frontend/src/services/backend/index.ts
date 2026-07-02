import { createDemoBackendAdapter } from './demoBackendAdapter';
import { createSupabaseBackendAdapter } from './supabaseBackendAdapter';
import { assertBackendModeAllowed } from '@/config/productionEnv';

export * from './backendContracts';
export * from './backendAdapter';

assertBackendModeAllowed(import.meta.env);

const backendMode = import.meta.env.VITE_BACKEND_MODE;

export const beduineBackend = backendMode === 'production'
  ? createSupabaseBackendAdapter()
  : createDemoBackendAdapter();
