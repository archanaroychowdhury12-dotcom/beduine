import React from 'react';
import { PhoneCall, ShieldCheck, Save, Bookmark } from 'lucide-react';
import { BEDUINE_BRAND } from '../../data/paidTourContent';

interface BookingPortalHeaderProps {
  onReturnHome: () => void;
  onSaveLater: () => void;
  onMyBookings?: () => void;
}

export const BookingPortalHeader: React.FC<BookingPortalHeaderProps> = ({
  onReturnHome,
  onSaveLater,
  onMyBookings,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8 text-left shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand Logo and Minimal Nav */}
        <div className="flex items-center justify-between md:justify-start gap-6">
          <button
            onClick={onReturnHome}
            className="flex items-center space-x-3 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white bg-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <img src="/images/bedune_logo_cropped.png" alt="BEDUINE Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-serif text-xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                {BEDUINE_BRAND.name} <span className="text-amber-500">Tours</span>
              </span>
              <span className="block text-[9px] font-bold tracking-widest uppercase text-slate-500">
                {BEDUINE_BRAND.tagline}
              </span>
            </div>
          </button>

          {/* Minimal Navigation */}
          <nav className="hidden sm:flex items-center space-x-4 border-l border-slate-200 pl-6 text-xs font-bold text-slate-500">
            <button onClick={onReturnHome} className="hover:text-amber-600 transition-colors cursor-pointer">Home</button>
            <span>•</span>
            <span className="text-slate-400">Secure Booking Wizard</span>
          </nav>
        </div>

        {/* Action Widgets */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:justify-end text-xs font-semibold text-slate-600">
          {/* Secure Booking Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 shadow-sm shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Secure Booking</span>
          </div>

          {/* Help Line */}
          <a
            href={BEDUINE_BRAND.phoneHref}
            className="flex items-center gap-1.5 hover:text-amber-650 transition-colors shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
            <span>Support: {BEDUINE_BRAND.phoneDisplay}</span>
          </a>

          {/* My Bookings */}
          <button
            onClick={onMyBookings || onReturnHome}
            className="flex items-center gap-1.5 px-3.5 py-1.5 hover:bg-slate-100 rounded-lg transition-colors border border-slate-250/70 text-slate-700 cursor-pointer shrink-0"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-450" />
            <span>My Bookings</span>
          </button>

          {/* Save Later */}
          <button
            onClick={onSaveLater}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-905 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Save & Continue</span>
          </button>
        </div>

      </div>
    </header>
  );
};
