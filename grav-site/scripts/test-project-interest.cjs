const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
  const base = process.env.GRAV_URL || 'http://localhost:8388';
  const saved = [];
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    assert.equal((await page.goto(base+'/en')).status(),200);
    const form = page.getByRole('form',{name:'Express interest in the project',exact:true});
    assert.equal(await form.count(),1);
    assert(await form.evaluate(e=>e.closest('.tac-section').querySelector('h2').textContent==='Join.'));
    const fields = await form.evaluate(e=>Object.fromEntries(new FormData(e)));
    let response = await page.request.post(base+'/en',{form:{...fields,nonce:'invalid'},headers:{Accept:'application/json'}});
    assert.equal(response.status(),403);
    response = await page.request.post(base+'/en',{form:{...fields,name:'Test',email:'check@example.invalid',consent:'yes'},headers:{Accept:'application/json',Origin:'https://example.invalid'}});
    assert.equal(response.status(),403);
    await form.getByRole('button',{name:'Express interest',exact:true}).click();
    await form.locator('.interest-errors').waitFor({state:'visible'});
    assert(await form.locator('.interest-errors').evaluate(e=>e===document.activeElement));
    assert.equal(await form.locator('[aria-invalid="true"]').count(),3);
    await form.locator('.interest-errors a').first().click();
    assert(await page.getByLabel('Name (required)',{exact:true}).evaluate(e=>e===document.activeElement));
    await page.getByLabel('Name (required)',{exact:true}).fill('Automated interest-form check');
    await page.getByLabel('Email address (required)',{exact:true}).fill('check@example.invalid');
    await page.getByLabel('How would you like to take part? (optional)',{exact:true}).fill('Synthetic test record; safe to delete.');
    await form.locator('[name=consent]').check();
    const retry = await form.evaluate(e=>Object.fromEntries(new FormData(e)));
    await form.getByRole('button',{name:'Express interest',exact:true}).click();
    await page.locator('.interest-status').filter({hasText:'Your interest has been recorded'}).waitFor();
    assert.equal(await form.isVisible(),false);
    saved.push(retry.form_id);
    response = await page.request.post(base+'/en',{form:retry,headers:{Accept:'application/json'}});
    assert.equal(response.status(),201);
    assert((await response.json()).success);
    for (const path of ['/user/data/commons-private/project-interest/'+retry.form_id+'.json','/user/plugins/project-interest/manage.php']) {
      response=await page.request.get(base+path);assert([403,404].includes(response.status()));
    }
    const md=await (await page.request.get(base+'/en?download=md')).text();
    assert(!md.includes('[project-interest /]'));assert(!md.includes('name="nonce"'));
    const plain=await browser.newContext({javaScriptEnabled:false});
    const nojs=await plain.newPage();await nojs.goto(base+'/en');
    const plainForm=nojs.getByRole('form',{name:'Express interest in the project',exact:true});
    const plainId=await plainForm.locator('[name=form_id]').inputValue();
    saved.push(plainId);
    await nojs.getByLabel('Name (required)',{exact:true}).fill('Automated no-JavaScript check');
    await nojs.getByLabel('Email address (required)',{exact:true}).fill('nojs@example.invalid');
    await plainForm.locator('[name=consent]').check();
    await Promise.all([nojs.waitForURL('**/en#project-interest'),plainForm.getByRole('button',{name:'Express interest',exact:true}).click()]);
    assert((await nojs.locator('.interest-status').textContent()).includes('Your interest has been recorded'));
    await page.goto(base+'/en');
    await page.setViewportSize({width:320,height:800});
    await page.evaluate(()=>{document.documentElement.style.fontSize='400%';document.documentElement.dataset.largeText='true'});
    assert(await page.locator('.project-interest').evaluate(e=>e.scrollWidth<=e.clientWidth));
    await page.emulateMedia({forcedColors:'active'});
    await page.getByLabel('Name (required)',{exact:true}).focus();
    assert(await page.getByLabel('Name (required)',{exact:true}).evaluate(e=>e===document.activeElement));
    await page.goto(base+'/zu');assert.equal(await page.locator('.project-interest').count(),1);
    console.log('PASS: Join placement; CSRF/cross-origin rejection; accessible validation/focus; private saving; retry idempotency; no-JS submission; storage protection; export; 400% form layout; translated proposal placement.');
  } finally {
    if (process.env.INTEREST_TEST_IDS) fs.writeFileSync(process.env.INTEREST_TEST_IDS,JSON.stringify(saved));
    await browser.close();
  }
})().catch(e=>{console.error(e);process.exitCode=1});
