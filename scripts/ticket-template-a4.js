(function () {
      const DEFAULT_DATA = {
        clientLogoUrl: "",
        clientName: "client name",
        pnr: "ABCD12",
        idNo: "123456",
        issueDate: "05.03.2025",
        status: "Confirmed",
        portalUrl: "https://b2b.argo-fly.com",
        passengers: [
          { name: "MR. ALI ESSA", type: "Adult", ticketNo: "1254759523" }
        ],
        contactAddress: "Syria - Homs - AlDablan",
        contactWebsite: "Caesar-Road.com",
        contactPhone: "+963 960 648 098",
        showFirstSection: true,
        showSecondSection: true
      };

      function setText(id, value) {
        const element = document.getElementById(id);
        if (element && value != null) {
          element.textContent = String(value);
        }
      }

      function clearElement(element) {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
      }

      function setClientLogo(url) {
        const container = document.getElementById("clientMark");
        if (!container) return;

        clearElement(container);

        if (!url) {
          container.appendChild(document.createTextNode("Client"));
          container.appendChild(document.createElement("br"));
          container.appendChild(document.createTextNode("Logo"));
          return;
        }

        const image = document.createElement("img");
        image.src = url;
        image.alt = "Client logo";
        container.appendChild(image);
      }

      function setPassengers(passengers) {
        const body = document.getElementById("passengerRows");
        if (!body || !Array.isArray(passengers) || passengers.length === 0) return;

        clearElement(body);

        passengers.forEach(function (passenger) {
          const row = document.createElement("tr");
          const nameCell = document.createElement("td");
          const typeCell = document.createElement("td");
          const ticketCell = document.createElement("td");

          nameCell.textContent = String(passenger.name || "");
          typeCell.textContent = String(passenger.type || "");
          ticketCell.textContent = String(passenger.ticketNo || "");

          row.appendChild(nameCell);
          row.appendChild(typeCell);
          row.appendChild(ticketCell);
          body.appendChild(row);
        });
      }

      function setSectionVisibility(id, shouldShow) {
        const section = document.getElementById(id);
        if (!section) return;
        const visible = shouldShow !== false;
        section.classList.toggle("is-hidden", !visible);
      }

      function applyTicketData(input) {
        const data = Object.assign({}, DEFAULT_DATA, input || {});

        setClientLogo(data.clientLogoUrl);
        setText("thanksClientName", data.clientName);
        setText("pnr", data.pnr);
        setText("idNo", data.idNo);
        setText("issueDate", data.issueDate);
        setText("status", data.status);
        setText("portalUrl", data.portalUrl);
        setPassengers(data.passengers);
        setSectionVisibility("firstSection", data.showFirstSection);
        setSectionVisibility("secondSection", data.showSecondSection);

        setText("contactAddressText", data.contactAddress);
        setText("contactWebsiteText", data.contactWebsite);
        setText("contactPhoneText", data.contactPhone);
      }

      window.ArgoTicketTemplate = {
        apply: applyTicketData,
        defaults: Object.assign({}, DEFAULT_DATA)
      };

      applyTicketData();
    })();
