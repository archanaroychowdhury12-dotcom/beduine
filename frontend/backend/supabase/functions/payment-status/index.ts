import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAdminClient, requireUser } from '../_shared/auth.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';

function normalizeStatus(value: string) {
  if (value === 'verified' || value === 'failed' || value === 'refunded' || value === 'chargeback') {
    return value;
  }
  return 'pending';
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'POST') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 4_096) throw new HttpError(413, 'REQUEST_TOO_LARGE');

    const body = await req.json() as Record<string, unknown>;
    const sessionId = String(body.sessionId || '').trim();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
      throw new HttpError(400, 'PAYMENT_SESSION_INVALID');
    }

    const admin = createAdminClient();
    const { user } = await requireUser(req, admin);
    const { data: session, error } = await admin
      .from('payment_sessions')
      .select('id,purpose,reference_id,plan_id,status')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw new HttpError(500, 'PAYMENT_STATUS_LOOKUP_FAILED');
    if (!session) throw new HttpError(404, 'PAYMENT_SESSION_NOT_FOUND');

    let subscriptionId: string | undefined;
    if (session.status === 'verified' && session.purpose === 'subscription' && session.plan_id) {
      const { data: subscription } = await admin
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('plan_id', session.plan_id)
        .eq('status', 'active')
        .maybeSingle();
      subscriptionId = subscription?.id;
    }

    return json({
      sessionId: session.id,
      status: normalizeStatus(session.status),
      ...(subscriptionId ? { subscriptionId } : {}),
      ...(session.purpose === 'tour_booking' ? { bookingId: session.reference_id } : {}),
    }, {}, req);
  } catch (error) {
    return errorResponse(error, req);
  }
});
