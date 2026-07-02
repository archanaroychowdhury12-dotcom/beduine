import { ALL_PLANS, getPlanByIdOrName } from '../data/siteData';
import type { AppUserMetadata, CreditLedgerEntry, PlanData, SupabaseRawUser, TripCategory } from '../types';

const NON_WINNER_CYCLE_PREFIX = 'TXN-NWDC';

export type NonWinnerCreditEligibilityStatus =
  | 'eligible'
  | 'already_issued'
  | 'subscription_inactive'
  | 'payment_not_verified'
  | 'not_marked_non_winner'
  | 'cycle_mismatch'
  | 'winner_cannot_receive_non_winner_credit'
  | 'invalid_plan';

export interface NonWinnerCreditEligibilityResult {
  eligible: boolean;
  status: NonWinnerCreditEligibilityStatus;
  reason: string;
  plan?: PlanData;
  creditCount?: number;
  creditValue?: number;
  category?: TripCategory;
}

export interface ApplyNonWinnerCreditResult {
  user: SupabaseRawUser;
  issued: boolean;
  reason: string;
  entry?: CreditLedgerEntry;
  eligibility: NonWinnerCreditEligibilityResult;
}

function makeTxId(cycleId: string, index = 1) {
  return `${NON_WINNER_CYCLE_PREFIX}-${cycleId}-${index}-${Math.floor(100000 + Math.random() * 900000)}`;
}

function dateLabel() {
  return new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function normalizePlanToken(value?: string | null): string {
  return String(value || '')
    .toLowerCase()
    .replace(/plan/g, '')
    .replace(/domestic/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getPlanCategoryFromMetadata(metadata?: AppUserMetadata): TripCategory {
  const planType = String(metadata?.planType || '').toLowerCase();
  const planName = String(metadata?.planName || '').toLowerCase();
  if (planType.includes('international') || planName.includes('international') || planName.includes('intl')) {
    return 'international';
  }
  return 'domestic';
}

export function getNonWinnerCreditValue(category: TripCategory) {
  return category === 'international' ? 5000 : 500;
}

export function resolvePlanFromMetadata(metadata?: AppUserMetadata): PlanData | undefined {
  const category = getPlanCategoryFromMetadata(metadata);
  const planName = normalizePlanToken(String(metadata?.planName || ''));
  const keySuffix = category === 'international' ? '_Int' : '';

  if (planName.includes('platinum') || planName.includes('premium') || planName.includes('vip')) {
    return ALL_PLANS[`Platinum${keySuffix}`];
  }
  if (planName.includes('gold') || planName.includes('international')) {
    return ALL_PLANS[`Gold${keySuffix}`];
  }
  if (planName.includes('silver') || planName.includes('domestic')) {
    return ALL_PLANS[`Silver${keySuffix}`];
  }

  // Fallback by stored category if the plan name is missing.
  return category === 'international' ? ALL_PLANS.Silver_Int : undefined;
}

export function hasNonWinnerCreditForCycle(ledger: CreditLedgerEntry[] = [], cycleId: string) {
  return ledger.some((entry) => entry.type === 'issued' && entry.creditType === 'discount' && entry.adminRef === `NON_WINNER_${cycleId}`);
}

export function buildNonWinnerCreditEntry({
  category,
  cycleId,
  creditCount,
  source = 'demo',
}: {
  category: TripCategory;
  cycleId: string;
  creditCount: number;
  source?: 'demo' | 'real';
}): CreditLedgerEntry {
  const creditValue = getNonWinnerCreditValue(category);
  return {
    id: makeTxId(cycleId),
    date: dateLabel(),
    type: 'issued',
    creditType: 'discount',
    amount: creditCount,
    reason: `Non-winner Discount Credit(s) issued after Lucky Draw/TCR participation for ${cycleId}`,
    source,
    adminRef: `NON_WINNER_${cycleId}`,
    creditCategory: category,
    creditValue,
    usableFor: category === 'international' ? 'international_only' : 'domestic_only',
  };
}

export function validateNonWinnerCreditEligibility(
  user: SupabaseRawUser,
  cycleId: string,
): NonWinnerCreditEligibilityResult {
  const metadata = user.user_metadata || {};
  const ledger = metadata.ledger || [];
  const plan = resolvePlanFromMetadata(metadata);

  if (!plan) {
    return { eligible: false, status: 'invalid_plan', reason: 'No valid subscription plan found for this user.' };
  }

  if (metadata.subscriptionStatus !== 'active') {
    return { eligible: false, status: 'subscription_inactive', reason: 'Subscription is not active.', plan };
  }

  const paymentStatus = metadata.subscription_payment_record?.payment_status;
  if (paymentStatus !== 'success') {
    return { eligible: false, status: 'payment_not_verified', reason: 'Subscription payment is not webhook-verified as successful.', plan };
  }

  if (metadata.weekly_participation_cycle_id && metadata.weekly_participation_cycle_id !== cycleId) {
    return { eligible: false, status: 'cycle_mismatch', reason: 'User participation cycle does not match the requested non-winner credit cycle.', plan };
  }

  if (metadata.weekly_participation_status === 'winner' || metadata.selected_member_benefit_status === 'winner') {
    return { eligible: false, status: 'winner_cannot_receive_non_winner_credit', reason: 'Winner accounts cannot receive non-winner Discount Credits for the same cycle.', plan };
  }

  // Check duplicate issuance before checking current participation status because a successfully issued account
  // is intentionally moved from `non_winner` to `non_winner_credit_issued`.
  if (hasNonWinnerCreditForCycle(ledger, cycleId)) {
    return { eligible: false, status: 'already_issued', reason: 'Non-winner Discount Credit was already issued for this cycle.', plan };
  }

  if (metadata.weekly_participation_status !== 'non_winner') {
    return { eligible: false, status: 'not_marked_non_winner', reason: 'User must be marked as non-winner after draw result before issuing Discount Credits.', plan };
  }

  const category = plan.category;
  const creditCount = plan.discountCredits ?? plan.credits;
  const creditValue = plan.creditValue;

  return {
    eligible: true,
    status: 'eligible',
    reason: `${creditCount} ${category} Discount Credit(s) can be issued for this non-winner cycle.`,
    plan,
    creditCount,
    creditValue,
    category,
  };
}

export function applyNonWinnerDiscountCredit(user: SupabaseRawUser, cycleId: string): ApplyNonWinnerCreditResult {
  const metadata = user.user_metadata || {};
  const ledger = metadata.ledger || [];
  const eligibility = validateNonWinnerCreditEligibility(user, cycleId);

  if (!eligibility.eligible || !eligibility.category || !eligibility.creditCount) {
    return { user, issued: false, reason: eligibility.reason, eligibility };
  }

  const source = metadata.subscription_source === 'real' ? 'real' : 'demo';
  const entry = buildNonWinnerCreditEntry({
    category: eligibility.category,
    cycleId,
    creditCount: eligibility.creditCount,
    source,
  });

  const updatedUser: SupabaseRawUser = {
    ...user,
    user_metadata: {
      ...metadata,
      ledger: [entry, ...ledger],
      discount_credits: (metadata.discount_credits || 0) + entry.amount,
      weekly_participation_status: 'non_winner_credit_issued',
      weekly_non_winner_credit_cycle: cycleId,
    },
  };

  return {
    issued: true,
    user: updatedUser,
    entry,
    reason: eligibility.reason,
    eligibility,
  };
}

export function getPlanCreditLabel(planIdOrName: string) {
  const plan = getPlanByIdOrName(planIdOrName) || resolvePlanFromMetadata({ planName: planIdOrName });
  if (!plan) return 'Discount Credit';
  const totalValue = plan.discountCredits * plan.creditValue;
  const categoryLabel = plan.category === 'international' ? 'International' : 'Domestic';
  return `${plan.discountCredits} × ₹${plan.creditValue.toLocaleString('en-IN')} ${categoryLabel} Discount Credit(s) = ₹${totalValue.toLocaleString('en-IN')} total value`;
}
