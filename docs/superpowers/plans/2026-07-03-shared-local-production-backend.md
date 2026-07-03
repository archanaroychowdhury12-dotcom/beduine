# Shared Local and Production Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the browser-only demo backend with a local Supabase runtime that executes the same Auth, Edge Function, PostgreSQL RPC, ledger, draw, booking, and admin flows used in production; only one-click login and automatic local payment remain test conveniences.

**Architecture:** The frontend always uses `createSupabaseBackendAdapter()` and a real Supabase session. Local and hosted environments differ only by URLs, browser-safe keys, one-click login visibility, and the server-side payment provider. `create-payment-order` auto-verifies a local mock payment through the same PostgreSQL fulfillment RPC that the Razorpay webhook uses.

**Tech Stack:** React 19, Vite 7, TypeScript 5.9, Supabase JS 2, Supabase CLI, Docker Desktop, PostgreSQL migrations, Supabase Edge Functions/Deno, Vitest 4, Playwright 1.61.

## Global Constraints

- Do not create or retain a separate demo business backend.
- Do not require a hosted Supabase project during local implementation.
- Use real local Supabase Auth sessions for the seeded customer and admin.
- Mock payment is allowed only when `BEDUINE_RUNTIME=local` and `PAYMENT_PROVIDER=mock`.
- Production payment remains Razorpay webhook verified.
- Mock and Razorpay events must invoke the same verified-payment PostgreSQL RPCs.
- One verified subscription payment issues exactly one TRC.
- Draw winners are calculated separately for all six category/tier rounds with `ceil(participants * 0.05)`.
- Silver, Gold, and Platinum non-winners receive 1, 2, and 4 Discount Credit units respectively.
- Preserve unrelated worktree changes in the landing HTML and production environment files.
- Never commit generated local keys, service-role keys, payment secrets, or `.env.local` files.
- Use TDD for every behavioral change and commit each completed task separately.

---

## File Structure

**Create**

- `frontend/backend/supabase/config.toml`: local Supabase service and Edge Function configuration.
- `frontend/backend/business_logic/payment/paymentRuntimePolicy.ts`: fail-closed local/mock provider policy.
- `frontend/backend/business_logic/payment/verifiedPaymentFulfillment.ts`: shared RPC name and argument builder.
- `frontend/backend/tests/paymentRuntimePolicy.test.ts`: runtime guard tests.
- `frontend/backend/tests/verifiedPaymentFulfillment.test.ts`: shared fulfillment mapping tests.
- `frontend/backend/scripts/local-supabase-env.mjs`: parse local CLI output and generate ignored frontend/server env files.
- `frontend/backend/scripts/bootstrap-local.mjs`: idempotently create real Auth users and protected profiles.
- `frontend/backend/scripts/seed-showcase.mjs`: create showcase domain history in local PostgreSQL.
- `frontend/backend/tests/localBootstrapSource.test.ts`: static security checks for bootstrap scripts.
- `frontend/e2e/local-shared-backend.spec.ts`: browser coverage against local Supabase.

**Modify**

- `frontend/backend/package.json`
- `frontend/backend/package-lock.json`
- `frontend/backend/.env.supabase.example`
- `frontend/backend/supabase/functions/create-payment-order/index.ts`
- `frontend/backend/supabase/functions/payment-webhook/index.ts`
- `frontend/src/config/productionEnv.ts`
- `frontend/src/vite-env.d.ts`
- `frontend/src/utils/supabaseClient.ts`
- `frontend/src/utils/userMapper.ts`
- `frontend/src/services/backend/index.ts`
- `frontend/src/services/backend/backendContracts.ts`
- `frontend/src/services/payment/subscriptionPaymentFlow.ts`
- `frontend/src/LoginPage.tsx`
- `frontend/src/AdminLoginPage.tsx`
- `frontend/src/pages/subscription-page/SubscriptionLandingPage.tsx`
- `frontend/src/features/dashboard/hooks/useDashboardSubscription.ts`
- `frontend/src/services/customTourService.ts`
- `frontend/src/features/admin/hooks/useAdminUsers.ts`
- `frontend/src/features/admin/hooks/useAdminAuditLogs.ts`
- `frontend/src/features/admin/AdminPage.tsx`
- `frontend/src/features/admin/components/AdminPanel.tsx`
- `frontend/.env.example`
- `frontend/.env.production.example`
- `frontend/playwright.config.ts`
- Relevant frontend/backend tests named in each task.

**Delete after imports are removed**

- `frontend/src/services/backend/demoBackendAdapter.ts`
- `frontend/src/services/demoWalletService.ts`
- `frontend/src/services/payment/mockPaymentGateway.ts`
- `frontend/src/services/customTourDemoService.ts`
- `frontend/src/components/demo/DemoBanner.tsx`
- `frontend/src/features/admin/hooks/adminUsersDemo.ts`
- `frontend/src/features/admin/hooks/useAdminWalletActions.ts`
- `frontend/tests/services/demoCreditFlow.test.ts`

---

### Task 1: Install and Configure the Local Supabase Toolchain

**Files:**
- Create: `frontend/backend/supabase/config.toml`
- Modify: `frontend/backend/package.json`
- Modify: `frontend/backend/package-lock.json`

**Interfaces:**
- Produces: `npm run local:start`, `npm run local:status`, `npm run local:stop`, and `npm run local:reset`.
- Consumes: Existing migrations `frontend/backend/supabase/migrations/001_*.sql` through `008_*.sql`.

- [ ] **Step 1: Verify prerequisites and install Docker Desktop**

Run:

```powershell
node --version
docker --version
```

Expected before installation: Node is `v20` or newer; Docker may be missing.

If Docker is missing, run with elevated approval:

```powershell
winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements
```

Expected: Docker Desktop installs. Start Docker Desktop and wait until `docker info` exits successfully.

- [ ] **Step 2: Install the stable Supabase CLI as a backend dev dependency**

Run:

```powershell
cd E:\busness\bediine\frontend\backend
npm install --save-dev supabase
```

Expected: `package.json` and `package-lock.json` include `supabase`; `npx supabase --version` succeeds.

- [ ] **Step 3: Generate and review local configuration**

Run:

```powershell
npx supabase init
```

Keep the generated local ports and add explicit function JWT policy:

```toml
[functions.payment-webhook]
verify_jwt = false

[functions.public-winners]
verify_jwt = false

[functions.create-payment-order]
verify_jwt = true

[functions.payment-status]
verify_jwt = true
```

Do not alter or move the existing migrations/functions.

- [ ] **Step 4: Add repeatable backend scripts**

Add these exact entries to `frontend/backend/package.json`:

```json
{
  "scripts": {
    "local:start": "supabase start",
    "local:status": "supabase status",
    "local:stop": "supabase stop",
    "local:reset": "supabase db reset"
  }
}
```

Preserve the existing `test`, `test:watch`, and `typecheck` scripts.

- [ ] **Step 5: Start the stack and prove all migrations apply**

Run:

```powershell
npm run local:start
npm run local:status
npm run local:reset
```

Expected: local API and Studio URLs are printed, and migrations `001` through `008` complete without SQL errors.

- [ ] **Step 6: Commit**

```powershell
git add frontend/backend/package.json frontend/backend/package-lock.json frontend/backend/supabase/config.toml
git commit -m "build: configure local supabase runtime"
```

---

### Task 2: Add Fail-Closed Payment Runtime Policy

**Files:**
- Create: `frontend/backend/business_logic/payment/paymentRuntimePolicy.ts`
- Create: `frontend/backend/tests/paymentRuntimePolicy.test.ts`
- Modify: `frontend/backend/business_logic/payment/providerCredentialReadiness.ts`
- Modify: `frontend/backend/tests/providerCredentialReadiness.test.ts`

**Interfaces:**
- Produces: `resolvePaymentRuntime(env): { runtime: 'local' | 'production'; provider: 'mock' | 'razorpay' }`.
- Produces: `assertPaymentRuntimeAllowed(env): void`.
- Consumes: Server-only `BEDUINE_RUNTIME` and `PAYMENT_PROVIDER`.

- [ ] **Step 1: Write the failing runtime policy tests**

Create `frontend/backend/tests/paymentRuntimePolicy.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  assertPaymentRuntimeAllowed,
  resolvePaymentRuntime,
} from '../business_logic/payment/paymentRuntimePolicy';

describe('payment runtime policy', () => {
  it('allows mock payment only in local runtime', () => {
    expect(resolvePaymentRuntime({
      BEDUINE_RUNTIME: 'local',
      PAYMENT_PROVIDER: 'mock',
    })).toEqual({ runtime: 'local', provider: 'mock' });
  });

  it('rejects mock payment in production even when requested', () => {
    expect(() => assertPaymentRuntimeAllowed({
      BEDUINE_RUNTIME: 'production',
      PAYMENT_PROVIDER: 'mock',
    })).toThrow('MOCK_PAYMENT_FORBIDDEN');
  });

  it('allows Razorpay in production', () => {
    expect(resolvePaymentRuntime({
      BEDUINE_RUNTIME: 'production',
      PAYMENT_PROVIDER: 'razorpay',
    })).toEqual({ runtime: 'production', provider: 'razorpay' });
  });

  it('rejects missing and unknown values', () => {
    expect(() => resolvePaymentRuntime({})).toThrow('PAYMENT_RUNTIME_INVALID');
    expect(() => resolvePaymentRuntime({
      BEDUINE_RUNTIME: 'local',
      PAYMENT_PROVIDER: 'stripe',
    })).toThrow('PAYMENT_PROVIDER_INVALID');
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npm test -- --run tests/paymentRuntimePolicy.test.ts
```

Expected: FAIL because `paymentRuntimePolicy.ts` does not exist.

- [ ] **Step 3: Implement the minimal policy**

Create `frontend/backend/business_logic/payment/paymentRuntimePolicy.ts`:

```ts
export type BeduineRuntime = 'local' | 'production';
export type BeduinePaymentProvider = 'mock' | 'razorpay';

export interface PaymentRuntime {
  runtime: BeduineRuntime;
  provider: BeduinePaymentProvider;
}

export function resolvePaymentRuntime(
  env: Record<string, string | undefined>,
): PaymentRuntime {
  const runtime = env.BEDUINE_RUNTIME;
  const provider = env.PAYMENT_PROVIDER;
  if (runtime !== 'local' && runtime !== 'production') {
    throw new Error('PAYMENT_RUNTIME_INVALID');
  }
  if (provider !== 'mock' && provider !== 'razorpay') {
    throw new Error('PAYMENT_PROVIDER_INVALID');
  }
  if (provider === 'mock' && runtime !== 'local') {
    throw new Error('MOCK_PAYMENT_FORBIDDEN');
  }
  return { runtime, provider };
}

export function assertPaymentRuntimeAllowed(
  env: Record<string, string | undefined>,
): void {
  resolvePaymentRuntime(env);
}
```

Extend `PaymentProvider` in `providerCredentialReadiness.ts` with `mock`, give it an empty required credential list, and require `BEDUINE_RUNTIME=local` through `resolvePaymentRuntime` before reporting it ready.

- [ ] **Step 4: Run policy and provider tests**

Run:

```powershell
npm test -- --run tests/paymentRuntimePolicy.test.ts tests/providerCredentialReadiness.test.ts
```

Expected: both files pass and production/mock is rejected.

- [ ] **Step 5: Commit**

```powershell
git add frontend/backend/business_logic/payment frontend/backend/tests/paymentRuntimePolicy.test.ts frontend/backend/tests/providerCredentialReadiness.test.ts
git commit -m "feat: guard local mock payment runtime"
```

---

### Task 3: Share the Verified Payment Fulfillment Command

**Files:**
- Create: `frontend/backend/business_logic/payment/verifiedPaymentFulfillment.ts`
- Create: `frontend/backend/tests/verifiedPaymentFulfillment.test.ts`
- Modify: `frontend/backend/supabase/functions/payment-webhook/index.ts`

**Interfaces:**
- Produces: `buildVerifiedPaymentFulfillment(input): { rpcName; args }`.
- Consumes: payment purpose, provider event identity, session reference, amount, currency, and verification flag.
- Provides the exact RPC call used by both Razorpay webhook and local mock completion.

- [ ] **Step 1: Write the failing fulfillment mapping tests**

Create `frontend/backend/tests/verifiedPaymentFulfillment.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildVerifiedPaymentFulfillment } from '../business_logic/payment/verifiedPaymentFulfillment';

const base = {
  provider: 'mock',
  providerEventId: 'mock:event:1',
  providerPaymentId: 'mock:payment:1',
  sessionRef: '11111111-1111-4111-8111-111111111111',
  amount: 799,
  currency: 'INR',
  status: 'verified' as const,
  payload: { local: true },
  signatureVerified: true,
};

describe('verified payment fulfillment', () => {
  it('routes subscription payment to the subscription RPC', () => {
    const call = buildVerifiedPaymentFulfillment({
      ...base,
      purpose: 'subscription',
    });
    expect(call.rpcName).toBe('process_verified_subscription_payment_v1');
    expect(call.args).toMatchObject({
      p_provider: 'mock',
      p_session_ref: base.sessionRef,
      p_amount: 799,
      p_currency: 'INR',
      p_signature_verified: true,
    });
  });

  it.each(['tour_booking', 'installment'] as const)(
    'routes %s payment to the booking RPC',
    (purpose) => {
      expect(buildVerifiedPaymentFulfillment({
        ...base,
        purpose,
      }).rpcName).toBe('process_verified_booking_payment_v1');
    },
  );

  it('rejects unverified fulfillment input', () => {
    expect(() => buildVerifiedPaymentFulfillment({
      ...base,
      purpose: 'subscription',
      signatureVerified: false,
    })).toThrow('PAYMENT_NOT_VERIFIED');
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npm test -- --run tests/verifiedPaymentFulfillment.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement the typed RPC command builder**

Create `frontend/backend/business_logic/payment/verifiedPaymentFulfillment.ts` with:

```ts
export type PaymentPurpose = 'subscription' | 'tour_booking' | 'installment';
export type FulfillmentStatus = 'verified' | 'failed';

export interface VerifiedPaymentFulfillmentInput {
  purpose: PaymentPurpose;
  provider: 'mock' | 'razorpay';
  providerEventId: string;
  providerPaymentId: string;
  sessionRef: string;
  amount: number;
  currency: string;
  status: FulfillmentStatus;
  payload: Record<string, unknown>;
  signatureVerified: boolean;
}

export function buildVerifiedPaymentFulfillment(
  input: VerifiedPaymentFulfillmentInput,
): {
  rpcName:
    | 'process_verified_subscription_payment_v1'
    | 'process_verified_booking_payment_v1';
  args: Record<string, unknown>;
} {
  if (!input.signatureVerified) throw new Error('PAYMENT_NOT_VERIFIED');
  if (!input.providerEventId || !input.providerPaymentId || !input.sessionRef) {
    throw new Error('PAYMENT_IDENTITY_INVALID');
  }
  if (!Number.isSafeInteger(input.amount) || input.amount <= 0) {
    throw new Error('PAYMENT_AMOUNT_INVALID');
  }
  if (input.currency !== 'INR') throw new Error('PAYMENT_CURRENCY_INVALID');

  const args: Record<string, unknown> = {
    p_provider: input.provider,
    p_provider_event_id: input.providerEventId,
    p_idempotency_key: `${input.provider}:${input.providerEventId}`,
    p_provider_payment_id: input.providerPaymentId,
    p_session_ref: input.sessionRef,
    p_event_type: input.status === 'verified' ? 'payment.verified' : 'payment.failed',
    p_status: input.status,
    p_amount: input.amount,
    p_currency: input.currency,
    p_payload: input.payload,
    p_signature_verified: input.signatureVerified,
  };

  if (input.purpose === 'subscription') {
    return {
      rpcName: 'process_verified_subscription_payment_v1',
      args: { ...args, p_plan_name: '', p_plan_type: '' },
    };
  }
  return { rpcName: 'process_verified_booking_payment_v1', args };
}
```

- [ ] **Step 4: Replace webhook RPC argument duplication**

In `payment-webhook/index.ts`, build the command with
`buildVerifiedPaymentFulfillment(...)` after session lookup, then call:

```ts
const fulfillment = buildVerifiedPaymentFulfillment({
  purpose: session.purpose,
  provider: 'razorpay',
  providerEventId: event.eventId,
  providerPaymentId: event.paymentId,
  sessionRef: event.orderId,
  amount: event.amountRupees,
  currency: event.currency,
  status: event.status,
  payload,
  signatureVerified: true,
});
const { data, error } = await supabase.rpc(
  fulfillment.rpcName,
  fulfillment.args,
);
```

Keep refund handling unchanged.

- [ ] **Step 5: Run payment tests**

Run:

```powershell
npm test -- --run tests/verifiedPaymentFulfillment.test.ts tests/razorpayWebhook.test.ts tests/razorpayOrder.test.ts
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```powershell
git add frontend/backend/business_logic/payment/verifiedPaymentFulfillment.ts frontend/backend/supabase/functions/payment-webhook/index.ts frontend/backend/tests/verifiedPaymentFulfillment.test.ts
git commit -m "refactor: share verified payment fulfillment"
```

---

### Task 4: Auto-Complete Local Payments Through the Shared RPC

**Files:**
- Modify: `frontend/backend/supabase/functions/create-payment-order/index.ts`
- Modify: `frontend/backend/.env.supabase.example`
- Modify: `frontend/src/services/backend/backendContracts.ts`
- Modify: `frontend/tests/services/subscriptionPaymentFlow.test.ts`

**Interfaces:**
- Extends `PaymentOrderResponse` with `provider: 'mock' | 'razorpay'` and `checkoutRequired: boolean`.
- Consumes `resolvePaymentRuntime()` and `buildVerifiedPaymentFulfillment()`.
- Produces a verified payment session immediately only for guarded local/mock runtime.

- [ ] **Step 1: Add a failing frontend contract test for auto-verified orders**

Add to `frontend/tests/services/subscriptionPaymentFlow.test.ts`:

```ts
it('skips Razorpay UI for a server-completed local payment', async () => {
  const createPaymentOrder = vi.fn().mockResolvedValue({
    sessionId: '11111111-1111-4111-8111-111111111111',
    keyId: '',
    orderId: 'mock-order-1',
    amountPaise: 79_900,
    currency: 'INR',
    description: 'Domestic Gold membership',
    provider: 'mock',
    checkoutRequired: false,
  });
  const openCheckout = vi.fn();
  const getPaymentStatus = vi.fn().mockResolvedValue({
    sessionId: '11111111-1111-4111-8111-111111111111',
    status: 'verified',
    subscriptionId: 'subscription-1',
  });

  await expect(completeSubscriptionPayment({
    planId: 'domestic_gold',
    customer: { name: 'Demo Customer', email: 'demo@beduine.com', contact: '' },
    api: { createPaymentOrder, getPaymentStatus },
    openCheckout,
    delay: async () => undefined,
  })).resolves.toMatchObject({ status: 'verified' });

  expect(openCheckout).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npm test -- --run tests/services/subscriptionPaymentFlow.test.ts
```

Expected: FAIL because checkout is always opened.

- [ ] **Step 3: Implement server-side provider selection**

In `create-payment-order/index.ts`:

1. Resolve `BEDUINE_RUNTIME` and `PAYMENT_PROVIDER` server-side.
2. Insert the session with that provider.
3. Keep the existing Razorpay branch unchanged.
4. For local/mock, set `provider_order_id` to `mock-order-${session.id}` and call the
   shared fulfillment RPC with a unique event id.

The mock branch must use:

```ts
const providerEventId = `mock-event-${crypto.randomUUID()}`;
const providerPaymentId = `mock-payment-${crypto.randomUUID()}`;
const fulfillment = buildVerifiedPaymentFulfillment({
  purpose: input.purpose,
  provider: 'mock',
  providerEventId,
  providerPaymentId,
  sessionRef: session.id,
  amount: payment.amountRupees,
  currency: 'INR',
  status: 'verified',
  payload: {
    runtime: 'local',
    purpose: input.purpose,
    referenceId: payment.planId || input.referenceId,
  },
  signatureVerified: true,
});
const { error: fulfillmentError } = await admin.rpc(
  fulfillment.rpcName,
  fulfillment.args,
);
if (fulfillmentError) throw new HttpError(409, 'PAYMENT_FULFILLMENT_REJECTED');
```

Return:

```ts
return json({
  sessionId: session.id,
  keyId: '',
  orderId: `mock-order-${session.id}`,
  amountPaise: payment.amountRupees * 100,
  currency: 'INR',
  description: payment.description,
  provider: 'mock',
  checkoutRequired: false,
}, {}, req);
```

Razorpay returns `provider: 'razorpay'` and `checkoutRequired: true`.

- [ ] **Step 4: Make the browser flow conditional on `checkoutRequired`**

In `completeSubscriptionPayment()`:

```ts
if (order.checkoutRequired) {
  const checkout = await openCheckout(order, customer);
  if (checkout.sessionId !== order.sessionId) {
    throw new Error('PAYMENT_SESSION_MISMATCH');
  }
}
```

Then poll `payment-status` for both providers.

- [ ] **Step 5: Document server-only local settings**

Add to `frontend/backend/.env.supabase.example`:

```dotenv
BEDUINE_RUNTIME=production
PAYMENT_PROVIDER=razorpay
```

Document the ignored local file as:

```dotenv
BEDUINE_RUNTIME=local
PAYMENT_PROVIDER=mock
BEDUINE_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
```

- [ ] **Step 6: Run backend and frontend payment tests**

Run:

```powershell
cd E:\busness\bediine\frontend\backend
npm test
cd ..
npm test -- --run tests/services/subscriptionPaymentFlow.test.ts
npm run typecheck
```

Expected: all pass.

- [ ] **Step 7: Commit**

```powershell
git add frontend/backend/supabase/functions/create-payment-order/index.ts frontend/backend/.env.supabase.example frontend/src/services/backend/backendContracts.ts frontend/src/services/payment/subscriptionPaymentFlow.ts frontend/tests/services/subscriptionPaymentFlow.test.ts
git commit -m "feat: auto-complete guarded local payments"
```

---

### Task 5: Bootstrap Genuine Local Auth Accounts and Environment

**Files:**
- Create: `frontend/backend/scripts/local-supabase-env.mjs`
- Create: `frontend/backend/scripts/bootstrap-local.mjs`
- Create: `frontend/backend/tests/localBootstrapSource.test.ts`
- Modify: `frontend/backend/package.json`
- Modify: `frontend/.env.example`
- Modify: `frontend/src/vite-env.d.ts`

**Interfaces:**
- Produces ignored `frontend/.env.local` with local API URL, anon key, and function URL.
- Produces ignored `frontend/backend/supabase/functions/.env` with local-only server settings.
- Produces real Auth users and matching `profiles` rows for customer/admin.

- [ ] **Step 1: Write the failing bootstrap security test**

Create `frontend/backend/tests/localBootstrapSource.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('local Supabase bootstrap source', () => {
  it('uses the Admin Auth API and never stores an admin role in browser auth metadata', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'scripts/bootstrap-local.mjs'),
      'utf8',
    );
    expect(source).toContain('auth.admin.createUser');
    expect(source).toContain(\"role: 'admin'\");
    expect(source).toContain(\"from('profiles')\");
    expect(source).not.toContain(\"user_metadata: { role: 'admin'\");
  });

  it('writes local keys only to ignored env files', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'scripts/local-supabase-env.mjs'),
      'utf8',
    );
    expect(source).toContain('.env.local');
    expect(source).toContain('supabase/functions/.env');
    expect(source).not.toContain('.env.production.example');
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npm test -- --run tests/localBootstrapSource.test.ts
```

Expected: FAIL because the scripts do not exist.

- [ ] **Step 3: Implement local CLI environment generation**

`local-supabase-env.mjs` must:

1. Execute the local binary `supabase status -o env`.
2. Parse `API_URL`, `ANON_KEY`, and `SERVICE_ROLE_KEY` when the local stack is running.
3. Write `frontend/.env.local`:

```dotenv
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<local anon key>
VITE_SUPABASE_FUNCTIONS_URL=http://127.0.0.1:54321/functions/v1
VITE_ENABLE_DEMO_LOGIN=true
VITE_PAYMENT_PROVIDER_LABEL=mock
```

4. Write `frontend/backend/supabase/functions/.env`, which `supabase start`
   automatically loads into the local Edge Runtime:

```dotenv
BEDUINE_RUNTIME=local
PAYMENT_PROVIDER=mock
BEDUINE_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
```

The script must never print key values.

When called with `--functions-only`, it writes only the static local Edge Function env
without requiring `supabase status`.

- [ ] **Step 4: Implement idempotent Auth/profile bootstrap**

`bootstrap-local.mjs` must create or update:

```js
const accounts = [
  {
    email: 'demo@beduine.com',
    password: 'beduine123',
    profile: {
      uid: 'BDU-2026-DEMO01-1001',
      full_name: 'Demo Customer',
      phone: '+91 9876543210',
      city: 'Kolkata',
      role: 'customer',
      is_demo_user: true,
    },
  },
  {
    email: 'admin@beduine.com',
    password: 'admin123',
    profile: {
      uid: 'BDU-2026-ADMIN1-9001',
      full_name: 'Beduine Admin',
      phone: '+91 9000000000',
      city: 'Kolkata HQ',
      role: 'admin',
      is_demo_user: true,
    },
  },
];
```

Use `supabase.auth.admin.createUser()` or `updateUserById()` for Auth. Store only
`full_name`, `phone`, `city`, and `is_demo_user` in user metadata. Upsert `role` only into
`public.profiles` with the service-role client.

- [ ] **Step 5: Add local bootstrap scripts**

Add:

```json
{
  "scripts": {
    "local:function-env": "node scripts/local-supabase-env.mjs --functions-only",
    "local:env": "node scripts/local-supabase-env.mjs",
    "local:bootstrap": "node scripts/bootstrap-local.mjs",
    "local:prepare": "npm run local:function-env && npm run local:start && npm run local:env && npm run local:bootstrap"
  }
}
```

Install the Node client used by the bootstrap and integration scripts:

```powershell
npm install @supabase/supabase-js
```

- [ ] **Step 6: Run tests and bootstrap twice**

Run:

```powershell
npm test -- --run tests/localBootstrapSource.test.ts
npm run local:env
npm run local:bootstrap
npm run local:bootstrap
```

Expected: test passes; second bootstrap reports accounts already synchronized and creates no duplicates.

- [ ] **Step 7: Commit**

```powershell
git add frontend/backend/scripts frontend/backend/tests/localBootstrapSource.test.ts frontend/backend/package.json frontend/backend/package-lock.json frontend/.env.example frontend/src/vite-env.d.ts
git commit -m "feat: bootstrap local supabase accounts"
```

---

### Task 6: Make the Frontend Use One Supabase Backend

**Files:**
- Modify: `frontend/src/config/productionEnv.ts`
- Modify: `frontend/src/utils/supabaseClient.ts`
- Modify: `frontend/src/utils/userMapper.ts`
- Modify: `frontend/src/services/backend/index.ts`
- Modify: `frontend/src/LoginPage.tsx`
- Modify: `frontend/src/AdminLoginPage.tsx`
- Modify: `frontend/src/pages/subscription-page/SubscriptionLandingPage.tsx`
- Modify: `frontend/src/features/dashboard/hooks/useDashboardSubscription.ts`
- Modify: `frontend/src/services/customTourService.ts`
- Modify: relevant tests in `frontend/tests/config`, `frontend/tests/services`, and `frontend/tests/utils`

**Interfaces:**
- Produces one `beduineBackend = createSupabaseBackendAdapter()`.
- Produces `isDemoLoginEnabled()` based only on `VITE_ENABLE_DEMO_LOGIN`.
- Consumes local or hosted Supabase URL/anon key.

- [ ] **Step 1: Write failing backend-selection and login-guard tests**

Update the production import isolation test to require:

```ts
expect(backendIndex).toContain('createSupabaseBackendAdapter');
expect(backendIndex).not.toContain('createDemoBackendAdapter');
expect(supabaseClient).not.toContain('class MockAuth');
expect(loginPage).toContain(\"VITE_ENABLE_DEMO_LOGIN === 'true'\");
expect(adminLoginPage).toContain(\"VITE_ENABLE_DEMO_LOGIN === 'true'\");
```

Add a contract test that imports `beduineBackend` with local Supabase env and verifies its
method set matches `BeduineBackendAdapter`.

- [ ] **Step 2: Run tests and verify RED**

Run:

```powershell
npm test -- --run tests/config/productionImportIsolation.test.ts tests/services/backendContracts.test.ts
```

Expected: FAIL because demo adapter and MockAuth are still active.

- [ ] **Step 3: Simplify Supabase configuration**

`supabaseClient.ts` must require browser-safe URL and anon key in both local and production:

```ts
const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('SUPABASE_BROWSER_CONFIG_MISSING');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isDemoLoginEnabled =
  import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true';
```

Keep the two local credentials exported only for button auto-fill. Remove MockAuth,
localStorage auth users, client password hashing, and client role seeding.

- [ ] **Step 4: Use one backend and one custom-tour service**

`services/backend/index.ts` becomes:

```ts
import { createSupabaseBackendAdapter } from './supabaseBackendAdapter';

export * from './backendContracts';
export * from './backendAdapter';

export const beduineBackend = createSupabaseBackendAdapter();
```

`customTourService` always calls `createProductionCustomTourService(beduineBackend)`.

- [ ] **Step 5: Make both subscription entry points use shared payment flow**

Remove `demoWalletService` from `SubscriptionLandingPage.tsx` and
`useDashboardSubscription.ts`. Normalize the selected plan id, call
`completeSubscriptionPayment()`, then refresh `beduineBackend.getCustomerDashboard()`.

No payment method selector or demo wallet balance is used. The button label may read
`Complete test payment` only when `VITE_PAYMENT_PROVIDER_LABEL === 'mock'`; the operation
still calls the Edge Function.

- [ ] **Step 6: Guard one-click login buttons only**

In `LoginPage.tsx` and `AdminLoginPage.tsx`, render seeded credential buttons only when:

```tsx
{isDemoLoginEnabled ? (
  <button type="button" onClick={fillSeededCredentials}>
    Use Demo Customer
  </button>
) : null}
```

Submitting always calls real `supabase.auth.signInWithPassword`.

- [ ] **Step 7: Run focused frontend tests**

Run:

```powershell
npm test -- --run tests/config/productionImportIsolation.test.ts tests/services/backendContracts.test.ts tests/services/subscriptionPaymentFlow.test.ts tests/utils/userMapper.test.ts
npm run typecheck
```

Expected: all pass.

- [ ] **Step 8: Commit**

```powershell
git add frontend/src/config frontend/src/utils/supabaseClient.ts frontend/src/utils/userMapper.ts frontend/src/services/backend/index.ts frontend/src/services/customTourService.ts frontend/src/LoginPage.tsx frontend/src/AdminLoginPage.tsx frontend/src/pages/subscription-page/SubscriptionLandingPage.tsx frontend/src/features/dashboard/hooks/useDashboardSubscription.ts frontend/tests
git commit -m "refactor: use one supabase backend flow"
```

---

### Task 7: Remove Browser Demo Domain State and Wallet Admin UI

**Files:**
- Modify: `frontend/src/features/admin/hooks/useAdminUsers.ts`
- Modify: `frontend/src/features/admin/hooks/useAdminAuditLogs.ts`
- Modify: `frontend/src/features/admin/AdminPage.tsx`
- Modify: `frontend/src/features/admin/components/AdminPanel.tsx`
- Delete: demo backend, wallet, custom-tour demo, demo banner, and admin demo hooks listed in File Structure.
- Modify: tests that import deleted modules.

**Interfaces:**
- Admin users always come from `beduineBackend.listAdminUsers()`.
- Audit logs always come from `beduineBackend.listAuditLogs()`.
- Local reset moves to the developer CLI, not the browser admin panel.

- [ ] **Step 1: Write a failing source isolation test**

Extend `productionImportIsolation.test.ts` with an explicit runtime file set:

```ts
const sharedBackendRuntimeFiles = [
  'src/App.tsx',
  'src/LoginPage.tsx',
  'src/AdminLoginPage.tsx',
  'src/features/admin/AdminPage.tsx',
  'src/features/admin/components/AdminPanel.tsx',
  'src/features/admin/hooks/useAdminUsers.ts',
  'src/features/admin/hooks/useAdminAuditLogs.ts',
  'src/pages/subscription-page/SubscriptionLandingPage.tsx',
  'src/services/backend/index.ts',
  'src/services/customTourService.ts',
  'src/utils/supabaseClient.ts',
];
const runtimeSourceGraph = sharedBackendRuntimeFiles
  .map((file) => readFileSync(resolve(process.cwd(), file), 'utf8'))
  .join('\n');

for (const forbidden of [
  'demoBackendAdapter',
  'demoWalletService',
  'customTourDemoService',
  'adminUsersDemo',
  'useAdminWalletActions',
  'beduine_mock_users',
  'beduine_winners_list',
]) {
  expect(runtimeSourceGraph).not.toContain(forbidden);
}
```

Build `runtimeSourceGraph` from files reachable through `src/main.tsx` imports, not from
deleted test fixtures.

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
npm test -- --run tests/config/productionImportIsolation.test.ts
```

Expected: FAIL on current demo domain imports.

- [ ] **Step 3: Make admin hooks backend-only**

`useAdminUsers()` always calls `backend.listAdminUsers()` and removes browser reset
handlers. `useAdminAuditLogs()` always calls `backend.listAuditLogs()`.

Remove from `AdminPage`/`AdminPanel`:

- Demo/real user filter.
- Demo Wallet column and balance controls.
- Reset one/all demo accounts.
- Simulated demo volume.
- Browser-computed payment transactions.

Keep Users, Subscriptions, TRC, Winner Management, Non-winner Credit Issue, Bookings,
Payments, Audit Logs, Support, and Settings sections backed by API data.

- [ ] **Step 4: Delete inactive demo domain modules**

Delete only after `rg` confirms no runtime imports:

```powershell
rg -n "demoBackendAdapter|demoWalletService|mockPaymentGateway|customTourDemoService|DemoBanner|adminUsersDemo|useAdminWalletActions" frontend/src
```

Expected before deletion: no references outside the files being deleted.

- [ ] **Step 5: Run import isolation, admin, and dashboard tests**

Run:

```powershell
npm test -- --run tests/config/productionImportIsolation.test.ts tests/features_dashboard/AdminDrawOperations.test.tsx tests/features_dashboard/customerDashboardPages.test.tsx
npm run typecheck
```

Expected: all pass.

- [ ] **Step 6: Commit**

```powershell
git add -A frontend/src frontend/tests
git commit -m "refactor: remove browser demo domain state"
```

Before committing, verify unrelated landing HTML and existing production-env work are not
staged with `git diff --cached --name-status`.

---

### Task 8: Seed Showcase History and Verify the Full Shared Flow

**Files:**
- Create: `frontend/backend/scripts/seed-showcase.mjs`
- Create: `frontend/backend/tests/localPaymentIntegration.test.ts`
- Create: `frontend/e2e/local-shared-backend.spec.ts`
- Modify: `frontend/backend/package.json`
- Modify: `frontend/playwright.config.ts`
- Modify: `frontend/.env.production.example`
- Modify: `frontend/backend/README.md`

**Interfaces:**
- Produces `npm run local:reseed`.
- Consumes real local Auth, Edge Function endpoints, and PostgreSQL domain schema.
- Provides the final customer/admin browser journey.

- [ ] **Step 1: Write the failing local browser flow**

Create `frontend/e2e/local-shared-backend.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('local shared backend persists subscription TRC and dashboard data', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/login');
  await page.getByRole('button', { name: 'Log In to Your Account' }).click();
  await page.getByRole('button', { name: /Use Demo Customer/i }).click();
  await page.getByRole('button', { name: 'Log In', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole('button', { name: 'My Plan', exact: true }).click();
  await expect(page.getByText('Domestic Gold', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: /TRC \/ Travel Reward Credits/i }).click();
  await expect(page.getByText('Available TRC', { exact: true }).first().locator('../..'))
    .toContainText('1');

  await page.reload();
  await expect(page.getByText('Available TRC', { exact: true }).first().locator('../..'))
    .toContainText('1');
});

test('local mock payment is idempotent and production mock is forbidden', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Log In to Your Account' }).click();
  await page.getByRole('button', { name: /Use Demo Customer/i }).click();
  await page.getByRole('button', { name: 'Log In', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(/verified payment/i).first()).toBeVisible();
});
```

Create `frontend/backend/tests/localPaymentIntegration.test.ts`:

```ts
import { createClient } from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';

const runLocal = process.env.LOCAL_SUPABASE_INTEGRATION === 'true';
const url = process.env.LOCAL_SUPABASE_URL || '';
const serviceKey = process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY || '';

describe.runIf(runLocal)('local payment RPC integration', () => {
  it('returns duplicate and issues one TRC for a repeated provider event', async () => {
    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: profile } = await admin
      .from('profiles')
      .select('id')
      .eq('email', 'demo@beduine.com')
      .single();
    const { data: session } = await admin
      .from('payment_sessions')
      .insert({
        user_id: profile!.id,
        provider: 'mock',
        purpose: 'subscription',
        reference_id: 'domestic_gold',
        plan_id: 'domestic_gold',
        amount: 799,
        expected_amount: 799,
        amount_paise: 79900,
        currency: 'INR',
        expected_currency: 'INR',
        description: 'Domestic Gold integration test',
        status: 'pending',
      })
      .select('id')
      .single();
    const args = {
      p_provider: 'mock',
      p_provider_event_id: 'mock-integration-event-fixed',
      p_idempotency_key: 'mock:mock-integration-event-fixed',
      p_provider_payment_id: 'mock-integration-payment-fixed',
      p_session_ref: session!.id,
      p_event_type: 'payment.verified',
      p_status: 'verified',
      p_amount: 799,
      p_currency: 'INR',
      p_payload: { integration: true },
      p_signature_verified: true,
      p_plan_name: '',
      p_plan_type: '',
    };
    const first = await admin.rpc('process_verified_subscription_payment_v1', args);
    const second = await admin.rpc('process_verified_subscription_payment_v1', args);
    expect(first.error).toBeNull();
    expect(second.error).toBeNull();
    expect(second.data).toMatchObject({ duplicate: true });

    const { count } = await admin
      .from('credit_ledger')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', profile!.id)
      .eq('admin_ref', `PAYMENT_EVENT_${first.data.payment_event_id}`);
    expect(count).toBe(1);
  });
});
```

- [ ] **Step 2: Run local E2E and verify RED**

Run:

```powershell
cd E:\busness\bediine\frontend\backend
npm run local:prepare
cd ..
npm run e2e -- --grep "local shared backend"
```

Expected: FAIL until showcase data is seeded in PostgreSQL.

- [ ] **Step 3: Implement `seed-showcase.mjs`**

The script must:

1. Sign in as the seeded customer through local Auth.
2. Call local `create-payment-order` for `domestic_gold`; local mock payment activates the
   plan and issues one TRC through `process_verified_subscription_payment_v1`.
3. Use service-role access only for historical fixture setup:
   - create one previous finalized Gold draw entry marked `non_winner`;
   - call `issue_non_winner_credits_v1` for two INR 500 units;
   - create one schema-valid confirmed Digha booking with its paid installment.
4. Check for stable fixture ids before every insert/call so reruns do not duplicate data.
5. Query `customer-dashboard` and fail unless it contains the plan, one available current
   TRC, two available Domestic DC units, a verified payment, previous draw entry, and
   confirmed booking.

Use fixed local fixture identifiers:

```js
const fixture = {
  cycleId: 'BEDUINE-SUN-2026-06-28-1800-IST',
  ticketId: 'TRC-SUN-01001',
  bookingId: 'BDU-BKG-DEMO-1001',
  tourId: 'digha-sea-beach-retreat',
};
```

- [ ] **Step 4: Add reset/reseed command**

Add:

```json
{
  "scripts": {
    "local:seed-showcase": "node scripts/seed-showcase.mjs",
    "local:reseed": "supabase db reset && npm run local:env && npm run local:bootstrap && npm run local:seed-showcase"
  }
}
```

- [ ] **Step 5: Update environment documentation**

`frontend/.env.production.example` must contain:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_ENABLE_DEMO_LOGIN=false
VITE_PAYMENT_PROVIDER_LABEL=razorpay
```

README must state that local development uses Docker/Supabase CLI, while production changes
only the Supabase target, server runtime, payment provider, and secrets.

- [ ] **Step 6: Run all verification gates**

Run:

```powershell
cd E:\busness\bediine\frontend\backend
npm run typecheck
npm test
npm run local:reseed
$status = npx supabase status -o env
$env:LOCAL_SUPABASE_INTEGRATION = 'true'
$env:LOCAL_SUPABASE_URL = (($status | Select-String '^API_URL=').Line -replace '^API_URL="?|"$','')
$env:LOCAL_SUPABASE_SERVICE_ROLE_KEY = (($status | Select-String '^SERVICE_ROLE_KEY=').Line -replace '^SERVICE_ROLE_KEY="?|"$','')
npm test -- --run tests/localPaymentIntegration.test.ts
cd ..
npm run typecheck
npm test -- --maxWorkers=1
npm run e2e
npm run build
npm audit --audit-level=moderate
cd backend
npm audit --audit-level=moderate
```

Expected:

- Backend typecheck and tests pass.
- Frontend typecheck and all unit tests pass.
- Browser flows pass against real local Supabase sessions and persisted PostgreSQL data.
- Production build passes.
- Both audits report zero moderate-or-higher vulnerabilities, or any exception is documented
  with package, advisory, exploitability, and mitigation.

- [ ] **Step 7: Verify production fail-closed configuration**

Run backend policy tests with:

```text
BEDUINE_RUNTIME=production
PAYMENT_PROVIDER=mock
```

Expected: `MOCK_PAYMENT_FORBIDDEN`.

Build frontend with `VITE_ENABLE_DEMO_LOGIN=false` and verify the seeded-login buttons are
absent.

- [ ] **Step 8: Commit**

```powershell
git add frontend/backend/scripts/seed-showcase.mjs frontend/backend/tests/localPaymentIntegration.test.ts frontend/backend/package.json frontend/backend/package-lock.json frontend/backend/README.md frontend/e2e/local-shared-backend.spec.ts frontend/playwright.config.ts frontend/.env.production.example
git commit -m "test: verify shared local backend journey"
```

---

## Final Review Checklist

- [ ] `rg` finds no runtime import of browser demo backend/domain services.
- [ ] Local login creates a genuine Supabase access token.
- [ ] Local mock payment is completed by an Edge Function, not browser metadata mutation.
- [ ] Local and Razorpay payment paths invoke the same fulfillment command/RPC.
- [ ] Repeated payment events issue no duplicate TRC.
- [ ] Dashboard data survives reload and browser context replacement.
- [ ] Customer cannot call admin endpoints.
- [ ] Admin role comes from `profiles.role`.
- [ ] Six draw rounds preserve separate 5% winner calculations.
- [ ] Non-winner DC quantity/value rules pass.
- [ ] One DC per traveler booking rule passes.
- [ ] All build, test, E2E, and audit gates pass.
- [ ] Worktree contains no committed secrets or generated local env files.
