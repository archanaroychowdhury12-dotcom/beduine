import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAdminClient, requireUser } from '../_shared/auth.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';

type UnknownRecord = Record<string, unknown>;
const categories = new Set([
  'account',
  'payment',
  'subscription',
  'booking',
  'lucky_draw',
  'refund',
  'other',
]);

function asRecord(value: unknown): UnknownRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new HttpError(400, 'SUPPORT_PAYLOAD_INVALID');
  }
  return value as UnknownRecord;
}

function text(value: unknown, code: string, max: number, min: number): string {
  const normalized = String(value ?? '').trim();
  if (normalized.length < min || normalized.length > max) {
    throw new HttpError(400, code);
  }
  return normalized;
}

function ticketId(value: unknown): string {
  const parsed = text(value, 'SUPPORT_TICKET_ID_INVALID', 20, 8);
  if (!/^SUP-[0-9]{6,}$/.test(parsed)) {
    throw new HttpError(400, 'SUPPORT_TICKET_ID_INVALID');
  }
  return parsed;
}

function mapMessage(value: unknown) {
  const row = asRecord(value);
  return {
    id: row.id,
    ticketId: row.ticket_id,
    senderRole: row.sender_role,
    message: row.message,
    createdAt: row.created_at,
  };
}

function mapTicket(value: unknown) {
  const row = asRecord(value);
  return {
    id: row.id,
    subject: row.subject,
    category: row.category,
    priority: row.priority,
    status: row.status,
    assignedAdminId: row.assigned_admin_id || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messages: Array.isArray(row.support_ticket_messages)
      ? row.support_ticket_messages
        .filter((message) => !asRecord(message).internal_note)
        .map(mapMessage)
      : [],
  };
}

const ticketSelect = `
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

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    }
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 16_384) throw new HttpError(413, 'REQUEST_TOO_LARGE');

    const admin = createAdminClient();
    const { user } = await requireUser(req, admin);

    if (req.method === 'GET') {
      const { data, error } = await admin
        .from('support_tickets')
        .select(ticketSelect)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(100);
      if (error) throw new HttpError(500, 'SUPPORT_TICKET_LIST_FAILED');
      return json({ tickets: (data || []).map(mapTicket) }, {}, req);
    }

    const body = asRecord(await req.json().catch(() => null));
    const action = String(body.action || 'create');
    if (action === 'create') {
      const category = String(body.category || 'other');
      if (!categories.has(category)) throw new HttpError(400, 'SUPPORT_CATEGORY_INVALID');
      const { data, error } = await admin.rpc('create_support_ticket_v1', {
        p_user_id: user.id,
        p_subject: text(body.subject, 'SUPPORT_SUBJECT_INVALID', 200, 3),
        p_category: category,
        p_message: text(body.message, 'SUPPORT_MESSAGE_INVALID', 5_000, 3),
      });
      if (error) throw new HttpError(409, 'SUPPORT_TICKET_CREATE_FAILED');
      return json({ ticket: data }, { status: 201 }, req);
    }
    if (action === 'reply') {
      const { data, error } = await admin.rpc('add_support_ticket_message_v1', {
        p_ticket_id: ticketId(body.ticketId),
        p_user_id: user.id,
        p_message: text(body.message, 'SUPPORT_MESSAGE_INVALID', 5_000, 3),
      });
      if (error) throw new HttpError(409, 'SUPPORT_TICKET_REPLY_FAILED');
      return json({ message: data }, { status: 201 }, req);
    }
    throw new HttpError(400, 'SUPPORT_ACTION_INVALID');
  } catch (error) {
    return errorResponse(error, req);
  }
});
