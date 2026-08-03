(function () {
  var core = window.ArgoTicketCore;

  var DEFAULT_SEGMENT = {
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
  };

  function copySegment(flightNo) {
    return {
      departure: Object.assign({}, DEFAULT_SEGMENT.departure),
      arrival: Object.assign({}, DEFAULT_SEGMENT.arrival),
      duration: DEFAULT_SEGMENT.duration,
      cabinClass: DEFAULT_SEGMENT.cabinClass,
      flightNo: flightNo,
      baggage: DEFAULT_SEGMENT.baggage
    };
  }

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
      stopover: 'Stopover 6h 10m',
      airline: {
        logoUrl: 'assets/qatar-logo.png',
        name: 'QATAR AIRWAYS'
      },
      segments: [copySegment('QR3014'), copySegment('QR3014')]
    },
    secondSection: {
      visible: true,
      title: 'INBOUND',
      stopover: 'Stopover 6h 10m',
      airline: {
        logoUrl: 'assets/qatar-logo.png',
        name: 'QATAR AIRWAYS'
      },
      segments: [copySegment('013/014'), copySegment('013/014')]
    }
  };

  function applyLegacySectionFields(input, legacyKeys) {
    var section = input[legacyKeys.section] || {};
    var airline = section.airline || {};

    if (legacyKeys.visibility in input) section.visible = input[legacyKeys.visibility];
    if (legacyKeys.logo in input) airline.logoUrl = input[legacyKeys.logo];
    if (legacyKeys.name in input) airline.name = input[legacyKeys.name];

    section.airline = airline;
    input[legacyKeys.section] = section;
  }

  function normalizeLegacyFields(input) {
    applyLegacySectionFields(input, {
      section: 'firstSection',
      visibility: 'showFirstSection',
      logo: 'firstSectionAirlineLogoUrl',
      name: 'firstSectionAirlineName'
    });
    applyLegacySectionFields(input, {
      section: 'secondSection',
      visibility: 'showSecondSection',
      logo: 'secondSectionAirlineLogoUrl',
      name: 'secondSectionAirlineName'
    });
    return input;
  }

  function validateSection(section, sectionName) {
    if (!section || section.segments == null) return;
    if (!Array.isArray(section.segments) || section.segments.length !== 2) {
      throw new Error(sectionName + ' requires exactly two designed flight segments.');
    }
  }

  function validateInput(input) {
    validateSection(input.firstSection, 'firstSection');
    validateSection(input.secondSection, 'secondSection');
  }

  function applySection(sectionKey, segmentPrefix, section) {
    core.setSectionVisibility(sectionKey, section.visible);
    core.setText(sectionKey + 'Title', section.title);
    core.setText(sectionKey + 'Stopover', section.stopover);
    core.setAirlineBrand(
      sectionKey + 'AirlineLogo',
      sectionKey + 'AirlineName',
      section.airline
    );
    core.applySegment(segmentPrefix + 'FirstSegment', section.segments[0]);
    core.applySegment(segmentPrefix + 'SecondSegment', section.segments[1]);
  }

  function applyMultiFields(ticket) {
    applySection('firstSection', 'firstSection', ticket.firstSection);
    applySection('secondSection', 'secondSection', ticket.secondSection);
  }

  core.createTemplate({
    version: '2.0.0',
    mode: 'multi',
    defaults: DEFAULT_TICKET,
    normalizeInput: normalizeLegacyFields,
    validateInput: validateInput,
    applyMode: applyMultiFields
  });
})();
