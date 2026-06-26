import { supabase } from '../utils/supabaseClient';
import { ALL_PLANS } from '../data/siteData';

export interface DemoTransaction {
  id: string;
  userId: string;
  amount: number;
  transaction_type: 'credit' | 'debit';
  wallet_type: 'real' | 'demo';
  payment_type: 'real_payment' | 'demo_wallet';
  reason: string;
  status: 'success' | 'failed';
  created_at: string;
}

export interface CheckoutResult {
  success: boolean;
  message: string;
  user?: any;
}

export const demoWalletService = {
  // POST /api/demo-wallet/add
  async addDemoBalance(userId: string, amount: number): Promise<{ success: boolean; balance: number; message: string }> {
    const isDemoWalletEnabled = import.meta.env.VITE_ENABLE_DEMO_WALLET === 'true';
    if (!isDemoWalletEnabled) {
      return { success: false, balance: 0, message: 'Demo Wallet is disabled in this environment.' };
    }
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const auth = (supabase.auth as any);
    const users = auth.getUsersList();
    const userIndex = users.findIndex((u: any) => u.id === userId);

    if (userIndex === -1) {
      return { success: false, balance: 0, message: 'User not found' };
    }

    const user = users[userIndex];
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
      created_at: new Date().toISOString()
    };

    const demoTransactions = user.user_metadata?.demo_transactions || [];
    demoTransactions.unshift(newTxn);

    // Save updated metadata
    user.user_metadata = {
      ...user.user_metadata,
      demo_wallet_balance: newBalance,
      demo_transactions: demoTransactions
    };

    users[userIndex] = user;
    auth.saveUsersList(users);

    return { success: true, balance: newBalance, message: `Successfully loaded ₹${amount} Demo Balance.` };
  },

  // POST /api/demo-wallet/reset
  async resetDemoAccount(userId: string): Promise<{ success: boolean; message: string }> {
    const isDemoWalletEnabled = import.meta.env.VITE_ENABLE_DEMO_WALLET === 'true';
    if (!isDemoWalletEnabled) {
      return { success: false, message: 'Demo Wallet is disabled in this environment.' };
    }
    await new Promise((resolve) => setTimeout(resolve, 300));

    const auth = (supabase.auth as any);
    const users = auth.getUsersList();
    const userIndex = users.findIndex((u: any) => u.id === userId);

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
      real_wallet_balance: 0,
      demo_wallet_balance: 0,
      discount_credits: 0,
      weekly_eligible_entry_count: 0,
      used_credits: 0,
      pending_credits: 0,
      selected_member_benefit_status: 'none',
      ledger: [],
      demo_transactions: []
    };

    users[userIndex] = user;
    auth.saveUsersList(users);

    return { success: true, message: 'Demo account reset successfully.' };
  },

  // POST /api/subscription/checkout
  async checkoutSubscription(userId: string, planId: string, paymentMethod: 'real_payment' | 'demo_wallet'): Promise<CheckoutResult> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const auth = (supabase.auth as any);
    const users = auth.getUsersList();
    const userIndex = users.findIndex((u: any) => u.id === userId);

    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    const user = users[userIndex];
    const plan = ALL_PLANS[planId];

    if (!plan) {
      return { success: false, message: 'Invalid plan selected' };
    }

    const planPrice = plan.price;
    const planName = plan.name;
    const planType = plan.category;
    const creditsToIssue = plan.credits;

    if (paymentMethod === 'demo_wallet') {
      const isDemoWalletEnabled = import.meta.env.VITE_ENABLE_DEMO_WALLET === 'true';
      if (!isDemoWalletEnabled) {
        return { success: false, message: 'Demo Wallet payment is disabled in this environment.' };
      }
      const demoBalance = user.user_metadata?.demo_wallet_balance ?? 0;
      if (demoBalance < planPrice) {
        return { success: false, message: 'You do not have enough demo balance to test this subscription.' };
      }

      // Deduct balance
      const newDemoBalance = demoBalance - planPrice;

      // Create transaction
      const newTxn: DemoTransaction = {
        id: `DEMO-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        userId,
        amount: -planPrice,
        transaction_type: 'debit',
        wallet_type: 'demo',
        payment_type: 'demo_wallet',
        reason: `Tested checkout: ${planName} subscription`,
        status: 'success',
        created_at: new Date().toISOString()
      };

      const demoTransactions = user.user_metadata?.demo_transactions || [];
      demoTransactions.unshift(newTxn);

      // Create credit ledger entries
      const dateStr = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      const isInternational = planType === 'international';
      const creditCategory = isInternational ? 'international' : 'domestic';
      const creditValue = isInternational ? 5000 : 500;
      const usableFor = isInternational ? 'international_only' : 'domestic_only';

      const currentLedger = user.user_metadata?.ledger || [];
      const newLedgerEntries = [
        {
          id: `TXN-TRC-${Math.floor(100000 + Math.random() * 900000)}`,
          date: dateStr,
          type: 'issued' as const,
          creditType: 'lucky_draw' as const,
          amount: 1,
          reason: 'Subscription activation entitlement token',
          source: 'demo',
          creditCategory: 'travel_reward',
          creditValue: 1,
          usableFor: 'lucky_draw'
        },
        {
          id: `TXN-DC-${Math.floor(100000 + Math.random() * 900000)}`,
          date: dateStr,
          type: 'issued' as const,
          creditType: 'discount' as const,
          amount: creditsToIssue,
          reason: `Subscription signup reward - ${creditsToIssue} ${creditCategory} Discount Credits issued`,
          source: 'demo',
          creditCategory,
          creditValue,
          usableFor
        }
      ];

      const updatedLedger = [...currentLedger, ...newLedgerEntries];

      // Update user metadata with successful payment record
      const demoRecordId = `TXN-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
      const demo_subscription_payment_record = {
        transaction_id: demoRecordId,
        payment_status: 'success',
        planName,
        planPrice: `₹${planPrice}`,
        planType,
        subscription_source: 'demo',
        payment_type: 'demo_wallet',
        activated_at: new Date().toISOString()
      };

      user.user_metadata = {
        ...user.user_metadata,
        planName,
        planPrice: `₹${planPrice}`,
        planType,
        subscriptionStatus: 'active',
        subscription_source: 'demo',
        payment_type: 'demo_wallet',
        subscription_payment_record: demo_subscription_payment_record,
        demo_wallet_balance: newDemoBalance,
        demo_transactions: demoTransactions,
        ledger: updatedLedger,
        discount_credits: (user.user_metadata?.discount_credits ?? 0) + creditsToIssue,
        weekly_eligible_entry_count: 1,
        selected_member_benefit_status: 'none'
      };

      users[userIndex] = user;
      auth.saveUsersList(users);

      return { success: true, message: 'Demo payment successful. Subscription activated for testing.', user };
    } else {
      // Simulate real payment checkout success
      const currentLedger = user.user_metadata?.ledger || [];
      const dateStr = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      const isInternational = planType === 'international';
      const creditCategory = isInternational ? 'international' : 'domestic';
      const creditValue = isInternational ? 5000 : 500;
      const usableFor = isInternational ? 'international_only' : 'domestic_only';

      const newLedgerEntries = [
        {
          id: `TXN-TRC-${Math.floor(100000 + Math.random() * 900000)}`,
          date: dateStr,
          type: 'issued' as const,
          creditType: 'lucky_draw' as const,
          amount: 1,
          reason: 'Subscription activation entitlement token',
          source: 'real',
          creditCategory: 'travel_reward',
          creditValue: 1,
          usableFor: 'lucky_draw'
        },
        {
          id: `TXN-DC-${Math.floor(100000 + Math.random() * 900000)}`,
          date: dateStr,
          type: 'issued' as const,
          creditType: 'discount' as const,
          amount: creditsToIssue,
          reason: `Subscription signup reward - ${creditsToIssue} ${creditCategory} Discount Credits issued`,
          source: 'real',
          creditCategory,
          creditValue,
          usableFor
        }
      ];

      const updatedLedger = [...currentLedger, ...newLedgerEntries];

      const realRecordId = `TXN-REAL-${Math.floor(100000 + Math.random() * 900000)}`;
      const real_subscription_payment_record = {
        transaction_id: realRecordId,
        payment_status: 'success',
        planName,
        planPrice: `₹${planPrice}`,
        planType,
        subscription_source: 'real',
        payment_type: 'real_payment',
        activated_at: new Date().toISOString()
      };

      user.user_metadata = {
        ...user.user_metadata,
        planName,
        planPrice: `₹${planPrice}`,
        planType,
        subscriptionStatus: 'active',
        subscription_source: 'real',
        payment_type: 'real_payment',
        subscription_payment_record: real_subscription_payment_record,
        ledger: updatedLedger,
        discount_credits: (user.user_metadata?.discount_credits ?? 0) + creditsToIssue,
        weekly_eligible_entry_count: 1,
        selected_member_benefit_status: 'none'
      };

      users[userIndex] = user;
      auth.saveUsersList(users);

      return { success: true, message: 'Real payment checkout completed successfully.', user };
    }
  },

  // GET /api/demo-wallet/transactions
  async getDemoTransactions(userId: string): Promise<DemoTransaction[]> {
    const auth = (supabase.auth as any);
    const users = auth.getUsersList();
    const user = users.find((u: any) => u.id === userId);
    return user?.user_metadata?.demo_transactions || [];
  }
};
