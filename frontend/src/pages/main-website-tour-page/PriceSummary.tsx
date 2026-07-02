import React, { useState } from 'react';
import { Tag, Users, ChevronUp, ChevronDown, Calendar, Clock, MapPin, Bookmark, HelpCircle } from 'lucide-react';
import { AdvancePaymentPlan, PriceCalculation, TourPackage } from '../../types';
import { ADD_ONS } from './PickupDropoffForm';

interface PriceSummaryStickyProps {
  tour: TourPackage;
  pricing: PriceCalculation;
  paymentPlan: AdvancePaymentPlan;
  selectedDate: string;
  onJumpToStep: (step: number) => void;
  onSaveLater: () => void;
  onSupportClick?: () => void;
}

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export const PriceSummarySticky: React.FC<PriceSummaryStickyProps> = ({
  tour,
  pricing,
  paymentPlan,
  selectedDate,
  onJumpToStep,
  onSaveLater,
  onSupportClick,
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate total savings: member discount + voucher discount + credits
  const totalSavings =
    (pricing.voucherDiscountAmount || 0) +
    (pricing.memberDiscountTotal || 0) +
    (pricing.discountCreditsTotal || 0);

  const summaryContent = (isMobileSheet = false) => {
    return (
      <div className={`space-y-5 text-left ${isMobileSheet ? 'text-slate-800' : 'text-white'}`}>
        
        {/* Header summary block */}
        <div className="flex items-start gap-3.5 pb-4 border-b border-slate-200/10">
          <img
            src={tour.image}
            alt={tour.name}
            className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-100"
          />
          <div className="truncate">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-500" /> {tour.destination}
            </span>
            <h4 className={`text-sm font-bold truncate ${isMobileSheet ? 'text-slate-900' : 'text-white'}`}>{tour.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{tour.durationDays}D / {tour.durationNights}N</span>
            </div>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="space-y-3.5 text-xs font-semibold">
          
          {/* Travelers row */}
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{pricing.travelerCount} Traveler{pricing.travelerCount > 1 ? 's' : ''}</span>
            </div>
            <button
              onClick={() => {
                onJumpToStep(3);
                if (isMobileSheet) setMobileExpanded(false);
              }}
              className="text-[10px] text-amber-500 hover:underline font-bold"
            >
              Edit
            </button>
          </div>

          {/* Date row */}
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
            <button
              onClick={() => {
                onJumpToStep(1);
                if (isMobileSheet) setMobileExpanded(false);
              }}
              className="text-[10px] text-amber-500 hover:underline font-bold"
            >
              Edit
            </button>
          </div>

          {/* Voucher Pack row */}
          {pricing.appliedVoucher && (
            <div className={`p-2.5 rounded-lg flex justify-between items-center ${
              isMobileSheet ? 'bg-emerald-50 text-emerald-850' : 'bg-emerald-950/20 text-emerald-300'
            }`}>
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-500" />
                <span>Coupon: {pricing.appliedVoucher.code}</span>
              </div>
              <span className="font-mono font-black">-{formatINR(pricing.voucherDiscountAmount)}</span>
            </div>
          )}

          {/* Add-ons list preview */}
          {pricing.addOnsSelected && pricing.addOnsSelected.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-200/10">
              <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider">
                <span>Selected Add-ons</span>
                <button
                  onClick={() => {
                    onJumpToStep(4);
                    if (isMobileSheet) setMobileExpanded(false);
                  }}
                  className="text-amber-500 hover:underline font-bold"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-1">
                {ADD_ONS.filter((a: any) => pricing.addOnsSelected?.includes(a.id)).map((addon: any) => (
                  <div key={addon.id} className="flex justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[150px] font-semibold">{addon.name}</span>
                    <span className="font-mono">{formatINR(addon.perPerson ? addon.price * pricing.travelerCount : addon.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Savings banner */}
        {totalSavings > 0 && (
          <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/10 rounded-xl flex items-center justify-between text-xs text-emerald-400 font-extrabold animate-pulse-soft">
            <span className="flex items-center gap-1">✨ You Save:</span>
            <span className="font-mono">{formatINR(totalSavings)}</span>
          </div>
        )}

        {/* Taxes disclosure */}
        <div className="flex justify-between items-center text-[10px] text-slate-450 border-t border-slate-200/10 pt-3">
          <span>Taxes & service fee (5%)</span>
          <span className="font-mono">{formatINR(pricing.serviceFeeOrTax)}</span>
        </div>

        {paymentPlan.instantBookingCharge > 0 && (
          <div className="flex justify-between items-center text-[10px] text-amber-300 font-bold">
            <span>Instant booking charge</span>
            <span className="font-mono">{formatINR(paymentPlan.instantBookingCharge)}</span>
          </div>
        )}

        {/* Total block */}
        <div className="pt-3 border-t border-slate-200/10 flex justify-between items-baseline">
          <div className="text-left">
            <span className={`text-[10px] uppercase font-bold tracking-widest block ${isMobileSheet ? 'text-slate-400' : 'text-slate-450'}`}>Payable Now</span>
            <span className="text-[10px] text-slate-500 font-medium block">Advance of {formatINR(paymentPlan.grandTotal)} total</span>
          </div>
          <span className={`text-3xl font-black font-serif-premium font-mono ${isMobileSheet ? 'text-slate-900' : 'text-amber-400'}`}>
            {formatINR(paymentPlan.advanceDueNow)}
          </span>
        </div>

        {/* Sidebar buttons */}
        {!isMobileSheet && (
          <div className="pt-4 space-y-3">
            <button
              onClick={onSaveLater}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase transition-colors border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Save trip for later</span>
            </button>

            <button
              onClick={onSupportClick}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-xl text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Helpline Support</span>
            </button>
          </div>
        )}

      </div>
    );
  };

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block bg-slate-905 bg-slate-900 text-white rounded-[24px] p-6 shadow-2xl border border-slate-800 space-y-6 sticky top-24">
        {summaryContent(false)}
      </aside>

      {/* Mobile Responsive Bottom Sticky Sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[140] bg-slate-900 border-t border-slate-850 text-white shadow-2xl p-4 flex flex-col">
        
        {/* Compact bottom bar always visible */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Pay Now</span>
              {totalSavings > 0 && (
                <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-black uppercase">
                  Save {formatINR(totalSavings)}
                </span>
              )}
            </div>
            <span className="text-2xl font-black text-amber-400 font-mono font-serif-premium leading-none mt-1 block">
              {formatINR(paymentPlan.advanceDueNow)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileExpanded(!mobileExpanded)}
              className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-750 flex items-center gap-1 cursor-pointer text-xs font-bold"
            >
              <span>Details</span>
              {mobileExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                const payButton = document.getElementById('step-9');
                if (payButton) {
                  payButton.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-xl text-xs font-black uppercase shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              Check Out
            </button>
          </div>
        </div>

        {/* Slide up sheet drawer details */}
        {mobileExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-850 max-h-[60vh] overflow-y-auto animate-fadeIn pb-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
              {summaryContent(false)}
            </div>
          </div>
        )}

      </div>
    </>
  );
};
