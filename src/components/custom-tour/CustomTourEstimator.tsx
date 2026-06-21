import React from 'react';
import {
  TripType,
  HotelCategory,
  TransportPreference,
  MealPreference,
  TourActivity
} from '../../types';
import { calculateEstimatedPriceRange, getBudgetMessage } from '../../utils/customTourCalculator';
import { Sparkles, Info } from 'lucide-react';

interface CustomTourEstimatorProps {
  tripType: TripType;
  durationNights: number;
  adults: number;
  children: number;
  rooms: number;
  hotelCategory: HotelCategory;
  transportPreference: TransportPreference;
  mealPreference: MealPreference;
  activities: TourActivity[];
  budget: number;
}

export const CustomTourEstimator: React.FC<CustomTourEstimatorProps> = ({
  tripType,
  durationNights,
  adults,
  children,
  rooms,
  hotelCategory,
  transportPreference,
  mealPreference,
  activities,
  budget
}) => {
  const estimate = calculateEstimatedPriceRange({
    tripType,
    durationNights,
    adults,
    children,
    rooms,
    hotelCategory,
    transportPreference,
    mealPreference,
    activities
  });

  const budgetMsg = getBudgetMessage(budget, estimate);
  const isBudgetLow = budget > 0 && budget < estimate.min;
  const isBudgetOk = budget > 0 && budget >= estimate.min && budget <= estimate.max;

  const formatPrice = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="bg-slate-900 text-white rounded-[24px] p-6 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-5 relative z-10 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Price Estimation
          </span>
          <span className="bg-white/10 text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
            {tripType}
          </span>
        </div>

        <div>
          <span className="text-xs text-slate-400 block font-medium">Estimated Budget Range</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black tracking-tight text-white">
              {formatPrice(estimate.min)}
            </span>
            <span className="text-slate-500 font-bold">-</span>
            <span className="text-3xl font-black tracking-tight text-white">
              {formatPrice(estimate.max)}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-4 space-y-3">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Duration:</span>
            <span className="font-semibold text-slate-200">{durationNights} Nights</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Travelers:</span>
            <span className="font-semibold text-slate-200">
              {adults} {adults === 1 ? 'Adult' : 'Adults'}
              {children > 0 && `, ${children} ${children === 1 ? 'Child' : 'Children'}`}
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Hotel:</span>
            <span className="font-semibold text-slate-200">{hotelCategory}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Transport:</span>
            <span className="font-semibold text-slate-200">{transportPreference}</span>
          </div>
        </div>

        {budget > 0 && (
          <div className="border-t border-slate-800/80 pt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-400">Your Specified Budget:</span>
              <span className="text-sm font-extrabold text-amber-300">{formatPrice(budget)}</span>
            </div>
            <p
              className={`text-[10px] font-bold p-3 rounded-xl border leading-relaxed ${
                isBudgetLow
                  ? 'bg-rose-950/40 text-rose-300 border-rose-900/60'
                  : isBudgetOk
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900/60'
                    : 'bg-cyan-950/40 text-cyan-300 border-cyan-900/60'
              }`}
            >
              {budgetMsg}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/60 flex items-start gap-2.5 text-left">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-[10px] font-extrabold text-slate-300 block uppercase tracking-wide">
            Estimation Notes
          </span>
          <p className="text-[9.5px] text-slate-450 leading-relaxed mt-0.5">
            This range is a seasonal estimate. Real quotation will be calculated by our support desk based on exact hotel availability and dates. No live bookings are finalized yet.
          </p>
        </div>
      </div>
    </div>
  );
};
