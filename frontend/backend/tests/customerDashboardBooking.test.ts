import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const backendRoot = basename(process.cwd()) === 'backend'
  ? process.cwd()
  : resolve(process.cwd(), 'backend');

const source = readFileSync(
  resolve(backendRoot, 'supabase/functions/customer-dashboard/index.ts'),
  'utf8',
);

describe('customer dashboard booking projection', () => {
  it('queries and returns the authenticated customer booking rows', () => {
    expect(source).toContain(".from('bookings')");
    expect(source).toContain('.eq(\'user_id\', user.id)');
    expect(source).toContain('bookingsResult.data');
    expect(source).not.toContain('bookings: []');
  });
});
