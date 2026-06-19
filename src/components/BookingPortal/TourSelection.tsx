import React, { useState } from 'react';
import { TourPackage } from '../../types';
import { TOUR_PACKAGES } from '../../data/tours';
import { MapPin, Calendar, Clock, Star, Check, Eye } from 'lucide-react';

interface TourSelectionProps {
  selectedTour: TourPackage;
  onSelectTour: (tour: TourPackage) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export const TourSelection: React.FC<TourSelectionProps> = ({
  selectedTour,
  onSelectTour,
  selectedDate,
  onSelectDate,
}) => {
  const [showTourList, setShowTourList] = useState(false);
  const [showFullDetailsModal, setShowFullDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'places' | 'inclusions' | 'guide'>('itinerary');
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  const toggleDay = (dayNum: number) => {
    if (expandedDays.includes(dayNum)) {
      setExpandedDays(expandedDays.filter(d => d !== dayNum));
    } else {
      setExpandedDays([...expandedDays, dayNum]);
    }
  };

  // Availability mock generator for dates
  const getAvailabilityStatus = (_dateStr: string, idx: number) => {
    if (idx === 0) return { label: 'Best Value', color: 'bg-emerald-500 text-white', status: 'Available' };
    if (idx === 1) return { label: 'Guaranteed', color: 'bg-blue-500 text-white', status: 'Available' };
    if (idx === 2) return { label: 'Last 3 spots', color: 'bg-orange-500 text-white', status: 'Almost Full' };
    return { label: 'Guaranteed', color: 'bg-slate-500 text-white', status: 'Available' };
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-0.5">Step 1 — Configure Tour Plan</span>
          <h3 className="text-xl font-bold text-slate-900">Select Tour Package & Departure Date</h3>
        </div>
        
        <button
          onClick={() => setShowTourList(!showTourList)}
          className="text-xs font-bold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200/60 transition-colors cursor-pointer"
        >
          {showTourList ? 'Cancel Change' : 'Change Tour Package'}
        </button>
      </div>

      {/* Tour selection list grid (shown when switching tours) */}
      {showTourList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 animate-fadeIn">
          {TOUR_PACKAGES.map((tour) => {
            const isSelected = tour.id === selectedTour.id;
            const isIntl = !tour.destination.toLowerCase().includes('india') && 
                            !tour.destination.toLowerCase().includes('west bengal') && 
                            !tour.destination.toLowerCase().includes('odisha');
            
            return (
              <div
                key={tour.id}
                onClick={() => {
                  if (isIntl) {
                    alert("International guided packages are currently in preview. Booking open soon!");
                  } else {
                    onSelectTour(tour);
                    setShowTourList(false);
                  }
                }}
                className={`p-4 rounded-xl border-2 transition-all flex items-start gap-3 text-left relative ${
                  isIntl
                    ? 'border-slate-200/40 bg-slate-50/50 opacity-60 cursor-not-allowed'
                    : isSelected
                    ? 'border-amber-500 bg-amber-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-350 cursor-pointer'
                }`}
              >
                {isIntl && (
                  <span className="absolute top-2 right-2 text-[9px] font-black bg-slate-250 text-slate-500 px-1.5 py-0.5 rounded">
                    Preview
                  </span>
                )}
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-200"
                />
                <div className="truncate">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{tour.destination}</span>
                  <span className="font-bold text-sm text-slate-900 block truncate">{tour.name}</span>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-semibold">
                    <span>{tour.durationDays} Days</span>
                    <span>•</span>
                    <span className="text-amber-600 font-extrabold">{formatINR(tour.basePrice)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Tour Detailed Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
        
        {/* Left image block */}
        <div className="relative md:w-2/5 min-h-[180px] bg-slate-900 shrink-0">
          <img
            src={selectedTour.image}
            alt={selectedTour.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-slate-900/60 backdrop-blur-sm px-2 py-0.5 rounded-full mb-1">
              <MapPin className="w-3 h-3" /> {selectedTour.destination}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="font-bold text-white">{selectedTour.rating}</span>
              <span className="text-slate-300">({selectedTour.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Right content block */}
        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {selectedTour.durationDays} Days / {selectedTour.durationNights} Nights
              </span>
              <span className="font-semibold">{selectedTour.difficultyLevel} Pace</span>
            </div>

            <h4 className="font-serif-premium text-xl font-bold text-slate-900">{selectedTour.name}</h4>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{selectedTour.shortSummary}</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block">Starting Price</span>
              <span className="text-xl font-black text-slate-900">{formatINR(selectedTour.basePrice)}</span>
              <span className="text-[10px] text-slate-500 ml-1">/ traveler</span>
            </div>

            <button
              type="button"
              onClick={() => setShowFullDetailsModal(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>View Full Details</span>
            </button>
          </div>

        </div>
      </div>

      {/* Date Cards Section */}
      <div className="space-y-3 pt-3">
        <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span>Choose departure date</span>
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {selectedTour.availableDates.map((dateStr, idx) => {
            const dateObj = new Date(dateStr);
            const isSelected = selectedDate === dateStr;
            const weekDay = dateObj.toLocaleDateString('en-IN', { weekday: 'short' });
            const dayNum = dateObj.toLocaleDateString('en-IN', { day: 'numeric' });
            const monthStr = dateObj.toLocaleDateString('en-IN', { month: 'short' });
            const availability = getAvailabilityStatus(dateStr, idx);

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => onSelectDate(dateStr)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between h-28 cursor-pointer relative ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/20 ring-2 ring-amber-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-350'
                }`}
              >
                {/* Badge */}
                <span className={`absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider block shrink-0 ${availability.color}`}>
                  {availability.label}
                </span>

                <div className="pt-2 text-slate-400 text-[10px] font-bold uppercase">{weekDay}</div>
                <div className="text-2xl font-black text-slate-900 leading-none my-1">{dayNum} {monthStr}</div>
                
                <div className="text-[10px] font-extrabold text-slate-500">
                  {formatINR(selectedTour.basePrice)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Compact Calendar Selector for other dates */}
        <div className="pt-2 flex items-center gap-3">
          <span className="text-xs text-slate-500 font-semibold">Need another date?</span>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  onSelectDate(e.target.value);
                }
              }}
              min={new Date().toISOString().split('T')[0]}
              className="bg-white border border-slate-250 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Tour Specs Full Modal */}
      {showFullDetailsModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[24px] max-w-4xl w-full border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fadeIn text-left text-slate-800">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-slate-900">{selectedTour.name} Specs</h3>
                <span className="text-xs text-slate-500">{selectedTour.durationDays} Days / {selectedTour.durationNights} Nights • Guided</span>
              </div>
              <button
                onClick={() => setShowFullDetailsModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal navigation tabs */}
            <div className="flex border-b border-slate-100 px-6">
              {[
                { id: 'itinerary', label: 'Itinerary' },
                { id: 'places', label: 'Places Covered' },
                { id: 'inclusions', label: 'Inclusions & Exclusions' },
                { id: 'guide', label: 'Guide & Overview' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content container */}
            <div className="p-6 overflow-y-auto flex-grow space-y-4">
              
              {activeTab === 'itinerary' && (
                <div className="space-y-4">
                  {selectedTour.itinerary.map((day) => {
                    const isExpanded = expandedDays.includes(day.day);
                    return (
                      <div key={day.day} className="border border-slate-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleDay(day.day)}
                          className="w-full p-4 bg-slate-50/40 hover:bg-slate-50 flex items-center justify-between text-left cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">D{day.day}</span>
                            <div>
                              <span className="text-[10px] text-amber-600 font-bold block">{day.time}</span>
                              <h5 className="font-bold text-sm text-slate-900">{day.title}</h5>
                            </div>
                          </div>
                          <span className="text-slate-400 text-xs font-bold">{isExpanded ? 'Collapse' : 'Expand'}</span>
                        </button>
                        {isExpanded && (
                          <div className="p-4 border-t border-slate-100 space-y-3">
                            <p className="text-xs text-slate-650 leading-relaxed">{day.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {day.highlights.map((h, i) => (
                                <span key={i} className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100/60 px-2.5 py-1 rounded-lg">
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'places' && (
                <div className="space-y-3">
                  <h4 className="font-serif-premium font-bold text-base text-slate-900">Key Places Covered</h4>
                  <p className="text-xs text-slate-550">This planned tour route includes smooth transport across all listed destinations.</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedTour.placesCovered.map((p, i) => (
                      <span key={i} className="px-3.5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'inclusions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 p-4 bg-emerald-50/20 border border-emerald-100 rounded-2xl">
                    <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" /> Inclusions
                    </h5>
                    <ul className="space-y-2 text-xs font-medium text-slate-700">
                      {selectedTour.included.map((inc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-650 shrink-0 font-bold">•</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 p-4 bg-rose-50/10 border border-rose-100 rounded-2xl">
                    <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span className="text-rose-500 font-bold shrink-0">✗</span> Exclusions
                    </h5>
                    <ul className="space-y-2 text-xs font-medium text-slate-600">
                      {selectedTour.notIncluded.map((exc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-455 shrink-0 font-bold">•</span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'guide' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-serif-premium font-black flex items-center justify-center text-sm shadow">VIP</div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">Certified Expedition Guide Included</h5>
                      <span className="text-xs text-amber-700 font-semibold">{selectedTour.guideExpertise}</span>
                    </div>
                  </div>
                  <div className="h-[1px] bg-slate-100 my-2"></div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-1">Package Overview</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedTour.overview}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-750 block">Perfect For:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedTour.bestFor.map((bf, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-semibold">{bf}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowFullDetailsModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                Close Specifications
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
