# Developer Handoff - Argo Ticket A4 Template

## Scope Completed

This handoff covers the ticket layout stabilization and integration hardening work done on the local project at:

- `argo-ticket-template-handoff` repository root

Main file:

- `ticket-template-a4.html`

Assets touched:

- `assets/second-section/ticket-2-exact.png`

Reference asset used for exact logo match:

- `assets/first-section/ticket-1-exact.png`

---

## What Was Fixed

1. Corrected airline logo mismatch in Section 2 (Inbound block)
- The airline logo/header in section 2 did not visually match section 1.
- The right-side top header strip was replaced from the section 1 reference to ensure an exact visual match.
- No other content blocks were altered.

2. Applied cache-busting for updated section 2 image
- `ticket-template-a4.html` now references:
  - `assets/second-section/ticket-2-exact.png?v=3`
- This prevents stale cached image rendering after updates.

3. Refactored template for integration safety
- CSS is fully scoped under `#argo-ticket-template` to reduce style collisions in host apps.
- Removed legacy/unused CSS and JS from previous template iterations.
- Exposed a small integration API:
  - `window.ArgoTicketTemplate.apply(data)`
  - `window.ArgoTicketTemplate.defaults`
- DOM updates were implemented with broadly compatible APIs (no modern-only dependencies).

---

## Final Logo Size (Section 2)

Measured on final source image `ticket-2-exact.png`:

- Detected white logo glyph bounding box: `131 x 109 px`
- Bounding coordinates in image: `x=1677..1807`, `y=16..124`
- Full image size: `2215 x 990 px`

Print-scale approximation (based on 188 mm rendered width):

- ~`11.1 mm x 9.25 mm` visible logo glyph area

---

## Data Contract for Runtime Injection

Supported fields in `ArgoTicketTemplate.apply(data)`:

- `clientLogoUrl: string`
- `clientName: string`
- `pnr: string`
- `idNo: string`
- `issueDate: string`
- `status: string`
- `portalUrl: string`
- `passengers: Array<{ name: string, type: string, ticketNo: string }>`
- `contactAddress: string`
- `contactWebsite: string`
- `contactPhone: string`
- `showFirstSection: boolean` (default: `true`)
- `showSecondSection: boolean` (default: `true`)
- `firstSectionImageSrc: string`
- `secondSectionImageSrc: string`

### Airline branding variability

Airline logos are expected to change between tickets.  
Current implementation supports this by replacing section image sources per ticket payload:

- `firstSectionImageSrc` for section 1 branding/content
- `secondSectionImageSrc` for section 2 branding/content

This allows:
- Same airline on both sections
- Different airline per section
- Single-section tickets with correct branding

---

## Integration Guidance

- Keep `ticket-template-a4.html` and `assets/` under the same static host path.
- Do not rename asset files unless references are updated accordingly.
- For framework integration, use iframe embedding and call `.apply(data)` after frame load.
- For print/PDF export flows, reuse the same HTML to preserve A4 proportions.
- The template now supports variable ticket shape:
  - First section only
  - Second section only
  - Both sections

---

## Recommended Ready Logo Sources

Use only assets that are legally allowed by each brand's usage guidelines.

1. Simple Icons
- Website: https://simpleicons.org
- GitHub: https://github.com/simple-icons/simple-icons
- Use case: brand SVG marks in consistent format.

2. Iconify
- Website: https://iconify.design
- Docs: https://iconify.design/docs/
- Use case: unified icon framework across many icon sets.

3. Brandfetch Logo API (for domain-based logo retrieval)
- Product: https://brandfetch.com
- Docs: https://docs.brandfetch.com/docs/logo-api/
- Use case: fetch and keep company logos up-to-date in app flows.

Note: legacy Clearbit Logo API is sunset (Dec 1, 2025), so avoid new integrations on it.

---

## Files Added For Team

- `INTEGRATION_RECIPES.md`
- `DEVELOPER_HANDOFF.md`
- `ticket-template-preview.png`

These are intended for direct handover to implementation engineers.
