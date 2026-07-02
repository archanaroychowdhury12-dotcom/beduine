import type { CreditLedgerEntry, SubscriptionStatus, TripCategory } from '@/types';

export type PlanTier = 'silver' | 'gold' | 'platinum';
export type DrawRoundKey = `${TripCategory}_${PlanTier}`;

export type DrawCycleStatus =
  | 'entry_open'
  | 'auto_freeze_pending'
  | 'frozen'
  | 'winner_pool_ready'
  | 'revealing'
  | 'published'
  | 'cancelled';

export interface DrawRoundSummary {
  roundKey: DrawRoundKey;
  label: string;
  category: TripCategory;
  tier: PlanTier;
  participantCount: number;
  winnerCount: number;
  revealedCount: number;
}

export interface WeeklyDrawStatusResponse {
  cycleId: string;
  freezeAtIso: string;
  timezone: 'Asia/Kolkata';
  status: DrawCycleStatus;
  rounds: DrawRoundSummary[];
  canRevealNextWinner: boolean;
}

export interface RevealedWinnerResponse {
  hasWinner: boolean;
  cycleId: string;
  rank?: number;
  roundKey?: DrawRoundKey;
  planLabel?: string;
  name?: string;
  uid?: string;
  ticketId?: string;
  coupon?: string;
  remainingWinners?: number;
}

export interface LedgerResponse {
  ledger: CreditLedgerEntry[];
}

export type RefundPreference = 'cash_refund' | 'credit_adjustment';
export type PaymentPurpose = 'subscription' | 'tour_booking' | 'installment';
export type CancellationRequestStatus =
  | 'requested'
  | 'admin_review'
  | 'approved'
  | 'rejected'
  | 'refund_pending'
  | 'refund_processing'
  | 'refunded'
  | 'refund_failed'
  | 'credit_adjusted';

export interface CancellationRequestInput {
  bookingId: string;
  reason: string;
  refundPreference: RefundPreference;
}

export interface CancellationRequestResponse {
  requestId: string;
  bookingId: string;
  status: CancellationRequestStatus;
  estimatedRefund?: number;
  creditAdjustmentAmount?: number;
}

export interface CreatePaymentOrderInput {
  purpose: PaymentPurpose;
  referenceId: string;
}

export interface PaymentOrderResponse {
  sessionId: string;
  keyId: string;
  orderId: string;
  amountPaise: number;
  currency: 'INR';
  description: string;
}

export interface CustomerProfileSummary {
  uid: string;
  fullName: string;
  role: 'customer';
  email?: string | null;
  phone?: string | null;
  city?: string | null;
}

export interface CustomerSubscriptionSummary {
  planId: string;
  planName: string;
  planType: TripCategory;
  status: SubscriptionStatus;
  activatedAt: string | null;
  expiresAt: string | null;
}

export interface CustomerDiscountCreditUnit {
  id: string;
  creditCategory: 'domestic' | 'international';
  creditValue: number;
  status: 'available' | 'reserved' | 'redeemed' | 'expired';
  reservedByBookingId: string | null;
  reservedForTravelerKey: string | null;
  reservedUntil: string | null;
  redeemedBookingId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDrawEntry {
  id: string;
  cycleId: string;
  ticketId: string;
  planId: string | null;
  planRoundKey: DrawRoundKey | null;
  verificationStatus: string;
  verificationReason: string | null;
  drawResult: string;
  winnerRank: number | null;
  roundWinnerRank: number | null;
  couponCode: string | null;
  revealedAt: string | null;
  createdAt: string;
}

export interface CustomerWinnerBenefit {
  cycleId: string;
  ticketId: string;
  rank: number | null;
  roundRank: number | null;
  couponCode: string | null;
  revealedAt: string | null;
}

export interface CustomerBookingSummary {
  id: string;
  status: string;
  title?: string | null;
  createdAt?: string | null;
}

export interface CustomerPaymentSummary {
  id: string;
  sessionId: string | null;
  provider: string;
  planId: string | null;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  providerOrderId: string | null;
  eventType: string | null;
  providerPaymentId: string | null;
  verified: boolean;
}

export interface CustomerSupportTicket {
  id: string;
  status: string;
  subject: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CustomerDashboardResponse {
  profile: CustomerProfileSummary;
  subscription: CustomerSubscriptionSummary | null;
  trc: {
    available: number;
    locked: number;
    history: CreditLedgerEntry[];
  };
  discountCredits: {
    availableUnits: CustomerDiscountCreditUnit[];
    history: CreditLedgerEntry[];
  };
  drawEntries: CustomerDrawEntry[];
  winnerBenefits: CustomerWinnerBenefit[];
  bookings: CustomerBookingSummary[];
  payments: CustomerPaymentSummary[];
  supportTickets: CustomerSupportTicket[];
}
