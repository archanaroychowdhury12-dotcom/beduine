import { CreditLedgerEntry, TripCategory } from '../types';

export const CREDIT_VALUE_DOMESTIC = 500;
export const CREDIT_VALUE_INTERNATIONAL = 5000;

export function getCreditValue(category: TripCategory): number {
  return category === 'international' ? CREDIT_VALUE_INTERNATIONAL : CREDIT_VALUE_DOMESTIC;
}

export function getAvailableCredits(
  ledger: CreditLedgerEntry[],
  category: TripCategory
): number {
  return ledger.reduce((sum, entry) => {
    if (entry.creditCategory !== category) return sum;
    if (entry.type === 'issued' || entry.type === 'admin_adjustment' || entry.type === 'reversed') {
      return sum + entry.amount;
    }
    if (entry.type === 'redeemed' || entry.type === 'expired' || entry.type === 'reserved') {
      return sum - entry.amount;
    }
    return sum;
  }, 0);
}

export interface CreditValidationResult {
  valid: boolean;
  error?: string;
}

export function validateCreditApplication({
  requestedCredits,
  tourCategory,
  availableDomesticCredits,
  availableInternationalCredits,
  travelerCount,
}: {
  requestedCredits: number;
  tourCategory: TripCategory;
  availableDomesticCredits: number;
  availableInternationalCredits: number;
  travelerCount: number;
}): CreditValidationResult {
  if (requestedCredits <= 0) return { valid: true };

  if (tourCategory === 'domestic') {
    if (requestedCredits > availableDomesticCredits) {
      return { valid: false, error: 'You do not have enough Domestic Discount Credits.' };
    }
  } else {
    if (requestedCredits > availableInternationalCredits) {
      return { valid: false, error: 'You do not have enough International Discount Credits.' };
    }
  }

  if (requestedCredits > travelerCount) {
    return { valid: false, error: 'Only one Discount Credit can be applied per traveler.' };
  }

  return { valid: true };
}

export function getCategoryErrorMessage(
  creditCategory: TripCategory,
  checkoutCategory: TripCategory
): string | undefined {
  if (creditCategory === 'international' && checkoutCategory === 'domestic') {
    return 'International Discount Credits can only be used for International bookings.';
  }
  if (creditCategory === 'domestic' && checkoutCategory === 'international') {
    return 'Domestic Discount Credits can only be used for Domestic bookings.';
  }
  return undefined;
}
