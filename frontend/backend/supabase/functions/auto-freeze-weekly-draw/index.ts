// Supabase Edge Function template for Sunday 6:00 PM IST auto-freeze.
// Deploy later after Supabase credentials are available. Schedule this function with Supabase cron.
// It intentionally contains no UI logic.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getMostRecentSundaySchedule } from '../_shared/weeklyDrawSchedule.ts';

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json({ ok: false, error: 'Missing Supabase service credentials.' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const schedule = getMostRecentSundaySchedule(new Date());

  const { data, error } = await supabase.rpc('admin_auto_freeze_weekly_draw_cycle_v1', {
    p_cycle_id: schedule.cycleId,
    p_freeze_at: schedule.freezeAtIso,
  });

  if (error) return Response.json({ ok: false, schedule, error: error.message }, { status: 500 });
  return Response.json({ ok: true, schedule, result: data });
});
