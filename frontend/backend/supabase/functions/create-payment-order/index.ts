import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAdminClient, requireUser } from '../_shared/auth.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';
import {
  buildRazorpayOrder,
  createRazorpayOrder,
  requireEnv,
} from '../_shared/razorpay.ts';

type PaymentPurpose = 'subscription' | 'tour_booking' | 'installment';

interface CreateOrderInput {
  purpose: PaymentPurpose;
  referenceId: string;
}

interface AuthoritativePayment {
  amountRupees: number;
  description: string;
  planId: string | null;
}

const subscriptionAliases: Record<string, string> = {
  silver: 'domestic_silver',
  gold: 'domestic_gold',
  platinum: 'domestic_platinum',
  silver_int: 'international_silver',
  gold_int: 'international_gold',
  platinum_int: 'international_platinum',
};

function parseInput(value: unknown): CreateOrderInput {
  if (!value || typeof value !== 'object') throw new HttpError(400, 'INVALID_REQUEST');
  const record = value as Record<string, unknown>;
  const purpose = String(record.purpose || '') as PaymentPurpose;
  const referenceId = String(record.referenceId || '').trim();

  if (!['subscription', 'tour_booking', 'installment'].includes(purpose)) {
    throw new HttpError(400, 'PAYMENT_PURPOSE_INVALID');
  }
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(referenceId)) {
    throw new HttpError(400, 'PAYMENT_REFERENCE_INVALID');
  }
  return { purpose, referenceId };
}

async function resolveAuthoritativePayment(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  input: CreateOrderInput,
): Promise<AuthoritativePayment> {
  if (input.purpose === 'subscription') {
    const normalized = input.referenceId.toLowerCase();
    const planId = subscriptionAliases[normalized] || normalized;
    const { data, error } = await admin
      .from('membership_plans')
      .select('id,name,price_inr,currency')
      .eq('id', planId)
      .eq('active', true)
      .maybeSingle();

    if (error) throw new HttpError(500, 'PLAN_LOOKUP_FAILED');
    if (!data || data.currency !== 'INR') throw new HttpError(404, 'PLAN_NOT_AVAILABLE');
    return {
      amountRupees: Number(data.price_inr),
      description: `${data.name} membership`,
      planId: data.id,
    };
  }

  if (input.purpose === 'tour_booking') {
    const { data, error } = await admin
      .from('bookings')
      .select('id,amount_due_now,currency,status,tour_name,reservation_expires_at')
      .eq('id', input.referenceId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new HttpError(500, 'BOOKING_LOOKUP_FAILED');
    if (
      !data
      || data.currency !== 'INR'
      || data.status !== 'pending_payment'
      || !data.reservation_expires_at
      || new Date(data.reservation_expires_at).getTime() <= Date.now()
    ) {
      throw new HttpError(404, 'BOOKING_NOT_PAYABLE');
    }
    return {
      amountRupees: Number(data.amount_due_now),
      description: `${data.tour_name || 'Beduine tour'} advance`,
      planId: null,
    };
  }

  const { data, error } = await admin
    .from('booking_installments')
    .select('id,booking_id,amount,currency,status,bookings!inner(user_id,tour_name)')
    .eq('id', input.referenceId)
    .eq('bookings.user_id', userId)
    .maybeSingle();

  if (error) throw new HttpError(500, 'INSTALLMENT_LOOKUP_FAILED');
  if (!data || data.currency !== 'INR' || data.status !== 'upcoming') {
    throw new HttpError(404, 'INSTALLMENT_NOT_PAYABLE');
  }
  return {
    amountRupees: Number(data.amount),
    description: 'Beduine tour installment',
    planId: null,
  };
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'POST') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 8_192) throw new HttpError(413, 'REQUEST_TOO_LARGE');

    const admin = createAdminClient();
    const { user } = await requireUser(req, admin);
    const input = parseInput(await req.json());
    const payment = await resolveAuthoritativePayment(admin, user.id, input);

    if (!Number.isSafeInteger(payment.amountRupees) || payment.amountRupees <= 0) {
      throw new HttpError(409, 'AUTHORITATIVE_AMOUNT_INVALID');
    }

    const { data: session, error: sessionError } = await admin
      .from('payment_sessions')
      .insert({
        user_id: user.id,
        provider: 'razorpay',
        purpose: input.purpose,
        reference_id: payment.planId || input.referenceId,
        plan_id: payment.planId,
        amount: payment.amountRupees,
        expected_amount: payment.amountRupees,
        amount_paise: payment.amountRupees * 100,
        currency: 'INR',
        expected_currency: 'INR',
        description: payment.description,
        status: 'created',
      })
      .select('id')
      .single();

    if (sessionError || !session) {
      throw new HttpError(
        sessionError?.code === '23505' ? 409 : 500,
        sessionError?.code === '23505' ? 'PAYMENT_ORDER_ALREADY_OPEN' : 'PAYMENT_SESSION_CREATE_FAILED',
      );
    }

    try {
      const orderRequest = buildRazorpayOrder({
        purpose: input.purpose,
        referenceId: payment.planId || input.referenceId,
        authoritativeAmountRupees: payment.amountRupees,
        sessionId: session.id,
      });
      const order = await createRazorpayOrder(orderRequest);
      const { error: updateError } = await admin
        .from('payment_sessions')
        .update({
          provider_order_id: order.id,
          status: 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.id)
        .eq('user_id', user.id);
      if (updateError) throw new HttpError(500, 'PAYMENT_SESSION_UPDATE_FAILED');

      return json({
        sessionId: session.id,
        keyId: requireEnv('RAZORPAY_KEY_ID'),
        orderId: order.id,
        amountPaise: order.amount,
        currency: 'INR',
        description: payment.description,
      }, {}, req);
    } catch (error) {
      await admin
        .from('payment_sessions')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', session.id);
      throw error;
    }
  } catch (error) {
    return errorResponse(error, req);
  }
});
