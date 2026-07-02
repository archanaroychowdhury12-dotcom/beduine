import React, { useState } from 'react';
import type {
  AppUser,
  TripType,
  HotelCategory,
  TransportPreference,
  MealPreference,
  TourActivity
} from '../../../types';
import type { CustomTourCreateInput } from '../../../services/customTourService';
import { validateCustomTourForm, ValidationErrors } from '../../../utils/customTourValidation';
import { CustomTourEstimator } from './CustomTourEstimator';
import { TOUR_PACKAGES } from '../../../data/tours';
import {
  Compass, MapPin, Plus, Minus, Check, Phone, Mail
} from 'lucide-react';

interface CustomTourFormProps {
  currentUser?: AppUser | null;
  onSubmit: (formData: CustomTourCreateInput) => void;
  isSubmitting?: boolean;
}

export const CustomTourForm: React.FC<CustomTourFormProps> = ({
  currentUser,
  onSubmit,
  isSubmitting = false
}) => {
  const initialPackage = TOUR_PACKAGES[0];

  // Shared form states
  const [selectedPackageId, setSelectedPackageId] = useState(initialPackage?.id || '');
  const [tripType, setTripType] = useState<TripType>(
    (initialPackage?.id === 'dubai-city-desert' || initialPackage?.id === 'thailand-bangkok-pattaya')
      ? 'International'
      : 'Domestic'
  );
  const [destination, setDestination] = useState(initialPackage?.destination || '');
  const [departureCity, setDepartureCity] = useState('');
  const [flexibleDates, setFlexibleDates] = useState(true);
  const [travelStartDate, setTravelStartDate] = useState('');
  const [travelEndDate, setTravelEndDate] = useState('');
  const [flexibleMonth, setFlexibleMonth] = useState('2026-09');
  const [durationNights, setDurationNights] = useState(initialPackage?.durationNights || 2);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [hotelCategory, setHotelCategory] = useState<HotelCategory>('Deluxe (3 Star)');
  const [transportPreference, setTransportPreference] = useState<TransportPreference>('Sedan');
  const [mealPreference, setMealPreference] = useState<MealPreference>('Half Board (MAP)');
  const [budget, setBudget] = useState<number>(initialPackage ? initialPackage.basePrice * 2 : 30000);
  const [activities, setActivities] = useState<TourActivity[]>(['Sightseeing']);
  const [specialRequirements, setSpecialRequirements] = useState('');
  
  // Fill user contact defaults if logged in
  const [phone, setPhone] = useState(currentUser?.mobile || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  const [errors, setErrors] = useState<ValidationErrors>({});

  const handlePackageChange = (packageId: string) => {
    setSelectedPackageId(packageId);
    const pkg = TOUR_PACKAGES.find((p: any) => p.id === packageId);
    if (pkg) {
      setDestination(pkg.destination);
      setDurationNights(pkg.durationNights);
      const isInternational = pkg.id === 'dubai-city-desert' || pkg.id === 'thailand-bangkok-pattaya';
      setTripType(isInternational ? 'International' : 'Domestic');
      setBudget(pkg.basePrice * (adults + children));
    }
  };

  const availableActivities: TourActivity[] = [
    'Sightseeing', 'Adventure', 'Wildlife Safari', 'Trekking',
    'Shopping', 'Food Tour', 'Spa & Wellness'
  ];

  const toggleActivity = (act: TourActivity) => {
    if (activities.includes(act)) {
      setActivities(activities.filter(a => a !== act));
    } else {
      setActivities([...activities, act]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      packageId: selectedPackageId,
      tripType,
      destination,
      departureCity,
      flexibleDates,
      travelStartDate: flexibleDates ? undefined : travelStartDate,
      travelEndDate: flexibleDates ? undefined : travelEndDate,
      flexibleMonth: flexibleDates ? flexibleMonth : undefined,
      durationNights,
      adults,
      children,
      rooms,
      hotelCategory,
      transportPreference,
      mealPreference,
      budget,
      activities,
      specialRequirements,
      phone,
      email
    };

    const validation = validateCustomTourForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      // Scroll to the first error
      const firstErrorKey = Object.keys(validation.errors)[0];
      const errorElement = document.getElementById(`err-${firstErrorKey}`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="max-w-6xl mx-auto space-y-8 text-left">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Form Fields Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-600 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">Configure Your Custom Trip</h2>
              <p className="text-xs text-slate-400">Provide your travel choices to generate an estimated price range.</p>
            </div>
          </div>

          {/* Base Package Selector */}
          <div className="space-y-2 pb-4 border-b border-slate-100">
            <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wide">Base Tour Package</label>
            <select
              value={selectedPackageId}
              onChange={(e) => handlePackageChange(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 font-bold"
            >
              {TOUR_PACKAGES.map((pkg: any) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} ({pkg.durationNights}N/{pkg.durationDays}D) - From ₹{pkg.basePrice.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {/* Section 1: Trip Type & Destination */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">1. Destination Details</h3>
            
            {/* Trip Type Selector */}
            <div>
              <label className="block text-[10px] font-black text-slate-450 uppercase mb-2">Trip Coverage</label>
              <div className="grid grid-cols-2 gap-3">
                {['Domestic', 'International'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    disabled
                    className={`py-3 rounded-2xl font-bold text-xs border transition-all cursor-not-allowed ${
                      tripType === type
                        ? 'border-amber-500 bg-amber-500/5 text-amber-700 shadow-sm'
                        : 'border-slate-250 text-slate-400 bg-slate-50'
                    }`}
                  >
                    {type} Tour
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Destination */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Destination (Based on Package)</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={destination}
                    disabled
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 outline-none text-xs text-slate-500 bg-slate-100 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* Departure City */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Departure City</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    placeholder="e.g. Kolkata, Delhi, Mumbai"
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl border outline-none text-xs text-slate-700 bg-slate-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-amber-500/10 ${
                      errors.departureCity ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-amber-500'
                    }`}
                  />
                </div>
                {errors.departureCity && (
                  <span id="err-departureCity" className="text-[10px] font-bold text-rose-500 mt-1 block">
                    {errors.departureCity}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Dates & Duration */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">2. Dates &amp; Duration</h3>
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={flexibleDates}
                  onChange={(e) => setFlexibleDates(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 border-slate-350 w-4 h-4 cursor-pointer"
                />
                <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wide">My dates are flexible</span>
              </label>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 items-end">
              {flexibleDates ? (
                /* Flexible: select month */
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Target Travel Month</label>
                  <select
                    value={flexibleMonth}
                    onChange={(e) => setFlexibleMonth(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 outline-none text-xs text-slate-750 bg-slate-50/50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  >
                    <option value="2026-07">July 2026</option>
                    <option value="2026-08">August 2026</option>
                    <option value="2026-09">September 2026</option>
                    <option value="2026-10">October 2026</option>
                    <option value="2026-11">November 2026</option>
                    <option value="2026-12">December 2026</option>
                  </select>
                </div>
              ) : (
                /* Specific dates */
                <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Start Date</label>
                    <input
                      type="date"
                      value={travelStartDate}
                      onChange={(e) => setTravelStartDate(e.target.value)}
                      className="w-full px-3 py-3 rounded-2xl border border-slate-200 outline-none text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">End Date</label>
                    <input
                      type="date"
                      value={travelEndDate}
                      onChange={(e) => setTravelEndDate(e.target.value)}
                      className="w-full px-3 py-3 rounded-2xl border border-slate-200 outline-none text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Duration Nights */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Duration (Nights)</label>
                <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-1 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => {
                      const selectedPackage = TOUR_PACKAGES.find((p: any) => p.id === selectedPackageId) || TOUR_PACKAGES[0];
                      const minNights = selectedPackage ? selectedPackage.durationNights : 1;
                      setDurationNights(Math.max(minNights, durationNights - 1));
                    }}
                    className="w-9 py-2 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-650 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-black text-slate-800">{durationNights}</span>
                  <button
                    type="button"
                    onClick={() => setDurationNights(Math.min(30, durationNights + 1))}
                    className="w-9 py-2 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-650 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            {errors.travelDates && (
              <span id="err-travelDates" className="text-[10px] font-bold text-rose-500 block">
                {errors.travelDates}
              </span>
            )}
          </div>

          {/* Section 3: Travelers & Rooms */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">3. Travel Companions &amp; Rooms</h3>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Adults Counter */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Adults (12+ yrs)</label>
                <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-1 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-9 py-2 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-650 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-black text-slate-800">{adults}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdults(adults + 1);
                      // Auto scale rooms if needed
                      if (rooms < Math.ceil((adults + 1 + children) / 3)) {
                        setRooms(Math.ceil((adults + 1 + children) / 3));
                      }
                    }}
                    className="w-9 py-2 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-650 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {errors.adults && (
                  <span id="err-adults" className="text-[9px] font-bold text-rose-500 mt-1 block">
                    {errors.adults}
                  </span>
                )}
              </div>

              {/* Children Counter */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Children (2-11 yrs)</label>
                <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-1 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-9 py-2 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-650 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-black text-slate-800">{children}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setChildren(children + 1);
                      if (rooms < Math.ceil((adults + children + 1) / 3)) {
                        setRooms(Math.ceil((adults + children + 1) / 3));
                      }
                    }}
                    className="w-9 py-2 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-650 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Rooms Counter */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Rooms Required</label>
                <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-1 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    className="w-9 py-2 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-650 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-black text-slate-800">{rooms}</span>
                  <button
                    type="button"
                    onClick={() => setRooms(rooms + 1)}
                    className="w-9 py-2 rounded-xl hover:bg-slate-200/60 flex items-center justify-center text-slate-650 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {errors.rooms && (
                  <span id="err-rooms" className="text-[9px] font-bold text-rose-500 mt-1 block">
                    {errors.rooms}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Preferences & Budget */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">4. Preferences &amp; Budget</h3>
            
            <div className="grid sm:grid-cols-3 gap-4">
              {/* Hotel category */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Hotel category</label>
                <select
                  value={hotelCategory}
                  onChange={(e) => setHotelCategory(e.target.value as HotelCategory)}
                  className="w-full px-3 py-3 rounded-2xl border border-slate-200 outline-none text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:border-amber-500"
                >
                  <option value="Standard (2 Star)">Standard (2 Star)</option>
                  <option value="Deluxe (3 Star)">Deluxe (3 Star)</option>
                  <option value="Luxury Resort (5 Star)">Luxury Resort (5 Star)</option>
                  <option value="Heritage/Homestay">Heritage / Homestay</option>
                  <option value="Not Sure">Not Sure / Adaptable</option>
                </select>
              </div>

              {/* Transport Preference */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Transport Choice</label>
                <select
                  value={transportPreference}
                  onChange={(e) => setTransportPreference(e.target.value as TransportPreference)}
                  className="w-full px-3 py-3 rounded-2xl border border-slate-200 outline-none text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:border-amber-500"
                >
                  <option value="Sedan">Sedan AC Car</option>
                  <option value="Premium SUV">Premium SUV / Innova</option>
                  <option value="Luxury Traveler">Luxury Traveler Van</option>
                  <option value="Flight Included">Flight Included Package</option>
                  <option value="Train Included">Train Included Package</option>
                  <option value="None">None (Self Arranged)</option>
                  <option value="Not Sure">Not Sure / Adaptable</option>
                </select>
              </div>

              {/* Meal Preference */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Meal Preference</label>
                <select
                  value={mealPreference}
                  onChange={(e) => setMealPreference(e.target.value as MealPreference)}
                  className="w-full px-3 py-3 rounded-2xl border border-slate-200 outline-none text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:border-amber-500"
                >
                  <option value="Breakfast Only">Breakfast Only (CP)</option>
                  <option value="Half Board (MAP)">Breakfast &amp; Dinner (MAP)</option>
                  <option value="Full Board (AP)">Breakfast, Lunch &amp; Dinner (AP)</option>
                  <option value="Veg Only">Veg Meals Only</option>
                  <option value="None">No Meals Included</option>
                  <option value="Not Sure">Not Sure / Adaptable</option>
                </select>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Your Target Budget (INR)</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500 font-bold text-xs">₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                  placeholder="e.g. 50000"
                  min={1}
                  className={`w-full pl-8 pr-4 py-3 rounded-2xl border outline-none text-xs font-bold text-slate-750 bg-slate-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-amber-500/10 ${
                    errors.budget ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-amber-500'
                  }`}
                />
              </div>
              {errors.budget && (
                <span id="err-budget" className="text-[10px] font-bold text-rose-500 mt-1 block">
                  {errors.budget}
                </span>
              )}
            </div>
          </div>

          {/* Section 5: Activities */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">5. Included Activities</h3>
            <div className="flex flex-wrap gap-2.5">
              {availableActivities.map((act) => {
                const selected = activities.includes(act);
                return (
                  <button
                    type="button"
                    key={act}
                    onClick={() => toggleActivity(act)}
                    className={`px-4 py-2.5 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 cursor-pointer transition-all border ${
                      selected
                        ? 'border-amber-500 bg-amber-500/5 text-amber-700 shadow-inner shadow-amber-100/50'
                        : 'border-slate-200 text-slate-500 hover:border-slate-350 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3px]" />}
                    {act}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 6: Special Notes */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">6. Special Requirements</h3>
            <textarea
              rows={3}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="e.g. wheelchair assistance, vegetarian guides, honeymoon room decoration, flight timing preferences..."
              className={`w-full px-4 py-3 rounded-2xl border outline-none text-xs text-slate-700 bg-slate-50/50 resize-none transition-all focus:bg-white focus:border-amber-500 ${
                errors.specialRequirements ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.specialRequirements && (
              <span id="err-specialRequirements" className="text-[10px] font-bold text-rose-500 block">
                {errors.specialRequirements}
              </span>
            )}
          </div>

          {/* Section 7: Contacts */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">7. Contact Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl border outline-none text-xs text-slate-750 bg-slate-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-amber-500/10 ${
                      errors.phone ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-amber-500'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <span id="err-phone" className="text-[10px] font-bold text-rose-500 mt-1 block">
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. customer@example.com"
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl border outline-none text-xs text-slate-750 bg-slate-50/50 transition-all focus:bg-white focus:ring-2 focus:ring-amber-500/10 ${
                      errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-amber-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <span id="err-email" className="text-[10px] font-bold text-rose-500 mt-1 block">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-950 transition-colors shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Custom Request'}
            </button>
          </div>
        </div>

        {/* Live Estimator Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CustomTourEstimator
              packageId={selectedPackageId}
              tripType={tripType}
              durationNights={durationNights}
              adults={adults}
              children={children}
              rooms={rooms}
              hotelCategory={hotelCategory}
              transportPreference={transportPreference}
              mealPreference={mealPreference}
              activities={activities}
              budget={budget}
            />
          </div>
        </div>

      </div>
    </form>
  );
};
