import React from 'react';
import { CustomTourRequest } from '../../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface CustomTourSuccessProps {
  request: CustomTourRequest;
  onReset: () => void;
  onGoToDashboard?: () => void;
  isLoggedIn?: boolean;
}

export const CustomTourSuccess: React.FC<CustomTourSuccessProps> = ({
  request,
  onReset,
  onGoToDashboard,
  isLoggedIn = false
}) => {
  const formatPrice = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="max-w-xl mx-auto bg-white border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.04)] rounded-[32px] p-6 sm:p-8 text-center space-y-6">
      
      {/* Success Badge */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide">Request Submitted!</h2>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
          Your custom tour request has been received. Our travel curating desk will review it shortly.
        </p>
      </div>

      {/* Request Reference Ticket */}
      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 text-left space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Request Code</span>
            <span className="font-mono text-sm font-black text-slate-850">{request.displayCode}</span>
          </div>
          <span className="bg-amber-100 text-amber-800 text-[8px] font-black border border-amber-200 px-2 py-0.5 rounded-full uppercase">
            {request.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[9px] text-slate-450 uppercase block">Destination</span>
            <span className="font-bold text-slate-700">{request.destination}</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-450 uppercase block">Departure From</span>
            <span className="font-bold text-slate-700">{request.departureCity}</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-450 uppercase block">Travel Length</span>
            <span className="font-bold text-slate-700">{request.durationNights} Nights</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-450 uppercase block">Est. Cost Range</span>
            <span className="font-bold text-slate-700 font-mono">
              {formatPrice(request.estimatedPriceRange.min)} - {formatPrice(request.estimatedPriceRange.max)}
            </span>
          </div>
        </div>

        {isLoggedIn && (
          <p className="text-[9.5px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl leading-relaxed">
            💡 This request has been linked to your account. You can track progress, receive quotations, request revisions, and complete secure checkout under the <strong>Custom Tour Requests</strong> tab in your dashboard.
          </p>
        )}
      </div>

      {/* Timeline flow */}
      <div className="text-left space-y-3 pt-2">
        <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block text-center">Next Steps</span>
        
        <div className="relative pl-6 space-y-4">
          <div className="absolute left-2 top-1.5 bottom-1.5 w-[2px] bg-slate-200" />
          
          <div className="relative">
            <div className="absolute -left-5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            <span className="text-xs font-black text-slate-700 block">1. Agent Evaluation</span>
            <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">
              We check hotel vacancies, transport packages, and local permits for your destination.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-5 w-2 h-2 rounded-full bg-slate-350" />
            <span className="text-xs font-bold text-slate-500 block">2. Quotation Release</span>
            <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">
              We build a curated itinerary and quote. You approve or suggest revisions.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-5 w-2 h-2 rounded-full bg-slate-350" />
            <span className="text-xs font-bold text-slate-500 block">3. Confirm &amp; Finalize</span>
            <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">
              You complete payment and download the voucher with QR code verification.
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="pt-4 flex flex-col gap-2">
        {isLoggedIn && onGoToDashboard ? (
          <button
            type="button"
            onClick={onGoToDashboard}
            className="w-full py-3 bg-slate-900 hover:bg-slate-950 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            Track in My Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onReset}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
          >
            Create Another Request
          </button>
        )}
      </div>
    </div>
  );
};
