import { describe, expect, it } from 'vitest';
import { computeCreditBalances } from '../supabase/functions/_shared/dashboardLedger';

describe('customer dashboard credit balances', () => {
  it('does not keep redeemed or reversed reservations locked', () => {
    expect(computeCreditBalances([
      { type: 'issued', amount: 2 },
      { type: 'reserved', amount: 1 },
      { type: 'redeemed', amount: 1 },
    ])).toEqual({ available: 1, locked: 0 });

    expect(computeCreditBalances([
      { type: 'issued', amount: 1 },
      { type: 'reserved', amount: 1 },
      { type: 'reversed', amount: 1 },
    ])).toEqual({ available: 1, locked: 0 });
  });
});
