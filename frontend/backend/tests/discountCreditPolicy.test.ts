import { describe, expect, it } from 'vitest';
import type { CreditLedgerEntry, Traveler } from '../business_logic/types';
import { validateDiscountCreditPolicy } from '../business_logic/credits/discountCreditPolicy';

function issuedCredits(category: 'domestic' | 'international', amount: number): CreditLedgerEntry[] {
  return [{
    id: `issued-${category}`,
    date: '01 Jan 2026',
    type: 'issued',
    creditType: 'discount',
    amount,
    reason: 'test credit',
    creditCategory: category,
    creditValue: category === 'domestic' ? 500 : 5000,
    usableFor: category === 'domestic' ? 'domestic_only' : 'international_only',
  }];
}

const travelers: Traveler[] = [
  { firstName: 'A', lastName: 'One', email: 'a@example.com', phone: '1', isLead: true, ageGroup: 'Adult' },
  { firstName: 'B', lastName: 'Two', email: 'b@example.com', phone: '2', isLead: false, ageGroup: 'Adult' },
];

describe('discount credit policy', () => {
  it('allows 1 domestic DC per person at ₹500 each', () => {
    const result = validateDiscountCreditPolicy({
      operation: 'booking_discount',
      requestedCredits: 2,
      tourCategory: 'domestic',
      creditCategory: 'domestic',
      ledger: issuedCredits('domestic', 2),
      travelers,
    });

    expect(result.valid).toBe(true);
    expect(result.creditValue).toBe(500);
    expect(result.totalDiscount).toBe(1000);
  });

  it('allows 1 international DC per person at ₹5000 each', () => {
    const result = validateDiscountCreditPolicy({
      operation: 'booking_discount',
      requestedCredits: 1,
      tourCategory: 'international',
      creditCategory: 'international',
      ledger: issuedCredits('international', 1),
      travelers,
    });

    expect(result.valid).toBe(true);
    expect(result.creditValue).toBe(5000);
    expect(result.totalDiscount).toBe(5000);
  });

  it('blocks wrong category, cash redemption, transfers, sales, and multiple DC on same person', () => {
    expect(validateDiscountCreditPolicy({
      operation: 'booking_discount',
      requestedCredits: 1,
      tourCategory: 'international',
      creditCategory: 'domestic',
      ledger: issuedCredits('domestic', 1),
      travelers,
    }).valid).toBe(false);

    expect(validateDiscountCreditPolicy({
      operation: 'cash_redeem',
      requestedCredits: 1,
      tourCategory: 'domestic',
      creditCategory: 'domestic',
      ledger: issuedCredits('domestic', 1),
      travelers,
    }).valid).toBe(false);

    expect(validateDiscountCreditPolicy({
      operation: 'transfer',
      requestedCredits: 1,
      tourCategory: 'domestic',
      creditCategory: 'domestic',
      ledger: issuedCredits('domestic', 1),
      travelers,
    }).valid).toBe(false);

    const samePersonTwice = validateDiscountCreditPolicy({
      operation: 'booking_discount',
      requestedCredits: 2,
      tourCategory: 'domestic',
      creditCategory: 'domestic',
      ledger: issuedCredits('domestic', 2),
      travelers,
      travelerCreditAssignments: [{ travelerKey: 'a@example.com', credits: 2 }, { travelerKey: 'b@example.com', credits: 0 }],
    });
    expect(samePersonTwice.valid).toBe(false);
    expect(samePersonTwice.error).toMatch(/Multiple Discount Credits/);
  });
});
