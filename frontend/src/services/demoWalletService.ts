// UI Stub for Demo Wallet Service - Keeps UI functioning without backend transactions.
import { supabase } from '../utils/supabaseClient';
import { SupabaseRawUser } from '@/types';

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

export const demoWalletService = {
  async addDemoBalance(
    userId: string,
    amount: number,
    _actor?: AuditActor | null
  ): Promise<{ success: boolean; balance: number; message: string }> {
    const session = await supabase.auth.getSession();
    const user = session.data.session?.user;
    if (!user) return { success: false, balance: 0, message: 'User not logged in' };

    const currentBalance = user.user_metadata?.demo_wallet_balance ?? 0;
    const newBalance = currentBalance + amount;

    const newTxn: DemoTransaction = {
      id: `DEMO-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
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

    await supabase.auth.updateUser({
      data: {
        demo_wallet_balance: newBalance,
        demo_transactions: demoTransactions,
      },
    });

    return { success: true, balance: newBalance, message: `Successfully loaded ₹${amount} Demo Balance.` };
  },

  async resetDemoAccount(
    _userId: string,
    _actor?: AuditActor | null
  ): Promise<{ success: boolean; message: string }> {
    await supabase.auth.updateUser({
      data: {
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
      },
    });

    return { success: true, message: 'Demo account reset successfully.' };
  },

  async checkoutSubscription(
    userId: string,
    planId: string,
    paymentMethod: 'real_payment' | 'demo_wallet'
  ): Promise<CheckoutResult> {
    const session = await supabase.auth.getSession();
    const user = session.data.session?.user;
    if (!user) return { success: false, message: 'User not logged in' };

    const planName = planId.toLowerCase().includes('platinum')
      ? 'Platinum Plan'
      : planId.toLowerCase().includes('gold')
        ? 'Gold Plan'
        : 'Silver Plan';

    const planPrice = planId.toLowerCase().includes('platinum')
      ? 1499
      : planId.toLowerCase().includes('gold')
        ? 799
        : 499;

    const planType = planId.toLowerCase().includes('international') ? 'international' : 'domestic';

    if (paymentMethod === 'demo_wallet') {
      const demoBalance = user.user_metadata?.demo_wallet_balance ?? 0;
      if (demoBalance < planPrice) {
        return { success: false, message: 'You do not have enough demo balance to test this subscription.' };
      }

      const newBalance = demoBalance - planPrice;
      const newTxn: DemoTransaction = {
        id: `DEMO-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        userId,
        amount: planPrice,
        transaction_type: 'debit',
        wallet_type: 'demo',
        payment_type: 'demo_wallet',
        reason: `Subscribed to ${planName}`,
        status: 'success',
        created_at: new Date().toISOString(),
      };

      const demoTransactions = user.user_metadata?.demo_transactions || [];
      demoTransactions.unshift(newTxn);

      // Create a dummy lucky draw credit in the ledger for visual preview
      const ledgerEntry = {
        id: `TXN-TRC-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        type: 'issued' as const,
        creditType: 'lucky_draw' as const,
        amount: 1,
        reason: `MOCK: Subscription purchase benefit for ${planName}`,
        creditCategory: 'travel_winner benefit' as const,
        creditValue: 1,
        usableFor: 'lucky_draw' as const,
        source: 'demo' as const,
      };

      const ledger = user.user_metadata?.ledger || [];
      ledger.unshift(ledgerEntry);

      const updatedUser = await supabase.auth.updateUser({
        data: {
          planName,
          planPrice,
          planType,
          subscriptionStatus: 'active',
          subscription_source: 'demo',
          payment_type: paymentMethod,
          demo_wallet_balance: newBalance,
          demo_transactions: demoTransactions,
          weekly_eligible_entry_count: planId.toLowerCase().includes('platinum') ? 4 : planId.toLowerCase().includes('gold') ? 2 : 1,
          ledger,
        },
      });

      return {
        success: true,
        message: `Successfully subscribed to ${planName}!`,
        user: updatedUser.data?.user || undefined,
        checkoutSessionId: `mock-session-${Date.now()}`,
        verificationSource: 'simulated_webhook',
      };
    }

    return { success: false, message: 'Real payment method is simulated on the backend only.' };
  },

  async getDemoTransactions(_userId: string): Promise<DemoTransaction[]> {
    const session = await supabase.auth.getSession();
    return session.data.session?.user?.user_metadata?.demo_transactions || [];
  },
};
