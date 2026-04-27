# Integration Recipes (Any Stack)

## 1) Plain HTML + JS

```html
<div id="ticketMount"></div>
<script src="/scripts/argo-ticket-embed.js"></script>
<script>
  ArgoTicketEmbed.mount({
    mount: document.getElementById('ticketMount'),
    mode: 'oneway',
    basePath: '/',
    data: {
      clientName: 'ARGO Travel',
      pnr: 'ZX9911',
      idNo: 'A-10077',
      issueDate: '26APR.2026',
      status: 'Confirmed',
      passengers: [
        { name: 'MR. ALI ESSA', type: 'Adult', ticketNo: '1254759523' }
      ]
    }
  });
</script>
```

## 2) React

```jsx
import { useEffect, useRef } from 'react';

export default function Ticket({ data, mode = 'multi' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !window.ArgoTicketEmbed) return;
    const inst = window.ArgoTicketEmbed.mount({
      mount: ref.current,
      mode,
      basePath: '/',
      data
    });
    return () => { if (ref.current) ref.current.innerHTML = ''; };
  }, [data, mode]);

  return <div ref={ref} />;
}
```

## 3) Vue / Nuxt

Use the same pattern as React:

- mount a container element
- call `ArgoTicketEmbed.mount(...)` in `onMounted`
- pass `mode: 'multi' | 'oneway'`

## 4) Laravel / Blade

```blade
<div id="ticketMount"></div>
<script src="{{ asset('scripts/argo-ticket-embed.js') }}"></script>
<script>
  ArgoTicketEmbed.mount({
    mount: document.getElementById('ticketMount'),
    mode: 'multi',
    basePath: '{{ asset('') }}',
    data: @json($ticketPayload)
  });
</script>
```

## 5) Backend PDF Pipelines

If backend generates PDFs, use `tools/export-pdfs.js` as baseline logic:

- open HTML
- apply print media
- export A4 with zero margins
- verify page count = 1

## Integration Rules

- Keep relative folder structure unchanged (`assets/`, `styles/`, `scripts/`).
- Do not hardcode passenger or flight values in source; always inject using `apply(data)`.
- Choose template by business case:
  - `multi` for outbound/inbound tickets
  - `oneway` for single-leg tickets
