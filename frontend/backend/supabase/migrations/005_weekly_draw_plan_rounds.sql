-- Beduine weekly draw plan-round patch.
-- Separate 5% rounded-up winner pools for every plan/category round:
-- domestic Silver/Gold/Platinum and international Silver/Gold/Platinum.

alter table public.weekly_draw_entries
  add column if not exists plan_category text,
  add column if not exists plan_tier text,
  add column if not exists plan_round_key text,
  add column if not exists round_winner_rank integer;

create index if not exists weekly_draw_entries_plan_round_idx
  on public.weekly_draw_entries(cycle_id, plan_round_key, verification_status);

create or replace function public.beduine_draw_plan_tier(p_plan text, p_explicit_tier text default null)
returns text
language sql
immutable
as $$
  select case
    when lower(coalesce(p_explicit_tier, '') || ' ' || coalesce(p_plan, '')) like '%silver%' then 'silver'
    when lower(coalesce(p_explicit_tier, '') || ' ' || coalesce(p_plan, '')) like '%gold%' then 'gold'
    when lower(coalesce(p_explicit_tier, '') || ' ' || coalesce(p_plan, '')) like '%platinum%'
      or lower(coalesce(p_explicit_tier, '') || ' ' || coalesce(p_plan, '')) like '%premium%'
      or lower(coalesce(p_explicit_tier, '') || ' ' || coalesce(p_plan, '')) like '%vip%' then 'platinum'
    else 'unknown'
  end;
$$;

create or replace function public.beduine_draw_plan_category(p_plan text, p_explicit_category text default null)
returns text
language sql
immutable
as $$
  select case
    when lower(coalesce(p_explicit_category, '') || ' ' || coalesce(p_plan, '')) like '%international%'
      or lower(coalesce(p_explicit_category, '') || ' ' || coalesce(p_plan, '')) like '%intl%'
      or lower(coalesce(p_explicit_category, '') || ' ' || coalesce(p_plan, '')) like '%global%'
      or lower(coalesce(p_explicit_category, '') || ' ' || coalesce(p_plan, '')) like '%world%' then 'international'
    when lower(coalesce(p_explicit_category, '') || ' ' || coalesce(p_plan, '')) like '%domestic%' then 'domestic'
    when lower(coalesce(p_explicit_category, '') || ' ' || coalesce(p_plan, '')) like '%silver%'
      or lower(coalesce(p_explicit_category, '') || ' ' || coalesce(p_plan, '')) like '%gold%'
      or lower(coalesce(p_explicit_category, '') || ' ' || coalesce(p_plan, '')) like '%platinum%'
      or lower(coalesce(p_explicit_category, '') || ' ' || coalesce(p_plan, '')) like '%premium%'
      or lower(coalesce(p_explicit_category, '') || ' ' || coalesce(p_plan, '')) like '%vip%' then 'domestic'
    else 'unknown'
  end;
$$;

create or replace function public.beduine_draw_round_key(p_plan text, p_category text default null, p_tier text default null)
returns text
language sql
immutable
as $$
  select public.beduine_draw_plan_category(p_plan, p_category) || '_' || public.beduine_draw_plan_tier(p_plan, p_tier);
$$;

update public.weekly_draw_entries
set plan_round_key = replace(plan_round_key, ':', '_')
where plan_round_key like '%:%';

update public.weekly_draw_entries
set verification_status = 'failed',
    verification_reason = coalesce(
      verification_reason,
      'Subscription plan is not eligible for a draw round.'
    ),
    draw_result = 'not_eligible',
    plan_round_key = null
where plan_round_key is not null
  and plan_round_key not in (
    'domestic_silver',
    'domestic_gold',
    'domestic_platinum',
    'international_silver',
    'international_gold',
    'international_platinum'
  );

alter table public.weekly_draw_entries
  drop constraint if exists weekly_draw_entries_round_key_check;

alter table public.weekly_draw_entries
  add constraint weekly_draw_entries_round_key_check
  check (
    plan_round_key is null
    or plan_round_key in (
      'domestic_silver',
      'domestic_gold',
      'domestic_platinum',
      'international_silver',
      'international_gold',
      'international_platinum'
    )
  );

-- Replaces previous freeze function: winner_count now equals the sum of each plan-round's 5%.
create or replace function public.admin_freeze_weekly_draw_cycle_v1(p_cycle_id text, p_draw_date timestamptz default now())
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cycle public.weekly_draw_cycles%rowtype;
  v_total int;
  v_verified int;
  v_winners int;
  v_rounds jsonb;
begin
  insert into public.weekly_draw_cycles(id, draw_date, status)
  values (p_cycle_id, p_draw_date, 'draft')
  on conflict (id) do nothing;

  select * into v_cycle from public.weekly_draw_cycles where id = p_cycle_id for update;
  if v_cycle.status not in ('draft', 'frozen') then
    raise exception 'cannot freeze cycle % from status %', p_cycle_id, v_cycle.status;
  end if;

  update public.weekly_draw_entries
  set plan_tier = coalesce(plan_tier, public.beduine_draw_plan_tier(plan_id, plan_tier)),
      plan_category = coalesce(plan_category, public.beduine_draw_plan_category(plan_id, plan_category)),
      plan_round_key = coalesce(plan_round_key, public.beduine_draw_round_key(plan_id, plan_category, plan_tier))
  where cycle_id = p_cycle_id;

  select count(*) into v_total from public.weekly_draw_entries where cycle_id = p_cycle_id;
  select count(*) into v_verified from public.weekly_draw_entries where cycle_id = p_cycle_id and verification_status = 'verified';

  with round_counts as (
    select
      coalesce(plan_round_key, public.beduine_draw_round_key(plan_id, plan_category, plan_tier)) as round_key,
      count(*)::int as verified_count
    from public.weekly_draw_entries
    where cycle_id = p_cycle_id and verification_status = 'verified'
    group by 1
  ), round_winners as (
    select
      round_key,
      verified_count,
      case when verified_count <= 0 then 0 else ceil(verified_count * 0.05)::int end as winner_count
    from round_counts
  )
  select
    coalesce(sum(winner_count), 0)::int,
    coalesce(jsonb_agg(jsonb_build_object('roundKey', round_key, 'verifiedParticipants', verified_count, 'winnerCount', winner_count) order by round_key), '[]'::jsonb)
  into v_winners, v_rounds
  from round_winners;

  update public.weekly_draw_cycles
  set status = 'frozen',
      draw_date = p_draw_date,
      total_entries = v_total,
      verified_entries = v_verified,
      winner_count = v_winners,
      locked_at = now(),
      run_count = coalesce(run_count, 0),
      updated_at = now()
  where id = p_cycle_id;

  insert into public.audit_logs(action, actor_role, status, reason, metadata)
  values (
    'draw.entries_frozen_plan_rounds',
    'admin',
    'success',
    'Weekly draw entries frozen with separate plan/category rounds.',
    jsonb_build_object('cycleId', p_cycle_id, 'totalEntries', v_total, 'verifiedEntries', v_verified, 'winnerCount', v_winners, 'rounds', v_rounds)
  );

  return jsonb_build_object('cycleId', p_cycle_id, 'totalEntries', v_total, 'verifiedEntries', v_verified, 'winnerCount', v_winners, 'rounds', v_rounds);
end;
$$;

-- Replaces previous finalize function: stores round metadata and per-round winner rank.
create or replace function public.admin_finalize_weekly_draw_cycle_v1(
  p_cycle_id text,
  p_report jsonb,
  p_rng_seed_hash text,
  p_report_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cycle public.weekly_draw_cycles%rowtype;
  v_winner jsonb;
  v_non_winner jsonb;
  v_rejected jsonb;
begin
  select * into v_cycle from public.weekly_draw_cycles where id = p_cycle_id for update;
  if not found then raise exception 'draw cycle % not found', p_cycle_id; end if;
  if v_cycle.status <> 'frozen' or coalesce(v_cycle.run_count, 0) > 0 then
    raise exception 'draw cycle % cannot be finalized from status %, run_count %', p_cycle_id, v_cycle.status, v_cycle.run_count;
  end if;

  update public.weekly_draw_cycles
  set status = 'completed',
      run_count = 1,
      completed_at = now(),
      rng_seed_hash = p_rng_seed_hash,
      report_hash = p_report_hash,
      report = p_report,
      winner_count = coalesce(nullif(p_report->>'winnerCount', '')::int, winner_count),
      updated_at = now()
  where id = p_cycle_id;

  for v_winner in select * from jsonb_array_elements(coalesce(p_report->'winners', '[]'::jsonb)) loop
    update public.weekly_draw_entries
    set draw_result = 'winner',
        winner_rank = nullif(v_winner->>'winnerRank', '')::int,
        round_winner_rank = nullif(v_winner->>'roundWinnerRank', '')::int,
        coupon_code = v_winner->>'coupon',
        plan_category = coalesce(v_winner->>'planCategory', plan_category),
        plan_tier = coalesce(v_winner->>'planTier', plan_tier),
        plan_round_key = coalesce(v_winner->>'planRoundKey', plan_round_key)
    where cycle_id = p_cycle_id and user_id::text = v_winner->>'id';
  end loop;

  for v_non_winner in select * from jsonb_array_elements(coalesce(p_report->'nonWinners', '[]'::jsonb)) loop
    update public.weekly_draw_entries
    set draw_result = 'non_winner',
        plan_category = coalesce(v_non_winner->>'planCategory', plan_category),
        plan_tier = coalesce(v_non_winner->>'planTier', plan_tier),
        plan_round_key = coalesce(v_non_winner->>'planRoundKey', plan_round_key)
    where cycle_id = p_cycle_id and user_id::text = v_non_winner->>'id';
  end loop;

  for v_rejected in select * from jsonb_array_elements(coalesce(p_report->'rejectedParticipants', '[]'::jsonb)) loop
    update public.weekly_draw_entries
    set draw_result = 'not_eligible', verification_reason = coalesce(v_rejected->>'verification_reason', verification_reason)
    where cycle_id = p_cycle_id and user_id::text = v_rejected->>'id';
  end loop;

  insert into public.audit_logs(action, actor_role, status, reason, metadata)
  values (
    'draw.completed_once_plan_rounds',
    'admin',
    'success',
    'Weekly draw finalized once with separate plan/category rounds.',
    jsonb_build_object('cycleId', p_cycle_id, 'rngSeedHash', p_rng_seed_hash, 'reportHash', p_report_hash, 'rounds', p_report->'rounds')
  );

  return jsonb_build_object('cycleId', p_cycle_id, 'status', 'completed', 'reportHash', p_report_hash, 'winnerCount', p_report->>'winnerCount', 'rounds', p_report->'rounds');
end;
$$;
