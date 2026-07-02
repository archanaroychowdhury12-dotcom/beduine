import { describe, expect, it, vi } from 'vitest';
import {
  completeTourBookingPayment,
  type TourBookingPaymentApi,
} from '@/features/booking/services/bookingPaymentFlow';
import type { CreateTourBookingDraftInput } from '@/services/backend';

const draftInput: CreateTourBookingDraftInput = {
  tourId: 'digha-sea-beach-retreat',
  departureId: 'digha-sea-beach-retreat:2026-07-04',
  bookingType: 'fixed_departure',
  travelers: [{
    travelerKey: 'traveler-1',
    firstName: 'Rahul',
    lastName: 'Sen',
    email: 'rahul@example.com',
    phone: '9000000001',
  }],
  pickup: { type: 'manual', address: 'Kolkata' },
  creditAssignments: [],
  instantBookingRequired: false,
};

describe('verified booking payment flow', () => {
  it('waits for webhook verification and never confirms from checkout callback', async () => {
    const api = {
      createTourBookingDraft: vi.fn().mockResolvedValue({
        bookingId: 'BDU-BKG-1001',
        amountDueNow: 4750,
      }),
      createPaymentOrder: vi.fn().mockResolvedValue({
        sessionId: 'session-1',
        keyId: 'rzp_test_key',
        orderId: 'order-1',
        amountPaise: 475_000,
        currency: 'INR',
        description: 'Digha advance',
      }),
      getPaymentStatus: vi.fn()
        .mockResolvedValueOnce({ sessionId: 'session-1', status: 'pending' })
        .mockResolvedValueOnce({
          sessionId: 'session-1',
          status: 'verified',
          bookingId: 'BDU-BKG-1001',
        }),
    } as unknown as TourBookingPaymentApi;
    const openCheckout = vi.fn().mockResolvedValue({ sessionId: 'session-1' });

    const paymentPromise = completeTourBookingPayment({
      draftInput,
      customer: {
        name: 'Rahul Sen',
        email: 'rahul@example.com',
        contact: '9000000001',
      },
      api,
      openCheckout,
      delay: async () => undefined,
    });

    await Promise.resolve();
    expect(api.getPaymentStatus).not.toHaveBeenCalled();

    const result = await paymentPromise;
    expect(api.getPaymentStatus).toHaveBeenCalledTimes(2);
    expect(result.bookingId).toBe('BDU-BKG-1001');
  });

  it('rejects a mismatched checkout session', async () => {
    const api = {
      createTourBookingDraft: vi.fn().mockResolvedValue({
        bookingId: 'BDU-BKG-1001',
      }),
      createPaymentOrder: vi.fn().mockResolvedValue({
        sessionId: 'session-1',
        keyId: 'rzp_test_key',
        orderId: 'order-1',
        amountPaise: 475_000,
        currency: 'INR',
        description: 'Digha advance',
      }),
      getPaymentStatus: vi.fn(),
    } as unknown as TourBookingPaymentApi;

    await expect(completeTourBookingPayment({
      draftInput,
      customer: { name: 'Rahul Sen', email: '', contact: '' },
      api,
      openCheckout: async () => ({ sessionId: 'another-session' }),
    })).rejects.toThrow('PAYMENT_SESSION_MISMATCH');
  });
});
