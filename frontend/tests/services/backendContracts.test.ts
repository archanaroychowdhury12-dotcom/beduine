import { describe, expect, it } from 'vitest';
import { createDemoBackendAdapter } from '../../src/services/backend/demoBackendAdapter';
import { demoWalletService } from '../../src/services/demoWalletService';
import { supabase } from '../../src/utils/supabaseClient';

type DemoAuth = typeof supabase.auth & { resetAllAccounts?: () => void };

async function loginSubscribedDemoCustomer() {
  const auth = supabase.auth as DemoAuth;
  auth.resetAllAccounts?.();
  const login = await auth.signInWithPassword({
    email: 'demo@beduine.com',
    password: 'beduine123',
  });
  await demoWalletService.checkoutSubscription(
    login.data.user!.id,
    'domestic_gold',
    'demo_wallet',
  );
}

describe('frontend backend adapter contracts', () => {
  it('exposes published winners without customer contact fields', async () => {
    const adapter = createDemoBackendAdapter();
    const winners = await adapter.listPublicWinners();

    expect(winners[0]).toMatchObject({
      uid: expect.stringMatching(/^BDU-/),
      roundKey: 'domestic_gold',
    });
    expect(winners[0]).not.toHaveProperty('email');
    expect(winners[0]).not.toHaveProperty('phone');
  });

  it('participates in the current Sunday draw without accepting a user id', async () => {
    await loginSubscribedDemoCustomer();
    const adapter = createDemoBackendAdapter();
    const participation = await adapter.participateInWeeklyDraw();

    expect(participation.ticketId).toMatch(/^TRC-SUN-[0-9]{5}$/);
    expect(participation.roundKey).toBe('domestic_gold');
    expect(participation.freezeAtIso).toBeTruthy();
  });

  it('creates payment orders from a server-owned reference', async () => {
    const adapter = createDemoBackendAdapter();
    const order = await adapter.createPaymentOrder({
      purpose: 'subscription',
      referenceId: 'domestic_gold',
    });

    expect(order).toMatchObject({
      currency: 'INR',
      amountPaise: 79_900,
    });
    await expect(adapter.getPaymentStatus(order.sessionId)).resolves.toMatchObject({
      sessionId: order.sessionId,
      status: 'verified',
    });
  });

  it('creates an authoritative paid-tour booking draft', async () => {
    const adapter = createDemoBackendAdapter();
    const draft = await adapter.createTourBookingDraft({
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
    });

    expect(draft.bookingId).toMatch(/^BDU-BKG-/);
    expect(draft.currency).toBe('INR');
    expect(draft.amountDueNow).toBeGreaterThan(0);
  });

  it('exposes customer dashboard contract', async () => {
    await loginSubscribedDemoCustomer();
    const adapter = createDemoBackendAdapter();
    const dashboard = await adapter.getCustomerDashboard();
    expect(dashboard.profile.uid).toContain('BDU-2026');
    expect(dashboard.trc.available).toBe(1);
    expect(dashboard.supportTickets).toEqual([]);
  });

  it('exposes weekly draw status with plan-wise rounds and reveal-next contract', async () => {
    const adapter = createDemoBackendAdapter();
    const status = await adapter.getWeeklyDrawStatus();
    expect(status.timezone).toBe('Asia/Kolkata');
    expect(status.rounds).toHaveLength(6);
    const winner = await adapter.revealNextWinner(status.cycleId);
    expect(winner.hasWinner).toBe(true);
    expect(winner.uid).toMatch(/^BDU-[0-9]{4}-[A-Z0-9]{6}-[0-9]{4}$/);
    expect(winner.roundKey).toBeDefined();
  });

  it('creates cancellation request contract response', async () => {
    const adapter = createDemoBackendAdapter();
    const response = await adapter.requestCancellation({
      bookingId: 'BK-1',
      reason: 'Plan changed',
      refundPreference: 'cash_refund',
    });
    expect(response.bookingId).toBe('BK-1');
    expect(response.status).toBe('refund_pending');
  });
});
