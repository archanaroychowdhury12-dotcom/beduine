import { mockPaymentGateway } from './mockPaymentGateway';
import { CheckoutRequest, CheckoutSession, PaymentGatewayAdapter, VerifiedPaymentEvent } from './payment.types';
import { razorpayPaymentGateway } from './razorpayPaymentGateway';

export function getPaymentGateway(): PaymentGatewayAdapter {
  return import.meta.env.VITE_BACKEND_MODE === 'production'
    ? razorpayPaymentGateway
    : mockPaymentGateway;
}

export async function createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession> {
  return getPaymentGateway().createCheckoutSession(request);
}

export async function verifyPaymentWebhook(payload: Record<string, unknown>, _signature?: string): Promise<VerifiedPaymentEvent> {
  return getPaymentGateway().verifyWebhook(payload, _signature);
}
