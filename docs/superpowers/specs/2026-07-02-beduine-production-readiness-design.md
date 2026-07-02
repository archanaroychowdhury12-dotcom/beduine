# Beduine Production Readiness Design

Date: 2026-07-02
Status: Approved architecture, pending implementation plan
Primary payment provider: Razorpay
Frontend: React 19 + Vite
Backend: Supabase Auth, Postgres, Row Level Security, and Edge Functions

## 1. Objective

Convert the existing Beduine application from a mixed demo/production prototype into a
credential-ready production system that implements the approved customer and admin
journeys without trusting client-side state for money, credits, roles, draw results, or
bookings.

The implementation must preserve the existing visual experience where practical while:

- fixing all public and protected route redirects;
- removing demo data from production runtime paths;
- using Razorpay as the primary payment gateway;
- making Supabase the source of truth;
- enforcing admin/customer access on the server;
- making payment, credit, draw, booking, cancellation, and refund operations idempotent
  and auditable;
- keeping an explicitly isolated demo mode for presentations.

## 2. Scope Decomposition

This program is split into independently verifiable production slices:

1. Routing and authentication boundaries.
2. Profiles, roles, and canonical Beduine UID.
3. Subscription checkout and Razorpay webhook activation.
4. Customer dashboard data APIs.
5. TRC participation and weekly draw lifecycle.
6. Winner benefits and non-winner Discount Credit issuance.
7. Paid and customized tour booking.
8. Discount Credit reservation and redemption.
9. Installment payments and payment ledger.
10. Cancellation, refund, and credit-adjustment workflow.
11. Support tickets.
12. Admin operations, audit logs, and production hardening.

Each slice must leave the project buildable and testable.

## 3. Route And Redirect Design

### Public routes

| Route | Purpose |
| --- | --- |
| `/` | Public information-first landing page |
| `/paid-tour` | Public fixed and customized tour browsing |
| `/paid-tour#customize` | Public custom-tour form section |
| `/login` | Customer login and account creation |
| `/admin-login` | Separate admin login |
| `/winners` | Published winner results only |
| Legal routes | Public policy pages |

### Authenticated customer routes

| Route | Purpose |
| --- | --- |
| `/landing` | Beduine Club plans and subscription purchase |
| `/register` | Customer profile and plan registration details |
| `/dashboard` | Customer dashboard |
| `/checkout/subscription` | Subscription checkout |
| `/checkout/tour` | Tour booking checkout |

### Admin route

| Route | Purpose |
| --- | --- |
| `/admin` | Server-verified admin operations only |

### Redirect rules

- Landing `Join Now` and `BEDUINE CLUB` links go to
  `/login?next=/landing`.
- A successful customer login consumes only an allowlisted local `next` path.
- `Customize Tour` goes directly to `/paid-tour#customize` without login.
- Tour browsing is public. Starting checkout, saving a custom request, applying credits,
  or paying requires authentication. The intended destination and non-sensitive draft
  state are restored after login.
- Unauthenticated access to `/landing`, `/register`, `/dashboard`, or checkout routes
  goes to `/login?next=<original-path>`.
- Customer access to `/admin` returns a 403 screen and never renders admin data.
- Unauthenticated access to `/admin` redirects to `/admin-login`.
- Admin login accepts only a server-authorized admin profile and then redirects to
  `/admin`.
- Logout clears the local session and returns customers to `/` and admins to
  `/admin-login`.
- External URLs and unrecognized `next` values are rejected to prevent open redirects.

## 4. Public Landing Design

The public landing page stays concise and links to detailed product surfaces.

Navbar:

- Home
- Tours
- Destinations
- Winners
- BEDUINE CLUB
- Contact

The first viewport communicates:

- Beduine Club starts at INR 499;
- a verified subscription grants one TRC;
- TRC can be used for Sunday Lucky Draw participation;
- winners receive the configured tour benefit;
- eligible non-winners receive plan-based Discount Credits;
- Discount Credits can be applied to eligible paid tour bookings.

The landing page must not claim that a subscription immediately grants Discount Credits.

## 5. Identity, Profile, And Authorization

Supabase Auth owns authentication. `public.profiles` owns authorization and customer
profile data.

Allowed roles:

- `admin`
- `customer`

There is no authentication-level `agent` role.

Rules:

- New accounts always receive `customer` on the server.
- Browser-provided role metadata is ignored for authorization.
- Admin status is read from `public.profiles.role` by server-side code.
- Customers cannot update their role.
- Admin creation is an explicit service-role operation.
- RLS protects every customer-owned table.

Registration fields:

- full name;
- email;
- mobile;
- password;
- city.

Canonical UID format:

`BDU-YYYY-XXXXXX-NNNN`

The UID is generated once by Postgres, is unique, cannot be edited by customers, and is
returned by profile APIs. The frontend must never generate a second receipt-only member
ID.

## 6. Subscription And Razorpay Payment

### Checkout creation

1. Authenticated customer selects a plan.
2. Frontend calls `create-payment-order`.
3. Edge Function validates the plan against the server-side plan catalog.
4. Backend creates a pending `payment_session`.
5. Backend creates a Razorpay order using secret credentials.
6. Frontend receives only browser-safe order data and opens Razorpay Checkout.

The frontend never chooses the authoritative amount, currency, entitlement, or TRC
quantity.

### Verification and activation

1. Razorpay sends a webhook to `payment-webhook`.
2. Backend verifies the raw-body signature.
3. Backend resolves the original payment session.
4. Backend verifies provider order, amount, currency, customer, and purpose.
5. A single Postgres transaction records the event, activates the subscription, issues
   exactly one TRC, and writes the audit log.
6. Duplicate events return the existing result and do not issue another TRC.
7. Frontend polls or refreshes server state; client success callbacks never activate
   entitlements.

Refund and chargeback events update subscription state and ledger entries according to
the recorded payment.

## 7. Customer Dashboard

The dashboard requires authentication and receives all data from customer-scoped
Supabase queries or Edge Functions.

Sections:

- Overview
- My UID
- My Plan
- TRC / Lucky Draw Credits
- Lucky Draw Participation
- Winner Status
- Discount Credits
- My Bookings
- Profile
- Support
- Settings

Production pages must not import `dummyData`, demo wallet services, local winner lists, or
local booking arrays. Empty accounts render empty states, not seeded people or bookings.

## 8. TRC Participation And Weekly Draw

### Participation

`participate-weekly-draw` performs one atomic transaction:

1. Authenticate the customer.
2. Resolve the currently open Sunday cycle in `Asia/Kolkata`.
3. Lock the active subscription and an available TRC unit.
4. Verify payment, subscription, account, plan category, and plan tier.
5. Reject duplicate entry for the same user and cycle.
6. Mark the TRC as locked.
7. Create one immutable draw entry and ticket ID.
8. Write an audit event.

Ticket format:

`TRC-SUN-NNNNN`

### Sunday 6 PM IST freeze

- A scheduled Edge Function runs every Sunday.
- The function computes the cycle using the `Asia/Kolkata` timezone.
- At or after 6:00 PM IST, it freezes the open cycle exactly once.
- Entries after the cutoff belong to the next cycle.
- Final verification excludes unpaid, inactive, duplicate, invalid, or suspended entries.
- A private random seed is used to select winners and only its hash is published.

### Plan-wise rounds

Six independent rounds:

- Domestic Silver
- Domestic Gold
- Domestic Platinum
- International Silver
- International Gold
- International Platinum

Winner count per non-empty round:

`ceil(valid_participants * 0.05)`

Winner selection, finalization, and report hashing are server-side and idempotent.

## 9. Winner Reveal And Benefits

The backend calculates and stores the complete result before reveal.

`reveal-next-winner`:

- requires a server-verified admin;
- reveals one previously unrevealed winner;
- uses a database lock to prevent duplicate reveals;
- returns name, UID, ticket, plan round, coupon, and remaining count;
- writes an audit record.

Winner coupon format:

`BEDWIN-YYYY-<unique-suffix>`

A winner receives the configured winner benefit and optional quarterly tour-batch
assignment. A winner cannot receive non-winner Discount Credits for the same cycle.

Public winner pages expose only published fields and never expose private contact data.

## 10. Non-Winner Discount Credits

After draw completion, an idempotent backend operation issues plan-based Discount Credit
units to verified non-winners.

Domestic:

- Silver: 1 unit at INR 500
- Gold: 2 units at INR 500 each
- Platinum: 4 units at INR 500 each

International:

- Silver: 1 unit at INR 5,000
- Gold: 2 units at INR 5,000 each
- Platinum: 4 units at INR 5,000 each

Rules:

- one credit unit applies to one traveler;
- maximum one unit per traveler per booking;
- category must match the tour category;
- credits cannot be sold, transferred, or redeemed as cash;
- winner and non-winner benefits are mutually exclusive per cycle;
- duplicate issuance for the same user and cycle is blocked by a unique constraint.

## 11. Tour Booking

Supported booking types:

- Fixed Departure Group Tour
- Customized / Tailor-Made Tour

Production tables store:

- tours and departures;
- custom tour requests, quotations, and revisions;
- bookings;
- travelers;
- pickup details;
- booking installments;
- booking payment sessions and payment events;
- Discount Credit reservations and redemptions.

Booking flow:

1. Select tour.
2. Enter traveler details.
3. Reserve eligible Discount Credits per traveler.
4. Enter pickup details.
5. Review server-calculated price and installment schedule.
6. Create Razorpay order for the amount due now.
7. Confirm booking only after a verified webhook.
8. Redeem reserved credits in the same confirmation transaction.
9. Release reservations when payment fails or expires.

The frontend estimator may preview totals, but the backend recalculates every monetary
value.

## 12. Payment Schedules

Fixed Departure:

- 25 percent now;
- 25 percent 30 days before departure;
- 30 percent 15 days before departure;
- 20 percent 7 days before departure.

Customized Tour:

- 50 percent now;
- 25 percent 7 days before departure;
- 25 percent before departure.

Instant booking charge:

- Domestic: INR 2,000;
- International: INR 5,000.

The instant charge is fully due now and does not alter installment percentages for the
tour cost.

## 13. Cancellation, Refund, And Credit Adjustment

Customer:

1. Opens a real eligible booking.
2. Submits one cancellation request and preferred refund mode.
3. Tracks request and payout status.

Admin:

1. Reviews the request.
2. Adds supplier charges and proof.
3. Reviews the server-generated refund preview.
4. Approves or rejects.
5. Starts cash refund or issues a 12-month credit adjustment.
6. Every state transition is audited.

Cancellation policy:

- 30 or more days: no land-package fee; INR 500 per traveler service charge;
- 15 to 29 days: 25 percent cancellation fee;
- 7 to 14 days: 50 percent cancellation fee;
- 0 to 6 days: 100 percent cancellation fee;
- no-show: no refund.

Cash refund states:

- `refund_pending`
- `refund_processing`
- `refunded`
- `refund_failed`

Credit adjustments expire 12 months after issuance.

## 14. Support Tickets

Authenticated customers can create and view support tickets. Admins can assign, respond,
change status, and close tickets. Ticket data is stored in Supabase and protected by RLS.
Production mode must not keep tickets only in React state.

## 15. Admin Panel

Admin sections:

- Admin Overview
- Users
- Subscriptions
- TRC / Lucky Draw Entries
- Winner Management
- Non-winner Credit Issue
- Bookings
- Payments
- Cancellations and Refunds
- Audit Logs
- Support Tickets
- Settings

Admin data comes from admin-only Edge Functions or RLS-protected queries. Demo wallet,
mock auth user lists, franchise/agent seed arrays, and localStorage audit logs are not
loaded in production.

Sensitive admin mutations require:

- authenticated admin profile;
- server-side input validation;
- transactional database update;
- idempotency where applicable;
- audit record with actor, target, reason, status, and metadata.

## 16. Demo And Production Isolation

Demo mode:

`VITE_BACKEND_MODE=demo`

- may use explicit demo adapters;
- shows a visible demo indicator;
- never calls production mutation functions;
- is not the deployed production configuration.

Production mode:

`VITE_BACKEND_MODE=production`

- fails fast when required browser-safe Supabase variables are missing;
- does not import or execute mock payment, demo wallet, seeded customer, seeded booking,
  local winner, or local custom-tour data;
- uses Razorpay through backend Edge Functions;
- keeps all provider secrets in Supabase secrets, never Vite variables.

## 17. Error Handling And Recovery

- All Edge Functions return stable machine-readable error codes and safe messages.
- Client errors show retryable/non-retryable states without pretending success.
- Payment callback loss is recovered by querying server payment status.
- Duplicate webhooks and repeated button clicks are idempotent.
- Credit reservations expire automatically.
- Draw finalization cannot rerun after completion.
- Admin reveal cannot skip or reveal the same winner twice.
- Failed refunds remain visible for retry and audit.
- Unknown routes render a 404.
- Invalid role access renders 403 without loading protected data.

## 18. Observability And Audit

Audit events cover:

- authentication-sensitive admin actions;
- payment order creation and webhook result;
- subscription activation/refund/chargeback;
- TRC issue, lock, consume, and reverse;
- draw participation, freeze, finalization, publish, and reveal;
- winner benefit and non-winner credit issuance;
- credit reservation, redemption, release, and expiry;
- booking creation and installment state;
- cancellation, supplier charge, refund, and credit adjustment;
- support-ticket admin actions.

Logs must not contain passwords, service-role keys, payment secrets, full card data, or
authentication tokens.

## 19. Verification Strategy

### Automated tests

- Unit tests for routing allowlists, UID format, pricing, installment schedules,
  cancellation policy, credit policy, and plan-round winner counts.
- Repository/service tests for idempotency and state transitions.
- Database integration tests for RLS, unique constraints, and atomic RPCs.
- Edge Function tests for authentication, role checks, validation, and provider
  signature handling.
- Frontend integration tests using production adapters with mocked network boundaries.
- Playwright tests for public navigation, auth redirects, customer dashboard isolation,
  public tour browsing, protected checkout, admin denial, and admin reveal.

### Credential-backed staging tests

- Supabase migrations apply cleanly to a fresh staging project.
- Razorpay test-mode order and webhook complete a subscription.
- Duplicate webhook does not duplicate TRC.
- Booking payment confirms one booking and redeems reserved credits once.
- Sunday cycle can be time-controlled in staging.
- Cancellation and refund/credit-adjustment states are verified end to end.

### Release gates

- frontend and backend typechecks pass;
- all tests pass with zero failures;
- production build succeeds;
- no production file imports demo data;
- secret scan passes;
- browser console has no errors;
- critical pages work on desktop and mobile;
- rollback instructions and migration order are documented.

## 20. Credential Handoff

Credentials are never pasted into source files or chat.

Frontend hosting environment:

- `VITE_BACKEND_MODE=production`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PAYMENT_PROVIDER=razorpay`

Supabase secrets:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

Optional communication-provider credentials are added only when their integrations are
implemented and enabled.

## 21. Out Of Scope For Credential-Free Implementation

Before real credentials are supplied, implementation can complete schemas, functions,
adapters, validation, tests, demo isolation, and deployment documentation. It cannot
prove:

- a real Razorpay account can create and settle orders;
- production webhook delivery reaches the deployed URL;
- production email, SMS, or WhatsApp delivery;
- production DNS/hosting configuration.

These are staging/go-live verification steps, not client-side assumptions.
