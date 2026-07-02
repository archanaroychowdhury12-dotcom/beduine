import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const backendRoot = basename(process.cwd()) === 'backend'
  ? process.cwd()
  : resolve(process.cwd(), 'backend');
const migrationPath = resolve(
  backendRoot,
  'supabase/migrations/007_atomic_customer_workflows.sql',
);

describe('atomic participation migration', () => {
  it('locks one normalized TRC and creates a sequence-backed ticket', () => {
    expect(existsSync(migrationPath)).toBe(true);
    const migration = readFileSync(migrationPath, 'utf8');
    expect(migration).toContain('create sequence if not exists public.trc_ticket_sequence');
    expect(migration).toContain('for update skip locked');
    expect(migration).toContain('weekly_draw_entries_user_cycle_unique');
    expect(migration).toContain('participate_weekly_draw_v1');
    expect(migration).toContain('revoke all on function public.participate_weekly_draw_v1');
  });
});
