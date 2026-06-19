import React, { useState } from 'react';
import { PaymentDetails, TourPackage, Traveler, PickupInfo, Voucher, PriceCalculation } from '../../types';
import { CreditCard, ShieldCheck, Lock, AlertCircle, ArrowRight, Sparkles, Edit2, ShieldAlert } from 'lucide-react';
import { ADD_ONS } from './PickupSection';

interface PaymentSectionProps {
  tour: TourPackage;
  selectedDate: string;
  travelers: Traveler[];
  appliedVoucher?: Voucher;
  pickup: PickupInfo;
  addOnsSelected: string[];
  pricing: PriceCalculation;
  onJumpToStep: (step: number) => void;

  paymentDetails: PaymentDetails;
  setPaymentDetails: React.Dispatch<React.SetStateAction<PaymentDetails>>;
  onPayNow: () => void;
  isProcessing: boolean;
  processingStep: string;
  canProceed: boolean;
  termsWarning?: string;

  agreedToTerms: boolean;
  setAgreedToTerms: (val: boolean) => void;
  agreedToPassport: boolean;
  setAgreedToPassport: (val: boolean) => void;
}

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  tour,
  selectedDate,
  travelers,
  appliedVoucher,
  pickup,
  addOnsSelected,
  pricing,
  onJumpToStep,
  
  paymentDetails,
  setPaymentDetails,
  onPayNow,
  isProcessing,
  processingStep,
  canProceed,
  termsWarning,

  agreedToTerms,
  setAgreedToTerms,
  agreedToPassport,
  setAgreedToPassport,
}) => {
  const [cardNumber, setCardNumber] = useState('4532 0000 0000 8942');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCVC, setCardCVC] = useState('892');
  const [cardHolderName, setCardHolderName] = useState('Rahul Sen');

  const handleMethodSelect = (method: PaymentDetails['method']) => {
    setPaymentDetails(prev => ({ ...prev, method }));
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Step Header */}
      <div>
        <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-0.5">Step 5 — Review & Pay</span>
        <h3 className="text-xl font-bold text-slate-900">Review Reservation & Authorize Checkout</h3>
        <p className="text-xs text-slate-500 mt-1">Carefully double check your details before processing payment.</p>
      </div>

      {/* Review Screen Summary Cards */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-5">
        <h4 className="text-sm font-bold text-slate-900 pb-2.5 border-b border-slate-100 flex items-center justify-between">
          <span>Booking Summary Review</span>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">CONF-PREVIEW</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Section: Tour Package */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex justify-between items-start gap-4">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Tour Package</span>
              <span className="text-xs font-bold text-slate-900 block mt-1">{tour.name}</span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">{tour.durationDays} Days / {tour.durationNights} Nights • {tour.destination}</span>
            </div>
            <button
              onClick={() => onJumpToStep(1)}
              className="text-[10px] font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>

          {/* Section: Date */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex justify-between items-start gap-4">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Departure Date</span>
              <span className="text-xs font-bold text-slate-900 block mt-1">{formattedDate}</span>
              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">Guaranteed Departure</span>
            </div>
            <button
              onClick={() => onJumpToStep(1)}
              className="text-[10px] font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>

          {/* Section: Travelers */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex justify-between items-start gap-4">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Traveler Roster</span>
              <span className="text-xs font-bold text-slate-900 block mt-1">
                {travelers.length} Traveler{travelers.length > 1 ? 's' : ''} ({travelers.filter(t => t.ageGroup === 'Adult').length} Adults, {travelers.filter(t => t.ageGroup === 'Child').length} Children, {travelers.filter(t => t.ageGroup === 'Infant').length} Infants)
              </span>
              <div className="text-[10px] text-slate-500 mt-1 space-y-0.5 max-h-16 overflow-y-auto">
                {travelers.map((t, i) => (
                  <span key={i} className="block truncate">{i + 1}. {t.firstName} {t.lastName} ({t.ageGroup})</span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onJumpToStep(3)}
              className="text-[10px] font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>

          {/* Section: Voucher Pack */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex justify-between items-start gap-4">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Applied Promo / Pack</span>
              <span className="text-xs font-bold text-slate-900 block mt-1">
                {appliedVoucher ? `${appliedVoucher.code}` : 'No voucher applied'}
              </span>
              {appliedVoucher && (
                <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
                  Saved {appliedVoucher.type === 'percentage' ? `${appliedVoucher.value}%` : formatINR(appliedVoucher.value)}
                </span>
              )}
            </div>
            <button
              onClick={() => onJumpToStep(2)}
              className="text-[10px] font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>

          {/* Section: Pickup location */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex justify-between items-start gap-4">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Ground Transfers</span>
              <span className="text-xs font-bold text-slate-900 block mt-1">
                {pickup.type === 'hotel'
                  ? `Spot: ${pickup.hotelName}`
                  : pickup.type === 'manual'
                  ? `Address: ${pickup.customAddress}, ${pickup.city}`
                  : pickup.type === 'assistance'
                  ? 'Request Logistics Call Support'
                  : 'Self Arrival'}
              </span>
              {pickup.dropoffDifferent && pickup.dropoffLocation && (
                <span className="text-[10px] text-slate-500 block mt-0.5">Drop: {pickup.dropoffLocation}</span>
              )}
            </div>
            <button
              onClick={() => onJumpToStep(4)}
              className="text-[10px] font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>

          {/* Section: Add-ons */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex justify-between items-start gap-4">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Optional Extras</span>
              <span className="text-xs font-bold text-slate-900 block mt-1">
                {addOnsSelected.length > 0
                  ? `${addOnsSelected.length} Add-ons selected`
                  : 'No add-ons selected'}
              </span>
              <div className="text-[10px] text-slate-500 mt-1 space-y-0.5">
                {ADD_ONS.filter(a => addOnsSelected.includes(a.id)).map((addon, i) => (
                  <span key={i} className="block">• {addon.name} ({formatINR(addon.price)})</span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onJumpToStep(4)}
              className="text-[10px] font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>
        </div>

        {/* Dynamic Price Breakdown Card */}
        <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4">
          <h5 className="text-xs font-black uppercase text-amber-400 tracking-wider">Checkout Billing Breakdown</h5>
          
          <div className="space-y-2.5 text-xs text-slate-350">
            <div className="flex justify-between">
              <span>Base Ticket Price ({formatINR(pricing.basePricePerPerson)} x {pricing.travelerCount})</span>
              <span className="font-mono font-bold text-white">{formatINR(pricing.subtotalBase)}</span>
            </div>

            {pricing.isPrivateTour && (
              <div className="flex justify-between text-amber-400">
                <span>Private VIP Surcharge Upgrade</span>
                <span className="font-mono font-bold">+{formatINR(pricing.privateSurchargeTotal)}</span>
              </div>
            )}

            {addOnsSelected.length > 0 && pricing.addOnsTotal !== undefined && (
              <div className="flex justify-between">
                <span>Selected Tour Add-ons</span>
                <span className="font-mono font-bold text-white">+{formatINR(pricing.addOnsTotal)}</span>
              </div>
            )}

            {pricing.isInsuranceSelected && pricing.insuranceTotal !== undefined && pricing.insuranceTotal > 0 && (
              <div className="flex justify-between">
                <span>Expedition Insurance Upgrade</span>
                <span className="font-mono font-bold text-white">+{formatINR(pricing.insuranceTotal)}</span>
              </div>
            )}

            {pricing.voucherDiscountAmount > 0 && (
              <div className="flex justify-between text-emerald-450 font-bold">
                <span>Applied Coupon Savings</span>
                <span className="font-mono font-bold">-{formatINR(pricing.voucherDiscountAmount)}</span>
              </div>
            )}

            {pricing.discountCreditsTotal !== undefined && pricing.discountCreditsTotal > 0 && (
              <div className="flex justify-between text-emerald-455 font-bold">
                <span>Plan Discount Credits</span>
                <span className="font-mono font-bold">-{formatINR(pricing.discountCreditsTotal)}</span>
              </div>
            )}

            {pricing.memberDiscountTotal !== undefined && pricing.memberDiscountTotal > 0 && (
              <div className="flex justify-between text-emerald-450 font-bold">
                <span>Membership Discount Savings</span>
                <span className="font-mono font-bold">-{formatINR(pricing.memberDiscountTotal)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Service Fee & Tax (5%)</span>
              <span className="font-mono font-bold text-white">{formatINR(pricing.serviceFeeOrTax)}</span>
            </div>
          </div>

          <div className="pt-3.5 border-t border-slate-800 flex justify-between items-baseline">
            <span className="text-sm font-black uppercase text-white font-serif-premium">Total Payable Amount</span>
            <span className="text-2xl font-black text-amber-400 font-mono font-serif-premium">
              {formatINR(pricing.totalPayable)}
            </span>
          </div>
        </div>
      </div>

      {/* Gateway selector */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
          Choose Payment Method
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'credit_card' as const, label: 'Card Payment', icon: CreditCard },
            { id: 'apple_pay' as const, label: 'Pay / GPay', icon: Lock },
            { id: 'paypal' as const, label: 'PayPal', icon: ShieldCheck },
            { id: 'bank_wire' as const, label: 'Bank Wire', icon: Lock },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = paymentDetails.method === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleMethodSelect(item.id)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 h-20 cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/15 shadow-sm ring-2 ring-amber-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="text-[11px] font-bold text-slate-800">{item.label}</span>
              </button>
            );
          })}
        </div>

        {paymentDetails.method === 'credit_card' && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-white py-2 px-3 rounded-lg border border-slate-200 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Cardholder Name</label>
              <input
                type="text"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                className="w-full bg-white py-2 px-3 rounded-lg border border-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Expiry</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full bg-white py-2 px-3 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">CVC</label>
                <input
                  type="password"
                  value={cardCVC}
                  onChange={(e) => setCardCVC(e.target.value)}
                  className="w-full bg-white py-2 px-3 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Terms & Verification checkboxes */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 shadow-md text-xs font-semibold">
        <span className="text-amber-400 font-bold block flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" /> Policy Verification & Agreements
        </span>

        <div className="space-y-3.5">
          <label className="flex items-start space-x-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToPassport}
              onChange={(e) => setAgreedToPassport(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 border-slate-700 bg-slate-800 mt-0.5 focus:ring-amber-500 cursor-pointer"
            />
            <div>
              <span className="block text-white font-bold">Valid Traveler Identification Verification</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block leading-normal">
                I verify that all listed travelers possess valid IDs or international passports valid for at least 6 months past return dates as operationally mandated.
              </span>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 border-slate-700 bg-slate-800 mt-0.5 focus:ring-amber-500 cursor-pointer"
            />
            <div>
              <span className="block text-white font-bold">Acknowledge Cancellation & Transfer Policies</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block leading-normal">
                I agree to the BEDUINE booking terms, 100% free refund window guidelines (up to 48 hours), and luggage logistics support policies.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Warning message if terms not agreed */}
      {!canProceed && termsWarning && (
        <div className="p-4 bg-rose-50 border border-rose-250/60 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-bold animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{termsWarning}</span>
        </div>
      )}

      {/* Secure simulated CTA payment button */}
      <div className="pt-2">
        {isProcessing ? (
          <div className="p-5 rounded-2xl bg-slate-950 text-white text-center space-y-4 shadow-md">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded tracking-widest uppercase">Encryption Active</span>
              <h5 className="font-bold text-sm text-white mt-1.5">{processingStep}</h5>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onPayNow}
            disabled={!canProceed}
            className={`w-full py-4.5 rounded-xl font-serif-premium font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              canProceed
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Continue to Secure Payment of {formatINR(pricing.totalPayable)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Checkout seals */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider pt-2 border-t border-slate-50">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL protection</span>
        <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-500" /> Instant ticket voucher</span>
      </div>

    </div>
  );
};
