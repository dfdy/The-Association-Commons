const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
  const base = process.env.GRAV_URL || 'http://localhost:8388';
  const output = process.env.PDF_ARTIFACT_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'ddc-pdf-check-'));
  fs.mkdirSync(output, {recursive: true});
  try {
    const context = await browser.newContext({colorScheme: 'dark'});
    const page = await context.newPage();
    await page.goto(base + '/en');
    const link = page.getByRole('link', {name: 'Download PDF', exact: true});
    assert.equal(new URL(await link.getAttribute('href'), base).searchParams.get('pdf_theme'), 'night', 'System dark mode is carried without a saved cookie');
    assert.equal((await context.cookies()).some(cookie => cookie.name === 'tac-colour-mode'), false);
    await link.focus();
    assert(await link.evaluate(element => element === document.activeElement));
    const download = page.waitForEvent('download');
    await page.keyboard.press('Enter');
    await (await download).saveAs(path.join(output, 'framework-night.pdf'));
    await page.getByRole('button', {name: 'Night mode', exact: true}).click();
    assert.equal(new URL(await link.getAttribute('href'), base).searchParams.get('pdf_theme'), 'day');
    assert.equal(await page.getByRole('button', {name: 'Night mode', exact: true}).getAttribute('aria-pressed'), 'false');
    const light = await page.request.get(await link.getAttribute('href'), {timeout: 120000});
    assert.equal(light.status(), 200);
    assert.match(light.headers()['cache-control'], /no-store/);
    fs.writeFileSync(path.join(output, 'framework-day.pdf'), await light.body());
    for (const [route, file] of [['/zu', 'isizulu-night'], ['/en/white-paper', 'white-paper-night'], ['/en/legal-matrix', 'legal-matrix-night']]) {
      const response = await page.request.get(base + route + '?download=pdf&pdf_theme=night', {timeout: 120000});
      assert.equal(response.status(), 200, route);
      const body = await response.body();
      assert.equal(body.subarray(0, 5).toString(), '%PDF-');
      fs.writeFileSync(path.join(output, file + '.pdf'), body);
    }
    const fallback = await page.request.get(base + '/en/donate?download=pdf&pdf_theme[]=night', {timeout: 120000});
    assert.equal(fallback.status(), 200, 'Malformed theme input safely uses light');
    const hidden = await page.request.get(base + '/en/proposal-backup-2026-10-18?download=pdf');
    assert.equal(hidden.status(), 404);
    const native = await browser.newContext({javaScriptEnabled: false});
    await native.addCookies([{name:'tac-colour-mode', value:'night', url:base}]);
    const direct = await native.request.get(base + '/en/donate?download=pdf', {timeout: 120000});
    assert.equal(direct.status(), 200);
    fs.writeFileSync(path.join(output, 'cookie-night.pdf'), await direct.body());
    console.log('PASS: system and selected theme links, keyboard download, real PDFs, privacy headers, translated and research pages, malformed input, hidden-page protection, and no-JS cookie fallback. Artifacts: ' + output);
  } finally {
    await browser.close();
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
