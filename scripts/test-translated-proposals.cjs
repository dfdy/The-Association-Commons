const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const base=process.env.GRAV_URL||'http://localhost:8388';const container=process.env.GRAV_CONTAINER||'association-commons-grav-grav-1';
 const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});const saved=[];
 try {
  const page=await browser.newPage();
  for(const code of ['af','af-x-kaaps','nr','nso','ss','st','tn','ts','ve','xh','zu']) {
   for(const suffix of ['','/stadgar','/donate']) {
    assert.equal((await page.goto(base+'/'+code+suffix)).status(),200);
    const notice=page.locator('.tac-translation-notice');assert.equal(await notice.count(),1);
    assert.equal(await notice.locator('a').first().getAttribute('href'),'/en'+suffix);
    assert(!/DDC\d+|⟦|⟧|⟬|⟭/.test(await page.locator('main').textContent()));
    if(suffix)continue;
    const root=page.locator('.project-interest');const form=root.locator('form');assert.equal(await form.count(),1);assert.equal(await root.getAttribute('lang'),code);
    assert.notEqual(await root.locator('label[for=interest-name]').textContent(),'Name (required)');
    for(const id of ['name','email','organisation','message','consent'])assert(await root.locator('#interest-'+id).getAttribute('aria-describedby'));
    const md=await(await page.request.get(base+'/'+code+'?download=md')).text();assert(md.includes('/'+code+'#project-interest'));assert(!md.includes('[project-interest /]'));assert(!md.includes('name="nonce"'));
    if(process.env.AXE_SCRIPT) {await page.addScriptTag({path:process.env.AXE_SCRIPT});const result=await page.evaluate(()=>axe.run('.project-interest',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.equal(result.violations.length,0,code+': '+JSON.stringify(result.violations.map(v=>v.id)));}
   }
  }
  await page.goto(base+'/sasl');assert.equal(await page.locator('.project-interest').count(),1);assert.equal(await page.locator('.project-interest').getAttribute('lang'),'en');
  await page.goto(base+'/zu');const form=page.locator('.project-interest form');
  await form.locator('button[type=submit]').click();await form.locator('.interest-errors').waitFor({state:'visible'});
  assert(await form.locator('.interest-errors').evaluate(e=>e===document.activeElement));assert.notEqual(await page.locator('#interest-name-error').textContent(),'Enter your name.');
  await page.locator('#interest-name').fill('Synthetic translated form check');await page.locator('#interest-email').fill('translated-test@example.invalid');await page.locator('#interest-consent').check();const id=await form.locator('[name=form_id]').inputValue();saved.push(id);
  await form.locator('button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('.project-interest form').hidden);
  const record=JSON.parse(execFileSync('docker',['exec','--user','www-data',container,'php','user/plugins/project-interest/manage.php','show',id],{encoding:'utf8'}));assert.equal(record.language_code,'zu');assert.equal(record.source_route,'/zu');
  const nojs=await browser.newContext({javaScriptEnabled:false});const plain=await nojs.newPage();await plain.goto(base+'/af');const native=plain.locator('.project-interest form');const fields=await native.evaluate(e=>Object.fromEntries(new FormData(e)));
  const wrongRoute=await plain.request.post(base+'/zu',{form:{...fields,name:'Synthetic check',email:'translated-test@example.invalid',consent:'yes'},headers:{Accept:'application/json'}});assert.equal(wrongRoute.status(),403);
  await plain.locator('#interest-name').fill('Synthetic native translated check');await plain.locator('#interest-email').fill('translated-native@example.invalid');await plain.locator('#interest-consent').check();saved.push(fields.form_id);
  await native.locator('button[type=submit]').click();assert.equal(await plain.locator('.project-interest form').count(),0);assert((await plain.locator('.interest-status').textContent()).trim());
  console.log('PASS: all 33 translated pages, notices/canonical links, localized forms, labels, errors/focus, private language/source metadata, cross-route rejection, no-JS submission, exports, SASL English form placement, and automated form accessibility.');
 } finally {
  await browser.close();for(const id of saved)execFileSync('docker',['exec','--user','www-data',container,'php','user/plugins/project-interest/manage.php','delete',id],{stdio:'pipe'});
 }
})().catch(e=>{console.error(e.stack);process.exitCode=1});
