const { chromium } = require('playwright');
const { exportTicketPdf } = require('./pdf-export-core');

const exportsToCreate = [
  { mode: 'multi', outputPath: 'ticket-template-a4-final.pdf' },
  { mode: 'oneway', outputPath: 'ticket-template-a4-oneway-final.pdf' }
];

(async function () {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const pdfExport of exportsToCreate) {
      const exported = await exportTicketPdf({ browser, ...pdfExport });
      console.log(exported.outputPath + ' -> pages: ' + exported.pageCount);
    }
  } finally {
    await browser.close();
  }
})().catch(function (error) {
  console.error(error.message);
  process.exitCode = 1;
});
