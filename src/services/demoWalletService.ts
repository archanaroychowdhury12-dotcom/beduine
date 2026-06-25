import { supabase } from '../utils/supabaseClient';

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

const PLAN_CREDITS: Record<string, number> = {
  'Silver': 1,
  'Gold': 2,
  'Platinum': 4,
  'Silver_Int': 5,
  'Gold_Int': 8,
  'Platinum_Int': 15
};

const PLAN_PRICES: Record<string, number> = {
  'Silver': 499,
  'Gold': 799,
  'Platinum': 1499,
  'Silver_Int': 4999,
  'Gold_Int': 7999,
  'Platinum_Int': 14999
};

const PLAN_NAMES: Record<string, string> = {
  'Silver': 'Silver Domestic',
  'Gold': 'Gold Domestic',
  'Platinum': 'Platinum Domestic',
  'Silver_Int': 'Silver International',
  'Gold_Int': 'Gold International',
  'Platinum_Int': 'Platinum International'
};

const PLAN_TYPES: Record<string, string> = {
  'Silver': 'domestic',
  'Gold': 'domestic',
  'Platinum': 'domestic',
  'Silver_Int': 'international',
  'Gold_Int': 'international',
  'Platinum_Int': 'international'
};

export const demoWalletService = {
  // POST /api/demo-wallet/add
  async addDemoBalance(userId: string, amount: number): Promise<{ success: boolean; balance: number; message: string }> {
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
      demo_transactions
    };

    users[userIndex] = user;
    auth.saveUsersList(users);

    return { success: true, balance: newBalance, message: `Successfully loaded ₹${amount} Demo Balance.` };
  },

  // POST /api/demo-wallet/reset
  async resetDemoAccount(userId: string): Promise<{ success: boolean; message: string }> {
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
    const planPrice = PLAN_PRICES[planId];
    const planName = PLAN_NAMES[planId];
    const planType = PLAN_TYPES[planId];
    const creditsToIssue = PLAN_CREDITS[planId];

    if (!planPrice || !planName) {
      return { success: false, message: 'Invalid plan selected' };
    }

    if (paymentMethod === 'demo_wallet') {
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

      const currentLedger = user.user_metadata?.ledger || [];
      const newLedgerEntries = [
        {
          id: `TXN-TRC-${Math.floor(100000 + Math.random() * 900000)}`,
          date: dateStr,
          type: 'issued' as const,
          creditType: 'lucky_draw' as const,
          amount: 1,
          reason: 'Subscription activation entitlement token',
          source: 'demo'
        },
        {
          id: `TXN-DC-${Math.floor(100000 + Math.random() * 900000)}`,
          date: dateStr,
          type: 'issued' as const,
          creditType: 'discount' as const,
          amount: creditsToIssue,
          reason: `Subscription signup reward - ${creditsToIssue} Discount Vouchers issued`,
          source: 'demo'
        }
      ];

      const updatedLedger = [...currentLedger, ...newLedgerEntries];

      // Update user metadata
      user.user_metadata = {
        ...user.user_metadata,
        planName,
        planPrice: `₹${planPrice}`,
        planType,
        subscriptionStatus: 'active',
        subscription_source: 'demo',
        payment_type: 'demo_wallet',
        demo_wallet_balance: newDemoBalance,
        demo_transactions,
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

      const newLedgerEntries = [
        {
          id: `TXN-TRC-${Math.floor(100000 + Math.random() * 900000)}`,
          date: dateStr,
          type: 'issued' as const,
          creditType: 'lucky_draw' as const,
          amount: 1,
          reason: 'Subscription activation entitlement token',
          source: 'real'
        },
        {
          id: `TXN-DC-${Math.floor(100000 + Math.random() * 900000)}`,
          date: dateStr,
          type: 'issued' as const,
          creditType: 'discount' as const,
          amount: creditsToIssue,
          reason: `Subscription signup reward - ${creditsToIssue} Discount Vouchers issued`,
          source: 'real'
        }
      ];

      const updatedLedger = [...currentLedger, ...newLedgerEntries];

      user.user_metadata = {
        ...user.user_metadata,
        planName,
        planPrice: `₹${planPrice}`,
        planType,
        subscriptionStatus: 'active',
        subscription_source: 'real',
        payment_type: 'real_payment',
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
