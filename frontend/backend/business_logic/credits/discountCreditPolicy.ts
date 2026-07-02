import type { CreditLedgerEntry, TripCategory, Traveler } from '../types';
import { CREDIT_VALUE_DOMESTIC, CREDIT_VALUE_INTERNATIONAL, getAvailableCredits } from '../utils/creditHelpers';

export type DiscountCreditOperation = 'booking_discount' | 'cash_redeem' | 'transfer' | 'sell' | 'manual_adjustment';

export interface DiscountCreditPolicyInput {
  operation: DiscountCreditOperation;
  requestedCredits: number;
  tourCategory: TripCategory;
  creditCategory: TripCategory;
  ledger: CreditLedgerEntry[];
  travelers: Array<Pick<Traveler, 'firstName' | 'lastName' | 'email' | 'phone'> & { id?: string }>;
  travelerCreditAssignments?: Array<{ travelerKey: string; credits: number }>;
}

export interface DiscountCreditPolicyResult {
  valid: boolean;
  error?: string;
  creditValue: number;
  totalDiscount: number;
  maxAllowedCredits: number;
  availableCredits: number;
  policyRules: string[];
}

export const DISCOUNT_CREDIT_POLICY_RULES = [
  '1 Domestic Discount Credit = 1 person = ₹500 domestic tour discount.',
  '1 International Discount Credit = 1 person = ₹5,000 international tour discount.',
  'Maximum 1 Discount Credit can be applied per person per tour booking.',
  'Multiple Discount Credits cannot be combined for one person’s tour cost.',
  'Discount Credits cannot be redeemed as cash, transferred, or sold.',
] as const;

export function getDiscountCreditUnitValue(category: TripCategory): number {
  return category === 'international' ? CREDIT_VALUE_INTERNATIONAL : CREDIT_VALUE_DOMESTIC;
}

function travelerKey(traveler: DiscountCreditPolicyInput['travelers'][number], index: number): string {
  return traveler.id || traveler.email || traveler.phone || `${traveler.firstName}-${traveler.lastName}-${index}`;
}

export function validateDiscountCreditPolicy(input: DiscountCreditPolicyInput): DiscountCreditPolicyResult {
  const creditValue = getDiscountCreditUnitValue(input.tourCategory);
  const travelers = input.travelers || [];
  const requestedCredits = Math.max(0, Math.floor(input.requestedCredits || 0));
  const maxAllowedCredits = travelers.length;
  const availableCredits = getAvailableCredits(input.ledger || [], input.tourCategory);

  if (input.operation !== 'booking_discount' && input.operation !== 'manual_adjustment') {
    return {
      valid: false,
      error: 'Discount Credits cannot be redeemed as cash, transferred, or sold. They can only be used as eligible booking discounts.',
      creditValue,
      totalDiscount: 0,
      maxAllowedCredits,
      availableCredits,
      policyRules: [...DISCOUNT_CREDIT_POLICY_RULES],
    };
  }

  if (requestedCredits <= 0) {
    return {
      valid: true,
      creditValue,
      totalDiscount: 0,
      maxAllowedCredits,
      availableCredits,
      policyRules: [...DISCOUNT_CREDIT_POLICY_RULES],
    };
  }

  if (input.creditCategory !== input.tourCategory) {
    const creditLabel = input.creditCategory === 'international' ? 'International' : 'Domestic';
    const tourLabel = input.tourCategory === 'international' ? 'International' : 'Domestic';
    return {
      valid: false,
      error: `${creditLabel} Discount Credits cannot be used for ${tourLabel} bookings.`,
      creditValue,
      totalDiscount: 0,
      maxAllowedCredits,
      availableCredits,
      policyRules: [...DISCOUNT_CREDIT_POLICY_RULES],
    };
  }

  if (requestedCredits > availableCredits) {
    return {
      valid: false,
      error: `Insufficient ${input.tourCategory} Discount Credits. Available: ${availableCredits}, requested: ${requestedCredits}.`,
      creditValue,
      totalDiscount: 0,
      maxAllowedCredits,
      availableCredits,
      policyRules: [...DISCOUNT_CREDIT_POLICY_RULES],
    };
  }

  if (requestedCredits > maxAllowedCredits) {
    return {
      valid: false,
      error: `Only 1 Discount Credit per traveler can be applied. Travelers: ${maxAllowedCredits}, requested credits: ${requestedCredits}.`,
      creditValue,
      totalDiscount: 0,
      maxAllowedCredits,
      availableCredits,
      policyRules: [...DISCOUNT_CREDIT_POLICY_RULES],
    };
  }

  const assignments = input.travelerCreditAssignments || travelers.slice(0, requestedCredits).map((traveler, index) => ({
    travelerKey: travelerKey(traveler, index),
    credits: 1,
  }));

  const seen = new Set<string>();
  for (const assignment of assignments) {
    if (assignment.credits > 1) {
      return {
        valid: false,
        error: 'Multiple Discount Credits cannot be combined for one person’s tour cost.',
        creditValue,
        totalDiscount: 0,
        maxAllowedCredits,
        availableCredits,
        policyRules: [...DISCOUNT_CREDIT_POLICY_RULES],
      };
    }
    if (seen.has(assignment.travelerKey)) {
      return {
        valid: false,
        error: 'A traveler can receive only 1 Discount Credit on the same tour booking.',
        creditValue,
        totalDiscount: 0,
        maxAllowedCredits,
        availableCredits,
        policyRules: [...DISCOUNT_CREDIT_POLICY_RULES],
      };
    }
    seen.add(assignment.travelerKey);
  }

  if (assignments.length !== requestedCredits) {
    return {
      valid: false,
      error: 'Each applied Discount Credit must be assigned to exactly one traveler.',
      creditValue,
      totalDiscount: 0,
      maxAllowedCredits,
      availableCredits,
      policyRules: [...DISCOUNT_CREDIT_POLICY_RULES],
    };
  }

  return {
    valid: true,
    creditValue,
    totalDiscount: requestedCredits * creditValue,
    maxAllowedCredits,
    availableCredits,
    policyRules: [...DISCOUNT_CREDIT_POLICY_RULES],
  };
}

export function buildDiscountCreditRedemptionLedgerEntry({
  userId,
  bookingRef,
  category,
  credits,
  source = 'real',
}: {
  userId: string;
  bookingRef: string;
  category: TripCategory;
  credits: number;
  source?: 'demo' | 'real';
}): CreditLedgerEntry & { userId: string } {
  const value = getDiscountCreditUnitValue(category);
  return {
    id: `DC-REDEEM-${bookingRef}-${Date.now()}`,
    userId,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    type: 'redeemed',
    creditType: 'discount',
    amount: credits,
    reason: `Discount Credit redeemed for booking ${bookingRef}`,
    bookingRef,
    source,
    creditCategory: category,
    creditValue: value,
    usableFor: category === 'international' ? 'international_only' : 'domestic_only',
  };
}
