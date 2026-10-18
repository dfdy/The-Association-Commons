const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
  const base = process.env.GRAV_URL || 'http://localhost:8388';
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(base + '/en/legal-matrix');
    assert.equal(response.status(), 200);
    await page.locator('.legal-matrix-filters').waitFor({state: 'visible'});
    assert.equal(await page.getByRole('heading', {name: 'Legal matrix', exact: true}).count(), 1);
    assert.equal(await page.locator('.legal-matrix-record').count(), 16);
    assert.equal(await page.locator('#legal-table-map tbody tr').count(), 15);
    assert.equal(await page.locator('#legal-table-reforms tbody tr').count(), 1);
    assert.equal(await page.locator('.tac-translation-notice').count(), 0);
    const search = page.getByRole('searchbox', {name: 'Search the indexes'});
    await search.fill('stokvel');
    await page.getByRole('status').filter({hasText: '1 of 16 records'}).waitFor();
    assert.equal(await page.locator('#legal-table-map tbody tr:not(.dt-empty)').count(), 1);
    await page.getByRole('button', {name: 'Reset filters', exact: true}).click();
    assert(await search.evaluate(element => element === document.activeElement));
    await page.getByRole('combobox', {name: 'Legal status', exact: true}).selectOption('proposed');
    assert((await page.locator('#legal-matrix-status').textContent()).startsWith('1 of 16'));
    await page.getByRole('combobox', {name: 'Provision type', exact: true}).selectOption('democratic_choice');
    assert((await page.locator('#legal-matrix-status').textContent()).startsWith('0 of 16'));
    await page.getByRole('button', {name: 'Reset filters', exact: true}).click();
    await page.getByRole('link', {name: 'Constitutional personality choices', exact: true}).click();
    const detail = page.locator('#legal-record-common-law-personality');
    assert(await detail.evaluate(element => element.open));
    assert(await detail.locator('summary').evaluate(element => element === document.activeElement));
    await page.keyboard.press('Space');
    assert.equal(await detail.evaluate(element => element.open), false);
    await page.keyboard.press('Enter');
    assert(await detail.evaluate(element => element.open));
    await page.reload();
    assert(await detail.evaluate(element => element.open));
    const dataResponse = await page.request.get(base + '/en/legal-matrix?download=json');
    assert.equal(dataResponse.status(), 200);
    const data = await dataResponse.json();
    assert.equal(data.records.length, 16);
    assert(data.records.every(record => !record.generator_ready && record.last_verified === null));
    const schema = await page.request.get(base + '/en/legal-matrix?download=schema');
    assert.equal((await schema.json()).properties.schema_version.const, data.schema_version);
    for (const format of ['md', 'rtf', 'pdf']) {
      const exported = await page.request.get(base + '/en/legal-matrix?download=' + format);
      assert.equal(exported.status(), 200);
      const body = await exported.body();
      if (format === 'md') {
        assert(body.toString().includes('Constitutional personality choices'));
        assert(!body.toString().includes('[legal-matrix /]'));
      } else assert(body.toString().startsWith(format === 'pdf' ? '%PDF-' : '{\\rtf'));
    }
    await page.setViewportSize({width: 320, height: 800});
    await page.evaluate(() => document.documentElement.style.fontSize = '200%');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.emulateMedia({forcedColors: 'active', reducedMotion: 'reduce'});
    await search.focus();
    assert(await search.evaluate(element => element === document.activeElement));
    await page.goto(base + '/zu');
    const footer = page.locator('footer').getByRole('link', {name: 'Legal matrix', exact: true});
    assert.equal(await footer.getAttribute('href'), '/en/legal-matrix');
    assert.equal(await footer.getAttribute('lang'), 'en');
    const plain = await browser.newContext({javaScriptEnabled: false});
    const nojs = await plain.newPage();
    await nojs.goto(base + '/en/legal-matrix');
    assert.equal(await nojs.locator('.legal-matrix-table tbody tr').count(), 16);
    assert.equal(await nojs.locator('.legal-matrix-filters').isVisible(), false);
    assert.equal(await nojs.locator('.legal-matrix-record').count(), 16);
    assert.deepEqual(errors, []);
    console.log('PASS: English matrix; separate reforms; search and intersecting filters; reset focus; keyboard disclosure; deep links; JSON/schema and document exports; 200% text at 320px; forced colours; footer; no-JS fallback. Screen-reader testing remains outstanding.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
