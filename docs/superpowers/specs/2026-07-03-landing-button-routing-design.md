# Landing Join Routing Design

## Scope

Only the public static landing page Join/Club CTA flow will change. Existing
copy, sections, pricing cards, destination lists, imagery, visual styling, and
authenticated plan-purchase flow will remain unchanged.

## Required Flow

- `Join Now`, `Join Beduine Club`, plan-level Join buttons, and the navbar
  `BEDUINE CLUB` link go to `/login?next=/subscription`.
- After successful authentication, the existing app redirect logic opens
  `/subscription`.
- The subscription page opens in its normal initial state. Registration or
  checkout must not open automatically after login.
- The public landing page must not store a pending plan when a Join CTA is
  clicked. This prevents stale `pendingPlanName` state from redirecting the
  authenticated user to the registration form.
- A plan is selected only after the authenticated user chooses it on the
  subscription page. The existing authenticated plan-selection and checkout
  behavior remains unchanged.
- `Customize Tour` buttons continue to open `/paid-tour#customize`.
- The paid-tour and customize pages remain publicly viewable without login.
- Login is required only when an unauthenticated visitor submits a custom-tour
  request or confirms a paid booking.

## Routing Responsibilities

- Static landing HTML owns the Join CTA destination.
- Static landing JavaScript handles presentation behavior only and does not
  persist plan intent for Join CTAs.
- App authentication consumes the safe `/subscription` return path and renders
  the subscription view.
- Registration and checkout remain separate user-initiated steps from the
  authenticated subscription page.

## Failure Handling

- Unsafe or unsupported `next` values continue to use the app's existing safe
  fallback behavior.
- A stale `pendingPlanName` from an older session must not override an explicit
  `/subscription` post-login destination.

## Content Preservation

- Keep the hero, pricing, global CTA, About, Why Choose, How It Works, Location,
  Trust & Support, Quick FAQ, and footer sections.
- Keep all existing general marketing text.
- Keep pricing cards limited to plan price and destination information; do not
  add TRC or non-winner Discount Credit detail rows.
- Do not add a Refund Policy link to the footer.

## Files

- `frontend/Beduine_Landing-Page/index.html`
- `frontend/Beduine_Landing-Page/index.editable.html`
- `frontend/Beduine_Landing-Page/script.js`
- Existing app route/auth code only if needed to guarantee the explicit
  post-login destination takes priority over stale plan state
- Existing route/E2E tests covering public CTA destinations

## Verification

- Assert every Join/Club CTA uses `/login?next=/subscription`.
- Assert the landing script does not persist `pendingPlanName` for Join CTAs.
- Assert every Customize Tour CTA uses `/paid-tour#customize`.
- Browser-test `Join Now` opening Login and successful login opening the normal
  Subscription page without an automatic registration/checkout form.
- Verify authenticated plan selection still opens the existing purchase flow.
- Confirm desktop and mobile landing layouts remain unchanged.
