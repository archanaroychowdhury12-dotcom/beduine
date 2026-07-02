-- Server-owned profiles, roles, and immutable Beduine UID catalog.

alter table public.profiles
  add column if not exists city text;

alter table public.profiles
  alter column role set default 'customer';

create or replace function public.generate_beduine_uid()
returns text
language plpgsql
as $$
declare
  v_year text := to_char(now() at time zone 'Asia/Kolkata', 'YYYY');
  v_candidate text;
begin
  loop
    v_candidate := 'BDU-' || v_year || '-' ||
      upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 6)) || '-' ||
      lpad((floor(random() * 10000))::int::text, 4, '0');

    exit when not exists (
      select 1
      from public.profiles
      where uid = v_candidate
    );
  end loop;

  return v_candidate;
end;
$$;

insert into public.profiles (id, uid, email, full_name, phone, city, role)
select
  auth_user.id,
  public.generate_beduine_uid(),
  auth_user.email,
  nullif(auth_user.raw_user_meta_data->>'full_name', ''),
  nullif(auth_user.raw_user_meta_data->>'phone', ''),
  nullif(auth_user.raw_user_meta_data->>'city', ''),
  'customer'
from auth.users as auth_user
left join public.profiles as profile
  on profile.id = auth_user.id
where profile.id is null;

update public.profiles as profile
set email = coalesce(nullif(profile.email, ''), auth_user.email),
    full_name = coalesce(nullif(profile.full_name, ''), nullif(auth_user.raw_user_meta_data->>'full_name', '')),
    phone = coalesce(nullif(profile.phone, ''), nullif(auth_user.raw_user_meta_data->>'phone', '')),
    city = coalesce(nullif(profile.city, ''), nullif(auth_user.raw_user_meta_data->>'city', ''))
from auth.users as auth_user
where auth_user.id = profile.id;

update public.profiles
set uid = public.generate_beduine_uid()
where uid is null
   or uid !~ '^BDU-[0-9]{4}-[A-Z0-9]{6}-[0-9]{4}$';

alter table public.profiles
  drop constraint if exists profiles_uid_format;

alter table public.profiles
  add constraint profiles_uid_format
  check (uid ~ '^BDU-[0-9]{4}-[A-Z0-9]{6}-[0-9]{4}$');

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, uid, email, full_name, phone, city, role)
  values (
    new.id,
    public.generate_beduine_uid(),
    new.email,
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'city', ''),
    'customer'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

drop policy if exists "profiles_update_self_non_role_fields" on public.profiles;

create policy "profiles_update_self_non_role_fields" on public.profiles
for update using (id = auth.uid())
with check (
  id = auth.uid()
  and role = (select existing.role from public.profiles as existing where existing.id = auth.uid())
  and uid = (select existing.uid from public.profiles as existing where existing.id = auth.uid())
);

create table if not exists public.membership_plans (
  id text primary key,
  name text not null,
  category text not null check (category in ('domestic', 'international')),
  tier text not null check (tier in ('silver', 'gold', 'platinum')),
  price_inr integer not null check (price_inr > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  trc_units integer not null default 1 check (trc_units = 1),
  discount_credit_units integer not null check (discount_credit_units in (1, 2, 4)),
  discount_credit_value_inr integer not null check (discount_credit_value_inr in (500, 5000)),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category, tier)
);

insert into public.membership_plans (
  id,
  name,
  category,
  tier,
  price_inr,
  discount_credit_units,
  discount_credit_value_inr
)
values
  ('domestic_silver', 'Silver Domestic', 'domestic', 'silver', 499, 1, 500),
  ('domestic_gold', 'Gold Domestic', 'domestic', 'gold', 799, 2, 500),
  ('domestic_platinum', 'Platinum Domestic', 'domestic', 'platinum', 1499, 4, 500),
  ('international_silver', 'Silver International', 'international', 'silver', 4999, 1, 5000),
  ('international_gold', 'Gold International', 'international', 'gold', 7999, 2, 5000),
  ('international_platinum', 'Platinum International', 'international', 'platinum', 14999, 4, 5000)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  tier = excluded.tier,
  price_inr = excluded.price_inr,
  discount_credit_units = excluded.discount_credit_units,
  discount_credit_value_inr = excluded.discount_credit_value_inr,
  updated_at = now();

alter table public.membership_plans enable row level security;

drop policy if exists "membership_plans_read_active" on public.membership_plans;
create policy "membership_plans_read_active" on public.membership_plans
for select using (active);

alter table public.payment_sessions
  add column if not exists purpose text not null default 'subscription',
  add column if not exists reference_id text,
  add column if not exists amount_paise bigint,
  add column if not exists description text;

update public.payment_sessions
set reference_id = coalesce(reference_id, plan_id, id::text),
    amount_paise = coalesce(amount_paise, round(coalesce(expected_amount, amount) * 100)::bigint),
    description = coalesce(description, plan_id, 'Beduine payment')
where reference_id is null
   or amount_paise is null
   or description is null;

alter table public.payment_sessions
  alter column plan_id drop not null,
  alter column reference_id set not null,
  alter column amount_paise set not null;

alter table public.payment_sessions
  drop constraint if exists payment_sessions_purpose_check,
  drop constraint if exists payment_sessions_amount_paise_check;

alter table public.payment_sessions
  add constraint payment_sessions_purpose_check
    check (purpose in ('subscription', 'tour_booking', 'installment')),
  add constraint payment_sessions_amount_paise_check
    check (amount_paise > 0);

create unique index if not exists payment_sessions_provider_order_unique
  on public.payment_sessions(provider, provider_order_id)
  where provider_order_id is not null;

create unique index if not exists payment_sessions_one_open_reference
  on public.payment_sessions(user_id, purpose, reference_id)
  where status in ('created', 'pending');

-- Authoritative paid-tour catalog and normalized booking records.
create sequence if not exists public.booking_reference_sequence start with 1001;

create table if not exists public.tours (
  id text primary key,
  name text not null,
  category text not null check (category in ('domestic', 'international')),
  base_price_per_traveler integer not null check (base_price_per_traveler > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tour_departures (
  id text primary key,
  tour_id text not null references public.tours(id) on delete restrict,
  departure_at timestamptz not null,
  capacity_total integer not null default 24 check (capacity_total > 0),
  capacity_reserved integer not null default 0 check (capacity_reserved >= 0),
  status text not null default 'open' check (status in ('open', 'closed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tour_id, departure_at),
  check (capacity_reserved <= capacity_total)
);

create table if not exists public.bookings (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  tour_id text not null references public.tours(id) on delete restrict,
  departure_id text not null references public.tour_departures(id) on delete restrict,
  title text not null,
  tour_name text not null,
  category text not null check (category in ('domestic', 'international')),
  booking_type text not null check (booking_type in ('fixed_departure', 'customized_tailor_made')),
  traveler_count integer not null check (traveler_count between 1 and 20),
  gross_tour_total integer not null check (gross_tour_total > 0),
  discount_total integer not null default 0 check (discount_total >= 0),
  final_tour_total integer not null check (final_tour_total > 0),
  instant_booking_charge integer not null default 0 check (instant_booking_charge in (0, 2000, 5000)),
  grand_total integer not null check (grand_total > 0),
  amount_due_now integer not null check (amount_due_now > 0),
  amount_paid integer not null default 0 check (amount_paid >= 0),
  balance_due integer not null check (balance_due >= 0),
  currency text not null default 'INR' check (currency = 'INR'),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'confirmed', 'payment_failed', 'cancelled', 'completed')),
  departure_at timestamptz not null,
  reservation_expires_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_travelers (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null references public.bookings(id) on delete cascade,
  traveler_key text not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  unique (booking_id, traveler_key)
);

create table if not exists public.booking_pickups (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null unique references public.bookings(id) on delete cascade,
  pickup_type text not null check (pickup_type in ('hotel', 'manual', 'none', 'assistance')),
  address text,
  city text,
  pincode text,
  special_instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_installments (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null references public.bookings(id) on delete cascade,
  sequence_no integer not null check (sequence_no > 0),
  label text not null,
  percentage integer not null check (percentage between 0 and 100),
  amount integer not null check (amount > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  due_label text not null,
  due_at timestamptz,
  status text not null check (status in ('pay_now', 'upcoming', 'paid', 'failed', 'waived')),
  paid_payment_event_id uuid references public.payment_events(id) on delete set null,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (booking_id, sequence_no)
);

alter table public.discount_credit_redemptions
  add column if not exists credit_unit_id uuid references public.discount_credit_units(id) on delete restrict,
  add column if not exists expires_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists dc_redemptions_credit_unit_active_unique
  on public.discount_credit_redemptions(credit_unit_id)
  where credit_unit_id is not null and status in ('reserved', 'redeemed');

create index if not exists bookings_user_created_idx
  on public.bookings(user_id, created_at desc);

create index if not exists tour_departures_open_idx
  on public.tour_departures(tour_id, departure_at)
  where status = 'open';

alter table public.tours enable row level security;
alter table public.tour_departures enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_travelers enable row level security;
alter table public.booking_pickups enable row level security;
alter table public.booking_installments enable row level security;

drop policy if exists "tours_read_active" on public.tours;
create policy "tours_read_active" on public.tours
for select using (active or public.current_app_role() = 'admin');

drop policy if exists "tour_departures_read_active" on public.tour_departures;
create policy "tour_departures_read_active" on public.tour_departures
for select using (status = 'open' or public.current_app_role() = 'admin');

drop policy if exists "bookings_read_self_or_admin" on public.bookings;
create policy "bookings_read_self_or_admin" on public.bookings
for select using (public.current_app_role() = 'admin' or user_id = auth.uid());

drop policy if exists "booking_travelers_read_self_or_admin" on public.booking_travelers;
create policy "booking_travelers_read_self_or_admin" on public.booking_travelers
for select using (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.bookings
    where bookings.id = booking_travelers.booking_id
      and bookings.user_id = auth.uid()
  )
);

drop policy if exists "booking_pickups_read_self_or_admin" on public.booking_pickups;
create policy "booking_pickups_read_self_or_admin" on public.booking_pickups
for select using (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.bookings
    where bookings.id = booking_pickups.booking_id
      and bookings.user_id = auth.uid()
  )
);

drop policy if exists "booking_installments_read_self_or_admin" on public.booking_installments;
create policy "booking_installments_read_self_or_admin" on public.booking_installments
for select using (
  public.current_app_role() = 'admin'
  or exists (
    select 1 from public.bookings
    where bookings.id = booking_installments.booking_id
      and bookings.user_id = auth.uid()
  )
);

-- Initial production catalog mirrors the paid tours currently published by the UI.
insert into public.tours (id, name, category, base_price_per_traveler)
values
  ('sundarbans-mangrove-safari', 'Sundarbans Mangrove Safari Escape', 'domestic', 12499),
  ('darjeeling-hills-tea', 'Darjeeling Hills, Tea Garden & Toy Train', 'domestic', 17499),
  ('puri-konark-sea-temple', 'Puri, Konark & Chilika Sea Temple Tour', 'domestic', 15499),
  ('kashmir-valley-houseboat', 'Kashmir Valley, Gulmarg & Houseboat Holiday', 'domestic', 32999),
  ('dubai-city-desert', 'Dubai City, Desert Safari & Marina Escape', 'international', 52999),
  ('thailand-bangkok-pattaya', 'Thailand Bangkok & Pattaya Value Holiday', 'international', 45999),
  ('digha-sea-beach-retreat', 'Digha Sea Beach & Mandarmani Retreat', 'domestic', 8499),
  ('mousuni-island-escape', 'Mousuni Island & Bakkhali Coastal Escape', 'domestic', 9999),
  ('purulia-tribal-hills', 'Purulia Tribal Hills & Ajodhya Plateau', 'domestic', 10999),
  ('dooars-jungle-safari', 'Dooars Jungle Safari & Tea Garden Tour', 'domestic', 16499),
  ('daring-bari-adventure', 'Daring Bari Cliff & Waterfall Adventure', 'domestic', 6999),
  ('goa-beach-cruise', 'Goa Beach, Cruise & Nightlife Holiday', 'domestic', 19999),
  ('sikkim-gangtok-nathula', 'Sikkim Gangtok, Nathula & Tsomgo Lake Tour', 'domestic', 22999),
  ('himachal-shimla-manali', 'Himachal Shimla, Manali & Solang Valley Tour', 'domestic', 24999),
  ('nepal-kathmandu-pokhara', 'Nepal Kathmandu, Pokhara & Nagarkot Heritage Tour', 'international', 38999),
  ('bhutan-paro-thimphu', 'Bhutan Paro, Thimphu & Tiger''s Nest Monastery Tour', 'international', 58999),
  ('bali-island-paradise', 'Bali Island, Ubud & Kintamani Paradise Holiday', 'international', 49999),
  ('vietnam-hanoi-halong', 'Vietnam Hanoi, Ha Long Bay & Hoi An Cultural Tour', 'international', 55999)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  base_price_per_traveler = excluded.base_price_per_traveler,
  updated_at = now();

with departure_dates(tour_id, dates) as (
  values
    ('sundarbans-mangrove-safari', array['2026-07-05','2026-07-12','2026-07-19','2026-08-02','2026-08-16','2026-09-06']::date[]),
    ('darjeeling-hills-tea', array['2026-07-09','2026-07-23','2026-08-06','2026-08-20','2026-09-10','2026-10-01']::date[]),
    ('puri-konark-sea-temple', array['2026-07-04','2026-07-18','2026-08-01','2026-08-15','2026-09-05','2026-10-03']::date[]),
    ('kashmir-valley-houseboat', array['2026-07-11','2026-07-25','2026-08-08','2026-08-22','2026-09-12','2026-10-10']::date[]),
    ('dubai-city-desert', array['2026-07-16','2026-08-13','2026-09-17','2026-10-15','2026-11-12','2026-12-10']::date[]),
    ('thailand-bangkok-pattaya', array['2026-07-18','2026-08-15','2026-09-19','2026-10-17','2026-11-14','2026-12-12']::date[]),
    ('digha-sea-beach-retreat', array['2026-07-04','2026-07-11','2026-07-25','2026-08-08','2026-08-22','2026-09-12']::date[]),
    ('mousuni-island-escape', array['2026-07-06','2026-07-20','2026-08-03','2026-08-17','2026-09-07','2026-09-28']::date[]),
    ('purulia-tribal-hills', array['2026-07-10','2026-07-24','2026-08-07','2026-08-21','2026-09-11','2026-10-02']::date[]),
    ('dooars-jungle-safari', array['2026-07-08','2026-07-22','2026-08-05','2026-08-19','2026-09-09','2026-10-07']::date[]),
    ('daring-bari-adventure', array['2026-07-05','2026-07-19','2026-08-02','2026-08-16','2026-09-06','2026-09-27']::date[]),
    ('goa-beach-cruise', array['2026-07-12','2026-07-26','2026-08-09','2026-08-23','2026-09-13','2026-10-11']::date[]),
    ('sikkim-gangtok-nathula', array['2026-07-10','2026-07-24','2026-08-07','2026-08-21','2026-09-11','2026-10-09']::date[]),
    ('himachal-shimla-manali', array['2026-07-11','2026-07-25','2026-08-08','2026-08-22','2026-09-12','2026-10-10']::date[]),
    ('nepal-kathmandu-pokhara', array['2026-07-14','2026-08-11','2026-09-15','2026-10-13','2026-11-10','2026-12-08']::date[]),
    ('bhutan-paro-thimphu', array['2026-07-16','2026-08-13','2026-09-17','2026-10-15','2026-11-12','2026-12-10']::date[]),
    ('bali-island-paradise', array['2026-07-18','2026-08-15','2026-09-19','2026-10-17','2026-11-14','2026-12-12']::date[]),
    ('vietnam-hanoi-halong', array['2026-07-20','2026-08-17','2026-09-21','2026-10-19','2026-11-16','2026-12-14']::date[])
)
insert into public.tour_departures (id, tour_id, departure_at, capacity_total)
select
  departure_dates.tour_id || ':' || departure_date::text,
  departure_dates.tour_id,
  (departure_date::timestamp + time '08:00') at time zone 'Asia/Kolkata',
  24
from departure_dates
cross join lateral unnest(departure_dates.dates) as departure_date
on conflict (id) do update set
  departure_at = excluded.departure_at,
  capacity_total = excluded.capacity_total,
  updated_at = now();
