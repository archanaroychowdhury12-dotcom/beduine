import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAdminClient, requireAdmin } from '../_shared/auth.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'POST') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const admin = createAdminClient();
    const { user } = await requireAdmin(req, admin);
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const cycleId = String(body.cycleId || '');
    if (!/^BEDUINE-SUN-[0-9]{4}-[0-9]{2}-[0-9]{2}-1800-IST$/.test(cycleId)) {
      throw new HttpError(400, 'DRAW_CYCLE_INVALID');
    }

    const { data, error } = await admin.rpc('issue_non_winner_credits_v1', {
      p_cycle_id: cycleId,
      p_actor_id: user.id,
    });
    if (error) {
      console.error('Non-winner credit issuance failed', error.code, error.message);
      throw new HttpError(409, 'NON_WINNER_CREDIT_ISSUANCE_FAILED');
    }
    return json(data, {}, req);
  } catch (error) {
    return errorResponse(error, req);
  }
});
