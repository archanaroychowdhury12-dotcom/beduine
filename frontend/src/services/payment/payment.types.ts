export type PaymentProvider = 'mock' | 'razorpay' | 'cashfree' | 'phonepe' | 'stripe';
export type PaymentMethod = 'real_payment' | 'demo_wallet';
export type PaymentStatus = 'created' | 'pending' | 'verified' | 'failed' | 'refunded' | 'chargeback';
export type PaymentEventType = 'payment.created' | 'payment.verified' | 'payment.failed' | 'payment.refunded' | 'payment.chargeback';

export interface CheckoutRequest {
  userId: string;
  planId: string;
  amount: number;
  currency: 'INR';
  paymentMethod: PaymentMethod;
  provider?: PaymentProvider;
}

export interface CheckoutSession {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: 'INR';
  provider: PaymentProvider;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  clientSecret?: string;
  providerOrderId?: string;
  redirectUrl?: string;
  created_at: string;
}

export interface VerifiedPaymentEvent {
  id: string;
  sessionId: string;
  userId: string;
  planId: string;
  amount: number;
  currency: 'INR';
  provider: PaymentProvider;
  paymentMethod: PaymentMethod;
  eventType: PaymentEventType;
  status: PaymentStatus;
  verified: boolean;
  verificationSource: 'simulated_webhook' | 'provider_webhook' | 'manual_admin_review';
  rawPayload?: Record<string, unknown>;
  created_at: string;
}

export interface PaymentGatewayAdapter {
  provider: PaymentProvider;
  createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession>;
  verifyWebhook(payload: Record<string, unknown>, signature?: string): Promise<VerifiedPaymentEvent>;
}
