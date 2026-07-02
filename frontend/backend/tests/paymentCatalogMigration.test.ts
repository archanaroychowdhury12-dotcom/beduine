import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/006_identity_catalog_booking.sql'),
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
});
