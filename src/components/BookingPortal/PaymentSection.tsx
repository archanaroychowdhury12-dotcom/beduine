import React, { useState } from 'react';
import { PaymentDetails } from '../../types';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

interface PaymentSectionProps {
  paymentDetails: PaymentDetails;
  setPaymentDetails: React.Dispatch<React.SetStateAction<PaymentDetails>>;
  onPayNow: () => void;
  totalPayable: number;
  isProcessing: boolean;
  processingStep: string;
  canProceed: boolean;
  termsWarning?: string;
}

const formatINR = (value: number) => `INR ${value.toLocaleString('en-IN')}`;

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentDetails,
  setPaymentDetails,
  onPayNow,
  totalPayable,
  isProcessing,
  processingStep,
  canProceed,
  termsWarning
}) => {
  const [cardNumber, setCardNumber] = useState('4532 0000 0000 8942');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCVC, setCardCVC] = useState('892');
  const [cardHolderName, setCardHolderName] = useState('Rahul Sen');

  const handleMethodSelect = (method: PaymentDetails['method']) => {
    setPaymentDetails(prev => ({ ...prev, method }));
  };

  return (
    <section id="step-9" className="py-16 scroll-mt-24 border-t border-slate-200/80 text-left">
      <div className="space-y-4 mb-10">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-600">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">9</span>
          <span>Payment & Security Authorization</span>
        </div>
        <h2 className="font-serif-premium text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Complete Your Reservation Securely
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl">
          This checkout is a booking-flow simulation for BEDUINE paid tour requests. Authorize payment to generate a confirmation preview.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        {/* Payment Method Selector */}
        <div className="space-y-4">
          <label className="block text-xs font-black uppercase text-slate-700 tracking-wider flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Select Payment Gateway</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Credit Card */}
            <button
              type="button"
              onClick={() => handleMethodSelect('credit_card')}
              className={`p-4 rounded-2xl text-left font-bold text-sm transition-all border flex flex-col justify-between h-28 cursor-pointer ${
                paymentDetails.method === 'credit_card'
                  ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-lg ring-2 ring-amber-500'
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <CreditCard className="w-6 h-6" />
                {paymentDetails.method === 'credit_card' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <span className="block text-sm">Credit / Debit Card</span>
                <span className="text-[10px] text-slate-400 block font-normal mt-0.5">Visa, Master, Amex</span>
              </div>
            </button>

            {/* Apple / Google Pay */}
            <button
              type="button"
              onClick={() => handleMethodSelect('apple_pay')}
              className={`p-4 rounded-2xl text-left font-bold text-sm transition-all border flex flex-col justify-between h-28 cursor-pointer ${
                paymentDetails.method === 'apple_pay'
                  ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-lg ring-2 ring-amber-500'
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex space-x-1 items-center font-black tracking-tighter text-base">
                  <span>Pay / GPay</span>
                </div>
                {paymentDetails.method === 'apple_pay' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <span className="block text-sm">Digital Wallet</span>
                <span className="text-[10px] text-slate-400 block font-normal mt-0.5">Instant one-tap biometric</span>
              </div>
            </button>

            {/* PayPal */}
            <button
              type="button"
              onClick={() => handleMethodSelect('paypal')}
              className={`p-4 rounded-2xl text-left font-bold text-sm transition-all border flex flex-col justify-between h-28 cursor-pointer ${
                paymentDetails.method === 'paypal'
                  ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-lg ring-2 ring-amber-500'
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-extrabold italic text-blue-500 tracking-wider">PayPal</span>
                {paymentDetails.method === 'paypal' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <span className="block text-sm">PayPal Checkout</span>
                <span className="text-[10px] text-slate-400 block font-normal mt-0.5">Pay in 4 installments option</span>
              </div>
            </button>

            {/* Bank Wire */}
            <button
              type="button"
              onClick={() => handleMethodSelect('bank_wire')}
              className={`p-4 rounded-2xl text-left font-bold text-sm transition-all border flex flex-col justify-between h-28 cursor-pointer ${
                paymentDetails.method === 'bank_wire'
                  ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-lg ring-2 ring-amber-500'
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-serif-premium font-black">IBAN Wire</span>
                {paymentDetails.method === 'bank_wire' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <span className="block text-sm">Bank Wire Transmit</span>
                <span className="text-[10px] text-slate-400 block font-normal mt-0.5">SWIFT / SEPA Global</span>
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Payment Specific Forms */}
        {paymentDetails.method === 'credit_card' && (
          <div className="space-y-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Secure Card Simulation credentials</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Checked & Verified Gateway
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    setCardNumber(e.target.value);
                    setPaymentDetails(p => ({ ...p, cardNumberLast4: e.target.value.slice(-4) }));
                  }}
                  className="w-full bg-white py-3.5 px-4 rounded-xl border border-slate-200 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardHolderName}
                  onChange={(e) => {
                    setCardHolderName(e.target.value);
                    setPaymentDetails(p => ({ ...p, cardHolder: e.target.value }));
                  }}
                  className="w-full bg-white py-3.5 px-4 rounded-xl border border-slate-200 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Expiration
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-white py-3.5 px-4 rounded-xl border border-slate-200 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex justify-between">
                    <span>CVC / CVV</span>
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value)}
                    className="w-full bg-white py-3.5 px-4 rounded-xl border border-slate-200 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentDetails.method === 'apple_pay' && (
          <div className="p-8 text-center bg-slate-900 text-white rounded-3xl space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-white text-slate-950 flex items-center justify-center text-2xl font-black mx-auto">
              
            </div>
            <h4 className="font-serif-premium text-2xl font-bold">Ready for Biometric Authentication</h4>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Clicking "Authorize Payment" below will trigger simulated biometric authorization for <span className="text-amber-400 font-bold">{formatINR(totalPayable)}</span>.
            </p>
          </div>
        )}

        {paymentDetails.method === 'paypal' && (
          <div className="p-8 text-center bg-blue-50 text-blue-950 rounded-3xl border border-blue-200 space-y-4 animate-fadeIn">
            <h4 className="font-serif-premium text-2xl font-bold">Secure PayPal Authentication</h4>
            <p className="text-blue-800 text-sm max-w-md mx-auto">
              You will be fully authenticated with your verified primary PayPal account credentials. Enjoy buyer protection and flexible repayment options.
            </p>
          </div>
        )}

        {paymentDetails.method === 'bank_wire' && (
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 space-y-4 animate-fadeIn text-left text-sm">
            <h4 className="font-serif-premium text-xl font-bold text-slate-900">Official Bank Transfer Transmittal Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-white p-4 rounded-2xl border">
              <div>
                <span className="text-slate-400 block font-sans font-bold">Beneficiary Name</span>
                <span className="font-bold text-slate-800">BEDUINE Tour & Travels</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans font-bold">SWIFT / BIC Code</span>
                <span className="font-bold text-slate-800">BEDUINE-DEMO</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans font-bold">IBAN Account</span>
                <span className="font-bold text-slate-800">DEMO ACCOUNT - NOT FOR REAL TRANSFER</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans font-bold">Reference Notice</span>
                <span className="font-bold text-amber-600">Please quote your Booking ID on wire</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">Your reservation will be locked instantly. You have 72 hours to transmit funds.</p>
          </div>
        )}

        {/* Warning messages if terms not agreed */}
        {!canProceed && termsWarning && (
          <div className="p-5 bg-rose-50 rounded-2xl border border-rose-300 flex items-center space-x-3 text-rose-900 text-xs sm:text-sm font-bold animate-pulse">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <span>{termsWarning}</span>
          </div>
        )}

        {/* Live processing state animation overlay or Primary CTA Button */}
        <div className="pt-4 border-t border-slate-100">
          {isProcessing ? (
            <div className="p-8 rounded-3xl bg-slate-950 text-white text-center space-y-6 shadow-2xl animate-pulse">
              <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="space-y-2">
                <span className="bg-amber-500 text-slate-950 px-3 py-1 rounded-full font-black text-xs uppercase tracking-widest">
                  Live Execution Active
                </span>
                <h3 className="font-serif-premium text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {processingStep}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Please do not refresh your browser or close this window while our secure banking servers handshake with your gateway.
                </p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onPayNow}
              disabled={!canProceed}
              className={`w-full py-6 rounded-3xl font-black text-lg transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer ${
                canProceed
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-2xl shadow-amber-500/30 transform hover:-translate-y-1'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span>Authorize Payment of {formatINR(totalPayable)}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Under button security trustmark */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 pt-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure 256-Bit SSL Checkout
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" /> Instant VIP Tour Pass Issuance
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" /> Verified Premium Travel Merchant
          </span>
        </div>
      </div>
    </section>
  );
};
