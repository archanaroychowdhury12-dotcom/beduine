# Customer Showcase Subscription, Draw, and Reset Design

## Goal

Provide a repeatable customer-facing journey that starts on the public landing
page and demonstrates the actual Beduine subscription, TRC, draw, winner,
notification, and dashboard lifecycle:

`Landing -> Login -> Subscription purchase -> Dashboard -> 1 TRC ->`
`Participation -> Admin draw -> Winner notification`

The local demo must use the same payment-entitlement and draw engine as
production. It must not fabricate a winner only in the UI. The demo difference
is orchestration: after a demo customer participates, the backend immediately
invokes the normal admin draw pipeline so the complete result can be shown in
one customer session.

## Starting State

Resetting the local demo creates a clean customer account with:

- the default email `demo@beduine.com`
- the default password `beduine123`
- the default Beduine UID and profile values
- no active subscription
- no payment history
- no TRC
- no draw entry or winner benefit
- no notification
- no Discount Credit
- no booking, cancellation, or support record

The demo admin account remains available so the backend can attribute draw
operations to a real admin actor. The clean customer dashboard renders truthful
empty states and a subscription call to action.

## Customer Journey

### 1. Landing and Authentication

- Every public Join/Club CTA continues to open
  `/login?next=/subscription`.
- Successful authentication consumes the safe `next` value and opens the
  subscription page.
- Login does not automatically select a plan or open checkout.
- The customer explicitly chooses a plan after reaching the subscription page.

### 2. Subscription Purchase

- The selected plan ID is sent to the existing payment-order workflow.
- Local demo payment uses the mock provider but passes through the same
  server-side payment verification and entitlement workflow used by production.
- A verified subscription payment atomically:
  - records the payment and verification event
  - activates the selected subscription
  - issues exactly one available TRC
  - records the TRC ledger entry
  - writes the payment/subscription audit record
- Payment idempotency prevents a retry from creating another subscription,
  payment event, or TRC.
- The success card shows the selected plan, paid amount, verified status, and
  the issued TRC.
- Choosing **Go to Dashboard** refreshes account data and opens the customer
  dashboard.

### 3. Dashboard Before Participation

The dashboard shows:

- the active plan and subscription dates
- the verified subscription payment
- one available TRC and zero locked TRC
- no current draw ticket
- no winner result or winner notification

### 4. TRC Participation

- **Participate in Sunday draw** calls the existing backend participation
  operation.
- The backend creates one verified entry and changes the TRC from `available`
  to `locked`.
- The operation is idempotent for the customer and current cycle. Repeated
  clicks return the existing ticket instead of spending another TRC.
- The UI disables duplicate submission and shows the ticket and processing
  state.

### 5. Immediate Demo Admin Draw

Production and demo share these domain operations:

1. finalize the current cycle
2. group verified entries by plan round
3. apply the normal five-percent winner rule, rounded up per non-empty round
4. assign winner/non-winner results
5. consume the locked TRC after a result is assigned
6. reveal the next winner
7. issue the winner benefit and coupon
8. create the customer notification
9. write admin audit records

Production invokes these operations through the normal admin or scheduled draw
trigger. Local demo invokes the same operations immediately after successful
participation and attributes them to the demo admin account.

A clean demo has one eligible participant in its selected plan round.
`ceil(1 * 0.05)` therefore selects one winner through the normal rule; there is
no separate hard-coded customer winner branch.

The immediate orchestration is idempotent. Retrying it must not create a second
winner benefit, coupon, notification, reveal, or audit outcome.

## Transaction and Failure Semantics

- Payment verification and entitlement issuance are one idempotent business
  operation.
- Participation either locks one TRC and creates its matching entry, or makes
  neither change.
- A draw failure before result assignment leaves the entry and TRC locked so
  the same draw can safely resume.
- A TRC becomes consumed only after the draw engine assigns a final result.
- Reveal and winner-benefit issuance are idempotent for the entry.
- A network failure after a successful backend operation is recovered by
  refreshing dashboard data; the UI does not repeat the business action
  blindly.
- Customer-facing errors explain whether payment, participation, or draw
  processing should be retried.

## Winner Notification

Winner reveal creates a persistent customer notification in backend data. A
notification contains:

- stable notification ID
- customer ID
- type (`winner`)
- title and concise message
- draw cycle and ticket reference
- destination route (`winner-status`)
- creation timestamp
- optional read timestamp

The dashboard response includes customer-scoped notifications. The header bell
shows the unread count and opens a compact notification panel. Selecting the
winner notification marks it read and opens **Winner Status**.

Immediately after the demo draw completes:

- a **Congratulations, You Won** modal opens
- the header bell receives an unread winner notification
- the Winner Status screen shows the ticket, plan, rank, coupon, benefit value,
  and result date
- the TRC screen shows zero available/locked TRC, a consumed ledger history,
  and the entry result as Winner

Notification and winner state survive refresh and logout/login because they are
read from the backend rather than temporary component state.

## Demo Reset

The Settings screen shows **Reset Demo Data** only when all of these are true:

- the authenticated account is marked as a demo account
- the application is using the local/demo environment
- the backend confirms reset capability

The button opens a destructive-action confirmation modal. Confirmation:

1. resets the local backend to the clean starting state
2. removes all demo subscription, payment, TRC, Discount Credit, draw, winner,
   notification, booking, cancellation, support, and audit records
3. restores the default demo profile and credentials
4. clears the current demo session and local cached account state
5. returns the browser to the public landing page

Reset is unavailable to production customers and production deployments. The
backend must reject reset attempts from non-demo accounts even if a caller
manually invokes the endpoint.

## Interfaces and Data Ownership

- Payment verification remains the only source of subscription and initial TRC
  entitlement.
- The shared draw engine remains the only source of draw results.
- Winner reveal remains the only source of winner benefits and winner
  notifications.
- The customer-dashboard read model owns the combined customer view of the
  subscription, payments, credits, entries, benefits, and notifications.
- A customer notification mutation marks only that customer's notification as
  read.
- Demo orchestration and reset are explicit backend capabilities; UI flags
  alone are not authorization.

The backend contracts will expose the minimum additions needed for:

- customer notifications in the dashboard response
- marking a customer notification read
- running the immediate demo draw orchestration through the shared draw engine
- resetting an authorized local demo account

Supabase/production and local adapters retain compatible customer-facing
contracts. Production does not expose the local reset capability and does not
auto-trigger the draw after participation.

## UI States

Each customer action includes:

- idle
- loading/processing
- success
- retryable failure
- non-retryable authorization or eligibility failure

Buttons remain disabled while their mutation is in flight. The UI uses
accessible dialogs, status messages, focus handling, and semantic button names.
Desktop and mobile layouts keep the existing screenshot-matched dashboard
shell.

## Verification

### Domain and API Tests

- A clean reset contains no customer business data.
- One verified subscription payment produces one active subscription and
  exactly one available TRC.
- Replaying the payment idempotency key produces no duplicate entitlement.
- Participation creates one entry and locks one TRC.
- Replaying participation produces no duplicate entry or credit mutation.
- The immediate demo orchestration invokes the shared finalize/reveal path with
  the demo admin actor.
- The five-percent rule selects the sole demo participant through normal
  rounding.
- Winner reveal consumes the TRC and creates one benefit, coupon, notification,
  and admin audit trail.
- Draw retry creates no duplicate outcome.
- A failed draw does not incorrectly consume the TRC.
- Notification reads are customer-scoped.
- Demo reset restores profile/credentials and removes all business data.
- A non-demo account cannot invoke reset.
- Production participation does not auto-trigger immediate draw orchestration.

### Browser Journey

An end-to-end test starts with reset and verifies:

`Landing -> Join Now -> Login -> Subscription -> Select plan ->`
`Verified payment -> Dashboard -> 1 TRC -> Participate ->`
`Admin draw -> Winner modal -> Bell notification -> Winner Status`

The test then refreshes and signs in again to confirm persistence, uses
**Reset Demo Data**, and confirms that the next login returns to the clean
starting state.

The browser suite also checks:

- no failed customer API responses
- no console or page errors
- no duplicate action from rapid clicks
- correct focus and dialog behavior
- no horizontal overflow on desktop or mobile

## Out of Scope

- Changing production draw timing or winner percentages
- Replacing the payment provider integration
- Sending real SMS, email, or push notifications during local demo
- Adding a separate customer Notifications route
- Adding a demo-only winner algorithm
