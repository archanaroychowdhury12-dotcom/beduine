export interface ItineraryDay {
  day: number;
  title: string;
  time: string;
  description: string;
  highlights: string[];
}

export interface TourPackage {
  id: string;
  name: string;
  destination: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  rating: number;
  reviewCount: number;
  availableDates: string[];
  image: string;
  gallery: string[];
  shortSummary: string;
  overview: string;
  itinerary: ItineraryDay[];
  placesCovered: string[];
  included: string[];
  notIncluded: string[];
  groupSize: {
    min: number;
    max: number;
    privateOptionAvailable: boolean;
    privateSurchargePerPerson: number;
  };
  languages: string[];
  guideExpertise: string;
  difficultyLevel: 'Easy' | 'Moderate' | 'Challenging';
  bestFor: string[];
}

export interface Traveler {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isLead: boolean;
  ageGroup: 'Adult' | 'Child' | 'Senior' | 'Infant';
  passportNumber?: string;
  dob?: string;
  preferredLanguage?: string;
  dietaryPreferences?: string;
  accessibilityRequirements?: string;
  gender?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  saveToProfile?: boolean;
}

export interface Voucher {
  code: string;
  type: 'fixed' | 'percentage';
  value: number; // e.g. 50 ($50) or 15 (15%)
  minSpend?: number;
  status: 'active' | 'expired' | 'used';
  description: string;
}

export interface PickupInfo {
  type: 'hotel' | 'manual' | 'none' | 'assistance';
  hotelName?: string;
  customAddress?: string;
  landmark?: string;
  city?: string;
  pincode?: string;
  dropoffDifferent: boolean;
  dropoffType?: 'hotel' | 'manual' | 'same';
  dropoffLocation?: string;
  specialInstructions?: string;
}

export interface PriceCalculation {
  basePricePerPerson: number;
  travelerCount: number;
  subtotalBase: number;
  isPrivateTour: boolean;
  privateSurchargeTotal: number;
  isInsuranceSelected?: boolean;
  insuranceTotal?: number;
  memberDiscountPercent?: number;
  memberDiscountTotal?: number;
  appliedDiscountCredits?: number;
  discountCreditsTotal?: number;
  subtotalBeforeVoucher: number;
  appliedVoucher?: Voucher;
  voucherDiscountAmount: number;
  addOnsSelected?: string[];
  addOnsTotal?: number;
  voucherPackSelected?: string;
  voucherPackDiscount?: number;
  serviceFeeOrTax: number;
  totalPayable: number;
}

export interface PaymentDetails {
  method: 'credit_card' | 'paypal' | 'apple_pay' | 'bank_wire';
  cardNumberLast4?: string;
  cardHolder?: string;
  paypalEmail?: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  transactionId?: string;
  paymentTime?: string;
}

export interface BookingConfirmation {
  bookingId: string;
  tour: TourPackage;
  selectedDate: string;
  isPrivateTour: boolean;
  travelers: Traveler[];
  specialRequests?: string;
  pickup: PickupInfo;
  pricing: PriceCalculation;
  payment: PaymentDetails;
  confirmedAt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'Booking & Vouchers' | 'Tours & Itinerary' | 'Pickup & Logistics' | 'Cancellations & Refunds';
}

export interface DestinationCard {
  id: string;
  name: string;
  country: string;
  tourCount: number;
  image: string;
  tagline: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  comment: string;
  tourName: string;
  rating: number;
  date: string;
}
