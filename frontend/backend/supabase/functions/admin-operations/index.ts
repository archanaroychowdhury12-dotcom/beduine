import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAdminClient, requireAdmin } from '../_shared/auth.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';
import { requireEnv } from '../_shared/razorpay.ts';

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new HttpError(400, 'ADMIN_OPERATION_PAYLOAD_INVALID');
  }
  return value as UnknownRecord;
}

function text(
  value: unknown,
  code: string,
  max: number,
  min = 1,
): string {
  const normalized = String(value ?? '').trim();
  if (normalized.length < min || normalized.length > max) {
    throw new HttpError(400, code);
  }
  return normalized;
}

function optionalText(value: unknown, code: string, max: number): string | null {
  const normalized = String(value ?? '').trim();
  if (!normalized) return null;
  if (normalized.length > max) throw new HttpError(400, code);
  return normalized;
}

function requestId(value: unknown): string {
  const parsed = text(value, 'REQUEST_ID_INVALID', 40, 8);
  if (!/^CAN-[A-Z0-9-]+$/i.test(parsed)) {
    throw new HttpError(400, 'REQUEST_ID_INVALID');
  }
  return parsed;
}

function proofUrl(value: unknown): string | null {
  const parsed = optionalText(value, 'SUPPLIER_PROOF_URL_INVALID', 2_000);
  if (!parsed) return null;
  let url: URL;
  try {
    url = new URL(parsed);
  } catch {
    throw new HttpError(400, 'SUPPLIER_PROOF_URL_INVALID');
  }
  if (url.protocol !== 'https:') {
    throw new HttpError(400, 'SUPPLIER_PROOF_URL_INVALID');
  }
  return url.toString();
}

function mapCancellation(row: UnknownRecord, emailByUserId: Map<string, string>) {
  const calculation = row.calculation && typeof row.calculation === 'object'
    ? row.calculation as UnknownRecord
    : undefined;
  const status = row.status === 'submitted' || row.status === 'under_review'
    ? 'admin_review'
    : row.status;

  return {
    requestId: row.id,
    bookingId: row.booking_id,
    userId: row.user_id,
    userEmail: emailByUserId.get(String(row.user_id)),
    status,
    reason: row.reason,
    refundPreference: row.requested_refund_preference || 'cash_refund',
    refundMode: row.refund_mode || undefined,
    totalTourCost: Number(row.total_tour_cost || 0),
    amountPaid: Number(row.paid_amount || 0),
    travelerCount: Number(row.traveler_count || 1),
    departureDate: row.departure_date,
    supplierCharges: Number(row.supplier_charges || 0),
    supplierProofUrls: row.supplier_proof_urls || [],
    estimatedRefund: row.approved_refund_amount == null
      ? undefined
      : Number(row.approved_refund_amount),
    calculation,
    refundStatus: row.refund_status || undefined,
    providerRefundId: row.provider_refund_id || undefined,
    requestedAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function listCancellations(
  admin: ReturnType<typeof createAdminClient>,
) {
  const { data, error } = await admin
    .from('cancellation_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw new HttpError(500, 'CANCELLATION_LIST_FAILED');

  const userIds = [...new Set((data || []).map((row) => String(row.user_id)))];
  const emailByUserId = new Map<string, string>();
  if (userIds.length > 0) {
    const { data: profiles, error: profileError } = await admin
      .from('profiles')
      .select('id,email')
      .in('id', userIds);
    if (profileError) throw new HttpError(500, 'PROFILE_LIST_FAILED');
    for (const profile of profiles || []) {
      emailByUserId.set(String(profile.id), String(profile.email || ''));
    }
  }
  return (data || []).map((row) => mapCancellation(row, emailByUserId));
}

async function resolveCapturedPaymentId(
  admin: ReturnType<typeof createAdminClient>,
  bookingId: string,
): Promise<string> {
  const { data: sessions, error: sessionError } = await admin
    .from('payment_sessions')
    .select('id')
    .eq('provider', 'razorpay')
    .eq('reference_id', bookingId)
    .eq('status', 'verified')
    .order('updated_at', { ascending: false })
    .limit(10);
  if (sessionError) throw new HttpError(500, 'PAYMENT_LOOKUP_FAILED');
  const sessionIds = (sessions || []).map((session) => session.id);
  if (sessionIds.length === 0) throw new HttpError(409, 'CAPTURED_PAYMENT_NOT_FOUND');

  const { data: event, error: eventError } = await admin
    .from('payment_events')
    .select('provider_payment_id')
    .in('session_id', sessionIds)
    .eq('provider', 'razorpay')
    .eq('signature_verified', true)
    .eq('status', 'verified')
    .not('provider_payment_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (eventError || !event?.provider_payment_id) {
    throw new HttpError(409, 'CAPTURED_PAYMENT_NOT_FOUND');
  }
  return String(event.provider_payment_id);
}

interface RazorpayRefund {
  id: string;
  payment_id: string;
  amount: number;
  currency: 'INR';
  status: 'pending' | 'processed' | 'failed';
}

async function createRazorpayRefund(input: {
  paymentId: string;
  amountPaise: number;
  receipt: string;
  requestId: string;
  bookingId: string;
}): Promise<RazorpayRefund> {
  const keyId = requireEnv('RAZORPAY_KEY_ID');
  const keySecret = requireEnv('RAZORPAY_KEY_SECRET');
  const response = await fetch(
    `https://api.razorpay.com/v1/payments/${encodeURIComponent(input.paymentId)}/refund`,
    {
      method: 'POST',
      headers: {
        authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        amount: input.amountPaise,
        speed: 'normal',
        receipt: input.receipt,
        notes: {
          requestId: input.requestId,
          bookingId: input.bookingId,
        },
      }),
    },
  );
  if (!response.ok) {
    console.error('Razorpay refund request failed', response.status);
    throw new HttpError(502, 'REFUND_PROVIDER_REJECTED');
  }
  const refund = await response.json() as Partial<RazorpayRefund>;
  if (
    typeof refund.id !== 'string'
    || refund.payment_id !== input.paymentId
    || refund.amount !== input.amountPaise
    || refund.currency !== 'INR'
    || !['pending', 'processed', 'failed'].includes(String(refund.status))
  ) {
    throw new HttpError(502, 'REFUND_PROVIDER_RESPONSE_INVALID');
  }
  return refund as RazorpayRefund;
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'POST') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 32_768) throw new HttpError(413, 'REQUEST_TOO_LARGE');

    const admin = createAdminClient();
    const { user } = await requireAdmin(req, admin);
    const body = asRecord(await req.json().catch(() => null));
    const action = String(body.action || '');

    if (action === 'list_cancellations') {
      return json({ requests: await listCancellations(admin) }, {}, req);
    }

    if (action === 'review_cancellation') {
      const supplierCharges = Number(body.supplierCharges || 0);
      if (
        !Number.isFinite(supplierCharges)
        || supplierCharges < 0
        || supplierCharges > 100_000_000
      ) {
        throw new HttpError(400, 'SUPPLIER_CHARGES_INVALID');
      }
      const approve = body.approve === true;
      const refundMode = String(body.refundMode || '');
      if (approve && !['cash_refund', 'credit_adjustment'].includes(refundMode)) {
        throw new HttpError(400, 'REFUND_MODE_INVALID');
      }
      const { data, error } = await admin.rpc('admin_review_cancellation_v1', {
        p_request_id: requestId(body.requestId),
        p_actor_id: user.id,
        p_approve: approve,
        p_refund_mode: approve ? refundMode : null,
        p_supplier_charges: Math.round(supplierCharges * 100) / 100,
        p_supplier_proof_url: proofUrl(body.supplierProofUrl),
        p_admin_note: optionalText(body.adminNote, 'ADMIN_NOTE_INVALID', 2_000),
      });
      if (error) throw new HttpError(409, 'CANCELLATION_REVIEW_REJECTED');
      return json(data, {}, req);
    }

    if (action === 'process_cancellation_payout') {
      const id = requestId(body.requestId);
      const { data: payout, error: payoutError } = await admin.rpc(
        'admin_process_cancellation_payout_v1',
        { p_request_id: id, p_actor_id: user.id },
      );
      if (payoutError) throw new HttpError(409, 'CANCELLATION_PAYOUT_REJECTED');
      if (!payout?.shouldCallProvider) return json(payout, {}, req);

      const paymentId = await resolveCapturedPaymentId(admin, String(payout.bookingId));
      try {
        const refund = await createRazorpayRefund({
          paymentId,
          amountPaise: Math.round(Number(payout.amount) * 100),
          receipt: String(payout.receipt),
          requestId: id,
          bookingId: String(payout.bookingId),
        });
        const { data, error } = await admin.rpc('admin_mark_refund_result_v1', {
          p_request_id: id,
          p_actor_id: user.id,
          p_status: refund.status,
          p_provider_ref: refund.id,
          p_provider_payment_id: refund.payment_id,
          p_payload: refund,
        });
        if (error) throw new HttpError(500, 'REFUND_RESULT_PERSIST_FAILED');
        return json(data, {}, req);
      } catch (error) {
        await admin.rpc('admin_mark_refund_result_v1', {
          p_request_id: id,
          p_actor_id: user.id,
          p_status: 'failed',
          p_provider_ref: '',
          p_provider_payment_id: paymentId,
          p_payload: { error: 'REFUND_PROVIDER_REJECTED' },
        });
        throw error;
      }
    }

    throw new HttpError(400, 'ADMIN_OPERATION_INVALID');
  } catch (error) {
    return errorResponse(error, req);
  }
});
