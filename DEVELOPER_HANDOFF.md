# Developer Handoff

## Delivery Status

Project is now split and production-friendly:

- HTML layout files are separate per ticket type.
- CSS and JS are extracted into dedicated files.
- Dynamic data is injected at runtime (template behavior, not static content).
- PDF export is automated and validated to one-page A4.

## Ticket Modes

- Multi ticket: `ticket-template-a4.html`
- One-way ticket: `ticket-template-a4-oneway.html`

## Runtime API

Both templates expose:

- `window.ArgoTicketTemplate.apply(data)`
- `window.ArgoTicketTemplate.defaults`

## Stack-Agnostic Embed Helper

- `scripts/argo-ticket-embed.js`
- API: `ArgoTicketEmbed.mount({ mount, mode, data, basePath })`

## PDF Reliability

`npm run export:pdf` exports and validates:

- `ticket-template-a4-final.pdf` => 1 page
- `ticket-template-a4-oneway-final.pdf` => 1 page

## Notes for Engineering Team

- Treat both HTML files as templates.
- Do not keep business data hardcoded; inject payload from backend or frontend state.
- Keep assets paths stable unless you also update references.
