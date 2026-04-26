# Argo Ticket Template Handoff

Production-ready A4 ticket template handoff package.

## Included

- `ticket-template-a4.html`
- `assets/`
- `INTEGRATION_RECIPES.md`
- `DEVELOPER_HANDOFF.md`
- `ticket-template-preview-v2.png`

## Runtime API

The template exposes:

- `window.ArgoTicketTemplate.apply(data)`
- `window.ArgoTicketTemplate.defaults`

## Airline Logo Variability

Airline logos can change per ticket and per section by passing:

- `firstSectionImageSrc`
- `secondSectionImageSrc`

And section visibility toggles:

- `showFirstSection`
- `showSecondSection`

See `INTEGRATION_RECIPES.md` for stack-specific examples.
