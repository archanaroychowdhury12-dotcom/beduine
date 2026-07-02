import { describe, expect, it } from 'vitest';
import type { CreditLedgerEntry, TripCategory } from '../business_logic/types';
import {
  type DiscountCreditRedemptionRecord,
  type DiscountCreditReservationRepository,
  type DiscountCreditReservationTransaction,
  type DiscountCreditUnitRecord,
  redeemReservedDiscountCredits,
  reserveDiscountCreditsForBooking,
  reverseReservedDiscountCredits,
} from '../business_logic/credits/discountCreditReservation.service';

function ledger(category: TripCategory, amount: number): CreditLedgerEntry[] {
  return [{
    id: `ledger-${category}`,
    date: '01 Jan 2026',
    type: 'issued',
    creditType: 'discount',
    amount,
    reason: 'Non-winner DC',
    creditCategory: category,
    creditValue: category === 'domestic' ? 500 : 5000,
    usableFor: category === 'domestic' ? 'domestic_only' : 'international_only',
  }];
}

class InMemoryReservationRepo implements DiscountCreditReservationRepository, DiscountCreditReservationTransaction {
  units: DiscountCreditUnitRecord[] = [];
  redemptions: DiscountCreditRedemptionRecord[] = [];
  ledgerEntries: unknown[] = [];
  audits: unknown[] = [];

  async transaction<T>(handler: (tx: DiscountCreditReservationTransaction) => Promise<T>) { return handler(this); }
  async getAvailableCreditUnitsForUpdate(userId: string, category: TripCategory) {
    return this.units.filter((unit) => unit.userId === userId && unit.category === category && unit.status === 'available');
  }
  async getActiveRedemptionsForBookingForUpdate(bookingId: string) {
    return this.redemptions.filter((record) => record.bookingId === bookingId && ['reserved', 'redeemed'].includes(record.status));
  }
  async reserveCreditUnit(unitId: string, input: { bookingId: string; travelerKey: string; expiresAt: string }) {
    this.units = this.units.map((unit) => unit.id === unitId ? { ...unit, status: 'reserved', reservedByBookingId: input.bookingId, reservedForTravelerKey: input.travelerKey, expiresAt: input.expiresAt } : unit);
  }
  async createRedemption(record: DiscountCreditRedemptionRecord) { this.redemptions.push(record); }
  async updateRedemptionStatus(redemptionId: string, status: DiscountCreditRedemptionRecord['status']) {
    this.redemptions = this.redemptions.map((record) => record.id === redemptionId ? { ...record, status, updatedAt: new Date().toISOString() } : record);
  }
  async updateCreditUnitStatus(unitId: string, status: DiscountCreditUnitRecord['status'], bookingId?: string, travelerKey?: string) {
    this.units = this.units.map((unit) => unit.id === unitId ? { ...unit, status, reservedByBookingId: bookingId, reservedForTravelerKey: travelerKey } : unit);
  }
  async insertCreditLedgerEntry(entry: unknown) { this.ledgerEntries.push(entry); }
  async insertAuditLog(event: unknown) { this.audits.push(event); }
}

const travelers = [
  { id: 'traveler-1', firstName: 'A', lastName: 'One', email: 'a@example.com', phone: '1' },
  { id: 'traveler-2', firstName: 'B', lastName: 'Two', email: 'b@example.com', phone: '2' },
];

describe('discount credit reservation workflow', () => {
  it('reserves one DC per traveler, redeems it, and blocks duplicate traveler stacking', async () => {
    const repo = new InMemoryReservationRepo();
    repo.units = [
      { id: 'unit-1', userId: 'user-1', category: 'domestic', value: 500, status: 'available' },
      { id: 'unit-2', userId: 'user-1', category: 'domestic', value: 500, status: 'available' },
    ];

    const reserved = await reserveDiscountCreditsForBooking(repo, {
      userId: 'user-1',
      bookingId: 'BKG-1',
      tourCategory: 'domestic',
      creditCategory: 'domestic',
      ledger: ledger('domestic', 2),
      travelers,
      travelerKeys: ['traveler-1', 'traveler-2'],
    });

    expect(reserved.reservationIds).toHaveLength(2);
    expect(reserved.totalDiscount).toBe(1000);
    await expect(reserveDiscountCreditsForBooking(repo, {
      userId: 'user-1',
      bookingId: 'BKG-1',
      tourCategory: 'domestic',
      creditCategory: 'domestic',
      ledger: ledger('domestic', 2),
      travelers,
      travelerKeys: ['traveler-1'],
    })).rejects.toThrow(/already has an active Discount Credit/i);

    const redeemed = await redeemReservedDiscountCredits(repo, {
      userId: 'user-1',
      bookingId: 'BKG-1',
      category: 'domestic',
      reservationIds: reserved.reservationIds,
    });
    expect(redeemed.redeemed).toBe(2);
    expect(repo.ledgerEntries).toHaveLength(2);
  });

  it('reverses unused reservations back to available units', async () => {
    const repo = new InMemoryReservationRepo();
    repo.units = [{ id: 'unit-1', userId: 'user-1', category: 'international', value: 5000, status: 'available' }];
    const reserved = await reserveDiscountCreditsForBooking(repo, {
      userId: 'user-1',
      bookingId: 'BKG-INT',
      tourCategory: 'international',
      creditCategory: 'international',
      ledger: ledger('international', 1),
      travelers: [travelers[0]],
      travelerKeys: ['traveler-1'],
    });
    const reversed = await reverseReservedDiscountCredits(repo, {
      userId: 'user-1',
      bookingId: 'BKG-INT',
      reservationIds: reserved.reservationIds,
    });
    expect(reversed.reversed).toBe(1);
    expect(repo.units[0].status).toBe('available');
  });
});
