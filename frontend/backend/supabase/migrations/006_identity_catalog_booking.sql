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
