# Argo Ticket Templates (Git-Ready)

This repository contains two **separated code templates** (not image snapshots):

- `ticket-template-a4.html` : multi-ticket layout (outbound + inbound).
- `ticket-template-a4-oneway.html` : one-way layout (single ticket block).

Both templates are A4-ready and expose the same runtime API style.

## Project Structure

- `ticket-template-a4.html`
- `ticket-template-a4-oneway.html`
- `styles/`
  - `ticket-template-a4.css`
  - `ticket-template-a4-oneway.css`
- `scripts/`
  - `ticket-template-a4.js`
  - `ticket-template-a4-oneway.js`
  - `argo-ticket-embed.js` (stack-agnostic iframe helper)
- `assets/`
- `tools/export-pdfs.js`

## Developer Contract (Template Data)

Each template accepts dynamic values through:

- `window.ArgoTicketTemplate.apply(data)`
- `window.ArgoTicketTemplate.defaults`

Common fields:

- `clientLogoUrl`
- `clientName`
- `pnr`
- `idNo`
- `issueDate`
- `status`
- `portalUrl`
- `passengers[]` (`name`, `type`, `ticketNo`)
- `contactAddress`
- `contactWebsite`
- `contactPhone`

Multi-template only fields:

- `showFirstSection`
- `showSecondSection`
- `firstSectionImageSrc`
- `secondSectionImageSrc`

One-way template note:

- Outbound-only visual state is already enforced by HTML structure.

## Any-Stack Integration

Use `scripts/argo-ticket-embed.js`:

- `ArgoTicketEmbed.mount({ mount, mode, data, basePath })`
- `mode`: `"multi"` (default) or `"oneway"`

This works from plain JS, React, Vue, Laravel, Node-rendered pages, or any web stack that can host an iframe.

## PDF Export Guarantee (A4 / 1 page)

Run:

```bash
npm run export:pdf
```

What this does:

- Exports both templates to PDF.
- Enforces A4 settings.
- Validates each PDF is exactly **1 page** (throws error if not).

Outputs:

- `ticket-template-a4-final.pdf`
- `ticket-template-a4-oneway-final.pdf`
