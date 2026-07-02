import { describe, expect, it } from 'vitest';
import { countAvailableBookingCredits } from '@/features/booking/services/bookingCreditAvailability';

describe('booking credit availability', () => {
  it('counts only available persistent units by category', () => {
    expect(countAvailableBookingCredits([
      { creditCategory: 'domestic', status: 'available' },
      { creditCategory: 'domestic', status: 'reserved' },
      { creditCategory: 'international', status: 'available' },
      { creditCategory: 'international', status: 'redeemed' },
    ])).toEqual({
      domestic: 1,
      international: 1,
    });
  });
});
