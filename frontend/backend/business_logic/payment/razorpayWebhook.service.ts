export type RazorpayFulfillmentStatus = 'pending' | 'verified' | 'failed';

export interface ParsedRazorpayWebhook {
  eventId: string;
  eventType: string;
  shouldProcess: boolean;
  status: RazorpayFulfillmentStatus;
  orderId: string;
  paymentId: string;
  amountRupees: number;
  currency: 'INR';
}

export function getRazorpayFulfillmentTarget(
  purpose: string,
): 'subscription' | 'booking' | 'unsupported' {
  if (purpose === 'subscription') return 'subscription';
  if (purpose === 'tour_booking' || purpose === 'installment') return 'booking';
  return 'unsupported';
}

export function shouldApplyRazorpayPaymentTransition(
  currentStatus: string,
  incomingStatus: RazorpayFulfillmentStatus,
): boolean {
  if (
    currentStatus === 'verified'
    || currentStatus === 'refunded'
    || currentStatus === 'chargeback'
  ) {
    return false;
  }
  return currentStatus !== incomingStatus;
}

const encoder = new TextEncoder();

function timingSafeEqual(left: string, right: string): boolean {
  const normalizedLeft = left.trim().toLowerCase();
  const normalizedRight = right.trim().toLowerCase();
  if (normalizedLeft.length !== normalizedRight.length) return false;

  let result = 0;
  for (let index = 0; index < normalizedLeft.length; index += 1) {
    result |= normalizedLeft.charCodeAt(index) ^ normalizedRight.charCodeAt(index);
  }
  return result === 0;
}

function toRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('RAZORPAY_WEBHOOK_PAYLOAD_INVALID');
  }
  return value as Record<string, unknown>;
}

export async function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  if (!rawBody || !signature || !secret) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  const expected = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return timingSafeEqual(expected, signature);
}

export function parseRazorpayWebhook(
  rawBody: string,
  eventId: string,
): ParsedRazorpayWebhook {
  if (!eventId || eventId.length > 255) {
    throw new Error('RAZORPAY_EVENT_ID_INVALID');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    throw new Error('RAZORPAY_WEBHOOK_JSON_INVALID');
  }

  const body = toRecord(parsed);
  const eventType = String(body.event || '');
  const payload = toRecord(body.payload);
  const payment = toRecord(payload.payment);
  const entity = toRecord(payment.entity);
  const paymentId = String(entity.id || '');
  const orderId = String(entity.order_id || '');
  const amountPaise = Number(entity.amount);
  const currency = String(entity.currency || '').toUpperCase();
  const entityStatus = String(entity.status || '').toLowerCase();

  if (
    !eventType
    || !paymentId
    || !orderId
    || !Number.isSafeInteger(amountPaise)
    || amountPaise <= 0
    || currency !== 'INR'
  ) {
    throw new Error('RAZORPAY_PAYMENT_ENTITY_INVALID');
  }

  const captured = eventType === 'payment.captured' && entityStatus === 'captured';
  const failed = eventType === 'payment.failed' && entityStatus === 'failed';

  return {
    eventId,
    eventType,
    shouldProcess: captured || failed,
    status: captured ? 'verified' : failed ? 'failed' : 'pending',
    orderId,
    paymentId,
    amountRupees: amountPaise / 100,
    currency: 'INR',
  };
}
