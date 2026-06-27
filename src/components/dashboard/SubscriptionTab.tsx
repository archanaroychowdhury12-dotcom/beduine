import { 
  CheckCircle2, ShieldCheck, Crown, FileText 
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
  user,
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
  voucherCount,
  planType,
  memberId
}: SubscriptionTabProps) {

  const plansInfo: any = {
    'Silver Domestic': { price: '₹499', period: 'Annual', maxSelectedBenefit: '₹3,000' },
    'Gold Domestic': { price: '₹799', period: 'Annual', maxSelectedBenefit: '₹5,000' },
    'Platinum Domestic': { price: '₹1,499', period: 'Annual', maxSelectedBenefit: '₹10,000' },
    'Silver International': { price: '₹4,999', period: 'Annual', maxSelectedBenefit: '₹25,000' },
    'Gold International': { price: '₹7,999', period: 'Annual', maxSelectedBenefit: '₹50,000' },
    'Platinum International': { price: '₹14,999', period: 'Annual', maxSelectedBenefit: '₹1,00,000' }
  };
  
  const currentPlanDetails = planName ? (plansInfo[planName] || { price: '₹499', period: 'Annual', maxSelectedBenefit: '₹3,000' }) : null;

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
          <p className="text-xs text-slate-400">Choose a travel subscription plan to start your journey with guaranteed discount credits and weekly travel selection entries.</p>
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
    <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-black flex items-center gap-2 text-slate-805 uppercase tracking-wide">
            <ShieldCheck className="w-5 h-5 text-[#FF6B6B]" /> My Subscription Details
          </h2>
          <p className="text-xs text-slate-400">Manage your Beduine membership plans and invoice downloads</p>
        </div>
        <span className="bg-emerald-500 text-white px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          {user?.subscription_source === 'demo' ? 'Test Active' : 'Active'}
        </span>
      </div>

      {/* Visual Premium Holographic Membership Card */}
      <div className="bg-gradient-to-br from-[#0b130f] via-slate-900 to-[#1E3147] rounded-[24px] p-6 text-white relative overflow-hidden border border-white/5 shadow-lg group">
        <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 pointer-events-none" />
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2.5">
              <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#00D4F5] font-mono">
                {user?.subscription_source === 'demo' ? 'BEDUINE TEST MEMBER CARD' : 'BEDUINE MEMBER CARD'}
              </span>
            </div>
            <div className="text-3xl font-black tracking-wide uppercase mt-4">
              {planName}
              {user?.subscription_source === 'demo' && <span className="text-xs text-amber-500 font-bold block normal-case font-sans tracking-normal mt-0.5">Demo Subscription</span>}
            </div>
            <div className="text-[11px] text-white/60 font-mono tracking-widest uppercase mt-0.5">{planType} Membership Tier</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5">
            <img src="/images/bedune_logo_transparent.png" alt="Beduine" className="w-full h-full object-contain brightness-200" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-white/10 text-xs font-mono">
          <div>
            <span className="block text-[8px] text-white/40 uppercase tracking-wider">MEMBER ID</span>
            <span className="font-bold tracking-wider">{memberId}</span>
          </div>
          <div className="text-right">
            <span className="block text-[8px] text-white/40 uppercase tracking-wider">EXPIRY DATE</span>
            <span className="font-bold text-[#FF6B6B] tracking-wider">June 20, 2027</span>
          </div>
        </div>
      </div>

      {/* Plan Specs Table */}
      <div className="grid sm:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">RECURRING PRICE</span>
          <span className="block text-lg font-black text-slate-805 mt-1">{currentPlanDetails ? currentPlanDetails.price : '₹0'} / {currentPlanDetails ? currentPlanDetails.period : 'Annual'}</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">MAX TOUR BENEFITS</span>
          <span className="block text-lg font-black text-slate-805 mt-1">Up to {currentPlanDetails ? currentPlanDetails.maxSelectedBenefit : '₹0'}</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">NEXT SELECTION DATE</span>
          <span className="block text-lg font-black text-slate-805 mt-1">Next Sunday</span>
        </div>
      </div>

      {/* Benefits Checklist */}
      <div className="pt-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Membership Benefits Checklist</h3>
        <div className="grid sm:grid-cols-2 gap-3.5 text-xs text-slate-650 font-medium">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
            <span>1 weekly selection entry included</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
            <span>{voucherCount} x ₹500 discount vouchers issued</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
            <span>Up to 10% off on all paid tour requests</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
            <span>Dedicated tour manager call assistance</span>
          </div>
        </div>
      </div>

      {/* Billing Invoice history log */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-450" /> Billing Invoice Records
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Invoice ID</th>
                <th className="py-2.5">Plan Purchased</th>
                <th className="py-2.5">Amount</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
              {planName ? (
                <tr>
                  <td className="py-3 font-bold">June 20, 2026</td>
                  <td className="py-3 font-mono">BDN-INV-7812A</td>
                  <td className="py-3 font-bold">{planName}</td>
                  <td className="py-3 font-black text-slate-805">{currentPlanDetails ? currentPlanDetails.price : '₹0'}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                      user?.subscription_source === 'demo' 
                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {user?.subscription_source === 'demo' ? 'Demo Paid' : 'Paid'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-[10px] font-bold text-[#00D4F5] hover:underline cursor-pointer border-none bg-transparent">Download PDF</button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400 font-bold">
                    No subscription payment found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
