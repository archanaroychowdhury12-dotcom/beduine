import React from 'react';
import { X, Award, Check, Sparkles, AlertCircle } from 'lucide-react';

interface VoucherPack {
  id: string;
  name: string;
  discount: number;
  minSpend: number;
  validity: string;
  eligibility: string;
  conditions: string;
  icon: string;
}

export const VOUCHER_PACKS: VoucherPack[] = [
  {
    id: 'Standard',
    name: 'Standard Saver',
    discount: 1000,
    minSpend: 10000,
    validity: '90 Days',
    eligibility: 'All travelers',
    conditions: 'Valid on domestic tours.',
    icon: 'Standard',
  },
  {
    id: 'Family Saver',
    name: 'Family Saver',
    discount: 2500,
    minSpend: 20000,
    validity: '180 Days',
    eligibility: 'Min 2 travelers',
    conditions: 'Ideal for families & small groups.',
    icon: 'Family',
  },
  {
    id: 'Premium',
    name: 'Premium Club',
    discount: 5000,
    minSpend: 35000,
    validity: '180 Days',
    eligibility: 'All members',
    conditions: 'Includes 1 free airport transfer.',
    icon: 'Premium',
  },
  {
    id: 'Elite',
    name: 'Elite Executive',
    discount: 10000,
    minSpend: 60000,
    validity: '365 Days',
    eligibility: 'Elite membership required',
    conditions: 'Priority support & complimentary insurance.',
    icon: 'Elite',
  }
];

interface VoucherPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  onSelectPack: (packId: string) => void;
  selectedPackId?: string;
}

export const VoucherPackModal: React.FC<VoucherPackModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  onSelectPack,
  selectedPackId,
}) => {
  if (!isOpen) return null;

  // Calculate best pack based on subtotal
  const eligiblePacks = VOUCHER_PACKS.filter(pack => subtotal >= pack.minSpend);
  let bestPackId = '';
  if (eligiblePacks.length > 0) {
    const sorted = [...eligiblePacks].sort((a, b) => b.discount - a.discount);
    bestPackId = sorted[0].id;
  }

  const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-[24px] max-w-4xl w-full border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn text-left text-slate-800">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-lg font-black text-slate-900">Compare Voucher Packs</h3>
              <p className="text-xs text-slate-500">Pick the best package for your booking subtotal ({formatINR(subtotal)})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-250 text-slate-450 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          {bestPackId && (
            <div className="bg-emerald-50 border border-emerald-250/50 p-4 rounded-2xl flex items-start space-x-3 text-emerald-900">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block">System Recommendation</span>
                <span className="text-xs block mt-0.5">
                  Based on your subtotal of {formatINR(subtotal)}, the <span className="font-extrabold text-emerald-700">{bestPackId}</span> is the best option and will save you the most money!
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {VOUCHER_PACKS.map((pack) => {
              const isEligible = subtotal >= pack.minSpend;
              const isSelected = selectedPackId === pack.id;
              const isRecommended = bestPackId === pack.id;

              return (
                <div
                  key={pack.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 relative ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/20 shadow-md ring-2 ring-amber-500/20'
                      : isEligible
                      ? 'border-slate-200 bg-white hover:border-slate-350 hover:shadow-sm'
                      : 'border-slate-100 bg-slate-50/50 opacity-60'
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-emerald-500 text-white text-[9px] font-extrabold uppercase rounded-full tracking-wider shadow">
                      Best Value
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">{pack.name}</span>
                      <span className="text-2xl font-black text-slate-900 font-serif-premium mt-1 block">
                        {formatINR(pack.discount)} <span className="text-xs font-bold text-slate-500">OFF</span>
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block">Min. Booking</span>
                        <span className="font-bold">{formatINR(pack.minSpend)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Validity</span>
                        <span className="font-bold text-slate-700">{pack.validity}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Eligibility</span>
                        <span className="font-semibold text-slate-650">{pack.eligibility}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 italic">
                        {pack.conditions}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100">
                    {isEligible ? (
                      <button
                        onClick={() => {
                          onSelectPack(pack.id);
                          onClose();
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-amber-400 border border-slate-900 shadow'
                            : 'bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <span>Select Pack</span>
                        )}
                      </button>
                    ) : (
                      <div className="text-center py-2 text-[10px] text-rose-500 font-bold bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Spend {formatINR(pack.minSpend - subtotal)} more</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
