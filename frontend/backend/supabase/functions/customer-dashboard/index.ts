import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAdminClient, requireUser } from '../_shared/auth.ts';
import { computeCreditBalances } from '../_shared/dashboardLedger.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';

type CreditLedgerRow = {
  id: string;
  type: string;
  credit_type: string;
  credit_category: string;
  amount: number | string;
  credit_value: number | string;
  usable_for: string;
  source: string;
  reason: string;
  booking_ref: string | null;
  admin_ref: string | null;
  created_at: string;
};

type DiscountCreditUnitRow = {
  id: string;
  credit_category: 'domestic' | 'international';
  credit_value: number | string;
  status: 'available' | 'reserved' | 'redeemed' | 'expired';
  reserved_by_booking_id: string | null;
  reserved_for_traveler_key: string | null;
  reserved_until: string | null;
  redeemed_booking_id: string | null;
  created_at: string;
  updated_at: string;
};

type SubscriptionRow = {
  plan_id: string;
  plan_name: string;
  plan_type: 'domestic' | 'international';
  status: 'inactive' | 'active' | 'failed' | 'refunded' | 'chargeback';
  activated_at: string | null;
  expires_at: string | null;
};

type DrawEntryRow = {
  id: string;
  cycle_id: string;
  ticket_id: string;
  plan_id: string | null;
  plan_round_key: string | null;
  verification_status: string;
  verification_reason: string | null;
  draw_result: string;
  winner_rank: number | null;
  round_winner_rank: number | null;
  coupon_code: string | null;
  revealed_at: string | null;
  created_at: string;
};

type PaymentSessionRow = {
  id: string;
  provider: string;
  provider_order_id: string | null;
  plan_id: string | null;
  amount: number | string;
  currency: string;
  status: string;
  created_at: string;
};

type SupportTicketRow = {
  id: string;
  status: string;
  subject: string;
  category: string;
  priority: string;
  created_at: string;
  updated_at: string;
};

type WinnerBenefitRow = {
  id: string;
  cycle_id: string;
  coupon: string;
  benefit_value_inr: number | string | null;
  destination: string | null;
  batch_id: string | null;
  status: 'issued' | 'assigned' | 'used' | 'cancelled';
  created_at: string;
};

type BookingRow = {
  id: string;
  status: string;
  title: string;
  created_at: string;
};

type PaymentEventRow = {
  id: string;
  session_id: string | null;
  provider: string;
  provider_payment_id: string | null;
  event_type: string;
  status: string;
  amount: number | string;
  currency: string;
  signature_verified: boolean;
  created_at: string;
};

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toLedgerEntry(row: CreditLedgerRow) {
  return {
    id: row.id,
    date: row.created_at,
    type: row.type,
    creditType: row.credit_type,
    amount: toNumber(row.amount),
    reason: row.reason,
    bookingRef: row.booking_ref ?? undefined,
    adminRef: row.admin_ref ?? undefined,
    source: row.source === 'demo' ? 'demo' : 'real',
    creditCategory: row.credit_category,
    creditValue: toNumber(row.credit_value),
    usableFor: row.usable_for,
  };
}

function buildPaymentSummaries(sessions: PaymentSessionRow[], events: PaymentEventRow[]) {
  const latestEventBySession = new Map<string, PaymentEventRow>();
  const orphanEvents: PaymentEventRow[] = [];

  for (const event of events) {
    if (!event.session_id) {
      orphanEvents.push(event);
      continue;
    }

    const current = latestEventBySession.get(event.session_id);
    if (!current || current.created_at < event.created_at) {
      latestEventBySession.set(event.session_id, event);
    }
  }

  const sessionPayments = sessions.map((session) => {
    const event = latestEventBySession.get(session.id);
    return {
      id: event?.id ?? session.id,
      sessionId: session.id,
      provider: event?.provider ?? session.provider,
      planId: session.plan_id,
      amount: toNumber(event?.amount ?? session.amount),
      currency: event?.currency ?? session.currency,
      status: event?.status ?? session.status,
      createdAt: event?.created_at ?? session.created_at,
      providerOrderId: session.provider_order_id,
      eventType: event?.event_type ?? null,
      providerPaymentId: event?.provider_payment_id ?? null,
      verified: Boolean(event?.signature_verified ?? false),
    };
  });

  const orphanPayments = orphanEvents
    .filter((event) => !event.session_id || !sessions.some((session) => session.id === event.session_id))
    .map((event) => ({
      id: event.id,
      sessionId: event.session_id,
      provider: event.provider,
      planId: null,
      amount: toNumber(event.amount),
      currency: event.currency,
      status: event.status,
      createdAt: event.created_at,
      providerOrderId: null,
      eventType: event.event_type,
      providerPaymentId: event.provider_payment_id,
      verified: Boolean(event.signature_verified),
    }));

  return [...sessionPayments, ...orphanPayments].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    }

    const admin = createAdminClient();
    const { user, profile } = await requireUser(req, admin);

    const [
      subscriptionResult,
      trcLedgerResult,
      discountLedgerResult,
      discountUnitsResult,
      drawEntriesResult,
      winnerBenefitsResult,
      bookingsResult,
      paymentSessionsResult,
      paymentEventsResult,
      supportTicketsResult,
    ] = await Promise.all([
      admin
        .from('subscriptions')
        .select('plan_id,plan_name,plan_type,status,activated_at,expires_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle<SubscriptionRow>(),
      admin
        .from('credit_ledger')
        .select('id,type,credit_type,credit_category,amount,credit_value,usable_for,source,reason,booking_ref,admin_ref,created_at')
        .eq('user_id', user.id)
        .eq('credit_type', 'lucky_draw')
        .order('created_at', { ascending: false })
        .returns<CreditLedgerRow[]>(),
      admin
        .from('credit_ledger')
        .select('id,type,credit_type,credit_category,amount,credit_value,usable_for,source,reason,booking_ref,admin_ref,created_at')
        .eq('user_id', user.id)
        .eq('credit_type', 'discount')
        .order('created_at', { ascending: false })
        .returns<CreditLedgerRow[]>(),
      admin
        .from('discount_credit_units')
        .select('id,credit_category,credit_value,status,reserved_by_booking_id,reserved_for_traveler_key,reserved_until,redeemed_booking_id,created_at,updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .returns<DiscountCreditUnitRow[]>(),
      admin
        .from('weekly_draw_entries')
        .select('id,cycle_id,ticket_id,plan_id,plan_round_key,verification_status,verification_reason,draw_result,winner_rank,round_winner_rank,coupon_code,revealed_at,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .returns<DrawEntryRow[]>(),
      admin
        .from('winner_benefits')
        .select('id,cycle_id,coupon,benefit_value_inr,destination,batch_id,status,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .returns<WinnerBenefitRow[]>(),
      admin
        .from('bookings')
        .select('id,status,title,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .returns<BookingRow[]>(),
      admin
        .from('payment_sessions')
        .select('id,provider,provider_order_id,plan_id,amount,currency,status,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .returns<PaymentSessionRow[]>(),
      admin
        .from('payment_events')
        .select('id,session_id,provider,provider_payment_id,event_type,status,amount,currency,signature_verified,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .returns<PaymentEventRow[]>(),
      admin
        .from('support_tickets')
        .select('id,status,subject,category,priority,created_at,updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .returns<SupportTicketRow[]>(),
    ]);

    const results = [
      subscriptionResult,
      trcLedgerResult,
      discountLedgerResult,
      discountUnitsResult,
      drawEntriesResult,
      winnerBenefitsResult,
      bookingsResult,
      paymentSessionsResult,
      paymentEventsResult,
      supportTicketsResult,
    ];

    const failedResult = results.find((result) => result.error);
    if (failedResult?.error) {
      throw new HttpError(500, 'DASHBOARD_QUERY_FAILED');
    }

    const trcHistory = trcLedgerResult.data ?? [];
    const trcBalances = computeCreditBalances(trcHistory);
    const discountHistory = discountLedgerResult.data ?? [];
    const drawEntries = drawEntriesResult.data ?? [];
    return json({
      profile: {
        uid: profile.uid,
        fullName: profile.full_name ?? profile.email ?? profile.uid,
        role: 'customer',
        email: profile.email,
        phone: profile.phone,
        city: profile.city,
      },
      subscription: subscriptionResult.data
        ? {
            planId: subscriptionResult.data.plan_id,
            planName: subscriptionResult.data.plan_name,
            planType: subscriptionResult.data.plan_type,
            status: subscriptionResult.data.status,
            activatedAt: subscriptionResult.data.activated_at,
            expiresAt: subscriptionResult.data.expires_at,
          }
        : null,
      trc: {
        available: trcBalances.available,
        locked: trcBalances.locked,
        history: trcHistory.map(toLedgerEntry),
      },
      discountCredits: {
        availableUnits: (discountUnitsResult.data ?? []).map((unit) => ({
          id: unit.id,
          creditCategory: unit.credit_category,
          creditValue: toNumber(unit.credit_value),
          status: unit.status,
          reservedByBookingId: unit.reserved_by_booking_id,
          reservedForTravelerKey: unit.reserved_for_traveler_key,
          reservedUntil: unit.reserved_until,
          redeemedBookingId: unit.redeemed_booking_id,
          createdAt: unit.created_at,
          updatedAt: unit.updated_at,
        })),
        history: discountHistory.map(toLedgerEntry),
      },
      drawEntries: drawEntries.map((entry) => ({
        id: entry.id,
        cycleId: entry.cycle_id,
        ticketId: entry.ticket_id,
        planId: entry.plan_id,
        planRoundKey: entry.plan_round_key ? entry.plan_round_key.replace(':', '_') : null,
        verificationStatus: entry.verification_status,
        verificationReason: entry.verification_reason,
        drawResult: entry.draw_result,
        winnerRank: entry.winner_rank,
        roundWinnerRank: entry.round_winner_rank,
        couponCode: entry.coupon_code,
        revealedAt: entry.revealed_at,
        createdAt: entry.created_at,
      })),
      winnerBenefits: (winnerBenefitsResult.data ?? []).map((benefit) => ({
        id: benefit.id,
        cycleId: benefit.cycle_id,
        coupon: benefit.coupon,
        value: benefit.benefit_value_inr == null
          ? null
          : toNumber(benefit.benefit_value_inr),
        destination: benefit.destination,
        batchId: benefit.batch_id,
        status: benefit.status,
        createdAt: benefit.created_at,
      })),
      bookings: (bookingsResult.data ?? []).map((booking) => ({
        id: booking.id,
        status: booking.status,
        title: booking.title,
        createdAt: booking.created_at,
      })),
      payments: buildPaymentSummaries(paymentSessionsResult.data ?? [], paymentEventsResult.data ?? []),
      supportTickets: (supportTicketsResult.data ?? []).map((ticket) => ({
        id: ticket.id,
        status: ticket.status,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
      })),
    }, {}, req);
  } catch (error) {
    return errorResponse(error, req);
  }
});
