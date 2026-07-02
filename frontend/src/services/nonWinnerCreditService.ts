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

export function hasNonWinnerCreditForCycle(_ledger: CreditLedgerEntry[] = [], _cycleId: string) {
  return false;
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
    id: `MOCK-NWDC-${Date.now()}`,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    type: 'issued',
    creditType: 'discount',
    amount: 1,
    reason: `MOCK: Non-winner credit for ${cycleId}`,
    source,
    adminRef: `NON_WINNER_${cycleId}`,
    creditCategory: category,
    creditValue: getNonWinnerCreditValue(category),
    usableFor: category === 'international' ? 'international_only' : 'domestic_only',
  };
}

export function applyNonWinnerDiscountCredit(user: SupabaseRawUser, _cycleId: string): { user: SupabaseRawUser; issued: boolean } {
  return { user, issued: false };
}

export function getPlanCreditLabel(planIdOrName: string) {
  const category = planIdOrName.toLowerCase().includes('international') ? 'international' : 'domestic';
  return category === 'international' ? '₹5,000 International Discount Credit' : '₹500 Domestic Discount Credit';
}
