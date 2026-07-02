// Beduine weekly draw status Edge Function.
// Gives admin/customer UI the Sunday 6 PM auto-freeze cycle and plan-round summary.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAdminClient, requireAuthenticated } from '../_shared/auth.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';
import { getStatusCycleSchedule } from '../_shared/weeklyDrawSchedule.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    }
    const admin = createAdminClient();
    await requireAuthenticated(req, admin);
    const { cycleId, freezeAtIso } = getStatusCycleSchedule();
    const { data: cycle, error: cycleError } = await admin
      .from('weekly_draw_cycles')
      .select('id,status,reveal_cursor,revealed_winner_count,winner_count')
      .eq('id', cycleId)
      .maybeSingle();
    if (cycleError) throw new HttpError(500, 'DRAW_CYCLE_LOOKUP_FAILED');

    const { data: entries, error } = await admin
      .from('weekly_draw_entries')
      .select('plan_round_key,verification_status,revealed_at,draw_result')
      .eq('cycle_id', cycleId);
    if (error) throw new HttpError(500, 'DRAW_STATUS_LOOKUP_FAILED');

    const approvedRounds = [
      'domestic_silver',
      'domestic_gold',
      'domestic_platinum',
      'international_silver',
      'international_gold',
      'international_platinum',
    ];
    const roundMap = new Map(
      approvedRounds.map((key) => [
        key,
        { participantCount: 0, winnerCount: 0, revealedCount: 0 },
      ]),
    );
    for (const entry of entries || []) {
      const key = String(entry.plan_round_key || '').replace(':', '_');
      const current = roundMap.get(key);
      if (!current) continue;
      if (entry.verification_status === 'verified') current.participantCount += 1;
      if (entry.draw_result === 'winner') current.winnerCount += 1;
      if (entry.draw_result === 'winner' && entry.revealed_at) current.revealedCount += 1;
    }

    const rounds = Array.from(roundMap.entries()).map(([roundKey, value]) => {
      const [category, tier] = roundKey.split('_');
      return {
        roundKey,
        label: `${category[0].toUpperCase()}${category.slice(1)} ${tier[0].toUpperCase()}${tier.slice(1)}`,
        category,
        tier,
        ...value,
      };
    });
    const hasUnrevealedWinner = rounds.some(
      (round) => round.revealedCount < round.winnerCount,
    );
    const status = cycle?.status === 'completed'
      ? cycle.revealed_winner_count > 0 && hasUnrevealedWinner
        ? 'revealing'
        : hasUnrevealedWinner
          ? 'winner_pool_ready'
          : 'published'
      : cycle?.status === 'draft'
        ? 'entry_open'
        : cycle?.status || 'auto_freeze_pending';

    return json({
      cycleId,
      freezeAtIso,
      timezone: 'Asia/Kolkata',
      status,
      rounds,
      canRevealNextWinner: cycle?.status === 'completed' && hasUnrevealedWinner,
    }, {}, req);
  } catch (error) {
    return errorResponse(error, req);
  }
});
