import { describe, expect, it } from 'vitest';
import { createDemoBackendAdapter } from '../../src/services/backend/demoBackendAdapter';
import type { CustomerDashboardResponse } from '../../src/services/backend/backendContracts';
import { supabase } from '../../src/utils/supabaseClient';

describe('customer dashboard backend contract', () => {
  it('defines the customer dashboard response shape', () => {
    const model: CustomerDashboardResponse = {
      profile: { uid: 'BDU-2026-RHLSEN-4821', fullName: 'Rahul Sen', role: 'customer' },
      subscription: null,
      trc: { available: 0, locked: 0, history: [] },
      discountCredits: { availableUnits: [], history: [] },
      drawEntries: [],
      winnerBenefits: [],
      bookings: [],
      payments: [],
      supportTickets: [],
    };

    expect(model.profile.role).toBe('customer');
    expect(model.bookings).toEqual([]);
  });

  it('returns a customer dashboard payload from the demo adapter', async () => {
    await supabase.auth.signInWithPassword({
      email: 'demo@beduine.com',
      password: 'beduine123',
    });
    const adapter = createDemoBackendAdapter();
    const response = await adapter.getCustomerDashboard();

    expect(response.profile.role).toBe('customer');
    expect(response.bookings).toEqual([]);
    expect(response.supportTickets).toEqual([]);
  });
});
