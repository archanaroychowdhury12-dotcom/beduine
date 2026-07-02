import React from 'react';
import { Tag, CreditCard, Gift, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { CreditLedgerEntry } from '../../types';

export interface CreditsTabProps {
  activePlan: string | null;
  profileName: string;
  selectedWinners: any[];
  availableDiscountCredits: number;
  discountCreditBalance: number;
  domesticDiscountCredits: number;
  internationalDiscountCredits: number;
  newCouponCode: string;
  setNewCouponCode: (code: string) => void;
  couponError: string | null;
  setCouponError: (err: string | null) => void;
  couponSuccess: string | null;
  handleAddCoupon: (e: React.FormEvent) => void;
  ledger: CreditLedgerEntry[];
}

export function CreditsTab({
  activePlan: _activePlan,
  discountCreditBalance,
  newCouponCode,
  setNewCouponCode,
  couponError,
  setCouponError,
  couponSuccess,
  handleAddCoupon,
}: CreditsTabProps) {

  const creditHistoryData = [
    { date: '10 May 2025', desc: 'Non-winner Credit', type: 'Credit', amount: '+ ₹500', balance: '₹7,500' },
    { date: '05 May 2025', desc: 'Lucky Draw Credit', type: 'Credit', amount: '+ ₹500', balance: '₹7,000' },
    { date: '28 Apr 2025', desc: 'Credit Used', type: 'Debit', amount: '- ₹2,000', balance: '₹6,500' },
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 6. DISCOUNT CREDITS Panel */}
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.02)] rounded-[24px] p-5 sm:p-6">
        <div className="pb-4 border-b border-slate-50">
          <h2 className="text-base font-bold text-slate-805 uppercase tracking-wide">Discount Credits</h2>
          <p className="text-xs text-slate-400">View available value protection credits and transaction history</p>
        </div>

        {/* Two KPI Cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Card 1: Available Credits */}
          <div className="bg-[#f4fbf7] border border-emerald-100 rounded-xl p-4.5 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Available Credits</span>
              <span className="text-xl font-black text-slate-800 block mt-0.5">
                ₹{discountCreditBalance ? discountCreditBalance.toLocaleString('en-IN') : '7,500'}
              </span>
            </div>
          </div>

          {/* Card 2: Total Earned */}
          <div className="bg-[#fff7f7] border border-rose-100 rounded-xl p-4.5 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Earned</span>
              <span className="text-xl font-black text-slate-800 block mt-0.5">₹12,500</span>
            </div>
          </div>
        </div>

        {/* Credit History Table */}
        <div className="pt-6 mt-4 border-t border-slate-50 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Credit History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-655 font-medium">
                {creditHistoryData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 text-slate-500 font-mono">{item.date}</td>
                    <td className="py-3 font-bold text-slate-800">{item.desc}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-0.5 ${
                        item.type === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {item.type === 'Credit' ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                        {item.type}
                      </span>
                    </td>
                    <td className={`py-3 font-black ${item.type === 'Credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {item.amount}
                    </td>
                    <td className="py-3 text-slate-800 font-black">{item.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Apply Coupon Promo Card */}
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.02)] rounded-[24px] p-5 sm:p-6">
        <div className="pb-3 border-b border-slate-50 flex items-center gap-2">
          <Tag className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Apply Promo Code</h3>
            <p className="text-[10px] text-slate-400">Enter a coupon code to apply active discounts</p>
          </div>
        </div>

        <form onSubmit={handleAddCoupon} className="flex gap-2 w-full pt-4">
          <input
            type="text"
            placeholder="ENTER PROMO CODE"
            value={newCouponCode}
            onChange={(e) => {
              setNewCouponCode(e.target.value);
              if (couponError) setCouponError(null);
            }}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white transition-all uppercase tracking-widest font-mono font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer text-white bg-slate-800 hover:bg-slate-900 border-none shrink-0 transition-colors">
            Apply
          </button>
        </form>

        <div className="min-h-[20px] text-xs mt-2">
          {couponError && <div className="font-bold text-red-505">{couponError}</div>}
          {couponSuccess && <div className="font-bold text-emerald-650 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-505" /> {couponSuccess}</div>}
        </div>
      </div>
    </div>
  );
}
