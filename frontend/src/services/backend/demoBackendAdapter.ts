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
import type { AppUserMetadata, CustomTourRequest, SupabaseRawUser } from '@/types';
import { supabase } from '@/utils/supabaseClient';
import { applyNonWinnerDiscountCredit } from '@/services/nonWinnerCreditService';

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

type DemoAuthAdmin = typeof supabase.auth & {
  getUsersList?: () => SupabaseRawUser[];
  saveUsersList?: (users: SupabaseRawUser[]) => void;
};

type DemoDrawEntry = CustomerDashboardResponse['drawEntries'][number];

function getDemoAuthAdmin(): DemoAuthAdmin {
  return supabase.auth as DemoAuthAdmin;
}

function getPlanTier(metadata: AppUserMetadata): 'silver' | 'gold' | 'platinum' {
  const plan = String(metadata.planName || '').toLowerCase();
  if (plan.includes('platinum')) return 'platinum';
  if (plan.includes('gold')) return 'gold';
  return 'silver';
}

function getPlanCategory(metadata: AppUserMetadata): 'domestic' | 'international' {
  return metadata.planType === 'international' || String(metadata.planName || '').toLowerCase().includes('international')
    ? 'international'
    : 'domestic';
}

function getPlanId(metadata: AppUserMetadata): string {
  return `${getPlanCategory(metadata)}_${getPlanTier(metadata)}`;
}

function getDemoDrawEntries(metadata: AppUserMetadata): DemoDrawEntry[] {
  return Array.isArray(metadata.demo_draw_entries)
    ? metadata.demo_draw_entries as DemoDrawEntry[]
    : [];
}

function buildCustomerDashboard(user: SupabaseRawUser): CustomerDashboardResponse {
  const metadata = user.user_metadata || {};
  const ledger = metadata.ledger || [];
  const trcHistory = ledger.filter((entry) => entry.creditType === 'lucky_draw');
  const discountHistory = ledger.filter((entry) => entry.creditType === 'discount');
  const category = getPlanCategory(metadata);
  const activeSubscription = metadata.subscriptionStatus === 'active' && Boolean(metadata.planName);
  const demoTransactions = metadata.demo_transactions || [];
  const subscriptionTransaction = demoTransactions.find((entry) => entry.reason?.startsWith('Subscribed to '));

  return {
    profile: {
      uid: String(metadata.uid || ''),
      fullName: String(metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Demo Customer'),
      role: 'customer',
      email: user.email,
      phone: user.phone || String(metadata.phone || ''),
      city: String(metadata.city || ''),
    },
    subscription: activeSubscription ? {
      planId: getPlanId(metadata),
      planName: String(metadata.planName),
      planType: category,
      status: 'active',
      activatedAt: subscriptionTransaction?.created_at || null,
      expiresAt: null,
    } : null,
    trc: {
      available: Number(metadata.weekly_eligible_entry_count || 0),
      locked: Number(metadata.weekly_locked_entry_count || 0),
      history: trcHistory,
    },
    discountCredits: {
      availableUnits: discountHistory
        .filter((entry) => entry.type === 'issued')
        .map((entry) => ({
          id: entry.id,
          creditCategory: entry.creditCategory === 'international' ? 'international' : 'domestic',
          creditValue: entry.creditValue,
          status: 'available' as const,
          reservedByBookingId: null,
          reservedForTravelerKey: null,
          reservedUntil: null,
          redeemedBookingId: null,
          createdAt: entry.date,
          updatedAt: entry.date,
        })),
      history: discountHistory,
    },
    drawEntries: getDemoDrawEntries(metadata),
    winnerBenefits: [],
    bookings: [],
    payments: demoTransactions
      .filter((entry) => entry.payment_type === 'demo_wallet')
      .map((entry) => ({
        id: entry.id,
        sessionId: null,
        provider: 'demo_wallet',
        planId: entry.reason?.startsWith('Subscribed to ') ? getPlanId(metadata) : null,
        amount: Math.abs(entry.amount),
        currency: 'INR',
        status: entry.status,
        createdAt: entry.created_at,
        providerOrderId: null,
        eventType: 'simulated_webhook',
        providerPaymentId: null,
        verified: entry.status === 'success',
      })),
    supportTickets: [],
  };
}

async function getCurrentDemoUser(): Promise<SupabaseRawUser> {
  const session = await supabase.auth.getSession();
  const user = session.data.session?.user;
  if (!user) throw new Error('Demo customer is not logged in.');
  return user;
}

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
      const user = await getCurrentDemoUser();
      const metadata = user.user_metadata || {};
      const cycleId = 'BEDUINE-SUN-DEMO-1800-IST';
      const existing = getDemoDrawEntries(metadata).find((entry) => entry.cycleId === cycleId);
      if (existing) {
        return {
          cycleId,
          ticketId: existing.ticketId,
          roundKey: existing.planRoundKey || getPlanId(metadata) as ParticipationResponse['roundKey'],
          freezeAtIso: nextSundaySix.toISOString(),
        };
      }
      if (metadata.subscriptionStatus !== 'active' || !metadata.planName) {
        throw new Error('An active subscription is required to participate.');
      }
      const availableTrc = Number(metadata.weekly_eligible_entry_count || 0);
      if (availableTrc < 1) {
        throw new Error('No available TRC for this draw cycle.');
      }

      const roundKey = getPlanId(metadata) as ParticipationResponse['roundKey'];
      const ticketId = `TRC-SUN-${user.id.replace(/[^A-Z0-9]/gi, '').slice(-5).toUpperCase().padStart(5, '0')}`;
      const createdAt = new Date().toISOString();
      const drawEntry: DemoDrawEntry = {
        id: `DRAW-${cycleId}-${user.id}`,
        cycleId,
        ticketId,
        planId: getPlanId(metadata),
        planRoundKey: roundKey,
        verificationStatus: 'verified',
        verificationReason: null,
        drawResult: 'pending',
        winnerRank: null,
        roundWinnerRank: null,
        couponCode: null,
        revealedAt: null,
        createdAt,
      };

      await supabase.auth.updateUser({
        data: {
          weekly_eligible_entry_count: availableTrc - 1,
          weekly_locked_entry_count: Number(metadata.weekly_locked_entry_count || 0) + 1,
          weekly_participation_status: 'active',
          weekly_participation_cycle_id: cycleId,
          demo_draw_entries: [...getDemoDrawEntries(metadata), drawEntry],
        },
      });

      return { cycleId, ticketId, roundKey, freezeAtIso: nextSundaySix.toISOString() };
    },

    async issueNonWinnerCredits(cycleId: string): Promise<CreditIssuanceResponse> {
      const actor = await getCurrentDemoUser();
      if (actor.user_metadata?.role !== 'admin') {
        throw new Error('Admin access is required to issue non-winner credits.');
      }
      const auth = getDemoAuthAdmin();
      if (!auth.getUsersList || !auth.saveUsersList) {
        throw new Error('Demo account store is unavailable.');
      }

      let eligibleUsers = 0;
      let issuedUsers = 0;
      let issuedUnits = 0;
      const users = auth.getUsersList();
      const updatedUsers = users.map((user) => {
        const metadata = user.user_metadata || {};
        const isEligible = metadata.role === 'customer'
          && metadata.subscriptionStatus === 'active'
          && metadata.weekly_participation_cycle_id === cycleId;
        if (!isEligible) return user;

        eligibleUsers += 1;
        const result = applyNonWinnerDiscountCredit(user, cycleId);
        if (result.issued) {
          issuedUsers += 1;
          issuedUnits += result.issuedUnits;
        }
        return result.user;
      });
      auth.saveUsersList(updatedUsers);

      return {
        cycleId,
        issuedUsers,
        issuedUnits,
        duplicate: eligibleUsers > 0 && issuedUsers === 0,
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
      const user = await getCurrentDemoUser();
      if (user.user_metadata?.role === 'admin') {
        throw new Error('Customer dashboard is not available for admin accounts.');
      }
      return buildCustomerDashboard(user);
    },
    async getTrcAndDiscountLedger() {
      const user = await getCurrentDemoUser();
      return { ledger: user.user_metadata?.ledger || [] };
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
