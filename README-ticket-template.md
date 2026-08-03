# Ticket Template Quick Reference

- One flight: `ticket-template-a4-oneway.html`
- Multiple connected flights: `ticket-template-a4.html`
- Complete payload contract: `TEMPLATE_CONTRACT.md`
- Stack integration: `INTEGRATION_RECIPES.md`
- Exact PDF command: `npm run export:ticket -- --mode <oneway|multi> --data <payload.json> --output <ticket.pdf>`
- Final verification: `npm run verify`

Use the templates directly. Do not recreate their layout in another PDF library.
