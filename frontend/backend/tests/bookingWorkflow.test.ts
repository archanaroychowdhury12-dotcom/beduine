import { describe, expect, it } from 'vitest';
import {
  createTourBookingDraft,
  type BookingWorkflowRepository,
  type BookingWorkflowTransaction,
  type PersistBookingDraft,
} from '../business_logic/booking/bookingWorkflow.service';

class InMemoryBookingRepository
implements BookingWorkflowRepository, BookingWorkflowTransaction {
  saved?: PersistBookingDraft;
  capacityRemaining = 10;
  category: 'domestic' | 'international' = 'domestic';
  creditUnits = [
    { id: 'dc-1', userId: 'user-1', category: 'domestic' as const, value: 500, status: 'available' as const },
    { id: 'dc-2', userId: 'user-1', category: 'domestic' as const, value: 500, status: 'available' as const },
  ];

  async transaction<T>(work: (tx: BookingWorkflowTransaction) => Promise<T>) {
    return work(this);
  }

  async getTourDepartureForUpdate() {
    return {
      tourId: 'digha',
      departureId: 'dep-1',
      tourName: 'Digha Weekend',
      category: this.category,
      basePricePerTraveler: 10_000,
      currency: 'INR' as const,
      departureDate: '2026-08-30',
      capacityRemaining: this.capacityRemaining,
      status: 'open' as const,
    };
  }

  async getCreditUnitsForUpdate() {
    return this.creditUnits;
  }

  async persistBookingDraft(draft: PersistBookingDraft) {
    this.saved = draft;
    return { bookingId: 'BDU-BKG-1001' };
  }
}

const twoTravelerInput = {
  userId: 'user-1',
  tourId: 'digha',
  departureId: 'dep-1',
  bookingType: 'fixed_departure' as const,
  travelers: [
    { travelerKey: 'traveler-1', firstName: 'Rahul', lastName: 'Sen', email: 'rahul@example.com', phone: '9000000001' },
    { travelerKey: 'traveler-2', firstName: 'Mita', lastName: 'Sen', email: 'mita@example.com', phone: '9000000002' },
  ],
  pickup: { type: 'manual' as const, address: 'Kolkata' },
  creditAssignments: [
    { creditUnitId: 'dc-1', travelerKey: 'traveler-1' },
    { creditUnitId: 'dc-2', travelerKey: 'traveler-2' },
  ],
  instantBookingRequired: false,
};

describe('authoritative booking draft workflow', () => {
  it('reserves one matching credit per traveler and calculates due now', async () => {
    const repository = new InMemoryBookingRepository();
    const result = await createTourBookingDraft(repository, twoTravelerInput);

    expect(result.reservedCreditUnits).toHaveLength(2);
    expect(new Set(result.reservedCreditUnits.map((unit) => unit.travelerKey)).size).toBe(2);
    expect(result.grossTourTotal).toBe(20_000);
    expect(result.totalDiscount).toBe(1_000);
    expect(result.finalTourTotal).toBe(19_000);
    expect(result.amountDueNow).toBe(4_750);
    expect(repository.saved?.currency).toBe('INR');
  });

  it('rejects duplicate traveler credit stacking and unavailable capacity', async () => {
    const repository = new InMemoryBookingRepository();
    await expect(createTourBookingDraft(repository, {
      ...twoTravelerInput,
      creditAssignments: [
        { creditUnitId: 'dc-1', travelerKey: 'traveler-1' },
        { creditUnitId: 'dc-2', travelerKey: 'traveler-1' },
      ],
    })).rejects.toThrow('ONE_CREDIT_PER_TRAVELER');

    repository.capacityRemaining = 1;
    await expect(createTourBookingDraft(repository, twoTravelerInput))
      .rejects.toThrow('DEPARTURE_CAPACITY_EXCEEDED');
  });

  it('rejects a credit from the wrong category', async () => {
    const repository = new InMemoryBookingRepository();
    repository.creditUnits[0] = {
      ...repository.creditUnits[0],
      category: 'international',
      value: 5_000,
    };

    await expect(createTourBookingDraft(repository, twoTravelerInput))
      .rejects.toThrow('CREDIT_CATEGORY_MISMATCH');
  });
});
