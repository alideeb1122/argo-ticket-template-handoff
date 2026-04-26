# Argo Ticket Integration Recipes

This file gives ready-to-use integration snippets for different stacks.
All snippets target the same template file:

- `./ticket-template-a4.html`

## 1) Plain HTML (direct include)

Use inside any static page:

```html
<iframe
  src="./ticket-template-a4.html"
  style="width: 100%; min-height: 1400px; border: 0;"
  loading="lazy"
></iframe>
```

## 2) Plain JavaScript (dynamic data)

The template exposes:

- `window.ArgoTicketTemplate.apply(data)`
- `window.ArgoTicketTemplate.defaults`

Example:

```html
<script>
  window.ArgoTicketTemplate.apply({
    clientName: "ARGO Travel",
    pnr: "ZX9911",
    idNo: "A-10077",
    issueDate: "26APR.2026",
    status: "Confirmed",
    passengers: [
      { name: "MR. ALI ESSA", type: "Adult", ticketNo: "1254759523" },
      { name: "MRS. LINA ESSA", type: "Adult", ticketNo: "1254759524" }
    ],
    contactAddress: "Syria - Homs - AlDablan",
    contactWebsite: "caesar-road.com",
    contactPhone: "+964 751 851 0187",
    firstSectionImageSrc: "assets/first-section/ticket-1-exact.png",
    secondSectionImageSrc: "assets/second-section/ticket-2-exact.png?v=3",
    showFirstSection: true,
    showSecondSection: false
  });
</script>
```

## Airline Logo per Ticket (important)

Airline branding can vary per ticket and per section.  
Use section image sources per ticket payload:

```html
<script>
  window.ArgoTicketTemplate.apply({
    // Example: outbound on one airline, inbound on another airline
    firstSectionImageSrc: "assets/first-section/ticket-outbound-turkish.png",
    secondSectionImageSrc: "assets/second-section/ticket-inbound-qatar.png?v=1",
    showFirstSection: true,
    showSecondSection: true
  });
</script>
```

## 3) React wrapper

```jsx
import { useEffect, useRef } from "react";

export default function TicketTemplateFrame({ data }) {
  const ref = useRef(null);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;

    const onLoad = () => {
      const win = frame.contentWindow;
      if (win && win.ArgoTicketTemplate) {
        win.ArgoTicketTemplate.apply(data || {});
      }
    };

    frame.addEventListener("load", onLoad);
    return () => frame.removeEventListener("load", onLoad);
  }, [data]);

  return (
    <iframe
      ref={ref}
      src="/ticket-template-a4.html"
      style={{ width: "100%", minHeight: 1400, border: 0 }}
      title="Ticket Template"
    />
  );
}
```

## 4) Vue 3 wrapper

```vue
<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  data: { type: Object, default: () => ({}) }
});

const frameRef = ref(null);

const applyData = () => {
  const frame = frameRef.value;
  const win = frame?.contentWindow;
  if (win?.ArgoTicketTemplate) {
    win.ArgoTicketTemplate.apply(props.data || {});
  }
};

onMounted(() => {
  frameRef.value?.addEventListener("load", applyData);
});

watch(() => props.data, applyData, { deep: true });
</script>

<template>
  <iframe
    ref="frameRef"
    src="/ticket-template-a4.html"
    style="width: 100%; min-height: 1400px; border: 0;"
    title="Ticket Template"
  />
</template>
```

## 5) Node/Express serve

```js
import express from "express";
import path from "node:path";

const app = express();
const root = path.resolve(".");

app.use("/tickets", express.static(root));

app.listen(3000, () => {
  console.log("Open http://localhost:3000/tickets/ticket-template-a4.html");
});
```

## 6) Laravel Blade include

```blade
<iframe
  src="{{ asset('ticket-template-a4.html') }}"
  style="width:100%;min-height:1400px;border:0"
  title="Ticket Template"
></iframe>
```

## Integration Notes

- Keep `assets/` folder structure unchanged.
- Keep file names unchanged to avoid broken image references.
- `assets/second-section/ticket-2-exact.png?v=3` is intentional for cache busting.
- Best practice: host `ticket-template-a4.html` and `assets/` under same origin.
- If you need runtime data injection, prefer iframe + `ArgoTicketTemplate.apply()`.
- You can toggle sections per ticket:
  - `showFirstSection: true|false`
  - `showSecondSection: true|false`
- You can swap airline/logo visuals per ticket by changing:
  - `firstSectionImageSrc`
  - `secondSectionImageSrc`
