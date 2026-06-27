import React from 'react';
import { Clock, ShieldCheck } from 'lucide-react';

interface BookingSafeGuaranteesProps {
  openPolicy: (title: string, content: string) => void;
}

export const BookingSafeGuarantees: React.FC<BookingSafeGuaranteesProps> = ({ openPolicy }) => {
  return (
    <div className="space-y-3 pt-4 border-t border-slate-200/80 text-left">
      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">BEDUINE Safe Travel Guarantees</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => openPolicy('Flexible Reschedule Guarantee', 'Need to shift dates? Reschedule your tour departure window without penalty up to 24 hours prior. Rescheduling vouchers remain valid for up to 24 months.')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-350 shadow-sm flex items-start space-x-3.5 cursor-pointer transition-all"
        >
          <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-xs text-slate-900 block">Reschedule Guarantee</span>
            <span className="text-[10px] text-slate-500 block leading-tight mt-1">Change travel date up to 24h prior.</span>
          </div>
        </div>

        <div
          onClick={() => openPolicy('256-Bit SSL Checkout Security', 'All financial parameters and credit details are routed via verified PCI-DSS compliant secure socket channels. We do not store full CVV/card values on our servers.')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-350 shadow-sm flex items-start space-x-3.5 cursor-pointer transition-all"
        >
          <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-xs text-slate-900 block">Secure Checkout</span>
            <span className="text-[10px] text-slate-500 block leading-tight mt-1">256-bit secure gateway connection.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
