import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const backendRoot = basename(process.cwd()) === 'backend'
  ? process.cwd()
  : resolve(process.cwd(), 'backend');
const migration = readFileSync(
  resolve(backendRoot, 'supabase/migrations/007_atomic_customer_workflows.sql'),
  'utf8',
);

describe('persistent draw outcomes', () => {
  it('stores winner benefits and idempotent non-winner credit units', () => {
    expect(migration).toContain('create table if not exists public.winner_benefits');
    expect(migration).toContain('create table if not exists public.winner_tour_batches');
    expect(migration).toContain('issue_non_winner_credits_v1');
    expect(migration).toContain('discount_credit_units_cycle_user_sequence_unique');
    expect(migration).toContain('non_winner_credits_issued_at');
  });

  it('publishes the cycle and returns plan-round metadata during reveal', () => {
    expect(migration).toContain('admin_reveal_next_weekly_draw_winner_v1');
    expect(migration).toContain("'roundKey', v_entry.plan_round_key");
    expect(migration).toContain("'planLabel'");
    expect(migration).toContain("status = 'published'");
  });
});
