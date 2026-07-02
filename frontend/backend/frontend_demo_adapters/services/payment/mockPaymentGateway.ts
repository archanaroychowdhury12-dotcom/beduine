import { CheckoutRequest, CheckoutSession, PaymentGatewayAdapter, VerifiedPaymentEvent } from '../../../business_logic/services/payment/payment.types';

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

export const mockPaymentGateway: PaymentGatewayAdapter = {
  provider: 'mock',

  async createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return {
      id: makeId('MOCK-CHECKOUT'),
      userId: request.userId,
      planId: request.planId,
      amount: request.amount,
      currency: request.currency,
      provider: 'mock',
      paymentMethod: request.paymentMethod,
      status: 'created',
      clientSecret: makeId('MOCK-CLIENT-SECRET'),
      providerOrderId: makeId('MOCK-ORDER'),
      created_at: new Date().toISOString(),
    };
  },

  async verifyWebhook(payload: Record<string, unknown>): Promise<VerifiedPaymentEvent> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const status = (payload.status as VerifiedPaymentEvent['status']) || 'verified';
    const eventType =
      status === 'failed'
        ? 'payment.failed'
        : status === 'refunded'
          ? 'payment.refunded'
          : status === 'chargeback'
            ? 'payment.chargeback'
            : 'payment.verified';

    return {
      id: makeId('MOCK-WEBHOOK'),
      sessionId: String(payload.sessionId || ''),
      userId: String(payload.userId || ''),
      planId: String(payload.planId || ''),
      amount: Number(payload.amount || 0),
      currency: 'INR',
      provider: 'mock',
      paymentMethod: (payload.paymentMethod as VerifiedPaymentEvent['paymentMethod']) || 'real_payment',
      eventType,
      status,
      verified: status !== 'failed',
      verificationSource: 'simulated_webhook',
      rawPayload: payload,
      created_at: new Date().toISOString(),
    };
  },
};
