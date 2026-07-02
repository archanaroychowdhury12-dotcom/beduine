import { describe, expect, it } from 'vitest';
import { canAccessAdmin, canUseDemoTools, getUserRole, normalizeRole } from '../../src/services/accessControl';

describe('frontend access control', () => {
  it('allows only admin/customer roles and falls back invalid roles to customer', () => {
    expect(normalizeRole('admin')).toBe('admin');
    expect(normalizeRole('customer')).toBe('customer');
    expect(normalizeRole('agent')).toBe('customer');
    expect(normalizeRole('anything')).toBe('customer');
  });

  it('does not infer admin access from email text', () => {
    expect(canAccessAdmin({ email: 'random-admin@example.com', role: 'customer' })).toBe(false);
    expect(canAccessAdmin({ email: 'admin@beduine.com', role: 'customer' })).toBe(false);
    expect(canAccessAdmin({ email: 'admin@beduine.com', role: 'admin' })).toBe(true);
  });

  it('reads role from metadata safely', () => {
    expect(getUserRole({ user_metadata: { role: 'agent' as never } })).toBe('customer');
    expect(getUserRole({ user_metadata: { role: 'admin' } })).toBe('admin');
  });

  it('enables demo tools only for admins or explicit demo users', () => {
    expect(canUseDemoTools({ role: 'admin' })).toBe(true);
    expect(canUseDemoTools({ role: 'customer', is_demo_user: true })).toBe(true);
    expect(canUseDemoTools({ role: 'customer', is_demo_user: false })).toBe(false);
  });
});
