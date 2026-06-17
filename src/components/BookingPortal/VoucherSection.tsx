import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Sparkles, Tag, XCircle } from 'lucide-react';
import { Voucher } from '../../types';
import { AVAILABLE_VOUCHERS } from '../../data/tours';

interface VoucherSectionProps {
  appliedVoucher?: Voucher;
  setAppliedVoucher: (voucher?: Voucher) => void;
  subtotal: number;
}

const formatINR = (value: number) => `INR ${value.toLocaleString('en-IN')}`;

export const VoucherSection: React.FC<VoucherSectionProps> = ({ appliedVoucher, setAppliedVoucher, subtotal }) => {
  const [inputCode, setInputCode] = useState(appliedVoucher ? appliedVoucher.code : '');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'warning';
    text: string;
  } | null>(appliedVoucher ? {
    type: 'success',
    text: 'Voucher applied successfully. Discount activated.',
  } : null);

  const applyVoucherCode = (code: string) => {
    const normalizedCode = code.trim().toUpperCase();
    const found = AVAILABLE_VOUCHERS.find((voucher) => voucher.code.toUpperCase() === normalizedCode);

    if (!normalizedCode) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid promotional voucher code.' });
      return;
    }

    if (!found) {
      setStatusMessage({ type: 'error', text: `Voucher "${code.trim()}" is invalid or does not exist.` });
      setAppliedVoucher(undefined);
      return;
    }

    if (found.status === 'expired') {
      setStatusMessage({ type: 'warning', text: `Voucher "${found.code}" has expired and is no longer valid.` });
      setAppliedVoucher(undefined);
      return;
    }

    if (found.status === 'used') {
      setStatusMessage({ type: 'error', text: `Voucher "${found.code}" has already been redeemed on another booking.` });
      setAppliedVoucher(undefined);
      return;
    }

    if (found.minSpend && subtotal < found.minSpend) {
      setStatusMessage({ type: 'warning', text: `Voucher "${found.code}" requires a minimum base spend of ${formatINR(found.minSpend)}.` });
      setAppliedVoucher(undefined);
      return;
    }

    setAppliedVoucher(found);
    setStatusMessage({
      type: 'success',
      text: `"${found.code}" applied successfully (${found.type === 'percentage' ? `${found.value}% off` : `${formatINR(found.value)} off`}).`,
    });
  };

  const handleApplyVoucher = (event?: React.FormEvent) => {
    event?.preventDefault();
    applyVoucherCode(inputCode);
  };

  const handleRemoveVoucher = () => {
    setInputCode('');
    setAppliedVoucher(undefined);
    setStatusMessage(null);
  };

  const testQuickCode = (code: string) => {
    setInputCode(code);
    setTimeout(() => applyVoucherCode(code), 50);
  };

  return (
    <section id="step-6" className="py-16 scroll-mt-24 border-t border-slate-200/80 text-left">
      <div className="space-y-4 mb-10">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-600">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">6</span>
          <span>Discounts & Promotional Vouchers</span>
        </div>
        <h2 className="font-serif-premium text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Redeem BEDUINE Voucher Codes
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl">
          Apply your member discount credit or promo code below. The live price summary updates instantly.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <form onSubmit={handleApplyVoucher} className="flex flex-col sm:flex-row gap-4 max-w-xl">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Enter voucher code (e.g. BEDUINE500)"
              value={inputCode}
              onChange={(event) => setInputCode(event.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 text-base uppercase tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {appliedVoucher ? (
            <button
              type="button"
              onClick={handleRemoveVoucher}
              className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-rose-600 text-white font-extrabold text-sm transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Remove Coupon</span>
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-slate-950 font-black text-base transition-opacity flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply Code</span>
            </button>
          )}
        </form>

        {statusMessage && (
          <div
            className={`p-5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center space-x-3 transition-all animate-fadeIn ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
                : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {statusMessage.type === 'success' && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />}
            {statusMessage.type === 'error' && <XCircle className="w-6 h-6 text-rose-600 shrink-0" />}
            {statusMessage.type === 'warning' && <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />}
            <span className="flex-grow">{statusMessage.text}</span>
          </div>
        )}

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
          <span className="block text-xs font-black uppercase tracking-wider text-slate-500">
            Quick-test BEDUINE demo vouchers:
          </span>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {[
              { code: 'BEDUINE500', label: 'BEDUINE500 (INR 500 off)', tone: 'amber' },
              { code: 'SAVE1500', label: 'SAVE1500 (INR 1,500 off)', tone: 'slate' },
              { code: 'VIPTOUR', label: 'VIPTOUR (10% off)', tone: 'slate' },
              { code: 'SUMMER24', label: 'SUMMER24 (Expired)', tone: 'rose' },
              { code: 'WELCOME10', label: 'WELCOME10 (Used)', tone: 'rose' },
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => testQuickCode(item.code)}
                className={`px-3.5 py-2 rounded-xl transition-colors border flex items-center space-x-1 cursor-pointer ${
                  item.tone === 'amber'
                    ? 'bg-amber-500/20 text-amber-900 hover:bg-amber-500 hover:text-slate-950 border-amber-300'
                    : item.tone === 'rose'
                      ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-300'
                      : 'bg-slate-200 text-slate-800 hover:bg-slate-300 border-slate-300'
                }`}
              >
                <span>{item.label}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
