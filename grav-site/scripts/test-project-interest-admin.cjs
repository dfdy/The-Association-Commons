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
 execFileSync('docker',['cp',path.join(__dirname,'fixtures/project-interest-admin.php'),container+':'+fixtureScript]);
 const run=action=>execFileSync('docker',['exec','-i','--user','www-data',container,'php',fixtureScript],{input:JSON.stringify({...fixture,action}),stdio:['pipe','pipe','pipe']});
 let browser;
 try{
  run('create');browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
  const context=await browser.newContext();const page=await context.newPage();
  const api='/api/v1/project-interest/submissions';
  assert.equal((await page.request.get(base+api)).status(),401);
  const token=async user=>{const response=await page.request.post(base+'/api/v1/auth/token',{data:{username:user.name,password:user.password}});assert.equal(response.status(),200);return(await response.json()).data.access_token;};
  const admin=await token(users[0]),editor=await token(users[1]);
  const editorHeaders={Authorization:'Bearer '+editor};
  assert.equal((await page.request.get(base+api,{headers:editorHeaders})).status(),403);
  assert.equal((await page.request.delete(base+api+'/'+fixture.record_id,{headers:editorHeaders})).status(),403);
  let sidebar=await(await page.request.get(base+'/api/v1/sidebar/items',{headers:editorHeaders})).json();assert(!sidebar.data.some(i=>i.id==='project-interest'));
  const headers={Authorization:'Bearer '+admin};
  let response=await page.request.get(base+api+'?q=admin-fixture%40example.invalid',{headers});assert.equal(response.status(),200);assert(response.headers()['cache-control'].includes('no-store'));assert.equal((await response.json()).data.records.length,1);
  // Cached API routes must still autoload the custom controller on later requests.
  assert.equal((await page.request.get(base+api,{headers})).status(),200);
  sidebar=await(await page.request.get(base+'/api/v1/sidebar/items',{headers})).json();assert(sidebar.data.some(i=>i.id==='project-interest'));
  const definition=await(await page.request.get(base+'/api/v1/gpm/plugins/project-interest/page',{headers})).json();assert.equal(definition.data.page_type,'component');
  const script=await page.request.get(base+'/api/v1/gpm/plugins/project-interest/page-script',{headers});assert.equal(script.status(),200);
  await page.goto(base+'/en');
  await page.evaluate(({admin})=>{window.__GRAV_API_TOKEN=admin;window.__GRAV_API_PREFIX='/api/v1';window.__GRAV_API_SERVER_URL='';window.__GRAV_PAGE_TAG='grav-project-interest--page';}, {admin});
  await page.addScriptTag({content:await script.text()});
  await page.evaluate(()=>{const host=document.createElement('grav-project-interest--page');document.querySelector('main').replaceChildren(host);});
  const root=page.locator('.interest-admin');await root.locator('details').first().waitFor();
  assert.equal(await root.locator('img').count(),0);
  const record=root.locator('details').filter({hasText:'admin-fixture@example.invalid'});await record.locator('summary').click();
  for(const value of ['Synthetic group','Synthetic backend review test','2026-10-18'])assert((await record.textContent()).includes(value));
  if(process.env.AXE_SCRIPT){await page.addScriptTag({path:process.env.AXE_SCRIPT});const results=await page.evaluate(()=>axe.run('.interest-admin',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));assert.equal(results.violations.length,0,JSON.stringify(results.violations.map(v=>v.id)));console.log('PASS: automated admin-component accessibility check; manual review remains.');}
  await record.getByRole('button',{name:/Delete submission from/}).click();await root.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');assert(await record.getByRole('button',{name:/Delete submission from/}).evaluate(e=>e===document.activeElement));
  await record.getByRole('button',{name:/Delete submission from/}).click();await root.getByRole('dialog').getByRole('button',{name:'Delete submission',exact:true}).click();
  await page.waitForFunction(id=>![...document.querySelectorAll('.interest-admin dd')].some(e=>e.textContent===id),fixture.record_id);
  response=await page.request.get(base+api+'?q=admin-fixture%40example.invalid',{headers});assert.equal((await response.json()).data.records.length,0);
  console.log('PASS: anonymous/editor denial; super-admin list/search/delete; private caching; cached-route autoload; admin sidebar/page; escaped record fields; keyboard delete/cancel focus.');
 }finally{if(browser)await browser.close();run('cleanup');}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
