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

create or replace function public.create_tour_booking_draft_v1(
  p_user_id uuid,
  p_tour_id text,
  p_departure_id text,
  p_booking_type text,
  p_travelers jsonb,
  p_pickup jsonb,
  p_credit_assignments jsonb default '[]'::jsonb,
  p_instant_booking_required boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tour public.tours%rowtype;
  v_departure public.tour_departures%rowtype;
  v_unit public.discount_credit_units%rowtype;
  v_traveler jsonb;
  v_assignment jsonb;
  v_booking_id text;
  v_traveler_count integer;
  v_pending_travelers integer;
  v_gross_total integer;
  v_discount_total integer := 0;
  v_final_total integer;
  v_instant_charge integer;
  v_grand_total integer;
  v_due_now integer;
  v_balance_due integer;
  v_first_amount integer;
  v_second_amount integer;
  v_third_amount integer;
  v_sequence integer := 1;
  v_reservation_expires_at timestamptz := now() + interval '20 minutes';
  v_reserved_units jsonb := '[]'::jsonb;
begin
  if p_user_id is null then raise exception 'AUTH_REQUIRED'; end if;
  if not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'PROFILE_NOT_FOUND';
  end if;
  if p_booking_type not in ('fixed_departure', 'customized_tailor_made') then
    raise exception 'BOOKING_TYPE_INVALID';
  end if;
  if jsonb_typeof(p_travelers) <> 'array'
     or jsonb_typeof(p_credit_assignments) <> 'array'
     or jsonb_typeof(p_pickup) <> 'object' then
    raise exception 'BOOKING_PAYLOAD_INVALID';
  end if;

  v_traveler_count := jsonb_array_length(p_travelers);
  if v_traveler_count < 1 or v_traveler_count > 20 then
    raise exception 'TRAVELER_COUNT_INVALID';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_travelers) as traveler
    where length(trim(coalesce(traveler->>'travelerKey', ''))) not between 1 and 100
       or length(trim(coalesce(traveler->>'firstName', ''))) not between 1 and 100
       or length(trim(coalesce(traveler->>'lastName', ''))) not between 1 and 100
  ) then
    raise exception 'TRAVELER_INVALID';
  end if;

  if (
    select count(*) from jsonb_array_elements(p_travelers)
  ) <> (
    select count(distinct traveler->>'travelerKey')
    from jsonb_array_elements(p_travelers) as traveler
  ) then
    raise exception 'TRAVELER_KEY_INVALID';
  end if;

  if (
    select count(*) from jsonb_array_elements(p_credit_assignments)
  ) <> (
    select count(distinct assignment->>'travelerKey')
    from jsonb_array_elements(p_credit_assignments) as assignment
  ) then
    raise exception 'ONE_CREDIT_PER_TRAVELER';
  end if;

  if (
    select count(*) from jsonb_array_elements(p_credit_assignments)
  ) <> (
    select count(distinct assignment->>'creditUnitId')
    from jsonb_array_elements(p_credit_assignments) as assignment
  ) then
    raise exception 'CREDIT_UNIT_DUPLICATE';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_credit_assignments) as assignment
    where not exists (
      select 1
      from jsonb_array_elements(p_travelers) as traveler
      where traveler->>'travelerKey' = assignment->>'travelerKey'
    )
  ) then
    raise exception 'CREDIT_TRAVELER_INVALID';
  end if;

  select * into v_departure
  from public.tour_departures
  where id = p_departure_id
    and tour_id = p_tour_id
  for update;

  if not found then raise exception 'TOUR_DEPARTURE_NOT_FOUND'; end if;
  if v_departure.status <> 'open' then raise exception 'TOUR_DEPARTURE_CLOSED'; end if;

  select * into v_tour
  from public.tours
  where id = p_tour_id
    and active = true;

  if not found then raise exception 'TOUR_NOT_AVAILABLE'; end if;

  select coalesce(sum(traveler_count), 0)::integer into v_pending_travelers
  from public.bookings
  where departure_id = p_departure_id
    and status = 'pending_payment'
    and reservation_expires_at > now();

  if v_departure.capacity_total - v_departure.capacity_reserved - v_pending_travelers < v_traveler_count then
    raise exception 'DEPARTURE_CAPACITY_EXCEEDED';
  end if;

  for v_assignment in
    select assignment
    from jsonb_array_elements(p_credit_assignments) as assignment
    order by assignment->>'creditUnitId'
  loop
    begin
      select * into v_unit
      from public.discount_credit_units
      where id = (v_assignment->>'creditUnitId')::uuid
        and user_id = p_user_id
      for update;
    exception when invalid_text_representation then
      raise exception 'CREDIT_UNIT_INVALID';
    end;

    if not found or v_unit.status <> 'available' then
      raise exception 'CREDIT_UNIT_NOT_AVAILABLE';
    end if;
    if v_unit.credit_category <> v_tour.category then
      raise exception 'CREDIT_CATEGORY_MISMATCH';
    end if;
    if v_unit.credit_value <> case when v_tour.category = 'international' then 5000 else 500 end then
      raise exception 'CREDIT_VALUE_INVALID';
    end if;

    v_discount_total := v_discount_total + v_unit.credit_value::integer;
    v_reserved_units := v_reserved_units || jsonb_build_array(jsonb_build_object(
      'creditUnitId', v_unit.id,
      'travelerKey', v_assignment->>'travelerKey',
      'creditValue', v_unit.credit_value::integer
    ));
  end loop;

  v_gross_total := v_tour.base_price_per_traveler * v_traveler_count;
  v_final_total := v_gross_total - v_discount_total;
  if v_final_total <= 0 then raise exception 'BOOKING_TOTAL_INVALID'; end if;

  v_instant_charge := case
    when not p_instant_booking_required then 0
    when v_tour.category = 'international' then 5000
    else 2000
  end;
  v_grand_total := v_final_total + v_instant_charge;
  v_due_now := round(v_final_total * case when p_booking_type = 'customized_tailor_made' then 0.50 else 0.25 end)::integer + v_instant_charge;
  v_balance_due := v_grand_total - v_due_now;
  v_booking_id := 'BDU-BKG-' || lpad(nextval('public.booking_reference_sequence')::text, 8, '0');

  insert into public.bookings (
    id, user_id, tour_id, departure_id, title, tour_name, category,
    booking_type, traveler_count, gross_tour_total, discount_total,
    final_tour_total, instant_booking_charge, grand_total, amount_due_now,
    balance_due, departure_at, reservation_expires_at
  ) values (
    v_booking_id, p_user_id, v_tour.id, v_departure.id, v_tour.name,
    v_tour.name, v_tour.category, p_booking_type, v_traveler_count,
    v_gross_total, v_discount_total, v_final_total, v_instant_charge,
    v_grand_total, v_due_now, v_balance_due, v_departure.departure_at,
    v_reservation_expires_at
  );

  for v_traveler in select * from jsonb_array_elements(p_travelers)
  loop
    insert into public.booking_travelers (
      booking_id, traveler_key, first_name, last_name, email, phone
    ) values (
      v_booking_id,
      trim(v_traveler->>'travelerKey'),
      trim(v_traveler->>'firstName'),
      trim(v_traveler->>'lastName'),
      nullif(trim(v_traveler->>'email'), ''),
      nullif(trim(v_traveler->>'phone'), '')
    );
  end loop;

  if coalesce(p_pickup->>'type', '') not in ('hotel', 'manual', 'none', 'assistance') then
    raise exception 'PICKUP_TYPE_INVALID';
  end if;

  insert into public.booking_pickups (
    booking_id, pickup_type, address, city, pincode, special_instructions
  ) values (
    v_booking_id,
    p_pickup->>'type',
    nullif(trim(p_pickup->>'address'), ''),
    nullif(trim(p_pickup->>'city'), ''),
    nullif(trim(p_pickup->>'pincode'), ''),
    nullif(trim(p_pickup->>'specialInstructions'), '')
  );

  if v_instant_charge > 0 then
    insert into public.booking_installments (
      booking_id, sequence_no, label, percentage, amount, due_label, status
    ) values (
      v_booking_id, v_sequence, 'Instant Booking Service Charge', 0,
      v_instant_charge, 'Pay now', 'pay_now'
    );
    v_sequence := v_sequence + 1;
  end if;

  if p_booking_type = 'customized_tailor_made' then
    v_first_amount := round(v_final_total * 0.50)::integer;
    v_second_amount := round(v_final_total * 0.25)::integer;
    insert into public.booking_installments (booking_id, sequence_no, label, percentage, amount, due_label, due_at, status)
    values
      (v_booking_id, v_sequence, 'Booking Confirmation Advance', 50, v_first_amount, 'Pay now', now(), 'pay_now'),
      (v_booking_id, v_sequence + 1, 'Second Payment', 25, v_second_amount, 'Due 7 days before departure', v_departure.departure_at - interval '7 days', 'upcoming'),
      (v_booking_id, v_sequence + 2, 'Final Balance', 25, v_final_total - v_first_amount - v_second_amount, 'Due before departure', v_departure.departure_at, 'upcoming');
  else
    v_first_amount := round(v_final_total * 0.25)::integer;
    v_second_amount := round(v_final_total * 0.25)::integer;
    v_third_amount := round(v_final_total * 0.30)::integer;
    insert into public.booking_installments (booking_id, sequence_no, label, percentage, amount, due_label, due_at, status)
    values
      (v_booking_id, v_sequence, 'Booking Confirmation Advance', 25, v_first_amount, 'Pay now', now(), 'pay_now'),
      (v_booking_id, v_sequence + 1, 'Second Payment', 25, v_second_amount, 'Due 30 days before departure', v_departure.departure_at - interval '30 days', 'upcoming'),
      (v_booking_id, v_sequence + 2, 'Third Payment', 30, v_third_amount, 'Due 15 days before departure', v_departure.departure_at - interval '15 days', 'upcoming'),
      (v_booking_id, v_sequence + 3, 'Final Balance', 20, v_final_total - v_first_amount - v_second_amount - v_third_amount, 'Due 7 days before departure', v_departure.departure_at - interval '7 days', 'upcoming');
  end if;

  for v_assignment in select * from jsonb_array_elements(p_credit_assignments)
  loop
    update public.discount_credit_units
    set status = 'reserved',
        reserved_by_booking_id = v_booking_id,
        reserved_for_traveler_key = v_assignment->>'travelerKey',
        reserved_until = v_reservation_expires_at,
        updated_at = now()
    where id = (v_assignment->>'creditUnitId')::uuid
      and user_id = p_user_id
      and status = 'available';

    if not found then raise exception 'CREDIT_UNIT_NOT_AVAILABLE'; end if;

    insert into public.discount_credit_redemptions (
      booking_id, user_id, traveler_key, credit_unit_id, credit_category,
      credit_value, status, expires_at
    )
    select
      v_booking_id, p_user_id, v_assignment->>'travelerKey', unit.id,
      unit.credit_category, unit.credit_value, 'reserved', v_reservation_expires_at
    from public.discount_credit_units as unit
    where unit.id = (v_assignment->>'creditUnitId')::uuid;
  end loop;

  insert into public.audit_logs (action, target_id, amount, status, reason, metadata)
  values (
    'booking.draft_created',
    p_user_id,
    v_due_now,
    'pending',
    'Authoritative tour booking draft created with locked credit reservations.',
    jsonb_build_object(
      'bookingId', v_booking_id,
      'tourId', v_tour.id,
      'departureId', v_departure.id,
      'travelerCount', v_traveler_count,
      'totalDiscount', v_discount_total,
      'amountDueNow', v_due_now
    )
  );

  return jsonb_build_object(
    'bookingId', v_booking_id,
    'currency', 'INR',
    'grossTourTotal', v_gross_total,
    'totalDiscount', v_discount_total,
    'finalTourTotal', v_final_total,
    'instantBookingCharge', v_instant_charge,
    'grandTotal', v_grand_total,
    'amountDueNow', v_due_now,
    'balanceDueLater', v_balance_due,
    'reservationExpiresAt', v_reservation_expires_at,
    'reservedCreditUnits', v_reserved_units
  );
end;
$$;

revoke all on function public.create_tour_booking_draft_v1(uuid,text,text,text,jsonb,jsonb,jsonb,boolean) from anon, authenticated;

create or replace function public.process_verified_booking_payment_v1(
  p_provider text,
  p_provider_event_id text,
  p_idempotency_key text,
  p_provider_payment_id text,
  p_session_ref text,
  p_event_type text,
  p_status public.payment_status,
  p_amount numeric,
  p_currency text,
  p_payload jsonb,
  p_signature_verified boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session public.payment_sessions%rowtype;
  v_existing_event public.payment_events%rowtype;
  v_event_id uuid;
  v_booking public.bookings%rowtype;
  v_departure public.tour_departures%rowtype;
  v_installment public.booking_installments%rowtype;
  v_redemption public.discount_credit_redemptions%rowtype;
  v_booking_id text;
begin
  if not p_signature_verified then raise exception 'PAYMENT_SIGNATURE_INVALID'; end if;
  if p_status not in ('verified', 'failed') then raise exception 'PAYMENT_STATUS_INVALID'; end if;

  select * into v_existing_event
  from public.payment_events
  where idempotency_key = p_idempotency_key
     or (provider = p_provider and provider_event_id = p_provider_event_id)
     or (provider = p_provider and provider_payment_id = p_provider_payment_id)
  order by created_at
  limit 1;

  if found then
    return jsonb_build_object(
      'duplicate', true,
      'paymentEventId', v_existing_event.id,
      'status', v_existing_event.status
    );
  end if;

  select * into v_session
  from public.payment_sessions
  where provider = p_provider
    and (id::text = p_session_ref or provider_order_id = p_session_ref)
  for update;

  if not found then raise exception 'PAYMENT_SESSION_NOT_FOUND'; end if;
  if v_session.purpose not in ('tour_booking', 'installment') then
    raise exception 'PAYMENT_PURPOSE_INVALID';
  end if;
  if v_session.status in ('verified', 'refunded', 'chargeback') then
    return jsonb_build_object(
      'duplicate', true,
      'staleEvent', true,
      'status', v_session.status,
      'sessionId', v_session.id
    );
  end if;
  if upper(coalesce(p_currency, '')) <> upper(v_session.currency) then
    raise exception 'PAYMENT_CURRENCY_MISMATCH';
  end if;
  if p_amount <> coalesce(v_session.expected_amount, v_session.amount) then
    raise exception 'PAYMENT_AMOUNT_MISMATCH';
  end if;

  insert into public.payment_events (
    session_id, user_id, provider, provider_event_id, provider_payment_id,
    idempotency_key, event_type, status, amount, currency,
    signature_verified, raw_payload
  ) values (
    v_session.id, v_session.user_id, p_provider, p_provider_event_id,
    p_provider_payment_id, p_idempotency_key, p_event_type, p_status,
    p_amount, upper(p_currency), true, p_payload
  ) returning id into v_event_id;

  update public.payment_sessions
  set status = p_status,
      updated_at = now()
  where id = v_session.id;

  if v_session.purpose = 'tour_booking' then
    select * into v_booking
    from public.bookings
    where id = v_session.reference_id
      and user_id = v_session.user_id
    for update;

    if not found then raise exception 'BOOKING_NOT_FOUND'; end if;
    v_booking_id := v_booking.id;

    if p_status = 'verified' then
      if v_booking.status <> 'pending_payment' then
        raise exception 'BOOKING_NOT_PAYABLE';
      end if;

      select * into v_departure
      from public.tour_departures
      where id = v_booking.departure_id
      for update;

      if not found or v_departure.status <> 'open' then
        raise exception 'TOUR_DEPARTURE_CLOSED';
      end if;
      if v_departure.capacity_reserved + v_booking.traveler_count > v_departure.capacity_total then
        raise exception 'DEPARTURE_CAPACITY_EXCEEDED';
      end if;

      update public.booking_installments
      set status = 'paid',
          paid_payment_event_id = v_event_id,
          paid_at = now(),
          updated_at = now()
      where booking_id = v_booking.id
        and status = 'pay_now';

      update public.tour_departures
      set capacity_reserved = capacity_reserved + v_booking.traveler_count,
          updated_at = now()
      where id = v_departure.id;

      for v_redemption in
        select *
        from public.discount_credit_redemptions
        where booking_id = v_booking.id
          and user_id = v_booking.user_id
          and status = 'reserved'
        order by id
        for update
      loop
        update public.discount_credit_redemptions
        set status = 'redeemed',
            updated_at = now()
        where id = v_redemption.id;

        update public.discount_credit_units
        set status = 'redeemed',
            redeemed_booking_id = v_booking.id,
            reserved_until = null,
            updated_at = now()
        where id = v_redemption.credit_unit_id
          and status = 'reserved'
          and reserved_by_booking_id = v_booking.id;

        if not found then raise exception 'BOOKING_CREDIT_RESERVATION_INVALID'; end if;

        insert into public.credit_ledger (
          user_id, type, credit_type, credit_category, amount, credit_value,
          usable_for, source, reason, booking_ref, admin_ref
        ) values (
          v_booking.user_id,
          'redeemed',
          'discount',
          v_redemption.credit_category,
          1,
          v_redemption.credit_value,
          case when v_redemption.credit_category = 'international' then 'international_only' else 'domestic_only' end,
          'real',
          'Discount Credit redeemed after verified paid-tour booking payment.',
          v_booking.id,
          'BOOKING_PAYMENT_EVENT_' || v_event_id::text || '_' || v_redemption.id::text
        );
      end loop;

      update public.bookings
      set status = 'confirmed',
          amount_paid = p_amount::integer,
          balance_due = greatest(grand_total - p_amount::integer, 0),
          confirmed_at = now(),
          reservation_expires_at = null,
          updated_at = now()
      where id = v_booking.id;
    else
      update public.discount_credit_redemptions
      set status = 'reversed',
          updated_at = now()
      where booking_id = v_booking.id
        and status = 'reserved';

      update public.discount_credit_units
      set status = 'available',
          reserved_by_booking_id = null,
          reserved_for_traveler_key = null,
          reserved_until = null,
          updated_at = now()
      where user_id = v_booking.user_id
        and reserved_by_booking_id = v_booking.id
        and status = 'reserved';

      update public.bookings
      set status = 'payment_failed',
          reservation_expires_at = null,
          updated_at = now()
      where id = v_booking.id
        and status = 'pending_payment';
    end if;
  else
    begin
      select * into v_installment
      from public.booking_installments
      where id = v_session.reference_id::uuid
      for update;
    exception when invalid_text_representation then
      raise exception 'INSTALLMENT_NOT_FOUND';
    end;

    if not found then raise exception 'INSTALLMENT_NOT_FOUND'; end if;

    select * into v_booking
    from public.bookings
    where id = v_installment.booking_id
      and user_id = v_session.user_id
    for update;

    if not found then raise exception 'BOOKING_NOT_FOUND'; end if;
    v_booking_id := v_booking.id;

    if p_status = 'verified' then
      if v_installment.status <> 'upcoming' then raise exception 'INSTALLMENT_NOT_PAYABLE'; end if;
      update public.booking_installments
      set status = 'paid',
          paid_payment_event_id = v_event_id,
          paid_at = now(),
          updated_at = now()
      where id = v_installment.id;

      update public.bookings
      set amount_paid = amount_paid + p_amount::integer,
          balance_due = greatest(balance_due - p_amount::integer, 0),
          updated_at = now()
      where id = v_booking.id;
    end if;
  end if;

  insert into public.audit_logs (
    action, actor_email, actor_role, target_id, amount, status, reason, metadata
  ) values (
    case when p_status = 'verified' then 'booking.payment_verified' else 'booking.payment_failed' end,
    p_provider || '-webhook@beduine.system',
    'admin',
    v_session.user_id,
    p_amount,
    case when p_status = 'verified' then 'success'::public.audit_status else 'failed'::public.audit_status end,
    'Booking payment webhook processed atomically.',
    jsonb_build_object(
      'bookingId', v_booking_id,
      'sessionId', v_session.id,
      'paymentEventId', v_event_id,
      'purpose', v_session.purpose,
      'providerEventId', p_provider_event_id
    )
  );

  return jsonb_build_object(
    'duplicate', false,
    'paymentEventId', v_event_id,
    'sessionId', v_session.id,
    'bookingId', v_booking_id,
    'status', p_status
  );
end;
$$;

revoke all on function public.process_verified_booking_payment_v1(text,text,text,text,text,text,public.payment_status,numeric,text,jsonb,boolean) from anon, authenticated;
