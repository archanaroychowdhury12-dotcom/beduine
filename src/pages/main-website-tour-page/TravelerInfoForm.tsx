import React, { useState, useEffect } from 'react';
import { Users, Plus, Minus, Check, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { Traveler } from '../../types';

interface TravelerInfoSectionProps {
  travelers: Traveler[];
  setTravelers: React.Dispatch<React.SetStateAction<Traveler[]>>;
  specialRequests: string;
  setSpecialRequests: (req: string) => void;
  maxGroupLimit: number;
  currentUser?: any;
}

export const TravelerInfoSection: React.FC<TravelerInfoSectionProps> = ({
  travelers,
  setTravelers,
  specialRequests,
  setSpecialRequests,
  maxGroupLimit,
  currentUser,
}) => {
  // Extract counts based on the travelers list on load
  const [adults, setAdults] = useState(() => Math.max(1, travelers.filter(t => t.ageGroup === 'Adult' || t.ageGroup === 'Senior').length));
  const [children, setChildren] = useState(() => travelers.filter(t => t.ageGroup === 'Child').length);
  const [infants, setInfants] = useState(() => travelers.filter(t => t.ageGroup === 'Infant').length);

  const [expandedIdx, setExpandedIdx] = useState<number>(0);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Sync travelers list when counts change
  useEffect(() => {
    const totalCount = adults + children + infants;
    if (totalCount === travelers.length) return;

    setTravelers(prev => {
      const updated = [...prev];
      if (totalCount > prev.length) {
        // Add travelers
        const diff = totalCount - prev.length;
        const newTravelers: Traveler[] = Array.from({ length: diff }, (_, idx) => {
          const overallIndex = prev.length + idx;
          let group: 'Adult' | 'Child' | 'Infant' = 'Adult';
          
          if (overallIndex >= adults + children) {
            group = 'Infant';
          } else if (overallIndex >= adults) {
            group = 'Child';
          }

          return {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            isLead: overallIndex === 0,
            ageGroup: group,
            dob: '',
            gender: 'Male',
            emergencyContactName: '',
            emergencyContactPhone: '',
            saveToProfile: false,
          };
        });
        return [...updated, ...newTravelers];
      } else {
        // Remove travelers
        return updated.slice(0, totalCount);
      }
    });
  }, [adults, children, infants, setTravelers, travelers.length]);

  const handleIncrement = (category: 'adult' | 'child' | 'infant') => {
    const total = adults + children + infants;
    if (total >= maxGroupLimit) {
      alert(`The maximum group limit for this tour is ${maxGroupLimit} travelers.`);
      return;
    }

    if (category === 'adult') setAdults(a => a + 1);
    if (category === 'child') setChildren(c => c + 1);
    if (category === 'infant') setInfants(i => i + 1);
  };

  const handleDecrement = (category: 'adult' | 'child' | 'infant') => {
    if (category === 'adult' && adults > 1) setAdults(a => a - 1);
    if (category === 'child' && children > 0) setChildren(c => c - 1);
    if (category === 'infant' && infants > 0) setInfants(i => i - 1);
  };

  const updateField = (idx: number, field: keyof Traveler, val: any) => {
    setTravelers(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      return updated;
    });
  };

  const markTouched = (idx: number, field: string) => {
    setTouchedFields(prev => ({ ...prev, [`${idx}-${field}`]: true }));
  };

  // Validation checks
  const getValidationError = (idx: number, field: keyof Traveler, val: string) => {
    if (!val || !val.trim()) return 'This field is required';
    if (field === 'firstName' && val.trim().length < 2) return 'Must be at least 2 characters';
    if (field === 'lastName' && val.trim().length < 2) return 'Must be at least 2 characters';
    if (field === 'email' && idx === 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) return 'Please enter a valid email address';
    }
    if (field === 'phone' && idx === 0) {
      const phoneClean = val.replace(/\D/g, '');
      if (phoneClean.length < 10) return 'Please enter a valid 10-digit phone number';
    }
    return '';
  };

  const isTravelerCardComplete = (idx: number) => {
    const t = travelers[idx];
    if (!t) return false;
    const errors = [
      getValidationError(idx, 'firstName', t.firstName),
      getValidationError(idx, 'lastName', t.lastName),
    ];
    if (idx === 0) {
      errors.push(getValidationError(idx, 'email', t.email));
      errors.push(getValidationError(idx, 'phone', t.phone));
    }
    return errors.every(err => !err);
  };

  // Pre-fill lead traveler from current user profile
  const handleUseProfile = () => {
    if (!currentUser) return;
    const parts = (currentUser.fullName || '').trim().split(/\s+/);
    const first = parts[0] || '';
    const last = parts.slice(1).join(' ') || '';

    setTravelers(prev => {
      const updated = [...prev];
      if (updated[0]) {
        updated[0] = {
          ...updated[0],
          firstName: first,
          lastName: last,
          email: currentUser.email || '',
          phone: currentUser.mobile || '',
          dob: currentUser.dob || '',
        };
      }
      return updated;
    });
  };

  // Copy Lead traveler contact details to co-travelers (emergency contact)
  const handleCopyLeadContact = (idx: number) => {
    const lead = travelers[0];
    if (!lead) return;
    updateField(idx, 'emergencyContactName', `${lead.firstName} ${lead.lastName}`.trim());
    updateField(idx, 'emergencyContactPhone', lead.phone);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Step Header */}
      <div>
        <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-0.5">Step 3 — Traveler Details</span>
        <h3 className="text-xl font-bold text-slate-900">Configure Traveler Roster</h3>
        <p className="text-xs text-slate-500 mt-1">Specify how many people are traveling and input their credentials.</p>
      </div>

      {/* Traveler Counters Panel */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-950 flex items-center gap-1.5 pb-3 border-b border-slate-100">
          <Users className="w-4 h-4 text-amber-500" />
          <span>Number of Travelers</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
          {/* Adults Counter */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Adults</span>
              <span className="text-[10px] text-slate-500">Age 12+ years</span>
            </div>
            <div className="flex items-center space-x-3.5">
              <button
                type="button"
                onClick={() => handleDecrement('adult')}
                disabled={adults <= 1}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Minus className="w-3.5 h-3.5 text-slate-650" />
              </button>
              <span className="text-base font-black text-slate-900 font-mono w-4 text-center">{adults}</span>
              <button
                type="button"
                onClick={() => handleIncrement('adult')}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-slate-650" />
              </button>
            </div>
          </div>

          {/* Children Counter */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Children</span>
              <span className="text-[10px] text-slate-500">Age 5 - 11 years</span>
            </div>
            <div className="flex items-center space-x-3.5">
              <button
                type="button"
                onClick={() => handleDecrement('child')}
                disabled={children <= 0}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Minus className="w-3.5 h-3.5 text-slate-650" />
              </button>
              <span className="text-base font-black text-slate-900 font-mono w-4 text-center">{children}</span>
              <button
                type="button"
                onClick={() => handleIncrement('child')}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-slate-650" />
              </button>
            </div>
          </div>

          {/* Infants Counter */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Infants</span>
              <span className="text-[10px] text-slate-500">Age 0 - 4 years</span>
            </div>
            <div className="flex items-center space-x-3.5">
              <button
                type="button"
                onClick={() => handleDecrement('infant')}
                disabled={infants <= 0}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Minus className="w-3.5 h-3.5 text-slate-650" />
              </button>
              <span className="text-base font-black text-slate-900 font-mono w-4 text-center">{infants}</span>
              <button
                type="button"
                onClick={() => handleIncrement('infant')}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-slate-650" />
              </button>
            </div>
          </div>
        </div>

        {currentUser && (
          <div className="flex items-center justify-between bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
            <span className="text-xs text-slate-600 font-semibold">Pre-fill lead traveler from your account profile?</span>
            <button
              type="button"
              onClick={handleUseProfile}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer"
            >
              Use Profile Details
            </button>
          </div>
        )}
      </div>

      {/* Accordion Travelers List */}
      <div className="space-y-4">
        {travelers.map((traveler, idx) => {
          const isLead = idx === 0;
          const isOpen = expandedIdx === idx;
          const isComplete = isTravelerCardComplete(idx);

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? 'border-amber-500 bg-white shadow-md'
                  : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              {/* Card Header toggle */}
              <button
                type="button"
                onClick={() => setExpandedIdx(isOpen ? -1 : idx)}
                className="w-full p-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className={`w-8 h-8 rounded-lg font-serif-premium font-black flex items-center justify-center text-xs shrink-0 ${
                    isComplete ? 'bg-emerald-500 text-white animate-pulse-soft' : 'bg-slate-900 text-amber-400'
                  }`}>
                    {isComplete ? <Check className="w-4 h-4" /> : `#${idx + 1}`}
                  </span>
                  <div className="truncate">
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                      {traveler.ageGroup} Traveler {isLead && '• Lead'}
                    </span>
                    <span className="font-bold text-slate-850 text-sm truncate">
                      {traveler.firstName || traveler.lastName
                        ? `${traveler.firstName} ${traveler.lastName}`.trim()
                        : `Enter Traveler ${idx + 1} Name`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                    isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-805'
                  }`}>
                    {isComplete ? 'Ready' : 'Incomplete'}
                  </span>
                  <div className="p-1 rounded-full hover:bg-slate-200/60 text-slate-500">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Card Body */}
              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 animate-fadeIn">
                  
                  {/* Name fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. John"
                        value={traveler.firstName}
                        onBlur={() => markTouched(idx, 'firstName')}
                        onChange={(e) => updateField(idx, 'firstName', e.target.value)}
                        className="w-full bg-slate-50/50 py-2.5 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      {touchedFields[`${idx}-firstName`] && getValidationError(idx, 'firstName', traveler.firstName) && (
                        <span className="text-[10px] text-rose-500 font-bold block mt-1">
                          {getValidationError(idx, 'firstName', traveler.firstName)}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Doe"
                        value={traveler.lastName}
                        onBlur={() => markTouched(idx, 'lastName')}
                        onChange={(e) => updateField(idx, 'lastName', e.target.value)}
                        className="w-full bg-slate-50/50 py-2.5 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      {touchedFields[`${idx}-lastName`] && getValidationError(idx, 'lastName', traveler.lastName) && (
                        <span className="text-[10px] text-rose-500 font-bold block mt-1">
                          {getValidationError(idx, 'lastName', traveler.lastName)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact Info (Only for Lead) */}
                  {isLead && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={traveler.email}
                          onBlur={() => markTouched(idx, 'email')}
                          onChange={(e) => updateField(idx, 'email', e.target.value)}
                          className="w-full bg-slate-50/50 py-2.5 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        {touchedFields[`${idx}-email`] && getValidationError(idx, 'email', traveler.email) && (
                          <span className="text-[10px] text-rose-500 font-bold block mt-1">
                            {getValidationError(idx, 'email', traveler.email)}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          value={traveler.phone}
                          onBlur={() => markTouched(idx, 'phone')}
                          onChange={(e) => updateField(idx, 'phone', e.target.value)}
                          className="w-full bg-slate-50/50 py-2.5 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        {touchedFields[`${idx}-phone`] && getValidationError(idx, 'phone', traveler.phone) && (
                          <span className="text-[10px] text-rose-500 font-bold block mt-1">
                            {getValidationError(idx, 'phone', traveler.phone)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Co-travelers fields (Gender, DOB, and Emergency contact) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={traveler.dob || ''}
                        onChange={(e) => updateField(idx, 'dob', e.target.value)}
                        className="w-full bg-slate-50/50 py-2.5 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                        Gender (Operational)
                      </label>
                      <select
                        value={traveler.gender || 'Male'}
                        onChange={(e) => updateField(idx, 'gender', e.target.value)}
                        className="w-full bg-slate-50/50 py-2.5 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex items-end pb-1.5">
                      <label className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-650 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={traveler.saveToProfile || false}
                          onChange={(e) => updateField(idx, 'saveToProfile', e.target.checked)}
                          className="w-4 h-4 rounded text-amber-500 border-slate-350 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Save to traveler profile</span>
                      </label>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Emergency Contact info</span>
                      {!isLead && (
                        <button
                          type="button"
                          onClick={() => handleCopyLeadContact(idx)}
                          className="text-[10px] font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy lead traveler contact</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Contact Person Name"
                        value={traveler.emergencyContactName || ''}
                        onChange={(e) => updateField(idx, 'emergencyContactName', e.target.value)}
                        className="w-full bg-slate-50/50 py-2.5 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <input
                        type="tel"
                        placeholder="Contact Phone Number"
                        value={traveler.emergencyContactPhone || ''}
                        onChange={(e) => updateField(idx, 'emergencyContactPhone', e.target.value)}
                        className="w-full bg-slate-50/50 py-2.5 px-3 rounded-lg border border-slate-200 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Special Requests textarea */}
      <div className="space-y-2 pt-3">
        <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
          Special assistance, mobility, or dietary requests (Optional)
        </label>
        <textarea
          rows={3}
          placeholder="e.g. Vegetarian meals requested, wheelchair access required at jetty, celebrating birthday..."
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

    </div>
  );
};
