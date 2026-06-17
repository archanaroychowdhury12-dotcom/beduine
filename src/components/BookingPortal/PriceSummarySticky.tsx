import React from 'react';
import { ArrowDown, ShieldCheck, Tag, Users } from 'lucide-react';
import { PriceCalculation, TourPackage } from '../../types';

interface PriceSummaryStickyProps {
  tour: TourPackage;
  pricing: PriceCalculation;
  selectedDate: string;
}

const formatINR = (value: number) => `INR ${value.toLocaleString('en-IN')}`;

export const PriceSummarySticky: React.FC<PriceSummaryStickyProps> = ({ tour, pricing, selectedDate }) => {
  const scrollToPayment = () => {
    const el = document.getElementById('step-9');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <aside className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-slate-800 space-y-8 sticky top-24">
      <div className="space-y-3 pb-6 border-b border-slate-800 text-left">
        <div className="flex items-center justify-between gap-3">
          <span className="bg-amber-500/20 text-amber-400 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Live Price Summary
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">
            REF: BED-{tour.id.slice(0, 4).toUpperCase()}
          </span>
        </div>

        <h3 className="font-serif-premium text-2xl font-black leading-tight text-white">
          {tour.name}
        </h3>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 pt-1">
          <span>{formattedDate}</span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>{pricing.travelerCount} Traveler{pricing.travelerCount > 1 ? 's' : ''}</span>
          </span>
        </div>
      </div>

      <div className="space-y-4 text-sm font-medium text-slate-300 text-left">
        <div className="flex justify-between items-baseline gap-4 py-1">
          <span>Base Price ({formatINR(pricing.basePricePerPerson)} x {pricing.travelerCount})</span>
          <span className="font-bold text-white font-mono text-right">{formatINR(pricing.subtotalBase)}</span>
        </div>

        {pricing.isPrivateTour && (
          <div className="flex justify-between items-baseline gap-4 py-1 text-amber-400">
            <span>Private Tour Upgrade ({formatINR(tour.groupSize.privateSurchargePerPerson)} x {pricing.travelerCount})</span>
            <span className="font-bold font-mono text-right">+{formatINR(pricing.privateSurchargeTotal)}</span>
          </div>
        )}

        {pricing.appliedVoucher && (
          <div className="flex justify-between items-baseline gap-4 text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/80">
            <div className="flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Voucher ({pricing.appliedVoucher.code})</span>
            </div>
            <span className="font-extrabold font-mono text-right">-{formatINR(pricing.voucherDiscountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between items-baseline gap-4 py-1">
          <span className="text-slate-400">Service Fee & Tax (5%)</span>
          <span className="font-bold text-white font-mono text-right">{formatINR(pricing.serviceFeeOrTax)}</span>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800 space-y-4 text-left">
        <div className="flex justify-between items-baseline gap-4">
          <span className="text-base font-black text-white uppercase tracking-wider font-serif-premium">Final Amount</span>
          <span className="text-3xl sm:text-4xl font-black text-amber-400 font-serif-premium font-mono text-right">
            {formatINR(pricing.totalPayable)}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 block italic">
          Includes listed inclusions, guide/support, transfers, and estimated service fee.
        </span>

        <button
          onClick={scrollToPayment}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base transition-all duration-300 transform hover:scale-[1.02] shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 cursor-pointer mt-4"
        >
          <span>Continue to Payment</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>

        <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Cancellation rules shown before payment.</span>
        </div>
      </div>
    </aside>
  );
};
