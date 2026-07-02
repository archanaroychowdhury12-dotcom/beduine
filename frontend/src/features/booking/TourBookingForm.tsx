import React, { useState, useEffect, useMemo } from 'react';
import { TourPackage, Voucher, PriceCalculation, AppUser, BookingPaymentType } from '@/types';
import { CREDIT_VALUE_DOMESTIC, CREDIT_VALUE_INTERNATIONAL } from '@/utils/creditHelpers';
import { TOUR_PACKAGES } from '@/data/tours';
import { getPlanDetails } from '@/data/siteData';
import { ChevronRight, Check, Clock, X, Crown } from 'lucide-react';
import { calculateBookingPricing } from '@/features/booking/utils/pricing';
import { calculateAdvancePaymentPlan } from '@/features/booking/utils/advancePaymentSchedule';
import { useTravelerManifest } from '@/features/booking/hooks/useTravelerManifest';
import { usePickupDefaults } from '@/features/booking/hooks/usePickupDefaults';
import { useBookingCredits } from '@/features/booking/hooks/useBookingCredits';
import { useBookingPayment } from '@/features/booking/hooks/useBookingPayment';
import { BookingTrustCards } from '@/features/booking/components/BookingTrustCards';
import { ProfileSyncModal } from '@/features/booking/components/ProfileSyncModal';
import { PolicyDrawerModal } from '@/features/booking/components/PolicyDrawerModal';
import { notify } from '@/services/uiFeedback';

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

// Child Component imports
import { BookingPortalHeader } from '@/pages/main-website-tour-page/BookingPortalHeader';
import { TourSelection } from '@/pages/main-website-tour-page/TourSelection';
import { TravelerInfoSection } from '@/pages/main-website-tour-page/TravelerInfoForm';
import { PickupSection, ADD_ONS } from '@/pages/main-website-tour-page/PickupDropoffForm';
import { VoucherSection } from '@/pages/main-website-tour-page/VoucherCouponPanel';
import { PriceSummarySticky } from '@/pages/main-website-tour-page/PriceSummary';
import { PaymentSection } from '@/pages/main-website-tour-page/PaymentSection';
import { ConfirmationScreen } from '@/pages/main-website-tour-page/BookingConfirmation';
import { ReceiptModal } from '@/pages/main-website-tour-page/ReceiptModal';
import { SupportFaqSection } from '@/pages/main-website-tour-page/TourFAQ';

interface TourBookingFormProps {
  initialTourId?: string | null;
  onReturnHome: () => void;
  currentUser?: AppUser | any;
  setCurrentUser?: (user: AppUser | any) => void;
}

export const TourBookingForm: React.FC<TourBookingFormProps> = ({
  initialTourId,
  onReturnHome,
  currentUser,
  setCurrentUser
}) => {
  const productionMode = import.meta.env.VITE_BACKEND_MODE === 'production';

  // Save Profile modal trigger
  const [showSaveProfileModal, setShowSaveProfileModal] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<{ title: string; content: string } | null>(null);

  // 1. Selected Tour State
  const [selectedTour, setSelectedTour] = useState<TourPackage>(() => {
    if (initialTourId) {
      const found = TOUR_PACKAGES.find(t => t.id === initialTourId);
      if (found) return found;
    }
    return TOUR_PACKAGES[0];
  });

  // Active Plan details
  const planDetails = useMemo(() => {
    return currentUser?.planName ? getPlanDetails(currentUser.planName) : null;
  }, [currentUser]);

  // Progressive Booking Step (1 to 5)
  const [bookingStep, setBookingStep] = useState<number>(1);

  // Add-ons Selected State
  const [addOnsSelected, setAddOnsSelected] = useState<string[]>([]);

  // Whenever initialTourId changes, update selectedTour
  useEffect(() => {
    if (initialTourId) {
      const found = TOUR_PACKAGES.find(t => t.id === initialTourId);
      if (found) {
        setSelectedTour(found);
      }
    }
  }, [initialTourId]);

  // Private VIP Surcharge Upgrade state (handled as part of add-ons / upgrades)
  const [isPrivateTour, setIsPrivateTour] = useState<boolean>(false);

  // Date Selection State
  const [selectedDate, setSelectedDate] = useState<string>(selectedTour.availableDates[0]);

  // Reset states when tour package changes
  useEffect(() => {
    setSelectedDate(selectedTour.availableDates[0]);
    setIsPrivateTour(false);
    setAddOnsSelected([]);
  }, [selectedTour]);

  const { travelers, setTravelers, profileHasChanges } = useTravelerManifest(currentUser);

  const credits = useBookingCredits({
    currentUser,
    tourCategory: selectedTour.category,
    travelerCount: travelers.length,
  });

  const {
    availableDomesticCredits,
    availableInternationalCredits,
    appliedDiscountCredits,
    setAppliedDiscountCredits,
    creditSelection,
    setCreditError,
    creditError,
    creditSuccess,
    handleSelectCreditCategory,
    handleUpdateAppliedCredits,
  } = credits;

  const { pickup, setPickup } = usePickupDefaults(selectedTour);

  // Voucher state
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | undefined>(undefined);

  const handleToggleAddOn = (id: string) => {
    setAddOnsSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Live Price Calculations
  const pricing: PriceCalculation = useMemo(() => calculateBookingPricing({
    selectedTour,
    travelers,
    isPrivateTour: productionMode ? false : isPrivateTour,
    appliedVoucher: productionMode ? undefined : appliedVoucher,
    planDetails: productionMode ? null : planDetails,
    addOnsSelected: productionMode ? [] : addOnsSelected,
    addOns: ADD_ONS,
    appliedDiscountCredits,
    serviceFeeRate: productionMode ? 0 : 0.05,
  }), [selectedTour, travelers, productionMode, isPrivateTour, appliedVoucher, planDetails, addOnsSelected, appliedDiscountCredits]);

  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [bookingType, setBookingType] = useState<BookingPaymentType>('fixed_departure');
  const [instantBookingRequired, setInstantBookingRequired] = useState<boolean>(false);

  const paymentPlan = useMemo(() => calculateAdvancePaymentPlan({
    baseTourTotal: pricing.totalPayable,
    selectedDate,
    tourCategory: selectedTour.category,
    bookingType,
    instantBookingRequired,
  }), [pricing.totalPayable, selectedDate, selectedTour.category, bookingType, instantBookingRequired]);

  const payment = useBookingPayment({
    currentUser,
    setCurrentUser,
    selectedTour,
    selectedDate,
    isPrivateTour: productionMode ? false : isPrivateTour,
    travelers,
    specialRequests,
    pickup,
    pricing,
    paymentPlan,
    appliedDiscountCredits,
    creditSelection,
    setAppliedDiscountCredits,
    setCreditError,
    profileHasChanges,
    setShowSaveProfileModal,
    setBookingStep,
    onReturnHome,
  });

  const {
    agreedToTerms,
    setAgreedToTerms,
    agreedToPassport,
    setAgreedToPassport,
    paymentDetails,
    setPaymentDetails,
    bookingStage,
    processingStepText,
    confirmedBookingData,
    showReceiptModal,
    setShowReceiptModal,
    termsWarning,
    canProceed,
    handlePayNow,
    handleProceedWithPayment,
    handleSaveLater,
    handleResetBooking,
  } = payment;

  // Validate fields in traveler cards before moving from Step 3 to Step 4
  const validateTravelersBeforeStep = () => {
    for (let i = 0; i < travelers.length; i++) {
      const t = travelers[i];
      if (!t.firstName || !t.firstName.trim() || !t.lastName || !t.lastName.trim()) {
        notify.info(`Please complete the name details for Traveler ${i + 1} first.`);
        return false;
      }
      if (i === 0) {
        if (!t.email || !t.email.trim() || !t.phone || !t.phone.trim()) {
          notify.info('Please enter lead traveler email and phone number contact details.');
          return false;
        }
      }
    }
    return true;
  };

  const openPolicy = (title: string, content: string) => {
    setActivePolicy({ title, content });
  };


  if (bookingStage === 'confirmed' && confirmedBookingData) {
    return (
      <div className="bg-slate-50 min-h-screen pt-12 pb-16">
        <ConfirmationScreen
          confirmation={confirmedBookingData}
          onViewReceipt={() => setShowReceiptModal(true)}
          onResetBooking={handleResetBooking}
          onReturnHome={onReturnHome}
        />
        {showReceiptModal && (
          <ReceiptModal
            confirmation={confirmedBookingData}
            onClose={() => setShowReceiptModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">

      {/* Top Navigation Area */}
      <BookingPortalHeader
        onReturnHome={onReturnHome}
        onSaveLater={handleSaveLater}
        onMyBookings={() => {
          notify.info("Opening your saved itineraries list...");
          onReturnHome();
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {/* Booking Header Title Area */}
        <div className="text-left mb-8 space-y-2">
          <h2 className="text-3xl font-black text-slate-900 font-serif-premium tracking-tight">Book Your Travel</h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-slate-500 text-sm">Complete your booking in a few simple steps.</p>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-450 font-bold bg-slate-200/50 px-3 py-1 rounded-full w-fit">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Takes about 5 minutes</span>
            </span>
          </div>
        </div>

        {/* 5-Step Stepper Horizontal Progress Bar */}
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

        {/* Main Dual-Column Wizard Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Progressive Steps Panel */}
          <div className="lg:col-span-8 space-y-6">

            {/* Step Accordion List */}
            <div className="space-y-6">

              {/* STEP 1: SELECT TOUR */}
              <div className={`bg-white border rounded-3xl transition-all duration-300 ${
                bookingStep === 1 ? 'border-amber-500 shadow-md p-6 sm:p-8' : 'border-slate-200 p-5 opacity-80'
              }`}>
                {bookingStep !== 1 ? (
                  <div className="flex justify-between items-center text-left">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase block tracking-wider">Step 1 — Completed</span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{selectedTour.name}</h4>
                      <span className="text-xs text-slate-500">{selectedTour.durationDays} Days • Date: {selectedDate}</span>
                    </div>
                    <button
                      onClick={() => setBookingStep(1)}
                      className="text-xs font-black text-amber-600 hover:text-amber-700 underline cursor-pointer"
                    >
                      Edit Step
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <TourSelection
                      selectedTour={selectedTour}
                      onSelectTour={setSelectedTour}
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                    />

                    {/* Step Navigation Controls */}
                    <div className="pt-5 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStep(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2: VOUCHER & PACKAGE */}
              <div className={`bg-white border rounded-3xl transition-all duration-300 ${
                bookingStep === 2 ? 'border-amber-500 shadow-md p-6 sm:p-8' : 'border-slate-200 p-5 opacity-80'
              }`}>
                {bookingStep !== 2 ? (
                  <div className="flex justify-between items-center text-left">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase block tracking-wider">Step 2 — Completed</span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        {appliedVoucher ? `Applied: ${appliedVoucher.code}` : 'No Voucher Applied'}
                        {appliedDiscountCredits > 0 && ` • Applied Credits: ${appliedDiscountCredits} (${selectedTour.category === 'international' ? 'Intl' : 'Dom'})`}
                      </h4>
                      <div className="flex flex-col gap-0.5 mt-1 text-left">
                        {appliedVoucher && <span className="text-xs text-emerald-700 font-bold">Saved {appliedVoucher.type === 'percentage' ? `${appliedVoucher.value}%` : formatINR(appliedVoucher.value)} (Promo)</span>}
                        {appliedDiscountCredits > 0 && (
                          <span className="text-xs text-amber-750 font-bold">
                            Saved {formatINR(appliedDiscountCredits * (selectedTour.category === 'international' ? CREDIT_VALUE_INTERNATIONAL : CREDIT_VALUE_DOMESTIC))} (Discount Credits)
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setBookingStep(2)}
                      className="text-xs font-black text-amber-600 hover:text-amber-700 underline cursor-pointer"
                      disabled={bookingStep < 2}
                    >
                      Edit Step
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    {!productionMode && (
                      <VoucherSection
                        appliedVoucher={appliedVoucher}
                        setAppliedVoucher={setAppliedVoucher}
                        subtotal={pricing.subtotalBeforeVoucher}
                      />
                    )}

                    {/* Beduine Member Discount Credits Section */}
                    <div className="pt-6 border-t border-slate-100 text-left">
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-amber-500" />
                          <span>Beduine Member Discount Credits</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">Apply your subscription discount credits for additional tour savings.</p>
                      </div>

                      {!currentUser ? (
                        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 text-slate-500 text-xs font-semibold">
                          Please sign in to apply your member discount credits.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Credit Type Selector Tabs */}
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => handleSelectCreditCategory('domestic')}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                creditSelection === 'domestic'
                                  ? 'border-amber-500 bg-amber-50/10 font-bold shadow-sm'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-900">Domestic Credits</span>
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">₹500 each</span>
                              </div>
                              <span className="text-xs font-bold text-slate-500 mt-1 block">
                                Available: {availableDomesticCredits}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSelectCreditCategory('international')}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                creditSelection === 'international'
                                  ? 'border-amber-500 bg-amber-50/10 font-bold shadow-sm'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-900">International Credits</span>
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">₹5,000 each</span>
                              </div>
                              <span className="text-xs font-bold text-slate-500 mt-1 block">
                                Available: {availableInternationalCredits}
                              </span>
                            </button>
                          </div>

                          {/* Error / Warning Alert */}
                          {creditError && (
                            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-bold flex items-center gap-2">
                              <X className="w-4 h-4 text-rose-600 shrink-0" />
                              <span>{creditError}</span>
                            </div>
                          )}

                          {/* Success Alert */}
                          {creditSuccess && (
                            <div className="p-3.5 rounded-xl border border-emerald-250/60 bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{creditSuccess}</span>
                            </div>
                          )}

                          {/* Traveler-wise Discount Credit Control */}
                          {!creditError && (
                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Apply Discount Credits Traveler-wise</span>
                                <span className="text-[10px] text-slate-500 block mt-0.5">
                                  Rule: 1 DC = 1 person. Multiple credits cannot be combined for one traveler.
                                </span>
                              </div>

                              <div className="space-y-2">
                                {travelers.map((traveler, index) => {
                                  const availableForCategory = creditSelection === 'international' ? availableInternationalCredits : availableDomesticCredits;
                                  const appliedForTraveler = index < appliedDiscountCredits;
                                  const disabledByBalance = !appliedForTraveler && appliedDiscountCredits >= availableForCategory;
                                  const travelerName = `${traveler.firstName || 'Traveler'} ${traveler.lastName || index + 1}`.trim();
                                  return (
                                    <div key={`${traveler.email || traveler.phone || 'traveler'}-${index}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                                      <div>
                                        <p className="text-xs font-black text-slate-900">{travelerName}</p>
                                        <p className="text-[10px] text-slate-500 font-semibold">
                                          {appliedForTraveler ? '1 DC applied for this traveler' : 'No DC applied for this traveler'}
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        disabled={disabledByBalance}
                                        onClick={() => handleUpdateAppliedCredits(appliedForTraveler ? index : index + 1)}
                                        className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer ${
                                          appliedForTraveler
                                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                            : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed'
                                        }`}
                                      >
                                        {appliedForTraveler ? 'Remove DC' : 'Apply 1 DC'}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="text-[10px] text-slate-500 font-bold">
                                Applied: {appliedDiscountCredits}/{Math.min(travelers.length, creditSelection === 'international' ? availableInternationalCredits : availableDomesticCredits)} eligible credit(s).
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="pt-5 border-t border-slate-100 flex justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStep(1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold uppercase cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStep(3);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: TRAVELER DETAILS */}
              <div className={`bg-white border rounded-3xl transition-all duration-300 ${
                bookingStep === 3 ? 'border-amber-500 shadow-md p-6 sm:p-8' : 'border-slate-200 p-5 opacity-80'
              }`}>
                {bookingStep !== 3 ? (
                  <div className="flex justify-between items-center text-left">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase block tracking-wider">Step 3 — Completed</span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        {travelers.length} Traveler{travelers.length > 1 ? 's' : ''} Details Recorded
                      </h4>
                      <span className="text-xs text-slate-550 block">Lead: {travelers[0]?.firstName} {travelers[0]?.lastName}</span>
                    </div>
                    <button
                      onClick={() => setBookingStep(3)}
                      className="text-xs font-black text-amber-600 hover:text-amber-700 underline cursor-pointer"
                      disabled={bookingStep < 3}
                    >
                      Edit Step
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    <TravelerInfoSection
                      travelers={travelers}
                      setTravelers={setTravelers}
                      specialRequests={specialRequests}
                      setSpecialRequests={setSpecialRequests}
                      maxGroupLimit={selectedTour.groupSize.max}
                      currentUser={currentUser}
                    />

                    {/* Step Navigation Controls */}
                    <div className="pt-5 border-t border-slate-100 flex justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStep(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold uppercase cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (validateTravelersBeforeStep()) {
                            setBookingStep(4);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 4: PICKUP & ADD-ONS */}
              <div className={`bg-white border rounded-3xl transition-all duration-300 ${
                bookingStep === 4 ? 'border-amber-500 shadow-md p-6 sm:p-8' : 'border-slate-200 p-5 opacity-80'
              }`}>
                {bookingStep !== 4 ? (
                  <div className="flex justify-between items-center text-left">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase block tracking-wider">Step 4 — Completed</span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        {pickup.type === 'assistance' ? 'Request Logistics Contact Support' : 'Pickup details set'}
                      </h4>
                      <span className="text-xs text-slate-550 block">{addOnsSelected.length} optional extras upgrade selected</span>
                    </div>
                    <button
                      onClick={() => setBookingStep(4)}
                      className="text-xs font-black text-amber-600 hover:text-amber-700 underline cursor-pointer"
                      disabled={bookingStep < 4}
                    >
                      Edit Step
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    <PickupSection
                      pickup={pickup}
                      setPickup={setPickup}
                      destinationName={selectedTour.destination}
                      currentUser={currentUser}
                      addOnsSelected={addOnsSelected}
                      onToggleAddOn={handleToggleAddOn}
                      travelerCount={travelers.length}
                      showAddOns={!productionMode}
                    />

                    {/* Step Navigation Controls */}
                    <div className="pt-5 border-t border-slate-100 flex justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStep(3);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold uppercase cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStep(5);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                      >
                        <span>Review & Pay</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 5: REVIEW & PAY */}
              {bookingStep === 5 && (
                <div className="bg-white border border-amber-500 rounded-3xl p-6 sm:p-8 shadow-md">
                  <PaymentSection
                    tour={selectedTour}
                    selectedDate={selectedDate}
                    travelers={travelers}
                    appliedVoucher={appliedVoucher}
                    pickup={pickup}
                    addOnsSelected={addOnsSelected}
                    pricing={pricing}
                    paymentPlan={paymentPlan}
                    bookingType={bookingType}
                    setBookingType={setBookingType}
                    instantBookingRequired={instantBookingRequired}
                    setInstantBookingRequired={setInstantBookingRequired}
                    onJumpToStep={setBookingStep}
                    paymentDetails={paymentDetails}
                    setPaymentDetails={setPaymentDetails}
                    onPayNow={handlePayNow}
                    isProcessing={bookingStage === 'processing'}
                    processingStep={processingStepText}
                    canProceed={canProceed}
                    termsWarning={termsWarning}
                    agreedToTerms={agreedToTerms}
                    setAgreedToTerms={setAgreedToTerms}
                    agreedToPassport={agreedToPassport}
                    setAgreedToPassport={setAgreedToPassport}
                  />
                </div>
              )}

            </div>

            <BookingTrustCards onOpenPolicy={openPolicy} />

            {/* Support FAQ Section (Rendered inside Wizard for accessibility) */}
            <SupportFaqSection />

          </div>

          {/* Right Column: Sticky Summary Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <PriceSummarySticky
              tour={selectedTour}
              pricing={pricing}
              paymentPlan={paymentPlan}
              selectedDate={selectedDate}
              onJumpToStep={setBookingStep}
              onSaveLater={handleSaveLater}
              onSupportClick={() => {
                const el = document.getElementById('step-11');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>

        </div>

        <ProfileSyncModal
          open={showSaveProfileModal}
          onConfirm={() => handleProceedWithPayment(true)}
          onSkip={() => handleProceedWithPayment(false)}
        />

        <PolicyDrawerModal
          policy={activePolicy}
          onClose={() => setActivePolicy(null)}
        />

      </div>
    </div>
  );
};
