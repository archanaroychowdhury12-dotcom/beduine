import React from 'react';
import { TourPackage } from '../../types';
import { TOUR_PACKAGES } from '../../data/tours';
import { MapPin, Calendar, Clock, Star, CheckCircle2, ChevronRight } from 'lucide-react';

interface TourSelectionProps {
  selectedTourId: string | null;
  onSelectTour: (tour: TourPackage) => void;
}

const formatINR = (value: number) => `INR ${value.toLocaleString('en-IN')}`;

export const TourSelection: React.FC<TourSelectionProps> = ({ selectedTourId, onSelectTour }) => {
  return (
    <section id="step-2" className="py-16 scroll-mt-24">
      <div className="space-y-4 mb-10">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-600">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">2</span>
          <span>Tour Selection</span>
        </div>
        <h2 className="font-serif-premium text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Select Your Paid Guided Tour Package
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl">
          Compare our multi-day premium guided expeditions below. Choose the package that best fits your travel aspirations.
        </p>
      </div>

      <div className="space-y-8">
        {TOUR_PACKAGES.map((tour) => {
          const isSelected = selectedTourId === tour.id;

          return (
            <div
              key={tour.id}
              onClick={() => onSelectTour(tour)}
              className={`rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer border-2 text-left relative ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/20 shadow-2xl ring-4 ring-amber-500/10 scale-[1.01]'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xl'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 z-20 bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 font-black text-xs px-6 py-1.5 rounded-bl-2xl shadow-lg flex items-center space-x-1.5 animate-pulse-soft">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Currently Selected Package</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left image banner */}
                <div className="lg:col-span-5 relative min-h-[260px] bg-slate-900 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isSelected ? 'scale-105' : 'group-hover:scale-105'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full shadow">
                      Paid Guided Tour
                    </span>
                    <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white font-bold text-[11px] rounded-full">
                      {tour.difficultyLevel} Pace
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{tour.destination}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span className="font-bold text-white">{tour.rating} Star Rating</span>
                      <span>({tour.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Right detailed info */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{tour.durationDays} Days / {tour.durationNights} Nights</span>
                      </div>
                      <span className="font-semibold text-slate-600">
                        Guide: {tour.guideExpertise.split('&')[0]}
                      </span>
                    </div>

                    <h3 className="font-serif-premium text-2xl font-extrabold text-slate-900 leading-tight">
                      {tour.name}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {tour.shortSummary}
                    </p>

                    {/* Available dates preview pills */}
                    <div className="pt-2">
                      <div className="flex items-center space-x-1.5 text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>Available Departure Dates:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tour.availableDates.slice(0, 5).map((date, idx) => (
                          <span key={idx} className="bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-900 font-mono text-xs px-2.5 py-1 rounded-lg border border-slate-200 transition-colors">
                            {new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        ))}
                        {tour.availableDates.length > 5 && (
                          <span className="bg-slate-100 text-slate-500 font-bold text-xs px-2.5 py-1 rounded-lg">
                            +{tour.availableDates.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] uppercase font-extrabold tracking-widest text-slate-400">All-Inclusive Starting Price</span>
                      <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black text-slate-900 font-serif-premium">{formatINR(tour.basePrice)}</span>
                        <span className="text-xs font-bold text-slate-500">/ traveler</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-6 py-3 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center space-x-2 shadow-md ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/30'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>{isSelected ? 'Package Selected' : 'Select This Tour'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
