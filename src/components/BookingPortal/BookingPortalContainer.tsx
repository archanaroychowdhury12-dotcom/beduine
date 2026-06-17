import React, { useState, useEffect, useMemo } from 'react';
import { TourPackage, Traveler, PickupInfo, Voucher, PaymentDetails, BookingConfirmation, PriceCalculation } from '../../types';
import { TOUR_PACKAGES } from '../../data/tours';

// Child Component imports
import { PageIntro } from './PageIntro';
import { TourSelection } from './TourSelection';
import { TourDetailsSection } from './TourDetailsSection';
import { TravelerInfoSection } from './TravelerInfoSection';
import { PickupSection } from './PickupSection';
import { VoucherSection } from './VoucherSection';
import { PriceSummarySticky } from './PriceSummarySticky';
import { BookingPolicySection } from './BookingPolicySection';
import { PaymentSection } from './PaymentSection';
import { ConfirmationScreen } from './ConfirmationScreen';
import { ReceiptModal } from './ReceiptModal';
import { SupportFaqSection } from './SupportFaqSection';

interface BookingPortalContainerProps {
  initialTourId?: string | null;
  onReturnHome: () => void;
}

export const BookingPortalContainer: React.FC<BookingPortalContainerProps> = ({ initialTourId, onReturnHome }) => {
  // 1. Tour Selection State
  const [selectedTour, setSelectedTour] = useState<TourPackage>(() => {
    if (initialTourId) {
      const found = TOUR_PACKAGES.find(t => t.id === initialTourId);
      if (found) return found;
    }
    return TOUR_PACKAGES[0];
  });

  // Whenever initialTourId prop changes, update selectedTour
  useEffect(() => {
    if (initialTourId) {
      const found = TOUR_PACKAGES.find(t => t.id === initialTourId);
      if (found) {
        setSelectedTour(found);
      }
    }
  }, [initialTourId]);

  // 2. Private VIP Upgrade State
  const [isPrivateTour, setIsPrivateTour] = useState<boolean>(false);

  // 3. Date Selection State
  const [selectedDate, setSelectedDate] = useState<string>(selectedTour.availableDates[0]);

  // Update selected Date if Tour changes
  useEffect(() => {
    setSelectedDate(selectedTour.availableDates[0]);
    setIsPrivateTour(false);
  }, [selectedTour]);

  // 4. Travelers Manifest State
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

  // 5. Special Requests State
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // 6. Chauffeur Pickup State
  const [pickup, setPickup] = useState<PickupInfo>({
    type: 'hotel',
    hotelName: 'BEDUINE Kolkata Assistance Desk',
    customAddress: '',
    dropoffDifferent: false,
    dropoffLocation: '',
    specialInstructions: 'Please call before pickup confirmation.'
  });

  // Update default pickup hotel if tour destination changes
  useEffect(() => {
    if (selectedTour.destination.includes('Sundarbans') || selectedTour.destination.includes('Puri')) {
      setPickup(p => ({ ...p, hotelName: 'BEDUINE Kolkata Assistance Desk' }));
    } else if (selectedTour.destination.includes('Darjeeling')) {
      setPickup(p => ({ ...p, hotelName: 'NJP Railway Station Pickup Point' }));
    } else if (selectedTour.destination.includes('Kashmir')) {
      setPickup(p => ({ ...p, hotelName: 'Srinagar Airport Pickup Point' }));
    } else if (selectedTour.destination.includes('Dubai')) {
      setPickup(p => ({ ...p, hotelName: 'Dubai International Airport Arrival Gate' }));
    } else if (selectedTour.destination.includes('Thailand')) {
      setPickup(p => ({ ...p, hotelName: 'Bangkok Airport Arrival Gate' }));
    }
  }, [selectedTour]);

  // 7. Voucher/Promo State
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | undefined>(undefined);

  // 8. Policy & Terms agreement state
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [agreedToPassport, setAgreedToPassport] = useState<boolean>(true);

  // 9. Payment Details State
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: 'credit_card',
    status: 'pending'
  });

  // 10. Flow Stage State
  const [bookingStage, setBookingStage] = useState<'booking' | 'processing' | 'confirmed'>('booking');
  const [processingStepText, setProcessingStepText] = useState<string>('Initializing Secure 256-Bit Gateway...');
  const [confirmedBookingData, setConfirmedBookingData] = useState<BookingConfirmation | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // Live Price Calculations Memo
  const pricing: PriceCalculation = useMemo(() => {
    const basePricePerPerson = selectedTour.basePrice;
    const travelerCount = travelers.length;
    const subtotalBase = basePricePerPerson * travelerCount;
    const privateSurchargeTotal = isPrivateTour ? (selectedTour.groupSize.privateSurchargePerPerson * travelerCount) : 0;
    const subtotalBeforeVoucher = subtotalBase + privateSurchargeTotal;

    let voucherDiscountAmount = 0;
    if (appliedVoucher) {
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
      subtotalBeforeVoucher,
      appliedVoucher,
      voucherDiscountAmount,
      serviceFeeOrTax,
      totalPayable
    };
  }, [selectedTour, isPrivateTour, travelers, appliedVoucher]);

  // Validation Check before processing
  const termsWarning = useMemo(() => {
    if (!agreedToPassport) return 'You must confirm that all travelers have valid ID or passport details as required for this package.';
    if (!agreedToTerms) return 'You must accept BEDUINE booking terms, cancellation rules, and vendor policy before payment.';
    return undefined;
  }, [agreedToPassport, agreedToTerms]);

  const canProceed = !termsWarning;

  // Handle Pay Now simulated execution
  const handlePayNow = () => {
    if (!canProceed) return;

    setBookingStage('processing');
    setPaymentDetails(p => ({ ...p, status: 'processing' }));

    const steps = [
      'Authenticating secure BEDUINE payment transmission...',
      'Verifying traveler details and voucher eligibility...',
      'Reserving tour package, hotel slots, and vehicle plan...',
      'Preparing pickup and operations handoff...',
      'Payment successful. Generating BEDUINE booking receipt...'
    ];

    let currentStepIdx = 0;
    setProcessingStepText(steps[0]);

    const interval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setProcessingStepText(steps[currentStepIdx]);
      } else {
        clearInterval(interval);
        
        // Build final Confirmation Data
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

  const handleResetBooking = () => {
    setBookingStage('booking');
    setConfirmedBookingData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBookingScroll = () => {
    const el = document.getElementById('step-2');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (bookingStage === 'confirmed' && confirmedBookingData) {
    return (
      <div className="bg-slate-50 min-h-screen pt-24 pb-16">
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
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Section 1: Page Intro */}
      <PageIntro onStartBooking={handleStartBookingScroll} />

      {/* Main Dual-Column Live Interactive Portal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Interactive Stages (Sections 2 to 9, plus 11) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Section 2: Tour Selection */}
            <TourSelection
              selectedTourId={selectedTour.id}
              onSelectTour={(t) => setSelectedTour(t)}
            />

            {/* Section 3: Tour Details & Specs */}
            <TourDetailsSection
              tour={selectedTour}
              isPrivateTour={isPrivateTour}
              setIsPrivateTour={setIsPrivateTour}
            />

            {/* Section 4: Date & Traveler Info */}
            <TravelerInfoSection
              availableDates={selectedTour.availableDates}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              travelers={travelers}
              setTravelers={setTravelers}
              specialRequests={specialRequests}
              setSpecialRequests={setSpecialRequests}
              maxGroupLimit={selectedTour.groupSize.max}
            />

            {/* Section 5: Pickup and Drop-off */}
            <PickupSection
              pickup={pickup}
              setPickup={setPickup}
              destinationName={selectedTour.destination}
            />

            {/* Section 6: Voucher / Promo code */}
            <VoucherSection
              appliedVoucher={appliedVoucher}
              setAppliedVoucher={setAppliedVoucher}
              subtotal={pricing.subtotalBeforeVoucher}
            />

            {/* Section 8: Booking Policy */}
            <BookingPolicySection
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              agreedToPassport={agreedToPassport}
              setAgreedToPassport={setAgreedToPassport}
            />

            {/* Section 9: Payment gateway */}
            <PaymentSection
              paymentDetails={paymentDetails}
              setPaymentDetails={setPaymentDetails}
              onPayNow={handlePayNow}
              totalPayable={pricing.totalPayable}
              isProcessing={bookingStage === 'processing'}
              processingStep={processingStepText}
              canProceed={canProceed}
              termsWarning={termsWarning}
            />

            {/* Section 11: Support / FAQ */}
            <SupportFaqSection />
          </div>

          {/* Right Column: Sticky Price Summary (Section 7) */}
          <div className="lg:col-span-4 print:hidden">
            <PriceSummarySticky
              tour={selectedTour}
              pricing={pricing}
              selectedDate={selectedDate}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
