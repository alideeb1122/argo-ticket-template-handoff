# Ticket Template Quick Notes

This repository now ships two separated template modes:

- Multi: `ticket-template-a4.html`
- One-way: `ticket-template-a4-oneway.html`

Both are code templates (HTML/CSS/JS), not screenshot-based layouts.

## Dynamic Template Behavior

Inject all runtime values with:

- `window.ArgoTicketTemplate.apply(data)`

## PDF

Run:

```bash
npm run export:pdf
```

This exports A4 PDFs and verifies each output is a single page.
