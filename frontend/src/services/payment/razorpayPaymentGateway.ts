import { beduineBackend } from '@/services/backend';
import type {
  CheckoutRequest,
  PaymentGatewayAdapter,
} from './payment.types';

const planAliases: Record<string, string> = {
  silver: 'domestic_silver',
  gold: 'domestic_gold',
  platinum: 'domestic_platinum',
  silver_int: 'international_silver',
  gold_int: 'international_gold',
  platinum_int: 'international_platinum',
};

function normalizePlanId(value: string): string {
  const normalized = value.trim().toLowerCase();
  return planAliases[normalized] || normalized;
}

export const razorpayPaymentGateway: PaymentGatewayAdapter = {
  provider: 'razorpay',

  async createCheckoutSession(request: CheckoutRequest) {
    const order = await beduineBackend.createPaymentOrder({
      purpose: 'subscription',
      referenceId: normalizePlanId(request.planId),
    });
    return {
      id: order.sessionId,
      userId: request.userId,
      planId: normalizePlanId(request.planId),
      amount: order.amountPaise / 100,
      currency: order.currency,
      provider: 'razorpay',
      paymentMethod: 'real_payment',
      status: 'pending',
      clientSecret: order.keyId,
      providerOrderId: order.orderId,
      created_at: new Date().toISOString(),
    };
  },

  async verifyWebhook() {
    throw new Error('PAYMENT_WEBHOOK_SERVER_ONLY');
  },
};
