-- Transactional cancellation administration, Razorpay refunds, and future support storage.

alter table public.cancellation_requests
  add column if not exists requested_refund_preference text
    check (requested_refund_preference in ('cash_refund', 'credit_adjustment')),
  add column if not exists paid_amount numeric(12,2) not null default 0,
  add column if not exists approved_refund_amount numeric(12,2),
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists provider_refund_id text,
  add column if not exists provider_refund_status text;

update public.cancellation_requests
set requested_refund_preference = coalesce(
      requested_refund_preference,
      refund_mode,
      'cash_refund'
    ),
    paid_amount = case
      when paid_amount <= 0 then total_tour_cost
      else paid_amount
    end,
    status = case when status = 'requested' then 'submitted' else status end;

drop index if exists public.cancellation_one_open_request_per_booking;
create unique index cancellation_one_open_request_per_booking
  on public.cancellation_requests(booking_id)
  where status in (
    'submitted',
    'under_review',
    'approved',
    'refund_pending',
    'refund_processing',
    'credit_adjustment_pending'
  );

alter table public.refund_transactions
  add column if not exists provider_payment_id text,
  add column if not exists provider_refund_id text,
  add column if not exists provider_receipt text,
  add column if not exists provider_status text,
  add column if not exists provider_payload jsonb;

create unique index if not exists refund_transactions_request_unique
  on public.refund_transactions(request_id);

create unique index if not exists refund_transactions_provider_refund_unique
  on public.refund_transactions(provider_refund_id)
  where provider_refund_id is not null;

create unique index if not exists credit_adjustments_request_unique
  on public.credit_adjustments(request_id);

create table if not exists public.refund_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  provider_refund_id text not null,
  provider_status text not null,
  signature_verified boolean not null default false,
  raw_payload jsonb not null,
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

alter table public.refund_webhook_events enable row level security;

create sequence if not exists public.cancellation_request_sequence start with 1001;

create or replace function public.create_cancellation_request_v1(
  p_booking_id text,
  p_user_id uuid,
  p_reason text,
  p_refund_preference text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings%rowtype;
  v_request public.cancellation_requests%rowtype;
  v_request_id text;
begin
  if not exists (
    select 1 from public.profiles
    where id = p_user_id and role = 'customer'
  ) then
    raise exception 'CUSTOMER_ONLY';
  end if;

  if p_refund_preference not in ('cash_refund', 'credit_adjustment') then
    raise exception 'REFUND_PREFERENCE_INVALID';
  end if;

  if char_length(trim(coalesce(p_reason, ''))) not between 5 and 2000 then
    raise exception 'CANCELLATION_REASON_INVALID';
  end if;

  select *
  into v_booking
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then raise exception 'BOOKING_NOT_FOUND'; end if;
  if v_booking.user_id <> p_user_id then raise exception 'BOOKING_FORBIDDEN'; end if;
  if v_booking.status <> 'confirmed' then raise exception 'BOOKING_NOT_CANCELLABLE'; end if;

  if exists (
    select 1
    from public.cancellation_requests
    where booking_id = p_booking_id
      and status in (
        'submitted',
        'under_review',
        'approved',
        'refund_pending',
        'refund_processing',
        'credit_adjustment_pending'
      )
    for update
  ) then
    raise exception 'CANCELLATION_ALREADY_OPEN';
  end if;

  v_request_id := 'CAN-' || to_char(
    now() at time zone 'Asia/Kolkata',
    'YYYYMMDD'
  ) || '-' || lpad(
    nextval('public.cancellation_request_sequence')::text,
    6,
    '0'
  );

  insert into public.cancellation_requests (
    id,
    booking_id,
    user_id,
    total_tour_cost,
    paid_amount,
    traveler_count,
    departure_date,
    reason,
    status,
    requested_refund_preference
  )
  values (
    v_request_id,
    v_booking.id,
    p_user_id,
    v_booking.grand_total,
    v_booking.amount_paid,
    v_booking.traveler_count,
    v_booking.departure_at,
    trim(p_reason),
    'submitted',
    p_refund_preference
  )
  returning * into v_request;

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
    'cancellation.requested',
    p_user_id,
    'customer',
    v_booking.amount_paid,
    'success',
    'Customer requested booking cancellation',
    jsonb_build_object(
      'requestId', v_request.id,
      'bookingId', v_booking.id,
      'refundPreference', p_refund_preference
    )
  );

  return jsonb_build_object(
    'requestId', v_request.id,
    'bookingId', v_request.booking_id,
    'status', 'admin_review',
    'estimatedRefund', null,
    'creditAdjustmentAmount', null
  );
end;
$$;

create or replace function public.admin_review_cancellation_v1(
  p_request_id text,
  p_actor_id uuid,
  p_approve boolean,
  p_refund_mode text,
  p_supplier_charges numeric,
  p_supplier_proof_url text,
  p_admin_note text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.cancellation_requests%rowtype;
  v_days integer;
  v_fee_percent integer;
  v_land_charge numeric(12,2);
  v_service_charge numeric(12,2);
  v_supplier_charges numeric(12,2);
  v_total_deduction numeric(12,2);
  v_refund numeric(12,2);
  v_policy_band text;
  v_calculation jsonb;
begin
  if not exists (
    select 1 from public.profiles
    where id = p_actor_id and role = 'admin'
  ) then
    raise exception 'ADMIN_ONLY';
  end if;

  select *
  into v_request
  from public.cancellation_requests
  where id = p_request_id
  for update;

  if not found then raise exception 'CANCELLATION_NOT_FOUND'; end if;
  if v_request.status not in ('submitted', 'under_review') then
    raise exception 'CANCELLATION_NOT_REVIEWABLE';
  end if;

  if not p_approve then
    update public.cancellation_requests
    set status = 'rejected',
        admin_note = nullif(trim(coalesce(p_admin_note, '')), ''),
        reviewed_by = p_actor_id,
        reviewed_at = now(),
        updated_at = now()
    where id = p_request_id
    returning * into v_request;

    insert into public.audit_logs (
      action, actor_id, actor_role, amount, status, reason, metadata
    )
    values (
      'cancellation.admin_reviewed',
      p_actor_id,
      'admin',
      0,
      'success',
      'Cancellation request rejected',
      jsonb_build_object('requestId', p_request_id, 'approved', false)
    );

    return jsonb_build_object(
      'requestId', v_request.id,
      'bookingId', v_request.booking_id,
      'userId', v_request.user_id,
      'status', 'rejected',
      'reason', v_request.reason,
      'refundPreference', v_request.requested_refund_preference,
      'totalTourCost', v_request.total_tour_cost,
      'amountPaid', v_request.paid_amount,
      'travelerCount', v_request.traveler_count,
      'departureDate', v_request.departure_date,
      'supplierCharges', v_request.supplier_charges,
      'requestedAt', v_request.created_at
    );
  end if;

  if p_refund_mode not in ('cash_refund', 'credit_adjustment') then
    raise exception 'REFUND_MODE_INVALID';
  end if;

  v_supplier_charges := greatest(0, round(coalesce(p_supplier_charges, 0), 2));
  v_days := ceil(
    extract(epoch from (v_request.departure_date - now())) / 86400
  )::integer;

  if v_days >= 30 then
    v_fee_percent := 0;
    v_service_charge := 500 * greatest(1, v_request.traveler_count);
    v_policy_band := '30_plus_days';
  elsif v_days >= 15 then
    v_fee_percent := 25;
    v_service_charge := 0;
    v_policy_band := '15_to_29_days';
  elsif v_days >= 7 then
    v_fee_percent := 50;
    v_service_charge := 0;
    v_policy_band := '7_to_14_days';
  else
    v_fee_percent := 100;
    v_service_charge := 0;
    v_policy_band := '0_to_6_days';
  end if;

  v_land_charge := round(v_request.total_tour_cost * v_fee_percent / 100, 2);
  v_total_deduction := least(
    v_request.paid_amount,
    v_land_charge + v_service_charge + v_supplier_charges
  );
  v_refund := greatest(0, v_request.paid_amount - v_total_deduction);
  v_calculation := jsonb_build_object(
    'daysBeforeDeparture', v_days,
    'cancellationFeePercent', v_fee_percent,
    'landPackageCancellationCharge', v_land_charge,
    'serviceCharge', v_service_charge,
    'supplierCharges', v_supplier_charges,
    'totalDeduction', v_total_deduction,
    'estimatedRefund', v_refund,
    'policyBand', v_policy_band
  );

  update public.cancellation_requests
  set status = 'approved',
      refund_mode = p_refund_mode,
      supplier_charges = v_supplier_charges,
      supplier_proof_urls = case
        when nullif(trim(coalesce(p_supplier_proof_url, '')), '') is null
          then supplier_proof_urls
        else array_append(supplier_proof_urls, trim(p_supplier_proof_url))
      end,
      calculation = v_calculation,
      approved_refund_amount = v_refund,
      admin_note = nullif(trim(coalesce(p_admin_note, '')), ''),
      reviewed_by = p_actor_id,
      reviewed_at = now(),
      refund_status = case
        when p_refund_mode = 'cash_refund' then 'pending'
        else refund_status
      end,
      credit_adjustment_status = case
        when p_refund_mode = 'credit_adjustment' then 'pending'
        else credit_adjustment_status
      end,
      updated_at = now()
  where id = p_request_id
  returning * into v_request;

  if v_supplier_charges > 0
     or nullif(trim(coalesce(p_supplier_proof_url, '')), '') is not null then
    insert into public.cancellation_supplier_charges (
      request_id, amount, proof_url, note, uploaded_by
    )
    values (
      p_request_id,
      v_supplier_charges,
      nullif(trim(coalesce(p_supplier_proof_url, '')), ''),
      nullif(trim(coalesce(p_admin_note, '')), ''),
      p_actor_id
    );
  end if;

  update public.bookings
  set status = 'cancelled', updated_at = now()
  where id = v_request.booking_id;

  insert into public.audit_logs (
    action, actor_id, actor_role, amount, status, reason, metadata
  )
  values (
    'cancellation.admin_reviewed',
    p_actor_id,
    'admin',
    v_refund,
    'success',
    'Cancellation request approved',
    jsonb_build_object(
      'requestId', p_request_id,
      'bookingId', v_request.booking_id,
      'approved', true,
      'refundMode', p_refund_mode,
      'calculation', v_calculation
    )
  );

  return jsonb_build_object(
    'requestId', v_request.id,
    'bookingId', v_request.booking_id,
    'userId', v_request.user_id,
    'status', 'approved',
    'reason', v_request.reason,
    'refundPreference', v_request.requested_refund_preference,
    'refundMode', v_request.refund_mode,
    'totalTourCost', v_request.total_tour_cost,
    'amountPaid', v_request.paid_amount,
    'travelerCount', v_request.traveler_count,
    'departureDate', v_request.departure_date,
    'supplierCharges', v_request.supplier_charges,
    'supplierProofUrls', v_request.supplier_proof_urls,
    'estimatedRefund', v_refund,
    'calculation', v_calculation,
    'requestedAt', v_request.created_at
  );
end;
$$;

create or replace function public.admin_process_cancellation_payout_v1(
  p_request_id text,
  p_actor_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.cancellation_requests%rowtype;
  v_refund public.refund_transactions%rowtype;
  v_should_call_provider boolean := false;
  v_receipt text;
begin
  if not exists (
    select 1 from public.profiles
    where id = p_actor_id and role = 'admin'
  ) then
    raise exception 'ADMIN_ONLY';
  end if;

  select *
  into v_request
  from public.cancellation_requests
  where id = p_request_id
  for update;

  if not found then raise exception 'CANCELLATION_NOT_FOUND'; end if;
  if v_request.refund_mode is null or v_request.approved_refund_amount is null then
    raise exception 'CANCELLATION_NOT_APPROVED';
  end if;

  if v_request.refund_mode = 'credit_adjustment' then
    if v_request.status = 'credit_adjusted' then
      return jsonb_build_object(
        'requestId', v_request.id,
        'bookingId', v_request.booking_id,
        'status', 'credit_adjusted',
        'refundMode', 'credit_adjustment',
        'amount', v_request.approved_refund_amount,
        'duplicate', true,
        'shouldCallProvider', false
      );
    end if;
    if v_request.status <> 'approved' then
      raise exception 'CANCELLATION_PAYOUT_NOT_READY';
    end if;

    insert into public.credit_adjustments (
      request_id, booking_id, user_id, amount, expires_at, status
    )
    values (
      v_request.id,
      v_request.booking_id,
      v_request.user_id,
      v_request.approved_refund_amount,
      now() + interval '12 months',
      'active'
    )
    on conflict (request_id) do nothing;

    update public.cancellation_requests
    set status = 'credit_adjusted',
        credit_adjustment_status = 'active',
        updated_at = now()
    where id = v_request.id;

    insert into public.audit_logs (
      action, actor_id, actor_role, amount, status, reason, metadata
    )
    values (
      'cancellation.credit_adjusted',
      p_actor_id,
      'admin',
      v_request.approved_refund_amount,
      'success',
      'Cancellation refund issued as future booking credit',
      jsonb_build_object(
        'requestId', v_request.id,
        'bookingId', v_request.booking_id,
        'expiresInMonths', 12
      )
    );

    return jsonb_build_object(
      'requestId', v_request.id,
      'bookingId', v_request.booking_id,
      'status', 'credit_adjusted',
      'refundMode', 'credit_adjustment',
      'amount', v_request.approved_refund_amount,
      'duplicate', false,
      'shouldCallProvider', false
    );
  end if;

  if v_request.status in ('refunded', 'refund_processing', 'refund_pending') then
    select *
    into v_refund
    from public.refund_transactions
    where request_id = v_request.id
    for update;

    return jsonb_build_object(
      'requestId', v_request.id,
      'bookingId', v_request.booking_id,
      'status', v_request.status,
      'refundMode', 'cash_refund',
      'amount', v_request.approved_refund_amount,
      'providerRefundId', v_request.provider_refund_id,
      'duplicate', true,
      'shouldCallProvider', false
    );
  end if;

  if v_request.status not in ('approved', 'refund_failed') then
    raise exception 'CANCELLATION_PAYOUT_NOT_READY';
  end if;

  v_receipt := 'BED-' || replace(v_request.id, '-', '');

  select *
  into v_refund
  from public.refund_transactions
  where request_id = v_request.id
  for update;

  if not found then
    insert into public.refund_transactions (
      request_id,
      booking_id,
      user_id,
      amount,
      mode,
      status,
      provider_receipt,
      provider_status
    )
    values (
      v_request.id,
      v_request.booking_id,
      v_request.user_id,
      v_request.approved_refund_amount,
      'cash_refund',
      'initiating',
      v_receipt,
      'initiating'
    )
    returning * into v_refund;
    v_should_call_provider := true;
  elsif v_refund.status = 'failed' then
    update public.refund_transactions
    set status = 'initiating',
        provider_status = 'initiating',
        updated_at = now()
    where id = v_refund.id
    returning * into v_refund;
    v_should_call_provider := true;
  end if;

  update public.cancellation_requests
  set status = 'refund_pending',
      refund_status = 'pending',
      updated_at = now()
  where id = v_request.id;

  insert into public.audit_logs (
    action, actor_id, actor_role, amount, status, reason, metadata
  )
  values (
    'cancellation.refund_pending',
    p_actor_id,
    'admin',
    v_request.approved_refund_amount,
    'pending',
    'Cash refund queued for Razorpay',
    jsonb_build_object(
      'requestId', v_request.id,
      'bookingId', v_request.booking_id,
      'receipt', v_receipt
    )
  );

  return jsonb_build_object(
    'requestId', v_request.id,
    'bookingId', v_request.booking_id,
    'userId', v_request.user_id,
    'status', 'refund_pending',
    'refundMode', 'cash_refund',
    'amount', v_request.approved_refund_amount,
    'receipt', v_receipt,
    'duplicate', not v_should_call_provider,
    'shouldCallProvider', v_should_call_provider
  );
end;
$$;

create or replace function public.admin_mark_refund_result_v1(
  p_request_id text,
  p_actor_id uuid,
  p_status text,
  p_provider_ref text,
  p_provider_payment_id text default null,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.cancellation_requests%rowtype;
  v_request_status text;
  v_transaction_status text;
begin
  if not exists (
    select 1 from public.profiles
    where id = p_actor_id and role = 'admin'
  ) then
    raise exception 'ADMIN_ONLY';
  end if;
  if p_status not in ('pending', 'processed', 'failed') then
    raise exception 'REFUND_STATUS_INVALID';
  end if;

  select *
  into v_request
  from public.cancellation_requests
  where id = p_request_id
  for update;
  if not found then raise exception 'CANCELLATION_NOT_FOUND'; end if;

  v_request_status := case p_status
    when 'processed' then 'refunded'
    when 'failed' then 'refund_failed'
    else 'refund_processing'
  end;
  v_transaction_status := case p_status
    when 'processed' then 'completed'
    when 'failed' then 'failed'
    else 'processing'
  end;

  update public.refund_transactions
  set status = v_transaction_status,
      provider_refund_id = coalesce(nullif(p_provider_ref, ''), provider_refund_id),
      provider_payment_id = coalesce(
        nullif(p_provider_payment_id, ''),
        provider_payment_id
      ),
      provider_ref = coalesce(nullif(p_provider_ref, ''), provider_ref),
      provider_status = p_status,
      provider_payload = coalesce(p_payload, provider_payload),
      updated_at = now()
  where request_id = p_request_id;

  update public.cancellation_requests
  set status = v_request_status,
      refund_status = v_transaction_status,
      provider_refund_id = coalesce(
        nullif(p_provider_ref, ''),
        provider_refund_id
      ),
      provider_refund_status = p_status,
      updated_at = now()
  where id = p_request_id
  returning * into v_request;

  insert into public.audit_logs (
    action, actor_id, actor_role, amount, status, reason, metadata
  )
  values (
    'cancellation.refund_' || p_status,
    p_actor_id,
    'admin',
    v_request.approved_refund_amount,
    case when p_status = 'failed' then 'failed'::public.audit_status
         when p_status = 'pending' then 'pending'::public.audit_status
         else 'success'::public.audit_status end,
    'Razorpay refund state updated',
    jsonb_build_object(
      'requestId', p_request_id,
      'providerRefundId', p_provider_ref,
      'providerStatus', p_status
    )
  );

  return jsonb_build_object(
    'requestId', v_request.id,
    'bookingId', v_request.booking_id,
    'status', v_request.status,
    'refundMode', 'cash_refund',
    'amount', v_request.approved_refund_amount,
    'providerRefundId', v_request.provider_refund_id,
    'duplicate', false,
    'shouldCallProvider', false
  );
end;
$$;

create or replace function public.process_verified_refund_webhook_v1(
  p_provider_event_id text,
  p_provider_refund_id text,
  p_provider_status text,
  p_payload jsonb,
  p_signature_verified boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_refund public.refund_transactions%rowtype;
  v_request_status text;
  v_transaction_status text;
begin
  if not p_signature_verified then raise exception 'SIGNATURE_REQUIRED'; end if;
  if p_provider_status not in ('pending', 'processed', 'failed') then
    raise exception 'REFUND_STATUS_INVALID';
  end if;

  insert into public.refund_webhook_events (
    provider,
    provider_event_id,
    provider_refund_id,
    provider_status,
    signature_verified,
    raw_payload
  )
  values (
    'razorpay',
    p_provider_event_id,
    p_provider_refund_id,
    p_provider_status,
    true,
    p_payload
  )
  on conflict (provider, provider_event_id) do nothing;

  if not found then
    return jsonb_build_object('duplicate', true);
  end if;

  select *
  into v_refund
  from public.refund_transactions
  where provider_refund_id = p_provider_refund_id
     or provider_ref = p_provider_refund_id
  for update;
  if not found then raise exception 'REFUND_TRANSACTION_NOT_FOUND'; end if;

  v_request_status := case p_provider_status
    when 'processed' then 'refunded'
    when 'failed' then 'refund_failed'
    else 'refund_processing'
  end;
  v_transaction_status := case p_provider_status
    when 'processed' then 'completed'
    when 'failed' then 'failed'
    else 'processing'
  end;

  update public.refund_transactions
  set status = v_transaction_status,
      provider_status = p_provider_status,
      provider_payload = p_payload,
      updated_at = now()
  where id = v_refund.id;

  update public.cancellation_requests
  set status = v_request_status,
      refund_status = v_transaction_status,
      provider_refund_id = p_provider_refund_id,
      provider_refund_status = p_provider_status,
      updated_at = now()
  where id = v_refund.request_id;

  insert into public.audit_logs (
    action, amount, status, reason, metadata
  )
  values (
    'cancellation.refund_webhook_' || p_provider_status,
    v_refund.amount,
    case when p_provider_status = 'failed' then 'failed'::public.audit_status
         when p_provider_status = 'pending' then 'pending'::public.audit_status
         else 'success'::public.audit_status end,
    'Verified Razorpay refund webhook applied',
    jsonb_build_object(
      'requestId', v_refund.request_id,
      'providerEventId', p_provider_event_id,
      'providerRefundId', p_provider_refund_id
    )
  );

  return jsonb_build_object(
    'duplicate', false,
    'requestId', v_refund.request_id,
    'status', v_request_status
  );
end;
$$;

revoke all on function public.create_cancellation_request_v1(
  text, uuid, text, text
) from public, anon, authenticated;
revoke all on function public.admin_review_cancellation_v1(
  text, uuid, boolean, text, numeric, text, text
) from public, anon, authenticated;
revoke all on function public.admin_process_cancellation_payout_v1(
  text, uuid
) from public, anon, authenticated;
revoke all on function public.admin_mark_refund_result_v1(
  text, uuid, text, text, text, jsonb
) from public, anon, authenticated;
revoke all on function public.process_verified_refund_webhook_v1(
  text, text, text, jsonb, boolean
) from public, anon, authenticated;

grant execute on function public.create_cancellation_request_v1(
  text, uuid, text, text
) to service_role;
grant execute on function public.admin_review_cancellation_v1(
  text, uuid, boolean, text, numeric, text, text
) to service_role;
grant execute on function public.admin_process_cancellation_payout_v1(
  text, uuid
) to service_role;
grant execute on function public.admin_mark_refund_result_v1(
  text, uuid, text, text, text, jsonb
) to service_role;
grant execute on function public.process_verified_refund_webhook_v1(
  text, text, text, jsonb, boolean
) to service_role;
