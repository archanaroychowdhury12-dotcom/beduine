import { CreditLedgerEntry, TripCategory } from '../types';
import { getAvailableCredits, CREDIT_VALUE_DOMESTIC, CREDIT_VALUE_INTERNATIONAL } from './creditHelpers';

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

  // Rule 2: Balance check from ledger
  const availableBalance = getAvailableCredits(ledger, tourCategory);
  if (appliedCredits > availableBalance) {
    return {
      valid: false,
      error: `Insufficient ${tourCategory} credits. Available: ${availableBalance}, Requested: ${appliedCredits}.`
    };
  }

  // Rule 3: Per-traveler limit
  if (appliedCredits > travelerCount) {
    return {
      valid: false,
      error: `Maximum ${travelerCount} credit(s) allowed (1 per traveler). Requested: ${appliedCredits}.`
    };
  }

  const creditValue = tourCategory === 'international' ? CREDIT_VALUE_INTERNATIONAL : CREDIT_VALUE_DOMESTIC;

  return {
    valid: true,
    validatedCategory: tourCategory,
    validatedCredits: appliedCredits,
    validatedValue: appliedCredits * creditValue
  };
}
