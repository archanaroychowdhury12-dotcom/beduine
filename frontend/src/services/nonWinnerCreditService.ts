// UI Stub for Non-Winner Credit Service - Simplifies credit calculations for the UI.
import { AppUserMetadata, CreditLedgerEntry, SupabaseRawUser, TripCategory } from '@/types';

export function getPlanCategoryFromMetadata(metadata?: AppUserMetadata): TripCategory {
  const planName = String(metadata?.planName || '').toLowerCase();
  if (planName.includes('international') || planName.includes('intl')) {
    return 'international';
  }
  return 'domestic';
}

export function getNonWinnerCreditValue(category: TripCategory) {
  return category === 'international' ? 5000 : 500;
}

export function hasNonWinnerCreditForCycle(ledger: CreditLedgerEntry[] = [], cycleId: string) {
  return ledger.some((entry) => (
    entry.creditType === 'discount'
    && entry.adminRef === `NON_WINNER_${cycleId}`
    && entry.type === 'issued'
  ));
}

export function buildNonWinnerCreditEntry({
  category,
  cycleId,
  source = 'demo',
}: {
  category: TripCategory;
  cycleId: string;
  source?: 'demo' | 'real';
}): CreditLedgerEntry {
  return {
    id: `NWDC-${cycleId}-${Date.now()}`,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    type: 'issued',
    creditType: 'discount',
    amount: 1,
    reason: `Non-winner credit for ${cycleId}`,
    source,
    adminRef: `NON_WINNER_${cycleId}`,
    creditCategory: category,
    creditValue: getNonWinnerCreditValue(category),
    usableFor: category === 'international' ? 'international_only' : 'domestic_only',
  };
}

export function applyNonWinnerDiscountCredit(user: SupabaseRawUser, cycleId: string): {
  user: SupabaseRawUser;
  issued: boolean;
  issuedUnits: number;
} {
  const metadata = user.user_metadata || {};
  const ledger = metadata.ledger || [];
  if (hasNonWinnerCreditForCycle(ledger, cycleId)) {
    return { user, issued: false, issuedUnits: 0 };
  }

  const planName = String(metadata.planName || '').toLowerCase();
  const issuedUnits = planName.includes('platinum') ? 4 : planName.includes('gold') ? 2 : 1;
  const category = getPlanCategoryFromMetadata(metadata);
  const entries = Array.from({ length: issuedUnits }, (_, index) => ({
    ...buildNonWinnerCreditEntry({ category, cycleId }),
    id: `NWDC-${cycleId}-${user.id}-${index + 1}`,
  }));

  return {
    issued: true,
    issuedUnits,
    user: {
      ...user,
      user_metadata: {
        ...metadata,
        ledger: [...entries, ...ledger],
        discount_credits: (metadata.discount_credits || 0) + issuedUnits,
        weekly_non_winner_credit_cycle: cycleId,
        weekly_participation_status: 'non_winner_credit_issued',
        selected_member_benefit_status: 'non_winner',
      },
    },
  };
}

export function getPlanCreditLabel(planIdOrName: string) {
  const category = planIdOrName.toLowerCase().includes('international') ? 'international' : 'domestic';
  return category === 'international' ? '₹5,000 International Discount Credit' : '₹500 Domestic Discount Credit';
}
