import { useEffect, useState } from 'react';
import { CreditLedgerEntry, DemoTransactionRecord } from '@/types';
import { supabase } from '@/utils/supabaseClient';
import { demoWalletService } from '@/services/demoWalletService';
import { notify } from '@/services/uiFeedback';
import { completeSubscriptionPayment } from '@/services/payment/subscriptionPaymentFlow';

type PaymentMethod = 'real_payment' | 'demo_wallet';

type DashboardSubscriptionUser = {
  id?: string;
  email?: string;
  fullName?: string;
  mobile?: string;
  planName?: string | null;
  planPrice?: string | number | null;
  planType?: string | null;
  subscriptionStatus?: string | null;
  real_wallet_balance?: number;
  demo_wallet_balance?: number;
  demo_transactions?: DemoTransactionRecord[];
  ledger?: CreditLedgerEntry[];
};

export function useDashboardSubscription(user: DashboardSubscriptionUser | null | undefined, isDemoWalletEnabled: boolean) {
  const [activePlan, setActivePlan] = useState<string | null>(() => user?.planName || null);
  const [_activePlanPrice, setActivePlanPrice] = useState<string | null>(() => user?.planPrice ? String(user.planPrice) : null);
  const [activePlanType, setActivePlanType] = useState<string | null>(() => user?.planType || null);
  const [_subscriptionStatus, setSubscriptionStatus] = useState<string>(() => user?.subscriptionStatus || 'inactive');
  const [_realWalletBalance, setRealWalletBalance] = useState<number>(() => user?.real_wallet_balance ?? 0);
  const [demoWalletBalance, setDemoWalletBalance] = useState<number>(() => user?.demo_wallet_balance ?? 0);
  const [_demoTransactions, setDemoTransactions] = useState<DemoTransactionRecord[]>(() => user?.demo_transactions || []);
  const [ledger, setLedger] = useState<CreditLedgerEntry[]>(() => user?.ledger || []);

  const [selectedPlanId, setSelectedPlanId] = useState<string>('Silver');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(isDemoWalletEnabled ? 'demo_wallet' : 'real_payment');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<any | null>(null);

  useEffect(() => {
    setActivePlan(user?.planName || null);
    setActivePlanPrice(user?.planPrice ? String(user.planPrice) : null);
    setActivePlanType(user?.planType || null);
    setSubscriptionStatus(user?.subscriptionStatus || 'inactive');
    setRealWalletBalance(user?.real_wallet_balance ?? 0);
    setDemoWalletBalance(user?.demo_wallet_balance ?? 0);
    setDemoTransactions(user?.demo_transactions || []);
    setLedger(user?.ledger || []);
  }, [user]);

  useEffect(() => {
    setLedger(user?.ledger || []);
  }, [user?.ledger]);

  useEffect(() => {
    const handleBalanceChanged = (e: CustomEvent) => {
      setDemoWalletBalance(e.detail.balance);
    };
    window.addEventListener('demoBalanceChanged', handleBalanceChanged as EventListener);
    return () => window.removeEventListener('demoBalanceChanged', handleBalanceChanged as EventListener);
  }, []);

  const handleCheckout = async () => {
    if (!user?.id) {
      notify.error('User session is missing. Please log in again.');
      return;
    }
    setCheckoutLoading(true);
    try {
      if (import.meta.env.VITE_BACKEND_MODE === 'production') {
        if (paymentMethod !== 'real_payment') {
          throw new Error('Demo wallet is unavailable in production.');
        }
        const planAliases: Record<string, string> = {
          Silver: 'domestic_silver',
          Gold: 'domestic_gold',
          Platinum: 'domestic_platinum',
          Silver_Int: 'international_silver',
          Gold_Int: 'international_gold',
          Platinum_Int: 'international_platinum',
        };
        const status = await completeSubscriptionPayment({
          planId: planAliases[selectedPlanId] || selectedPlanId.toLowerCase(),
          customer: {
            name: user.fullName || 'Beduine Member',
            email: user.email || '',
            contact: user.mobile || '',
          },
        });
        setCheckoutSuccess(status);
        setSubscriptionStatus('active');
        setActivePlan(selectedPlanId);
        notify.info('Payment verified. Your membership is active.');
        return;
      }

      const res = await demoWalletService.checkoutSubscription(user.id, selectedPlanId, paymentMethod);
      if (res.success && res.user?.user_metadata) {
        setCheckoutSuccess(res);
        const updatedMeta = res.user.user_metadata;
        setActivePlan(updatedMeta.planName ?? null);
        setActivePlanPrice(updatedMeta.planPrice ? String(updatedMeta.planPrice) : null);
        setActivePlanType(updatedMeta.planType ? String(updatedMeta.planType) : null);
        setSubscriptionStatus(String(updatedMeta.subscriptionStatus ?? 'inactive'));
        setDemoWalletBalance(updatedMeta.demo_wallet_balance ?? 0);
        setLedger(updatedMeta.ledger || []);
        const txns = await demoWalletService.getDemoTransactions(user.id);
        setDemoTransactions(txns);
        await supabase.auth.updateUser({ data: updatedMeta });
      } else {
        notify.error(res.message || 'Checkout could not be completed.');
      }
    } catch (e: unknown) {
      notify.error(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return {
    activePlan,
    _activePlanPrice,
    activePlanType,
    _subscriptionStatus,
    _realWalletBalance,
    demoWalletBalance,
    setDemoWalletBalance,
    _demoTransactions,
    setDemoTransactions,
    ledger,
    setLedger,
    selectedPlanId,
    setSelectedPlanId,
    paymentMethod,
    setPaymentMethod,
    checkoutLoading,
    checkoutSuccess,
    setCheckoutSuccess,
    handleCheckout,
  };
}
