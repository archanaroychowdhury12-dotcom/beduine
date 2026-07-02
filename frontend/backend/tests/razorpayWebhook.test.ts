import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  getRazorpayFulfillmentTarget,
  parseRazorpayWebhook,
  shouldApplyRazorpayPaymentTransition,
  verifyRazorpayWebhookSignature,
} from '../business_logic/payment/razorpayWebhook.service';

const capturedPayload = {
  entity: 'event',
  event: 'payment.captured',
  payload: {
    payment: {
      entity: {
        id: 'pay_123',
        order_id: 'order_123',
        amount: 79_900,
        currency: 'INR',
        status: 'captured',
      },
    },
  },
};

describe('Razorpay webhook processing', () => {
  it('does not route booking payments through subscription fulfillment', () => {
    expect(getRazorpayFulfillmentTarget('subscription')).toBe('subscription');
    expect(getRazorpayFulfillmentTarget('tour_booking')).toBe('unsupported');
    expect(getRazorpayFulfillmentTarget('installment')).toBe('unsupported');
  });

  it('keeps verified payment state monotonic for out-of-order events', () => {
    expect(shouldApplyRazorpayPaymentTransition('verified', 'failed')).toBe(false);
    expect(shouldApplyRazorpayPaymentTransition('verified', 'verified')).toBe(false);
    expect(shouldApplyRazorpayPaymentTransition('failed', 'verified')).toBe(true);
    expect(shouldApplyRazorpayPaymentTransition('pending', 'failed')).toBe(true);
  });

  it('verifies the untouched raw body signature', async () => {
    const rawBody = JSON.stringify(capturedPayload);
    const secret = 'webhook-test-secret';
    const signature = createHmac('sha256', secret).update(rawBody).digest('hex');

    await expect(
      verifyRazorpayWebhookSignature(rawBody, signature, secret),
    ).resolves.toBe(true);
    await expect(
      verifyRazorpayWebhookSignature(`${rawBody}\n`, signature, secret),
    ).resolves.toBe(false);
  });

  it('maps only a captured payment to verified rupee fulfillment data', () => {
    expect(parseRazorpayWebhook(
      JSON.stringify(capturedPayload),
      'event_unique_123',
    )).toEqual({
      eventId: 'event_unique_123',
      eventType: 'payment.captured',
      shouldProcess: true,
      status: 'verified',
      orderId: 'order_123',
      paymentId: 'pay_123',
      amountRupees: 799,
      currency: 'INR',
    });
  });

  it('does not fulfill an authorized but uncaptured payment', () => {
    const payload = structuredClone(capturedPayload);
    payload.event = 'payment.authorized';
    payload.payload.payment.entity.status = 'authorized';

    expect(parseRazorpayWebhook(
      JSON.stringify(payload),
      'event_unique_124',
    ).shouldProcess).toBe(false);
  });
});
