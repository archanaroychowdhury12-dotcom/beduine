import { CreditLedgerEntry, TripCategory } from '../types';
import { CREDIT_VALUE_DOMESTIC, CREDIT_VALUE_INTERNATIONAL } from './creditHelpers';
import { validateDiscountCreditPolicy } from '../credits/discountCreditPolicy';

export interface CreditRedemptionValidation {
  valid: boolean;
  error?: string;
  validatedCategory?: TripCategory;
  validatedCredits?: number;
  validatedValue?: number;
}

/**
 * Server-side style validation for credit redemption.
 * Validates that:
 * 1. Credit category matches tour category (domestic DC → domestic tour only)
 * 2. User has enough credits in the correct category
 * 3. Credits don't exceed traveler count (1 per traveler max)
 * 4. Ledger balance is sufficient
 */
export function validateCreditRedemptionServerSide({
  appliedCredits,
  creditCategory,
  tourCategory,
  ledger,
  travelerCount,
}: {
  appliedCredits: number;
  creditCategory: TripCategory;
  tourCategory: TripCategory;
  ledger: CreditLedgerEntry[];
  travelerCount: number;
}): CreditRedemptionValidation {
  if (appliedCredits <= 0) return { valid: true };

  // Rule 1: Category match enforcement
  if (creditCategory !== tourCategory) {
    const creditLabel = creditCategory === 'domestic' ? 'Domestic' : 'International';
    const tourLabel = tourCategory === 'domestic' ? 'Domestic' : 'International';
    return {
      valid: false,
      error: `${creditLabel} Discount Credits cannot be applied to ${tourLabel} tour bookings. Please use ${tourLabel} credits.`
    };
  }

  const pseudoTravelers = Array.from({ length: Math.max(0, travelerCount) }, (_, index) => ({
    id: `traveler-${index + 1}`,
    firstName: `Traveler`,
    lastName: String(index + 1),
    email: '',
    phone: '',
  }));

  const policy = validateDiscountCreditPolicy({
    operation: 'booking_discount',
    requestedCredits: appliedCredits,
    creditCategory,
    tourCategory,
    ledger,
    travelers: pseudoTravelers,
  });

  if (!policy.valid) {
    return { valid: false, error: policy.error };
  }

  const creditValue = tourCategory === 'international' ? CREDIT_VALUE_INTERNATIONAL : CREDIT_VALUE_DOMESTIC;

  return {
    valid: true,
    validatedCategory: tourCategory,
    validatedCredits: appliedCredits,
    validatedValue: appliedCredits * creditValue
  };
}
