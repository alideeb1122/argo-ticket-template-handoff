const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const PROJECT_ROOT = path.resolve('.');

const TEMPLATE_CASES = [
  {
    mode: 'multi',
    html: 'ticket-template-a4.html',
    payload: 'data/payload-multi.json',
    cardCount: 2
  },
  {
    mode: 'oneway',
    html: 'ticket-template-a4-oneway.html',
    payload: 'data/payload-oneway.json',
    cardCount: 1
  }
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.resolve(relativePath), 'utf8'));
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
  }[extension] || 'application/octet-stream';
}

function serveProjectFile(request, response) {
  const requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const filePath = path.resolve(PROJECT_ROOT, '.' + requestPath);
  if (!filePath.startsWith(PROJECT_ROOT + path.sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(filePath, function (readError, fileBytes) {
    if (readError) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': contentType(filePath) }).end(fileBytes);
  });
}

function startProjectServer() {
  return new Promise(function (resolve) {
    const server = http.createServer(serveProjectFile);
    server.listen(0, '127.0.0.1', function () {
      resolve({
        baseUrl: 'http://127.0.0.1:' + server.address().port,
        close: function () {
          return new Promise(function (closeResolve) { server.close(closeResolve); });
        }
      });
    });
  });
}

function segmentText(prefix, segment) {
  return {
    [prefix + 'DepartureDate']: segment.departure.date,
    [prefix + 'DepartureTime']: segment.departure.time,
    [prefix + 'DepartureCode']: segment.departure.code,
    [prefix + 'DepartureCity']: segment.departure.city,
    [prefix + 'DepartureAirport']: segment.departure.airport,
    [prefix + 'Duration']: segment.duration,
    [prefix + 'ArrivalDate']: segment.arrival.date,
    [prefix + 'ArrivalTime']: segment.arrival.time,
    [prefix + 'ArrivalCode']: segment.arrival.code,
    [prefix + 'ArrivalCity']: segment.arrival.city,
    [prefix + 'ArrivalAirport']: segment.arrival.airport,
    [prefix + 'ArrivalTerminal']: segment.arrival.terminal,
    [prefix + 'CabinClass']: segment.cabinClass,
    [prefix + 'FlightNo']: segment.flightNo,
    [prefix + 'Baggage']: segment.baggage
  };
}

function commonText(payload) {
  return {
    pnr: payload.pnr,
    idNo: payload.idNo,
    issueDate: payload.issueDate,
    status: payload.status,
    portalUrl: payload.portalUrl,
    contactAddressText: payload.contactAddress,
    contactWebsiteText: payload.contactWebsite,
    contactPhoneText: payload.contactPhone,
    thanksClientName: payload.clientName
  };
}

function expectedOneWayText(payload) {
  return Object.assign(
    commonText(payload),
    { firstSectionTitle: payload.firstSection.title },
    segmentText('firstSegment', payload.firstSection.segments[0])
  );
}

function sectionText(sectionKey, segmentPrefix, section) {
  return Object.assign(
    {
      [sectionKey + 'Title']: section.title,
      [sectionKey + 'Stopover']: section.stopover
    },
    segmentText(segmentPrefix + 'FirstSegment', section.segments[0]),
    segmentText(segmentPrefix + 'SecondSegment', section.segments[1])
  );
}

function expectedMultiText(payload) {
  return Object.assign(
    commonText(payload),
    sectionText('firstSection', 'firstSection', payload.firstSection),
    sectionText('secondSection', 'secondSection', payload.secondSection)
  );
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(label + ': expected `' + expected + '`, received `' + actual + '`.');
  }
}

async function verifyTemplate(browser, serverBaseUrl, templateCase) {
  const payload = readJson(templateCase.payload);
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  try {
    await page.goto(serverBaseUrl + '/' + templateCase.html, {
      waitUntil: 'networkidle'
    });
    await page.emulateMedia({ media: 'print' });

    const templateIdentity = await page.evaluate(function () {
      return {
        mode: window.ArgoTicketTemplate.mode,
        version: window.ArgoTicketTemplate.version
      };
    });
    assertEqual(templateIdentity.mode, templateCase.mode, templateCase.mode + ' mode');
    assertEqual(templateIdentity.version, '2.0.0', templateCase.mode + ' version');

    await page.evaluate(function (ticketPayload) {
      window.ArgoTicketTemplate.apply(ticketPayload);
    }, payload);

    const expectedText = templateCase.mode === 'multi'
      ? expectedMultiText(payload)
      : expectedOneWayText(payload);
    const renderedText = await page.evaluate(function (elementIds) {
      return elementIds.reduce(function (textById, elementId) {
        var element = document.getElementById(elementId);
        textById[elementId] = element ? element.textContent : null;
        return textById;
      }, {});
    }, Object.keys(expectedText));
    Object.keys(expectedText).forEach(function (elementId) {
      assertEqual(renderedText[elementId], expectedText[elementId], templateCase.mode + ' #' + elementId);
    });

    const layout = await page.evaluate(function () {
      const rootStyle = getComputedStyle(document.getElementById('argo-ticket-template'));
      const sheetBox = document.querySelector('.ticket-sheet').getBoundingClientRect();
      const visibleCards = Array.from(document.querySelectorAll('.ticket-card:not(.is-hidden)'));
      const cardBoxes = visibleCards.map(function (card) {
        const box = card.getBoundingClientRect();
        return { left: box.left, right: box.right, width: box.width };
      });
      return {
        pageWidth: rootStyle.getPropertyValue('--page-width').trim(),
        pageHeight: rootStyle.getPropertyValue('--page-height').trim(),
        cardCount: visibleCards.length,
        sheetLeft: sheetBox.left,
        sheetRight: sheetBox.right,
        cardBoxes: cardBoxes
      };
    });
    assertEqual(layout.pageWidth, '210mm', templateCase.mode + ' page width');
    assertEqual(layout.pageHeight, '297mm', templateCase.mode + ' page height');
    assertEqual(layout.cardCount, templateCase.cardCount, templateCase.mode + ' card count');
    layout.cardBoxes.forEach(function (cardBox) {
      if (Math.abs(cardBox.width - 718.109375) > 1) {
        throw new Error(templateCase.mode + ' ticket card width changed from the approved 190mm design.');
      }
      if (cardBox.left < layout.sheetLeft || cardBox.right > layout.sheetRight) {
        throw new Error(templateCase.mode + ' ticket card is outside the centered A4 sheet.');
      }
      const leftInset = cardBox.left - layout.sheetLeft;
      const rightInset = layout.sheetRight - cardBox.right;
      if (Math.abs(leftInset - rightInset) > 1) {
        throw new Error(templateCase.mode + ' ticket card is not horizontally centered.');
      }
    });

    const passengerRows = await page.locator('#passengerRows tr').count();
    assertEqual(passengerRows, payload.passengers.length, templateCase.mode + ' passenger rows');

    const capacityError = await page.evaluate(function (mode) {
      const segmentCount = mode === 'oneway' ? 2 : 3;
      const segments = Array.from({ length: segmentCount }, function () { return {}; });
      try {
        window.ArgoTicketTemplate.apply({ firstSection: { segments: segments } });
        return '';
      } catch (error) {
        return error.message;
      }
    }, templateCase.mode);
    if (!capacityError) {
      throw new Error(templateCase.mode + ' accepted more segments than the approved design capacity.');
    }
    console.log(templateCase.mode + ': dynamic fields and fixed A4 layout verified.');
  } finally {
    await page.close();
  }
}

async function verifyEmbedHelper(browser, serverBaseUrl) {
  const page = await browser.newPage();
  try {
    await page.goto(serverBaseUrl + '/ticket-template-a4-oneway.html', {
      waitUntil: 'networkidle'
    });
    await page.addScriptTag({ path: path.resolve('scripts/argo-ticket-embed.js') });
    await page.evaluate(function (basePath) {
      var mount = document.createElement('div');
      mount.id = 'embedVerification';
      document.body.appendChild(mount);
      window.embedVerification = window.ArgoTicketEmbed.mount({
        mount: mount,
        mode: 'oneway',
        basePath: basePath,
        data: { pnr: 'EMBED1' }
      });
    }, serverBaseUrl);

    const frameElement = await page.waitForSelector('#embedVerification iframe');
    const ticketFrame = await frameElement.contentFrame();
    await ticketFrame.waitForFunction(function () {
      return document.getElementById('pnr').textContent === 'EMBED1';
    });

    await page.evaluate(function () {
      window.embedVerification.apply({ pnr: 'EMBED2' });
    });
    await ticketFrame.waitForFunction(function () {
      return document.getElementById('pnr').textContent === 'EMBED2';
    });

    await page.evaluate(function () { window.embedVerification.destroy(); });
    assertEqual(await page.locator('#embedVerification iframe').count(), 0, 'iframe destroy');
    console.log('embed: mount, update, and destroy verified.');
  } finally {
    await page.close();
  }
}

(async function () {
  const projectServer = await startProjectServer();
  const browser = await chromium.launch({ headless: true });
  try {
    for (const templateCase of TEMPLATE_CASES) {
      await verifyTemplate(browser, projectServer.baseUrl, templateCase);
    }
    await verifyEmbedHelper(browser, projectServer.baseUrl);
  } finally {
    await browser.close();
    await projectServer.close();
  }
})().catch(function (error) {
  console.error(error.message);
  process.exitCode = 1;
});
