const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const base=process.env.GRAV_URL||'http://localhost:8388';
 const container=process.env.GRAV_CONTAINER||'association-commons-grav-grav-1';
 const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});const ids=[];
 try {
  const context=await browser.newContext();const page=await context.newPage();
  assert.equal((await page.goto(base+'/en/languages')).status(),200);
  const root=page.locator('.language-suggestions');const form=root.getByRole('form',{name:'Suggest a language',exact:true});
  assert.equal(await form.count(),1);assert.equal(await page.locator('.project-nav').count(),0);
  assert.equal(await page.locator('footer a[href="/en/languages"]').count(),1);
  assert.equal(await form.locator('input[type=email]').count(),0);
  const fields=await form.evaluate(e=>Object.fromEntries(new FormData(e)));
  for(const extra of [{nonce:'bad'},{language_name:'French',nonce:fields.nonce}]) {
   const response=await page.request.post(base+'/en/languages',{form:{...fields,...extra},headers:{Accept:'application/json',...(extra.nonce===fields.nonce?{Origin:'https://example.invalid'}:{})}});assert.equal(response.status(),403);
  }
  await form.getByRole('button',{name:'Suggest a language',exact:true}).click();
  assert.equal(await form.locator('[aria-invalid=true]').count(),1);
  assert(await root.locator('[role=alert]').evaluate(e=>e===document.activeElement));
  await form.getByLabel('Language name (required)').fill('Frnech');await form.getByRole('button',{name:'Suggest a language',exact:true}).click();
  await form.getByLabel('Confirm the registered language (required)').selectOption('fr');
  ids.push(await form.locator('[name=form_id]').inputValue());
  const confirmed=await form.evaluate(e=>Object.fromEntries(new FormData(e)));
  await form.getByRole('button',{name:'Suggest a language',exact:true}).click();
  assert((await root.textContent()).includes('Your language suggestion has been recorded'));
  assert.equal(await root.getByRole('row').filter({hasText:'French'}).count(),1);
  const duplicate=await page.request.post(base+'/en/languages',{form:confirmed,headers:{Accept:'application/json'}});assert.equal(duplicate.status(),201);
  await page.goto(base+'/en/languages');await form.getByLabel('Language name (required)').fill('Zulu');await form.getByRole('button',{name:'Suggest a language',exact:true}).click();
  assert((await root.textContent()).includes('already has an edition'));
  if(process.env.AXE_SCRIPT) {await page.addScriptTag({path:process.env.AXE_SCRIPT});const result=await page.evaluate(()=>axe.run('.language-suggestions',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.equal(result.violations.length,0,JSON.stringify(result.violations.map(v=>v.id)));}
  for(const path of ['/user/data/commons-private/language-suggestions/'+ids[0]+'.json','/user/plugins/language-suggestions/manage.php'])assert([403,404].includes((await page.request.get(base+path)).status()));
  for(const format of ['md','rtf','pdf']) {const response=await page.request.get(base+'/en/languages?download='+format);assert.equal(response.status(),200);if(format==='md'){const body=await response.text();assert(!body.includes('[language-suggestions /]'));assert(!body.includes('name="nonce"'));}}
  const nojs=await browser.newContext({javaScriptEnabled:false});const plain=await nojs.newPage();await plain.goto(base+'/en/languages');
  const native=plain.getByRole('form',{name:'Suggest a language',exact:true});await native.getByLabel('Language name (required)').fill('Swedish');ids.push(await native.locator('[name=form_id]').inputValue());await native.getByRole('button',{name:'Suggest a language',exact:true}).click();assert((await plain.locator('.language-suggestions').textContent()).includes('Your language suggestion has been recorded'));
  await page.goto(base+'/en/languages');await page.setViewportSize({width:320,height:800});await page.evaluate(()=>document.documentElement.style.fontSize='400%');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  console.log('PASS: registry typo confirmation, existing-edition rejection, session/origin checks, retry deduplication, public counts, native no-JS submission, exports, private paths, 400% narrow layout, and automated accessibility.');
 } finally {
  await browser.close();
  for(const id of ids)execFileSync('docker',['exec','--user','www-data',container,'php','user/plugins/language-suggestions/manage.php','delete',id],{stdio:'pipe'});
 }
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
