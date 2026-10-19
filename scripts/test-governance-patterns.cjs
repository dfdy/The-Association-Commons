const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
  const base = process.env.GRAV_URL || 'http://localhost:8388';
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    assert.equal((await page.goto(base+'/en/governance-patterns')).status(), 200);
    await page.locator('.legal-matrix-filters').waitFor({state:'visible'});
    assert.equal(await page.locator('.legal-matrix-record').count(), 7);
    assert.equal(await page.locator('.tac-translation-notice').count(), 0);
    const search = page.getByRole('searchbox', {name:'Search the index',exact:true});
    await search.fill('hardship');
    assert((await page.locator('#pattern-status').textContent()).startsWith('1 of 7'));
    await page.getByRole('button', {name:'Reset filters',exact:true}).click();
    assert(await search.evaluate(e => e===document.activeElement));
    await page.getByRole('combobox',{name:'Category',exact:true}).selectOption('federation');
    assert((await page.locator('#pattern-status').textContent()).startsWith('1 of 7'));
    await page.getByRole('combobox',{name:'Testing status',exact:true}).selectOption('tested');
    assert((await page.locator('#pattern-status').textContent()).startsWith('0 of 7'));
    await page.getByRole('button', {name:'Reset filters',exact:true}).click();
    await page.getByRole('link',{name:'Confidential hardship adjustments',exact:true}).click();
    const record = page.locator('#pattern-record-hardship-adjustments');
    await page.locator('#pattern-record-hardship-adjustments[open]').waitFor({state:'attached'});
    assert(await record.evaluate(e => e.open));
    assert(await record.locator('summary').evaluate(e => e===document.activeElement));
    await page.keyboard.press('Space');
    assert.equal(await record.evaluate(e => e.open), false);
    await page.keyboard.press('Enter');
    assert(await record.evaluate(e => e.open));
    await page.reload();
    assert(await record.evaluate(e => e.open));
    const data = await (await page.request.get(base+'/en/governance-patterns?download=json')).json();
    assert.equal(data.patterns.length, 7);
    assert(data.patterns.every(p => !p.generator_ready && p.testing_status==='untested_draft' && !p.test_evidence.length));
    const schema = await (await page.request.get(base+'/en/governance-patterns?download=schema')).json();
    assert.equal(schema.properties.schema_version.const,data.schema_version);
    for (const format of ['md','rtf','pdf']) {
      const response = await page.request.get(base+'/en/governance-patterns?download='+format);
      assert.equal(response.status(),200);
      const text = (await response.body()).toString();
      if (format==='md') {assert(text.includes('When unsuitable')); assert(text.includes('Confidential hardship adjustments')); assert(!text.includes('[governance-patterns /]'));}
      else assert(text.startsWith(format==='pdf'?'%PDF-':'{\\rtf'));
    }
    await page.setViewportSize({width:320,height:800});
    await page.evaluate(() => document.documentElement.style.fontSize='200%');
    assert(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth));
    await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});
    await search.focus(); assert(await search.evaluate(e=>e===document.activeElement));
    await page.goto(base+'/zu');
    const footer = page.locator('footer').getByRole('link',{name:'Governance patterns',exact:true});
    assert.equal(await footer.getAttribute('href'),'/en/governance-patterns');
    assert.equal(await footer.getAttribute('lang'),'en');
    const plain = await browser.newContext({javaScriptEnabled:false});
    const nojs = await plain.newPage();
    await nojs.goto(base+'/en/governance-patterns');
    assert.equal(await nojs.locator('#pattern-table tbody tr').count(),7);
    assert.equal(await nojs.locator('.legal-matrix-record').count(),7);
    assert.equal(await nojs.locator('.legal-matrix-filters').isVisible(),false);
    assert.deepEqual(errors,[]);
    console.log('PASS: seven draft patterns; filters; keyboard disclosure/focus; deep links; JSON/schema and document exports; 200% mobile layout; forced colours; footer; no-JS fallback.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
