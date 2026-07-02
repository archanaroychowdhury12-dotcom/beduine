import type { BeduineBackendAdapter } from './backendAdapter';
import type {
  CancellationRequestInput,
  CreditIssuanceResponse,
  CreatePaymentOrderInput,
  CustomerDashboardResponse,
  DrawRoundSummary,
  RevealedWinnerResponse,
  PaymentOrderResponse,
  PaymentStatusResponse,
  ParticipationResponse,
  PublicWinnerSummary,
  WeeklyDrawStatusResponse,
} from './backendContracts';

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

export function createDemoBackendAdapter(): BeduineBackendAdapter {
  return {
    async createPaymentOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderResponse> {
      const amountRupees = demoPlanPrices[input.referenceId];
      if (input.purpose !== 'subscription' || !amountRupees) {
        throw new Error('Demo payment reference is not available.');
      }
      const sessionId = `demo-session-${Date.now()}`;
      return {
        sessionId,
        keyId: 'rzp_test_demo',
        orderId: `demo-order-${Date.now()}`,
        amountPaise: amountRupees * 100,
        currency: 'INR',
        description: `${input.referenceId.replace(/_/g, ' ')} membership`,
      };
    },

    async getPaymentStatus(sessionId: string): Promise<PaymentStatusResponse> {
      if (!sessionId.startsWith('demo-session-')) {
        throw new Error('Demo payment session is not available.');
      }
      return { sessionId, status: 'verified' };
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
  };
}
