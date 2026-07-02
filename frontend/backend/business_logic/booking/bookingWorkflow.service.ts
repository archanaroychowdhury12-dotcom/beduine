import { calculateAdvancePaymentPlan } from './advancePaymentSchedule';

export type BookingType = 'fixed_departure' | 'customized_tailor_made';
export type BookingCategory = 'domestic' | 'international';

export interface BookingTravelerInput {
  travelerKey: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface BookingPickupInput {
  type: 'hotel' | 'manual' | 'none' | 'assistance';
  address?: string;
  city?: string;
  pincode?: string;
  specialInstructions?: string;
}

export interface CreateTourBookingInput {
  userId: string;
  tourId: string;
  departureId: string;
  bookingType: BookingType;
  travelers: BookingTravelerInput[];
  pickup: BookingPickupInput;
  creditAssignments: Array<{
    creditUnitId: string;
    travelerKey: string;
  }>;
  instantBookingRequired: boolean;
}

export interface LockedTourDeparture {
  tourId: string;
  departureId: string;
  tourName: string;
  category: BookingCategory;
  basePricePerTraveler: number;
  currency: 'INR';
  departureDate: string;
  capacityRemaining: number;
  status: 'open' | 'closed' | 'cancelled';
}

export interface LockedDiscountCreditUnit {
  id: string;
  userId: string;
  category: BookingCategory;
  value: number;
  status: 'available' | 'reserved' | 'redeemed' | 'expired';
}

export interface PersistBookingDraft {
  userId: string;
  tourId: string;
  departureId: string;
  tourName: string;
  category: BookingCategory;
  bookingType: BookingType;
  currency: 'INR';
  departureDate: string;
  travelers: BookingTravelerInput[];
  pickup: BookingPickupInput;
  grossTourTotal: number;
  totalDiscount: number;
  finalTourTotal: number;
  instantBookingCharge: number;
  grandTotal: number;
  amountDueNow: number;
  balanceDueLater: number;
  installments: Array<{
    sequenceNo: number;
    label: string;
    percentage: number;
    amount: number;
    status: 'pay_now' | 'upcoming';
    dueLabel: string;
  }>;
  creditReservations: Array<{
    creditUnitId: string;
    travelerKey: string;
    creditValue: number;
    reservedUntil: string;
  }>;
}

export interface BookingWorkflowTransaction {
  getTourDepartureForUpdate(
    tourId: string,
    departureId: string,
  ): Promise<LockedTourDeparture | null>;
  getCreditUnitsForUpdate(
    userId: string,
    creditUnitIds: string[],
  ): Promise<LockedDiscountCreditUnit[]>;
  persistBookingDraft(
    draft: PersistBookingDraft,
  ): Promise<{ bookingId: string }>;
}

export interface BookingWorkflowRepository {
  transaction<T>(
    work: (transaction: BookingWorkflowTransaction) => Promise<T>,
  ): Promise<T>;
}

export interface TourBookingDraftResponse {
  bookingId: string;
  currency: 'INR';
  grossTourTotal: number;
  totalDiscount: number;
  finalTourTotal: number;
  instantBookingCharge: number;
  grandTotal: number;
  amountDueNow: number;
  balanceDueLater: number;
  reservedCreditUnits: Array<{
    creditUnitId: string;
    travelerKey: string;
    creditValue: number;
  }>;
}

function validateInput(input: CreateTourBookingInput): void {
  if (!input.userId || !input.tourId || !input.departureId) {
    throw new Error('BOOKING_REFERENCE_INVALID');
  }
  if (!['fixed_departure', 'customized_tailor_made'].includes(input.bookingType)) {
    throw new Error('BOOKING_TYPE_INVALID');
  }
  if (input.travelers.length < 1 || input.travelers.length > 20) {
    throw new Error('TRAVELER_COUNT_INVALID');
  }

  const travelerKeys = input.travelers.map((traveler) => traveler.travelerKey.trim());
  if (travelerKeys.some((key) => !key) || new Set(travelerKeys).size !== travelerKeys.length) {
    throw new Error('TRAVELER_KEY_INVALID');
  }
  if (input.travelers.some((traveler) => !traveler.firstName.trim() || !traveler.lastName.trim())) {
    throw new Error('TRAVELER_NAME_REQUIRED');
  }

  const assignedTravelers = input.creditAssignments.map((assignment) => assignment.travelerKey);
  if (new Set(assignedTravelers).size !== assignedTravelers.length) {
    throw new Error('ONE_CREDIT_PER_TRAVELER');
  }
  if (assignedTravelers.some((key) => !travelerKeys.includes(key))) {
    throw new Error('CREDIT_TRAVELER_INVALID');
  }

  const creditUnitIds = input.creditAssignments.map((assignment) => assignment.creditUnitId);
  if (new Set(creditUnitIds).size !== creditUnitIds.length) {
    throw new Error('CREDIT_UNIT_DUPLICATE');
  }
}

export async function createTourBookingDraft(
  repository: BookingWorkflowRepository,
  input: CreateTourBookingInput,
): Promise<TourBookingDraftResponse> {
  validateInput(input);

  return repository.transaction(async (transaction) => {
    const departure = await transaction.getTourDepartureForUpdate(
      input.tourId,
      input.departureId,
    );
    if (!departure || departure.tourId !== input.tourId || departure.departureId !== input.departureId) {
      throw new Error('TOUR_DEPARTURE_NOT_FOUND');
    }
    if (departure.status !== 'open') throw new Error('TOUR_DEPARTURE_CLOSED');
    if (departure.capacityRemaining < input.travelers.length) {
      throw new Error('DEPARTURE_CAPACITY_EXCEEDED');
    }
    if (
      departure.currency !== 'INR'
      || !Number.isSafeInteger(departure.basePricePerTraveler)
      || departure.basePricePerTraveler <= 0
    ) {
      throw new Error('TOUR_PRICE_INVALID');
    }

    const requestedUnitIds = input.creditAssignments.map(
      (assignment) => assignment.creditUnitId,
    );
    const creditUnits = requestedUnitIds.length
      ? await transaction.getCreditUnitsForUpdate(input.userId, requestedUnitIds)
      : [];
    if (creditUnits.length !== requestedUnitIds.length) {
      throw new Error('CREDIT_UNIT_NOT_AVAILABLE');
    }

    const creditById = new Map(creditUnits.map((unit) => [unit.id, unit]));
    const reservedUntil = new Date(Date.now() + 20 * 60_000).toISOString();
    const creditReservations = input.creditAssignments.map((assignment) => {
      const unit = creditById.get(assignment.creditUnitId);
      if (!unit || unit.userId !== input.userId || unit.status !== 'available') {
        throw new Error('CREDIT_UNIT_NOT_AVAILABLE');
      }
      if (unit.category !== departure.category) {
        throw new Error('CREDIT_CATEGORY_MISMATCH');
      }
      const expectedValue = departure.category === 'international' ? 5_000 : 500;
      if (unit.value !== expectedValue) throw new Error('CREDIT_VALUE_INVALID');
      return {
        creditUnitId: unit.id,
        travelerKey: assignment.travelerKey,
        creditValue: unit.value,
        reservedUntil,
      };
    });

    const grossTourTotal = departure.basePricePerTraveler * input.travelers.length;
    const totalDiscount = creditReservations.reduce(
      (total, reservation) => total + reservation.creditValue,
      0,
    );
    const finalTourTotal = grossTourTotal - totalDiscount;
    if (!Number.isSafeInteger(finalTourTotal) || finalTourTotal <= 0) {
      throw new Error('BOOKING_TOTAL_INVALID');
    }

    const paymentPlan = calculateAdvancePaymentPlan({
      baseTourTotal: finalTourTotal,
      selectedDate: departure.departureDate,
      tourCategory: departure.category,
      bookingType: input.bookingType,
      instantBookingRequired: input.instantBookingRequired,
    });
    const saved = await transaction.persistBookingDraft({
      userId: input.userId,
      tourId: input.tourId,
      departureId: input.departureId,
      tourName: departure.tourName,
      category: departure.category,
      bookingType: input.bookingType,
      currency: 'INR',
      departureDate: departure.departureDate,
      travelers: input.travelers,
      pickup: input.pickup,
      grossTourTotal,
      totalDiscount,
      finalTourTotal,
      instantBookingCharge: paymentPlan.instantBookingCharge,
      grandTotal: paymentPlan.grandTotal,
      amountDueNow: paymentPlan.advanceDueNow,
      balanceDueLater: paymentPlan.balanceDueLater,
      installments: paymentPlan.installments.map((installment, index) => ({
        sequenceNo: index + 1,
        label: installment.label,
        percentage: installment.percentage,
        amount: installment.amount,
        status: installment.status,
        dueLabel: installment.dueLabel,
      })),
      creditReservations,
    });

    return {
      bookingId: saved.bookingId,
      currency: 'INR',
      grossTourTotal,
      totalDiscount,
      finalTourTotal,
      instantBookingCharge: paymentPlan.instantBookingCharge,
      grandTotal: paymentPlan.grandTotal,
      amountDueNow: paymentPlan.advanceDueNow,
      balanceDueLater: paymentPlan.balanceDueLater,
      reservedCreditUnits: creditReservations.map((reservation) => ({
        creditUnitId: reservation.creditUnitId,
        travelerKey: reservation.travelerKey,
        creditValue: reservation.creditValue,
      })),
    };
  });
}
