import React from 'react';
import { Sparkles, Calendar, ArrowDown } from 'lucide-react';

interface PageIntroProps {
  onStartBooking: () => void;
}

export const PageIntro: React.FC<PageIntroProps> = ({ onStartBooking }) => {
  return (
    <section id="step-1" className="relative bg-slate-950 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl shadow-2xl">
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-extrabold tracking-wide uppercase">
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Step 1 of 11 | BEDUINE Paid Tour Booking Portal</span>
        </div>

        <h1 className="font-serif-premium text-4xl sm:text-6xl font-black tracking-tight text-white">
          Book <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">Paid Tour</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Choose a paid tour package, add travelers, set pickup details, apply BEDUINE vouchers, and generate a booking confirmation preview.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            onClick={onStartBooking}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-2xl shadow-amber-500/30 flex items-center space-x-3 group cursor-pointer"
          >
            <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>Start Booking Process</span>
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Informative live step ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10 text-xs font-semibold text-slate-400 border-t border-slate-800/80">
          <div className="flex items-center justify-center space-x-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>100% Secure Flow</span>
          </div>
          <div>Live Voucher Verification</div>
          <div>Instant Confirmation</div>
          <div>24/7 Support Active</div>
        </div>
      </div>
    </section>
  );
};
