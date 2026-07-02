-- Beduine weekly draw automation patch.
-- Sunday 6:00 PM IST auto-freeze + one-by-one winner reveal backend support.

alter table public.weekly_draw_cycles
  add column if not exists auto_freeze_at timestamptz,
  add column if not exists auto_frozen_at timestamptz,
  add column if not exists reveal_cursor integer not null default 0,
  add column if not exists revealed_winner_count integer not null default 0;

alter table public.weekly_draw_entries
  add column if not exists reveal_order integer,
  add column if not exists revealed_at timestamptz;

create index if not exists weekly_draw_cycles_auto_freeze_idx
  on public.weekly_draw_cycles(auto_freeze_at, status)
  where status in ('draft', 'frozen');

create unique index if not exists weekly_draw_entries_one_reveal_order_per_cycle
  on public.weekly_draw_entries(cycle_id, reveal_order)
  where reveal_order is not null;

-- Intended to be called by a scheduled Edge Function every few minutes.
-- It freezes the current Sunday 6 PM IST cycle once the timestamp is reached.
create or replace function public.admin_auto_freeze_weekly_draw_cycle_v1(
  p_cycle_id text,
  p_freeze_at timestamptz,
  p_now timestamptz default now()
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cycle public.weekly_draw_cycles%rowtype;
  v_result jsonb;
begin
  insert into public.weekly_draw_cycles(id, draw_date, status, auto_freeze_at)
  values (p_cycle_id, p_freeze_at, 'draft', p_freeze_at)
  on conflict (id) do update set auto_freeze_at = coalesce(public.weekly_draw_cycles.auto_freeze_at, excluded.auto_freeze_at);

  select * into v_cycle from public.weekly_draw_cycles where id = p_cycle_id for update;

  if v_cycle.auto_frozen_at is not null then
    return jsonb_build_object('cycleId', p_cycle_id, 'autoFrozen', false, 'reason', 'already_auto_frozen', 'autoFrozenAt', v_cycle.auto_frozen_at);
  end if;

  if p_now < p_freeze_at then
    return jsonb_build_object('cycleId', p_cycle_id, 'autoFrozen', false, 'reason', 'freeze_time_not_reached', 'freezeAt', p_freeze_at, 'now', p_now);
  end if;

  if v_cycle.status not in ('draft', 'frozen') then
    return jsonb_build_object('cycleId', p_cycle_id, 'autoFrozen', false, 'reason', 'cycle_not_freezable', 'status', v_cycle.status);
  end if;

  v_result := public.admin_freeze_weekly_draw_cycle_v1(p_cycle_id, p_freeze_at);

  update public.weekly_draw_cycles
  set auto_frozen_at = p_now,
      auto_freeze_at = p_freeze_at,
      updated_at = now()
  where id = p_cycle_id;

  insert into public.audit_logs(action, actor_role, status, reason, metadata)
  values (
    'draw.auto_frozen_sunday_6pm',
    'admin',
    'success',
    'Weekly draw auto-frozen at Sunday 6:00 PM IST.',
    jsonb_build_object('cycleId', p_cycle_id, 'freezeAt', p_freeze_at, 'autoFrozenAt', p_now, 'freezeResult', v_result)
  );

  return jsonb_build_object('cycleId', p_cycle_id, 'autoFrozen', true, 'freezeAt', p_freeze_at, 'autoFrozenAt', p_now, 'freezeResult', v_result);
end;
$$;

-- Admin panel button will call this later: each click reveals exactly one next winner.
-- It returns public-facing winner display fields: name + UID + ticket + rank.
create or replace function public.admin_reveal_next_weekly_draw_winner_v1(
  p_cycle_id text,
  p_actor_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cycle public.weekly_draw_cycles%rowtype;
  v_entry public.weekly_draw_entries%rowtype;
  v_uid text;
  v_name text;
  v_next_cursor integer;
begin
  select * into v_cycle from public.weekly_draw_cycles where id = p_cycle_id for update;
  if not found then raise exception 'draw cycle % not found', p_cycle_id; end if;
  if v_cycle.status not in ('completed', 'published') then
    raise exception 'winners can be revealed only after draw completion. current status: %', v_cycle.status;
  end if;

  v_next_cursor := coalesce(v_cycle.reveal_cursor, 0) + 1;

  select * into v_entry
  from public.weekly_draw_entries
  where cycle_id = p_cycle_id
    and draw_result = 'winner'
    and winner_rank = v_next_cursor
  for update;

  if not found then
    insert into public.audit_logs(action, actor_id, actor_role, status, reason, metadata)
    values ('draw.reveal_next_winner.no_more_winners', p_actor_id, 'admin', 'success', 'No more winners left to reveal.', jsonb_build_object('cycleId', p_cycle_id, 'cursor', coalesce(v_cycle.reveal_cursor, 0)));

    return jsonb_build_object('cycleId', p_cycle_id, 'hasWinner', false, 'message', 'No more winners left to reveal.', 'revealedWinnerCount', coalesce(v_cycle.revealed_winner_count, 0), 'winnerCount', v_cycle.winner_count);
  end if;

  update public.weekly_draw_entries
  set revealed_at = coalesce(revealed_at, now()),
      reveal_order = coalesce(reveal_order, v_next_cursor)
  where id = v_entry.id
  returning * into v_entry;

  update public.weekly_draw_cycles
  set reveal_cursor = v_next_cursor,
      revealed_winner_count = greatest(coalesce(revealed_winner_count, 0), v_next_cursor),
      updated_at = now()
  where id = p_cycle_id;

  select coalesce(p.uid, p.id::text), coalesce(p.full_name, u.email, v_entry.user_id::text)
  into v_uid, v_name
  from auth.users u
  left join public.profiles p on p.id = u.id
  where u.id = v_entry.user_id;

  insert into public.audit_logs(action, actor_id, actor_role, target_id, status, reason, metadata)
  values (
    'draw.winner_revealed_one_by_one',
    p_actor_id,
    'admin',
    v_entry.user_id,
    'success',
    'One winner revealed for live Sunday draw.',
    jsonb_build_object('cycleId', p_cycle_id, 'rank', v_next_cursor, 'uid', v_uid, 'ticketId', v_entry.ticket_id, 'coupon', v_entry.coupon_code)
  );

  return jsonb_build_object(
    'cycleId', p_cycle_id,
    'hasWinner', true,
    'rank', v_next_cursor,
    'name', v_name,
    'uid', v_uid,
    'ticketId', v_entry.ticket_id,
    'coupon', v_entry.coupon_code,
    'revealedAt', v_entry.revealed_at,
    'remainingWinners', greatest(v_cycle.winner_count - v_next_cursor, 0)
  );
end;
$$;

revoke all on function public.admin_auto_freeze_weekly_draw_cycle_v1(text,timestamptz,timestamptz) from anon, authenticated;
revoke all on function public.admin_reveal_next_weekly_draw_winner_v1(text,uuid) from anon, authenticated;
