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
const adminOperations = readOptional(
  resolve(backendRoot, 'supabase/functions/admin-operations/index.ts'),
);
const requestCancellation = readOptional(
  resolve(backendRoot, 'supabase/functions/request-cancellation/index.ts'),
);
const webhook = readOptional(
  resolve(backendRoot, 'supabase/functions/payment-webhook/index.ts'),
);

describe('production cancellation administration', () => {
  it('defines locked, audited admin review and payout transactions', () => {
    expect(migration).toContain('admin_review_cancellation_v1');
    expect(migration).toContain('admin_process_cancellation_payout_v1');
    expect(migration).toContain('admin_mark_refund_result_v1');
    expect(migration).toContain('for update');
    expect(migration).toContain("interval '12 months'");
    expect(migration).toContain('cancellation.admin_reviewed');
  });

  it('authenticates cancellation ownership and all admin operations', () => {
    expect(requestCancellation).toContain('requireUser');
    expect(requestCancellation).toContain('create_cancellation_request_v1');
    expect(adminOperations).toContain('requireAdmin');
    expect(adminOperations).toContain('https://api.razorpay.com/v1/payments/');
    expect(adminOperations).toContain('/refund');
  });

  it('maps verified Razorpay refund webhooks idempotently', () => {
    expect(webhook).toContain('refund.processed');
    expect(webhook).toContain('refund.failed');
    expect(webhook).toContain('process_verified_refund_webhook_v1');
  });
});
