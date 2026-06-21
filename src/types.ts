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

// Custom Tour Request Types
export type TripType = 'Domestic' | 'International';

export type HotelCategory =
  | 'Standard (2 Star)'
  | 'Deluxe (3 Star)'
  | 'Luxury Resort (5 Star)'
  | 'Heritage/Homestay'
  | 'Not Sure';

export type TransportPreference =
  | 'Sedan'
  | 'Premium SUV'
  | 'Luxury Traveler'
  | 'Flight Included'
  | 'Train Included'
  | 'None'
  | 'Not Sure';

export type MealPreference =
  | 'Breakfast Only'
  | 'Half Board (MAP)'
  | 'Full Board (AP)'
  | 'Veg Only'
  | 'None'
  | 'Not Sure';

export type TourActivity =
  | 'Sightseeing'
  | 'Adventure'
  | 'Wildlife Safari'
  | 'Trekking'
  | 'Shopping'
  | 'Food Tour'
  | 'Spa & Wellness';

export type CustomTourStatus =
  | 'Under Review'
  | 'Quotation Sent'
  | 'Revision Requested'
  | 'Quotation Accepted'
  | 'Payment Pending'
  | 'Payment Failed'
  | 'Confirmed Booking'
  | 'Cancelled'
  | 'Expired';

export interface EstimatedPriceRange {
  min: number;
  max: number;
  currency: 'INR';
  note: string;
  breakdown?: {
    basePrice: number;
    hotelSurcharge: number;
    transportSurcharge: number;
    mealSurcharge: number;
    extraNightsSurcharge: number;
    activitySurcharge: number;
    total: number;
  };
}

export interface CustomTourQuotation {
  id: string;
  requestId: string;
  version: number;
  totalPrice: number;
  currency: 'INR';
  hotelName: string;
  hotelCategory: HotelCategory;
  vehicleAssigned: string;
  mealsIncluded: string;
  itineraryDetails: string;
  inclusions: string[];
  exclusions: string[];
  paymentTerms: string;
  cancellationPolicy: string;
  validUntil: string;
  createdAt: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Revision Requested' | 'Expired';
}

export interface CustomTourRevision {
  id: string;
  requestId: string;
  quotationId?: string;
  message: string;
  createdAt: string;
  status: 'Open' | 'Resolved';
}

export interface CustomTourRequest {
  id: string;
  displayCode: string;
  userId?: string;
  userName?: string;
  tripType: TripType;
  destination: string;
  departureCity: string;
  flexibleDates: boolean;
  travelStartDate?: string;
  travelEndDate?: string;
  flexibleMonth?: string;
  durationNights: number;
  adults: number;
  children: number;
  childAges?: number[];
  rooms: number;
  hotelCategory: HotelCategory;
  transportPreference: TransportPreference;
  mealPreference: MealPreference;
  budget: number;
  currency: 'INR';
  activities: TourActivity[];
  specialRequirements?: string;
  phone: string;
  email: string;
  status: CustomTourStatus;
  submissionDate: string;
  updatedAt: string;
  estimatedPriceRange: EstimatedPriceRange;
  quotations: CustomTourQuotation[];
  currentQuotationId?: string;
  revisions: CustomTourRevision[];
  paymentStatus?: 'Not Started' | 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  bookingId?: string;
  voucherCode?: string;
}

