import React from 'react';
import { Check } from 'lucide-react';

interface BookingStepperProps {
  bookingStep: number;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({ bookingStep }) => {
  return (
    <div className="bg-white border border-slate-200/80 p-4 rounded-2xl mb-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500 text-left">
      {[
        { step: 1, label: 'Select Tour' },
        { step: 2, label: 'Vouchers & Packs' },
        { step: 3, label: 'Traveler Details' },
        { step: 4, label: 'Pickup & Extras' },
        { step: 5, label: 'Review & Pay' }
      ].map((item) => {
        const isActive = bookingStep === item.step;
        const isCompleted = bookingStep > item.step;
        return (
          <div key={item.step} className="flex items-center space-x-3 w-full md:w-auto last:pr-0">
            <div className="flex items-center space-x-2.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors shrink-0 ${
                isCompleted
                  ? 'bg-emerald-500 text-white'
                  : isActive
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {isCompleted ? <Check className="w-4.5 h-4.5 font-black" /> : item.step}
              </div>
              <div>
                <span className={`block text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                  {item.label}
                </span>
                <span className="text-[9px] text-slate-500 font-medium block">
                  {isCompleted ? 'Completed' : isActive ? 'Active Step' : 'Pending'}
                </span>
              </div>
            </div>
            {item.step < 5 && (
              <div className="hidden md:block h-[1px] w-12 bg-slate-200" />
            )}
          </div>
        );
      })}
    </div>
  );
};
