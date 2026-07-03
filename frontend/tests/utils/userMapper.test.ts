import { afterEach, describe, expect, it } from 'vitest';
import { mapSupabaseUser } from '../../src/utils/userMapper';
import { ProfileRecord, SupabaseRawUser } from '../../src/types';

const originalDemoWalletFlag = import.meta.env.VITE_ENABLE_DEMO_WALLET;

afterEach(() => {
  import.meta.env.VITE_ENABLE_DEMO_WALLET = originalDemoWalletFlag;
});

describe('mapSupabaseUser', () => {
  it('uses server UID and server role', () => {
    const result = mapSupabaseUser(
      {
        id: 'auth-1',
        email: 'rahul@example.com',
        user_metadata: { role: 'admin' },
      } as SupabaseRawUser,
      {
        uid: 'BDU-2026-RHLSEN-4821',
        role: 'customer',
        full_name: 'Rahul Sen',
        phone: '+91 9876543210',
        city: 'Kolkata',
      } as ProfileRecord,
    );

    expect(result.uid).toBe('BDU-2026-RHLSEN-4821');
    expect(result.memberId).toBe('BDU-2026-RHLSEN-4821');
    expect(result.role).toBe('customer');
    expect(result.fullName).toBe('Rahul Sen');
    expect(result.mobile).toBe('+91 9876543210');
    expect(result.city).toBe('Kolkata');
  });

  it('does not manufacture a production UID', () => {
    expect(() =>
      mapSupabaseUser(
        {
          id: 'auth-1',
          email: 'rahul@example.com',
          user_metadata: {},
        } as SupabaseRawUser,
        null,
      ),
    ).toThrow('Customer profile is not available');
  });

  it('builds a demo profile only for explicit demo users when demo mode is enabled', () => {
    import.meta.env.VITE_ENABLE_DEMO_WALLET = 'true';

    const result = mapSupabaseUser(
      {
        id: 'demo-user-1',
        email: 'demo@beduine.com',
        phone: '+91 9999999999',
        user_metadata: {
          uid: 'BDU-2026-DEMO99-1001',
          full_name: 'Demo Traveler',
          city: 'Demo City',
          is_demo_user: true,
        },
      } as SupabaseRawUser,
      null,
    );

    expect(result.uid).toBe('BDU-2026-DEMO99-1001');
    expect(result.role).toBe('customer');
    expect(result.is_demo_user).toBe(true);
    expect(result.city).toBe('Demo City');
  });

  it('preserves the seeded admin role in an explicit demo profile', () => {
    import.meta.env.VITE_ENABLE_DEMO_WALLET = 'true';

    const result = mapSupabaseUser(
      {
        id: 'demo-admin-id-90001',
        email: 'admin@beduine.com',
        user_metadata: {
          uid: 'BDU-DEMO-ADMIN-001',
          full_name: 'Beduine Admin',
          is_demo_user: true,
          role: 'admin',
        },
      } as SupabaseRawUser,
      null,
    );

    expect(result.role).toBe('admin');
  });

  it('does not seed demo travelers for a server-backed customer profile', () => {
    const result = mapSupabaseUser(
      {
        id: 'real-user-1',
        email: 'rahul.sen@example.com',
        user_metadata: {},
      } as SupabaseRawUser,
      {
        id: 'real-user-1',
        uid: 'BDU-2026-REAL01-4821',
        role: 'customer',
        full_name: 'Rahul Sen',
        email: 'rahul.sen@example.com',
        phone: '+91 9876543210',
        city: 'Kolkata',
        is_demo_user: false,
      },
    );

    expect(result.savedTravelers).toEqual([]);
    expect(result.savedPickups).toEqual([]);
  });

  it('keeps generated demo UIDs in the canonical format', () => {
    import.meta.env.VITE_ENABLE_DEMO_WALLET = 'true';

    const result = mapSupabaseUser(
      {
        id: 'demo-user-without-numeric-id',
        email: 'demo@beduine.com',
        user_metadata: { is_demo_user: true },
      } as SupabaseRawUser,
      null,
    );

    expect(result.uid).toMatch(/^BDU-[0-9]{4}-[A-Z0-9]{6}-[0-9]{4}$/);
  });
});
