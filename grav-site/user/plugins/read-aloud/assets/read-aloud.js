(() => {
  'use strict';
  const article = document.querySelector('.prose');
  if (!article || !window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') return;
  const synth = window.speechSynthesis;
  const cookieName = 'tac_read_aloud';
  let settings = {voice: '', rate: 1};
  try {
    const raw = document.cookie.split('; ').find(c => c.startsWith(cookieName + '='));
    const saved = raw ? JSON.parse(decodeURIComponent(raw.slice(cookieName.length + 1))) : {};
    if (saved && typeof saved.voice === 'string' && saved.voice.length < 1000) settings.voice = saved.voice;
    if (saved && typeof saved.rate === 'number' && saved.rate >= 0.5 && saved.rate <= 2) settings.rate = saved.rate;
  } catch { /* Invalid or blocked cookies use browser defaults. */ }
  const save = () => {
    try {
      document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(settings))}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    } catch {}
  };
  const dialog = document.createElement('dialog');
  dialog.className = 'tac-reader-dialog';
  dialog.id = 'tac-reader-settings';
  dialog.setAttribute('aria-labelledby', 'tac-reader-title');
  dialog.innerHTML = `<form method="dialog">
    <h2 id="tac-reader-title">Read-aloud settings</h2>
    <label for="tac-reader-voice">Voice</label>
    <select id="tac-reader-voice" aria-describedby="tac-reader-voice-note"></select>
    <p id="tac-reader-voice-note">Voices depend on your browser and device. Online voices may send text to the voice provider.</p>
    <label for="tac-reader-rate">Reading speed</label>
    <select id="tac-reader-rate"><option value="0.5">0.5×</option><option value="0.75">0.75×</option><option value="1">Normal</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select>
    <p>Settings apply to every play control. Changes take effect the next time you start a section.</p>
    <button type="button" data-reader-stop>Stop reading</button>
    <button type="submit" autofocus>Done</button>
  </form>`;
  document.body.append(dialog);
  const voiceSelect = dialog.querySelector('#tac-reader-voice');
  const rateSelect = dialog.querySelector('#tac-reader-rate');
  rateSelect.value = String(settings.rate);
  if (!rateSelect.value) {settings.rate = 1; rateSelect.value = '1';}
  let voices = [];
  const refreshVoices = () => {
    voices = synth.getVoices();
    voiceSelect.replaceChildren(new Option('Automatic — match the page language', ''));
    [...voices].sort((a,b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name)).forEach(voice => {
      voiceSelect.add(new Option(`${voice.name} · ${voice.lang}${voice.localService ? ' · device' : ' · online'}`, voice.voiceURI));
    });
    // Keep a saved but currently unavailable choice for a later voiceschanged event.
    if (settings.voice && !voices.some(v => v.voiceURI === settings.voice)) {
      const missing = new Option('Saved voice unavailable — using automatic', settings.voice);
      missing.disabled = true;
      voiceSelect.add(missing);
    }
    voiceSelect.value = settings.voice;
  };
  refreshVoices();
  synth.addEventListener('voiceschanged', refreshVoices);
  voiceSelect.addEventListener('change', () => {settings.voice = voiceSelect.value; save();});
  rateSelect.addEventListener('change', () => {settings.rate = Number(rateSelect.value); save();});
  const status = document.createElement('p');
  status.className = 'tac-reader-status';
  status.setAttribute('role', 'status');
  document.body.append(status);
  const headings = [...article.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  const controls = [];
  let active = null, paused = false, generation = 0, utterance = null, opener = null;
  const rangeFor = control => {
    const range = document.createRange();
    range.setStartBefore(control.heading);
    const next = headings[headings.indexOf(control.heading) + 1];
    if (next) range.setEndBefore(next); else range.setEnd(article, article.childNodes.length);
    return range;
  };
  const highlight = () => {
    article.querySelectorAll('.tac-reader-highlight').forEach(node => node.classList.remove('tac-reader-highlight'));
    if (!active) return;
    const range = rangeFor(active);
    article.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li').forEach(node => {
      if (range.intersectsNode(node) && !node.closest('.tac-section-aside,.tac-reader-controls')) node.classList.add('tac-reader-highlight');
    });
  };
  const update = () => controls.forEach(control => {
    const playing = active === control && !paused;
    const action = active === control && paused ? 'Resume' : playing ? 'Pause' : 'Read aloud';
    control.play.setAttribute('aria-label', `${action}: ${control.title}`);
    control.play.title = `${action}: ${control.title}`;
    control.play.querySelector('span').textContent = playing ? 'Ⅱ' : '▶';
  });
  const stop = (message = '') => {
    generation++;
    synth.cancel();
    active = null; paused = false; utterance = null;
    update();
    highlight();
    if (message) status.textContent = message;
  };
  const textFor = control => {
    const range = rangeFor(control);
    const fragment = range.cloneContents();
    fragment.querySelectorAll('.tac-reader-controls,.tac-section-aside,button,input,textarea,select,script,style,[aria-hidden="true"]').forEach(node => node.remove());
    // Preserve pauses between paragraphs, headings and list items.
    fragment.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li,br').forEach(node => node.append(document.createTextNode('\n')));
    return fragment.textContent.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n').trim();
  };
  const start = control => {
    stop();
    const text = textFor(control);
    if (!text) return;
    active = control;
    const token = generation;
    const playbackSettings = {...settings};
    // Short utterances avoid browser limits on long sections.
    const chunks = text.match(/[^\n.!?]+[.!?]*|[.!?]+/g)?.flatMap(sentence => sentence.match(/.{1,220}(?:\s|$)|\S{1,220}/g) || []).map(s => s.trim()).filter(Boolean) || [text];
    let index = 0;
    const speakNext = () => {
      if (token !== generation) return;
      if (index >= chunks.length) {
        const next = controls.slice(controls.indexOf(control) + 1).find(item => item.heading.getClientRects().length > 0);
        if (next) {start(next); return;}
        active = null; utterance = null; update(); highlight(); status.textContent = 'Reading finished.'; return;
      }
      utterance = new SpeechSynthesisUtterance(chunks[index++]);
      const lang = control.heading.closest('[lang]')?.lang || document.documentElement.lang;
      utterance.lang = lang === 'sasl' ? 'en-ZA' : lang;
      const voice = voices.find(v => v.voiceURI === playbackSettings.voice) || voices.find(v => v.lang.toLowerCase() === utterance.lang.toLowerCase()) || voices.find(v => v.lang.split('-')[0] === utterance.lang.split('-')[0]);
      if (voice) utterance.voice = voice;
      utterance.rate = playbackSettings.rate;
      utterance.onend = speakNext;
      utterance.onerror = event => {
        if (token !== generation || ['canceled','interrupted'].includes(event.error)) return;
        stop('Reading could not continue. Try another voice in read-aloud settings.');
      };
      synth.speak(utterance);
    };
    synth.resume();
    speakNext(); update(); highlight();
    status.textContent = `Reading: ${control.title}`;
  };
  headings.forEach(heading => {
    const title = heading.textContent.trim();
    if (!title) return;
    const group = document.createElement('div');
    group.className = 'tac-reader-controls';
    const play = document.createElement('button');
    play.type = 'button';
    play.innerHTML = '<span aria-hidden="true">▶</span>';
    const preferences = document.createElement('button');
    preferences.type = 'button';
    preferences.innerHTML = '<span aria-hidden="true">⚙</span>';
    preferences.setAttribute('aria-label', `Read-aloud settings: ${title}`);
    preferences.title = 'Read-aloud settings';
    preferences.setAttribute('aria-haspopup', 'dialog');
    preferences.setAttribute('aria-controls', dialog.id);
    const control = {heading, title, play};
    controls.push(control);
    play.addEventListener('click', () => {
      if (active !== control) {start(control); return;}
      if (paused) {synth.resume(); paused = false; status.textContent = `Reading: ${title}`;}
      else {synth.pause(); paused = true; status.textContent = `Paused: ${title}`;}
      update();
    });
    preferences.addEventListener('click', () => {opener = preferences; refreshVoices(); dialog.showModal();});
    group.append(play, preferences);
    heading.after(group);
  });
  update();
  dialog.addEventListener('close', () => opener?.focus());
  dialog.querySelector('[data-reader-stop]').addEventListener('click', () => stop('Reading stopped.'));
  window.addEventListener('pagehide', () => stop());
})();
