import type { BeduineBackendAdapter } from './backendAdapter';
import type {
  CancellationRequestInput,
  CreditIssuanceResponse,
  CustomTourCreateInput,
  CreateTourBookingDraftInput,
  CreatePaymentOrderInput,
  CustomerDashboardResponse,
  DrawRoundSummary,
  RevealedWinnerResponse,
  PaymentOrderResponse,
  PaymentStatusResponse,
  ParticipationResponse,
  PublicWinnerSummary,
  WeeklyDrawStatusResponse,
  TourBookingDraftResponse,
} from './backendContracts';
import type { CustomTourRequest } from '@/types';

const now = new Date();
const nextSundaySix = new Date(now);
nextSundaySix.setDate(now.getDate() + ((7 - now.getDay()) % 7));
nextSundaySix.setHours(18, 0, 0, 0);

const rounds: DrawRoundSummary[] = [
  { roundKey: 'domestic_silver', label: 'Domestic Silver', category: 'domestic', tier: 'silver', participantCount: 21, winnerCount: 2, revealedCount: 0 },
  { roundKey: 'domestic_gold', label: 'Domestic Gold', category: 'domestic', tier: 'gold', participantCount: 20, winnerCount: 1, revealedCount: 0 },
  { roundKey: 'domestic_platinum', label: 'Domestic Platinum', category: 'domestic', tier: 'platinum', participantCount: 1, winnerCount: 1, revealedCount: 0 },
  { roundKey: 'international_silver', label: 'International Silver', category: 'international', tier: 'silver', participantCount: 21, winnerCount: 2, revealedCount: 0 },
  { roundKey: 'international_gold', label: 'International Gold', category: 'international', tier: 'gold', participantCount: 20, winnerCount: 1, revealedCount: 0 },
  { roundKey: 'international_platinum', label: 'International Platinum', category: 'international', tier: 'platinum', participantCount: 1, winnerCount: 1, revealedCount: 0 },
];

const revealQueue: RevealedWinnerResponse[] = rounds.flatMap((round, roundIndex) =>
  Array.from({ length: round.winnerCount }, (_, index) => ({
    hasWinner: true,
    cycleId: 'BEDUINE-SUN-DEMO-1800-IST',
    rank: index + 1,
    roundKey: round.roundKey,
    planLabel: round.label,
    name: `${round.label} Winner ${index + 1}`,
    uid: `BDU-${new Date().getFullYear()}-${round.category.slice(0, 3).toUpperCase()}${round.tier.slice(0, 3).toUpperCase()}-${String(roundIndex * 10 + index + 1).padStart(4, '0')}`,
    ticketId: `TRC-${round.roundKey.toUpperCase()}-${String(index + 1).padStart(4, '0')}`,
    coupon: `BEDWIN-${round.roundKey.toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
    remainingWinners: 0,
  })),
);

let revealIndex = 0;

const customerDashboard: CustomerDashboardResponse = {
  profile: {
    uid: 'BDU-2026-RHLSEN-4821',
    fullName: 'Rahul Sen',
    role: 'customer',
    email: 'rahul.sen@example.com',
    phone: '9876543210',
    city: 'Nadia',
  },
  subscription: null,
  trc: {
    available: 0,
    locked: 0,
    history: [],
  },
  discountCredits: {
    availableUnits: [],
    history: [],
  },
  drawEntries: [],
  winnerBenefits: [],
  bookings: [],
  payments: [],
  supportTickets: [],
};

const demoPlanPrices: Record<string, number> = {
  domestic_silver: 499,
  domestic_gold: 799,
  domestic_platinum: 1499,
  international_silver: 4999,
  international_gold: 7999,
  international_platinum: 14999,
};

const demoTourCatalog: Record<string, { price: number; category: 'domestic' | 'international' }> = {
  'digha-sea-beach-retreat': { price: 8499, category: 'domestic' },
  'sundarbans-mangrove-safari': { price: 12499, category: 'domestic' },
  'darjeeling-hills-tea': { price: 17499, category: 'domestic' },
  'dubai-city-desert': { price: 52999, category: 'international' },
  'thailand-bangkok-pattaya': { price: 45999, category: 'international' },
};

const demoBookingAmounts = new Map<string, number>();
const demoPaymentBookings = new Map<string, string>();

export function createDemoBackendAdapter(): BeduineBackendAdapter {
  return {
    async createPaymentOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderResponse> {
      const amountRupees = input.purpose === 'subscription'
        ? demoPlanPrices[input.referenceId]
        : input.purpose === 'tour_booking'
          ? demoBookingAmounts.get(input.referenceId)
          : undefined;
      if (!amountRupees) {
        throw new Error('Demo payment reference is not available.');
      }
      const sessionId = `demo-session-${Date.now()}`;
      if (input.purpose === 'tour_booking') {
        demoPaymentBookings.set(sessionId, input.referenceId);
      }
      return {
        sessionId,
        keyId: 'rzp_test_demo',
        orderId: `demo-order-${Date.now()}`,
        amountPaise: amountRupees * 100,
        currency: 'INR',
        description: input.purpose === 'subscription'
          ? `${input.referenceId.replace(/_/g, ' ')} membership`
          : 'Demo paid-tour advance',
      };
    },

    async getPaymentStatus(sessionId: string): Promise<PaymentStatusResponse> {
      if (!sessionId.startsWith('demo-session-')) {
        throw new Error('Demo payment session is not available.');
      }
      const bookingId = demoPaymentBookings.get(sessionId);
      return {
        sessionId,
        status: 'verified',
        ...(bookingId ? { bookingId } : {}),
      };
    },

    async createTourBookingDraft(input: CreateTourBookingDraftInput): Promise<TourBookingDraftResponse> {
      const tour = demoTourCatalog[input.tourId];
      if (!tour || input.travelers.length < 1) throw new Error('Demo tour is not available.');
      const grossTourTotal = tour.price * input.travelers.length;
      const creditValue = tour.category === 'international' ? 5000 : 500;
      const totalDiscount = input.creditAssignments.length * creditValue;
      const finalTourTotal = grossTourTotal - totalDiscount;
      const instantBookingCharge = input.instantBookingRequired
        ? tour.category === 'international' ? 5000 : 2000
        : 0;
      const amountDueNow = Math.round(
        finalTourTotal * (input.bookingType === 'customized_tailor_made' ? 0.5 : 0.25),
      ) + instantBookingCharge;
      const grandTotal = finalTourTotal + instantBookingCharge;
      const bookingId = `BDU-BKG-DEMO-${Date.now()}`;
      demoBookingAmounts.set(bookingId, amountDueNow);
      return {
        bookingId,
        currency: 'INR',
        grossTourTotal,
        totalDiscount,
        finalTourTotal,
        instantBookingCharge,
        grandTotal,
        amountDueNow,
        balanceDueLater: grandTotal - amountDueNow,
        reservationExpiresAt: new Date(Date.now() + 20 * 60_000).toISOString(),
        reservedCreditUnits: input.creditAssignments.map((assignment) => ({
          ...assignment,
          creditValue,
        })),
      };
    },

    async createCustomTourRequest(_input: CustomTourCreateInput): Promise<CustomTourRequest> {
      throw new Error('Use the demo custom-tour service in demo mode.');
    },

    async listCustomTourRequests() {
      return { requests: [] };
    },

    async updateCustomTourRequest(): Promise<CustomTourRequest> {
      throw new Error('Use the demo custom-tour service in demo mode.');
    },

    async participateInWeeklyDraw(): Promise<ParticipationResponse> {
      return {
        cycleId: 'BEDUINE-SUN-DEMO-1800-IST',
        ticketId: 'TRC-SUN-00091',
        roundKey: 'domestic_gold',
        freezeAtIso: nextSundaySix.toISOString(),
      };
    },

    async issueNonWinnerCredits(cycleId: string): Promise<CreditIssuanceResponse> {
      return {
        cycleId,
        issuedUsers: 1,
        issuedUnits: 2,
        duplicate: false,
      };
    },

    async listPublicWinners(): Promise<PublicWinnerSummary[]> {
      return [{
        name: 'Rahul Sen',
        uid: 'BDU-2026-RHLSEN-4821',
        ticketId: 'TRC-SUN-00091',
        roundKey: 'domestic_gold',
        coupon: 'BEDWIN-2026-4821',
        benefitSummary: 'Gold winner tour benefit',
        resultDate: '2026-07-05T13:00:00.000Z',
      }];
    },

    async getCustomerDashboard(): Promise<CustomerDashboardResponse> {
      return customerDashboard;
    },
    async getTrcAndDiscountLedger() {
      return { ledger: [] };
    },
    async getWeeklyDrawStatus(): Promise<WeeklyDrawStatusResponse> {
      const revealedByRound = rounds.map((round) => ({
        ...round,
        revealedCount: revealQueue.slice(0, revealIndex).filter((winner) => winner.roundKey === round.roundKey).length,
      }));
      return {
        cycleId: 'BEDUINE-SUN-DEMO-1800-IST',
        freezeAtIso: nextSundaySix.toISOString(),
        timezone: 'Asia/Kolkata',
        status: revealIndex >= revealQueue.length ? 'published' : 'winner_pool_ready',
        rounds: revealedByRound,
        canRevealNextWinner: revealIndex < revealQueue.length,
      };
    },
    async revealNextWinner(cycleId: string): Promise<RevealedWinnerResponse> {
      const winner = revealQueue[revealIndex];
      if (!winner) return { hasWinner: false, cycleId };
      revealIndex += 1;
      return { ...winner, cycleId, remainingWinners: Math.max(0, revealQueue.length - revealIndex) };
    },
    async requestCancellation(input: CancellationRequestInput) {
      return {
        requestId: `CXL-${Date.now()}`,
        bookingId: input.bookingId,
        status: input.refundPreference === 'credit_adjustment' ? 'credit_adjusted' : 'refund_pending',
        estimatedRefund: 0,
        creditAdjustmentAmount: input.refundPreference === 'credit_adjustment' ? 0 : undefined,
      };
    },
    async listCancellationRequests() {
      return [];
    },
    async reviewCancellation() {
      throw new Error('Cancellation administration requires production mode.');
    },
    async processCancellationPayout() {
      throw new Error('Cancellation administration requires production mode.');
    },
    async listCustomerSupportTickets() {
      return [];
    },
    async createSupportTicket(input) {
      return {
        id: `SUP-DEMO-${Date.now()}`,
        subject: input.subject,
        category: input.category,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    async replySupportTicket(input) {
      return {
        ticketId: input.ticketId,
        senderRole: 'customer',
        message: input.message,
        createdAt: new Date().toISOString(),
      };
    },
    async listAdminUsers() {
      return [];
    },
    async listAuditLogs() {
      return { logs: [] };
    },
    async listSupportTickets() {
      return [];
    },
    async updateSupportTicket() {
      throw new Error('Support administration requires production mode.');
    },
  };
}
