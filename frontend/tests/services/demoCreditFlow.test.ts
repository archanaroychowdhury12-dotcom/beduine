import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SupabaseRawUser } from '@/types';

type DemoAuth = {
  getUsersList(): SupabaseRawUser[];
  signInWithPassword(input: {
    email: string;
    password: string;
  }): Promise<{ data: { user: SupabaseRawUser | null }; error: { message: string } | null }>;
  signOut(): Promise<{ error: { message: string } | null }>;
};

async function loadDemoModules() {
  vi.resetModules();
  const [{ supabase }, { demoWalletService }, { createDemoBackendAdapter }] = await Promise.all([
    import('@/utils/supabaseClient'),
    import('@/services/demoWalletService'),
    import('@/services/backend/demoBackendAdapter'),
  ]);
  return {
    auth: supabase.auth as unknown as DemoAuth,
    demoWalletService,
    backend: createDemoBackendAdapter(),
  };
}

describe('persistent demo credit flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds admin-issued demo balance to the selected customer, not the admin session', async () => {
    const { auth, demoWalletService } = await loadDemoModules();
    await auth.signInWithPassword({
      email: 'admin@beduine.com',
      password: 'admin123',
    });
    const customer = auth.getUsersList().find((user) => user.email === 'demo@beduine.com')!;

    const result = await demoWalletService.addDemoBalance(customer.id, 1000);

    const users = auth.getUsersList();
    expect(result.success).toBe(true);
    expect(users.find((user) => user.id === customer.id)?.user_metadata?.demo_wallet_balance).toBe(6000);
    expect(users.find((user) => user.email === 'admin@beduine.com')?.user_metadata?.demo_wallet_balance).toBe(0);
  });

  it('shows subscription TRC and participation changes in the customer dashboard', async () => {
    const { auth, demoWalletService, backend } = await loadDemoModules();
    const login = await auth.signInWithPassword({
      email: 'demo@beduine.com',
      password: 'beduine123',
    });
    await demoWalletService.checkoutSubscription(
      login.data.user!.id,
      'domestic_gold',
      'demo_wallet',
    );

    const subscribed = await backend.getCustomerDashboard();
    expect(subscribed.profile.email).toBe('demo@beduine.com');
    expect(subscribed.subscription?.planName).toBe('Gold Plan');
    expect(subscribed.trc.available).toBe(1);

    await backend.participateInWeeklyDraw();
    const participating = await backend.getCustomerDashboard();
    expect(participating.trc.available).toBe(0);
    expect(participating.trc.locked).toBe(1);
    expect(participating.drawEntries).toHaveLength(1);
  });

  it('persists plan-wise non-winner discount credits and blocks duplicate issuance', async () => {
    const { auth, demoWalletService, backend } = await loadDemoModules();
    const customerLogin = await auth.signInWithPassword({
      email: 'demo@beduine.com',
      password: 'beduine123',
    });
    await demoWalletService.checkoutSubscription(
      customerLogin.data.user!.id,
      'domestic_gold',
      'demo_wallet',
    );
    const participation = await backend.participateInWeeklyDraw();
    await auth.signOut();
    await auth.signInWithPassword({
      email: 'admin@beduine.com',
      password: 'admin123',
    });

    const issuance = await backend.issueNonWinnerCredits(participation.cycleId);
    const duplicate = await backend.issueNonWinnerCredits(participation.cycleId);

    expect(issuance).toMatchObject({ issuedUsers: 1, issuedUnits: 2, duplicate: false });
    expect(duplicate).toMatchObject({ issuedUsers: 0, issuedUnits: 0, duplicate: true });

    await auth.signOut();
    await auth.signInWithPassword({
      email: 'demo@beduine.com',
      password: 'beduine123',
    });
    const dashboard = await backend.getCustomerDashboard();
    expect(dashboard.discountCredits.availableUnits).toHaveLength(2);
    expect(dashboard.discountCredits.availableUnits.map((unit) => unit.creditValue)).toEqual([500, 500]);
  });
});
