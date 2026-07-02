import { describe, expect, it } from 'vitest';
import { toPublicWinner } from '../business_logic/weeklyDraw/publicWinners.service';

describe('public winner projection', () => {
  it('returns only public winner fields', () => {
    const result = toPublicWinner({
      name: 'Rahul Sen',
      uid: 'BDU-2026-RHLSEN-4821',
      email: 'rahul@example.com',
      phone: '+919876543210',
      ticketId: 'TRC-SUN-00091',
      roundKey: 'domestic_gold',
      coupon: 'BEDWIN-2026-4821',
      benefitSummary: 'Gold winner tour benefit',
      resultDate: '2026-07-05T13:00:00.000Z',
    });

    expect(result).toEqual({
      name: 'Rahul Sen',
      uid: 'BDU-2026-RHLSEN-4821',
      ticketId: 'TRC-SUN-00091',
      roundKey: 'domestic_gold',
      coupon: 'BEDWIN-2026-4821',
      benefitSummary: 'Gold winner tour benefit',
      resultDate: '2026-07-05T13:00:00.000Z',
    });
    expect(result).not.toHaveProperty('email');
    expect(result).not.toHaveProperty('phone');
  });
});
