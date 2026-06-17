import React from 'react';
import { Traveler } from '../../types';
import { Calendar, Users, User, Mail, Phone, HeartHandshake, Plus, Minus, AlertCircle } from 'lucide-react';

interface TravelerInfoSectionProps {
  availableDates: string[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  travelers: Traveler[];
  setTravelers: React.Dispatch<React.SetStateAction<Traveler[]>>;
  specialRequests: string;
  setSpecialRequests: (req: string) => void;
  maxGroupLimit: number;
}

export const TravelerInfoSection: React.FC<TravelerInfoSectionProps> = ({
  availableDates,
  selectedDate,
  setSelectedDate,
  travelers,
  setTravelers,
  specialRequests,
  setSpecialRequests,
  maxGroupLimit
}) => {
  const travelerCount = travelers.length;

  const handleTravelerCountChange = (newCount: number) => {
    if (newCount < 1 || newCount > maxGroupLimit) return;
    
    if (newCount > travelers.length) {
      // Add more travelers
      const extraNeeded = newCount - travelers.length;
      const newAdditions: Traveler[] = Array.from({ length: extraNeeded }, () => ({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        isLead: false,
        ageGroup: 'Adult'
      }));
      setTravelers([...travelers, ...newAdditions]);
    } else if (newCount < travelers.length) {
      // Remove last travelers
      setTravelers(travelers.slice(0, newCount));
    }
  };

  const updateTravelerField = (index: number, field: keyof Traveler, value: any) => {
    const updated = [...travelers];
    updated[index] = { ...updated[index], [field]: value };
    setTravelers(updated);
  };

  return (
    <section id="step-4" className="py-16 scroll-mt-24 border-t border-slate-200/80 text-left">
      <div className="space-y-4 mb-10">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-600">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">4</span>
          <span>Expedition Date & Traveler Roster</span>
        </div>
        <h2 className="font-serif-premium text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Choose Your Dates & Enter Traveler Information
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl">
          Lock in your preferred departure schedule and provide traveler specifics. Prices automatically scale with the number of participants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Date Selection Box */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif-premium text-2xl font-bold text-slate-900">Select Tour Date</h3>
          </div>
          <p className="text-slate-500 text-xs">Choose one of our guaranteed fully staffed departure dates.</p>

          <div className="space-y-2.5">
            {availableDates.map((dateStr) => {
              const isSelected = selectedDate === dateStr;
              const dateObj = new Date(dateStr);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={`w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-amber-400 border-2 border-amber-500 shadow-lg scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 rounded-full ${isSelected ? 'bg-amber-400 animate-ping' : 'bg-slate-300'}`}></span>
                    <span>{formattedDate}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-600'}`}>
                    Guaranteed
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start space-x-3 text-xs text-blue-900">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <span>If your preferred travel date isn’t listed, contact our 24/7 VIP concierge line to request a custom private departure window.</span>
          </div>
        </div>

        {/* Right Counter and Dynamic Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          {/* Traveler Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Number of Travelers</h4>
                <span className="text-xs text-slate-500">Maximum limit: {maxGroupLimit} travelers for this tour</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleTravelerCountChange(travelerCount - 1)}
                disabled={travelerCount <= 1}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 font-bold transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="font-serif-premium font-black text-2xl px-2 text-slate-900">
                {travelerCount}
              </span>

              <button
                type="button"
                onClick={() => handleTravelerCountChange(travelerCount + 1)}
                disabled={travelerCount >= maxGroupLimit}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-950 font-bold transition-opacity cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Inputs Roster */}
          <div className="space-y-6">
            {travelers.map((traveler, index) => {
              const isLead = index === 0;

              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border transition-all ${
                    isLead
                      ? 'bg-amber-50/20 border-amber-300 ring-2 ring-amber-500/10 shadow-sm'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <User className={`w-4 h-4 ${isLead ? 'text-amber-600' : 'text-slate-400'}`} />
                      <h5 className="font-bold text-slate-900 text-sm">
                        Traveler {index + 1} {isLead && <span className="bg-amber-500 text-slate-950 text-[10px] px-2 py-0.5 rounded font-black ml-1 uppercase tracking-wider shadow-sm">Lead Traveler</span>}
                      </h5>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 font-medium">Age Group:</span>
                      <select
                        value={traveler.ageGroup}
                        onChange={(e) => updateTravelerField(index, 'ageGroup', e.target.value)}
                        className="text-xs font-bold bg-slate-100 text-slate-800 py-1 px-2.5 rounded-lg border border-slate-200 focus:outline-none"
                      >
                        <option value="Adult">Adult (18+)</option>
                        <option value="Child">Child (2-17)</option>
                        <option value="Senior">Senior (65+)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alexander"
                        value={traveler.firstName}
                        onChange={(e) => updateTravelerField(index, 'firstName', e.target.value)}
                        className="w-full bg-slate-50 py-3 px-4 rounded-xl border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Vance"
                        value={traveler.lastName}
                        onChange={(e) => updateTravelerField(index, 'lastName', e.target.value)}
                        className="w-full bg-slate-50 py-3 px-4 rounded-xl border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Lead Contact Info */}
                  {isLead && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/80">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-amber-600" />
                          <span>Email Address <span className="text-rose-500">*</span></span>
                        </label>
                        <input
                          type="email"
                          placeholder="alexander@example.com"
                          value={traveler.email}
                          onChange={(e) => updateTravelerField(index, 'email', e.target.value)}
                          className="w-full bg-slate-50 py-3 px-4 rounded-xl border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="text-[11px] text-slate-500 mt-1 block">Booking receipt & pass will be sent here.</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-amber-600" />
                          <span>Mobile Phone <span className="text-rose-500">*</span></span>
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 019-2834"
                          value={traveler.phone}
                          onChange={(e) => updateTravelerField(index, 'phone', e.target.value)}
                          className="w-full bg-slate-50 py-3 px-4 rounded-xl border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="text-[11px] text-slate-500 mt-1 block">For your dedicated private chauffeur.</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Special Requests textarea */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              <span>Special Dietary, Mobility, or Celebration Requests (Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Please provide vegetarian meals for Traveler 2. Celebrating our 10th wedding anniversary!"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full bg-slate-50 py-3 px-4 rounded-2xl border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
            ></textarea>
            <span className="text-xs text-slate-500 block">Our professional expedition concierges review all special notes to ensure everything is perfect.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
