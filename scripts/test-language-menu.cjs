const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const base = process.env.GRAV_URL || 'http://localhost:8388';
    await page.goto(base + '/en');
    const history = () => page.evaluate(() => JSON.parse(decodeURIComponent(document.cookie.split('; ').find(c => c.startsWith('va_language_menu=')).split('=')[1])));
    const links = page.locator('[data-language-menu] a');
    assert.equal(await links.count(), 13);
    const labels = await links.allTextContents();
    assert.deepEqual(labels, [...labels].sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase())));
    await page.evaluate(() => {
      const menu = document.querySelector('[data-language-menu]');
      // Exercise real click handlers without navigating away after each event.
      menu.addEventListener('click', event => event.preventDefault());
      for (let i = 0; i < 60; i++) menu.querySelector(`[data-language="${i < 50 ? 'en' : 'af'}"]`).click();
    });
    assert.deepEqual(await history(), [...Array(40).fill('en'), ...Array(10).fill('af')]);
    assert.equal(await page.locator('[data-language="en"]').evaluate(a => a.style.backgroundColor), 'rgb(140, 161, 139)');
    assert.equal(await page.locator('[data-language="af"]').evaluate(a => a.style.backgroundColor), 'rgb(196, 206, 189)');
    assert.equal(await page.locator('[data-language="zu"]').evaluate(a => a.style.backgroundColor), 'rgb(233, 236, 223)');
    await page.goto(base + '/af');
    assert.equal((await history()).length, 50);
    assert.equal(await page.locator('[data-language="en"]').evaluate(a => a.style.backgroundColor), 'rgb(140, 161, 139)');
    const target = page.getByRole('link', {name: 'isiXhosa', exact: true});
    await target.focus();
    await Promise.all([page.waitForURL('**/xh'), page.keyboard.press('Enter')]);
    assert.equal((await history()).at(-1), 'xh');
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({width, height: 900});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await links.evaluateAll(items => items.every(a => a.getBoundingClientRect().height >= (innerWidth <= 700 ? 44 : 32))), true);
    }
    await context.addCookies([{name:'va_language_menu',value:'invalid-json',url:base}]);
    await page.reload();
    assert.equal(await page.locator('[data-language="en"]').evaluate(a => a.style.backgroundColor), 'rgb(233, 236, 223)');
    const noJS = await browser.newContext({javaScriptEnabled:false});
    const plain = await noJS.newPage();
    await plain.goto(base + '/en');
    assert.equal(await plain.getByRole('link', {name:'isiXhosa',exact:true}).getAttribute('href'), '/xh');
    console.log('PASS: alphabetical pills, bounded click history, proportional capped shading, persistence, keyboard navigation, mobile, malformed cookie and no-JS links.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
