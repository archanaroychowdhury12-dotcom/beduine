export type PaymentPurpose = 'subscription' | 'tour_booking' | 'installment';

export interface RazorpayOrderInput {
  purpose: PaymentPurpose;
  referenceId: string;
  authoritativeAmountRupees: number;
  clientAmountRupees?: number;
  sessionId?: string;
}

export interface RazorpayOrderRequest {
  amount: number;
  currency: 'INR';
  receipt: string;
  notes: {
    purpose: PaymentPurpose;
    referenceId: string;
    sessionId?: string;
  };
}

function sanitizeReceiptPart(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '-');
}

export function buildRazorpayOrder(input: RazorpayOrderInput): RazorpayOrderRequest {
  if (
    !Number.isSafeInteger(input.authoritativeAmountRupees)
    || input.authoritativeAmountRupees <= 0
  ) {
    throw new Error('Authoritative amount must be a positive integer INR value.');
  }

  const receiptReference = input.sessionId || input.referenceId;
  return {
    amount: input.authoritativeAmountRupees * 100,
    currency: 'INR',
    receipt: sanitizeReceiptPart(`${input.purpose}-${receiptReference}`).slice(0, 40),
    notes: {
      purpose: input.purpose,
      referenceId: input.referenceId,
      ...(input.sessionId ? { sessionId: input.sessionId } : {}),
    },
  };
}
