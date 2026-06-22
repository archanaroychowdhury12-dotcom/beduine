import React, { useState, useEffect, useMemo } from 'react';
import { TourPackage, Traveler, PickupInfo, Voucher, PaymentDetails, BookingConfirmation, PriceCalculation } from '../../types';
import { TOUR_PACKAGES } from '../../data/tours';
import { getPlanDetails } from '../../data/siteData';
import { ChevronRight, Check, Clock, X, User, ShieldCheck } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

// Child Component imports
import { BookingPortalHeader } from './BookingPortalHeader';
import { TourSelection } from './TourSelection';
import { TravelerInfoSection } from './TravelerInfoForm';
import { PickupSection, ADD_ONS } from './PickupDropoffForm';
import { VoucherSection } from './VoucherCouponPanel';
import { PriceSummarySticky } from './PriceSummary';
import { PaymentSection } from './PaymentSection';
import { ConfirmationScreen } from './BookingConfirmation';
import { ReceiptModal } from './ReceiptModal';
import { SupportFaqSection } from './TourFAQ';

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
  
  // Save Profile modal trigger
  const [showSaveProfileModal, setShowSaveProfileModal] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<{ title: string; content: string } | null>(null);

  // Split Name Helper
  const splitName = (fullName: string) => {
    const parts = (fullName || '').trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    return { firstName, lastName };
  };

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
  const [appliedDiscountCredits, setAppliedDiscountCredits] = useState<number>(0);

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
    setAppliedDiscountCredits(0);
  }, [selectedTour]);

  // Lead Traveler + co-travelers manifest
  const [travelers, setTravelers] = useState<Traveler[]>([
    {
      firstName: 'Rahul',
      lastName: 'Sen',
      email: 'rahul.sen@example.com',
      phone: '+91 98765 43210',
      isLead: true,
      ageGroup: 'Adult'
    }
  ]);

  // Prefill lead traveler from currentUser when logged in
  useEffect(() => {
    if (currentUser) {
      const { firstName, lastName } = splitName(currentUser.fullName);
      setTravelers(prev => {
        const lead = prev[0];
        const isDefault = lead && lead.firstName === 'Rahul' && lead.lastName === 'Sen' && lead.email === 'rahul.sen@example.com';
        const isEmpty = !lead || (!lead.firstName && !lead.lastName && !lead.email);
        
        if (isDefault || isEmpty) {
          const updated = [...prev];
          updated[0] = {
            firstName: firstName || lead?.firstName || '',
            lastName: lastName || lead?.lastName || '',
            email: currentUser.email || lead?.email || '',
            phone: currentUser.mobile || lead?.phone || '',
            isLead: true,
            ageGroup: 'Adult',
            dob: currentUser.dob || '',
            preferredLanguage: currentUser.preferredLanguage || 'English',
            dietaryPreferences: currentUser.dietaryPreferences || 'None',
            accessibilityRequirements: currentUser.accessibilityRequirements || 'None',
            gender: 'Male'
          };
          return updated;
        }
        return prev;
      });
    }
  }, [currentUser]);

  // Check if lead traveler details changed compared to currentUser profile
  const profileHasChanges = useMemo(() => {
    if (!currentUser) return false;
    const lead = travelers[0];
    if (!lead) return false;

    const parts = (currentUser.fullName || '').trim().split(/\s+/);
    const initialFirst = parts[0] || '';
    const initialLast = parts.slice(1).join(' ') || '';

    return (
      lead.firstName !== initialFirst ||
      lead.lastName !== initialLast ||
      lead.email !== currentUser.email ||
      lead.phone !== currentUser.mobile
    );
  }, [currentUser, travelers]);

  // Chauffeur Pickup State
  const [pickup, setPickup] = useState<PickupInfo>({
    type: 'hotel',
    hotelName: 'BEDUINE Kolkata Assistance Desk',
    customAddress: '',
    landmark: '',
    city: 'Kolkata',
    pincode: '700001',
    dropoffDifferent: false,
    dropoffLocation: '',
    specialInstructions: 'Please call before pickup confirmation.'
  });

  // Update default pickup hotel if tour destination changes
  useEffect(() => {
    if (selectedTour.destination.includes('Sundarbans') || selectedTour.destination.includes('Puri')) {
      setPickup(p => ({ ...p, hotelName: 'BEDUINE Kolkata Assistance Desk', city: 'Kolkata' }));
    } else if (selectedTour.destination.includes('Darjeeling')) {
      setPickup(p => ({ ...p, hotelName: 'NJP Railway Station Pickup Point', city: 'Siliguri' }));
    } else if (selectedTour.destination.includes('Kashmir')) {
      setPickup(p => ({ ...p, hotelName: 'Srinagar Airport Pickup Point', city: 'Srinagar' }));
    } else if (selectedTour.destination.includes('Dubai')) {
      setPickup(p => ({ ...p, hotelName: 'Dubai International Airport Arrival Gate', city: 'Dubai' }));
    } else if (selectedTour.destination.includes('Thailand')) {
      setPickup(p => ({ ...p, hotelName: 'Bangkok Airport Arrival Gate', city: 'Bangkok' }));
    }
  }, [selectedTour]);

  // Voucher state
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | undefined>(undefined);

  // Policy & Terms agreement state
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [agreedToPassport, setAgreedToPassport] = useState<boolean>(false);

  // Payment Details State
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'credit_card',
    status: 'pending'
  });

  // Flow Stage State
  const [bookingStage, setBookingStage] = useState<'booking' | 'processing' | 'confirmed'>('booking');
  const [processingStepText, setProcessingStepText] = useState<string>('Initializing Secure Checkout...');
  const [confirmedBookingData, setConfirmedBookingData] = useState<BookingConfirmation | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  const handleToggleAddOn = (id: string) => {
    setAddOnsSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Live Price Calculations
  const pricing: PriceCalculation = useMemo(() => {
    const basePricePerPerson = selectedTour.basePrice;
    const travelerCount = travelers.length;
    const subtotalBase = basePricePerPerson * travelerCount;
    
    // Private upgrade surcharge if enabled
    const privateSurchargeTotal = isPrivateTour ? (selectedTour.groupSize.privateSurchargePerPerson * travelerCount) : 0;

    // Calculate Member Discount (Up to 5% / 7% / 10% off base)
    let memberDiscountPercent = 0;
    if (planDetails) {
      const discountText = planDetails.paidDiscount || '';
      const match = discountText.match(/\d+/);
      if (match) {
        memberDiscountPercent = parseInt(match[0], 10);
      }
    }
    const memberDiscountTotal = Math.round((subtotalBase * memberDiscountPercent) / 100);

    // Calculate Add-ons cost
    let addOnsTotal = 0;
    let insuranceTotal = 0;
    let isInsuranceSelected = addOnsSelected.includes('insurance');

    ADD_ONS.forEach((addon: any) => {
      if (addOnsSelected.includes(addon.id)) {
        if (addon.id === 'insurance') {
          // Standard: ₹399/person. Gold: 50% off. Platinum: Free.
          const baseInsurance = 399;
          let rate = baseInsurance;
          if (planDetails) {
            const rule = ((planDetails as any).insurance || '').toLowerCase();
            if (rule.includes('free') || rule.includes('included')) rate = 0;
            else if (rule.includes('50%')) rate = Math.round(baseInsurance / 2);
          }
          insuranceTotal = rate * travelerCount;
        } else {
          addOnsTotal += addon.perPerson ? addon.price * travelerCount : addon.price;
        }
      }
    });

    const discountCreditsTotal = appliedDiscountCredits * 500;
    const subtotalBeforeVoucher = Math.max(0, subtotalBase + privateSurchargeTotal + addOnsTotal + insuranceTotal - memberDiscountTotal - discountCreditsTotal);

    let voucherDiscountAmount = 0;
    let voucherPackSelected = '';
    if (appliedVoucher) {
      if (appliedVoucher.code.startsWith('PACK-')) {
        voucherPackSelected = appliedVoucher.code.replace('PACK-', '');
      }
      if (appliedVoucher.type === 'fixed') {
        voucherDiscountAmount = appliedVoucher.value;
      } else if (appliedVoucher.type === 'percentage') {
        voucherDiscountAmount = Math.round((subtotalBeforeVoucher * appliedVoucher.value) / 100);
      }
    }

    // Ensure discount never exceeds total
    voucherDiscountAmount = Math.min(voucherDiscountAmount, subtotalBeforeVoucher);

    const subtotalAfterVoucher = subtotalBeforeVoucher - voucherDiscountAmount;
    const serviceFeeOrTax = Math.round(subtotalAfterVoucher * 0.05); // 5% fee
    const totalPayable = subtotalAfterVoucher + serviceFeeOrTax;

    return {
      basePricePerPerson,
      travelerCount,
      subtotalBase,
      isPrivateTour,
      privateSurchargeTotal,
      isInsuranceSelected,
      insuranceTotal,
      memberDiscountPercent,
      memberDiscountTotal,
      appliedDiscountCredits,
      discountCreditsTotal,
      subtotalBeforeVoucher,
      appliedVoucher,
      voucherDiscountAmount,
      addOnsSelected,
      addOnsTotal,
      voucherPackSelected,
      serviceFeeOrTax,
      totalPayable
    };
  }, [selectedTour, isPrivateTour, travelers, appliedVoucher, planDetails, addOnsSelected, appliedDiscountCredits]);

  // Validation before payments
  const termsWarning = useMemo(() => {
    if (!agreedToPassport) return 'Please verify traveler identification checklist rules.';
    if (!agreedToTerms) return 'Please accept the BEDUINE booking terms & conditions.';
    return undefined;
  }, [agreedToPassport, agreedToTerms]);

  const canProceed = !termsWarning;

  const runPaymentSteps = () => {
    setBookingStage('processing');
    setPaymentDetails(p => ({ ...p, status: 'processing' }));

    const steps = [
      'Authenticating secure BEDUINE payment transmission...',
      'Verifying traveler roster details and voucher codes...',
      'Allocating tour guide and reserving vehicle plan...',
      'Preparing pickup logistics handoff details...',
      'Payment successful! Generating booking receipt...'
    ];

    let stepIdx = 0;
    setProcessingStepText(steps[0]);

    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setProcessingStepText(steps[stepIdx]);
      } else {
        clearInterval(interval);
        
        const randomIdNum = Math.floor(10000 + Math.random() * 90000);
        const finalConfirmation: BookingConfirmation = {
          bookingId: `BED-${selectedTour.id.slice(0, 3).toUpperCase()}-${randomIdNum}`,
          tour: selectedTour,
          selectedDate,
          isPrivateTour,
          travelers,
          specialRequests,
          pickup,
          pricing,
          payment: {
            ...paymentDetails,
            status: 'success',
            transactionId: `BED-TXN-${randomIdNum}`,
            paymentTime: new Date().toLocaleTimeString()
          },
          confirmedAt: new Date().toISOString()
        };

        setConfirmedBookingData(finalConfirmation);
        setBookingStage('confirmed');
      }
    }, 1200);
  };

  const handlePayNow = () => {
    if (!canProceed) return;
    if (currentUser && profileHasChanges) {
      setShowSaveProfileModal(true);
    } else {
      runPaymentSteps();
    }
  };

  const handleProceedWithPayment = async (saveToProfile: boolean) => {
    setShowSaveProfileModal(false);

    if (saveToProfile && currentUser && setCurrentUser) {
      const lead = travelers[0];
      if (lead) {
        const updatedUser = {
          ...currentUser,
          fullName: `${lead.firstName} ${lead.lastName}`.trim(),
          email: lead.email,
          mobile: lead.phone,
          dob: lead.dob || '',
          preferredLanguage: lead.preferredLanguage || 'English',
          dietaryPreferences: lead.dietaryPreferences || 'None',
          accessibilityRequirements: lead.accessibilityRequirements || 'None',
          savedTravelers: currentUser.savedTravelers || []
        };
        setCurrentUser(updatedUser);

        // Sync updates directly to the Supabase cloud session
        await supabase.auth.updateUser({
          data: {
            full_name: updatedUser.fullName,
            dob: updatedUser.dob,
            preferredLanguage: updatedUser.preferredLanguage,
            dietaryPreferences: updatedUser.dietaryPreferences,
            accessibilityRequirements: updatedUser.accessibilityRequirements,
            savedTravelers: updatedUser.savedTravelers
          }
        });
      }
    }
    runPaymentSteps();
  };

  const handleSaveLater = () => {
    alert("Your booking progress has been saved securely to your BEDUINE account details. You can resume at any time!");
  };

  const handleResetBooking = () => {
    setBookingStage('booking');
    setConfirmedBookingData(null);
    setBookingStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validate fields in traveler cards before moving from Step 3 to Step 4
  const validateTravelersBeforeStep = () => {
    for (let i = 0; i < travelers.length; i++) {
      const t = travelers[i];
      if (!t.firstName || !t.firstName.trim() || !t.lastName || !t.lastName.trim()) {
        alert(`Please complete the name details for Traveler ${i + 1} first.`);
        return false;
      }
      if (i === 0) {
        if (!t.email || !t.email.trim() || !t.phone || !t.phone.trim()) {
          alert('Please enter lead traveler email and phone number contact details.');
          return false;
        }
      }
    }
    return true;
  };

  const openPolicy = (title: string, content: string) => {
    setActivePolicy({ title, content });
  };

  const [specialRequests, setSpecialRequests] = useState<string>('');

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
                      </h4>
                      {appliedVoucher && <span className="text-xs text-emerald-700 font-bold">Saved {appliedVoucher.type === 'percentage' ? `${appliedVoucher.value}%` : formatINR(appliedVoucher.value)}</span>}
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
                    <VoucherSection
                      appliedVoucher={appliedVoucher}
                      setAppliedVoucher={setAppliedVoucher}
                      subtotal={pricing.subtotalBeforeVoucher}
                    />

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

            {/* Policy & Trust Cards Section */}
            <div className="pt-10 border-t border-slate-200 text-left">
              <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">BEDUINE Safe Travel Policy Guarantees</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div
                  onClick={() => openPolicy('Free Cancellation Policy', 'Cancel your booking up to 48 hours prior to the scheduled departure time to get a full 100% cash refund returned to your bank account with zero service fee deduction.')}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-350 shadow-sm flex items-start space-x-3.5 cursor-pointer transition-all"
                >
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Free Cancellation</span>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-1">Full refund up to 48h prior.</span>
                  </div>
                </div>

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

            {/* Support FAQ Section (Rendered inside Wizard for accessibility) */}
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
              <p className="text-xs text-slate-600 leading-relaxed">
                The lead traveler name or email you entered differs from your account details. Would you like to sync these changes to your traveler profile?
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleProceedWithPayment(true)}
                  className="flex-grow py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
                >
                  Yes, Update & Pay
                </button>
                <button
                  onClick={() => handleProceedWithPayment(false)}
                  className="flex-grow py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-xl cursor-pointer"
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
                  onClick={() => setActivePolicy(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed">{activePolicy.content}</p>
              <div className="pt-2 text-right">
                <button
                  onClick={() => setActivePolicy(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
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
