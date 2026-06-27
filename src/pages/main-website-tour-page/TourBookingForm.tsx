import React from 'react';
import { useTourBookingState } from '../../hooks/useTourBookingState';
import { ChevronRight, Check, Clock, X, ShieldCheck, Crown, User } from 'lucide-react';
import { CREDIT_VALUE_DOMESTIC, CREDIT_VALUE_INTERNATIONAL } from '../../utils/creditHelpers';

// Child Component imports
import { BookingPortalHeader } from './BookingPortalHeader';
import { TourSelection } from './TourSelection';
import { TravelerInfoSection } from './TravelerInfoForm';
import { PickupSection } from './PickupDropoffForm';
import { VoucherSection } from './VoucherCouponPanel';
import { PriceSummarySticky } from './PriceSummary';
import { PaymentSection } from './PaymentSection';
import { ConfirmationScreen } from './BookingConfirmation';
import { ReceiptModal } from './ReceiptModal';
import { SupportFaqSection } from './TourFAQ';

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

interface TourBookingFormProps {
  initialTourId?: string | null;
  onReturnHome: () => void;
  currentUser?: any;
  setCurrentUser?: any;
}

export const TourBookingForm: React.FC<TourBookingFormProps> = ({
  initialTourId,
  onReturnHome,
  currentUser,
  setCurrentUser
}) => {
  const {
    showSaveProfileModal,
    activePolicy,
    selectedTour,
    setSelectedTour,
    bookingStep,
    setBookingStep,
    addOnsSelected,
    appliedDiscountCredits,
    creditSelection,
    creditError,
    creditSuccess,
    availableDomesticCredits,
    availableInternationalCredits,
    selectedDate,
    setSelectedDate,
    travelers,
    setTravelers,
    pickup,
    setPickup,
    appliedVoucher,
    setAppliedVoucher,
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
    specialRequests,
    setSpecialRequests,
    handleToggleAddOn,
    handleSelectCreditCategory,
    handleUpdateAppliedCredits,
    pricing,
    termsWarning,
    canProceed,
    handlePayNow,
    handleProceedWithPayment,
    handleSaveLater,
    handleResetBooking,
    validateTravelersBeforeStep,
    openPolicy,
    closePolicy
  } = useTourBookingState({ initialTourId, currentUser, setCurrentUser });

  if (bookingStage === 'processing') {
    return (
      <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col justify-center items-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="loader-ring mx-auto" />
          <h3 className="text-lg font-black uppercase tracking-wider text-amber-400">Processing Your Booking</h3>
          <p className="text-xs text-slate-400 font-mono animate-pulse">{processingStepText}</p>
        </div>
      </div>
    );
  }

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
          alert("Opening your saved itineraries list...");
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
                      className="text-xs font-black text-amber-600 hover:text-amber-700 underline cursor-pointer bg-transparent border-none"
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
                        className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md border-none"
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
                      className="text-xs font-black text-amber-600 hover:text-amber-700 underline cursor-pointer bg-transparent border-none"
                      disabled={bookingStep < 2}
                    >
                      Edit Step
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    <VoucherSection
                      appliedVoucher={appliedVoucher}
                      setAppliedVoucher={setAppliedVoucher}
                      subtotal={pricing.subtotalBeforeVoucher}
                    />

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
                            <div className="p-3.5 rounded-xl border border-emerald-250 bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                              <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                              <span>{creditSuccess}</span>
                            </div>
                          )}

                          {/* Credit Amount Input Slider */}
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="flex justify-between items-center mb-3">
                              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Number of Credits to Redeem</label>
                              <span className="text-sm font-black text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-sm">
                                {appliedDiscountCredits} Credit(s)
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={Math.min(travelers.length, creditSelection === 'domestic' ? availableDomesticCredits : availableInternationalCredits)}
                              value={appliedDiscountCredits}
                              onChange={(e) => handleUpdateAppliedCredits(parseInt(e.target.value, 10))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                              <span>0</span>
                              <span>Max: {Math.min(travelers.length, creditSelection === 'domestic' ? availableDomesticCredits : availableInternationalCredits)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="pt-5 border-t border-slate-100 flex justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStep(1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 text-slate-600 hover:text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStep(3);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md border-none"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: TRAVELER MANIFEST */}
              <div className={`bg-white border rounded-3xl transition-all duration-300 ${
                bookingStep === 3 ? 'border-amber-500 shadow-md p-6 sm:p-8' : 'border-slate-200 p-5 opacity-80'
              }`}>
                {bookingStep !== 3 ? (
                  <div className="flex justify-between items-center text-left">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase block tracking-wider">Step 3 — Completed</span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        Traveler Manifest ({travelers.length} {travelers.length === 1 ? 'Person' : 'People'})
                      </h4>
                      <span className="text-xs text-slate-500">
                        Lead: {travelers[0]?.firstName} {travelers[0]?.lastName}
                      </span>
                    </div>
                    <button
                      onClick={() => setBookingStep(3)}
                      className="text-xs font-black text-amber-600 hover:text-amber-700 underline cursor-pointer bg-transparent border-none"
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
                    <div className="pt-5 border-t border-slate-100 flex justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStep(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 text-slate-600 hover:text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
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
                        className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md border-none"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 4: PICKUP & EXTRAS */}
              <div className={`bg-white border rounded-3xl transition-all duration-300 ${
                bookingStep === 4 ? 'border-amber-500 shadow-md p-6 sm:p-8' : 'border-slate-200 p-5 opacity-80'
              }`}>
                {bookingStep !== 4 ? (
                  <div className="flex justify-between items-center text-left">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase block tracking-wider">Step 4 — Completed</span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">Pickup Logistics &amp; Upgrades</h4>
                      <span className="text-xs text-slate-500">
                        Pickup: {pickup.type === 'hotel' ? `Hotel (${pickup.hotelName})` : `Address (${pickup.city})`}
                      </span>
                    </div>
                    <button
                      onClick={() => setBookingStep(4)}
                      className="text-xs font-black text-amber-600 hover:text-amber-700 underline cursor-pointer bg-transparent border-none"
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
                    />

                    {/* Step Navigation Controls */}
                    <div className="pt-5 border-t border-slate-100 flex justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStep(3);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 text-slate-600 hover:text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStep(5);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md border-none"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 5: REVIEW & PAY */}
              <div className={`bg-white border rounded-3xl transition-all duration-300 ${
                bookingStep === 5 ? 'border-amber-500 shadow-md p-6 sm:p-8' : 'border-slate-200 p-5 opacity-80'
              }`}>
                {bookingStep === 5 && (
                  <div className="space-y-6 animate-fadeIn">
                    <PaymentSection
                      tour={selectedTour}
                      selectedDate={selectedDate}
                      travelers={travelers}
                      appliedVoucher={appliedVoucher}
                      pickup={pickup}
                      addOnsSelected={addOnsSelected}
                      pricing={pricing}
                      onJumpToStep={setBookingStep}
                      paymentDetails={paymentDetails}
                      setPaymentDetails={setPaymentDetails}
                      onPayNow={handlePayNow}
                      isProcessing={false}
                      processingStep={processingStepText}
                      canProceed={canProceed}
                      termsWarning={termsWarning}
                      agreedToTerms={agreedToTerms}
                      setAgreedToTerms={setAgreedToTerms}
                      agreedToPassport={agreedToPassport}
                      setAgreedToPassport={setAgreedToPassport}
                    />

                    {/* Step Navigation Controls */}
                    <div className="pt-5 border-t border-slate-100 flex justify-start">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStep(4);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 text-slate-600 hover:text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
                {bookingStep !== 5 && (
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-black uppercase block tracking-wider">Step 5</span>
                    <h4 className="font-bold text-sm text-slate-400 mt-1">Review &amp; Pay</h4>
                  </div>
                )}
              </div>

            </div>

            {/* Core Assurances Bar */}
            <div className="space-y-3 pt-4 border-t border-slate-200/80 text-left">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">BEDUINE Safe Travel Guarantees</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => openPolicy('Flexible Reschedule Guarantee', 'Need to shift dates? Reschedule your tour departure window without penalty up to 24 hours prior. Rescheduling vouchers remain valid for up to 24 months.')}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-350 shadow-sm flex items-start space-x-3.5 cursor-pointer transition-all"
                >
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Reschedule Guarantee</span>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-1">Change travel date up to 24h prior.</span>
                  </div>
                </div>

                <div
                  onClick={() => openPolicy('256-Bit SSL Checkout Security', 'All financial parameters and credit details are routed via verified PCI-DSS compliant secure socket channels. We do not store full CVV/card values on our servers.')}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-350 shadow-sm flex items-start space-x-3.5 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Secure Checkout</span>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-1">256-bit secure gateway connection.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support FAQ Section */}
            <SupportFaqSection />

          </div>

          {/* Right Column: Sticky Summary Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <PriceSummarySticky
              tour={selectedTour}
              pricing={pricing}
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

        {/* Profile Change Modal Overlay */}
        {showSaveProfileModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white rounded-[24px] p-6 max-w-sm w-full border border-slate-200/85 shadow-2xl text-left space-y-4 animate-fadeIn text-slate-800">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-amber-500 shrink-0" />
                <h4 className="font-bold text-base text-slate-900">Update Profile Details?</h4>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed">
                The lead traveler name or email you entered differs from your account details. Would you like to sync these changes to your traveler profile?
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleProceedWithPayment(true)}
                  className="flex-grow py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl cursor-pointer border-none"
                >
                  Yes, Update &amp; Pay
                </button>
                <button
                  onClick={() => handleProceedWithPayment(false)}
                  className="flex-grow py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-xl cursor-pointer border-none"
                >
                  No, Pay Only
                </button>
              </div>
            </div>
          </div>
        )}

        {/* General Policy Drawer Modal */}
        {activePolicy && (
          <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white rounded-[24px] p-6 max-w-md w-full border border-slate-200/85 shadow-2xl text-left space-y-4 animate-fadeIn text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-base text-slate-900">{activePolicy.title}</h4>
                <button
                  onClick={closePolicy}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer bg-transparent border-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed">{activePolicy.content}</p>
              <div className="pt-2 text-right">
                <button
                  onClick={closePolicy}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl cursor-pointer border-none"
                >
                  Close Policy
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
