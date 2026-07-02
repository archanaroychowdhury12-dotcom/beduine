// UI Stub for Mock Payment Gateway
import { CheckoutRequest, CheckoutSession, PaymentGatewayAdapter, VerifiedPaymentEvent } from './payment.types';

export const mockPaymentGateway: PaymentGatewayAdapter = {
  provider: 'mock',

  async createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession> {
    return {
      id: `MOCK-CHECKOUT-${Date.now()}`,
      userId: request.userId,
      planId: request.planId,
      amount: request.amount,
      currency: request.currency,
      provider: 'mock',
      paymentMethod: request.paymentMethod,
      status: 'created',
      clientSecret: `mock-secret-${Date.now()}`,
      providerOrderId: `mock-order-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
  },

  async verifyWebhook(payload: Record<string, unknown>): Promise<VerifiedPaymentEvent> {
    const status = (payload.status as VerifiedPaymentEvent['status']) || 'verified';
    return {
      id: `MOCK-WEBHOOK-${Date.now()}`,
      sessionId: String(payload.sessionId || ''),
      userId: String(payload.userId || ''),
      planId: String(payload.planId || ''),
      amount: Number(payload.amount || 0),
      currency: 'INR',
      provider: 'mock',
      paymentMethod: (payload.paymentMethod as VerifiedPaymentEvent['paymentMethod']) || 'real_payment',
      eventType: status === 'failed' ? 'payment.failed' : 'payment.verified',
      status,
      verified: status !== 'failed',
      verificationSource: 'simulated_webhook',
      rawPayload: payload,
      created_at: new Date().toISOString(),
    };
  },
};
