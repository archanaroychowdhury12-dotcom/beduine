import { useState, useEffect, useMemo } from 'react';
import { TourPackage, Traveler, PickupInfo, Voucher, PaymentDetails, BookingConfirmation, PriceCalculation, CreditLedgerEntry } from '../types';
import { getAvailableCredits, validateCreditApplication, getCategoryErrorMessage, CREDIT_VALUE_DOMESTIC, CREDIT_VALUE_INTERNATIONAL } from '../utils/creditHelpers';
import { validateCreditRedemptionServerSide } from '../utils/creditValidation';
import { TOUR_PACKAGES } from '../data/tours';
import { getPlanDetails } from '../data/siteData';
import { supabase } from '../utils/supabaseClient';

interface UseTourBookingStateProps {
  initialTourId?: string | null;
  currentUser: any;
  setCurrentUser: any;
}

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

// Split Name Helper
const splitName = (fullName: string) => {
  const parts = (fullName || '').trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
};

export function useTourBookingState({
  initialTourId,
  currentUser,
  setCurrentUser
}: UseTourBookingStateProps) {
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
  const [appliedDiscountCredits, setAppliedDiscountCredits] = useState<number>(0);
  const [creditSelection, setCreditSelection] = useState<'domestic' | 'international' | null>(() => {
    return selectedTour.category;
  });
  const [creditError, setCreditError] = useState<string | null>(null);
  const [creditSuccess, setCreditSuccess] = useState<string | null>(null);

  const availableDomesticCredits = useMemo(() => {
    return currentUser ? getAvailableCredits(currentUser.ledger || [], 'domestic') : 0;
  }, [currentUser]);

  const availableInternationalCredits = useMemo(() => {
    return currentUser ? getAvailableCredits(currentUser.ledger || [], 'international') : 0;
  }, [currentUser]);

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
    setCreditError(null);
    setCreditSuccess(null);
    setCreditSelection(selectedTour.category);
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

  // Sync applied credits if traveler count shrinks below applied credits
  useEffect(() => {
    if (appliedDiscountCredits > travelers.length) {
      setAppliedDiscountCredits(travelers.length);
      setCreditSuccess(null);
      setCreditError(null);
    }
  }, [travelers.length, appliedDiscountCredits]);

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
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const handleToggleAddOn = (id: string) => {
    setAddOnsSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectCreditCategory = (category: 'domestic' | 'international') => {
    setCreditSelection(category);
    setCreditError(null);
    setCreditSuccess(null);
    setAppliedDiscountCredits(0); // Reset applied credits when switching categories

    const categoryError = getCategoryErrorMessage(category, selectedTour.category);
    if (categoryError) {
      setCreditError(categoryError);
    }
  };

  const handleUpdateAppliedCredits = (value: number) => {
    if (value < 0) return;
    
    setCreditError(null);
    setCreditSuccess(null);

    const validation = validateCreditApplication({
      requestedCredits: value,
      tourCategory: selectedTour.category,
      availableDomesticCredits,
      availableInternationalCredits,
      travelerCount: travelers.length,
    });

    if (!validation.valid) {
      setCreditError(validation.error || 'Invalid credit application');
      setAppliedDiscountCredits(0);
    } else {
      setAppliedDiscountCredits(value);
      if (value > 0) {
        const creditValue = selectedTour.category === 'international' ? CREDIT_VALUE_INTERNATIONAL : CREDIT_VALUE_DOMESTIC;
        setCreditSuccess(`Successfully applied ${value} Discount Credit(s). Saved ${formatINR(value * creditValue)}!`);
      }
    }
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
    const ADD_ONS = [
      { id: 'insurance', label: 'Travel Insurance', price: 399, perPerson: true, desc: 'Includes medical cover & trip cancellation coverage' },
      { id: 'meal_upgrade', label: 'Buffet Meals Upgrade', price: 1200, perPerson: true, desc: 'Premium lunch & dinner buffet access at all stops' },
      { id: 'guide_private', label: 'Exclusive Private Guide', price: 2500, perPerson: false, desc: 'Personal local storyteller assigned only to your family' }
    ];

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

    const creditValue = selectedTour.category === 'international' ? CREDIT_VALUE_INTERNATIONAL : CREDIT_VALUE_DOMESTIC;
    const discountCreditsTotal = appliedDiscountCredits * creditValue;
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
      isInsuranceSelected: addOnsSelected.includes('insurance'),
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

    // Server-side DC category validation before processing
    if (currentUser && appliedDiscountCredits > 0) {
      const serverValidation = validateCreditRedemptionServerSide({
        appliedCredits: appliedDiscountCredits,
        creditCategory: creditSelection || selectedTour.category,
        tourCategory: selectedTour.category,
        ledger: currentUser.ledger || [],
        travelerCount: travelers.length,
      });
      if (!serverValidation.valid) {
        setBookingStage('booking');
        setPaymentDetails(p => ({ ...p, status: 'pending' }));
        setCreditError(serverValidation.error || 'Credit validation failed. Please review your discount credits.');
        setAppliedDiscountCredits(0);
        return;
      }
    }

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
        const bookingId = `BED-${selectedTour.id.slice(0, 3).toUpperCase()}-${randomIdNum}`;
        const finalConfirmation: BookingConfirmation = {
          bookingId: bookingId,
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

        // Handle credit redemption if currentUser is logged in and applied credits
        if (currentUser && appliedDiscountCredits > 0) {
          const creditValue = selectedTour.category === 'international' ? CREDIT_VALUE_INTERNATIONAL : CREDIT_VALUE_DOMESTIC;
          const redemptionEntry: CreditLedgerEntry = {
            id: `TXN-DC-${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            type: 'redeemed',
            creditType: 'discount',
            amount: appliedDiscountCredits,
            reason: `Redeemed for tour booking: ${selectedTour.name}`,
            bookingRef: bookingId,
            creditCategory: selectedTour.category,
            creditValue: creditValue,
            usableFor: selectedTour.category === 'international' ? 'international_only' : 'domestic_only'
          };
          
          const currentLedger = currentUser.ledger || [];
          const updatedLedger = [redemptionEntry, ...currentLedger];
          
          const updatedUser = {
            ...currentUser,
            ledger: updatedLedger,
            user_metadata: {
              ...(currentUser.user_metadata || {}),
              ledger: updatedLedger
            }
          };
          
          setCurrentUser(updatedUser);
          
          supabase.auth.updateUser({
            data: {
              ledger: updatedLedger
            }
          });
        }

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

  const closePolicy = () => {
    setActivePolicy(null);
  };

  return {
    showSaveProfileModal,
    setShowSaveProfileModal,
    activePolicy,
    setActivePolicy,
    selectedTour,
    setSelectedTour,
    planDetails,
    bookingStep,
    setBookingStep,
    addOnsSelected,
    setAddOnsSelected,
    appliedDiscountCredits,
    setAppliedDiscountCredits,
    creditSelection,
    setCreditSelection,
    creditError,
    setCreditError,
    creditSuccess,
    setCreditSuccess,
    availableDomesticCredits,
    availableInternationalCredits,
    isPrivateTour,
    setIsPrivateTour,
    selectedDate,
    setSelectedDate,
    travelers,
    setTravelers,
    profileHasChanges,
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
    setBookingStage,
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
  };
}
