import React from 'react';
import { ShieldCheck, RefreshCw, Clock, AlertTriangle, CheckSquare, Square } from 'lucide-react';

interface BookingPolicySectionProps {
  agreedToTerms: boolean;
  setAgreedToTerms: (agreed: boolean) => void;
  agreedToPassport: boolean;
  setAgreedToPassport: (agreed: boolean) => void;
}

export const BookingPolicySection: React.FC<BookingPolicySectionProps> = ({
  agreedToTerms,
  setAgreedToTerms,
  agreedToPassport,
  setAgreedToPassport
}) => {
  return (
    <section id="step-8" className="py-16 scroll-mt-24 border-t border-slate-200/80 text-left">
      <div className="space-y-4 mb-10">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-600">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">8</span>
          <span>Peace of Mind Guarantee</span>
        </div>
        <h2 className="font-serif-premium text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Flexible Booking & Cancellation Policy
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl">
          We want you to book with ultimate confidence. Our transparent policies protect your financial investment and give you absolute freedom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* 1. Cancellation Policy */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-premium text-xl font-bold text-slate-900">100% Cancellation Refund</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              You can cancel this paid guided tour for any reason up to <span className="font-extrabold text-slate-900">48 hours</span> before your departure date. We will issue an immediate 100% full refund with zero cancellation penalties.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 inline-block self-start">
            Guaranteed Cash Refund
          </span>
        </div>

        {/* 2. Reschedule Policy */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-serif-premium text-xl font-bold text-slate-900">Instant Free Rescheduling</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              If unexpected personal events arise, you can reschedule your tour departure dates completely free of charge up to <span className="font-extrabold text-slate-900">24 hours</span> prior to the start of the tour.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200/80 inline-block self-start">
            Valid for 24 Months
          </span>
        </div>

        {/* 3. Refund Process Policy */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif-premium text-xl font-bold text-slate-900">Rapid Refund Processing</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              All approved refunds are returned directly to your original payment method (Credit Card, PayPal, or Apple Pay) within 3 to 5 business days without store credit gimmicks.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80 inline-block self-start">
            Zero Hidden Fees
          </span>
        </div>
      </div>

      {/* Mandatory Terms Acceptance Checkboxes */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 text-amber-400">
          <AlertTriangle className="w-6 h-6" />
          <h4 className="font-serif-premium text-xl font-bold text-white">Important Terms Verification Before Payment</h4>
        </div>
        <p className="text-slate-400 text-xs sm:text-sm">Please acknowledge our standard international traveler conditions to activate secure checkout.</p>

        <div className="space-y-4 pt-2">
          {/* Checkbox 1 */}
          <button
            type="button"
            onClick={() => setAgreedToPassport(!agreedToPassport)}
            className="flex items-start space-x-4 text-left group focus:outline-none cursor-pointer w-full p-2 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            <div className="mt-0.5 text-amber-400 shrink-0">
              {agreedToPassport ? <CheckSquare className="w-6 h-6 text-amber-400" /> : <Square className="w-6 h-6 text-slate-500 group-hover:text-amber-400 transition-colors" />}
            </div>
            <div className="text-sm">
              <span className="font-bold text-white block">Valid International Passport Requirement</span>
              <span className="text-slate-400 text-xs block mt-0.5">I verify that all listed travelers have international passports valid for at least 6 months beyond the chosen tour return date.</span>
            </div>
          </button>

          {/* Checkbox 2 */}
          <button
            type="button"
            onClick={() => setAgreedToTerms(!agreedToTerms)}
            className="flex items-start space-x-4 text-left group focus:outline-none cursor-pointer w-full p-2 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            <div className="mt-0.5 text-amber-400 shrink-0">
              {agreedToTerms ? <CheckSquare className="w-6 h-6 text-amber-400" /> : <Square className="w-6 h-6 text-slate-500 group-hover:text-amber-400 transition-colors" />}
            </div>
            <div className="text-sm">
              <span className="font-bold text-white block">Booking Terms & Peace of Mind Agreement</span>
              <span className="text-slate-400 text-xs block mt-0.5">I have reviewed and agree to the 100% full refund policy, private chauffeur luggage guidelines, and standard tour inclusion specifications.</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
