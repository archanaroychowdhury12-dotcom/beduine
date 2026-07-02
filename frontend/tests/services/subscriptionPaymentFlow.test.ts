import { describe, expect, it, vi } from 'vitest';
import { completeSubscriptionPayment } from '../../src/services/payment/subscriptionPaymentFlow';

describe('subscription payment flow', () => {
  it('waits for server verification after checkout returns', async () => {
    const createPaymentOrder = vi.fn().mockResolvedValue({
      sessionId: 'session_123',
      keyId: 'rzp_test_public',
      orderId: 'order_123',
      amountPaise: 79_900,
      currency: 'INR',
      description: 'Gold Domestic',
    });
    const openCheckout = vi.fn().mockResolvedValue({ sessionId: 'session_123' });
    const getPaymentStatus = vi.fn()
      .mockResolvedValueOnce({ sessionId: 'session_123', status: 'pending' })
      .mockResolvedValueOnce({
        sessionId: 'session_123',
        status: 'verified',
        subscriptionId: 'subscription_123',
      });

    await expect(completeSubscriptionPayment({
      planId: 'domestic_gold',
      customer: {
        name: 'Rahul Sen',
        email: 'rahul@example.com',
        contact: '+919876543210',
      },
      api: { createPaymentOrder, getPaymentStatus },
      openCheckout,
      delay: async () => undefined,
    })).resolves.toMatchObject({
      status: 'verified',
      subscriptionId: 'subscription_123',
    });

    expect(createPaymentOrder).toHaveBeenCalledWith({
      purpose: 'subscription',
      referenceId: 'domestic_gold',
    });
    expect(getPaymentStatus).toHaveBeenCalledTimes(2);
  });
});
