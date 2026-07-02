import { getPlanByIdOrName } from '../../data/siteData';
import { CreditLedgerEntry, PlanData, SupabaseRawUser } from '../../types';
import { VerifiedPaymentEvent } from './payment.types';

export interface EntitlementAuditSink {
  logAdminAction(event: Record<string, unknown>): void;
}

const noopEntitlementAuditSink: EntitlementAuditSink = {
  logAdminAction: () => undefined,
};

export type EntitlementApplyResult = {
  success: boolean;
  message: string;
  user?: SupabaseRawUser;
};

function txId(prefix: string) {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

function dateLabel() {
  return new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function buildSubscriptionLedgerEntries(_plan: PlanData, source: 'demo' | 'real'): CreditLedgerEntry[] {
  // Business rule: buying a subscription activates TRC/Lucky Draw entry only.
  // ₹500/₹5,000 Discount Credits are NOT issued at checkout anymore.
  // They are issued later only to eligible non-winners after a Lucky Draw/TCR cycle.
  return [
    {
      id: txId('TXN-TRC'),
      date: dateLabel(),
      type: 'issued',
      creditType: 'lucky_draw',
      amount: _plan.trcCredits || 1,
      reason: 'Subscription activation TRC/Lucky Draw participation token issued. Discount Credits unlock only for eligible non-winners after the draw result.',
      source,
      creditCategory: 'travel_winner benefit',
      creditValue: 1,
      usableFor: 'lucky_draw',
    },
  ];
}

export function markPaymentProblem(user: SupabaseRawUser, event: VerifiedPaymentEvent, auditSink: EntitlementAuditSink = noopEntitlementAuditSink): SupabaseRawUser {
  const problemStatus =
    event.status === 'refunded'
      ? 'refunded'
      : event.status === 'chargeback'
        ? 'chargeback'
        : 'failed';

  user.user_metadata = {
    ...user.user_metadata,
    subscriptionStatus: problemStatus === 'failed' ? 'inactive' : user.user_metadata?.subscriptionStatus || 'inactive',
    payment_hold_status: problemStatus,
    subscription_payment_record: {
      ...(user.user_metadata?.subscription_payment_record || {}),
      payment_status: problemStatus,
      last_payment_event_id: event.id,
      updated_at: event.created_at,
    },
  };

  auditSink.logAdminAction({
    action:
      problemStatus === 'refunded'
        ? 'SUBSCRIPTION_PAYMENT_REFUNDED'
        : problemStatus === 'chargeback'
          ? 'SUBSCRIPTION_CHARGEBACK_RECORDED'
          : 'SUBSCRIPTION_PAYMENT_FAILED',
    actor: { id: 'system-webhook', email: `${event.provider}-webhook@beduine.system`, role: 'admin' },
    targetId: event.userId,
    amount: event.amount,
    status: problemStatus === 'failed' ? 'failed' : 'success',
    reason: `Payment event marked as ${problemStatus}`,
    metadata: { eventId: event.id, sessionId: event.sessionId, provider: event.provider },
  });

  return user;
}

export function activateSubscriptionFromVerifiedPayment(user: SupabaseRawUser, event: VerifiedPaymentEvent, auditSink: EntitlementAuditSink = noopEntitlementAuditSink): EntitlementApplyResult {
  const plan = getPlanByIdOrName(event.planId);
  if (!plan) return { success: false, message: 'Invalid plan selected' };

  if (!event.verified || event.status !== 'verified') {
    return { success: false, message: 'Payment has not been verified by webhook.' };
  }

  const source = event.paymentMethod === 'demo_wallet' ? 'demo' : 'real';
  const currentLedger = user.user_metadata?.ledger || [];
  const newLedgerEntries = buildSubscriptionLedgerEntries(plan, source);
  const updatedLedger = [...currentLedger, ...newLedgerEntries];
  const existingDemoTransactions = user.user_metadata?.demo_transactions || [];
  const existingRealTransactions = user.user_metadata?.real_transactions || [];

  const paymentTxn = {
    id: source === 'demo' ? txId('DEMO-TXN') : txId('REAL-TXN'),
    userId: user.id,
    amount: event.paymentMethod === 'demo_wallet' ? -event.amount : event.amount,
    transaction_type: (event.paymentMethod === 'demo_wallet' ? 'debit' : 'credit') as 'debit' | 'credit',
    wallet_type: source as 'demo' | 'real',
    payment_type: event.paymentMethod,
    reason: `${event.verificationSource === 'simulated_webhook' ? 'Simulated webhook verified' : 'Provider webhook verified'} subscription checkout: ${plan.name}`,
    status: 'success' as const,
    provider: event.provider,
    payment_event_id: event.id,
    checkout_session_id: event.sessionId,
    created_at: event.created_at,
  };

  const planPrice = plan.price;
  const nextDemoBalance =
    event.paymentMethod === 'demo_wallet'
      ? Math.max(0, (user.user_metadata?.demo_wallet_balance ?? 0) - planPrice)
      : user.user_metadata?.demo_wallet_balance ?? 0;

  user.user_metadata = {
    ...user.user_metadata,
    planName: plan.name,
    planPrice: `₹${planPrice}`,
    planType: plan.category,
    subscriptionStatus: 'active',
    subscription_source: source,
    payment_type: event.paymentMethod,
    payment_hold_status: null,
    subscription_payment_record: {
      transaction_id: event.id,
      checkout_session_id: event.sessionId,
      provider: event.provider,
      payment_status: 'success',
      planName: plan.name,
      planPrice: `₹${planPrice}`,
      planType: plan.category,
      subscription_source: source,
      payment_type: event.paymentMethod,
      verified_by: event.verificationSource,
      activated_at: new Date().toISOString(),
    },
    demo_wallet_balance: nextDemoBalance,
    demo_transactions: event.paymentMethod === 'demo_wallet' ? [paymentTxn, ...existingDemoTransactions] : existingDemoTransactions,
    real_transactions: event.paymentMethod === 'real_payment' ? [paymentTxn, ...existingRealTransactions] : existingRealTransactions,
    ledger: updatedLedger,
    discount_credits: user.user_metadata?.discount_credits ?? 0,
    weekly_eligible_entry_count: plan.trcCredits || 1,
    weekly_participation_status: 'not_activated',
    selected_member_benefit_status: 'none',
  };

  auditSink.logAdminAction({
    action: 'SUBSCRIPTION_ACTIVATED',
    actor: { id: 'system-webhook', email: `${event.provider}-webhook@beduine.system`, role: 'admin' },
    targetId: user.id,
    targetEmail: user.email ?? undefined,
    amount: event.amount,
    reason: `Subscription activated only after ${event.verificationSource} verification`,
    metadata: { eventId: event.id, sessionId: event.sessionId, planId: event.planId },
  });

  return {
    success: true,
    message:
      event.verificationSource === 'simulated_webhook'
        ? 'Simulated webhook verified. Subscription activated for client demo.'
        : 'Payment webhook verified. Subscription activated.',
    user,
  };
}
