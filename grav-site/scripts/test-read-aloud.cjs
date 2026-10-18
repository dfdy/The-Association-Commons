const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
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
    assert(await page.evaluate(() => {
      const headings = [...document.querySelectorAll('.prose :is(h1,h2,h3,h4,h5,h6)')];
      return headings.every((heading, index) => {
        const title = heading.textContent.trim();
        const button = document.querySelectorAll('.tac-reader-controls')[index]?.querySelector('button');
        if (!button) return false;
        const group = button.parentElement;
        const next = headings[index + 1];
        const range = document.createRange();
        range.setStartAfter(group);
        if (next) {
          let boundary = next;
          while (boundary.parentNode !== document.querySelector('.prose') && !boundary.parentNode.contains(heading)) boundary = boundary.parentNode;
          range.setEndBefore(boundary);
        }
        else range.setEnd(document.querySelector('.prose'), document.querySelector('.prose').childNodes.length);
        const tail = range.cloneContents();
        tail.querySelectorAll('.tac-section-aside,.tac-reader-controls,.remember-panel__handle').forEach(node => node.remove());
        return !tail.textContent.trim() && Boolean(heading.compareDocumentPosition(group) & Node.DOCUMENT_POSITION_FOLLOWING);
      });
    }), 'Playback controls follow all content in their passage');
    const panel = page.locator('.remember-panel').first();
    const panelContent = panel.locator('.remember-panel__content');
    const panelControls = panelContent.locator('.tac-reader-controls');
    const panelToggle = panel.locator('.remember-panel__handle');
    assert.equal(await panelControls.count(), 1);
    assert(await panelControls.isVisible());
    await panelToggle.focus();
    await page.keyboard.press('Enter');
    assert.equal(await panelToggle.getAttribute('aria-expanded'), 'false');
    assert.equal(await panelControls.isVisible(), false);
    assert(await panelToggle.evaluate(e => e === document.activeElement));
    await page.keyboard.press('Enter');
    assert(await panelControls.isVisible());
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
    await page.getByRole('button', {name:'Read aloud: Keep fundamental decisions with members',exact:true}).click();
    assert((await page.evaluate(() => speechSynthesis.cancels)) > firstCount);
    const settings = page.getByRole('button', {name:'Read-aloud settings: Keep fundamental decisions with members',exact:true});
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
        if(document.querySelector('.tac-reader-status').textContent==='Reading: Make the constitution a working agreement') break;
      }
    });
    assert.equal(await page.getByRole('button',{name:'Read aloud: Begin with a shared purpose',exact:true}).count(),1);
    assert.equal(await page.getByRole('button',{name:'Pause: Make the constitution a working agreement',exact:true}).count(),1);
    assert.equal(await page.getByRole('heading',{name:'Make the constitution a working agreement',exact:true}).evaluate(e=>e.classList.contains('tac-reader-highlight')),true);
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
    await page.getByRole('button',{name:'Read aloud: Begin with a shared purpose',exact:true}).click();
    await page.keyboard.press('Alt+Shift+KeyP');
    assert.equal(await page.getByRole('button',{name:'Resume: Begin with a shared purpose',exact:true}).count(),1);
    await page.keyboard.press('Alt+Shift+KeyP');
    await page.keyboard.press('Alt+Shift+ArrowRight');
    assert.equal(await page.getByRole('button',{name:'Pause: Make the constitution a working agreement',exact:true}).count(),1);
    await page.keyboard.press('Alt+Shift+ArrowLeft');
    assert.equal(await page.getByRole('button',{name:'Pause: Begin with a shared purpose',exact:true}).count(),1);
    await page.keyboard.press('Alt+Shift+KeyX');
    assert.equal(await page.locator('.tac-reader-highlight').count(),0);
    await page.keyboard.press('Alt+Shift+KeyV');
    assert(await dialog.isVisible());
    assert.equal(await dialog.getByRole('heading',{name:'Keyboard shortcuts',exact:true}).count(),1);
    await page.getByLabel('Reading speed',{exact:true}).focus();
    const spokenBefore = await page.evaluate(()=>speechSynthesis.spoken.length);
    await page.keyboard.press('Alt+Shift+ArrowRight');
    assert.equal(await page.evaluate(()=>speechSynthesis.spoken.length),spokenBefore);
    await page.keyboard.press('Escape');
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
