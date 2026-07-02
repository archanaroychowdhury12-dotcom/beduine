-- Atomic customer workflows: normalized TRC units and Sunday draw participation.
-- Apply after 001 through 006.

create sequence if not exists public.trc_ticket_sequence start with 1;

create table if not exists public.trc_credit_units (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_ledger_entry_id uuid not null references public.credit_ledger(id) on delete restrict,
  sequence_no integer not null default 1 check (sequence_no > 0),
  status text not null default 'available'
    check (status in ('available', 'locked', 'redeemed', 'released', 'expired')),
  locked_cycle_id text references public.weekly_draw_cycles(id) on delete set null,
  locked_entry_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_ledger_entry_id, sequence_no)
);

alter table public.weekly_draw_entries
  add column if not exists subscription_id uuid references public.subscriptions(id) on delete set null,
  add column if not exists trc_unit_id uuid references public.trc_credit_units(id) on delete restrict;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'trc_credit_units_locked_entry_fkey'
  ) then
    alter table public.trc_credit_units
      add constraint trc_credit_units_locked_entry_fkey
      foreign key (locked_entry_id)
      references public.weekly_draw_entries(id)
      on delete set null;
  end if;
end $$;

create unique index if not exists weekly_draw_entries_user_cycle_unique
  on public.weekly_draw_entries(cycle_id, user_id);

create unique index if not exists weekly_draw_entries_trc_unit_unique
  on public.weekly_draw_entries(trc_unit_id)
  where trc_unit_id is not null;

create index if not exists trc_credit_units_available_idx
  on public.trc_credit_units(user_id, status, created_at)
  where status = 'available';

alter table public.trc_credit_units enable row level security;

drop policy if exists "trc_units_read_self_or_admin" on public.trc_credit_units;
create policy "trc_units_read_self_or_admin" on public.trc_credit_units
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

create or replace function public.create_trc_units_from_ledger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_unit_count integer;
begin
  if new.credit_type <> 'lucky_draw'
     or new.type not in ('issued', 'admin_adjustment')
     or new.amount <= 0 then
    return new;
  end if;

  v_unit_count := floor(new.amount)::integer;
  if v_unit_count <= 0 or new.amount <> v_unit_count then
    raise exception 'TRC issuance amount must be a positive whole number';
  end if;

  insert into public.trc_credit_units (
    user_id,
    source_ledger_entry_id,
    sequence_no
  )
  select new.user_id, new.id, generated.sequence_no
  from generate_series(1, v_unit_count) as generated(sequence_no)
  on conflict (source_ledger_entry_id, sequence_no) do nothing;

  return new;
end;
$$;

drop trigger if exists credit_ledger_create_trc_units on public.credit_ledger;
create trigger credit_ledger_create_trc_units
after insert on public.credit_ledger
for each row execute function public.create_trc_units_from_ledger();

insert into public.trc_credit_units (
  user_id,
  source_ledger_entry_id,
  sequence_no
)
select
  ledger.user_id,
  ledger.id,
  generated.sequence_no
from public.credit_ledger as ledger
cross join lateral generate_series(
  1,
  greatest(floor(ledger.amount)::integer, 0)
) as generated(sequence_no)
where ledger.credit_type = 'lucky_draw'
  and ledger.type in ('issued', 'admin_adjustment')
  and ledger.amount > 0
  and ledger.amount = floor(ledger.amount)
on conflict (source_ledger_entry_id, sequence_no) do nothing;

create or replace function public.participate_weekly_draw_v1(
  p_user_id uuid,
  p_now timestamptz default now()
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ist_now timestamp;
  v_sunday_date date;
  v_days_until_sunday integer;
  v_freeze_at timestamptz;
  v_cycle_id text;
  v_cycle public.weekly_draw_cycles%rowtype;
  v_subscription public.subscriptions%rowtype;
  v_plan public.membership_plans%rowtype;
  v_trc public.trc_credit_units%rowtype;
  v_entry_id uuid := gen_random_uuid();
  v_ticket_id text;
  v_round_key text;
begin
  if p_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  v_ist_now := p_now at time zone 'Asia/Kolkata';
  v_days_until_sunday := (
    7 - extract(dow from v_ist_now)::integer
  ) % 7;

  if extract(dow from v_ist_now)::integer = 0
     and v_ist_now::time >= time '18:00' then
    v_days_until_sunday := 7;
  end if;

  v_sunday_date := v_ist_now::date + v_days_until_sunday;
  v_freeze_at := (
    v_sunday_date::timestamp + time '18:00'
  ) at time zone 'Asia/Kolkata';
  v_cycle_id := 'BEDUINE-SUN-' || to_char(v_sunday_date, 'YYYY-MM-DD') || '-1800-IST';

  insert into public.weekly_draw_cycles (
    id,
    draw_date,
    status,
    auto_freeze_at
  )
  values (
    v_cycle_id,
    v_freeze_at,
    'draft',
    v_freeze_at
  )
  on conflict (id) do update
  set auto_freeze_at = coalesce(
    public.weekly_draw_cycles.auto_freeze_at,
    excluded.auto_freeze_at
  );

  select *
  into v_cycle
  from public.weekly_draw_cycles
  where id = v_cycle_id
  for update;

  if p_now >= v_freeze_at
     or v_cycle.status <> 'draft'
     or v_cycle.auto_frozen_at is not null then
    raise exception 'DRAW_ENTRY_CLOSED';
  end if;

  if exists (
    select 1
    from public.weekly_draw_entries
    where cycle_id = v_cycle_id
      and user_id = p_user_id
  ) then
    raise exception 'ALREADY_PARTICIPATING';
  end if;

  select subscription.*
  into v_subscription
  from public.subscriptions as subscription
  where subscription.user_id = p_user_id
    and subscription.status = 'active'
    and (
      subscription.expires_at is null
      or subscription.expires_at > p_now
    )
  order by subscription.updated_at desc
  limit 1
  for update;

  if not found then
    raise exception 'SUBSCRIPTION_INACTIVE';
  end if;

  select *
  into v_plan
  from public.membership_plans
  where id = v_subscription.plan_id
    and active = true;

  if not found then
    raise exception 'SUBSCRIPTION_PLAN_INVALID';
  end if;

  select *
  into v_trc
  from public.trc_credit_units
  where user_id = p_user_id
    and status = 'available'
  order by created_at, id
  for update skip locked
  limit 1;

  if not found then
    raise exception 'NO_TRC_AVAILABLE';
  end if;

  v_ticket_id := 'TRC-SUN-' || lpad(
    nextval('public.trc_ticket_sequence')::text,
    5,
    '0'
  );
  v_round_key := v_plan.category || '_' || v_plan.tier;

  insert into public.weekly_draw_entries (
    id,
    cycle_id,
    user_id,
    ticket_id,
    plan_id,
    plan_category,
    plan_tier,
    plan_round_key,
    subscription_id,
    trc_unit_id,
    verification_status,
    verification_reason,
    draw_result
  )
  values (
    v_entry_id,
    v_cycle_id,
    p_user_id,
    v_ticket_id,
    v_subscription.plan_id,
    v_plan.category,
    v_plan.tier,
    v_round_key,
    v_subscription.id,
    v_trc.id,
    'verified',
    null,
    'pending'
  );

  update public.trc_credit_units
  set status = 'locked',
      locked_cycle_id = v_cycle_id,
      locked_entry_id = v_entry_id,
      updated_at = p_now
  where id = v_trc.id
    and status = 'available';

  if not found then
    raise exception 'NO_TRC_AVAILABLE';
  end if;

  insert into public.credit_ledger (
    user_id,
    type,
    credit_type,
    credit_category,
    amount,
    credit_value,
    usable_for,
    source,
    reason,
    admin_ref
  )
  values (
    p_user_id,
    'reserved',
    'lucky_draw',
    v_plan.category,
    1,
    1,
    'lucky_draw',
    'real',
    'TRC locked for Sunday draw participation.',
    'DRAW_ENTRY_' || v_entry_id::text
  );

  insert into public.audit_logs (
    action,
    target_id,
    target_email,
    amount,
    status,
    reason,
    metadata
  )
  values (
    'draw.customer_participated',
    p_user_id,
    (select email from public.profiles where id = p_user_id),
    1,
    'success',
    'One TRC locked for the Sunday draw.',
    jsonb_build_object(
      'cycleId', v_cycle_id,
      'ticketId', v_ticket_id,
      'roundKey', v_round_key,
      'trcUnitId', v_trc.id
    )
  );

  return jsonb_build_object(
    'cycleId', v_cycle_id,
    'ticketId', v_ticket_id,
    'roundKey', v_round_key,
    'freezeAtIso', v_freeze_at
  );
end;
$$;

revoke all on function public.create_trc_units_from_ledger() from anon, authenticated;
revoke all on function public.participate_weekly_draw_v1(uuid,timestamptz) from anon, authenticated;

alter table public.weekly_draw_entries
  add column if not exists non_winner_credits_issued_at timestamptz;

alter table public.discount_credit_units
  add column if not exists cycle_id text references public.weekly_draw_cycles(id) on delete set null,
  add column if not exists source_draw_entry_id uuid references public.weekly_draw_entries(id) on delete set null,
  add column if not exists sequence_no integer,
  add column if not exists expires_at timestamptz;

create unique index if not exists discount_credit_units_cycle_user_sequence_unique
  on public.discount_credit_units(cycle_id, user_id, sequence_no)
  where cycle_id is not null and sequence_no is not null;

create table if not exists public.winner_tour_batches (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  category text not null check (category in ('domestic', 'international')),
  title text not null,
  destination text,
  departure_at timestamptz,
  status text not null default 'planning'
    check (status in ('planning', 'open', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.winner_benefits (
  id uuid primary key default gen_random_uuid(),
  cycle_id text not null references public.weekly_draw_cycles(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  draw_entry_id uuid not null references public.weekly_draw_entries(id) on delete restrict,
  coupon text not null unique,
  benefit_value_inr numeric(12,2),
  destination text,
  batch_id uuid references public.winner_tour_batches(id) on delete set null,
  status text not null default 'issued'
    check (status in ('issued', 'assigned', 'used', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cycle_id, user_id)
);

alter table public.winner_tour_batches enable row level security;
alter table public.winner_benefits enable row level security;

drop policy if exists "winner_benefits_read_self_or_admin" on public.winner_benefits;
create policy "winner_benefits_read_self_or_admin" on public.winner_benefits
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

create or replace function public.handle_weekly_draw_result_transition()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_coupon text;
begin
  if new.draw_result is not distinct from old.draw_result then
    return new;
  end if;

  if new.draw_result = 'winner' then
    v_coupon := coalesce(
      nullif(new.coupon_code, ''),
      'BEDWIN-' || to_char(now() at time zone 'Asia/Kolkata', 'YYYY') || '-' ||
        upper(substr(md5(new.id::text), 1, 8))
    );

    insert into public.winner_benefits (
      cycle_id,
      user_id,
      draw_entry_id,
      coupon
    )
    values (
      new.cycle_id,
      new.user_id,
      new.id,
      v_coupon
    )
    on conflict (cycle_id, user_id) do nothing;
  end if;

  if new.draw_result in ('winner', 'non_winner') then
    update public.trc_credit_units
    set status = 'redeemed',
        updated_at = now()
    where id = new.trc_unit_id
      and status = 'locked';

    if found and not exists (
      select 1
      from public.credit_ledger
      where user_id = new.user_id
        and admin_ref = 'DRAW_RESULT_' || new.id::text
        and type = 'redeemed'
    ) then
      insert into public.credit_ledger (
        user_id,
        type,
        credit_type,
        credit_category,
        amount,
        credit_value,
        usable_for,
        source,
        reason,
        admin_ref
      )
      values (
        new.user_id,
        'redeemed',
        'lucky_draw',
        coalesce(new.plan_category, 'domestic'),
        1,
        1,
        'lucky_draw',
        'real',
        'TRC consumed by finalized Sunday draw.',
        'DRAW_RESULT_' || new.id::text
      );
    end if;
  elsif new.draw_result = 'not_eligible' then
    update public.trc_credit_units
    set status = 'available',
        locked_cycle_id = null,
        locked_entry_id = null,
        updated_at = now()
    where id = new.trc_unit_id
      and status = 'locked';

    if found and not exists (
      select 1
      from public.credit_ledger
      where user_id = new.user_id
        and admin_ref = 'DRAW_RELEASE_' || new.id::text
        and type = 'reversed'
    ) then
      insert into public.credit_ledger (
        user_id,
        type,
        credit_type,
        credit_category,
        amount,
        credit_value,
        usable_for,
        source,
        reason,
        admin_ref
      )
      values (
        new.user_id,
        'reversed',
        'lucky_draw',
        coalesce(new.plan_category, 'domestic'),
        1,
        1,
        'lucky_draw',
        'real',
        'TRC released because the draw entry was not eligible.',
        'DRAW_RELEASE_' || new.id::text
      );
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists weekly_draw_result_transition on public.weekly_draw_entries;
create trigger weekly_draw_result_transition
after update of draw_result on public.weekly_draw_entries
for each row execute function public.handle_weekly_draw_result_transition();

create or replace function public.issue_non_winner_credits_v1(
  p_cycle_id text,
  p_actor_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_role public.app_role;
  v_cycle public.weekly_draw_cycles%rowtype;
  v_entry public.weekly_draw_entries%rowtype;
  v_ledger_id uuid;
  v_unit_count integer;
  v_unit_value integer;
  v_issued_users integer := 0;
  v_issued_units integer := 0;
begin
  select role
  into v_actor_role
  from public.profiles
  where id = p_actor_id;

  if v_actor_role is distinct from 'admin'::public.app_role then
    raise exception 'ADMIN_ONLY';
  end if;

  select *
  into v_cycle
  from public.weekly_draw_cycles
  where id = p_cycle_id
  for update;

  if not found then
    raise exception 'DRAW_CYCLE_NOT_FOUND';
  end if;
  if v_cycle.status not in ('completed', 'published') then
    raise exception 'DRAW_NOT_FINAL';
  end if;

  for v_entry in
    select *
    from public.weekly_draw_entries
    where cycle_id = p_cycle_id
      and draw_result = 'non_winner'
      and non_winner_credits_issued_at is null
    order by id
    for update
  loop
    if v_entry.plan_category not in ('domestic', 'international')
       or v_entry.plan_tier not in ('silver', 'gold', 'platinum') then
      raise exception 'DRAW_ROUND_INVALID';
    end if;

    v_unit_count := case v_entry.plan_tier
      when 'platinum' then 4
      when 'gold' then 2
      else 1
    end;
    v_unit_value := case v_entry.plan_category
      when 'international' then 5000
      else 500
    end;

    insert into public.credit_ledger (
      user_id,
      type,
      credit_type,
      credit_category,
      amount,
      credit_value,
      usable_for,
      source,
      reason,
      admin_ref
    )
    values (
      v_entry.user_id,
      'issued',
      'discount',
      v_entry.plan_category,
      v_unit_count,
      v_unit_value,
      case
        when v_entry.plan_category = 'international' then 'international_only'
        else 'domestic_only'
      end,
      'real',
      'Plan-wise non-winner Discount Credits issued after finalized Sunday draw.',
      'NON_WINNER_' || p_cycle_id
    )
    returning id into v_ledger_id;

    insert into public.discount_credit_units (
      user_id,
      source_ledger_entry_id,
      credit_category,
      credit_value,
      status,
      cycle_id,
      source_draw_entry_id,
      sequence_no
    )
    select
      v_entry.user_id,
      v_ledger_id,
      v_entry.plan_category,
      v_unit_value,
      'available',
      p_cycle_id,
      v_entry.id,
      generated.sequence_no
    from generate_series(1, v_unit_count) as generated(sequence_no)
    on conflict (cycle_id, user_id, sequence_no) do nothing;

    update public.weekly_draw_entries
    set non_winner_credits_issued_at = now()
    where id = v_entry.id
      and non_winner_credits_issued_at is null;

    v_issued_users := v_issued_users + 1;
    v_issued_units := v_issued_units + v_unit_count;
  end loop;

  insert into public.audit_logs (
    action,
    actor_id,
    actor_role,
    amount,
    status,
    reason,
    metadata
  )
  values (
    'draw.non_winner_credits_issued',
    p_actor_id,
    'admin',
    v_issued_units,
    'success',
    'Plan-wise non-winner Discount Credit issuance completed idempotently.',
    jsonb_build_object(
      'cycleId', p_cycle_id,
      'issuedUsers', v_issued_users,
      'issuedUnits', v_issued_units,
      'duplicate', v_issued_users = 0
    )
  );

  return jsonb_build_object(
    'cycleId', p_cycle_id,
    'issuedUsers', v_issued_users,
    'issuedUnits', v_issued_units,
    'duplicate', v_issued_users = 0
  );
end;
$$;

revoke all on function public.handle_weekly_draw_result_transition() from anon, authenticated;
revoke all on function public.issue_non_winner_credits_v1(text,uuid) from anon, authenticated;

-- Override the reveal RPC after plan-round columns exist. The final reveal publishes
-- the cycle so the public winners projection can expose only completed results.
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
  v_actor_role public.app_role;
  v_cycle public.weekly_draw_cycles%rowtype;
  v_entry public.weekly_draw_entries%rowtype;
  v_uid text;
  v_name text;
  v_next_cursor integer;
  v_remaining integer;
begin
  select role into v_actor_role
  from public.profiles
  where id = p_actor_id;

  if v_actor_role is distinct from 'admin'::public.app_role then
    raise exception 'ADMIN_ONLY';
  end if;

  select * into v_cycle
  from public.weekly_draw_cycles
  where id = p_cycle_id
  for update;

  if not found then
    raise exception 'DRAW_CYCLE_NOT_FOUND';
  end if;
  if v_cycle.status not in ('completed', 'published') then
    raise exception 'DRAW_NOT_FINAL';
  end if;

  v_next_cursor := coalesce(v_cycle.reveal_cursor, 0) + 1;

  select * into v_entry
  from public.weekly_draw_entries
  where cycle_id = p_cycle_id
    and draw_result = 'winner'
    and winner_rank = v_next_cursor
  for update;

  if not found then
    update public.weekly_draw_cycles
    set status = 'published',
        published_at = coalesce(published_at, now()),
        updated_at = now()
    where id = p_cycle_id;

    insert into public.audit_logs(action, actor_id, actor_role, status, reason, metadata)
    values (
      'draw.reveal_next_winner.no_more_winners',
      p_actor_id,
      'admin',
      'success',
      'No more winners left to reveal.',
      jsonb_build_object('cycleId', p_cycle_id, 'cursor', coalesce(v_cycle.reveal_cursor, 0))
    );

    return jsonb_build_object(
      'cycleId', p_cycle_id,
      'hasWinner', false,
      'remainingWinners', 0
    );
  end if;

  update public.weekly_draw_entries
  set revealed_at = coalesce(revealed_at, now()),
      reveal_order = coalesce(reveal_order, v_next_cursor)
  where id = v_entry.id
  returning * into v_entry;

  v_remaining := greatest(coalesce(v_cycle.winner_count, 0) - v_next_cursor, 0);

  update public.weekly_draw_cycles
  set reveal_cursor = v_next_cursor,
      revealed_winner_count = greatest(coalesce(revealed_winner_count, 0), v_next_cursor),
      status = case when v_remaining = 0 then 'published' else status end,
      published_at = case
        when v_remaining = 0 then coalesce(published_at, now())
        else published_at
      end,
      updated_at = now()
  where id = p_cycle_id;

  select
    coalesce(profile.uid, profile.id::text),
    coalesce(profile.full_name, auth_user.email, v_entry.user_id::text)
  into v_uid, v_name
  from auth.users as auth_user
  left join public.profiles as profile on profile.id = auth_user.id
  where auth_user.id = v_entry.user_id;

  insert into public.audit_logs(action, actor_id, actor_role, target_id, status, reason, metadata)
  values (
    'draw.winner_revealed_one_by_one',
    p_actor_id,
    'admin',
    v_entry.user_id,
    'success',
    'One plan-round winner revealed.',
    jsonb_build_object(
      'cycleId', p_cycle_id,
      'rank', v_next_cursor,
      'roundKey', v_entry.plan_round_key,
      'uid', v_uid,
      'ticketId', v_entry.ticket_id,
      'coupon', v_entry.coupon_code
    )
  );

  return jsonb_build_object(
    'cycleId', p_cycle_id,
    'hasWinner', true,
    'rank', v_next_cursor,
    'roundKey', v_entry.plan_round_key,
    'planLabel', initcap(replace(v_entry.plan_round_key, '_', ' ')),
    'roundWinnerRank', v_entry.round_winner_rank,
    'name', v_name,
    'uid', v_uid,
    'ticketId', v_entry.ticket_id,
    'coupon', v_entry.coupon_code,
    'revealedAt', v_entry.revealed_at,
    'remainingWinners', v_remaining
  );
end;
$$;

revoke all on function public.admin_reveal_next_weekly_draw_winner_v1(text,uuid) from anon, authenticated;
