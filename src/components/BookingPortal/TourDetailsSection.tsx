import React, { useState } from 'react';
import { TourPackage } from '../../types';
import { Clock, Users, Globe, Award, CheckCircle2, XCircle, MapPin, ChevronDown, ChevronUp, Sparkles, ShieldAlert } from 'lucide-react';

interface TourDetailsSectionProps {
  tour: TourPackage;
  isPrivateTour: boolean;
  setIsPrivateTour: (isPrivate: boolean) => void;
  isInsuranceSelected: boolean;
  setIsInsuranceSelected: (selected: boolean) => void;
  planDetails?: any;
  isInternationalTour: boolean;
}

const formatINR = (value: number) => `INR ${value.toLocaleString('en-IN')}`;

export const TourDetailsSection: React.FC<TourDetailsSectionProps> = ({
  tour,
  isPrivateTour,
  setIsPrivateTour,
  isInsuranceSelected,
  setIsInsuranceSelected,
  planDetails,
  isInternationalTour
}) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'places' | 'inclusions' | 'guide'>('itinerary');
  const [expandedDays, setExpandedDays] = useState<number[]>([1, 2]);

  const toggleDay = (dayNum: number) => {
    if (expandedDays.includes(dayNum)) {
      setExpandedDays(expandedDays.filter(d => d !== dayNum));
    } else {
      setExpandedDays([...expandedDays, dayNum]);
    }
  };

  const expandAll = () => {
    setExpandedDays(tour.itinerary.map(i => i.day));
  };

  return (
    <section id="step-3" className="py-16 scroll-mt-24 border-t border-slate-200/80">
      <div className="space-y-4 mb-10 text-left">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-600">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">3</span>
          <span>Tour Details & Customization</span>
        </div>
        <h2 className="font-serif-premium text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Comprehensive Tour Specification
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl">
          Complete clarity before booking. Review the day-by-day schedule, inclusions, guide support, and private tour upgrade option.
        </p>
      </div>

      {/* Highlights Overview summary bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-left">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start space-x-3.5">
          <Clock className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Duration</span>
            <span className="text-sm font-extrabold text-slate-800">{tour.durationDays} Days / {tour.durationNights} Nights</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start space-x-3.5">
          <Users className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Group Size Option</span>
            <span className="text-sm font-extrabold text-slate-800">{isPrivateTour ? 'Exclusive VIP Private Tour' : `Small Group (${tour.groupSize.min}-${tour.groupSize.max} max)`}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start space-x-3.5">
          <Globe className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Languages Supported</span>
            <span className="text-sm font-extrabold text-slate-800">{tour.languages.join(', ')}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start space-x-3.5">
          <Award className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Certified Guide</span>
            <span className="text-sm font-extrabold text-slate-800 truncate block max-w-[170px]" title={tour.guideExpertise}>{tour.guideExpertise.split('&')[0]}</span>
          </div>
        </div>
      </div>

      {/* Interactive Group vs Private Upgrade Box */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 rounded-3xl mb-12 shadow-xl border border-slate-800 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Users className="w-48 h-48 text-amber-400" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Booking Customizer</span>
          </div>
          <h3 className="font-serif-premium text-2xl sm:text-3xl font-bold tracking-tight">
            Prefer Private Travel Flexibility?
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Keep the shared group plan or upgrade to a private tour for a dedicated vehicle, flexible timing, and a more personalized route.
          </p>
          
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => setIsPrivateTour(false)}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer ${
                !isPrivateTour
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105 ring-2 ring-amber-400'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${!isPrivateTour ? 'text-slate-950' : 'text-slate-500'}`} />
              <span>Premium Small Group (No Surcharge)</span>
            </button>

            <button
              onClick={() => setIsPrivateTour(true)}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer ${
                isPrivateTour
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xl shadow-amber-500/20 scale-105 ring-2 ring-amber-400'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isPrivateTour ? 'text-slate-950 animate-pulse' : 'text-amber-400'}`} />
              <span>Private Tour Upgrade (+{formatINR(tour.groupSize.privateSurchargePerPerson)}/person)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Travel Insurance and Medical Cover Upgrade Box (Only for International Tours) */}
      {isInternationalTour && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-8 rounded-3xl mb-12 shadow-2xl border border-slate-800 text-left relative overflow-hidden group">
          {/* Soft glowing ambient backgrounds */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-[60px] group-hover:bg-emerald-500/15 transition-all duration-700"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-teal-500/10 blur-[60px] group-hover:bg-teal-500/15 transition-all duration-700"></div>

          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-105 transition-transform duration-700">
            <ShieldAlert className="w-48 h-48 text-emerald-400" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse" />
                <span>Travel Protection & Medical Cover</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-serif-premium text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors duration-300">
                Secure Your Expedition Peace of Mind
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                Get emergency medical assistance, trip cancellation coverage, and lost baggage reimbursement. Dynamic rates are automatically calculated based on your subscription tier.
              </p>
            </div>

            {/* Bullet specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 text-xs text-slate-350 font-bold">
              <div className="flex items-center space-x-2.5 bg-white/5 border border-white/5 px-4 py-3 rounded-2xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>₹5 Lakh Emergency Medical</span>
              </div>
              <div className="flex items-center space-x-2.5 bg-white/5 border border-white/5 px-4 py-3 rounded-2xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Trip Interruption Cover</span>
              </div>
              <div className="flex items-center space-x-2.5 bg-white/5 border border-white/5 px-4 py-3 rounded-2xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 SOS Support</span>
              </div>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => setIsInsuranceSelected(false)}
                className={`w-full sm:w-auto px-7 py-4 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer ${
                  !isInsuranceSelected
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-102 hover:scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${!isInsuranceSelected ? 'text-slate-950' : 'text-slate-500'}`} />
                <span>Decline Insurance Cover</span>
              </button>

              <button
                type="button"
                onClick={() => setIsInsuranceSelected(true)}
                className={`w-full sm:w-auto px-7 py-4 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer ${
                  isInsuranceSelected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-xl shadow-emerald-500/20 scale-102 hover:scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-350 border border-slate-700 hover:border-slate-600'
                }`}
              >
                <ShieldAlert className={`w-4 h-4 ${isInsuranceSelected ? 'text-slate-950 animate-pulse' : 'text-emerald-400'}`} />
                <span>
                  {planDetails?.name === 'Platinum' ? (
                    "Platinum VIP Insurance (Included Free!)"
                  ) : planDetails?.name === 'Gold' ? (
                    "Add Insurance (₹199/person - 50% Member Off)"
                  ) : (
                    "Add Insurance (₹399/person)"
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Details Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto text-left">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`py-4 px-6 text-sm font-extrabold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'itinerary'
              ? 'border-b-2 border-amber-500 text-amber-600 bg-amber-50/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Detailed Itinerary ({tour.itinerary.length} Days)</span>
        </button>

        <button
          onClick={() => setActiveTab('places')}
          className={`py-4 px-6 text-sm font-extrabold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'places'
              ? 'border-b-2 border-amber-500 text-amber-600 bg-amber-50/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Places Covered ({tour.placesCovered.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inclusions')}
          className={`py-4 px-6 text-sm font-extrabold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'inclusions'
              ? 'border-b-2 border-amber-500 text-amber-600 bg-amber-50/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Inclusions & Exclusions</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`py-4 px-6 text-sm font-extrabold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center space-x-2 ${
            activeTab === 'guide'
              ? 'border-b-2 border-amber-500 text-amber-600 bg-amber-50/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Guide & Overview</span>
        </button>
      </div>

      {/* Tab Content 1: Detailed Daily Itinerary */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Day-by-Day Expedition Breakdown</span>
            <button
              onClick={expandAll}
              className="text-xs font-extrabold text-amber-600 hover:text-amber-700 underline"
            >
              Expand All Days
            </button>
          </div>

          <div className="space-y-4">
            {tour.itinerary.map((day) => {
              const isExpanded = expandedDays.includes(day.day);

              return (
                <div
                  key={day.day}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleDay(day.day)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/80 focus:outline-none transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 font-serif-premium font-black text-lg flex items-center justify-center shadow shrink-0">
                        D{day.day}
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-600 block">{day.time}</span>
                        <h4 className="font-serif-premium text-lg sm:text-xl font-bold text-slate-900">{day.title}</h4>
                      </div>
                    </div>
                    <div className="p-2 rounded-full bg-slate-100 text-slate-600 ml-4">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-6 animate-fadeIn">
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {day.description}
                      </p>

                      <div className="space-y-2.5">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Daily Highlights & VIP Inclusions:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {day.highlights.map((h, i) => (
                            <div key={i} className="flex items-center space-x-2.5 bg-amber-50/40 p-3 rounded-xl border border-amber-100 text-xs font-bold text-slate-800">
                              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 2: Places Covered */}
      {activeTab === 'places' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-left">
          <h3 className="font-serif-premium text-2xl font-bold text-slate-900">
            Destinations & Archaeological Sites Explored
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            This premium expedition guarantees private guided access and first-class transportation across all these pristine local landmarks.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {tour.placesCovered.map((place, index) => (
              <div key={index} className="flex items-center space-x-2 bg-slate-900 text-white py-3 px-5 rounded-2xl shadow">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-extrabold text-sm">{place}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Inclusions and Exclusions */}
      {activeTab === 'inclusions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          {/* What is Included */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif-premium text-2xl font-bold text-slate-900">What is Included</h3>
            </div>
            <p className="text-slate-500 text-xs">Everything you need for a truly stress-free, luxurious voyage.</p>

            <ul className="space-y-4">
              {tour.included.map((inc, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm font-medium text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What is not Included */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif-premium text-2xl font-bold text-slate-900">What is Not Included</h3>
            </div>
            <p className="text-slate-500 text-xs">Transparent disclosures so there are zero surprises.</p>

            <ul className="space-y-4">
              {tour.notIncluded.map((notInc, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm font-medium text-slate-700 leading-relaxed">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{notInc}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start space-x-3 text-xs text-amber-900 mt-6">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Need Help Booking Flights?</span>
                <span>Our premium air concierge can book your matching first-class or business international airfare with any airline upon request.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Guide Information & Overview */}
      {activeTab === 'guide' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-left">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500 text-slate-950 flex items-center justify-center font-serif-premium font-black text-2xl shadow-lg">
              VIP
            </div>
            <div>
              <h3 className="font-serif-premium text-2xl font-bold text-slate-900">Certified Expedition Concierge</h3>
              <span className="text-sm font-bold text-amber-600 block mt-0.5">{tour.guideExpertise}</span>
            </div>
          </div>

          <div className="h-[1px] bg-slate-100"></div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-base">Expedition Overview</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {tour.overview}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Perfect For:</span>
            <div className="flex flex-wrap gap-2">
              {tour.bestFor.map((bf, i) => (
                <span key={i} className="bg-slate-100 text-slate-800 px-3.5 py-1.5 rounded-xl font-bold text-xs">
                  {bf}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
