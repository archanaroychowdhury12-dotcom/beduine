# Beduine Shared Local and Production Backend Design

Date: 2026-07-03
Status: Approved for implementation

## 1. Context

The application currently selects between two materially different backend paths:

- A browser-based demo adapter backed by local storage and mock state.
- A production adapter backed by Supabase Auth, PostgreSQL, RPCs, and Edge Functions.

That split allows demo behavior to drift away from production behavior. It has already
caused dashboard, TRC, and Discount Credit state to behave differently in demo mode.

The required model is one backend flow. Local testing may simplify authentication and
payment entry, but it must execute the same database transitions, validation, idempotency,
draw, credit, booking, cancellation, and audit logic that production executes.

## 2. Goals

- Run the existing Supabase migrations and Edge Functions locally.
- Use the same frontend backend adapter against local and hosted Supabase.
- Use real Supabase Auth locally with seeded customer and admin accounts.
- Allow one-click demo login by filling and submitting seeded local credentials.
- Allow one-click payment success locally without Razorpay.
- Route local mock payment success through the same verified-payment finalizer used by
  production Razorpay webhooks.
- Keep all subscription, TRC, draw, Discount Credit, booking, cancellation, refund,
  support, and audit behavior identical between local and production environments.
- Make production cutover an environment and credential change, not a business-logic
  rewrite.

## 3. Non-Goals

- No hosted Supabase project is required during local implementation.
- No real Razorpay charge is made during local testing.
- No browser local-storage database is retained for domain state.
- No client-controlled admin role, payment verification, credit issuance, or winner
  selection is allowed.
- No separate Node, SQLite, or JSON demo backend is introduced.

## 4. Selected Architecture

### 4.1 Runtime topology

Local:

```text
Browser
  -> Supabase JS Auth (local Supabase)
  -> Supabase Edge Functions (local)
  -> PostgreSQL RPCs/tables (local)
  -> mock payment event
  -> shared verified-payment finalizer
```

Production:

```text
Browser
  -> Supabase JS Auth (hosted Supabase)
  -> Supabase Edge Functions (hosted)
  -> PostgreSQL RPCs/tables (hosted)
  -> Razorpay webhook with signature verification
  -> shared verified-payment finalizer
```

The only intentional differences are the Supabase URL, credentials, visibility of
one-click login helpers, and the payment event source.

### 4.2 Frontend backend selection

The frontend will always use `createSupabaseBackendAdapter()`. The
`createDemoBackendAdapter()` runtime branch will be removed.

The frontend receives only browser-safe settings:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_ENABLE_DEMO_LOGIN
VITE_PAYMENT_PROVIDER_LABEL
```

`VITE_ENABLE_DEMO_LOGIN=true` shows the seeded account buttons. The button still calls
normal `supabase.auth.signInWithPassword`; it does not create a fake session.

No service-role key, payment secret, webhook secret, or server runtime guard is exposed
through a `VITE_*` variable.

### 4.3 Server runtime controls

Edge Functions use server-only settings:

```text
BEDUINE_RUNTIME=local|production
PAYMENT_PROVIDER=mock|razorpay
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
```

Mock payment is permitted only when:

```text
BEDUINE_RUNTIME=local
AND
PAYMENT_PROVIDER=mock
```

Any other combination requesting mock completion fails closed. A browser value cannot
override this decision.

## 5. Authentication Flow

### 5.1 Local bootstrap

An idempotent local bootstrap command will:

1. Start from the migrated local database.
2. Create the seeded customer through the local Supabase Admin Auth API.
3. Create the seeded admin through the local Supabase Admin Auth API.
4. Create matching profile rows with server-controlled roles.
5. Optionally create a showcase history through server-side domain operations.

Seeded local credentials:

```text
Customer: demo@beduine.com / beduine123
Admin:    admin@beduine.com / admin123
```

The admin role is stored in the protected profile record. Email text and browser metadata
never grant admin access.

### 5.2 Production

`VITE_ENABLE_DEMO_LOGIN=false` removes one-click helpers. Normal registration and login
continue through the same Supabase Auth client and profile provisioning flow.

## 6. Payment Flow

### 6.1 Shared order creation

The frontend calls `create-payment-order` in every environment. The function validates:

- authenticated user;
- purpose and reference;
- server-side catalog price;
- amount and currency;
- duplicate or already-completed payment state.

The browser never supplies a trusted final amount.

### 6.2 Local mock completion

With the local mock provider, clicking Pay creates a payment session and a synthetic
provider event. The event receives a unique idempotency key and is marked as locally
verified by server code. It then invokes the shared verified-payment finalizer.

For a subscription, the finalizer atomically:

1. records the verified payment event;
2. activates the selected subscription;
3. issues exactly one TRC;
4. writes ledger and audit records;
5. returns the completed session status.

For a tour booking, the same finalizer confirms the payment installment and booking state.

Duplicate clicks or repeated synthetic events must return the existing result without
issuing a second entitlement.

### 6.3 Production Razorpay completion

Production order creation creates a Razorpay order. The webhook:

1. verifies the Razorpay signature;
2. validates provider order, amount, currency, and session;
3. stores the provider event id;
4. invokes the same verified-payment finalizer used locally.

Turning on Razorpay therefore changes the event source, not the entitlement logic.

## 7. Domain Data and Workflows

All domain state is stored in PostgreSQL and exposed through the existing Edge Function
contracts.

- Customer dashboard: `customer-dashboard`
- Ledger: `customer-ledger`
- Draw participation: `participate-weekly-draw`
- Weekly status and freeze: `weekly-draw-status`, `auto-freeze-weekly-draw`
- Draw execution and reveal: `run-weekly-draw`, `reveal-next-winner`
- Non-winner credits: `issue-non-winner-credits`
- Booking: `create-tour-booking`
- Cancellation/refund: `request-cancellation`, `admin-operations`
- Support: `support-tickets`, `admin-operations`

Winner counts remain isolated by all six plan rounds:

```text
Domestic Silver
Domestic Gold
Domestic Platinum
International Silver
International Gold
International Platinum
```

Each round uses `ceil(verified_participants * 0.05)`.

Non-winner Discount Credit issuance remains idempotent per user and draw cycle:

- Silver: 1 unit
- Gold: 2 units
- Platinum: 4 units
- Domestic unit value: INR 500
- International unit value: INR 5,000

## 8. Showcase Data

The local demo account may include realistic historical records for client presentation,
but those records must be created in PostgreSQL and conform to the same schema and domain
rules.

The reset/bootstrap command will provide:

- a Domestic Gold subscription;
- one available TRC for the current cycle;
- a prior verified non-winner draw entry;
- two prior Domestic Discount Credit units;
- a verified subscription payment;
- one representative confirmed booking.

Tests that need a clean lifecycle create a new customer instead of mutating the showcase
fixture.

## 9. Migration From the Current Demo Path

Implementation will:

1. Install Docker Desktop and Supabase CLI prerequisites.
2. Initialize and start the local Supabase stack.
3. Apply migrations `001` through `008`.
4. Add the local bootstrap/reset command.
5. Add the guarded mock payment event source.
6. Reuse the shared verified-payment finalizer for mock and Razorpay events.
7. Point the frontend Supabase adapter to local Supabase.
8. Remove the runtime use of `demoBackendAdapter`, mock auth domain state, and demo wallet
   entitlement logic.
9. Keep one-click login as a UI convenience guarded by `VITE_ENABLE_DEMO_LOGIN`.
10. Replace current demo tests with shared-backend integration and browser tests.

Unrelated landing-page and production-environment worktree changes will not be overwritten.

## 10. Error Handling

- Missing local Supabase configuration produces a visible startup/configuration error.
- Protected function calls without a valid Supabase session return 401.
- Customer calls to admin operations return 403.
- Mock payment outside local runtime returns 403 and creates no payment record.
- Invalid amount, currency, plan, or booking reference returns 400.
- Repeated payment events return the original completed state.
- Dashboard loading, empty, error, retry, and success states remain explicit.

## 11. Security Requirements

- Service-role and Razorpay secrets remain server-side.
- Role authorization is database/profile based.
- Payment completion is server controlled.
- Production mock payment is fail-closed.
- Webhook signature validation remains mandatory for Razorpay.
- Payment and credit transitions are transactionally idempotent.
- RLS protects customer-owned records.
- Admin operations require a verified admin profile.
- Audit records cover payment, entitlement, draw, credit, booking, cancellation, and
  refund transitions.

## 12. Verification Strategy

### Backend

- Apply all migrations to a clean local Supabase database.
- Run backend unit tests.
- Test payment finalizer idempotency with repeated mock and webhook events.
- Test role isolation and RLS.
- Test plan-wise draw counts and non-winner credit quantities.
- Test booking credit reservation, payment schedule, cancellation, and refund transitions.

### Frontend

- Run TypeScript typecheck and production build.
- Run frontend unit and contract tests against the shared adapter.
- Run browser flows for seeded customer and admin accounts.

### Required end-to-end journey

1. One-click login signs in through local Supabase Auth.
2. Customer starts a subscription payment.
3. Local mock provider auto-completes the payment.
4. Dashboard shows active plan, verified payment, and exactly one TRC.
5. Customer participates in the current draw.
6. TRC moves from available to locked and a ticket is persisted.
7. Admin executes/reveals the plan-specific draw.
8. Eligible non-winner receives the correct plan-specific Discount Credits once.
9. Customer applies at most one Discount Credit per traveler to a paid tour.
10. Booking and payment records remain visible after reload and a new browser session.

## 13. Production Cutover

After local and staging verification:

1. Create/link the hosted Supabase project.
2. Apply the same migrations and deploy the same Edge Functions.
3. Configure hosted Supabase URL and anon key in the frontend.
4. Set `BEDUINE_RUNTIME=production`.
5. Set `PAYMENT_PROVIDER=razorpay`.
6. Set Razorpay and webhook secrets server-side.
7. Set `VITE_ENABLE_DEMO_LOGIN=false`.
8. Run the credential-backed staging E2E flow.
9. Replace Razorpay test credentials with live credentials only after approval.

No domain component, backend contract, or entitlement rule changes during this cutover.

## 14. Acceptance Criteria

- The frontend has no active browser-only domain backend.
- Local and production use the same Supabase adapter and Edge Function contracts.
- One-click local login creates a genuine Supabase session.
- One-click local payment invokes the shared verified-payment finalizer.
- Mock payment cannot run in production.
- Dashboard data persists in PostgreSQL across reloads and sessions.
- Subscription issues exactly one TRC.
- Draw and Discount Credit behavior follows the approved per-plan rules.
- Full backend, frontend, and browser test suites pass.
- Production activation requires environment and secret changes only.
