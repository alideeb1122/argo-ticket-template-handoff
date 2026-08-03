const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { exportTicketPdf } = require('./pdf-export-core');

function readOptions(commandLine) {
  const options = {};
  for (let index = 0; index < commandLine.length; index += 2) {
    const optionName = commandLine[index];
    const optionValue = commandLine[index + 1];
    if (!optionName || !optionName.startsWith('--') || optionValue == null) {
      throw new Error('Usage: --mode <multi|oneway> --data <payload.json> --output <ticket.pdf>');
    }
    options[optionName.slice(2)] = optionValue;
  }
  return options;
}

function readPayload(payloadPath) {
  const absolutePath = path.resolve(payloadPath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

(async function () {
  const options = readOptions(process.argv.slice(2));
  if (!options.mode || !options.data || !options.output) {
    throw new Error('Usage: --mode <multi|oneway> --data <payload.json> --output <ticket.pdf>');
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const exported = await exportTicketPdf({
      browser,
      mode: options.mode,
      payload: readPayload(options.data),
      outputPath: options.output
    });
    console.log(exported.outputPath + ' -> pages: ' + exported.pageCount);
  } finally {
    await browser.close();
  }
})().catch(function (error) {
  console.error(error.message);
  process.exitCode = 1;
});
