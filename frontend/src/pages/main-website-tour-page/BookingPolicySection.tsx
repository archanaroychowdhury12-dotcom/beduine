import React from 'react';
import { ShieldCheck, CreditCard, Clock, AlertTriangle, CheckSquare, Square } from 'lucide-react';

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
          <span>Payment & Cancellation Policy</span>
        </div>
        <h2 className="font-serif-premium text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Transparent Booking Terms
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl">
          Review the payment milestones, cancellation charges, refund timeline, and travel-document responsibilities before checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-serif-premium text-xl font-bold text-slate-900">Scheduled Tour Payments</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Fixed departure group tours follow a <span className="font-extrabold text-slate-900">25% + 25% + 30% + 20%</span> payment schedule before departure.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80 inline-block self-start">
            Advance Required
          </span>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-premium text-xl font-bold text-slate-900">Customized Tour Payments</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tailor-made tours require <span className="font-extrabold text-slate-900">50%</span> advance to confirm, then 25% seven days before departure and 25% before tour start.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200/80 inline-block self-start">
            Tailor-Made Terms
          </span>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif-premium text-xl font-bold text-slate-900">Refund & Credit Timeline</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Approved refunds are processed within <span className="font-extrabold text-slate-900">15–30 working days</span>. Eligible credits can be adjusted within 12 months.
            </p>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/80 inline-block self-start">
            Approval Based
          </span>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 text-amber-400">
          <AlertTriangle className="w-6 h-6" />
          <h4 className="font-serif-premium text-xl font-bold text-white">Important Terms Verification Before Payment</h4>
        </div>
        <p className="text-slate-400 text-xs sm:text-sm">
          Please acknowledge Beduine payment, cancellation, refund, credit adjustment, and traveler-document terms before checkout.
        </p>

        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={() => setAgreedToPassport(!agreedToPassport)}
            className="flex items-start space-x-4 text-left group focus:outline-none cursor-pointer w-full p-2 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            <div className="mt-0.5 text-amber-400 shrink-0">
              {agreedToPassport ? <CheckSquare className="w-6 h-6 text-amber-400" /> : <Square className="w-6 h-6 text-slate-500 group-hover:text-amber-400 transition-colors" />}
            </div>
            <div className="text-sm">
              <span className="font-bold text-white block">Valid Government ID / Passport Requirement</span>
              <span className="text-slate-400 text-xs block mt-0.5">I confirm all travelers will carry valid government-issued photo ID. For international tours, passports and required travel documents must be valid as per destination rules.</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAgreedToTerms(!agreedToTerms)}
            className="flex items-start space-x-4 text-left group focus:outline-none cursor-pointer w-full p-2 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            <div className="mt-0.5 text-amber-400 shrink-0">
              {agreedToTerms ? <CheckSquare className="w-6 h-6 text-amber-400" /> : <Square className="w-6 h-6 text-slate-500 group-hover:text-amber-400 transition-colors" />}
            </div>
            <div className="text-sm">
              <span className="font-bold text-white block">Payment, Cancellation & Credit Adjustment Agreement</span>
              <span className="text-slate-400 text-xs block mt-0.5">I have reviewed and agree to BEDUINE TOUR AND TRAVELS PVT LTD payment schedule, cancellation charges, no-show rule, refund timeline, and 12-month credit adjustment policy.</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
