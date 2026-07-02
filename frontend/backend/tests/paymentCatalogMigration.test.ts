import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const backendRoot = basename(process.cwd()) === 'backend'
  ? process.cwd()
  : resolve(process.cwd(), 'backend');
const migration = readFileSync(
  resolve(backendRoot, 'supabase/migrations/006_identity_catalog_booking.sql'),
  'utf8',
);
const paymentWorkflowMigration = readFileSync(
  resolve(backendRoot, 'supabase/migrations/003_production_atomic_rpc_and_hardening.sql'),
  'utf8',
);

describe('authoritative membership plan catalog', () => {
  it('stores active plan prices and payment-session purpose on the server', () => {
    expect(migration).toContain('create table if not exists public.membership_plans');
    expect(migration).toContain("'domestic_gold'");
    expect(migration).toContain('799');
    expect(migration).toContain('add column if not exists purpose');
    expect(migration).toContain('add column if not exists reference_id');
    expect(migration).toContain('add column if not exists amount_paise');
  });

  it('derives subscription category from the server-owned plan id', () => {
    expect(paymentWorkflowMigration).toContain(
      "when v_session.plan_id like 'international_%' then 'international'",
    );
    expect(paymentWorkflowMigration).not.toContain("'travel_winner benefit'");
    expect(paymentWorkflowMigration).toContain(
      "if v_session.status in ('verified', 'refunded', 'chargeback')",
    );
  });
});
