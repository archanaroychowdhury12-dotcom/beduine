import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const backendRoot = basename(process.cwd()) === 'backend'
  ? process.cwd()
  : resolve(process.cwd(), 'backend');
const readOptional = (path: string) => existsSync(path) ? readFileSync(path, 'utf8') : '';

const migration = readOptional(
  resolve(backendRoot, 'supabase/migrations/008_admin_support_refund_workflows.sql'),
);
const supportEdge = readOptional(
  resolve(backendRoot, 'supabase/functions/support-tickets/index.ts'),
);
const adminOperations = readOptional(
  resolve(backendRoot, 'supabase/functions/admin-operations/index.ts'),
);

describe('support and production admin schema', () => {
  it('stores owned support tickets and conversation messages under RLS', () => {
    expect(migration).toContain('create table if not exists public.support_tickets');
    expect(migration).toContain('create table if not exists public.support_ticket_messages');
    expect(migration).toContain('support_tickets_read_self_or_admin');
    expect(migration).toContain('support_ticket_messages_read_self_or_admin');
  });

  it('authenticates customer support writes and admin support mutations', () => {
    expect(supportEdge).toContain('requireUser');
    expect(supportEdge).toContain('create_support_ticket_v1');
    expect(migration).toContain('support_ticket.created');
    expect(adminOperations).toContain("action === 'list_users'");
    expect(adminOperations).toContain("action === 'list_audit_logs'");
    expect(adminOperations).toContain("action === 'list_support_tickets'");
    expect(adminOperations).toContain("action === 'update_support_ticket'");
  });
});
