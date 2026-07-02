import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const backendRoot = basename(process.cwd()) === 'backend'
  ? process.cwd()
  : resolve(process.cwd(), 'backend');

const migration = readFileSync(
  resolve(backendRoot, 'supabase/migrations/006_identity_catalog_booking.sql'),
  'utf8',
);
const edgePath = resolve(
  backendRoot,
  'supabase/functions/custom-tour-request/index.ts',
);
const edgeSource = existsSync(edgePath) ? readFileSync(edgePath, 'utf8') : '';

describe('custom-tour persistence schema', () => {
  it('creates request, quotation, and revision tables with protected reads', () => {
    for (const table of [
      'public.custom_tour_requests',
      'public.custom_tour_quotations',
      'public.custom_tour_revisions',
    ]) {
      expect(migration).toContain(`create table if not exists ${table}`);
      expect(migration).toContain(`alter table ${table} enable row level security`);
    }

    expect(migration).toContain('custom_tour_requests_read_self_or_admin');
    expect(migration).toContain('custom_tour_quotations_read_self_or_admin');
    expect(migration).toContain('custom_tour_revisions_read_self_or_admin');
    expect(migration).not.toContain('custom_tour_requests_write_self');
  });

  it('enforces the custom-tour status transition matrix in the database', () => {
    expect(migration).toContain('enforce_custom_tour_status_transition');
    expect(migration).toContain("'Under Review', 'Quotation Sent'");
    expect(migration).toContain("'Quotation Sent', 'Revision Requested'");
    expect(migration).toContain("'Quotation Accepted', 'Payment Pending'");
    expect(migration).toContain("'Payment Pending', 'Confirmed Booking'");
  });

  it('authenticates every request and prevents client-selected ownership', () => {
    expect(edgeSource).toContain('requireAuthenticated');
    expect(edgeSource).toContain('user_id: user.id');
    expect(edgeSource).toContain("action === 'admin_quote'");
    expect(edgeSource).toContain("profile.role !== 'admin'");
    expect(edgeSource).not.toContain('body.userId');
  });

  it('allows child ages to remain optional when the public form only supplies a count', () => {
    expect(migration).toContain(
      'check (cardinality(child_ages) = 0 or cardinality(child_ages) = children)',
    );
    expect(edgeSource).toContain(
      'if (childAges.length !== 0 && childAges.length !== children)',
    );
  });
});
