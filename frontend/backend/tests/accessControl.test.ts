import { describe, expect, it } from 'vitest';
import { canAccessAdmin, canAccessAgentPortal, getUserRole, normalizeRole } from '../business_logic/services/accessControl';

describe('role access control', () => {
  it('supports only admin and customer roles', () => {
    expect(normalizeRole('admin')).toBe('admin');
    expect(normalizeRole('customer')).toBe('customer');
    expect(normalizeRole('agent')).toBe('customer');
    expect(normalizeRole('super_admin')).toBe('customer');
  });

  it('allows only admins into admin/internal operation portals', () => {
    expect(canAccessAdmin({ role: 'admin' })).toBe(true);
    expect(canAccessAdmin({ role: 'customer' })).toBe(false);
    expect(canAccessAdmin({ user_metadata: { role: 'agent' } })).toBe(false);
    expect(canAccessAgentPortal({ role: 'admin' })).toBe(true);
    expect(canAccessAgentPortal({ user_metadata: { role: 'agent' } })).toBe(false);
    expect(getUserRole({ user_metadata: { role: 'agent' } })).toBe('customer');
  });
});
