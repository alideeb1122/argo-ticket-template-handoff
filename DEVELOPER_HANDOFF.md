# Developer Handoff

## Assignment

Integrate the redesigned Argo ticket into the existing application without changing its approved appearance.

## First Files to Open

1. `README.md`
2. `TEMPLATE_CONTRACT.md`
3. `data/payload-oneway.json` or `data/payload-multi.json`
4. The matching approved PDF

## Implementation Boundary

The developer owns only:

- mapping Argo/API booking values into the documented payload;
- selecting `oneway` or `multi`;
- selecting logo URLs from the existing logo library;
- hosting the template directory;
- invoking the supplied Chromium PDF exporter.

The developer must not redesign, simplify, recreate, or translate the HTML/CSS.

## Acceptance Criteria

- All real booking values appear through `window.ArgoTicketTemplate.apply(payload)`.
- Real booking values come from the payload; sample defaults are not production data.
- The host stack does not override template CSS; use `scripts/argo-ticket-embed.js` for isolation.
- PDFs are generated with the supplied Playwright/Chromium path.
- `npm run verify` passes.
- Both ticket modes export as exactly one A4 page.
- The final output retains the approved alignment, rounded borders, spacing, icons, typography, contact row, and footer.

## Rejection Conditions

Reject the implementation if it uses a new table layout, square replacement boxes, added route text, labels beside the right-panel icons, screenshots as the layout, a different PDF engine, or any CSS rewrite.
