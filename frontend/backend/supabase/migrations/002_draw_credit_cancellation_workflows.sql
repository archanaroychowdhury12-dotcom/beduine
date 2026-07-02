-- Beduine production workflow hardening
-- Adds idempotency, one-run draw controls, DC redemption controls, and cancellation/refund workflow tables.

alter table public.payment_events
  add column if not exists idempotency_key text,
  add column if not exists provider_payment_id text;

create unique index if not exists payment_events_provider_event_unique
  on public.payment_events(provider, provider_event_id)
  where provider_event_id is not null;

create unique index if not exists payment_events_idempotency_unique
  on public.payment_events(idempotency_key)
  where idempotency_key is not null;

create unique index if not exists credit_ledger_single_trc_per_payment_event
  on public.credit_ledger(user_id, admin_ref, credit_type)
  where credit_type = 'lucky_draw' and admin_ref is not null;

alter table public.weekly_draw_cycles
  add column if not exists locked_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists published_at timestamptz,
  add column if not exists non_winner_credits_issued_at timestamptz,
  add column if not exists rng_seed_hash text,
  add column if not exists report_hash text,
  add column if not exists run_count integer not null default 0;

create unique index if not exists weekly_draw_cycles_run_once
  on public.weekly_draw_cycles(id)
  where run_count > 0;

create table if not exists public.discount_credit_redemptions (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  traveler_key text not null,
  credit_category text not null check (credit_category in ('domestic', 'international')),
  credit_value numeric(12,2) not null,
  ledger_entry_id uuid references public.credit_ledger(id) on delete set null,
  status text not null default 'reserved' check (status in ('reserved', 'redeemed', 'reversed', 'expired')),
  created_at timestamptz not null default now(),
  unique (booking_id, traveler_key),
  unique (booking_id, user_id, traveler_key)
);

create table if not exists public.cancellation_requests (
  id text primary key,
  booking_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  total_tour_cost numeric(12,2) not null,
  traveler_count integer not null default 1,
  departure_date timestamptz not null,
  reason text not null,
  status text not null default 'submitted',
  refund_mode text check (refund_mode in ('cash_refund', 'credit_adjustment')),
  supplier_charges numeric(12,2) not null default 0,
  supplier_proof_urls text[] not null default '{}',
  calculation jsonb,
  admin_note text,
  refund_status text default 'not_started',
  credit_adjustment_status text default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists cancellation_one_open_request_per_booking
  on public.cancellation_requests(booking_id)
  where status in ('submitted', 'under_review', 'approved', 'refund_pending', 'credit_adjustment_pending');

create table if not exists public.cancellation_supplier_charges (
  id uuid primary key default gen_random_uuid(),
  request_id text not null references public.cancellation_requests(id) on delete cascade,
  amount numeric(12,2) not null default 0,
  proof_url text,
  note text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.refund_transactions (
  id uuid primary key default gen_random_uuid(),
  request_id text not null references public.cancellation_requests(id) on delete cascade,
  booking_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null,
  mode text not null check (mode in ('cash_refund', 'credit_adjustment')),
  status text not null default 'pending',
  provider_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_adjustments (
  id uuid primary key default gen_random_uuid(),
  request_id text not null references public.cancellation_requests(id) on delete cascade,
  booking_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null,
  expires_at timestamptz not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.discount_credit_redemptions enable row level security;
alter table public.cancellation_requests enable row level security;
alter table public.cancellation_supplier_charges enable row level security;
alter table public.refund_transactions enable row level security;
alter table public.credit_adjustments enable row level security;

drop policy if exists "dc_redemptions_read_self_or_admin" on public.discount_credit_redemptions;
create policy "dc_redemptions_read_self_or_admin" on public.discount_credit_redemptions
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

drop policy if exists "cancellation_read_self_or_admin" on public.cancellation_requests;
create policy "cancellation_read_self_or_admin" on public.cancellation_requests
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

drop policy if exists "supplier_charges_admin_only" on public.cancellation_supplier_charges;
create policy "supplier_charges_admin_only" on public.cancellation_supplier_charges
for select using (public.current_app_role() = 'admin');

drop policy if exists "refund_transactions_read_self_or_admin" on public.refund_transactions;
create policy "refund_transactions_read_self_or_admin" on public.refund_transactions
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

drop policy if exists "credit_adjustments_read_self_or_admin" on public.credit_adjustments;
create policy "credit_adjustments_read_self_or_admin" on public.credit_adjustments
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

-- Writes for draw, credit redemption, cancellation review, refunds, and credit adjustments
-- must be done by Edge Functions/server code using service role, never directly by browser clients.
