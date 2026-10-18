const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const base=process.env.GRAV_URL||'http://localhost:8388';
 const container=process.env.GRAV_CONTAINER||'association-commons-grav-grav-1';
 const fixtureScript=process.env.INTEREST_ADMIN_FIXTURE||'/tmp/ddc-admin-test-fixture.php';
 const suffix=crypto.randomBytes(6).toString('hex');
 const users=['admin','editor'].map(role=>({name:'ddc-test-'+suffix+'-'+role,role,password:crypto.randomBytes(24).toString('hex')+'aA1!'}));
 const fixture={users,record_id:crypto.randomBytes(16).toString('hex')};
 execFileSync('docker',['cp',path.join(__dirname,'fixtures/language-suggestions-admin.php'),container+':'+fixtureScript]);
 const run=action=>execFileSync('docker',['exec','-i','--user','www-data',container,'php',fixtureScript],{input:JSON.stringify({...fixture,action}),stdio:['pipe','pipe','pipe']});
 let browser;
 try{
  run('create');browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
  const context=await browser.newContext();const page=await context.newPage();
  const api='/api/v1/language-suggestions/submissions';
  assert.equal((await page.request.get(base+api)).status(),401);
  const token=async user=>{const response=await page.request.post(base+'/api/v1/auth/token',{data:{username:user.name,password:user.password}});assert.equal(response.status(),200);return(await response.json()).data.access_token;};
  const admin=await token(users[0]),editor=await token(users[1]);
  const editorHeaders={Authorization:'Bearer '+editor};
  assert.equal((await page.request.get(base+api,{headers:editorHeaders})).status(),403);
  assert.equal((await page.request.delete(base+api+'/'+fixture.record_id,{headers:editorHeaders})).status(),403);
  let sidebar=await(await page.request.get(base+'/api/v1/sidebar/items',{headers:editorHeaders})).json();assert(!sidebar.data.some(i=>i.id==='language-suggestions'));
  const headers={Authorization:'Bearer '+admin};
  let response=await page.request.get(base+api+'?q=ddc-test',{headers});assert.equal(response.status(),200);assert(response.headers()['cache-control'].includes('no-store'));assert.equal((await response.json()).data.records.length,1);
  // Cached API routes must still autoload the custom controller on later requests.
  assert.equal((await page.request.get(base+api,{headers})).status(),200);
  sidebar=await(await page.request.get(base+'/api/v1/sidebar/items',{headers})).json();assert(sidebar.data.some(i=>i.id==='language-suggestions'));
  const definition=await(await page.request.get(base+'/api/v1/gpm/plugins/language-suggestions/page',{headers})).json();assert.equal(definition.data.page_type,'component');
  const script=await page.request.get(base+'/api/v1/gpm/plugins/language-suggestions/page-script',{headers});assert.equal(script.status(),200);
  await page.goto(base+'/en');
  await page.evaluate(({admin})=>{window.__GRAV_API_TOKEN=admin;window.__GRAV_API_PREFIX='/api/v1';window.__GRAV_API_SERVER_URL='';window.__GRAV_PAGE_TAG='grav-language-suggestions--page';}, {admin});
  await page.addScriptTag({content:await script.text()});
  await page.evaluate(()=>{const host=document.createElement('grav-language-suggestions--page');document.querySelector('main').replaceChildren(host);});
  const root=page.locator('.interest-admin');await root.locator('tbody tr').first().waitFor();
  assert.deepEqual(await root.locator('th').allTextContents(),['Date (UTC)','Language','Code','Entry']);
  assert.equal(await root.locator('img').count(),0);
  await root.getByRole('searchbox').fill('ddc-test');await root.getByRole('button',{name:'Search',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('.interest-admin tbody tr').length===1);
  assert.equal(await root.locator('time span').count(),1);
  assert((await root.locator('time span').textContent()).endsWith('UTC'));
  if(process.env.ADMIN_CSS)await page.addStyleTag({path:process.env.ADMIN_CSS});
  const row=root.locator('tbody tr').filter({hasText:'ddc-test'});
  await row.getByRole('link',{name:/Open submission/}).focus();await page.keyboard.press('Enter');
  const record=root.locator('.entry').filter({hasText:'ddc-test'});
  assert(await record.locator('h2').evaluate(e=>e===document.activeElement));
  const toggle=row.getByRole('link',{name:/Close submission/});
  assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  await toggle.focus();await page.keyboard.press('Enter');
  assert(await record.evaluate(e=>e.hidden));
  assert.equal(await row.getByRole('link',{name:/Open submission/}).getAttribute('aria-expanded'),'false');
  assert(await row.getByRole('link').evaluate(e=>e===document.activeElement));
  await row.getByRole('link').click();
  await record.getByRole('link',{name:'Back to submissions'}).click();
  assert(await row.getByRole('link').evaluate(e=>e===document.activeElement));
  await row.getByRole('link').click();
  for(const value of ['ddc-test','Automated <img'])assert((await record.textContent()).includes(value));
  if(process.env.AXE_SCRIPT){
   await page.addScriptTag({path:process.env.AXE_SCRIPT});
   for(const dark of [false,true]) {
    await page.evaluate(dark=>document.documentElement.classList.toggle('dark',dark),dark);
    const results=await page.evaluate(()=>axe.run('.interest-admin',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.equal(results.violations.length,0,JSON.stringify(results.violations.map(v=>v.id)));
    if(process.env.ADMIN_SCREENSHOT)await root.screenshot({path:process.env.ADMIN_SCREENSHOT+(dark?'-dark.png':'-light.png')});
   }
   console.log('PASS: automated admin-component accessibility in light/dark; manual review remains.');
  }
  await page.setViewportSize({width:320,height:800});
  assert(await root.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  await page.setViewportSize({width:1280,height:900});
  await record.getByRole('button',{name:/Delete submission from/}).click();await root.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');assert(await record.getByRole('button',{name:/Delete submission from/}).evaluate(e=>e===document.activeElement));
  await record.getByRole('button',{name:/Delete submission from/}).click();await root.getByRole('dialog').getByRole('button',{name:'Delete submission',exact:true}).click();
  await page.waitForFunction(id=>![...document.querySelectorAll('.interest-admin dd')].some(e=>e.textContent===id),fixture.record_id);
  response=await page.request.get(base+api+'?q=ddc-test',{headers});assert.equal((await response.json()).data.records.length,0);
  console.log('PASS: anonymous/editor denial; super-admin list/search/delete; private caching; cached-route autoload; admin sidebar/page; escaped record fields; keyboard delete/cancel focus.');
 }finally{if(browser)await browser.close();run('cleanup');}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
