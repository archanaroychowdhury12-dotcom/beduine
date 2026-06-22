import React, { useState } from 'react';
import { Tag, Sparkles, AlertCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Voucher } from '../../types';
import { AVAILABLE_VOUCHERS } from '../../data/tours';
import { VoucherPackModal, VOUCHER_PACKS } from './VoucherPackModal';

interface VoucherSectionProps {
  appliedVoucher?: Voucher;
  setAppliedVoucher: (voucher?: Voucher) => void;
  subtotal: number;
}

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export const VoucherSection: React.FC<VoucherSectionProps> = ({
  appliedVoucher,
  setAppliedVoucher,
  subtotal,
}) => {
  const [activeTab, setActiveTab] = useState<'input' | 'pack'>(appliedVoucher && appliedVoucher.code.startsWith('PACK-') ? 'pack' : 'input');
  const [inputCode, setInputCode] = useState(appliedVoucher && !appliedVoucher.code.startsWith('PACK-') ? appliedVoucher.code : '');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'warning';
    text: string;
  } | null>(appliedVoucher && !appliedVoucher.code.startsWith('PACK-') ? {
    type: 'success',
    text: 'Promo code applied successfully!',
  } : null);

  // Auto recommend best voucher pack for subtotal
  const eligiblePacks = VOUCHER_PACKS.filter(pack => subtotal >= pack.minSpend);
  let bestPackId = '';
  if (eligiblePacks.length > 0) {
    const sorted = [...eligiblePacks].sort((a, b) => b.discount - a.discount);
    bestPackId = sorted[0].id;
  }

  const applyVoucherCode = (code: string) => {
    const normalizedCode = code.trim().toUpperCase();
    const found = AVAILABLE_VOUCHERS.find((voucher) => voucher.code.toUpperCase() === normalizedCode);

    if (!normalizedCode) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid promotional voucher code.' });
      return;
    }

    if (!found) {
      setStatusMessage({ type: 'error', text: `Voucher code "${code.trim()}" is invalid.` });
      setAppliedVoucher(undefined);
      return;
    }

    if (found.status === 'expired') {
      setStatusMessage({ type: 'warning', text: `Voucher code "${found.code}" has expired.` });
      setAppliedVoucher(undefined);
      return;
    }

    if (found.status === 'used') {
      setStatusMessage({ type: 'error', text: `Voucher code "${found.code}" has already been redeemed.` });
      setAppliedVoucher(undefined);
      return;
    }

    if (found.minSpend && subtotal < found.minSpend) {
      setStatusMessage({ type: 'warning', text: `Voucher "${found.code}" requires a minimum spend of ${formatINR(found.minSpend)}.` });
      setAppliedVoucher(undefined);
      return;
    }

    setAppliedVoucher(found);
    setStatusMessage({
      type: 'success',
      text: `Code applied successfully! Saved ${found.type === 'percentage' ? `${found.value}%` : formatINR(found.value)}.`,
    });
  };

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    applyVoucherCode(inputCode);
  };

  const handleRemoveVoucher = () => {
    setInputCode('');
    setAppliedVoucher(undefined);
    setStatusMessage(null);
  };

  const handleSelectPack = (packId: string) => {
    const pack = VOUCHER_PACKS.find(p => p.id === packId);
    if (!pack) return;

    if (subtotal < pack.minSpend) {
      alert(`This pack requires a minimum booking spend of ${formatINR(pack.minSpend)}.`);
      return;
    }

    // Set pack as the applied voucher
    const voucherFromPack: Voucher = {
      code: `PACK-${pack.id.toUpperCase().replace(/\s+/g, '-')}`,
      type: 'fixed',
      value: pack.discount,
      minSpend: pack.minSpend,
      status: 'active',
      description: `${pack.name} applied (Voucher Pack)`,
    };

    setAppliedVoucher(voucherFromPack);
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-0.5">Step 2 — Voucher & Package Selection</span>
        <h3 className="text-xl font-bold text-slate-900">Apply Vouchers or Packages</h3>
        <p className="text-xs text-slate-500 mt-1">Unlock exclusive member savings instantly on your booking.</p>
      </div>

      {/* Choice Selector Tabs */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => {
            setActiveTab('input');
            handleRemoveVoucher();
          }}
          className={`flex-1 p-4 rounded-xl border text-center transition-all cursor-pointer ${
            activeTab === 'input'
              ? 'border-amber-500 bg-amber-50/10 font-bold shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-350'
          }`}
        >
          <span className="text-xs text-slate-400 block mb-0.5">Option A</span>
          <span className="text-sm font-bold text-slate-900">I have a voucher code</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('pack');
            handleRemoveVoucher();
            // Auto-select best match
            if (bestPackId) {
              handleSelectPack(bestPackId);
            }
          }}
          className={`flex-1 p-4 rounded-xl border text-center transition-all cursor-pointer ${
            activeTab === 'pack'
              ? 'border-amber-500 bg-amber-50/10 font-bold shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-350'
          }`}
        >
          <span className="text-xs text-slate-400 block mb-0.5">Option B</span>
          <span className="text-sm font-bold text-slate-900">Choose a voucher pack</span>
        </button>
      </div>

      {/* Choice A: Voucher Code Input */}
      {activeTab === 'input' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm animate-fadeIn">
          <form onSubmit={handleApplyCode} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Enter promo code (e.g. SAVE1500)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold uppercase tracking-wider focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            
            {appliedVoucher && !appliedVoucher.code.startsWith('PACK-') ? (
              <button
                type="button"
                onClick={handleRemoveVoucher}
                className="px-6 py-3 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
              >
                Remove Coupon
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-505 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Apply Coupon
              </button>
            )}
          </form>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-amber-50 border-amber-250/60 text-amber-900'
              }`}
            >
              {statusMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              {statusMessage.type === 'error' && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              {statusMessage.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Quick suggestions */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block mb-2">Available Coupons</span>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { code: 'BEDUINE500', desc: '₹500 Off' },
                { code: 'SAVE1500', desc: '₹1,500 Off (min ₹15k)' },
                { code: 'VIPTOUR', desc: '10% Off' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.code}
                  onClick={() => {
                    setInputCode(item.code);
                    applyVoucherCode(item.code);
                  }}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200/60 rounded-lg transition-colors cursor-pointer font-bold"
                >
                  {item.code} ({item.desc})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Choice B: Voucher Packs Grid */}
      {activeTab === 'pack' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {VOUCHER_PACKS.map((pack) => {
              const isEligible = subtotal >= pack.minSpend;
              const isSelected = appliedVoucher?.code === `PACK-${pack.id.toUpperCase().replace(/\s+/g, '-')}`;
              const isRecommended = bestPackId === pack.id;

              return (
                <div
                  key={pack.id}
                  onClick={() => isEligible && handleSelectPack(pack.id)}
                  className={`p-4 rounded-xl border flex flex-col justify-between h-36 transition-all relative ${
                    isEligible ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  } ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/15 shadow-sm ring-2 ring-amber-500/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute -top-2 left-3 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-wider rounded">
                      Best Match
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase">{pack.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                    </div>
                    <span className="text-xl font-serif-premium font-black text-slate-900 mt-1 block">
                      {formatINR(pack.discount)} OFF
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Min. Spend: {formatINR(pack.minSpend)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-450">Valid: {pack.validity}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCompareModalOpen(true);
                      }}
                      className="text-amber-600 hover:text-amber-700 underline font-bold"
                    >
                      Pack Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action triggers */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <span className="text-xs text-slate-500 font-semibold">Want to see all terms?</span>
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Compare all packs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Applied voucher status badge */}
      {appliedVoucher && (
        <div className="bg-emerald-50 border border-emerald-250/60 p-4 rounded-xl flex items-center justify-between text-emerald-950 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-black block uppercase text-emerald-700">Voucher applied</span>
              <span className="text-sm font-bold">{appliedVoucher.code} saves you {appliedVoucher.type === 'percentage' ? `${appliedVoucher.value}%` : formatINR(appliedVoucher.value)}!</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveVoucher}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}

      {/* Comparison Modal */}
      <VoucherPackModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        subtotal={subtotal}
        onSelectPack={handleSelectPack}
        selectedPackId={appliedVoucher?.code.replace('PACK-', '')}
      />
    </div>
  );
};
