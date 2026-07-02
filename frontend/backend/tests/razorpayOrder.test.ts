import { describe, expect, it } from 'vitest';
import { buildRazorpayOrder } from '../business_logic/payment/razorpayOrder.service';

describe('Razorpay order construction', () => {
  it('converts authoritative INR to paise and ignores client amount', () => {
    expect(buildRazorpayOrder({
      purpose: 'subscription',
      referenceId: 'domestic_gold',
      authoritativeAmountRupees: 799,
      clientAmountRupees: 1,
    })).toMatchObject({
      amount: 79_900,
      currency: 'INR',
      notes: {
        purpose: 'subscription',
        referenceId: 'domestic_gold',
      },
    });
  });

  it('limits the receipt to 40 characters', () => {
    const order = buildRazorpayOrder({
      purpose: 'tour_booking',
      referenceId: 'BOOKING-ID-WITH-A-LONG-SUFFIX-1234567890',
      authoritativeAmountRupees: 4_750,
    });

    expect(order.receipt.length).toBeLessThanOrEqual(40);
  });

  it('rejects invalid authoritative amounts', () => {
    expect(() => buildRazorpayOrder({
      purpose: 'subscription',
      referenceId: 'domestic_gold',
      authoritativeAmountRupees: 799.5,
    })).toThrow(/positive integer INR/i);
  });
});
