import { buildRazorpayOrder, type RazorpayOrderRequest } from '../../../business_logic/payment/razorpayOrder.service.ts';
import { HttpError } from './http.ts';

export interface RazorpayOrder {
  id: string;
  entity: 'order';
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: 'INR';
  receipt: string;
  status: 'created' | 'attempted' | 'paid';
  notes: Record<string, string>;
}

export function requireEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new HttpError(500, 'PAYMENT_CONFIG_MISSING');
  return value;
}

export { buildRazorpayOrder };

export async function createRazorpayOrder(request: RazorpayOrderRequest): Promise<RazorpayOrder> {
  const keyId = requireEnv('RAZORPAY_KEY_ID');
  const keySecret = requireEnv('RAZORPAY_KEY_SECRET');
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    console.error('Razorpay order creation failed', response.status);
    throw new HttpError(502, 'PAYMENT_PROVIDER_ORDER_FAILED');
  }

  const order = await response.json() as Partial<RazorpayOrder>;
  if (
    typeof order.id !== 'string'
    || order.amount !== request.amount
    || order.currency !== request.currency
  ) {
    throw new HttpError(502, 'PAYMENT_PROVIDER_RESPONSE_INVALID');
  }

  return order as RazorpayOrder;
}
