import {
  beduineBackend,
  type BeduineBackendAdapter,
  type CreateTourBookingDraftInput,
  type PaymentStatusResponse,
  type TourBookingDraftResponse,
} from '@/services/backend';
import {
  openRazorpayCheckout,
  type CheckoutCustomer,
} from '@/services/payment/razorpayCheckout';

export type TourBookingPaymentApi = Pick<
  BeduineBackendAdapter,
  'createTourBookingDraft' | 'createPaymentOrder' | 'getPaymentStatus'
>;

export interface CompleteTourBookingPaymentInput {
  draftInput: CreateTourBookingDraftInput;
  customer: CheckoutCustomer;
  api?: TourBookingPaymentApi;
  openCheckout?: typeof openRazorpayCheckout;
  delay?: (milliseconds: number) => Promise<void>;
  maxStatusChecks?: number;
}

export interface VerifiedTourBookingPayment extends PaymentStatusResponse {
  status: 'verified';
  bookingId: string;
  draft: TourBookingDraftResponse;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export async function completeTourBookingPayment({
  draftInput,
  customer,
  api = beduineBackend,
  openCheckout = openRazorpayCheckout,
  delay = wait,
  maxStatusChecks = 20,
}: CompleteTourBookingPaymentInput): Promise<VerifiedTourBookingPayment> {
  const draft = await api.createTourBookingDraft(draftInput);
  const order = await api.createPaymentOrder({
    purpose: 'tour_booking',
    referenceId: draft.bookingId,
  });
  const checkout = await openCheckout(order, customer);
  if (checkout.sessionId !== order.sessionId) {
    throw new Error('PAYMENT_SESSION_MISMATCH');
  }

  for (let attempt = 0; attempt < maxStatusChecks; attempt += 1) {
    const status = await api.getPaymentStatus(order.sessionId);
    if (status.status === 'verified') {
      if (!status.bookingId || status.bookingId !== draft.bookingId) {
        throw new Error('BOOKING_FULFILLMENT_MISMATCH');
      }
      return {
        ...status,
        status: 'verified',
        bookingId: status.bookingId,
        draft,
      };
    }
    if (status.status !== 'pending') {
      throw new Error(`PAYMENT_${status.status.toUpperCase()}`);
    }
    if (attempt < maxStatusChecks - 1) await delay(1_500);
  }

  throw new Error('PAYMENT_VERIFICATION_TIMEOUT');
}
