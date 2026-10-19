// Render a self-contained, sanitised document. No HTTP server or browser profile is shared.
import {spawn} from 'node:child_process';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

let html = '';
for await (const chunk of process.stdin) {
  html += chunk;
  if (Buffer.byteLength(html) > 32 * 1024 * 1024) throw new Error('Document too large');
}
const profile = await mkdtemp(join(tmpdir(), 'ddc-pdf-'));
const browser = spawn(process.env.CHROMIUM_EXECUTABLE || '/usr/bin/chromium', [
  '--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-background-networking',
  '--disable-extensions', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-pipe', `--user-data-dir=${profile}`,
], {stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe']});
let serial = 0, buffer = '';
const pending = new Map();
const fail = error => { for (const item of pending.values()) item.reject(error); pending.clear(); };
browser.on('error', fail);
browser.on('exit', () => fail(new Error('PDF browser exited')));
browser.stdio[3].on('error', fail);
browser.stdio[4].setEncoding('utf8');
browser.stdio[4].on('data', chunk => {
  buffer += chunk;
  let boundary;
  while ((boundary = buffer.indexOf('\0')) !== -1) {
    const message = JSON.parse(buffer.slice(0, boundary));
    buffer = buffer.slice(boundary + 1);
    const item = pending.get(message.id);
    if (!item) continue;
    pending.delete(message.id);
    if (message.error) item.reject(new Error(message.error.message));
    else item.resolve(message.result);
  }
});
const call = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = ++serial;
  pending.set(id, {resolve, reject});
  browser.stdio[3].write(JSON.stringify({id, method, params, ...(sessionId ? {sessionId} : {})}) + '\0');
});
const timeout = setTimeout(() => {fail(new Error('PDF rendering timed out')); browser.kill('SIGKILL');}, 45000);
try {
  const {targetId} = await call('Target.createTarget', {url: 'about:blank'});
  const {sessionId} = await call('Target.attachToTarget', {targetId, flatten: true});
  const page = (method, params) => call(method, params, sessionId);
  await page('Page.enable');
  await page('Network.enable');
  await page('Network.setBlockedURLs', {urls: ['http://*', 'https://*', 'file://*', 'ftp://*']});
  await page('Emulation.setScriptExecutionDisabled', {value: true});
  await page('Emulation.setEmulatedMedia', {media: 'screen'});
  await page('Emulation.setDeviceMetricsOverride', {width: 1120, height: 900, deviceScaleFactor: 1, mobile: false});
  const {frameTree} = await page('Page.getFrameTree');
  await page('Page.setDocumentContent', {frameId: frameTree.frame.id, html});
  // Await fonts and embedded images; only this fixed expression runs, never page scripts.
  await page('Runtime.evaluate', {expression: 'Promise.all([document.fonts.ready, ...Array.from(document.images, image => image.decode().catch(() => {}))])', awaitPromise: true});
  const {data} = await page('Page.printToPDF', {
    printBackground: true, paperWidth: 8.2677, paperHeight: 11.6929,
    marginTop: 0.25, marginBottom: 0.25, marginLeft: 0.25, marginRight: 0.25,
    displayHeaderFooter: false, preferCSSPageSize: true,
    generateTaggedPDF: true, generateDocumentOutline: true,
  });
  process.stdout.write(Buffer.from(data, 'base64'));
} catch (error) {
  process.stderr.write('PDF rendering failed.\n');
  process.exitCode = 1;
} finally {
  clearTimeout(timeout);
  if (browser.exitCode === null && browser.signalCode === null) {
    const closed = new Promise(resolve => browser.once('close', resolve));
    browser.kill('SIGTERM');
    const force = setTimeout(() => browser.kill('SIGKILL'), 2000);
    await closed;
    clearTimeout(force);
  }
  await rm(profile, {recursive: true, force: true});
}
