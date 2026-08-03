(function () {
  function isRecord(candidate) {
    return candidate !== null && typeof candidate === 'object' && !Array.isArray(candidate);
  }

  function clonePlain(candidate) {
    if (Array.isArray(candidate)) return candidate.map(clonePlain);
    if (!isRecord(candidate)) return candidate;

    return Object.keys(candidate).reduce(function (clone, key) {
      clone[key] = clonePlain(candidate[key]);
      return clone;
    }, {});
  }

  function mergePlain(defaults, overrides) {
    if (Array.isArray(defaults) && Array.isArray(overrides)) {
      return defaults.map(function (defaultEntry, index) {
        return index < overrides.length
          ? mergePlain(defaultEntry, overrides[index])
          : clonePlain(defaultEntry);
      });
    }

    if (!isRecord(defaults) || !isRecord(overrides)) return clonePlain(overrides);

    var merged = clonePlain(defaults);
    Object.keys(overrides).forEach(function (key) {
      merged[key] = key in defaults
        ? mergePlain(defaults[key], overrides[key])
        : clonePlain(overrides[key]);
    });
    return merged;
  }

  function setText(elementId, text) {
    var element = document.getElementById(elementId);
    if (element && text != null) element.textContent = String(text);
  }

  function clearElement(element) {
    while (element.firstChild) element.removeChild(element.firstChild);
  }

  function setClientLogo(logoUrl) {
    var container = document.getElementById('clientMark');
    if (!container) return;

    clearElement(container);
    if (!logoUrl) {
      container.appendChild(document.createTextNode('Client'));
      container.appendChild(document.createElement('br'));
      container.appendChild(document.createTextNode('Logo'));
      return;
    }

    var image = document.createElement('img');
    image.src = String(logoUrl);
    image.alt = 'Client logo';
    container.appendChild(image);
  }

  function setPassengers(passengers) {
    var tableBody = document.getElementById('passengerRows');
    if (!tableBody || !Array.isArray(passengers)) return;

    clearElement(tableBody);
    passengers.forEach(function (passenger) {
      var row = document.createElement('tr');
      [passenger.name, passenger.type, passenger.ticketNo].forEach(function (cellText) {
        var cell = document.createElement('td');
        cell.textContent = cellText == null ? '' : String(cellText);
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });
  }

  function setSectionVisibility(sectionId, isVisible) {
    var section = document.getElementById(sectionId);
    if (section) section.classList.toggle('is-hidden', isVisible === false);
  }

  function setAirlineBrand(logoId, nameId, airline) {
    var logo = document.getElementById(logoId);
    var name = document.getElementById(nameId);
    if (logo && airline.logoUrl) logo.src = String(airline.logoUrl);
    if (logo && airline.name != null) logo.alt = String(airline.name);
    if (name && airline.name != null) name.textContent = String(airline.name);
  }

  function applyCommonFields(ticket) {
    setClientLogo(ticket.clientLogoUrl);
    setText('thanksClientName', ticket.clientName);
    setText('pnr', ticket.pnr);
    setText('idNo', ticket.idNo);
    setText('issueDate', ticket.issueDate);
    setText('status', ticket.status);
    setText('portalUrl', ticket.portalUrl);
    setText('contactAddressText', ticket.contactAddress);
    setText('contactWebsiteText', ticket.contactWebsite);
    setText('contactPhoneText', ticket.contactPhone);
    setPassengers(ticket.passengers);
  }

  function applySegment(prefix, segment) {
    var textBySuffix = {
      DepartureDate: segment.departure.date,
      DepartureTime: segment.departure.time,
      DepartureCode: segment.departure.code,
      DepartureCity: segment.departure.city,
      DepartureAirport: segment.departure.airport,
      Duration: segment.duration,
      ArrivalDate: segment.arrival.date,
      ArrivalTime: segment.arrival.time,
      ArrivalCode: segment.arrival.code,
      ArrivalCity: segment.arrival.city,
      ArrivalAirport: segment.arrival.airport,
      ArrivalTerminal: segment.arrival.terminal,
      CabinClass: segment.cabinClass,
      FlightNo: segment.flightNo,
      Baggage: segment.baggage
    };

    Object.keys(textBySuffix).forEach(function (suffix) {
      setText(prefix + suffix, textBySuffix[suffix]);
    });
  }

  function createTemplate(options) {
    function apply(input) {
      var normalizedInput = options.normalizeInput(clonePlain(input || {}));
      options.validateInput(normalizedInput);
      var ticket = mergePlain(options.defaults, normalizedInput);
      applyCommonFields(ticket);
      options.applyMode(ticket);
      return clonePlain(ticket);
    }

    var template = {
      version: options.version,
      mode: options.mode,
      apply: apply,
      defaults: clonePlain(options.defaults)
    };

    window.ArgoTicketTemplate = template;
    apply({});
    return template;
  }

  window.ArgoTicketCore = {
    applySegment: applySegment,
    createTemplate: createTemplate,
    setAirlineBrand: setAirlineBrand,
    setSectionVisibility: setSectionVisibility,
    setText: setText
  };
})();
