import { mockPaymentGateway } from './mockPaymentGateway';
import { CheckoutRequest, CheckoutSession, PaymentGatewayAdapter, PaymentProvider, VerifiedPaymentEvent } from '../../../business_logic/services/payment/payment.types';

const providerFromEnv = (): PaymentProvider => {
  const configured = import.meta.env.VITE_PAYMENT_PROVIDER as PaymentProvider | undefined;
  return configured || 'mock';
};

const productionProviderAdapter: PaymentGatewayAdapter = {
  provider: providerFromEnv(),

  async createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession> {
    throw new Error(
      `Real ${request.provider || providerFromEnv()} checkout is not connected yet. Add a server endpoint that creates provider orders and returns a checkout session.`
    );
  },

  async verifyWebhook(): Promise<VerifiedPaymentEvent> {
    throw new Error('Provider webhook verification must run on the backend using the provider secret. Client-side verification is intentionally blocked.');
  },
};

export function getPaymentGateway(): PaymentGatewayAdapter {
  const demoMode = import.meta.env.VITE_ENABLE_DEMO_WALLET === 'true';
  if (demoMode || providerFromEnv() === 'mock') return mockPaymentGateway;
  return productionProviderAdapter;
}

export async function createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession> {
  const gateway = getPaymentGateway();
  return gateway.createCheckoutSession({ ...request, provider: gateway.provider });
}

export async function verifyPaymentWebhook(payload: Record<string, unknown>, signature?: string): Promise<VerifiedPaymentEvent> {
  const gateway = getPaymentGateway();
  return gateway.verifyWebhook(payload, signature);
}
