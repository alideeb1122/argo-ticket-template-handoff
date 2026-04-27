const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const tasks = [
  {
    html: 'ticket-template-a4.html',
    pdf: 'ticket-template-a4-final.pdf'
  },
  {
    html: 'ticket-template-a4-oneway.html',
    pdf: 'ticket-template-a4-oneway-final.pdf'
  }
];

function getPdfPageCount(pdfPath) {
  const raw = fs.readFileSync(pdfPath, 'latin1');
  const countMatch = raw.match(/\/Type\s*\/Pages[\s\S]*?\/Count\s+(\d+)/);
  return countMatch ? Number(countMatch[1]) : NaN;
}

async function exportOne(page, htmlFile, pdfFile) {
  const htmlPath = path.resolve(htmlFile);
  const pdfPath = path.resolve(pdfFile);

  await page.goto('file://' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
  });

  const pageCount = getPdfPageCount(pdfPath);
  if (pageCount !== 1) {
    throw new Error(`${pdfFile} exported with ${pageCount} pages (expected 1).`);
  }

  return { pdfPath, pageCount };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 2200 } });

  try {
    for (const task of tasks) {
      const result = await exportOne(page, task.html, task.pdf);
      console.log(`${result.pdfPath} -> pages: ${result.pageCount}`);
    }
  } finally {
    await browser.close();
  }
})();
