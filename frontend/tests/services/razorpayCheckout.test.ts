import { afterEach, describe, expect, it, vi } from 'vitest';
import { openRazorpayCheckout } from '../../src/services/payment/razorpayCheckout';

describe('Razorpay browser checkout', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, 'Razorpay');
  });

  it('opens checkout with server order values without fulfilling on the client', async () => {
    const open = vi.fn();
    let options: Record<string, unknown> | undefined;
    const Razorpay = vi.fn(function RazorpayMock(value: Record<string, unknown>) {
      options = value;
      return { open };
    });
    Object.defineProperty(window, 'Razorpay', {
      configurable: true,
      value: Razorpay,
    });

    const resultPromise = openRazorpayCheckout({
      keyId: 'rzp_test_public',
      orderId: 'order_123',
      sessionId: 'session_123',
      amountPaise: 79_900,
      currency: 'INR',
      description: 'Gold Domestic',
    }, {
      name: 'Rahul Sen',
      email: 'rahul@example.com',
      contact: '+919876543210',
    });

    await Promise.resolve();
    expect(open).toHaveBeenCalledOnce();
    expect(options).toMatchObject({
      key: 'rzp_test_public',
      order_id: 'order_123',
      amount: 79_900,
      currency: 'INR',
    });

    (options?.handler as () => void)();
    await expect(resultPromise).resolves.toEqual({ sessionId: 'session_123' });
  });
});
