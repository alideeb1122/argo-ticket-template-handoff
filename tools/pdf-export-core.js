const fs = require('fs');
const path = require('path');

const TEMPLATE_FILE_BY_MODE = {
  multi: 'ticket-template-a4.html',
  oneway: 'ticket-template-a4-oneway.html'
};

function getPdfPageCount(pdfPath) {
  const pdfSource = fs.readFileSync(pdfPath, 'latin1');
  const countMatch = pdfSource.match(/\/Type\s*\/Pages[\s\S]*?\/Count\s+(\d+)/);
  return countMatch ? Number(countMatch[1]) : NaN;
}

function getTemplatePath(mode) {
  const templateFile = TEMPLATE_FILE_BY_MODE[mode];
  if (!templateFile) throw new Error('PDF mode must be `multi` or `oneway`.');
  return path.resolve(templateFile);
}

async function waitForTemplateAssets(page) {
  await page.evaluate(async function () {
    await document.fonts.ready;
    const images = Array.from(document.images);
    await Promise.all(images.map(function (image) {
      if (image.complete) return Promise.resolve();
      return new Promise(function (resolve) {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      });
    }));
  });

  const brokenSources = await page.evaluate(function () {
    return Array.from(document.images)
      .filter(function (image) { return image.naturalWidth === 0; })
      .map(function (image) { return image.src; });
  });
  if (brokenSources.length) {
    throw new Error('PDF export stopped because image assets failed: ' + brokenSources.join(', '));
  }
}

async function exportTicketPdf(options) {
  const templatePath = getTemplatePath(options.mode);
  const outputPath = path.resolve(options.outputPath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const page = await options.browser.newPage({ viewport: { width: 1600, height: 2200 } });
  try {
    await page.goto('file://' + templatePath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
    if (options.payload) {
      await page.evaluate(function (ticketPayload) {
        window.ArgoTicketTemplate.apply(ticketPayload);
      }, options.payload);
    }
    await waitForTemplateAssets(page);
    await page.emulateMedia({ media: 'print' });
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    });
  } finally {
    await page.close();
  }

  const pageCount = getPdfPageCount(outputPath);
  if (pageCount !== 1) {
    throw new Error(outputPath + ' exported with ' + pageCount + ' pages; expected one A4 page.');
  }
  return { outputPath, pageCount };
}

module.exports = {
  exportTicketPdf,
  getPdfPageCount,
  getTemplatePath
};
