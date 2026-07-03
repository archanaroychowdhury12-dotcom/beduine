# Screenshot-Matched Customer Dashboard Design

## Goal

Rebuild the authenticated customer dashboard to match the supplied Beduine
reference image while keeping every screen connected to customer-scoped backend
data and real actions. The dashboard must not render fabricated customer,
booking, payment, credit, draw, or support data.

## Reference Direction

The supplied image is the visual source of truth:

- bright white and pale-blue travel theme
- orange Beduine branding with blue active navigation
- fixed desktop sidebar with logo, tagline, and travel illustration
- compact sticky top header with page title, notification control, and profile
- rounded white cards, compact tables, blue banners, and orange primary actions
- mountain, beach, airplane-path, and destination imagery used as supporting
  decoration without reducing readability

Exact customer names, amounts, booking references, and dates shown in the
reference are examples only. The application renders the authenticated
customer's real values or a truthful empty state.

## Architecture

The existing `ModernDashboardApp` remains the dashboard entry point. Its shell,
shared components, and route content will be refactored rather than replaced by
the unused dummy-data pages.

- `DashboardPage` continues to own loading, error, retry, and data refresh.
- `ModernDashboardApp` receives one typed `CustomerDashboardResponse`.
- `DashboardLayout` owns responsive navigation, active-route state, header, and
  content layout.
- Shared card, table, status, modal, filter, empty-state, and action components
  provide the reference visual language across every screen.
- Route-specific screen components consume only the model fields and action
  callbacks they need.
- Existing backend adapters remain the boundary for reads and mutations.
- Supabase and the shared local backend expose equivalent customer behavior.

## Navigation

The dashboard contains these eleven customer routes:

1. Overview
2. My UID
3. My Plan
4. TRC / Travel Reward Credits
5. Winner Status
6. Discount Credits
7. My Bookings
8. My Payments
9. Profile
10. Support Tickets
11. Settings

The separate `Lucky Draw` route is removed. Draw participation is part of the
`TRC / Travel Reward Credits` screen.

Desktop uses the fixed sidebar from the reference. Tablet and mobile use a
drawer plus compact bottom shortcuts for the highest-frequency routes. Changing
routes does not trigger a full-page reload.

## Screen Behavior

### Overview

- Profile banner shows the authenticated customer's name, UID, and role label.
- Summary cards show total bookings, upcoming trips, verified total spend, and
  available Discount Credit value.
- Next Trip uses the nearest future booking when one exists.
- Recent Activity is derived from real payments, bookings, subscription events,
  credit ledger entries, draw entries, and support updates.
- The Travel Reward card shows the current entry state and links into the TRC
  screen.
- Missing bookings or activity render purpose-built empty states.

### My UID

- Shows the immutable Beduine UID, customer name, and account status.
- Provides a working copy-to-clipboard action with success/error feedback.
- Does not expose internal auth identifiers.

### My Plan

- Shows active plan name, category, activation date, expiry date, and status.
- Shows current subscription benefits derived from the plan catalog.
- Shows real subscription/payment history where records exist.
- An account without a plan receives a clear subscribe action.

### TRC / Travel Reward Credits

- Shows available and locked TRC balances.
- Shows the current draw cycle, participation eligibility, and existing ticket.
- The participation action calls the existing atomic backend workflow.
- Already-participating, no-credit, inactive-plan, loading, success, and backend
  failure states are explicit.
- Credit and participation histories appear in one screen.

### Winner Status

- Shows pending/non-winner/winner state from real draw entries and winner
  benefits.
- Winner cards show the issued coupon and destination only when present in the
  backend response.
- No placeholder winner benefit is displayed.

### Discount Credits

- Shows available credit count and total value.
- Separates Domestic and International units.
- Shows available, reserved, redeemed, and expired states with booking
  references where available.
- Provides a Book Tour action without mutating credits directly.

### My Bookings

- Provides All, Upcoming, Completed, and Cancelled filters.
- Shows booking reference, tour name, departure date, total amount, payment
  state, and booking state from the backend.
- View opens a real booking-details modal.
- Eligible bookings expose the existing cancellation-request flow.
- Empty filters and empty accounts render truthful empty states.

### My Payments

- Shows verified customer-scoped payments with reference, related booking or
  plan, amount, date, provider, and status.
- Receipt opens a printable receipt view generated from the verified payment
  record. It does not claim tax or provider details absent from the record.
- Pending, failed, refunded, and verified states use distinct badges.

### Profile

- Shows the authenticated profile values.
- Edit mode validates and persists supported profile fields through the backend;
  it is not a local-only mock.
- Email is read-only when controlled by the auth provider.
- Missing optional fields display `Not provided`, not fabricated values.

### Support Tickets

- Provides All, Open, In Progress, and Closed filters.
- Customers can create a ticket, view its conversation, and reply.
- All mutations use the existing customer-scoped support APIs and refresh the
  dashboard model after success.
- Loading, validation, permission, and backend errors remain visible.

### Settings

- Provides persisted notification preferences when supported by the customer
  profile backend.
- Password/account security actions use the configured authentication provider.
- Logout uses the existing application callback.
- Unsupported settings are not shown as inert controls.

## Backend Contract

`CustomerDashboardResponse` remains the single dashboard read model but is
expanded only with fields already stored by the booking, payment, subscription,
profile, and draw systems.

- Booking summaries expose tour name, departure date, totals, payment state,
  booking category, and cancellability.
- Payment summaries expose their purpose/reference relationship.
- Profile summaries expose only persisted, customer-editable optional fields.
- Recent activity is either returned as a typed activity list or deterministically
  derived from the customer-scoped records already in the response.
- The profile update and settings mutations are added to the backend adapter
  only for fields the backend can persist.
- Local and Supabase adapters return the same response shape and mutation
  semantics.
- Customer queries remain scoped to the authenticated user. Admin-only data is
  never returned to the dashboard.

## Visual System

- Desktop sidebar width: approximately 240-260 pixels.
- Header and content remain inside the remaining viewport width.
- Main cards use white backgrounds, pale-blue borders, 14-20 pixel radii, and
  restrained blue shadows.
- Primary blue communicates navigation and system actions; Beduine orange is
  reserved for high-emphasis travel and conversion actions.
- Tables use compact spacing on desktop and convert into labelled cards on
  narrow screens.
- Decorative travel imagery is non-interactive, has appropriate alternative
  text or is hidden from assistive technology, and never carries required
  information.
- Focus, hover, active, disabled, loading, empty, and error states are defined
  for every interactive control.
- Motion respects reduced-motion preferences.

## Error and Refresh Behavior

- The existing dashboard-level loading, failure, and retry screen remains.
- Mutation buttons disable while submitting and prevent duplicate requests.
- Successful mutations refresh the authoritative dashboard model.
- A failed mutation leaves the current screen and user input intact when safe.
- Empty arrays are valid successful responses and render empty states.
- Backend error messages are mapped to concise customer-facing explanations.

## Implementation Boundaries

- Reuse the existing logo and travel image assets before introducing new ones.
- Do not import `modern/data/dummyData.ts` into production dashboard code.
- Do not rewrite authentication, subscription checkout, booking creation, draw,
  cancellation, payment verification, or support workflows.
- Do not add unrelated admin-dashboard work.
- Do not run the deferred full browser verification, cleanup pass, or release
  checks until the user explicitly requests them.
- Focused tests needed to drive implementation may run during development; the
  final cross-browser and cleanup verification remains deferred.

## Acceptance Criteria

- The dashboard closely matches the supplied reference layout and visual system.
- All eleven navigation items render responsive, usable screens.
- Lucky Draw is merged into `TRC / Travel Reward Credits`.
- Every displayed customer value comes from the authenticated backend model.
- Booking filters/details/cancellation, draw participation, printable payment
  receipts, profile editing, support creation/view/reply, settings actions, and
  logout are functional within their defined backend capabilities.
- No dashboard production file imports dummy customer data.
- Loading, empty, error, disabled, and success states are present.
- Desktop, tablet, and mobile layouts are specified for implementation.
- Final browser verification and cleanup remain deferred until the user asks.
