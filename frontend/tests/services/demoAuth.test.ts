import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SupabaseRawUser } from '@/types';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type DemoAuth = {
  getUsersList(): SupabaseRawUser[];
  signInWithPassword(input: {
    email: string;
    password: string;
  }): Promise<{ data: { user: SupabaseRawUser | null }; error: { message: string } | null }>;
  signUp(input: {
    email: string;
    password: string;
    options?: { data?: Record<string, unknown> };
  }): Promise<{ data: { user: SupabaseRawUser | null }; error: { message: string } | null }>;
  signOut(): Promise<{ error: { message: string } | null }>;
};

async function loadDemoAuth(): Promise<DemoAuth> {
  vi.resetModules();
  const module = await import('@/utils/supabaseClient');
  expect(module.isRealSupabaseConnected).toBe(false);
  return module.supabase.auth as unknown as DemoAuth;
}

describe('demo authentication accounts', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('seeds one customer and one admin account without plaintext password metadata', async () => {
    const auth = await loadDemoAuth();
    const accounts = auth.getUsersList()
      .filter((user) => user.user_metadata?.is_demo_user)
      .sort((left, right) => String(left.email).localeCompare(String(right.email)));

    expect(accounts.map((user) => [user.email, user.user_metadata?.role])).toEqual([
      ['admin@beduine.com', 'admin'],
      ['demo@beduine.com', 'customer'],
    ]);
    expect(accounts.every((user) => !user.user_metadata?.auth_password)).toBe(true);
  });

  it('accepts the fixed demo credentials and rejects wrong or unknown credentials', async () => {
    const auth = await loadDemoAuth();

    const customer = await auth.signInWithPassword({
      email: 'demo@beduine.com',
      password: 'beduine123',
    });
    expect(customer.error).toBeNull();
    expect(customer.data.user?.user_metadata?.role).toBe('customer');
    await auth.signOut();

    const admin = await auth.signInWithPassword({
      email: 'admin@beduine.com',
      password: 'admin123',
    });
    expect(admin.error).toBeNull();
    expect(admin.data.user?.user_metadata?.role).toBe('admin');

    const wrongPassword = await auth.signInWithPassword({
      email: 'admin@beduine.com',
      password: 'wrong-password',
    });
    expect(wrongPassword.data.user).toBeNull();
    expect(wrongPassword.error?.message).toBe('Invalid email or password.');

    const unknown = await auth.signInWithPassword({
      email: 'unknown@example.com',
      password: 'password123',
    });
    expect(unknown.data.user).toBeNull();
    expect(unknown.error?.message).toBe('No account found for this email.');
  });

  it('creates registered demo users as customers and validates their password', async () => {
    const auth = await loadDemoAuth();
    const registration = await auth.signUp({
      email: 'new.customer@example.com',
      password: 'customer123',
      options: { data: { full_name: 'New Customer', role: 'admin' } },
    });

    expect(registration.error).toBeNull();
    expect(registration.data.user?.user_metadata?.role).toBe('customer');
    expect(registration.data.user?.user_metadata?.auth_password).toBeUndefined();

    await auth.signOut();
    const wrongPassword = await auth.signInWithPassword({
      email: 'new.customer@example.com',
      password: 'not-the-password',
    });
    expect(wrongPassword.data.user).toBeNull();

    const login = await auth.signInWithPassword({
      email: 'new.customer@example.com',
      password: 'customer123',
    });
    expect(login.error).toBeNull();
    expect(login.data.user?.email).toBe('new.customer@example.com');
  });

  it('offers one-click seeded account fill only behind the demo-mode guard', () => {
    const customerLogin = readFileSync(resolve(process.cwd(), 'src/LoginPage.tsx'), 'utf8');
    const adminLogin = readFileSync(resolve(process.cwd(), 'src/AdminLoginPage.tsx'), 'utf8');

    expect(customerLogin).toContain('!isRealSupabaseConnected');
    expect(customerLogin).toContain('Use Demo Customer');
    expect(adminLogin).toContain('!isRealSupabaseConnected');
    expect(adminLogin).toContain('Use Demo Admin');
  });

  it('runs demo subscription checkout with the same one-TRC entitlement rule', async () => {
    vi.resetModules();
    const { supabase } = await import('@/utils/supabaseClient');
    const { demoWalletService } = await import('@/services/demoWalletService');
    const auth = supabase.auth as unknown as DemoAuth;
    const login = await auth.signInWithPassword({
      email: 'demo@beduine.com',
      password: 'beduine123',
    });

    const result = await demoWalletService.checkoutSubscription(
      login.data.user!.id,
      'domestic_gold',
      'demo_wallet',
    );

    expect(result.success).toBe(true);
    expect(result.user?.user_metadata?.subscriptionStatus).toBe('active');
    expect(result.user?.user_metadata?.planName).toBe('Gold Plan');
    expect(result.user?.user_metadata?.demo_wallet_balance).toBe(4201);
    expect(result.user?.user_metadata?.weekly_eligible_entry_count).toBe(1);
  });
});
