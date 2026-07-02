type RuntimeEnv = Record<string, string | boolean | undefined>;

const requiredProductionEnv = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

export function isProductionBackendMode(env: RuntimeEnv): boolean {
  return env.VITE_BACKEND_MODE === 'production';
}

export function assertBackendModeAllowed(env: RuntimeEnv): void {
  const mode = env.VITE_BACKEND_MODE;
  if (env.DEV === true && mode === undefined) return;
  if (env.PROD === true && mode !== 'production') {
    throw new Error('A production build requires production backend mode.');
  }
  if (mode !== 'demo' && mode !== 'production') {
    throw new Error('VITE_BACKEND_MODE must be explicitly set to demo or production.');
  }
}

export function getMissingProductionEnv(env: RuntimeEnv): string[] {
  if (!isProductionBackendMode(env)) return [];

  return requiredProductionEnv.filter((key) => {
    const value = env[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });
}

export function shouldUseRealSupabase(env: RuntimeEnv): boolean {
  return isProductionBackendMode(env) && getMissingProductionEnv(env).length === 0;
}

export function assertProductionEnvReady(env: RuntimeEnv): void {
  const missing = getMissingProductionEnv(env);
  if (missing.length > 0) {
    throw new Error(
      `Production backend mode is enabled but required credentials are missing: ${missing.join(', ')}.`,
    );
  }
}

export function getSupabaseFunctionsBaseUrl(env: RuntimeEnv): string {
  const overrideUrl = typeof env.VITE_SUPABASE_FUNCTIONS_URL === 'string'
    ? env.VITE_SUPABASE_FUNCTIONS_URL.trim()
    : '';
  if (overrideUrl) return overrideUrl.replace(/\/$/, '');

  const supabaseUrl = typeof env.VITE_SUPABASE_URL === 'string'
    ? env.VITE_SUPABASE_URL.trim()
    : '';
  return supabaseUrl ? `${supabaseUrl.replace(/\/$/, '')}/functions/v1` : '';
}
