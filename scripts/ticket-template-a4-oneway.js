(function () {
  var core = window.ArgoTicketCore;

  var DEFAULT_TICKET = {
    clientLogoUrl: '',
    clientName: 'client name',
    pnr: 'ABCD12',
    idNo: '123456',
    issueDate: '05.03.2025',
    status: 'Confirmed',
    portalUrl: 'https://b2b.argo-fly.com',
    passengers: [
      { name: 'MR. ALI ESSA', type: 'Adult', ticketNo: '1254759523' }
    ],
    contactAddress: 'Syria - Homs - AlDablan',
    contactWebsite: 'Caesar-Road.com',
    contactPhone: '+963 960 648 098',
    firstSection: {
      visible: true,
      title: 'OUTBOUND',
      airline: {
        logoUrl: 'assets/qatar-logo.png',
        name: 'QATAR AIRWAYS'
      },
      segments: [
        {
          departure: {
            date: '05.03.2025.Wednsday',
            time: '17:50',
            code: 'DAM',
            city: 'Damascus',
            airport: 'intenational airport'
          },
          arrival: {
            date: '05.03.2025.Wednsday',
            time: '20:35',
            code: 'DOH',
            city: 'Doha',
            airport: 'intenational airport',
            terminal: 'Terminal 4'
          },
          duration: '02h 45min',
          cabinClass: 'Economy',
          flightNo: 'QR3014',
          baggage: 'Up 30KG'
        }
      ]
    }
  };

  function normalizeLegacyFields(input) {
    var section = input.firstSection || {};
    var airline = section.airline || {};

    if ('showFirstSection' in input) section.visible = input.showFirstSection;
    if ('firstSectionAirlineLogoUrl' in input) airline.logoUrl = input.firstSectionAirlineLogoUrl;
    if ('firstSectionAirlineName' in input) airline.name = input.firstSectionAirlineName;

    section.airline = airline;
    input.firstSection = section;
    return input;
  }

  function validateInput(input) {
    var segments = input.firstSection && input.firstSection.segments;
    if (segments != null && (!Array.isArray(segments) || segments.length !== 1)) {
      throw new Error('One-way template accepts exactly one designed flight segment.');
    }
  }

  function applyOneWayFields(ticket) {
    var section = ticket.firstSection;
    core.setSectionVisibility('firstSection', section.visible);
    core.setText('firstSectionTitle', section.title);
    core.setAirlineBrand('firstSectionAirlineLogo', 'firstSectionAirlineName', section.airline);
    core.applySegment('firstSegment', section.segments[0]);
  }

  core.createTemplate({
    version: '2.0.0',
    mode: 'oneway',
    defaults: DEFAULT_TICKET,
    normalizeInput: normalizeLegacyFields,
    validateInput: validateInput,
    applyMode: applyOneWayFields
  });
})();
