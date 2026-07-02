-- Beduine production atomic RPC + hardening patch.
-- Apply after 001 and 002.

-- Ensure duplicate-column bug does not exist on fresh schema: audit_logs must have one actor_id only.
-- If an earlier local draft had duplicate actor_id, recreate that draft before applying; PostgreSQL cannot create duplicate columns.

alter table public.payment_sessions
  add column if not exists expected_amount numeric(12,2),
  add column if not exists expected_currency text default 'INR';

update public.payment_sessions
set expected_amount = coalesce(expected_amount, amount),
    expected_currency = coalesce(expected_currency, currency, 'INR')
where expected_amount is null or expected_currency is null;

alter table public.payment_events
  add column if not exists provider_payment_id text;

create unique index if not exists payment_events_provider_payment_unique
  on public.payment_events(provider, provider_payment_id)
  where provider_payment_id is not null and provider_payment_id <> '';

create table if not exists public.discount_credit_units (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_ledger_entry_id uuid references public.credit_ledger(id) on delete set null,
  credit_category text not null check (credit_category in ('domestic', 'international')),
  credit_value numeric(12,2) not null,
  status text not null default 'available' check (status in ('available', 'reserved', 'redeemed', 'expired')),
  reserved_by_booking_id text,
  reserved_for_traveler_key text,
  reserved_until timestamptz,
  redeemed_booking_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists discount_credit_units_available_idx
  on public.discount_credit_units(user_id, credit_category, status, created_at);

create unique index if not exists discount_credit_units_one_active_per_booking_traveler
  on public.discount_credit_units(user_id, reserved_by_booking_id, reserved_for_traveler_key)
  where status in ('reserved', 'redeemed') and reserved_by_booking_id is not null and reserved_for_traveler_key is not null;

alter table public.discount_credit_units enable row level security;

drop policy if exists "dc_units_read_self_or_admin" on public.discount_credit_units;
create policy "dc_units_read_self_or_admin" on public.discount_credit_units
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

-- Atomic payment processing: verifies session amount/currency, records idempotent event,
-- activates subscription, issues exactly one TRC, and writes audit in one DB transaction.
create or replace function public.process_verified_subscription_payment_v1(
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
  p_signature_verified boolean,
  p_plan_name text default '',
  p_plan_type text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session public.payment_sessions%rowtype;
  v_event_id uuid;
  v_existing_event public.payment_events%rowtype;
  v_expires_at timestamptz := now() + interval '1 year';
  v_plan_name text;
  v_plan_type text;
begin
  if not p_signature_verified then
    raise exception 'payment signature was not verified';
  end if;

  select * into v_existing_event
  from public.payment_events
  where idempotency_key = p_idempotency_key
  limit 1;

  if found then
    return jsonb_build_object('duplicate', true, 'payment_event_id', v_existing_event.id, 'status', v_existing_event.status);
  end if;

  select * into v_session
  from public.payment_sessions
  where id::text = p_session_ref or provider_order_id = p_session_ref
  for update;

  if not found then
    raise exception 'payment session not found for ref %', p_session_ref;
  end if;

  if v_session.status in ('verified', 'refunded', 'chargeback') then
    return jsonb_build_object(
      'duplicate', true,
      'stale_event', true,
      'status', v_session.status,
      'session_id', v_session.id
    );
  end if;

  if upper(coalesce(p_currency, 'INR')) <> upper(coalesce(v_session.currency, v_session.expected_currency, 'INR')) then
    raise exception 'currency mismatch. expected %, got %', coalesce(v_session.currency, v_session.expected_currency, 'INR'), p_currency;
  end if;

  if p_amount <> coalesce(v_session.expected_amount, v_session.amount) then
    raise exception 'amount mismatch. expected %, got %', coalesce(v_session.expected_amount, v_session.amount), p_amount;
  end if;

  insert into public.payment_events (
    session_id,
    user_id,
    provider,
    provider_event_id,
    provider_payment_id,
    idempotency_key,
    event_type,
    status,
    amount,
    currency,
    signature_verified,
    raw_payload
  ) values (
    v_session.id,
    v_session.user_id,
    p_provider,
    p_provider_event_id,
    p_provider_payment_id,
    p_idempotency_key,
    p_event_type,
    p_status,
    p_amount,
    upper(coalesce(p_currency, 'INR')),
    true,
    p_payload
  ) returning id into v_event_id;

  update public.payment_sessions
  set status = p_status,
      updated_at = now()
  where id = v_session.id;

  if p_status = 'verified' then
    v_plan_name := coalesce(
      nullif(p_plan_name, ''),
      initcap(replace(v_session.plan_id, '_', ' '))
    );
    v_plan_type := coalesce(
      nullif(p_plan_type, ''),
      case
        when v_session.plan_id like 'international_%' then 'international'
        else 'domestic'
      end
    );

    insert into public.subscriptions (
      user_id,
      plan_id,
      plan_name,
      plan_type,
      payment_event_id,
      status,
      activated_at,
      expires_at,
      updated_at
    ) values (
      v_session.user_id,
      v_session.plan_id,
      v_plan_name,
      v_plan_type,
      v_event_id,
      'active',
      now(),
      v_expires_at,
      now()
    )
    on conflict (user_id, plan_id)
    do update set
      payment_event_id = excluded.payment_event_id,
      status = 'active',
      activated_at = coalesce(public.subscriptions.activated_at, now()),
      expires_at = excluded.expires_at,
      updated_at = now();

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
    ) values (
      v_session.user_id,
      'issued',
      'lucky_draw',
      v_plan_type,
      1,
      1,
      'lucky_draw',
      'real',
      'Webhook-verified subscription activation TRC/Lucky Draw participation token issued.',
      'PAYMENT_EVENT_' || v_event_id::text
    )
    on conflict do nothing;
  else
    update public.subscriptions
    set status = case
      when p_status = 'refunded' then 'refunded'::public.subscription_status
      when p_status = 'chargeback' then 'chargeback'::public.subscription_status
      else 'failed'::public.subscription_status
    end,
    updated_at = now()
    where user_id = v_session.user_id and plan_id = v_session.plan_id;
  end if;

  insert into public.audit_logs (
    action,
    actor_email,
    actor_role,
    target_id,
    amount,
    status,
    reason,
    metadata
  ) values (
    case when p_status = 'verified' then 'PAYMENT_WEBHOOK_VERIFIED' else 'PAYMENT_' || upper(p_status::text) end,
    p_provider || '-webhook@beduine.system',
    'admin',
    v_session.user_id,
    p_amount,
    case when p_status = 'verified' then 'success'::public.audit_status else 'failed'::public.audit_status end,
    'Payment webhook processed atomically with status ' || p_status::text,
    jsonb_build_object('provider', p_provider, 'providerEventId', p_provider_event_id, 'sessionId', v_session.id, 'planId', v_session.plan_id, 'paymentEventId', v_event_id)
  );

  return jsonb_build_object('duplicate', false, 'payment_event_id', v_event_id, 'status', p_status, 'session_id', v_session.id, 'user_id', v_session.user_id);
end;
$$;

-- Draw DB locking helpers. Edge Function should use these to freeze/finalize/publish.
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
begin
  insert into public.weekly_draw_cycles(id, draw_date, status)
  values (p_cycle_id, p_draw_date, 'draft')
  on conflict (id) do nothing;

  select * into v_cycle from public.weekly_draw_cycles where id = p_cycle_id for update;
  if v_cycle.status not in ('draft', 'frozen') then
    raise exception 'cannot freeze cycle % from status %', p_cycle_id, v_cycle.status;
  end if;

  select count(*) into v_total from public.weekly_draw_entries where cycle_id = p_cycle_id;
  select count(*) into v_verified from public.weekly_draw_entries where cycle_id = p_cycle_id and verification_status = 'verified';
  v_winners := case when v_verified <= 0 then 0 else ceil(v_verified * 0.05)::int end;

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
  values ('draw.entries_frozen', 'admin', 'success', 'Weekly draw entries frozen in DB.', jsonb_build_object('cycleId', p_cycle_id, 'totalEntries', v_total, 'verifiedEntries', v_verified, 'winnerCount', v_winners));

  return jsonb_build_object('cycleId', p_cycle_id, 'totalEntries', v_total, 'verifiedEntries', v_verified, 'winnerCount', v_winners);
end;
$$;

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
      updated_at = now()
  where id = p_cycle_id;

  for v_winner in select * from jsonb_array_elements(coalesce(p_report->'winners', '[]'::jsonb)) loop
    update public.weekly_draw_entries
    set draw_result = 'winner', winner_rank = nullif(v_winner->>'winnerRank', '')::int, coupon_code = v_winner->>'coupon'
    where cycle_id = p_cycle_id and user_id::text = v_winner->>'id';
  end loop;

  for v_non_winner in select * from jsonb_array_elements(coalesce(p_report->'nonWinners', '[]'::jsonb)) loop
    update public.weekly_draw_entries
    set draw_result = 'non_winner'
    where cycle_id = p_cycle_id and user_id::text = v_non_winner->>'id';
  end loop;

  for v_rejected in select * from jsonb_array_elements(coalesce(p_report->'rejectedParticipants', '[]'::jsonb)) loop
    update public.weekly_draw_entries
    set draw_result = 'not_eligible', verification_reason = coalesce(v_rejected->>'verification_reason', verification_reason)
    where cycle_id = p_cycle_id and user_id::text = v_rejected->>'id';
  end loop;

  insert into public.audit_logs(action, actor_role, status, reason, metadata)
  values ('draw.completed_once', 'admin', 'success', 'Weekly draw finalized once in DB transaction.', jsonb_build_object('cycleId', p_cycle_id, 'rngSeedHash', p_rng_seed_hash, 'reportHash', p_report_hash));

  return jsonb_build_object('cycleId', p_cycle_id, 'status', 'completed', 'reportHash', p_report_hash);
end;
$$;

create or replace function public.admin_publish_weekly_draw_cycle_v1(p_cycle_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cycle public.weekly_draw_cycles%rowtype;
begin
  select * into v_cycle from public.weekly_draw_cycles where id = p_cycle_id for update;
  if not found then raise exception 'draw cycle % not found', p_cycle_id; end if;
  if v_cycle.status <> 'completed' then raise exception 'only completed draw can be published'; end if;
  update public.weekly_draw_cycles set status = 'published', published_at = now(), updated_at = now() where id = p_cycle_id;
  insert into public.audit_logs(action, actor_role, status, reason, metadata)
  values ('draw.published', 'admin', 'success', 'Weekly draw result published.', jsonb_build_object('cycleId', p_cycle_id, 'reportHash', v_cycle.report_hash));
  return jsonb_build_object('cycleId', p_cycle_id, 'status', 'published', 'reportHash', v_cycle.report_hash);
end;
$$;

-- These functions are intended to be called only by service-role Edge Functions.
revoke all on function public.process_verified_subscription_payment_v1(text,text,text,text,text,text,public.payment_status,numeric,text,jsonb,boolean,text,text) from anon, authenticated;
revoke all on function public.admin_freeze_weekly_draw_cycle_v1(text,timestamptz) from anon, authenticated;
revoke all on function public.admin_finalize_weekly_draw_cycle_v1(text,jsonb,text,text) from anon, authenticated;
revoke all on function public.admin_publish_weekly_draw_cycle_v1(text) from anon, authenticated;
