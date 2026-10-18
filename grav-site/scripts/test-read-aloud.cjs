const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    await context.addInitScript(() => {
      const engine = new EventTarget();
      engine.voices = [];
      engine.spoken = [];
      engine.pauses = 0;
      engine.resumes = 0;
      engine.cancels = 0;
      engine.getVoices = () => engine.voices;
      engine.speak = u => {engine.current = u; engine.spoken.push({text:u.text,voice:u.voice?.voiceURI,rate:u.rate});};
      engine.pause = () => engine.pauses++;
      engine.resume = () => engine.resumes++;
      engine.cancel = () => engine.cancels++;
      Object.defineProperty(window, 'speechSynthesis', {value:engine});
      window.SpeechSynthesisUtterance = class {constructor(text) {this.text = text;}};
    });
    const page = await context.newPage();
    const base = process.env.GRAV_URL || 'http://localhost:8388';
    await page.goto(base + '/en');
    assert.equal(await page.locator('.tac-reader-controls').count(), await page.locator('.prose :is(h1,h2,h3,h4,h5,h6)').count());
    assert.equal(await page.locator('.tac-reader-dialog').count(), 1);
    assert.equal(await page.evaluate(() => speechSynthesis.spoken.length), 0);
    const play = page.getByRole('button', {name:'Read aloud: Begin with a shared purpose',exact:true});
    await play.click();
    assert((await page.evaluate(() => speechSynthesis.spoken[0].text)).includes('Begin with a shared purpose'));
    await page.getByRole('button', {name:'Pause: Begin with a shared purpose',exact:true}).click();
    assert.equal(await page.evaluate(() => speechSynthesis.pauses), 1);
    await page.getByRole('button', {name:'Resume: Begin with a shared purpose',exact:true}).click();
    assert(await page.evaluate(() => speechSynthesis.resumes >= 2));
    const firstCount = await page.evaluate(() => speechSynthesis.cancels);
    await page.getByRole('button', {name:'Read aloud: Keep participation voluntary',exact:true}).click();
    assert((await page.evaluate(() => speechSynthesis.cancels)) > firstCount);
    const settings = page.getByRole('button', {name:'Read-aloud settings: Keep participation voluntary',exact:true});
    await settings.click();
    const dialog = page.getByRole('dialog', {name:'Read-aloud settings',exact:true});
    await dialog.waitFor({state:'visible'});
    await page.evaluate(() => {
      speechSynthesis.voices = [{voiceURI:'test-en',name:'English test',lang:'en-ZA',localService:true}, {voiceURI:'test-zu',name:'isiZulu test',lang:'zu-ZA',localService:false}];
      speechSynthesis.dispatchEvent(new Event('voiceschanged'));
    });
    await page.getByLabel('Voice', {exact:true}).selectOption('test-en');
    await page.getByLabel('Reading speed', {exact:true}).selectOption('1.25');
    await page.keyboard.press('Escape');
    assert(await settings.evaluate(e => document.activeElement === e));
    const cookie = (await context.cookies()).find(c => c.name === 'tac_read_aloud');
    assert.deepEqual(JSON.parse(decodeURIComponent(cookie.value)), {voice:'test-en',rate:1.25});
    assert.equal(cookie.sameSite,'Lax');
    assert.equal(cookie.path,'/');
    await page.getByRole('button', {name:'Read aloud: Begin with a shared purpose',exact:true}).click();
    assert.equal(await page.evaluate(() => speechSynthesis.spoken.at(-1).voice), 'test-en');
    assert.equal(await page.evaluate(() => speechSynthesis.spoken.at(-1).rate), 1.25);
    // Finish this passage and verify ownership transfers to the next heading.
    await page.evaluate(() => {
      for(let i=0;i<100;i++) {
        speechSynthesis.current.onend();
        if(document.querySelector('.tac-reader-status').textContent==='Reading: Make education a collective practice') break;
      }
    });
    assert.equal(await page.getByRole('button',{name:'Read aloud: Begin with a shared purpose',exact:true}).count(),1);
    assert.equal(await page.getByRole('button',{name:'Pause: Make education a collective practice',exact:true}).count(),1);
    assert.equal(await page.getByRole('heading',{name:'Make education a collective practice',exact:true}).evaluate(e=>e.classList.contains('tac-reader-highlight')),true);
    assert.equal(await page.getByRole('heading',{name:'Begin with a shared purpose',exact:true}).evaluate(e=>e.classList.contains('tac-reader-highlight')),false);
    const finalTitle = await page.locator('.prose :is(h1,h2,h3,h4,h5,h6)').last().textContent();
    await page.getByRole('button',{name:'Read aloud: '+finalTitle.trim(),exact:true}).click();
    await page.evaluate(() => {
      for(let i=0;i<100;i++) {
        speechSynthesis.current.onend();
        if(document.querySelector('.tac-reader-status').textContent==='Reading finished.') break;
      }
    });
    assert.equal(await page.locator('.tac-reader-highlight').count(),0);
    assert.equal(await page.locator('.tac-reader-status').textContent(),'Reading finished.');
    await page.reload();
    await page.getByRole('button', {name:'Read-aloud settings: Accountability',exact:true}).first().click();
    assert.equal(await page.getByLabel('Reading speed', {exact:true}).inputValue(),'1.25');
    await page.getByRole('button',{name:'Done',exact:true}).click();
    await page.getByRole('button',{name:'Read aloud: Begin with a shared purpose',exact:true}).click();
    await page.evaluate(() => speechSynthesis.current.onerror({error:'synthesis-failed'}));
    assert.equal(await page.getByRole('button',{name:'Read aloud: Begin with a shared purpose',exact:true}).count(),1);
    assert((await page.locator('.tac-reader-status').textContent()).includes('could not continue'));
    await page.setViewportSize({width:320,height:800});
    await settings.click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.keyboard.press('Escape');
    const markdown = await (await page.request.get(base + '/en?download=md')).text();
    assert(!markdown.includes('tac-reader-controls'));
    await page.goto(base + '/zu');
    assert((await page.locator('.tac-reader-controls').count()) > 0);
    const noJS = await browser.newContext({javaScriptEnabled:false});
    const plain = await noJS.newPage();
    await plain.goto(base + '/en');
    assert.equal(await plain.locator('.tac-reader-controls').count(),0);
    const unsupported = await browser.newContext();
    await unsupported.addInitScript(() => Object.defineProperty(window,'speechSynthesis',{value:undefined}));
    const fallback = await unsupported.newPage();
    await fallback.goto(base + '/en');
    assert.equal(await fallback.locator('.tac-reader-controls').count(),0);
    assert.equal(await fallback.getByRole('heading',{name:'The freedom to organise.',exact:true}).count(),1);
    console.log('PASS: heading controls, shared modal, async voices, pause/resume, section switching, completion, error recovery, cookie persistence, focus restoration, mobile, languages, exports and unsupported/no-JS fallback. Speech engine simulated; audible playback not tested.');
  } finally {await browser.close();}
})().catch(error => {console.error(error);process.exitCode = 1;});
