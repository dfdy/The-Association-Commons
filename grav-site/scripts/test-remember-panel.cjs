/* Run with a Playwright installation: PLAYWRIGHT_MODULE=/path/to/playwright node this-file */
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const url=process.env.GRAV_TEST_URL||'http://localhost:8388';
const languages=require('../migration-report.json').languages;
const key='association-commons:remember-panel:prefiguration';
const week=7*24*60*60*1000;
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.clock.install({time:new Date('2026-10-18T12:00:00Z')});
  for(const language of languages){
   await page.goto(url+'/'+language);
   const marked=page.locator('[data-remember-panel="prefiguration"]');
   assert.equal(await marked.count(),1,language+' needs one explicit Prefiguration panel');
   const toggle=marked.locator('button');await toggle.waitFor({state:'visible'});
   const prose=marked.locator('.remember-panel__content');
   assert.equal(await prose.locator('h2').count(),1);assert.equal(await prose.locator('p').count(),2);
   await toggle.click();assert.equal(await prose.isVisible(),false,language);
   await toggle.click();assert.equal(await prose.isVisible(),true,language);
  }
  await page.goto(url+'/en');
  const panel=page.locator('[data-remember-panel="prefiguration"]');
  const handle=panel.locator('button'),content=panel.locator('.remember-panel__content');
  await handle.waitFor({state:'visible'});
  assert.equal(await handle.getAttribute('aria-expanded'),'true');
  assert.match(await content.innerText(),/Prefigurative politics/);
  const beforeToggle=await page.evaluate(()=>Date.now());
  await handle.focus();await page.keyboard.press('Enter');
  assert.equal(await content.isVisible(),false);
  const first=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  assert.equal(first.open,false);
  const afterToggle=await page.evaluate(()=>Date.now());
  assert.ok(first.expiresAt>=beforeToggle+week && first.expiresAt<=afterToggle+week);
  await page.reload();await handle.waitFor({state:'visible'});
  assert.equal(await content.isVisible(),false);
  assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key),first);
  // Moving the explicitly marked block does not change its saved identity.
  await panel.evaluate(element=>element.parentElement.appendChild(element));
  assert.equal(await content.isVisible(),false);
  // Other tabs synchronize both open and closed manual choices.
  const other=await page.context().newPage();
  await other.clock.install({time:new Date(await page.evaluate(()=>Date.now()))});
  await other.goto(url+'/en');
  await other.locator('.remember-panel__handle').click();
  await content.waitFor({state:'visible'});
  const shown=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  assert.equal(shown.open,true);
  await page.reload();await handle.waitFor({state:'visible'});
  assert.equal(await content.isVisible(),true);
  assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key),shown);
  await other.locator('.remember-panel__handle').click();await content.waitFor({state:'hidden'});await other.close();
  // The same stable ID shares the preference across pages.
  await page.goto(url+'/sasl');await handle.waitFor({state:'visible'});
  assert.equal(await content.isVisible(),false);assert.match(await handle.innerText(),/Open/);
  await page.clock.fastForward(week+1);
  assert.equal(await content.isVisible(),true);
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),null);
  await handle.click();assert.equal(await content.isVisible(),false);
  await page.emulateMedia({media:'print'});
  assert.equal(await content.isVisible(),true);assert.equal(await handle.isVisible(),false);
  await page.emulateMedia({media:'screen'});
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:'/tmp/commons-remember-panel-mobile.png'});
  // A page opened after the deadline defaults to open without renewing the old choice.
  await page.evaluate(k=>localStorage.setItem(k,JSON.stringify({open:false,expiresAt:1})),key);
  await page.reload();await handle.waitFor({state:'visible'});assert.equal(await content.isVisible(),true);
  // Invalid storage and denied storage remain usable.
  await page.evaluate(k=>localStorage.setItem(k,'broken JSON'),key);await page.reload();
  await handle.waitFor({state:'visible'});assert.equal(await content.isVisible(),true);
  const denied=await browser.newContext();await denied.addInitScript(()=>{
   Storage.prototype.getItem=()=>{throw new Error('Storage blocked')};
   Storage.prototype.setItem=()=>{throw new Error('Storage blocked')};
  });
  const blocked=await denied.newPage();await blocked.goto(url+'/en');
  await blocked.locator('.remember-panel__handle').click();
  assert.equal(await blocked.locator('.remember-panel__content').isVisible(),false);await denied.close();
  const plain=await browser.newContext({javaScriptEnabled:false});const nojs=await plain.newPage();await nojs.goto(url+'/en');
  assert.equal(await nojs.locator('.remember-panel__content').isVisible(),true);
  assert.equal(await nojs.locator('.remember-panel__handle').isVisible(),false);await plain.close();
  for(const format of ['md','rtf','pdf']){
   const response=await page.request.get(url+'/en?download='+format);assert.equal(response.status(),200);
   const body=await response.body();
   if(format==='pdf')assert.equal(body.subarray(0,5).toString(),'%PDF-');
   else{assert.match(body.toString(),/Prefigurative politics/);assert.doesNotMatch(body.toString(),/\[\/?remember-panel/);}
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: all '+languages.length+' language pages, keyboard handle, movable blocks, cross-tab and remembered state, non-sliding expiry, live expiry, languages, print, mobile, invalid/blocked storage, no-JS fallback and exports.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
