-- Beduine production backend schema template
-- Apply in Supabase after reviewing table names against your existing project.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'customer');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum ('created', 'pending', 'verified', 'failed', 'refunded', 'chargeback');
  end if;
  if not exists (select 1 from pg_type where typname = 'subscription_status') then
    create type public.subscription_status as enum ('inactive', 'active', 'failed', 'refunded', 'chargeback');
  end if;
  if not exists (select 1 from pg_type where typname = 'audit_status') then
    create type public.audit_status as enum ('success', 'failed', 'pending');
  end if;
end $$;

create or replace function public.generate_beduine_uid()
returns text
language plpgsql
as $$
begin
  return 'BDU-' || to_char(now(), 'YYYY') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 6)) || '-' || (floor(random() * 9000 + 1000))::text;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  uid text not null unique default public.generate_beduine_uid(),
  email text unique,
  full_name text,
  phone text,
  role public.app_role not null default 'customer',
  is_demo_user boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  provider_order_id text,
  plan_id text not null,
  amount numeric(12,2) not null,
  currency text not null default 'INR',
  status public.payment_status not null default 'created',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.payment_sessions(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  provider_event_id text,
  event_type text not null,
  status public.payment_status not null,
  amount numeric(12,2) not null,
  currency text not null default 'INR',
  signature_verified boolean not null default false,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,
  plan_name text not null,
  plan_type text not null,
  payment_event_id uuid references public.payment_events(id) on delete set null,
  status public.subscription_status not null default 'inactive',
  activated_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  credit_type text not null,
  credit_category text not null,
  amount numeric(12,2) not null,
  credit_value numeric(12,2) not null default 0,
  usable_for text not null,
  source text not null,
  reason text not null,
  booking_ref text,
  admin_ref text,
  created_at timestamptz not null default now()
);

create table if not exists public.weekly_draw_cycles (
  id text primary key,
  draw_date timestamptz not null,
  status text not null default 'draft',
  total_entries integer not null default 0,
  verified_entries integer not null default 0,
  winner_count integer not null default 0,
  rng_seed text,
  report jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_draw_entries (
  id uuid primary key default gen_random_uuid(),
  cycle_id text not null references public.weekly_draw_cycles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  ticket_id text not null unique,
  plan_id text,
  verification_status text not null default 'pending',
  verification_reason text,
  draw_result text not null default 'pending',
  winner_rank integer,
  coupon_code text,
  created_at timestamptz not null default now(),
  unique (cycle_id, user_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  actor_role public.app_role,
  target_id uuid,
  target_email text,
  amount numeric(12,2),
  status public.audit_status not null default 'success',
  reason text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);


create unique index if not exists subscriptions_user_plan_unique on public.subscriptions(user_id, plan_id);
create index if not exists credit_ledger_user_credit_idx on public.credit_ledger(user_id, credit_type, credit_category, created_at desc);
create index if not exists weekly_draw_entries_cycle_result_idx on public.weekly_draw_entries(cycle_id, draw_result);

alter table public.profiles enable row level security;
alter table public.payment_sessions enable row level security;
alter table public.payment_events enable row level security;
alter table public.subscriptions enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.audit_logs enable row level security;
alter table public.weekly_draw_cycles enable row level security;
alter table public.weekly_draw_entries enable row level security;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'customer'::public.app_role);
$$;

drop policy if exists "profiles_read_self_or_admin" on public.profiles;
create policy "profiles_read_self_or_admin" on public.profiles
for select using (id = auth.uid() or public.current_app_role() = 'admin');

drop policy if exists "profiles_update_self_non_role_fields" on public.profiles;
create policy "profiles_update_self_non_role_fields" on public.profiles
for update using (id = auth.uid())
with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists "admin_read_all_payment_sessions" on public.payment_sessions;
create policy "admin_read_all_payment_sessions" on public.payment_sessions
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

drop policy if exists "admin_read_all_payment_events" on public.payment_events;
create policy "admin_read_all_payment_events" on public.payment_events
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

drop policy if exists "subscriptions_read_self_or_admin" on public.subscriptions;
create policy "subscriptions_read_self_or_admin" on public.subscriptions
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

drop policy if exists "credit_ledger_read_self_or_admin" on public.credit_ledger;
create policy "credit_ledger_read_self_or_admin" on public.credit_ledger
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

drop policy if exists "audit_read_admin_only" on public.audit_logs;
create policy "audit_read_admin_only" on public.audit_logs
for select using (public.current_app_role() = 'admin');

-- Inserts/updates for payments, subscriptions, credit ledger, audit logs should be done by service role
-- from secure backend/Edge Functions, not directly by browser clients.


drop policy if exists "weekly_draw_cycles_read_public_or_admin" on public.weekly_draw_cycles;
create policy "weekly_draw_cycles_read_public_or_admin" on public.weekly_draw_cycles
for select using (status in ('published', 'completed') or public.current_app_role() = 'admin');

drop policy if exists "weekly_draw_entries_read_self_or_admin" on public.weekly_draw_entries;
create policy "weekly_draw_entries_read_self_or_admin" on public.weekly_draw_entries
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

-- Admin-only writes to draw cycles/entries should be performed through service-role backend functions.
