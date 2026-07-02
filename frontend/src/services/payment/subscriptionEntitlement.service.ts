// UI Stub for Subscription Entitlements
import { CreditLedgerEntry, PlanData, SupabaseRawUser } from '@/types';
import { VerifiedPaymentEvent } from './payment.types';

export type EntitlementApplyResult = {
  success: boolean;
  message: string;
  user?: SupabaseRawUser;
};

export function buildSubscriptionLedgerEntries(_plan: PlanData, _source: 'demo' | 'real'): CreditLedgerEntry[] {
  return [];
}

export function markPaymentProblem(user: SupabaseRawUser, _event: VerifiedPaymentEvent): SupabaseRawUser {
  return user;
}

export function activateSubscriptionFromVerifiedPayment(user: SupabaseRawUser, _event: VerifiedPaymentEvent): EntitlementApplyResult {
  return { success: true, message: 'Simulated subscription activated.', user };
}
