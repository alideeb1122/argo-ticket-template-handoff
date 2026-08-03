# Argo Ticket Templates

Approved A4 ticket templates for Caesar Road Travel & Tourism. The layout is production code, not a screenshot and not a design reference to recreate.

## Start Here

1. Keep the repository structure and CSS unchanged.
2. Choose the correct template mode.
3. Map application data to the matching JSON contract.
4. Render the supplied HTML in Chromium.
5. Run `npm run verify` before delivery.

Do not rebuild the ticket with DOMPDF, mPDF, wkhtmltopdf, a canvas image, a table-only PDF, or custom HTML. Those paths do not preserve the approved design.

## Approved Modes

| Business case | Mode | HTML template | Payload example | Approved PDF |
| --- | --- | --- | --- | --- |
| One flight segment | `oneway` | `ticket-template-a4-oneway.html` | `data/payload-oneway.json` | `ticket-template-a4-oneway-final.pdf` |
| Outbound and inbound with connections | `multi` | `ticket-template-a4.html` | `data/payload-multi.json` | `ticket-template-a4-final.pdf` |

The templates expose version `2.0.0` through `window.ArgoTicketTemplate.version`.

## Exact PDF Export

Install once:

```bash
npm install
npx playwright install chromium
```

Export a ticket from application data:

```bash
npm run export:ticket -- --mode oneway --data data/payload-oneway.json --output output/oneway-ticket.pdf
npm run export:ticket -- --mode multi --data data/payload-multi.json --output output/multi-ticket.pdf
```

The exporter:

- opens the approved HTML template;
- injects the supplied JSON payload;
- waits for fonts and images;
- prints with Chromium using A4 portrait and zero browser margins;
- fails if the result is not exactly one page.

## Browser Integration

The safest cross-stack integration uses the isolated iframe helper:

```html
<div id="ticketMount"></div>
<script src="/argo-ticket/scripts/argo-ticket-embed.js"></script>
<script>
  ArgoTicketEmbed.mount({
    mount: document.getElementById('ticketMount'),
    mode: 'oneway',
    basePath: '/argo-ticket',
    data: ticketPayload
  });
</script>
```

Direct template use is also available:

```js
window.ArgoTicketTemplate.apply(ticketPayload);
```

See `INTEGRATION_RECIPES.md` for React, Vue, Laravel, and backend integration notes.

## Verification

```bash
npm run verify
```

This command verifies all dynamic flight fields, template mode/version, centered 210mm x 297mm geometry, and both one-page PDF outputs.

## Data Contract

All visible business values are dynamic:

- client logo and name;
- booking metadata and status;
- passenger rows;
- section title, airline logo, and airline name;
- departure and arrival date, time, code, city, airport, and terminal;
- duration, cabin class, flight number, and baggage;
- stopover text in the multi template;
- address, website, phone, thank-you name, and portal URL.

Use the complete schema in `TEMPLATE_CONTRACT.md`. Do not place business values directly in HTML or CSS.

## Repository Structure

```text
assets/                         icons and airline/client image assets
data/                           complete payload examples
scripts/ticket-template-core.js shared safe data binding
scripts/ticket-template-a4.js   multi-mode data mapping
scripts/ticket-template-a4-oneway.js one-way data mapping
scripts/argo-ticket-embed.js    stack-agnostic iframe integration
styles/                         approved design CSS, do not rewrite
tools/export-ticket-pdf.js      payload-to-PDF command
tools/export-pdfs.js            approved reference PDF export
tools/verify-templates.js       integration and layout verification
```
