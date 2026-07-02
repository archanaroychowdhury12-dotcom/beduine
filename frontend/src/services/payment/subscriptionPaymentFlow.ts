import {
  beduineBackend,
  type CreatePaymentOrderInput,
  type PaymentOrderResponse,
  type PaymentStatusResponse,
} from '@/services/backend';
import {
  openRazorpayCheckout,
  type CheckoutCustomer,
} from './razorpayCheckout';

interface SubscriptionPaymentApi {
  createPaymentOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderResponse>;
  getPaymentStatus(sessionId: string): Promise<PaymentStatusResponse>;
}

export interface CompleteSubscriptionPaymentInput {
  planId: string;
  customer: CheckoutCustomer;
  api?: SubscriptionPaymentApi;
  openCheckout?: typeof openRazorpayCheckout;
  delay?: (milliseconds: number) => Promise<void>;
  maxStatusChecks?: number;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export async function completeSubscriptionPayment({
  planId,
  customer,
  api = beduineBackend,
  openCheckout = openRazorpayCheckout,
  delay = wait,
  maxStatusChecks = 20,
}: CompleteSubscriptionPaymentInput): Promise<PaymentStatusResponse> {
  const order = await api.createPaymentOrder({
    purpose: 'subscription',
    referenceId: planId,
  });
  const checkout = await openCheckout(order, customer);
  if (checkout.sessionId !== order.sessionId) {
    throw new Error('PAYMENT_SESSION_MISMATCH');
  }

  for (let attempt = 0; attempt < maxStatusChecks; attempt += 1) {
    const status = await api.getPaymentStatus(order.sessionId);
    if (status.status === 'verified') return status;
    if (status.status !== 'pending') {
      throw new Error(`PAYMENT_${status.status.toUpperCase()}`);
    }
    if (attempt < maxStatusChecks - 1) await delay(1_500);
  }

  throw new Error('PAYMENT_VERIFICATION_TIMEOUT');
}
