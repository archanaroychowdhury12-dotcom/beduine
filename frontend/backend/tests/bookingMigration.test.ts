import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const backendRoot = basename(process.cwd()) === 'backend'
  ? process.cwd()
  : resolve(process.cwd(), 'backend');

const migration006 = readFileSync(
  resolve(backendRoot, 'supabase/migrations/006_identity_catalog_booking.sql'),
  'utf8',
);
const migration007 = readFileSync(
  resolve(backendRoot, 'supabase/migrations/007_atomic_customer_workflows.sql'),
  'utf8',
);

describe('production booking schema and draft RPC', () => {
  it('creates normalized tour, traveler, pickup, booking, and installment tables', () => {
    for (const table of [
      'public.tours',
      'public.tour_departures',
      'public.bookings',
      'public.booking_travelers',
      'public.booking_pickups',
      'public.booking_installments',
    ]) {
      expect(migration006).toContain(`create table if not exists ${table}`);
    }
    expect(migration006).toContain('bookings_read_self_or_admin');
    expect(migration006).not.toContain('for insert with check (user_id = auth.uid())');
  });

  it('locks inventory and credits in one server-only booking transaction', () => {
    expect(migration007).toContain('create_tour_booking_draft_v1');
    expect(migration007).toContain('for update');
    expect(migration007).toContain('ONE_CREDIT_PER_TRAVELER');
    expect(migration007).toContain('CREDIT_CATEGORY_MISMATCH');
    expect(migration007).toContain('DEPARTURE_CAPACITY_EXCEEDED');
    expect(migration007).toContain('revoke all on function public.create_tour_booking_draft_v1');
  });

  it('fulfills a captured booking payment exactly once on the server', () => {
    expect(migration007).toContain('process_verified_booking_payment_v1');
    expect(migration007).toContain("status = 'redeemed'");
    expect(migration007).toContain('capacity_reserved = capacity_reserved +');
    expect(migration007).toContain("'booking.payment_verified'");
  });
});
