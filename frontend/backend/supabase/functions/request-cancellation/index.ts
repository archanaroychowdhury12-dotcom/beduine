import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAdminClient, requireUser } from '../_shared/auth.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';

type UnknownRecord = Record<string, unknown>;

const safeDatabaseErrors = [
  'BOOKING_NOT_FOUND',
  'BOOKING_FORBIDDEN',
  'BOOKING_NOT_CANCELLABLE',
  'CANCELLATION_ALREADY_OPEN',
  'CANCELLATION_REASON_INVALID',
  'REFUND_PREFERENCE_INVALID',
];

function parseInput(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new HttpError(400, 'CANCELLATION_PAYLOAD_INVALID');
  }
  const input = value as UnknownRecord;
  const bookingId = String(input.bookingId || '').trim();
  const reason = String(input.reason || '').trim();
  const refundPreference = String(input.refundPreference || '');

  if (!/^[a-z0-9:-]{4,100}$/i.test(bookingId)) {
    throw new HttpError(400, 'BOOKING_ID_INVALID');
  }
  if (reason.length < 5 || reason.length > 2_000) {
    throw new HttpError(400, 'CANCELLATION_REASON_INVALID');
  }
  if (!['cash_refund', 'credit_adjustment'].includes(refundPreference)) {
    throw new HttpError(400, 'REFUND_PREFERENCE_INVALID');
  }

  return { bookingId, reason, refundPreference };
}

function databaseError(message: string) {
  const code = safeDatabaseErrors.find((candidate) => message.includes(candidate));
  return new HttpError(
    code === 'BOOKING_NOT_FOUND' ? 404 : 409,
    code || 'CANCELLATION_REQUEST_REJECTED',
  );
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'POST') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 16_384) throw new HttpError(413, 'REQUEST_TOO_LARGE');

    const admin = createAdminClient();
    const { user } = await requireUser(req, admin);
    const input = parseInput(await req.json().catch(() => null));
    const { data, error } = await admin.rpc('create_cancellation_request_v1', {
      p_booking_id: input.bookingId,
      p_user_id: user.id,
      p_reason: input.reason,
      p_refund_preference: input.refundPreference,
    });
    if (error) throw databaseError(error.message);

    return json(data, { status: 201 }, req);
  } catch (error) {
    return errorResponse(error, req);
  }
});
