import { describe, expect, it } from 'vitest';
import { applyNonWinnerDiscountCredit, validateNonWinnerCreditEligibility } from '../business_logic/services/nonWinnerCreditService';
import type { SupabaseRawUser } from '../business_logic/types';

function user(planName: string, weeklyStatus: string = 'non_winner'): SupabaseRawUser {
  return {
    id: `user-${planName}`,
    email: `${planName}@example.com`,
    user_metadata: {
      planName,
      planType: 'domestic',
      subscriptionStatus: 'active',
      subscription_payment_record: { payment_status: 'success' },
      weekly_participation_cycle_id: 'SUN-001',
      weekly_participation_status: weeklyStatus,
      ledger: [],
    },
  };
}

describe('non-winner credit issue logic', () => {
  it('issues Silver/Gold/Platinum DC counts only to verified non-winners', () => {
    const silver = applyNonWinnerDiscountCredit(user('Silver Plan'), 'SUN-001');
    const gold = applyNonWinnerDiscountCredit(user('Gold Plan'), 'SUN-001');
    const platinum = applyNonWinnerDiscountCredit(user('Platinum Plan'), 'SUN-001');

    expect(silver.issued).toBe(true);
    expect(silver.entry?.amount).toBe(1);
    expect(gold.entry?.amount).toBe(2);
    expect(platinum.entry?.amount).toBe(4);
    expect(platinum.entry?.creditValue).toBe(500);
  });

  it('blocks winners and unverified payments from non-winner DC issue', () => {
    expect(validateNonWinnerCreditEligibility(user('Gold Plan', 'winner'), 'SUN-001').status)
      .toBe('winner_cannot_receive_non_winner_credit');

    const unpaid = user('Gold Plan');
    unpaid.user_metadata!.subscription_payment_record = { payment_status: 'pending' };
    expect(validateNonWinnerCreditEligibility(unpaid, 'SUN-001').status).toBe('payment_not_verified');
  });

  it('blocks duplicate non-winner credit issue for same cycle', () => {
    const first = applyNonWinnerDiscountCredit(user('Silver Plan'), 'SUN-001');
    expect(first.issued).toBe(true);
    const second = applyNonWinnerDiscountCredit(first.user, 'SUN-001');
    expect(second.issued).toBe(false);
    expect(second.eligibility.status).toBe('already_issued');
  });
});
