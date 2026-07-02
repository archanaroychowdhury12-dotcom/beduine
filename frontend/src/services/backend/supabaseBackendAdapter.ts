import { getSupabaseFunctionsBaseUrl } from '@/config/productionEnv';
import { supabase, isRealSupabaseConnected } from '@/utils/supabaseClient';
import type { CreditLedgerEntry, SubscriptionStatus, TripCategory } from '@/types';
import type { BeduineBackendAdapter } from './backendAdapter';
import type {
  CancellationRequestInput,
  CancellationRequestResponse,
  CreditIssuanceResponse,
  CreateTourBookingDraftInput,
  CreatePaymentOrderInput,
  CustomerDashboardResponse,
  DrawRoundKey,
  DrawRoundSummary,
  LedgerResponse,
  PaymentOrderResponse,
  PaymentStatusResponse,
  ParticipationResponse,
  PublicWinnerSummary,
  RevealedWinnerResponse,
  WeeklyDrawStatusResponse,
  TourBookingDraftResponse,
} from './backendContracts';

type UnknownRecord = Record<string, unknown>;

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const FUNCTIONS_BASE_URL = getSupabaseFunctionsBaseUrl(import.meta.env);

function normalizeRoundKey(value: unknown): DrawRoundKey {
  const raw = String(value || '').trim().toLowerCase().replace(':', '_');
  const allowed: DrawRoundKey[] = [
    'domestic_silver',
    'domestic_gold',
    'domestic_platinum',
    'international_silver',
    'international_gold',
    'international_platinum',
  ];
  return allowed.includes(raw as DrawRoundKey) ? raw as DrawRoundKey : 'domestic_silver';
}

function normalizeRound(input: UnknownRecord): DrawRoundSummary {
  const roundKey = normalizeRoundKey(input.roundKey ?? input.round_key ?? input.plan_round_key);
  const [category, tier] = roundKey.split('_') as DrawRoundSummary['roundKey'] extends `${infer C}_${infer T}` ? [C, T] : never;
  return {
    roundKey,
    label: String(input.label || `${String(category).charAt(0).toUpperCase()}${String(category).slice(1)} ${String(tier).charAt(0).toUpperCase()}${String(tier).slice(1)}`),
    category: category as DrawRoundSummary['category'],
    tier: tier as DrawRoundSummary['tier'],
    participantCount: Number(input.participantCount ?? input.participant_count ?? input.verifiedParticipants ?? input.verified_participants ?? 0),
    winnerCount: Number(input.winnerCount ?? input.winner_count ?? 0),
    revealedCount: Number(input.revealedCount ?? input.revealed_count ?? 0),
  };
}

function normalizeWeeklyStatus(payload: UnknownRecord): WeeklyDrawStatusResponse {
  const rounds = Array.isArray(payload.rounds) ? payload.rounds.map((round) => normalizeRound(round as UnknownRecord)) : [];
  return {
    cycleId: String(payload.cycleId || payload.cycle_id || ''),
    freezeAtIso: String(payload.freezeAtIso || payload.freeze_at_iso || payload.auto_freeze_at || ''),
    timezone: 'Asia/Kolkata',
    status: (String(payload.status || 'auto_freeze_pending') as WeeklyDrawStatusResponse['status']),
    rounds,
    canRevealNextWinner: Boolean(payload.canRevealNextWinner ?? payload.can_reveal_next_winner ?? false),
  };
}

function normalizeWinner(payload: UnknownRecord): RevealedWinnerResponse {
  return {
    hasWinner: Boolean(payload.hasWinner ?? payload.has_winner ?? payload.uid ?? payload.ticketId ?? payload.ticket_id),
    cycleId: String(payload.cycleId || payload.cycle_id || ''),
    rank: payload.rank == null ? undefined : Number(payload.rank),
    roundKey: payload.roundKey || payload.round_key || payload.plan_round_key ? normalizeRoundKey(payload.roundKey ?? payload.round_key ?? payload.plan_round_key) : undefined,
    planLabel: payload.planLabel == null ? undefined : String(payload.planLabel || payload.plan_label),
    name: payload.name == null ? undefined : String(payload.name),
    uid: payload.uid == null ? undefined : String(payload.uid),
    ticketId: payload.ticketId == null && payload.ticket_id == null ? undefined : String(payload.ticketId || payload.ticket_id),
    coupon: payload.coupon == null ? undefined : String(payload.coupon),
    remainingWinners: payload.remainingWinners == null && payload.remaining_winners == null ? undefined : Number(payload.remainingWinners ?? payload.remaining_winners),
  };
}

function normalizeLedgerEntry(input: UnknownRecord): CreditLedgerEntry {
  return {
    id: String(input.id || ''),
    date: String(input.date || input.createdAt || input.created_at || ''),
    type: String(input.type || 'issued') as CreditLedgerEntry['type'],
    creditType: String(input.creditType || input.credit_type || 'lucky_draw') as CreditLedgerEntry['creditType'],
    amount: Number(input.amount ?? 0),
    reason: String(input.reason || ''),
    bookingRef: input.bookingRef == null && input.booking_ref == null ? undefined : String(input.bookingRef || input.booking_ref),
    adminRef: input.adminRef == null && input.admin_ref == null ? undefined : String(input.adminRef || input.admin_ref),
    source: String(input.source || 'real') === 'demo' ? 'demo' : 'real',
    creditCategory: String(input.creditCategory || input.credit_category || 'domestic') as CreditLedgerEntry['creditCategory'],
    creditValue: Number(input.creditValue ?? input.credit_value ?? 0),
    usableFor: String(input.usableFor || input.usable_for || 'lucky_draw') as CreditLedgerEntry['usableFor'],
  };
}

function normalizeDashboard(payload: UnknownRecord): CustomerDashboardResponse {
  const profile = (payload.profile || {}) as UnknownRecord;
  const subscription = payload.subscription && typeof payload.subscription === 'object'
    ? payload.subscription as UnknownRecord
    : null;
  const trc = (payload.trc || {}) as UnknownRecord;
  const discountCredits = (payload.discountCredits || payload.discount_credits || {}) as UnknownRecord;

  return {
    profile: {
      uid: String(profile.uid || ''),
      fullName: String(profile.fullName || profile.full_name || ''),
      role: 'customer',
      email: profile.email == null ? null : String(profile.email),
      phone: profile.phone == null ? null : String(profile.phone),
      city: profile.city == null ? null : String(profile.city),
    },
    subscription: subscription ? {
      planId: String(subscription.planId || subscription.plan_id || ''),
      planName: String(subscription.planName || subscription.plan_name || ''),
      planType: String(subscription.planType || subscription.plan_type || 'domestic') as TripCategory,
      status: String(subscription.status || 'inactive') as SubscriptionStatus,
      activatedAt: subscription.activatedAt == null && subscription.activated_at == null ? null : String(subscription.activatedAt || subscription.activated_at),
      expiresAt: subscription.expiresAt == null && subscription.expires_at == null ? null : String(subscription.expiresAt || subscription.expires_at),
    } : null,
    trc: {
      available: Number(trc.available ?? 0),
      locked: Number(trc.locked ?? 0),
      history: Array.isArray(trc.history) ? trc.history.map((entry) => normalizeLedgerEntry(entry as UnknownRecord)) : [],
    },
    discountCredits: {
      availableUnits: Array.isArray(discountCredits.availableUnits)
        ? discountCredits.availableUnits.map((unit) => {
            const input = unit as UnknownRecord;
            return {
              id: String(input.id || ''),
              creditCategory: String(input.creditCategory || input.credit_category || 'domestic') as 'domestic' | 'international',
              creditValue: Number(input.creditValue ?? input.credit_value ?? 0),
              status: String(input.status || 'available') as 'available' | 'reserved' | 'redeemed' | 'expired',
              reservedByBookingId: input.reservedByBookingId == null && input.reserved_by_booking_id == null ? null : String(input.reservedByBookingId || input.reserved_by_booking_id),
              reservedForTravelerKey: input.reservedForTravelerKey == null && input.reserved_for_traveler_key == null ? null : String(input.reservedForTravelerKey || input.reserved_for_traveler_key),
              reservedUntil: input.reservedUntil == null && input.reserved_until == null ? null : String(input.reservedUntil || input.reserved_until),
              redeemedBookingId: input.redeemedBookingId == null && input.redeemed_booking_id == null ? null : String(input.redeemedBookingId || input.redeemed_booking_id),
              createdAt: String(input.createdAt || input.created_at || ''),
              updatedAt: String(input.updatedAt || input.updated_at || ''),
            };
          })
        : [],
      history: Array.isArray(discountCredits.history)
        ? discountCredits.history.map((entry) => normalizeLedgerEntry(entry as UnknownRecord))
        : [],
    },
    drawEntries: Array.isArray(payload.drawEntries)
      ? payload.drawEntries.map((entry) => {
          const input = entry as UnknownRecord;
          return {
            id: String(input.id || ''),
            cycleId: String(input.cycleId || input.cycle_id || ''),
            ticketId: String(input.ticketId || input.ticket_id || ''),
            planId: input.planId == null && input.plan_id == null ? null : String(input.planId || input.plan_id),
            planRoundKey: input.planRoundKey == null && input.plan_round_key == null
              ? null
              : normalizeRoundKey(input.planRoundKey ?? input.plan_round_key),
            verificationStatus: String(input.verificationStatus || input.verification_status || 'pending'),
            verificationReason: input.verificationReason == null && input.verification_reason == null ? null : String(input.verificationReason || input.verification_reason),
            drawResult: String(input.drawResult || input.draw_result || 'pending'),
            winnerRank: input.winnerRank == null && input.winner_rank == null ? null : Number(input.winnerRank ?? input.winner_rank),
            roundWinnerRank: input.roundWinnerRank == null && input.round_winner_rank == null ? null : Number(input.roundWinnerRank ?? input.round_winner_rank),
            couponCode: input.couponCode == null && input.coupon_code == null ? null : String(input.couponCode || input.coupon_code),
            revealedAt: input.revealedAt == null && input.revealed_at == null ? null : String(input.revealedAt || input.revealed_at),
            createdAt: String(input.createdAt || input.created_at || ''),
          };
        })
      : [],
    winnerBenefits: Array.isArray(payload.winnerBenefits)
      ? payload.winnerBenefits.map((benefit) => {
          const input = benefit as UnknownRecord;
          return {
            id: String(input.id || ''),
            cycleId: String(input.cycleId || input.cycle_id || ''),
            coupon: String(input.coupon || ''),
            value: input.value == null && input.benefit_value_inr == null
              ? null
              : Number(input.value ?? input.benefit_value_inr),
            destination: input.destination == null ? null : String(input.destination),
            batchId: input.batchId == null && input.batch_id == null
              ? null
              : String(input.batchId || input.batch_id),
            status: String(input.status || 'issued') as 'issued' | 'assigned' | 'used' | 'cancelled',
            createdAt: String(input.createdAt || input.created_at || ''),
          };
        })
      : [],
    bookings: Array.isArray(payload.bookings)
      ? payload.bookings.map((booking) => {
          const input = booking as UnknownRecord;
          return {
            id: String(input.id || ''),
            status: String(input.status || ''),
            title: input.title == null ? null : String(input.title),
            createdAt: input.createdAt == null && input.created_at == null ? null : String(input.createdAt || input.created_at),
          };
        })
      : [],
    payments: Array.isArray(payload.payments)
      ? payload.payments.map((payment) => {
          const input = payment as UnknownRecord;
          return {
            id: String(input.id || ''),
            sessionId: input.sessionId == null && input.session_id == null ? null : String(input.sessionId || input.session_id),
            provider: String(input.provider || ''),
            planId: input.planId == null && input.plan_id == null ? null : String(input.planId || input.plan_id),
            amount: Number(input.amount ?? 0),
            currency: String(input.currency || 'INR'),
            status: String(input.status || ''),
            createdAt: String(input.createdAt || input.created_at || ''),
            providerOrderId: input.providerOrderId == null && input.provider_order_id == null ? null : String(input.providerOrderId || input.provider_order_id),
            eventType: input.eventType == null && input.event_type == null ? null : String(input.eventType || input.event_type),
            providerPaymentId: input.providerPaymentId == null && input.provider_payment_id == null ? null : String(input.providerPaymentId || input.provider_payment_id),
            verified: Boolean(input.verified ?? input.signature_verified ?? false),
          };
        })
      : [],
    supportTickets: Array.isArray(payload.supportTickets)
      ? payload.supportTickets.map((ticket) => {
          const input = ticket as UnknownRecord;
          return {
            id: String(input.id || ''),
            status: String(input.status || ''),
            subject: String(input.subject || ''),
            createdAt: String(input.createdAt || input.created_at || ''),
            updatedAt: input.updatedAt == null && input.updated_at == null ? null : String(input.updatedAt || input.updated_at),
          };
        })
      : [],
  };
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const sessionResult = await supabase.auth.getSession();
  const accessToken = sessionResult.data.session?.access_token;
  return {
    'content-type': 'application/json',
    ...(SUPABASE_ANON_KEY ? { apikey: SUPABASE_ANON_KEY } : {}),
    ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
  };
}

async function callFunction<T>(functionName: string, body?: UnknownRecord, method: 'GET' | 'POST' = 'POST'): Promise<T> {
  if (!FUNCTIONS_BASE_URL || !isRealSupabaseConnected) {
    throw new Error('Production backend is not configured. Set VITE_BACKEND_MODE=production, VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  const url = `${FUNCTIONS_BASE_URL.replace(/\/$/, '')}/${functionName}`;
  const response = await fetch(url, {
    method,
    headers: await getAuthHeaders(),
    body: method === 'GET' ? undefined : JSON.stringify(body || {}),
  });
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const payload = await response.json() as { error?: { code?: string; message?: string } };
      detail = payload.error?.code || payload.error?.message || detail;
    } catch {
      detail = await response.text().catch(() => response.statusText);
    }
    throw new Error(`Backend ${functionName} failed: ${response.status} ${detail}`);
  }
  return response.json() as Promise<T>;
}

export function createSupabaseBackendAdapter(): BeduineBackendAdapter {
  return {
    async createPaymentOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderResponse> {
      return callFunction<PaymentOrderResponse>('create-payment-order', { ...input });
    },

    async getPaymentStatus(sessionId: string): Promise<PaymentStatusResponse> {
      return callFunction<PaymentStatusResponse>('payment-status', { sessionId });
    },

    async createTourBookingDraft(input: CreateTourBookingDraftInput): Promise<TourBookingDraftResponse> {
      return callFunction<TourBookingDraftResponse>('create-tour-booking', { ...input });
    },

    async participateInWeeklyDraw(): Promise<ParticipationResponse> {
      return callFunction<ParticipationResponse>('participate-weekly-draw', {});
    },

    async issueNonWinnerCredits(cycleId: string): Promise<CreditIssuanceResponse> {
      return callFunction<CreditIssuanceResponse>('issue-non-winner-credits', {
        cycleId,
      });
    },

    async listPublicWinners(): Promise<PublicWinnerSummary[]> {
      const response = await callFunction<{ winners: PublicWinnerSummary[] }>(
        'public-winners',
        undefined,
        'GET',
      );
      return response.winners;
    },

    async getCustomerDashboard(): Promise<CustomerDashboardResponse> {
      const payload = await callFunction<UnknownRecord>('customer-dashboard', undefined, 'GET');
      return normalizeDashboard(payload);
    },

    async getTrcAndDiscountLedger(userId: string): Promise<LedgerResponse> {
      const payload = await callFunction<{ ledger?: CreditLedgerEntry[] }>('customer-ledger', { userId });
      return { ledger: payload.ledger || [] };
    },

    async getWeeklyDrawStatus(): Promise<WeeklyDrawStatusResponse> {
      const payload = await callFunction<UnknownRecord>('weekly-draw-status', {}, 'POST');
      return normalizeWeeklyStatus(payload);
    },

    async revealNextWinner(cycleId: string): Promise<RevealedWinnerResponse> {
      const payload = await callFunction<UnknownRecord>('reveal-next-winner', { cycleId });
      return normalizeWinner(payload);
    },

    async requestCancellation(input: CancellationRequestInput): Promise<CancellationRequestResponse> {
      return callFunction<CancellationRequestResponse>('request-cancellation', { ...input });
    },
  };
}
