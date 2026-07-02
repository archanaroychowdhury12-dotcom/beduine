import { describe, expect, it } from 'vitest';
import { createDemoBackendAdapter } from '../../src/services/backend/demoBackendAdapter';

describe('frontend backend adapter contracts', () => {
  it('exposes customer dashboard contract', async () => {
    const adapter = createDemoBackendAdapter();
    const dashboard = await adapter.getCustomerDashboard();
    expect(dashboard.profile.uid).toContain('BDU-2026');
    expect(dashboard.discountCredits.availableUnits).toEqual([]);
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
