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

async function listAdminUsers(
  admin: ReturnType<typeof createAdminClient>,
) {
  const [{ data: profiles, error: profileError }, { data: subscriptions, error: subscriptionError }] = await Promise.all([
    admin
      .from('profiles')
      .select('id,uid,email,full_name,phone,city,role,created_at')
      .order('created_at', { ascending: false })
      .limit(500),
    admin
      .from('subscriptions')
      .select('user_id,plan_id,plan_name,plan_type,status,activated_at,expires_at')
      .order('activated_at', { ascending: false })
      .limit(1000),
  ]);
  if (profileError || subscriptionError) throw new HttpError(500, 'ADMIN_USER_LIST_FAILED');

  const subscriptionByUser = new Map<string, UnknownRecord>();
  for (const subscription of subscriptions || []) {
    const userId = String(subscription.user_id);
    if (!subscriptionByUser.has(userId)) subscriptionByUser.set(userId, subscription);
  }

  return (profiles || []).map((profile) => {
    const subscription = subscriptionByUser.get(String(profile.id));
    return {
      id: profile.id,
      email: profile.email,
      phone: profile.phone,
      created_at: profile.created_at,
      user_metadata: {
        full_name: profile.full_name,
        phone: profile.phone,
        city: profile.city,
        role: profile.role,
        uid: profile.uid,
        planName: subscription?.plan_name || null,
        planType: subscription?.plan_type || null,
        subscriptionStatus: subscription?.status || 'inactive',
        subscription_source: subscription ? 'real' : 'none',
        is_demo_user: false,
        real_wallet_balance: 0,
        demo_wallet_balance: 0,
        discount_credits: 0,
        ledger: [],
        demo_transactions: [],
      },
    };
  });
}

async function listAuditLogs(
  admin: ReturnType<typeof createAdminClient>,
  cursor: unknown,
) {
  let query = admin
    .from('audit_logs')
    .select('id,action,actor_id,actor_email,actor_role,target_id,target_email,amount,status,reason,metadata,created_at')
    .order('created_at', { ascending: false })
    .limit(101);
  if (cursor) {
    const parsed = text(cursor, 'AUDIT_CURSOR_INVALID', 40, 20);
    if (Number.isNaN(Date.parse(parsed))) throw new HttpError(400, 'AUDIT_CURSOR_INVALID');
    query = query.lt('created_at', parsed);
  }
  const { data, error } = await query;
  if (error) throw new HttpError(500, 'AUDIT_LOG_LIST_FAILED');
  const hasMore = (data || []).length > 100;
  const rows = (data || []).slice(0, 100);
  return {
    logs: rows.map((row) => ({
      id: row.id,
      action: row.action,
      actorId: row.actor_id || '',
      actorEmail: row.actor_email || '',
      actorRole: row.actor_role || 'customer',
      targetId: row.target_id || undefined,
      targetEmail: row.target_email || undefined,
      amount: row.amount == null ? undefined : Number(row.amount),
      status: row.status,
      reason: row.reason,
      metadata: row.metadata || undefined,
      created_at: row.created_at,
      environment: 'production',
    })),
    nextCursor: hasMore ? rows[rows.length - 1]?.created_at : undefined,
  };
}

function mapAdminSupportTicket(row: UnknownRecord, emailByUserId: Map<string, string>) {
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: emailByUserId.get(String(row.user_id)),
    subject: row.subject,
    category: row.category,
    priority: row.priority,
    status: row.status,
    assignedAdminId: row.assigned_admin_id || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages: Array.isArray(row.support_ticket_messages)
      ? row.support_ticket_messages.map((message) => {
        const value = asRecord(message);
        return {
          id: value.id,
          ticketId: value.ticket_id,
          senderRole: value.sender_role,
          message: value.message,
          internalNote: value.internal_note,
          createdAt: value.created_at,
        };
      })
      : [],
  };
}

const adminSupportSelect = `
  id,
  user_id,
  subject,
  category,
  priority,
  status,
  assigned_admin_id,
  created_at,
  updated_at,
  support_ticket_messages(
    id,
    ticket_id,
    sender_role,
    message,
    internal_note,
    created_at
  )
`;

async function listAdminSupportTickets(
  admin: ReturnType<typeof createAdminClient>,
) {
  const { data, error } = await admin
    .from('support_tickets')
    .select(adminSupportSelect)
    .order('updated_at', { ascending: false })
    .limit(200);
  if (error) throw new HttpError(500, 'SUPPORT_TICKET_LIST_FAILED');

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
  return (data || []).map((row) => mapAdminSupportTicket(row, emailByUserId));
}

async function getAdminSupportTicket(
  admin: ReturnType<typeof createAdminClient>,
  id: string,
) {
  const { data, error } = await admin
    .from('support_tickets')
    .select(adminSupportSelect)
    .eq('id', id)
    .maybeSingle();
  if (error) throw new HttpError(500, 'SUPPORT_TICKET_LOOKUP_FAILED');
  if (!data) throw new HttpError(404, 'SUPPORT_TICKET_NOT_FOUND');
  const { data: profile } = await admin
    .from('profiles')
    .select('id,email')
    .eq('id', data.user_id)
    .maybeSingle();
  return mapAdminSupportTicket(
    data,
    new Map(profile ? [[String(profile.id), String(profile.email || '')]] : []),
  );
}

function supportTicketId(value: unknown): string {
  const parsed = text(value, 'SUPPORT_TICKET_ID_INVALID', 20, 8);
  if (!/^SUP-[0-9]{6,}$/.test(parsed)) {
    throw new HttpError(400, 'SUPPORT_TICKET_ID_INVALID');
  }
  return parsed;
}

function optionalUuid(value: unknown): string | null {
  if (value == null || value === '') return null;
  const parsed = String(value);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parsed)) {
    throw new HttpError(400, 'SUPPORT_ASSIGNEE_INVALID');
  }
  return parsed;
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

    if (action === 'list_users') {
      return json({ users: await listAdminUsers(admin) }, {}, req);
    }

    if (action === 'list_audit_logs') {
      return json(await listAuditLogs(admin, body.cursor), {}, req);
    }

    if (action === 'list_support_tickets') {
      return json({ tickets: await listAdminSupportTickets(admin) }, {}, req);
    }

    if (action === 'update_support_ticket') {
      const status = body.status == null ? null : String(body.status);
      const priority = body.priority == null ? null : String(body.priority);
      if (status && !['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'].includes(status)) {
        throw new HttpError(400, 'SUPPORT_STATUS_INVALID');
      }
      if (priority && !['low', 'normal', 'high', 'urgent'].includes(priority)) {
        throw new HttpError(400, 'SUPPORT_PRIORITY_INVALID');
      }
      const id = supportTicketId(body.ticketId);
      const message = optionalText(body.message, 'SUPPORT_MESSAGE_INVALID', 5_000);
      if (message && message.length < 3) throw new HttpError(400, 'SUPPORT_MESSAGE_INVALID');
      const { error } = await admin.rpc('admin_update_support_ticket_v1', {
        p_ticket_id: id,
        p_actor_id: user.id,
        p_status: status,
        p_priority: priority,
        p_assigned_admin_id: optionalUuid(body.assignedAdminId),
        p_message: message,
        p_internal_note: body.internalNote === true,
      });
      if (error) throw new HttpError(409, 'SUPPORT_TICKET_UPDATE_REJECTED');
      return json({ ticket: await getAdminSupportTicket(admin, id) }, {}, req);
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
