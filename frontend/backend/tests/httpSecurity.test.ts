import { describe, expect, it } from 'vitest';
import { buildCorsHeaders } from '../supabase/functions/_shared/http';

describe('edge function CORS policy', () => {
  it('only returns an allow-origin header for a configured origin', () => {
    const allowed = buildCorsHeaders(
      new Request('https://functions.example.test', {
        headers: { origin: 'https://beduine.example' },
      }),
      'https://beduine.example,https://admin.beduine.example',
    );
    const denied = buildCorsHeaders(
      new Request('https://functions.example.test', {
        headers: { origin: 'https://evil.example' },
      }),
      'https://beduine.example,https://admin.beduine.example',
    );

    expect(allowed['access-control-allow-origin']).toBe('https://beduine.example');
    expect(denied['access-control-allow-origin']).toBeUndefined();
    expect(Object.values(allowed)).not.toContain('*');
  });
});
