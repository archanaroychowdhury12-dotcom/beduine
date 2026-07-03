# Landing Button Routing Design

## Scope

Only the public static landing page button destinations will change. Existing
copy, sections, pricing cards, destination lists, imagery, and visual styling
will remain unchanged.

## Required Routes

- `Join Now`, `Join Beduine Club`, plan-level Join buttons, and the navbar
  `BEDUINE CLUB` link go to `/login?next=/landing`.
- After successful authentication, the existing app redirect logic opens
  `/landing`, which is the Beduine Club subscription page.
- `Customize Tour` buttons continue to open `/paid-tour#customize`.
- The paid-tour and customize pages remain publicly viewable without login.
- Login is required only when an unauthenticated visitor submits a custom-tour
  request or confirms a paid booking.

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
- Existing route/E2E tests covering public CTA destinations

## Verification

- Assert every Join/Club CTA uses `/login?next=/landing`.
- Assert every Customize Tour CTA uses `/paid-tour#customize`.
- Browser-test login return routing and public customize access.
- Confirm desktop and mobile landing layouts remain unchanged.
