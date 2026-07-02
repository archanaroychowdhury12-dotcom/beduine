import type { CreditLedgerEntry, TripCategory, Traveler } from '../types';
import { buildDiscountCreditRedemptionLedgerEntry, validateDiscountCreditPolicy } from './discountCreditPolicy';

export type DiscountCreditReservationStatus = 'reserved' | 'redeemed' | 'reversed' | 'expired';

export interface DiscountCreditUnitRecord {
  id: string;
  userId: string;
  category: TripCategory;
  value: number;
  sourceLedgerEntryId?: string;
  status: 'available' | 'reserved' | 'redeemed' | 'expired';
  reservedByBookingId?: string;
  reservedForTravelerKey?: string;
  expiresAt?: string;
}

export interface DiscountCreditRedemptionRecord {
  id: string;
  bookingId: string;
  userId: string;
  travelerKey: string;
  creditUnitId: string;
  category: TripCategory;
  creditValue: number;
  status: DiscountCreditReservationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountCreditReservationTransaction {
  getAvailableCreditUnitsForUpdate(userId: string, category: TripCategory): Promise<DiscountCreditUnitRecord[]>;
  getActiveRedemptionsForBookingForUpdate(bookingId: string): Promise<DiscountCreditRedemptionRecord[]>;
  reserveCreditUnit(unitId: string, input: { bookingId: string; travelerKey: string; expiresAt: string }): Promise<void>;
  createRedemption(record: DiscountCreditRedemptionRecord): Promise<void>;
  updateRedemptionStatus(redemptionId: string, status: DiscountCreditReservationStatus): Promise<void>;
  updateCreditUnitStatus(unitId: string, status: DiscountCreditUnitRecord['status'], bookingId?: string, travelerKey?: string): Promise<void>;
  insertCreditLedgerEntry(entry: CreditLedgerEntry & { userId: string }): Promise<void>;
  insertAuditLog(event: { action: string; status: 'success' | 'failed' | 'pending'; reason: string; metadata?: Record<string, unknown> }): Promise<void>;
}

export interface DiscountCreditReservationRepository {
  transaction<T>(handler: (tx: DiscountCreditReservationTransaction) => Promise<T>): Promise<T>;
}

export interface ReserveDiscountCreditsInput {
  userId: string;
  bookingId: string;
  tourCategory: TripCategory;
  creditCategory: TripCategory;
  ledger: CreditLedgerEntry[];
  travelers: Array<Pick<Traveler, 'firstName' | 'lastName' | 'email' | 'phone'> & { id?: string }>;
  travelerKeys: string[];
  holdMinutes?: number;
  actorId?: string;
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

function addMinutes(minutes: number): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function uniqueTravelerKeys(keys: string[]): string[] {
  return [...new Set(keys.filter(Boolean))];
}

export async function reserveDiscountCreditsForBooking(
  repository: DiscountCreditReservationRepository,
  input: ReserveDiscountCreditsInput,
): Promise<{ reservationIds: string[]; totalDiscount: number; expiresAt: string }> {
  return repository.transaction(async (tx) => {
    const travelerKeys = uniqueTravelerKeys(input.travelerKeys);
    const requestedCredits = travelerKeys.length;
    const policy = validateDiscountCreditPolicy({
      operation: 'booking_discount',
      requestedCredits,
      tourCategory: input.tourCategory,
      creditCategory: input.creditCategory,
      ledger: input.ledger,
      travelers: input.travelers,
      travelerCreditAssignments: travelerKeys.map((travelerKey) => ({ travelerKey, credits: 1 })),
    });

    if (!policy.valid) throw new Error(policy.error || 'Discount Credit policy validation failed.');

    const existing = await tx.getActiveRedemptionsForBookingForUpdate(input.bookingId);
    const existingTravelerKeys = new Set(existing.filter((r) => r.status === 'reserved' || r.status === 'redeemed').map((r) => r.travelerKey));
    for (const travelerKey of travelerKeys) {
      if (existingTravelerKeys.has(travelerKey)) {
        throw new Error(`Traveler ${travelerKey} already has an active Discount Credit on booking ${input.bookingId}.`);
      }
    }

    const availableUnits = await tx.getAvailableCreditUnitsForUpdate(input.userId, input.creditCategory);
    if (availableUnits.length < requestedCredits) {
      throw new Error(`Insufficient available ${input.creditCategory} Discount Credit units. Available: ${availableUnits.length}, requested: ${requestedCredits}.`);
    }

    const expiresAt = addMinutes(input.holdMinutes || 20);
    const reservationIds: string[] = [];
    for (let index = 0; index < travelerKeys.length; index += 1) {
      const unit = availableUnits[index];
      const travelerKey = travelerKeys[index];
      const redemption: DiscountCreditRedemptionRecord = {
        id: makeId('DCR'),
        bookingId: input.bookingId,
        userId: input.userId,
        travelerKey,
        creditUnitId: unit.id,
        category: input.creditCategory,
        creditValue: policy.creditValue,
        status: 'reserved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await tx.reserveCreditUnit(unit.id, { bookingId: input.bookingId, travelerKey, expiresAt });
      await tx.createRedemption(redemption);
      reservationIds.push(redemption.id);
    }

    await tx.insertAuditLog({
      action: 'discount_credit.reserved',
      status: 'success',
      reason: `Reserved ${requestedCredits} Discount Credit unit(s) for booking ${input.bookingId}.`,
      metadata: { actorId: input.actorId, userId: input.userId, bookingId: input.bookingId, travelerKeys, totalDiscount: policy.totalDiscount, expiresAt },
    });

    return { reservationIds, totalDiscount: policy.totalDiscount, expiresAt };
  });
}

export async function redeemReservedDiscountCredits(
  repository: DiscountCreditReservationRepository,
  input: { userId: string; bookingId: string; category: TripCategory; reservationIds: string[]; actorId?: string },
): Promise<{ redeemed: number }> {
  return repository.transaction(async (tx) => {
    const active = await tx.getActiveRedemptionsForBookingForUpdate(input.bookingId);
    const byId = new Map(active.map((record) => [record.id, record]));
    let redeemed = 0;
    for (const reservationId of input.reservationIds) {
      const record = byId.get(reservationId);
      if (!record) throw new Error(`Discount Credit reservation ${reservationId} not found for booking ${input.bookingId}.`);
      if (record.userId !== input.userId) throw new Error('Discount Credit reservation does not belong to this user.');
      if (record.status !== 'reserved') throw new Error(`Discount Credit reservation ${reservationId} is not reserved.`);
      await tx.updateRedemptionStatus(reservationId, 'redeemed');
      await tx.updateCreditUnitStatus(record.creditUnitId, 'redeemed', input.bookingId, record.travelerKey);
      await tx.insertCreditLedgerEntry(buildDiscountCreditRedemptionLedgerEntry({
        userId: input.userId,
        bookingRef: input.bookingId,
        category: input.category,
        credits: 1,
        source: 'real',
      }));
      redeemed += 1;
    }
    await tx.insertAuditLog({
      action: 'discount_credit.redeemed',
      status: 'success',
      reason: `Redeemed ${redeemed} reserved Discount Credit unit(s) for booking ${input.bookingId}.`,
      metadata: { actorId: input.actorId, userId: input.userId, bookingId: input.bookingId, reservationIds: input.reservationIds },
    });
    return { redeemed };
  });
}

export async function reverseReservedDiscountCredits(
  repository: DiscountCreditReservationRepository,
  input: { userId: string; bookingId: string; reservationIds: string[]; actorId?: string; reason?: string },
): Promise<{ reversed: number }> {
  return repository.transaction(async (tx) => {
    const active = await tx.getActiveRedemptionsForBookingForUpdate(input.bookingId);
    const byId = new Map(active.map((record) => [record.id, record]));
    let reversed = 0;
    for (const reservationId of input.reservationIds) {
      const record = byId.get(reservationId);
      if (!record) throw new Error(`Discount Credit reservation ${reservationId} not found for booking ${input.bookingId}.`);
      if (record.userId !== input.userId) throw new Error('Discount Credit reservation does not belong to this user.');
      if (record.status !== 'reserved') continue;
      await tx.updateRedemptionStatus(reservationId, 'reversed');
      await tx.updateCreditUnitStatus(record.creditUnitId, 'available');
      reversed += 1;
    }
    await tx.insertAuditLog({
      action: 'discount_credit.reversed',
      status: 'success',
      reason: input.reason || `Reversed ${reversed} Discount Credit reservation(s).`,
      metadata: { actorId: input.actorId, userId: input.userId, bookingId: input.bookingId, reservationIds: input.reservationIds },
    });
    return { reversed };
  });
}
