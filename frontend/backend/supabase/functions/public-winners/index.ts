import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAdminClient } from '../_shared/auth.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'GET') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const admin = createAdminClient();
    const { data: cycles, error: cycleError } = await admin
      .from('weekly_draw_cycles')
      .select('id,published_at,draw_date')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(12);
    if (cycleError) throw new HttpError(500, 'PUBLIC_WINNERS_LOOKUP_FAILED');

    const cycleIds = (cycles || []).map((cycle) => cycle.id);
    if (cycleIds.length === 0) return json({ winners: [] }, {}, req);

    const { data: entries, error: entryError } = await admin
      .from('weekly_draw_entries')
      .select('id,cycle_id,user_id,ticket_id,plan_round_key,coupon_code,revealed_at')
      .in('cycle_id', cycleIds)
      .eq('draw_result', 'winner')
      .order('revealed_at', { ascending: false })
      .limit(100);
    if (entryError) throw new HttpError(500, 'PUBLIC_WINNERS_LOOKUP_FAILED');

    const userIds = [...new Set((entries || []).map((entry) => entry.user_id))];
    const entryIds = (entries || []).map((entry) => entry.id);
    const [{ data: profiles }, { data: benefits }] = await Promise.all([
      admin.from('profiles').select('id,uid,full_name').in('id', userIds),
      admin
        .from('winner_benefits')
        .select('draw_entry_id,coupon,benefit_value_inr,destination,status')
        .in('draw_entry_id', entryIds),
    ]);
    const profileById = new Map((profiles || []).map((profile) => [profile.id, profile]));
    const benefitByEntry = new Map(
      (benefits || []).map((benefit) => [benefit.draw_entry_id, benefit]),
    );
    const cycleById = new Map((cycles || []).map((cycle) => [cycle.id, cycle]));

    const winners = (entries || []).flatMap((entry) => {
      const profile = profileById.get(entry.user_id);
      if (!profile) return [];
      const benefit = benefitByEntry.get(entry.id);
      const benefitSummary = benefit?.destination
        ? `Winner tour benefit: ${benefit.destination}`
        : benefit?.benefit_value_inr
          ? `Winner tour benefit INR ${Number(benefit.benefit_value_inr).toLocaleString('en-IN')}`
          : undefined;
      return [{
        name: profile.full_name || 'Beduine Member',
        uid: profile.uid,
        ticketId: entry.ticket_id,
        roundKey: String(entry.plan_round_key || '').replace(':', '_'),
        coupon: benefit?.coupon || entry.coupon_code || '',
        ...(benefitSummary ? { benefitSummary } : {}),
        resultDate:
          cycleById.get(entry.cycle_id)?.published_at
          || cycleById.get(entry.cycle_id)?.draw_date
          || entry.revealed_at,
      }];
    });

    return json({ winners }, {}, req);
  } catch (error) {
    return errorResponse(error, req);
  }
});
