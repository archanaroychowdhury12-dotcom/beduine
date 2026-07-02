# Beduine Backend (Supabase)

This directory contains the database structure, migrations, and Supabase Edge Functions.

## Prerequisite
Install the Supabase CLI:
```bash
# Using npm
npm install -g supabase

# Or using Scoop (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

## Local Development

1. Start Supabase services locally:
   ```bash
   supabase start
   ```

2. Apply migrations to the local database:
   ```bash
   supabase migration up
   ```

3. Run Edge Functions locally:
   ```bash
   supabase functions serve payment-webhook --no-verify-jwt
   ```

## Deploying to Production

1. Link to your production Supabase project:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

2. Deploy migrations:
   ```bash
   supabase db push
   ```

3. Deploy Edge Functions:
   ```bash
   supabase functions deploy payment-webhook
   ```

---

## Business Logic & Payment Flow

The `business_logic/` directory contains all the TypeScript-based business rules, payment flows, credit ledgers, and subscription entitlement logic that were previously executed on the client-side (mocked/simulated mode).

You can reference these files to implement actual server-side endpoints, PostgreSQL functions, or DB triggers:
- **`business_logic/services/payment/`**: Entitlement checks and payment gateways.
- **`business_logic/services/demoWalletService.ts` & `nonWinnerCreditService.ts`**: Wallet operations, ledger entries, and credit calculation/issue logic.
- **`business_logic/utils/creditHelpers.ts` & `creditValidation.ts`**: Verification and balance calculators for Domestic and International credits.
- **`business_logic/booking/`**: Itinerary booking pricing calculations and advance payment scheduling parameters.
- **`business_logic/weeklyDraw/`**: Weekly RNG draws, token verifications, and winner selection algorithms.
- **`business_logic/types.ts`**: Full type declarations for Users, Ledger Entries, Transactions, and Payments.


---

## Latest Fixes

See `FIX_REPORT.md` for the complete patch summary. The package now includes plan-based non-winner DC allocation, weekly draw execution logic, cancellation calculator, instant-charge pay-now correction, UID migration updates, and typecheck setup.

Run:
```bash
npm install
npm run typecheck
```

## Latest production hardening patch

See `POWERFUL_FIX_REPORT.md` for the latest patch details.

Validation:

```bash
npm install
npm run typecheck
npm test
npm audit --audit-level=moderate
```

Run the release commands below to obtain the current test and audit result. Do not rely on a stored test count.

## Weekly Draw Background Automation

This package includes backend-only logic for the Sunday Lucky Draw flow:

- Sunday 6:00 PM IST auto-freeze schedule calculation.
- Supabase RPC template for auto-freezing cycles.
- Backend winner reveal service for later Admin UI button integration.
- One winner is revealed per click with name + UID + ticket ID.

Relevant files:

- `business_logic/weeklyDraw/weeklyDrawSchedule.service.ts`
- `business_logic/weeklyDraw/winnerReveal.service.ts`
- `supabase/migrations/004_weekly_draw_auto_freeze_reveal.sql`
- `supabase/functions/auto-freeze-weekly-draw/index.ts`


## Latest weekly draw update

Winner selection is now plan-round based. Domestic Silver/Gold/Platinum and International Silver/Gold/Platinum each run their own 5% rounded-up winner pool. Admin reveal still shows one global winner at a time with name, UID, ticket, coupon, plan round, and round rank available for UI.

## Production Credential Setup

Frontend browser-safe variables go in `frontend/.env.local` for local testing or in the hosting provider environment settings:

```bash
VITE_BACKEND_MODE=production
VITE_ENABLE_DEMO_WALLET=false
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_PAYMENT_PROVIDER=razorpay
```

Use `frontend/.env.production.example` as the template. Do not put service-role keys or payment secrets in any `VITE_*` variable.

Supabase Edge Function secrets are set separately from `frontend/backend/.env.supabase.example`:

```bash
supabase secrets set PAYMENT_PROVIDER=razorpay
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set RAZORPAY_KEY_ID=rzp_test_your-key-id
supabase secrets set RAZORPAY_KEY_SECRET=your-key-secret
supabase secrets set RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
supabase secrets set BEDUINE_ALLOWED_ORIGINS=https://staging.example.com
```

After credentials are set, deploy/update backend logic from this folder:

```bash
cd frontend/backend
supabase link --project-ref <your-project-ref>
supabase db push
supabase functions deploy payment-webhook
supabase functions deploy customer-ledger
supabase functions deploy weekly-draw-status
supabase functions deploy reveal-next-winner
supabase functions deploy request-cancellation
supabase functions deploy auto-freeze-weekly-draw
```

The frontend will use real Supabase Auth and Edge Functions only when `VITE_BACKEND_MODE=production` and the Supabase URL + anon key are present. If production mode is enabled without those browser-safe credentials, the app fails fast instead of falling back to demo auth.

## Staging and Go-Live Order

1. Install the Supabase CLI and link a dedicated staging project.
2. Set staging Supabase, Razorpay test, webhook, and exact CORS origin secrets.
3. Apply migrations `001` through `008` with `supabase db push`.
4. Deploy all customer, payment, draw, admin, and support functions:

```bash
supabase functions deploy auto-freeze-weekly-draw
supabase functions deploy create-payment-order
supabase functions deploy create-tour-booking
supabase functions deploy custom-tour-request
supabase functions deploy customer-dashboard
supabase functions deploy customer-ledger
supabase functions deploy issue-non-winner-credits
supabase functions deploy participate-weekly-draw
supabase functions deploy payment-status
supabase functions deploy payment-webhook --no-verify-jwt
supabase functions deploy public-winners --no-verify-jwt
supabase functions deploy request-cancellation
supabase functions deploy reveal-next-winner
supabase functions deploy run-weekly-draw
supabase functions deploy support-tickets
supabase functions deploy weekly-draw-status
supabase functions deploy admin-operations
```

5. Configure Razorpay test webhooks for `payment.captured`, `payment.failed`, `refund.created`, `refund.processed`, and `refund.failed` at `/functions/v1/payment-webhook`.
6. Create the first Supabase Auth user, then set only its `profiles.role` to `admin` using a server-authorized SQL session. Never expose a browser role switch.
7. Deploy the frontend with `frontend/.env.production.example` values and `VITE_BACKEND_MODE=production`.
8. Test registration, subscription duplicate webhooks, TRC participation, Sunday freeze/draw/reveal, non-winner credits, paid booking, cancellation/refund, custom tours, support tickets, and customer/admin access isolation.
9. Replace Razorpay test credentials with live credentials only after staging passes. Update the live webhook secret at the same time.
10. Keep the previous frontend deployment and a pre-migration database backup available for rollback.

Credential-backed Razorpay checks are skipped unless `E2E_RAZORPAY_TEST_CREDENTIALS_AVAILABLE=true`; a skipped provider test is not a production payment approval.
