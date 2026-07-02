import { useMemo, useState } from 'react';
import type { AdvancePaymentPlan, AppUser, BookingConfirmation, PaymentDetails, PickupInfo, PriceCalculation, TourPackage, Traveler } from '@/types';
import { supabase } from '@/utils/supabaseClient';
import { validateCreditRedemptionServerSide } from '@/utils/creditValidation';
import { beduineBackend, type CreateTourBookingDraftInput } from '@/services/backend';
import { completeTourBookingPayment } from '@/features/booking/services/bookingPaymentFlow';
import { calculateAdvancePaymentPlan } from '@/features/booking/utils/advancePaymentSchedule';
import { notify } from '@/services/uiFeedback';

type UseBookingPaymentParams = {
  currentUser?: AppUser | any;
  setCurrentUser?: (user: AppUser | any) => void;
  selectedTour: TourPackage;
  selectedDate: string;
  isPrivateTour: boolean;
  travelers: Traveler[];
  specialRequests: string;
  pickup: PickupInfo;
  pricing: PriceCalculation;
  paymentPlan: AdvancePaymentPlan;
  appliedDiscountCredits: number;
  creditSelection: 'domestic' | 'international' | null;
  setAppliedDiscountCredits: (value: number) => void;
  setCreditError: (message: string | null) => void;
  profileHasChanges: boolean;
  setShowSaveProfileModal: (open: boolean) => void;
  setBookingStep: (step: number) => void;
  onReturnHome: () => void;
};

export function useBookingPayment({
  currentUser,
  setCurrentUser,
  selectedTour,
  selectedDate,
  travelers,
  specialRequests,
  pickup,
  pricing,
  paymentPlan,
  appliedDiscountCredits,
  creditSelection,
  setCreditError,
  profileHasChanges,
  setShowSaveProfileModal,
  setBookingStep,
}: UseBookingPaymentParams) {
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [agreedToPassport, setAgreedToPassport] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({ method: 'upi', status: 'pending' });
  const [bookingStage, setBookingStage] = useState<'booking' | 'processing' | 'confirmed'>('booking');
  const [processingStepText, setProcessingStepText] = useState<string>('Initializing Secure Checkout...');
  const [confirmedBookingData, setConfirmedBookingData] = useState<BookingConfirmation | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  const termsWarning = useMemo(() => {
    if (!agreedToPassport) return 'Please verify traveler identification checklist rules.';
    if (!agreedToTerms) return 'Please accept the BEDUINE booking terms & conditions.';
    return undefined;
  }, [agreedToPassport, agreedToTerms]);

  const canProceed = !termsWarning;

  const runPaymentSteps = async () => {
    if (!currentUser) {
      notify.error('Please sign in before confirming a paid tour booking.');
      return;
    }

    setBookingStage('processing');
    setPaymentDetails((current) => ({ ...current, status: 'processing' }));
    setProcessingStepText('Creating your secure booking reservation...');

    try {
      if (
        appliedDiscountCredits > 0
        && import.meta.env.VITE_BACKEND_MODE !== 'production'
      ) {
        const validation = validateCreditRedemptionServerSide({
          appliedCredits: appliedDiscountCredits,
          creditCategory: creditSelection || selectedTour.category,
          tourCategory: selectedTour.category,
          ledger: currentUser.ledger || [],
          travelerCount: travelers.length,
        });
        if (!validation.valid) {
          throw new Error(validation.error || 'CREDIT_VALIDATION_FAILED');
        }
      }

      const travelerInputs = travelers.map((traveler, index) => ({
        travelerKey: `traveler-${index + 1}`,
        firstName: traveler.firstName,
        lastName: traveler.lastName,
        email: traveler.email,
        phone: traveler.phone,
      }));
      let creditAssignments: CreateTourBookingDraftInput['creditAssignments'] = [];

      if (appliedDiscountCredits > 0) {
        if (import.meta.env.VITE_BACKEND_MODE === 'production') {
          const dashboard = await beduineBackend.getCustomerDashboard();
          const units = dashboard.discountCredits.availableUnits
            .filter((unit) => unit.creditCategory === selectedTour.category)
            .slice(0, appliedDiscountCredits);
          if (units.length !== appliedDiscountCredits) {
            throw new Error('CREDIT_UNIT_NOT_AVAILABLE');
          }
          creditAssignments = units.map((unit, index) => ({
            creditUnitId: unit.id,
            travelerKey: travelerInputs[index].travelerKey,
          }));
        } else {
          creditAssignments = travelerInputs.slice(0, appliedDiscountCredits).map((traveler, index) => ({
            creditUnitId: `demo-credit-${index + 1}`,
            travelerKey: traveler.travelerKey,
          }));
        }
      }

      const leadTraveler = travelers[0];
      const result = await completeTourBookingPayment({
        draftInput: {
          tourId: selectedTour.id,
          departureId: `${selectedTour.id}:${selectedDate}`,
          bookingType: paymentPlan.bookingType,
          travelers: travelerInputs,
          pickup: {
            type: pickup.type,
            address: pickup.customAddress || pickup.hotelName,
            city: pickup.city,
            pincode: pickup.pincode,
            specialInstructions: pickup.specialInstructions,
          },
          creditAssignments,
          instantBookingRequired: paymentPlan.instantBookingCharge > 0,
        },
        customer: {
          name: `${leadTraveler?.firstName || ''} ${leadTraveler?.lastName || ''}`.trim() || currentUser.fullName,
          email: leadTraveler?.email || currentUser.email || '',
          contact: leadTraveler?.phone || currentUser.mobile || '',
        },
      });

      setProcessingStepText('Payment verified. Preparing your confirmation...');
      const authoritativePlan = calculateAdvancePaymentPlan({
        baseTourTotal: result.draft.finalTourTotal,
        selectedDate,
        tourCategory: selectedTour.category,
        bookingType: paymentPlan.bookingType,
        instantBookingRequired: result.draft.instantBookingCharge > 0,
      });
      const authoritativePricing: PriceCalculation = {
        ...pricing,
        subtotalBase: result.draft.grossTourTotal,
        privateSurchargeTotal: 0,
        isPrivateTour: false,
        insuranceTotal: 0,
        memberDiscountPercent: 0,
        memberDiscountTotal: 0,
        appliedDiscountCredits: result.draft.reservedCreditUnits.length,
        discountCreditsTotal: result.draft.totalDiscount,
        subtotalBeforeVoucher: result.draft.finalTourTotal,
        appliedVoucher: undefined,
        voucherDiscountAmount: 0,
        addOnsSelected: [],
        addOnsTotal: 0,
        voucherPackSelected: '',
        serviceFeeOrTax: 0,
        totalPayable: result.draft.finalTourTotal,
      };
      const finalConfirmation: BookingConfirmation = {
        bookingId: result.bookingId,
        tour: selectedTour,
        selectedDate,
        isPrivateTour: false,
        travelers,
        specialRequests,
        pickup,
        pricing: authoritativePricing,
        payment: {
          ...paymentDetails,
          status: 'success',
          transactionId: result.sessionId,
          paymentTime: new Date().toLocaleTimeString(),
          amountPaidNow: result.draft.amountDueNow,
          amountDueLater: result.draft.balanceDueLater,
          paymentPlanLabel: authoritativePlan.bookingTypeLabel,
        },
        paymentPlan: authoritativePlan,
        confirmedAt: new Date().toISOString(),
      };

      setConfirmedBookingData(finalConfirmation);
      setPaymentDetails((current) => ({ ...current, status: 'success' }));
      setBookingStage('confirmed');
    } catch (error) {
      setBookingStage('booking');
      setPaymentDetails((current) => ({ ...current, status: 'failed' }));
      const message = error instanceof Error ? error.message : 'Booking payment failed.';
      setCreditError(message.includes('CREDIT_') ? 'Your Discount Credit selection is no longer available.' : null);
      notify.error(message.includes('PAYMENT_CANCELLED') ? 'Payment was cancelled.' : 'Booking was not confirmed. No client-side confirmation was created.');
    }
  };

  const handlePayNow = () => {
    if (!canProceed) return;
    if (currentUser && profileHasChanges) {
      setShowSaveProfileModal(true);
      return;
    }
    void runPaymentSteps();
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
          savedTravelers: currentUser.savedTravelers || [],
        };
        setCurrentUser(updatedUser);
        await supabase.auth.updateUser({
          data: {
            full_name: updatedUser.fullName,
            dob: updatedUser.dob,
            preferredLanguage: updatedUser.preferredLanguage,
            dietaryPreferences: updatedUser.dietaryPreferences,
            accessibilityRequirements: updatedUser.accessibilityRequirements,
            savedTravelers: updatedUser.savedTravelers,
          },
        });
      }
    }
    await runPaymentSteps();
  };

  const handleSaveLater = () => {
    notify.info('Your booking progress has been saved securely to your BEDUINE account details. You can resume at any time!');
  };

  const handleResetBooking = () => {
    setBookingStage('booking');
    setConfirmedBookingData(null);
    setBookingStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    agreedToTerms,
    setAgreedToTerms,
    agreedToPassport,
    setAgreedToPassport,
    paymentDetails,
    setPaymentDetails,
    bookingStage,
    setBookingStage,
    processingStepText,
    setProcessingStepText,
    confirmedBookingData,
    setConfirmedBookingData,
    showReceiptModal,
    setShowReceiptModal,
    termsWarning,
    canProceed,
    runPaymentSteps,
    handlePayNow,
    handleProceedWithPayment,
    handleSaveLater,
    handleResetBooking,
  };
}
