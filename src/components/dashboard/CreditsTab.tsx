import React from 'react';
import { 
  CreditCard, Tag, CheckCircle2, Gift, Zap, Check, FileText 
} from 'lucide-react';
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
  activePlan,
  profileName,
  selectedWinners,
  availableDiscountCredits,
  discountCreditBalance,
  domesticDiscountCredits,
  internationalDiscountCredits,
  newCouponCode,
  setNewCouponCode,
  couponError,
  setCouponError,
  couponSuccess,
  handleAddCoupon,
  ledger
}: CreditsTabProps) {

  // Check if current user won a verified coupon
  const currentUserName = profileName || 'Rahul Sen';
  const customerCoupon = activePlan ? selectedWinners.find(
    w => w.name === currentUserName && w.verification_status === 'verified'
  ) : undefined;

  const displayedCoupons = activePlan ? [
    { code: 'WELCOME10', discount: '10% Off', desc: 'Valid on first tour booking', status: 'Active', expiry: 'Dec 31, 2026' },
    { code: 'BEDUINE500', discount: '₹500 Off', desc: 'Special discount voucher', status: 'Active', expiry: 'Nov 15, 2026' },
    { code: 'WK-BONUS', discount: '₹300 Off', desc: 'Weekly participation consolation', status: 'Expired', expiry: 'May 30, 2026' }
  ] : [];

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] font-mono block">Billing &amp; Wallet</span>
        <h1 className="text-slate-800 font-serif text-3xl font-black mt-1 leading-tight">My Credits &amp; Coupons</h1>
      </div>

      {/* 2-Column Split: Credits Wallet (Left) & Apply Promo Code (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch font-sans">
        {/* Card: Discount Credits Wallet */}
        <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#FF6B6B]" /> Discount Credits Wallet
            </h3>
            <p className="text-xs text-slate-400">Value protection credits issued from active plan</p>
          </div>

          <div className="bg-gradient-to-r from-red-400 to-[#FF8E53] rounded-[22px] p-5 text-center text-white shadow-md">
            <span className="text-[10px] uppercase tracking-wider font-mono block text-white/80 font-bold">AVAILABLE DISCOUNT VALUE</span>
            <span className="text-3xl font-black block mt-1 text-white">
              {availableDiscountCredits > 0 ? `₹${discountCreditBalance.toLocaleString('en-IN')}` : 'No Discount Credits available.'}
            </span>
            <span className="text-[11px] text-white/90 mt-1 block font-medium">
              {availableDiscountCredits > 0 ? `${domesticDiscountCredits} Domestic (₹500) & ${internationalDiscountCredits} International (₹5,000) active` : '0 vouchers active'}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium pt-1">
            Source: <strong className="text-slate-700 capitalize">{activePlan ? 'Active subscription' : 'No subscription active'}</strong>
          </div>
        </div>

        {/* Card: Apply Promo Code */}
        <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-500" /> Apply Promo Code
            </h3>
            <p className="text-xs text-slate-400">Enter a promo coupon to add it to your active coupons wallet</p>
          </div>

          <form onSubmit={handleAddCoupon} className="flex gap-2 w-full pt-1">
            <input
              type="text"
              placeholder="ENTER PROMO CODE"
              value={newCouponCode}
              onChange={(e) => {
                setNewCouponCode(e.target.value);
                if (couponError) setCouponError(null);
              }}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white transition-all uppercase tracking-widest font-mono font-bold focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
            />
            <button type="submit" className="px-5 py-3 rounded-xl text-xs font-bold cursor-pointer text-white bg-slate-800 hover:bg-slate-900 border-none shrink-0 transition-colors">
              Apply
            </button>
          </form>

          <div className="min-h-[20px] text-xs">
            {couponError && <div className="font-bold text-red-505">{couponError}</div>}
            {couponSuccess && <div className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {couponSuccess}</div>}
          </div>
        </div>
      </div>

      {/* Customer Winner Coupon (Travel Reward Ticket) */}
      {customerCoupon && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/20 rounded-[24px] p-6 text-white text-left space-y-4 relative overflow-hidden shadow-lg font-sans">
          <div className="absolute top-0 right-0 w-44 h-full bg-gradient-to-l from-indigo-500/10 to-transparent skew-x-12 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-[#00D4F5] text-slate-950 tracking-wider">
                🏆 Travel Reward Selection Coupon
              </span>
              <h3 className="text-lg font-black mt-2 tracking-wide text-white">Beduine Sponsored Travel Ticket</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                This coupon has been verifiably issued. Arrive at the tour departure with this QR.
              </p>
            </div>
            
            <div className="px-3.5 py-1.5 rounded-xl border border-indigo-500 bg-indigo-500/20 text-center font-mono font-bold text-xs uppercase tracking-widest text-[#00D4F5] shrink-0">
              {customerCoupon.status}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/40 p-4.5 rounded-2xl border border-white/5 text-xs">
            <div>
              <span className="block text-[8px] text-indigo-400 uppercase font-mono tracking-widest font-black">COUPON CODE</span>
              <span className="font-bold text-slate-200 mt-1 block font-mono select-all">{customerCoupon.coupon}</span>
            </div>
            <div>
              <span className="block text-[8px] text-indigo-400 uppercase font-mono tracking-widest font-black">ASSIGNED DESTINATION</span>
              <span className="font-bold text-[#00D4F5] mt-1 block">
                {customerCoupon.destination !== 'Not assigned' ? customerCoupon.destination : '⏳ Awaiting Admin Assignment'}
              </span>
            </div>
            <div>
              <span className="block text-[8px] text-indigo-400 uppercase font-mono tracking-widest font-black">TOUR BATCH</span>
              <span className="font-bold text-[#FF8E53] mt-1 block">
                {customerCoupon.batch !== 'Not assigned' ? customerCoupon.batch : '⏳ Awaiting Admin Assignment'}
              </span>
            </div>
            <div>
              <span className="block text-[8px] text-indigo-400 uppercase font-mono tracking-widest font-black">TRAVEL DATE</span>
              <span className="font-bold text-slate-300 mt-1 block">
                {customerCoupon.travelDate !== 'Not assigned' ? customerCoupon.travelDate : '⏳ Awaiting Admin Assignment'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <div className="text-[10px] text-slate-400">
              {customerCoupon.status === 'Tour Assigned' && (
                <span className="text-emerald-400 font-bold">✅ Tour assigned successfully. Click the QR code block to simulate staff scan verification!</span>
              )}
              {customerCoupon.status === 'Issued' && (
                <span className="text-amber-400 font-bold">📞 System verified. Awaiting company call and destination selection.</span>
              )}
              {customerCoupon.status === 'Redeemed' && (
                <span className="text-slate-400 font-bold">🎉 Tour redeemed at {customerCoupon.redeemedAt} by {customerCoupon.redeemedBy}. Hope you had a great trip!</span>
              )}
              {customerCoupon.status === 'Cancelled' && (
                <span className="text-red-400 font-bold">❌ This coupon was cancelled. Please contact support.</span>
              )}
            </div>

            {customerCoupon.status !== 'Cancelled' && (
              <a 
                href={`/verify-coupon?t=${customerCoupon.token}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 bg-white p-2.5 rounded-2xl hover:scale-102 transition-transform shadow-md cursor-pointer text-slate-900 no-underline shrink-0"
              >
                <div className="grid grid-cols-4 gap-0.5 w-14 h-14 bg-white p-1 rounded-sm border border-slate-100">
                  {Array.from({ length: 16 }).map((_, idx) => (
                    <div key={idx} className={`w-full h-full ${
                      (idx + 7) % 3 === 0 ? 'bg-slate-950' : 'bg-white'
                    }`} />
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-[9px] font-black uppercase text-slate-800 tracking-wider">TAP TO SCAN</div>
                  <div className="text-[8px] text-slate-500 font-mono mt-0.5">verify-coupon?t={customerCoupon.token.slice(0, 5)}...</div>
                </div>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Combined Lists Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4 border-t border-slate-100 font-sans">
        
        {/* Subsection 1: Discount Credit Vouchers */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Gift className="w-4.5 h-4.5 text-[#FF6B6B]" /> Discount Credit Vouchers
          </h3>
          {availableDiscountCredits === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 font-bold bg-slate-50/30">
              No active credit vouchers left in your wallet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {(() => {
                const activeVouchersList: { category: 'domestic' | 'international'; value: number; code: string }[] = [];
                for (let i = 0; i < domesticDiscountCredits; i++) {
                  activeVouchersList.push({ category: 'domestic', value: 500, code: `BDN-DOM-${i + 101}` });
                }
                for (let i = 0; i < internationalDiscountCredits; i++) {
                  activeVouchersList.push({ category: 'international', value: 5000, code: `BDN-INTL-${i + 101}` });
                }
                return activeVouchersList.map((voucher, idx) => (
                  <div key={idx} className="rounded-2xl border-2 border-dashed border-slate-200 p-4 relative overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border-r border-slate-200" />
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border-l border-slate-200" />

                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53]">
                          <Zap className="w-2.5 h-2.5" /> ACTIVE
                        </span>
                        <div className="text-lg font-black text-slate-800 mt-2">₹{voucher.value.toLocaleString('en-IN')} Voucher</div>
                        <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider mt-0.5">
                          {voucher.category === 'international' ? 'International bookings' : 'Domestic bookings'}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-50 text-[#FF6B6B]">
                        <Gift className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Code: <strong className="font-mono text-slate-655 font-bold select-all">{voucher.code}</strong></span>
                      <span className="font-bold text-emerald-500 flex items-center gap-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /> Unused</span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>

        {/* Subsection 2: Promo Coupons */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-4.5 h-4.5 text-indigo-500" /> My Active Coupons &amp; Promos
          </h3>
          {displayedCoupons.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 font-bold bg-slate-50/30">
              No coupons in your wallet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {displayedCoupons.map((item, idx) => (
                <div key={idx} className={`rounded-xl border p-4 text-left relative flex justify-between items-center transition-all ${
                  item.status === 'Active' ? 'border-pink-100 bg-pink-50/10' : 'border-slate-100 bg-slate-50/30 opacity-70'
                }`}>
                  <div>
                    <span className="text-[8px] font-black font-mono tracking-widest uppercase text-slate-455 block">COUPON CODE</span>
                    <span className="text-base font-black text-slate-800 tracking-wider font-mono block mt-1 select-all">{item.code}</span>
                    <span className="text-xs font-extrabold text-pink-600 block mt-1">{item.discount} discount</span>
                    <span className="text-[10px] text-slate-400 block mt-1 font-semibold">{item.desc}</span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      item.status === 'Active' ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-1 font-mono">Exp: {item.expiry}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Immutable Credit Transaction Ledger Table */}
      <div className="pt-6 border-t border-slate-100 space-y-4 font-sans">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-450" /> Immutable Credit Transaction Ledger
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2.5">Date / Time</th>
                <th className="py-2.5">Transaction ID</th>
                <th className="py-2.5">Type</th>
                <th className="py-2.5">Credit Type</th>
                <th className="py-2.5 text-center">Amount</th>
                <th className="py-2.5">Reason / References</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
              {ledger.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-semibold">{item.date}</td>
                  <td className="py-3 font-mono font-bold text-slate-500">{item.id}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                      item.type === 'issued' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      item.type === 'reserved' ? 'bg-yellow-50 text-amber-600 border-amber-100' :
                      item.type === 'redeemed' ? 'bg-pink-50 text-pink-650 border-pink-100' :
                      item.type === 'reversed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      item.type === 'expired' ? 'bg-red-50 text-red-550 border-red-100' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="font-semibold text-slate-700 capitalize">
                      {item.creditType === 'lucky_draw' ? 'travel reward' : item.creditType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={`py-3 text-center font-black ${item.amount > 0 ? 'text-emerald-505' : 'text-slate-655'}`}>
                    {item.amount > 0 ? `+${item.amount}` : item.amount}
                  </td>
                  <td className="py-3 leading-normal">
                    <div>{item.reason}</div>
                    <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 mt-1 text-[10px] font-semibold">
                      {item.creditCategory && (
                        <span className={`capitalize ${
                          item.creditCategory === 'international' ? 'text-indigo-600' :
                          item.creditCategory === 'domestic' ? 'text-emerald-605' : 'text-slate-500'
                        }`}>
                          Category: {item.creditCategory}
                        </span>
                      )}
                      {item.creditValue && (
                        <span className="text-slate-500">
                          (Value: ₹{item.creditValue.toLocaleString('en-IN')})
                        </span>
                      )}
                    </div>
                    {item.bookingRef && <div className="text-[9px] text-sky-500 font-mono mt-0.5 font-bold">Booking Ref: {item.bookingRef}</div>}
                    {item.adminRef && <div className="text-[9px] text-rose-500 font-mono mt-0.5 font-bold">Admin Ref: {item.adminRef}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
