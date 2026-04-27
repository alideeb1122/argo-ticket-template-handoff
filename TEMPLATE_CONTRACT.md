# Template Contract

## Modes

- `multi` -> `ticket-template-a4.html`
- `oneway` -> `ticket-template-a4-oneway.html`

## Runtime API

- `window.ArgoTicketTemplate.apply(data)`
- `window.ArgoTicketTemplate.defaults`

## Shared Fields

- `clientLogoUrl?: string`
- `clientName?: string`
- `pnr?: string`
- `idNo?: string`
- `issueDate?: string`
- `status?: string`
- `portalUrl?: string`
- `passengers?: Array<{ name: string; type: string; ticketNo: string }>`
- `contactAddress?: string`
- `contactWebsite?: string`
- `contactPhone?: string`

## Mode-Specific Fields

### multi

- `showFirstSection?: boolean`
- `showSecondSection?: boolean`

### oneway

- `showFirstSection?: boolean`

## Behavior

- Missing fields fallback to template defaults.
- Passenger list replaces table rows at runtime.
- Templates are designed for A4 print export.
