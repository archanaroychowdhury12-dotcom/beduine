import React from 'react';
import { useTourBookingState } from '../../hooks/useTourBookingState';
import { ChevronRight, Check, Clock, X, Crown } from 'lucide-react';
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

// New Subcomponents
import { BookingStepper } from './BookingStepper';
import { BookingSafeGuarantees } from './BookingSafeGuarantees';
import { ProfileSyncModal } from './ProfileSyncModal';
import { PolicyDrawerModal } from './PolicyDrawerModal';

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

        {/* 5-Step Stepper Progress Bar */}
        <BookingStepper bookingStep={bookingStep} />

        {/* Main Dual-Column Wizard Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Progressive Steps Panel */}
          <div className="lg:col-span-8 space-y-6">
            
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
            <BookingSafeGuarantees openPolicy={openPolicy} />

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

        {/* Profile Sync Modal Overlay */}
        <ProfileSyncModal show={showSaveProfileModal} onConfirm={handleProceedWithPayment} />

        {/* General Policy Drawer Modal */}
        <PolicyDrawerModal activePolicy={activePolicy} onClose={closePolicy} />

      </div>
    </div>
  );
};
