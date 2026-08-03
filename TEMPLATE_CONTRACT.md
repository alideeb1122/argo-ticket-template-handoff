# Template Contract 2.0.0

## Runtime API

Both HTML templates expose:

```js
window.ArgoTicketTemplate.version // "2.0.0"
window.ArgoTicketTemplate.mode    // "oneway" or "multi"
window.ArgoTicketTemplate.defaults
window.ArgoTicketTemplate.apply(ticketPayload)
```

`apply()` returns the resolved payload after defaults are applied. Values are inserted with `textContent`; payload HTML is never executed.

## Common Payload

```json
{
  "clientLogoUrl": "/logos/client.svg",
  "clientName": "ARGO Travel",
  "pnr": "96AK99",
  "idNo": "950291",
  "issueDate": "03AUG.2026",
  "status": "Confirmed",
  "portalUrl": "https://b2b.argo-fly.com",
  "passengers": [
    { "name": "MR. ALI ESSA", "type": "Adult", "ticketNo": "1254759523" }
  ],
  "contactAddress": "Syria - Homs - AlDablan",
  "contactWebsite": "Caesar-Road.com",
  "contactPhone": "+963 960 648 098"
}
```

## Flight Segment

Every segment uses this shape:

```json
{
  "departure": {
    "date": "03.08.2026.Monday",
    "time": "12:30",
    "code": "IST",
    "city": "Istanbul",
    "airport": "Istanbul Airport"
  },
  "arrival": {
    "date": "03.08.2026.Monday",
    "time": "13:25",
    "code": "TUN",
    "city": "Tunis",
    "airport": "Carthage Airport",
    "terminal": "Terminal M"
  },
  "duration": "02h 45min",
  "cabinClass": "Economy",
  "flightNo": "TU215",
  "baggage": "Up 2PCS"
}
```

## One-Way Mode

Use `ticket-template-a4-oneway.html`. `firstSection.segments` accepts one segment because the approved design contains one segment block.

`firstSection` contains `visible`, `title`, `airline.logoUrl`, `airline.name`, and a one-entry `segments` array using the flight segment shape above.

Complete working example: `data/payload-oneway.json`.

## Multi Mode

Use `ticket-template-a4.html`. The approved design contains two sections and two segments in each section.

`firstSection` and `secondSection` each contain `visible`, `title`, `stopover`, `airline.logoUrl`, `airline.name`, and a two-entry `segments` array using the flight segment shape above.

Complete working example: `data/payload-multi.json`.

## Compatibility Aliases

Existing integrations may continue using these old top-level fields:

- `showFirstSection`
- `showSecondSection`
- `firstSectionAirlineLogoUrl`
- `firstSectionAirlineName`
- `secondSectionAirlineLogoUrl`
- `secondSectionAirlineName`

New integrations should use the nested `firstSection` and `secondSection` objects.

## Formatting Rules

- Supply display-ready strings. The template does not alter dates, durations, airport names, or baggage text.
- Use a reachable URL, relative repository asset, or data URL for logos.
- Keep the supplied folder structure when using relative asset paths.
- Do not add route text to the blue header; use the approved section title only.
- Do not add labels beside the class, flight number, or baggage icons.
- Do not change CSS to fit unexpected content. Format the payload to the approved compact presentation and run the exporter.
- The PDF export is accepted only when the command confirms one A4 page.
