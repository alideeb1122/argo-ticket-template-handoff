# Integration Recipes

## Required Integration Flow

1. Convert the Argo booking response into the payload in `TEMPLATE_CONTRACT.md`.
2. Select `oneway` or `multi` from the business case.
3. Pass the payload to the supplied template. Do not generate replacement markup.
4. For PDF, run the supplied Chromium exporter.
5. Run `npm run verify` before merge or deployment.

## Plain HTML or Any Frontend Stack

Host the repository under one public path, then use the iframe helper. The iframe prevents the host application's CSS from changing the ticket.

```html
<div id="ticketMount"></div>
<script src="/argo-ticket/scripts/argo-ticket-embed.js"></script>
<script>
  const ticket = ArgoTicketEmbed.mount({
    mount: document.getElementById('ticketMount'),
    mode: 'oneway',
    basePath: '/argo-ticket',
    data: ticketPayload
  });

  // Apply refreshed booking data without rebuilding the template.
  ticket.apply(nextTicketPayload);
</script>
```

## React

```jsx
import { useEffect, useRef } from 'react';

export default function ArgoTicket({ ticketPayload, mode }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const ticket = window.ArgoTicketEmbed.mount({
      mount: mountRef.current,
      mode,
      basePath: '/argo-ticket',
      data: ticketPayload
    });

    return () => ticket.destroy();
  }, [mode, ticketPayload]);

  return <div ref={mountRef} />;
}
```

## Vue or Nuxt

Call `ArgoTicketEmbed.mount()` inside `onMounted()`. Call the returned `destroy()` function inside `onBeforeUnmount()`. Keep the template files under the same public base path.

## Laravel or Blade

```blade
<div id="ticketMount"></div>
<script src="{{ asset('argo-ticket/scripts/argo-ticket-embed.js') }}"></script>
<script>
  ArgoTicketEmbed.mount({
    mount: document.getElementById('ticketMount'),
    mode: @json($ticketMode),
    basePath: @json(asset('argo-ticket')),
    data: @json($ticketPayload)
  });
</script>
```

Laravel should only build `$ticketPayload`. It must not translate the template into Blade tables or send it to DOMPDF.

## Backend PDF Service

The repository includes a deterministic JSON-to-PDF command:

```bash
npm run export:ticket -- --mode oneway --data storage/tickets/96AK99.json --output storage/tickets/96AK99.pdf
```

A PHP, Java, .NET, Python, or Node application can invoke the command in a worker, or reproduce the same Playwright calls from `tools/pdf-export-core.js`. The rendered source must remain the supplied HTML/CSS.

## Airline and Client Logos

- Use the application's logo library and pass the selected URL in `airline.logoUrl`.
- Pass the Argo/client logo in `clientLogoUrl`.
- Prefer SVG, PNG, or a data URL that Chromium can load.
- The exporter fails when an image source cannot be loaded.

## Acceptance Check

```bash
npm install
npx playwright install chromium
npm run verify
```

Both reference PDFs must export as one A4 page. Compare them with the committed `ticket-template-a4-final.pdf` and `ticket-template-a4-oneway-final.pdf`.
