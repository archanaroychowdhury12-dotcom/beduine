import { describe, it, expect, beforeEach, vi } from 'vitest';
import { demoWalletService } from '../../src/services/demoWalletService';
import { supabase } from '../../src/utils/supabaseClient';

async function createTestUser() {
  const email = `test-${Date.now()}-${Math.random().toString(36).slice(2)}@beduine.com`;
  const { data } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: { data: { full_name: 'Test User' } },
  });
  return data.user!.id;
}

describe('demoWalletService.checkoutSubscription', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_ENABLE_DEMO_WALLET', 'true');
  });

  it('issues domestic credits for domestic Silver', async () => {
    const userId = await createTestUser();
    await demoWalletService.addDemoBalance(userId, 1000);
    const result = await demoWalletService.checkoutSubscription(userId, 'Silver', 'demo_wallet');
    expect(result.success).toBe(true);
    const ledger = result.user.user_metadata.ledger;
    const dc = ledger.find((e: any) => e.creditCategory === 'domestic');
    expect(dc.amount).toBe(1);
    expect(dc.creditValue).toBe(500);
    expect(dc.usableFor).toBe('domestic_only');
  });

  it('issues international credits for international Platinum', async () => {
    const userId = await createTestUser();
    await demoWalletService.addDemoBalance(userId, 20000);
    const result = await demoWalletService.checkoutSubscription(userId, 'Platinum_Int', 'demo_wallet');
    expect(result.success).toBe(true);
    const ledger = result.user.user_metadata.ledger;
    const dc = ledger.find((e: any) => e.creditCategory === 'international');
    expect(dc.amount).toBe(4);
    expect(dc.creditValue).toBe(5000);
    expect(dc.amount * dc.creditValue).toBe(20000);
    expect(dc.usableFor).toBe('international_only');
  });

  it('fails for invalid plan', async () => {
    const userId = await createTestUser();
    await demoWalletService.addDemoBalance(userId, 1000);
    const result = await demoWalletService.checkoutSubscription(userId, 'Diamond', 'demo_wallet');
    expect(result.success).toBe(false);
  });

  it('issues 1 travel reward credit with any plan', async () => {
    const userId = await createTestUser();
    await demoWalletService.addDemoBalance(userId, 1000);
    const result = await demoWalletService.checkoutSubscription(userId, 'Silver', 'demo_wallet');
    const trc = result.user.user_metadata.ledger.find((e: any) => e.creditCategory === 'travel_reward');
    expect(trc).toBeDefined();
    expect(trc.amount).toBe(1);
  });
});

describe('Beduine Account Default States & Flows', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_ENABLE_DEMO_WALLET', 'true');
  });

  it('Test 1: Fresh Login starts completely clean', async () => {
    const email = `test-${Date.now()}@beduine.com`;
    const { data } = await supabase.auth.signUp({
      email,
      password: 'password123',
      options: { data: { full_name: 'Test User' } },
    });
    const user = data.user!;
    
    expect(user.user_metadata.planName).toBeNull();
    expect(user.user_metadata.planPrice).toBeNull();
    expect(user.user_metadata.planType).toBeNull();
    expect(user.user_metadata.subscriptionStatus).toBe('inactive');
    expect(user.user_metadata.subscription_payment_record).toBeNull();
    expect(user.user_metadata.discount_credits).toBe(0);
    expect(user.user_metadata.ledger || []).toHaveLength(0);
  });

  it('Test 2: Add Demo Balance only increases balance, does not activate subscription/credits', async () => {
    const email = `test-${Date.now()}@beduine.com`;
    const { data } = await supabase.auth.signUp({
      email,
      password: 'password123',
      options: { data: { full_name: 'Test User' } },
    });
    const userId = data.user!.id;

    const res = await demoWalletService.addDemoBalance(userId, 499);
    expect(res.success).toBe(true);
    expect(res.balance).toBe(499);

    const auth = (supabase.auth as any);
    const updatedUser = auth.getUsersList().find((u: any) => u.id === userId);

    expect(updatedUser.user_metadata.demo_wallet_balance).toBe(499);
    expect(updatedUser.user_metadata.subscriptionStatus).toBe('inactive');
    expect(updatedUser.user_metadata.planName).toBeNull();
    expect(updatedUser.user_metadata.discount_credits).toBe(0);
    expect(updatedUser.user_metadata.ledger || []).toHaveLength(0);
  });

  it('Test 3: Demo purchase completes successfully with sufficient balance', async () => {
    const email = `test-${Date.now()}@beduine.com`;
    const { data } = await supabase.auth.signUp({
      email,
      password: 'password123',
      options: { data: { full_name: 'Test User' } },
    });
    const userId = data.user!.id;

    await demoWalletService.addDemoBalance(userId, 499);

    const result = await demoWalletService.checkoutSubscription(userId, 'Silver', 'demo_wallet');
    expect(result.success).toBe(true);
    expect(result.user.user_metadata.demo_wallet_balance).toBe(0);
    expect(result.user.user_metadata.subscriptionStatus).toBe('active');
    expect(result.user.user_metadata.planName).toBe('Silver Domestic');
    expect(result.user.user_metadata.subscription_payment_record).toBeDefined();
    expect(result.user.user_metadata.subscription_payment_record.payment_status).toBe('success');

    const ledger = result.user.user_metadata.ledger;
    const trc = ledger.find((e: any) => e.creditCategory === 'travel_reward');
    const dc = ledger.find((e: any) => e.creditCategory === 'domestic');
    expect(trc).toBeDefined();
    expect(trc.amount).toBe(1);
    expect(dc).toBeDefined();
    expect(dc.amount).toBe(1);
  });

  it('Test 4: Insufficient balance blocks purchase and does not activate subscription', async () => {
    const email = `test-${Date.now()}@beduine.com`;
    const { data } = await supabase.auth.signUp({
      email,
      password: 'password123',
      options: { data: { full_name: 'Test User' } },
    });
    const userId = data.user!.id;

    const result = await demoWalletService.checkoutSubscription(userId, 'Gold', 'demo_wallet');
    expect(result.success).toBe(false);
    expect(result.message).toContain('enough demo balance');

    const auth = (supabase.auth as any);
    const updatedUser = auth.getUsersList().find((u: any) => u.id === userId);
    expect(updatedUser.user_metadata.subscriptionStatus).toBe('inactive');
    expect(updatedUser.user_metadata.planName).toBeNull();
    expect(updatedUser.user_metadata.ledger || []).toHaveLength(0);
  });
});
