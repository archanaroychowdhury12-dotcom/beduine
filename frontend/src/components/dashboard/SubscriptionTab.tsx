import { 
  CheckCircle2, ShieldCheck
} from 'lucide-react';
import { getPlanPrice, getPlanCredits, getPlanCreditValue } from '../../data/siteData';

export interface SubscriptionTabProps {
  user: any;
  planName: string | null;
  activePlanPrice: string | null;
  subscriptionStatus: string;
  demoWalletBalance: number;
  demoTransactions: any[];
  selectedPlanId: string;
  setSelectedPlanId: (planId: string) => void;
  paymentMethod: 'real_payment' | 'demo_wallet';
  setPaymentMethod: (method: 'real_payment' | 'demo_wallet') => void;
  checkoutLoading: boolean;
  checkoutSuccess: any | null;
  setCheckoutSuccess: (success: any | null) => void;
  setActiveTab: (tab: any) => void;
  showDemoWallet: boolean;
  handleCheckout: () => Promise<void>;
  voucherCount: number;
  planType: string;
  memberId: string;
}

export function SubscriptionTab({
  user: _user,
  planName,
  selectedPlanId,
  setSelectedPlanId,
  paymentMethod,
  setPaymentMethod,
  checkoutLoading,
  checkoutSuccess,
  setCheckoutSuccess,
  setActiveTab,
  showDemoWallet,
  demoWalletBalance,
  handleCheckout,
  voucherCount: _voucherCount,
  planType: _planType,
  memberId: _memberId
}: SubscriptionTabProps) {

  if (!planName) {
    if (checkoutSuccess) {
      const source = checkoutSuccess.user.user_metadata.subscription_source;
      return (
        <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-6 text-center space-y-6 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-805">
              {source === 'demo' ? 'Demo Payment Successful' : 'Payment Successful'}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {source === 'demo' 
                ? 'Demo payment successful. Subscription activated for testing.' 
                : 'Your payment was successful and membership has been activated!'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2.5 text-xs font-mono text-slate-600">
            <div>Plan Name: <strong className="text-slate-850">{checkoutSuccess.user.user_metadata.planName}</strong></div>
            <div>Price Charged: <strong className="text-slate-850">{checkoutSuccess.user.user_metadata.planPrice}</strong></div>
            <div>Credits Issued: <strong className="text-slate-850">{getPlanCredits(selectedPlanId)} Vouchers (₹{getPlanCreditValue(selectedPlanId).toLocaleString('en-IN')} value each)</strong></div>
            <div>Payment Mode: <strong className="text-indigo-600 uppercase">{paymentMethod.replace('_', ' ')}</strong></div>
          </div>

          <button
            onClick={() => {
              setCheckoutSuccess(null);
              setActiveTab('overview');
            }}
            className="px-6 py-3 w-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer border-none"
          >
            Go to Dashboard Overview
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
        <div>
          <h2 className="text-base font-black flex items-center gap-2 text-slate-805 uppercase tracking-wide">
            <ShieldCheck className="w-5 h-5 text-[#FF6B6B]" /> Join Beduine Membership
          </h2>
          <p className="text-xs text-slate-400">Choose a travel subscription plan to start your journey with available discount credits and weekly travel selection entries.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 font-sans">
          {/* Domestic Section */}
          <div className="space-y-3">
            <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold">🇮🇳 Domestic Annual Plans</span>
            <div className="space-y-2.5">
              {[
                { id: 'Silver', name: 'Silver Domestic', price: '₹499', credits: 1 },
                { id: 'Gold', name: 'Gold Domestic', price: '₹799', credits: 2 },
                { id: 'Platinum', name: 'Platinum Domestic', price: '₹1,499', credits: 4 }
              ].map(p => (
                <label
                  key={p.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedPlanId === p.id 
                      ? 'border-[#FF6B6B] bg-orange-50/20' 
                      : 'border-slate-100 hover:border-slate-200 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="plan"
                      checked={selectedPlanId === p.id}
                      onChange={() => setSelectedPlanId(p.id)}
                      className="accent-[#FF6B6B]"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{p.credits} Voucher{p.credits > 1 ? 's' : ''} issued</span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-[#FF6B6B]">{p.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* International Section */}
          <div className="space-y-3">
            <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold">🌐 International Annual Plans</span>
            <div className="space-y-2.5">
              {[
                { id: 'Silver_Int', name: 'Silver International', price: '₹4,999', credits: 1 },
                { id: 'Gold_Int', name: 'Gold International', price: '₹7,999', credits: 2 },
                { id: 'Platinum_Int', name: 'Platinum International', price: '₹14,999', credits: 4 }
              ].map(p => (
                <label
                  key={p.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedPlanId === p.id 
                      ? 'border-[#FF6B6B] bg-orange-50/20' 
                      : 'border-slate-100 hover:border-slate-200 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="plan"
                      checked={selectedPlanId === p.id}
                      onChange={() => setSelectedPlanId(p.id)}
                      className="accent-[#FF6B6B]"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{p.credits} Voucher{p.credits > 1 ? 's' : ''} issued</span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-[#FF6B6B]">{p.price}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="pt-4 border-t border-slate-150 space-y-3 font-sans">
          <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold">Choose Payment Method</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-sm ${
                paymentMethod === 'real_payment' ? 'border-[#FF6B6B] bg-orange-50/10' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'real_payment'}
                onChange={() => setPaymentMethod('real_payment')}
                className="accent-[#FF6B6B]"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Real Payment</span>
                <span className="text-[9.5px] text-slate-400 font-medium">Use credit card / UPI gateway</span>
              </div>
            </label>

            {showDemoWallet && (
              <label
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-sm ${
                  paymentMethod === 'demo_wallet' ? 'border-[#00D4F5] bg-sky-500/5' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'demo_wallet'}
                  onChange={() => setPaymentMethod('demo_wallet')}
                  className="accent-[#00D4F5]"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Demo Wallet Payment</span>
                  <span className="text-[9.5px] text-slate-400 font-medium">Deduct from ₹{demoWalletBalance.toLocaleString('en-IN')} Test Balance</span>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Checkout Action */}
        {(() => {
          const isSufficient = demoWalletBalance >= (getPlanPrice(selectedPlanId) || 0);
          return (
            <div className="pt-4 border-t border-slate-150 flex flex-col sm:flex-row justify-between items-center gap-4 font-sans">
              <div className="text-left">
                <span className="text-[9.5px] uppercase font-mono text-slate-400 font-bold block">Selected Plan Total Due</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-800">
                    ₹{getPlanPrice(selectedPlanId)}
                  </span>
                  {paymentMethod === 'demo_wallet' && (
                    <span className={`text-[10px] font-bold ${isSufficient ? 'text-emerald-650' : 'text-red-500'}`}>
                      ({isSufficient ? '✓ Balance Sufficient' : '✗ Insufficient Demo Balance'})
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || (paymentMethod === 'demo_wallet' && !isSufficient)}
                className={`px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white rounded-full shadow-lg border-none transition-all cursor-pointer ${
                  paymentMethod === 'demo_wallet' && !isSufficient
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : paymentMethod === 'demo_wallet'
                      ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                      : 'bg-gradient-to-r from-[#FF6B6B] to-[#8B5CF6] hover:from-[#FF8E53] hover:to-[#8B5CF6] shadow-rose-200'
                }`}
              >
                {checkoutLoading ? 'Processing Checkout...' : `Pay ₹${getPlanPrice(selectedPlanId)} & Activate`}
              </button>
            </div>
          );
        })()}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 4. MY SUBSCRIPTION Panel */}
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.02)] rounded-[24px] p-5 sm:p-6">
        <div className="pb-4 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-805 uppercase tracking-wide">My Subscription</h2>
            <p className="text-xs text-slate-400">View active membership plan details, benefits, and invoice history</p>
          </div>
          <span className="bg-emerald-500 text-white px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Active
          </span>
        </div>

        {/* Globe Space Subscription Card */}
        <div className="relative mt-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-6 text-white overflow-hidden shadow-lg border border-indigo-500/20">
          {/* Subtle Globe / Map vector graphic overlay */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=256')] opacity-10 bg-cover bg-center rounded-full pointer-events-none mix-blend-screen border border-white/10" />
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 pointer-events-none" />

          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Plan
              </span>
              <h3 className="text-2xl font-black tracking-wide mt-3 text-white">
                {planName || 'International Plan'}
              </h3>
              <div className="text-2xl font-bold mt-1 text-[#00D4F5] font-mono">
                {planName?.toLowerCase().includes('silver') ? '₹499' : planName?.toLowerCase().includes('gold') ? '₹799' : '₹5,000'} <span className="text-xs font-normal text-white/70">/ year</span>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl text-[10px] font-black text-slate-900 bg-orange-500 hover:bg-orange-600 transition border-none cursor-pointer shadow-md shadow-orange-700/20">
              View Benefits
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-white/10 text-xs font-mono relative z-10 text-white/90">
            <div>
              <span className="block text-[8px] text-white/40 uppercase tracking-widest font-bold">START DATE</span>
              <span className="font-bold tracking-wider mt-0.5 block">01 May 2025</span>
            </div>
            <div className="text-right">
              <span className="block text-[8px] text-white/40 uppercase tracking-widest font-bold">END DATE</span>
              <span className="font-bold text-[#FF6B6B] tracking-wider mt-0.5 block">30 Apr 2026</span>
            </div>
          </div>
        </div>

        {/* Subscription History Section */}
        <div className="pt-6 mt-4 border-t border-slate-50 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subscription History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Plan Name</th>
                  <th className="py-2.5">Start Date</th>
                  <th className="py-2.5">End Date</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-655 font-medium">
                <tr className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 font-bold text-slate-800">{planName || 'International Plan'}</td>
                  <td className="py-3 text-slate-500">01 May 2025</td>
                  <td className="py-3 text-slate-500">30 Apr 2026</td>
                  <td className="py-3 font-black text-slate-800">
                    {planName?.toLowerCase().includes('silver') ? '₹499' : planName?.toLowerCase().includes('gold') ? '₹799' : '₹5,000'}
                  </td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-wider inline-flex items-center gap-0.5">
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
