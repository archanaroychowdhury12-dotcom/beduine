import React from 'react';
import { Crown, Check, X } from 'lucide-react';

interface DiscountCreditsSelectorProps {
  currentUser: any;
  availableDomesticCredits: number;
  availableInternationalCredits: number;
  creditSelection: 'domestic' | 'international' | null;
  handleSelectCreditCategory: (category: 'domestic' | 'international') => void;
  creditError: string | null;
  creditSuccess: string | null;
  appliedDiscountCredits: number;
  handleUpdateAppliedCredits: (value: number) => void;
  travelerCount: number;
}

export const DiscountCreditsSelector: React.FC<DiscountCreditsSelectorProps> = ({
  currentUser,
  availableDomesticCredits,
  availableInternationalCredits,
  creditSelection,
  handleSelectCreditCategory,
  creditError,
  creditSuccess,
  appliedDiscountCredits,
  handleUpdateAppliedCredits,
  travelerCount
}) => {
  return (
    <div className="pt-6 border-t border-slate-100 text-left">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Crown className="w-4 h-4 text-amber-500" />
          <span>Beduine Member Discount Credits</span>
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">Apply your subscription discount credits for additional tour savings.</p>
      </div>

      {!currentUser ? (
        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 text-slate-500 text-xs font-semibold">
          Please sign in to apply your member discount credits.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Credit Type Selector Tabs */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSelectCreditCategory('domestic')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                creditSelection === 'domestic'
                  ? 'border-amber-500 bg-amber-50/10 font-bold shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">Domestic Credits</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">₹500 each</span>
              </div>
              <span className="text-xs font-bold text-slate-500 mt-1 block">
                Available: {availableDomesticCredits}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectCreditCategory('international')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                creditSelection === 'international'
                  ? 'border-amber-500 bg-amber-50/10 font-bold shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">International Credits</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">₹5,000 each</span>
              </div>
              <span className="text-xs font-bold text-slate-500 mt-1 block">
                Available: {availableInternationalCredits}
              </span>
            </button>
          </div>

          {/* Error / Warning Alert */}
          {creditError && (
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-bold flex items-center gap-2">
              <X className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{creditError}</span>
            </div>
          )}

          {/* Success Alert */}
          {creditSuccess && (
            <div className="p-3.5 rounded-xl border border-emerald-250 bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>{creditSuccess}</span>
            </div>
          )}

          {/* Credit Amount Input Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Number of Credits to Redeem</label>
              <span className="text-sm font-black text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-sm">
                {appliedDiscountCredits} Credit(s)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.min(travelerCount, creditSelection === 'domestic' ? availableDomesticCredits : availableInternationalCredits)}
              value={appliedDiscountCredits}
              onChange={(e) => handleUpdateAppliedCredits(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-650"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
              <span>0</span>
              <span>Max: {Math.min(travelerCount, creditSelection === 'domestic' ? availableDomesticCredits : availableInternationalCredits)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
