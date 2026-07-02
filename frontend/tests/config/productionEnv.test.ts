import { describe, expect, it } from 'vitest';
import {
  getMissingProductionEnv,
  getSupabaseFunctionsBaseUrl,
  assertBackendModeAllowed,
  shouldUseRealSupabase,
} from '../../src/config/productionEnv';

describe('production environment setup', () => {
  it('requires Supabase credentials in production backend mode', () => {
    expect(getMissingProductionEnv({ VITE_BACKEND_MODE: 'production' })).toEqual([
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
    ]);
  });

  it('uses real Supabase when production backend credentials are present', () => {
    const env = {
      VITE_BACKEND_MODE: 'production',
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'anon-key',
    };

    expect(getMissingProductionEnv(env)).toEqual([]);
    expect(shouldUseRealSupabase(env)).toBe(true);
  });

  it('derives the default Supabase Edge Functions URL from the project URL', () => {
    expect(getSupabaseFunctionsBaseUrl({
      VITE_SUPABASE_URL: 'https://example.supabase.co/',
    })).toBe('https://example.supabase.co/functions/v1');
  });

  it('allows an explicit Supabase Edge Functions URL override', () => {
    expect(getSupabaseFunctionsBaseUrl({
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_FUNCTIONS_URL: 'https://functions.example.com',
    })).toBe('https://functions.example.com');
  });

  it('fails closed when a production build is not configured for production backend mode', () => {
    expect(() => assertBackendModeAllowed({ VITE_BACKEND_MODE: 'demo', PROD: true }))
      .toThrow(/production backend mode/i);
    expect(() => assertBackendModeAllowed({ VITE_BACKEND_MODE: undefined, PROD: true }))
      .toThrow(/production backend mode/i);
    expect(() => assertBackendModeAllowed({ VITE_BACKEND_MODE: 'demo', DEV: true }))
      .not.toThrow();
  });
});
