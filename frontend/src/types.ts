// === Subscription & Credit Types ===
export type TripCategory = 'domestic' | 'international';

export interface CreditLedgerEntry {
  id: string;
  date: string;
  type: 'issued' | 'reserved' | 'redeemed' | 'reversed' | 'expired' | 'admin_adjustment';
  creditType: 'lucky_draw' | 'discount';
  amount: number;
  reason: string;
  bookingRef?: string;
  adminRef?: string;
  source?: 'demo' | 'real';
  creditCategory: 'domestic' | 'international' | 'travel_winner benefit';
  creditValue: number;
  usableFor: 'domestic_only' | 'international_only' | 'lucky_draw';
}

// === Plan Data Type ===
export interface PlanData {
  name: string;
  price: number;
  credits: number;
  category: TripCategory;
  creditValue: number;
  usableFor: 'domestic_only' | 'international_only';
}

// === Tour & Booking Types ===

export type BookingPaymentType = 'fixed_departure' | 'customized_tailor_made';

export interface PaymentInstallment {
  id: string;
  label: string;
  percentage: number;
  amount: number;
  dueLabel: string;
  dueDate?: string;
  status: 'pay_now' | 'upcoming';
  note?: string;
}

export interface AdvancePaymentPlan {
  bookingType: BookingPaymentType;
  bookingTypeLabel: string;
  baseTourTotal: number;
  instantBookingCharge: number;
  grandTotal: number;
  advanceDueNow: number;
  balanceDueLater: number;
  installments: PaymentInstallment[];
  paymentSummary: string;
}

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
  category: TripCategory;
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
  method: 'credit_card' | 'upi' | 'net_banking' | 'apple_pay' | 'bank_wire';
  cardNumberLast4?: string;
  cardHolder?: string;
  paypalEmail?: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  transactionId?: string;
  paymentTime?: string;
  amountPaidNow?: number;
  amountDueLater?: number;
  paymentPlanLabel?: string;
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
  paymentPlan?: AdvancePaymentPlan;
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

// === Franchise & Agent Network Types ===
export interface Franchise {
  id: string;
  name: string;
  type: 'Master' | 'Standard' | 'CityHub';
  state: string;
  city: string;
  investment: number;
  commissionRate: number;
  totalRevenue: number;
  agentCount: number;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  franchiseId: string;
  franchiseName: string;
  earningModel: 'salary' | 'commission';
  targetRegistrations: number;
  achievedRegistrations: number;
  accruedCommission: number;
  salary: number;
  status: 'active' | 'pending_approval' | 'suspended';
}



// === Shared App/User/API Types ===
export type AppRole = 'admin' | 'customer';
export type SubscriptionStatus = 'inactive' | 'active' | 'failed' | 'refunded' | 'chargeback';
export type SubscriptionSource = 'demo' | 'real' | null;

export interface SubscriptionPaymentRecord {
  transaction_id?: string;
  checkout_session_id?: string;
  provider?: string;
  payment_status?: 'success' | 'failed' | 'refunded' | 'chargeback' | 'pending';
  planName?: string;
  planPrice?: string | number;
  planType?: TripCategory;
  subscription_source?: SubscriptionSource;
  payment_type?: 'real_payment' | 'demo_wallet';
  verified_by?: 'simulated_webhook' | 'provider_webhook' | 'manual_admin_review';
  activated_at?: string;
  updated_at?: string;
  last_payment_event_id?: string;
}

export interface Subscription {
  planName: string | null;
  planPrice: string | number | null;
  planType: TripCategory | null;
  status: SubscriptionStatus;
  source: SubscriptionSource;
  paymentRecord: SubscriptionPaymentRecord | null;
}

export interface SavedTravelerProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  age?: string;
  ageGroup?: Traveler['ageGroup'];
  relation?: string;
  relationship?: string;
}

export interface SavedPickupProfile {
  id?: string;
  type?: PickupInfo['type'];
  name?: string;
  hotelName?: string;
  customAddress?: string;
  address?: string;
  label?: string;
}

export interface AppUserMetadata {
  full_name?: string;
  name?: string;
  phone?: string;
  city?: string;
  dob?: string;
  role?: AppRole;
  is_demo_user?: boolean;
  planName?: string | null;
  planPrice?: string | number | null;
  planType?: TripCategory | string | null;
  subscriptionStatus?: SubscriptionStatus | string;
  subscription_source?: SubscriptionSource;
  payment_type?: 'real_payment' | 'demo_wallet' | null;
  subscription_payment_record?: SubscriptionPaymentRecord | null;
  payment_hold_status?: 'failed' | 'refunded' | 'chargeback' | null;
  uid?: string;
  auth_password?: string;
  weekly_participation_status?: 'not_activated' | 'active' | 'winner' | 'non_winner' | 'non_winner_credit_issued' | string;
  weekly_participation_cycle_id?: string;
  weekly_non_winner_credit_cycle?: string;
  real_wallet_balance?: number;
  demo_wallet_balance?: number;
  discount_credits?: number;
  weekly_eligible_entry_count?: number;
  used_credits?: number;
  pending_credits?: number;
  selected_member_benefit_status?: string;
  ledger?: CreditLedgerEntry[];
  demo_transactions?: DemoTransactionRecord[];
  real_transactions?: DemoTransactionRecord[];
  preferredLanguage?: string;
  dietaryPreferences?: string;
  accessibilityRequirements?: string;
  savedTravelers?: SavedTravelerProfile[];
  savedPickups?: SavedPickupProfile[];
  [key: string]: unknown;
}

export interface SupabaseRawUser {
  id: string;
  email?: string | null;
  phone?: string | null;
  user_metadata?: AppUserMetadata;
  created_at?: string;
}

export interface ProfileRecord {
  id?: string;
  uid: string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  city?: string | null;
  role: AppRole;
  is_demo_user?: boolean;
}

export interface DemoTransactionRecord {
  id: string;
  userId: string;
  amount: number;
  transaction_type: 'credit' | 'debit';
  wallet_type: 'real' | 'demo';
  payment_type: 'real_payment' | 'demo_wallet';
  reason: string;
  status: 'success' | 'failed' | 'pending';
  created_at: string;
  provider?: string;
  payment_event_id?: string;
  checkout_session_id?: string;
}

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  memberId: string;
  uid: string;
  planName: string | null;
  planPrice: string | number | null;
  planType: TripCategory | null;
  subscriptionStatus: SubscriptionStatus;
  real_wallet_balance: number;
  demo_wallet_balance: number;
  is_demo_user: boolean;
  role: AppRole;
  ledger: CreditLedgerEntry[];
  demo_transactions: DemoTransactionRecord[];
  subscription_payment_record: SubscriptionPaymentRecord | null;
  subscription_source: SubscriptionSource;
  color: string;
  glow: string;
  drawToken: string;
  dob: string;
  preferredLanguage: string;
  dietaryPreferences: string;
  accessibilityRequirements: string;
  savedTravelers: SavedTravelerProfile[];
  savedPickups: SavedPickupProfile[];
  supabaseUser: SupabaseRawUser;
}

export interface Winner {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  ticketId?: string;
  coupon?: string;
  destination?: string;
  batch?: string;
  travelDate?: string;
  verification_status?: 'pending' | 'verified' | 'rejected';
  status?: 'Selected' | 'Tour Assigned' | 'Redeemed' | 'Cancelled' | string;
  callConfirmed?: boolean;
  callConfirmedAt?: string;
}

export type ApiResponse<TData = unknown> =
  | { success: true; message: string; data: TData }
  | { success: false; message: string; code?: string; details?: unknown };
