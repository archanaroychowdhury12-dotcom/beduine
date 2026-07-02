import { Clock, CreditCard, ShieldCheck } from 'lucide-react';

type BookingTrustCardsProps = {
  onOpenPolicy: (title: string, content: string) => void;
};

export function BookingTrustCards({ onOpenPolicy }: BookingTrustCardsProps) {
  return (
    <div className="pt-10 border-t border-slate-200 text-left">
      <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">BEDUINE Payment & Travel Policy Highlights</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onOpenPolicy('Advance Payment Schedule', 'Fixed departure group tours require 25% advance at booking, 25% 30 days before departure, 30% 15 days before departure, and 20% 7 days before departure. Customized tours require 50% advance, then 25% 7 days before departure, and 25% before tour start.')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-350 shadow-sm flex items-start space-x-3.5 cursor-pointer transition-all"
        >
          <CreditCard className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-xs text-slate-900 block">Advance Payment</span>
            <span className="text-[10px] text-slate-500 block leading-tight mt-1">Booking confirms after required advance.</span>
          </div>
        </div>

        <div
          onClick={() => onOpenPolicy('Cancellation Charges', 'Cancellation charges are timeline based: 30+ days only ₹500/person service charge plus supplier charges; 15–29 days: 25%; 7–14 days: 50%; 0–6 days or no-show: 100%.')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-350 shadow-sm flex items-start space-x-3.5 cursor-pointer transition-all"
        >
          <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-xs text-slate-900 block">Cancellation Timeline</span>
            <span className="text-[10px] text-slate-500 block leading-tight mt-1">Charges depend on departure timeline.</span>
          </div>
        </div>

        <div
          onClick={() => onOpenPolicy('Secure Checkout & Credit Adjustment', 'Approved refunds are processed within 15–30 working days. Eligible credits may be adjusted against future bookings within 12 months and cannot be withdrawn as cash.')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-350 shadow-sm flex items-start space-x-3.5 cursor-pointer transition-all"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-xs text-slate-900 block">Secure Checkout</span>
            <span className="text-[10px] text-slate-500 block leading-tight mt-1">Refund and credit rules are transparent.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
