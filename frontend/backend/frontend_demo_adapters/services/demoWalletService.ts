import { supabase } from '../utils/supabaseClient';
import { getPlanByIdOrName } from '../data/siteData';
import { auditLogService } from './auditLogService';
import { createCheckoutSession, verifyPaymentWebhook } from './payment/paymentGateway';
import { activateSubscriptionFromVerifiedPayment, markPaymentProblem } from './payment/subscriptionEntitlement.service';
import { SupabaseRawUser } from '../types';

export interface DemoTransaction {
  id: string;
  userId: string;
  amount: number;
  transaction_type: 'credit' | 'debit';
  wallet_type: 'real' | 'demo';
  payment_type: 'real_payment' | 'demo_wallet';
  reason: string;
  status: 'success' | 'failed' | 'pending';
  created_at: string;
}

export interface CheckoutResult {
  success: boolean;
  message: string;
  user?: SupabaseRawUser;
  checkoutSessionId?: string;
  verificationSource?: 'simulated_webhook' | 'provider_webhook' | 'manual_admin_review';
}

type AuditActor = {
  id?: string;
  email?: string | null;
  role?: 'admin' | 'customer';
  user_metadata?: { role?: 'admin' | 'customer'; [key: string]: unknown };
};

function demoWalletEnabled() {
  return import.meta.env.VITE_ENABLE_DEMO_WALLET === 'true';
}

function makeTxnId() {
  return `DEMO-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
}

type MockAuthAdmin = typeof supabase.auth & {
  getUsersList?: () => SupabaseRawUser[];
  saveUsersList?: (users: SupabaseRawUser[]) => void;
};

function getAuthUsers() {
  const auth = supabase.auth as MockAuthAdmin;
  return {
    auth,
    users: auth.getUsersList ? auth.getUsersList() : [],
  };
}

export const demoWalletService = {
  // POST /api/demo-wallet/add - simulated, but access should be gated by role-aware UI/admin route.
  async addDemoBalance(
    userId: string,
    amount: number,
    actor?: AuditActor | null
  ): Promise<{ success: boolean; balance: number; message: string }> {
    if (!demoWalletEnabled()) {
      return { success: false, balance: 0, message: 'Demo Wallet is disabled in this environment.' };
    }
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { auth, users } = getAuthUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return { success: false, balance: 0, message: 'User not found' };
    }

    const user = users[userIndex];
    const currentBalance = user.user_metadata?.demo_wallet_balance ?? 0;
    const newBalance = currentBalance + amount;

    const newTxn: DemoTransaction = {
      id: makeTxnId(),
      userId,
      amount,
      transaction_type: 'credit',
      wallet_type: 'demo',
      payment_type: 'demo_wallet',
      reason: `Added test balance: +₹${amount}`,
      status: 'success',
      created_at: new Date().toISOString(),
    };

    const demoTransactions = user.user_metadata?.demo_transactions || [];
    demoTransactions.unshift(newTxn);

    user.user_metadata = {
      ...user.user_metadata,
      demo_wallet_balance: newBalance,
      demo_transactions: demoTransactions,
    };

    users[userIndex] = user;
    auth.saveUsersList(users);

    auditLogService.logAdminAction({
      action: 'ADMIN_ADD_DEMO_BALANCE',
      actor: actor || user,
      targetId: user.id,
      targetEmail: user.email,
      amount,
      reason: `Demo balance credited by ${actor ? 'admin control' : 'demo control'}`,
      metadata: { transactionId: newTxn.id, balanceAfter: newBalance },
    });

    return { success: true, balance: newBalance, message: `Successfully loaded ₹${amount} Demo Balance.` };
  },

  // POST /api/demo-wallet/reset
  async resetDemoAccount(
    userId: string,
    actor?: AuditActor | null
  ): Promise<{ success: boolean; message: string }> {
    if (!demoWalletEnabled()) {
      return { success: false, message: 'Demo Wallet is disabled in this environment.' };
    }
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { auth, users } = getAuthUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    const user = users[userIndex];
    user.user_metadata = {
      ...user.user_metadata,
      planName: null,
      planPrice: null,
      planType: null,
      subscriptionStatus: 'inactive',
      subscription_source: null,
      payment_type: null,
      subscription_payment_record: null,
      payment_hold_status: null,
      real_wallet_balance: 0,
      demo_wallet_balance: 0,
      discount_credits: 0,
      weekly_eligible_entry_count: 0,
      used_credits: 0,
      pending_credits: 0,
      selected_member_benefit_status: 'none',
      ledger: [],
      demo_transactions: [],
      real_transactions: [],
    };

    users[userIndex] = user;
    auth.saveUsersList(users);

    auditLogService.logAdminAction({
      action: 'ADMIN_RESET_USER',
      actor: actor || user,
      targetId: user.id,
      targetEmail: user.email,
      reason: `Account reset to zero-state by ${actor ? 'admin control' : 'demo control'}`,
    });

    return { success: true, message: 'Demo account reset successfully.' };
  },

  // POST /api/subscription/checkout
  async checkoutSubscription(
    userId: string,
    planId: string,
    paymentMethod: 'real_payment' | 'demo_wallet'
  ): Promise<CheckoutResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { auth, users } = getAuthUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    const user = users[userIndex];
    const plan = getPlanByIdOrName(planId);

    if (!plan) {
      return { success: false, message: 'Invalid plan selected' };
    }

    if (paymentMethod === 'demo_wallet' && !demoWalletEnabled()) {
      return { success: false, message: 'Demo Wallet payment is disabled in this environment.' };
    }

    if (paymentMethod === 'demo_wallet') {
      const demoBalance = user.user_metadata?.demo_wallet_balance ?? 0;
      if (demoBalance < plan.price) {
        return { success: false, message: 'You do not have enough demo balance to test this subscription.' };
      }
    }

    const checkoutSession = await createCheckoutSession({
      userId,
      planId,
      amount: plan.price,
      currency: 'INR',
      paymentMethod,
    });

    auditLogService.logAdminAction({
      action: 'PAYMENT_CHECKOUT_CREATED',
      actor: user,
      targetId: user.id,
      targetEmail: user.email,
      amount: plan.price,
      status: 'pending',
      reason: `Checkout session created for ${plan.name}`,
      metadata: { checkoutSessionId: checkoutSession.id, provider: checkoutSession.provider, paymentMethod },
    });

    // Demo mode intentionally uses the same security boundary as production:
    // subscription activation only happens after a verified webhook event.
    const paymentEvent = await verifyPaymentWebhook({
      sessionId: checkoutSession.id,
      userId,
      planId,
      amount: plan.price,
      paymentMethod,
      status: 'verified',
    });

    if (!paymentEvent.verified || paymentEvent.status !== 'verified') {
      markPaymentProblem(user, paymentEvent);
      users[userIndex] = user;
      auth.saveUsersList(users);
      auditLogService.logAdminAction({
        action: 'PAYMENT_WEBHOOK_REJECTED',
        actor: { id: 'system-webhook', email: `${paymentEvent.provider}-webhook@beduine.system`, role: 'admin' },
        targetId: user.id,
        targetEmail: user.email,
        amount: plan.price,
        status: 'failed',
        reason: 'Webhook event failed verification or did not contain verified status.',
        metadata: { eventId: paymentEvent.id, checkoutSessionId: checkoutSession.id },
      });
      return { success: false, message: 'Payment could not be verified. Subscription was not activated.' };
    }

    auditLogService.logAdminAction({
      action: 'PAYMENT_WEBHOOK_VERIFIED',
      actor: { id: 'system-webhook', email: `${paymentEvent.provider}-webhook@beduine.system`, role: 'admin' },
      targetId: user.id,
      targetEmail: user.email,
      amount: plan.price,
      reason: `${paymentEvent.verificationSource} accepted for checkout session`,
      metadata: { eventId: paymentEvent.id, checkoutSessionId: checkoutSession.id },
    });

    const entitlement = activateSubscriptionFromVerifiedPayment(user, paymentEvent);
    if (!entitlement.success || !entitlement.user) return entitlement;

    users[userIndex] = entitlement.user;
    auth.saveUsersList(users);

    return {
      success: true,
      message: entitlement.message,
      user: entitlement.user,
      checkoutSessionId: checkoutSession.id,
      verificationSource: paymentEvent.verificationSource,
    };
  },

  // GET /api/demo-wallet/transactions
  async getDemoTransactions(userId: string): Promise<DemoTransaction[]> {
    const { users } = getAuthUsers();
    const user = users.find((u) => u.id === userId);
    return user?.user_metadata?.demo_transactions || [];
  },
};
