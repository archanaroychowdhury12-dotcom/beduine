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
