// Beduine production payment webhook.
// This function verifies provider signatures and delegates all subscription/TRC changes
// to a single Postgres RPC transaction: public.process_verified_subscription_payment_v1.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  getRazorpayFulfillmentTarget,
  parseRazorpayWebhook,
  shouldApplyRazorpayPaymentTransition,
  verifyRazorpayWebhookSignature,
} from '../../../business_logic/payment/razorpayWebhook.service.ts';

serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: { code: 'METHOD_NOT_ALLOWED' } }, { status: 405 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || '';
  if (!supabaseUrl || !serviceRoleKey || !webhookSecret) {
    return Response.json({ error: { code: 'CONFIG_MISSING' } }, { status: 500 });
  }

  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > 1_048_576) {
    return Response.json({ error: { code: 'REQUEST_TOO_LARGE' } }, { status: 413 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';
  const eventId = req.headers.get('x-razorpay-event-id') || '';
  if (!await verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret)) {
    return Response.json({ error: { code: 'WEBHOOK_SIGNATURE_INVALID' } }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return Response.json({ error: { code: 'WEBHOOK_PAYLOAD_INVALID' } }, { status: 400 });
  }

  const eventType = String(payload.event || '');
  if (eventType.startsWith('refund.')) {
    if (!eventId || eventId.length > 255) {
      return Response.json({ error: { code: 'WEBHOOK_EVENT_ID_INVALID' } }, { status: 400 });
    }
    const refundEntity = (
      payload.payload as Record<string, unknown> | undefined
    )?.refund as Record<string, unknown> | undefined;
    const refund = refundEntity?.entity as Record<string, unknown> | undefined;
    const refundId = String(refund?.id || '');
    const entityStatus = String(refund?.status || '').toLowerCase();
    const refundStatus = eventType === 'refund.processed' && entityStatus === 'processed'
      ? 'processed'
      : eventType === 'refund.failed' && entityStatus === 'failed'
      ? 'failed'
      : eventType === 'refund.created' || entityStatus === 'pending'
      ? 'pending'
      : null;
    if (!refundId || !refundStatus) {
      return Response.json({ error: { code: 'REFUND_WEBHOOK_INVALID' } }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data, error } = await supabase.rpc('process_verified_refund_webhook_v1', {
      p_provider_event_id: eventId,
      p_provider_refund_id: refundId,
      p_provider_status: refundStatus,
      p_payload: payload,
      p_signature_verified: true,
    });
    if (error) {
      console.error('Razorpay refund webhook rejected', error.code, error.message);
      return Response.json({ error: { code: 'REFUND_FULFILLMENT_REJECTED' } }, { status: 409 });
    }
    return Response.json({
      received: true,
      provider: 'razorpay',
      refund: true,
      duplicate: Boolean(data?.duplicate),
      status: data?.status || refundStatus,
    });
  }

  let event;
  try {
    event = parseRazorpayWebhook(rawBody, eventId);
  } catch {
    return Response.json({ error: { code: 'WEBHOOK_PAYLOAD_INVALID' } }, { status: 400 });
  }

  if (!event.shouldProcess) {
    return Response.json({ received: true, ignored: true, eventType: event.eventType });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: session, error: sessionError } = await supabase
    .from('payment_sessions')
    .select('id,purpose,status')
    .eq('provider', 'razorpay')
    .eq('provider_order_id', event.orderId)
    .maybeSingle();
  if (sessionError || !session) {
    return Response.json({ error: { code: 'PAYMENT_SESSION_NOT_FOUND' } }, { status: 409 });
  }
  const fulfillmentTarget = getRazorpayFulfillmentTarget(session.purpose);
  if (fulfillmentTarget === 'unsupported') {
    return Response.json({ error: { code: 'PAYMENT_PURPOSE_NOT_SUPPORTED' } }, { status: 409 });
  }
  if (!shouldApplyRazorpayPaymentTransition(session.status, event.status)) {
    return Response.json({
      received: true,
      ignored: true,
      reason: 'PAYMENT_STATE_ALREADY_FINAL',
      status: session.status,
    });
  }

  const sharedRpcInput = {
    p_provider: 'razorpay',
    p_provider_event_id: event.eventId,
    p_idempotency_key: `razorpay:${event.eventId}`,
    p_provider_payment_id: event.paymentId,
    p_session_ref: event.orderId,
    p_event_type: event.eventType,
    p_status: event.status,
    p_amount: event.amountRupees,
    p_currency: event.currency,
    p_payload: payload,
    p_signature_verified: true,
  };
  const { data, error } = fulfillmentTarget === 'subscription'
    ? await supabase.rpc('process_verified_subscription_payment_v1', {
        ...sharedRpcInput,
        p_plan_name: '',
        p_plan_type: '',
      })
    : await supabase.rpc('process_verified_booking_payment_v1', sharedRpcInput);

  if (error) {
    console.error('Razorpay fulfillment rejected', error.code, error.message);
    return Response.json({ error: { code: 'PAYMENT_FULFILLMENT_REJECTED' } }, { status: 409 });
  }
  return Response.json({
    received: true,
    provider: 'razorpay',
    duplicate: Boolean(data?.duplicate),
    status: data?.status || event.status,
    ...(data?.bookingId ? { bookingId: data.bookingId } : {}),
  });
});
