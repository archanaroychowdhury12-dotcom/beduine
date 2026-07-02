# Customize View Tours Button on Landing Page

Customize the "View Tours" button in the pricing plans footer of the static landing page to redirect to the Custom Tour page instead of the general tour packages page.

## Proposed Changes

### Static Landing Page

#### [MODIFY] [index.html](file:///e:/busness/bediine/frontend/Beduine_Landing-Page/index.html)
- Change `<a href="/paid-tour" class="btn-outline-dark">View Tours</a>` to `<a href="/paid-tour#customize" class="btn-outline-dark">Customize Tour</a>`.

### Tests

#### [MODIFY] [landingStaticLinks.test.ts](file:///e:/busness/bediine/frontend/tests/landingStaticLinks.test.ts)
- Update the assertion for `View Tours` to expect `Customize Tour` with the path `href="/paid-tour#customize"`.

## Verification Plan

### Automated Tests
- Run `npm run test` inside the `frontend` directory to ensure static links test passes.
- Run `npm run build` inside the `frontend` directory to ensure the build script runs successfully and copies the landing page to the `dist` directory.
