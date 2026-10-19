const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
  const base = process.env.GRAV_URL || 'http://localhost:8388';
  try {
    const context = await browser.newContext();
    await context.addCookies([{name:'va_language_menu',value:encodeURIComponent(JSON.stringify([...Array(30).fill('en'),...Array(10).fill('af')])),url:base}]);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    assert.equal((await page.goto(base)).status(), 200);
    assert.equal(new URL(page.url()).pathname, '/');
    const dialog = page.getByRole('dialog', {name:'The Democratic Development Commons',exact:true});
    await dialog.waitFor({state:'visible'});
    assert(await dialog.evaluate(node => node.matches(':modal')));
    assert.equal(await page.locator('.prose').count(), 0, 'Root no longer renders the English framework');
    const links = dialog.locator('nav a');
    assert.equal(await links.count(), 13);
    const destinations = await links.evaluateAll(nodes => nodes.map(node => ({href:node.getAttribute('href'),text:node.textContent.trim()})));
    assert(destinations.some(item => item.href === '/en' && item.text === 'English'));
    assert(!destinations.some(item => item.href === '/'));
    assert.equal(await links.locator('.language-draft-icon').count(),12);
    assert.equal(await links.locator('.language-pending-icon').count(),1);
    assert.equal(await dialog.locator('#machine-translation-note .language-draft-icon').count(),1);
    assert.equal(await dialog.locator('[data-language="en"] .language-draft-icon').count(),0);
    assert.equal(await dialog.locator('[data-language="af-x-kaaps"] .language-draft-icon').count(),1);
    assert.equal(await dialog.locator('[data-language="sasl"]').getAttribute('aria-describedby'),'sasl-pending-note');
    assert.equal(await dialog.locator('[data-language="af"]').getAttribute('aria-describedby'),'machine-translation-note');
    assert.equal(await dialog.getByRole('link',{name:'adopt a language and work together on its translation',exact:true}).getAttribute('href'),'/en/contact');
    assert(await page.locator('#language-title').evaluate(node => node === document.activeElement));
    await page.keyboard.press('Tab');
    assert(await links.first().evaluate(node => node === document.activeElement));
    await dialog.locator('a').last().focus();
    await page.keyboard.press('Tab');
    assert(await links.first().evaluate(node => node === document.activeElement), 'Focus remains inside modal');
    await page.keyboard.press('Escape');
    assert(await dialog.isVisible());
    assert.equal(await page.locator('#close-languages,#open-languages,.landing-intro,.language-editions-note').count(),0);
    assert.equal(await links.first().evaluate(node => getComputedStyle(node).textDecorationLine),'none');
    assert.equal(await dialog.locator('[data-language="en"]').evaluate(node => getComputedStyle(node).backgroundColor),'rgb(140, 161, 139)');
    assert.equal(await dialog.locator('[data-language="zu"]').evaluate(node => getComputedStyle(node).backgroundColor),'rgb(233, 236, 223)');
    await page.mouse.click(0,0);
    assert(await dialog.isVisible(), 'Backdrop does not dismiss picker');
    if (process.env.AXE_SCRIPT) {
      await page.addScriptTag({path:process.env.AXE_SCRIPT});
      const results = await page.evaluate(() => axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
      assert.deepEqual(results.violations.map(item => item.id), []);
    }
    for (const item of destinations) {
      await page.goto(base + item.href);
      assert.equal(new URL(page.url()).pathname, item.href);
      assert.equal(await page.locator('.landing-language-list').count(), 0);
      assert.equal(await page.locator('.languages a').count(), 13);
    }
    for (const colour of ['day','night']) {
      await context.addCookies([{name:'tac-colour-mode',value:colour,url:base},{name:'ddc-text-size',value:'400',url:base}]);
      await page.setViewportSize({width:320,height:640});
      await page.goto(base);
      assert.equal(await page.locator('html').getAttribute('data-theme'),colour);
      assert(await dialog.isVisible());
      assert(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth + 1));
      await links.last().scrollIntoViewIfNeeded();
      assert(await links.last().isVisible());
    }
    const native = await browser.newContext({javaScriptEnabled:false});
    const plain = await native.newPage();
    await plain.goto(base);
    assert.equal(await plain.locator('.landing-language-list a:visible').count(),13);
    await plain.getByRole('link',{name:'English',exact:true}).click();
    assert.equal(new URL(plain.url()).pathname,'/en');
    assert(await plain.locator('.prose').isVisible());
    assert.deepEqual(errors, []);
    console.log('PASS: persistent root picker, English-only /en route, 13 language destinations, modal name/focus, Escape/backdrop dismissal blocked, keyboard wrapping, cookie-based shading, no underlines, narrow 400% layouts in both themes, no-JS navigation, and optional automated accessibility check. Screen-reader review remains outstanding.');
  } finally {await browser.close();}
})().catch(error => {console.error(error);process.exitCode = 1;});
