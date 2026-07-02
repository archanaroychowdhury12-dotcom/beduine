import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAdminClient, requireUser } from '../_shared/auth.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';

function mapParticipationError(error: { message?: string }): HttpError {
  const message = error.message || '';
  const knownErrors: Array<[string, number]> = [
    ['ALREADY_PARTICIPATING', 409],
    ['DRAW_ENTRY_CLOSED', 409],
    ['SUBSCRIPTION_INACTIVE', 422],
    ['SUBSCRIPTION_PLAN_INVALID', 422],
    ['NO_TRC_AVAILABLE', 422],
  ];
  const match = knownErrors.find(([code]) => message.includes(code));
  return match
    ? new HttpError(match[1], match[0])
    : new HttpError(500, 'DRAW_PARTICIPATION_FAILED');
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'POST') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const admin = createAdminClient();
    const { user } = await requireUser(req, admin);
    const { data, error } = await admin.rpc('participate_weekly_draw_v1', {
      p_user_id: user.id,
      p_now: new Date().toISOString(),
    });

    if (error) throw mapParticipationError(error);
    return json(data, {}, req);
  } catch (error) {
    return errorResponse(error, req);
  }
});
