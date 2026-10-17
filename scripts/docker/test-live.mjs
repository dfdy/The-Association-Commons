// Read-only checks against an already running, freshly seeded Compose stack.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const seed=JSON.parse(await fs.readFile(new URL('../../content/seed.json',import.meta.url),'utf8'));
const base=process.env.COMMONS_TEST_URL||'http://127.0.0.1:8380';
async function request(path,options){const response=await fetch(base+path,{...options,signal:AbortSignal.timeout(30000)});assert.equal(response.status,200,path);return response;}
const hash=value=>createHash('sha256').update(value).digest('hex');
await request('/healthz');
let pages=0;
for(const code of ['en','sv','zu','xh','af','af-x-kaaps','nso','tn','st','ts','ss','ve','nr','sasl']){
 for(const suffix of ['','stadgar/','donate/']){
  const file=suffix?`${code==='en'?'':code+'-'}${suffix.slice(0,-1)}.html`:['en','sasl'].includes(code)?'index.html':`${code}.html`;
  const body=await (await request(`/${code}/${suffix}`)).text();
  assert.equal(hash(body),hash(seed.pages[file]),file);assert.ok(body.includes('v0.0.1'));pages++;
 }
}
for(const [page,file] of Object.entries({'/privacy/':'privacy.html','/licence/':'licence.html','/licence/content/':'content-licence.html','/licence/software/':'software-licence.html','/languages/':'language-project.html','/sv/languages/':'sv-language-project.html'})){
 assert.equal(await (await request(page)).text(),seed.pages[file]);pages++;
}
for(const page of Object.keys(seed.documents))for(const format of ['md','rtf']){
 const body=await (await request(`/api/document.${format}?page=${encodeURIComponent(page)}`)).text();
 // Export links use the request origin; baseline hashes use localhost:8080.
 assert.equal(hash(body.replaceAll(new URL(base).origin,'http://localhost:8080')),seed.exportHashes[page+':'+format],page+' '+format);
}
for(const page of ['/en/','/sv/','/privacy/']){
 const body=Buffer.from(await (await request('/api/document.pdf?page='+encodeURIComponent(page))).arrayBuffer());
 assert.equal(body.subarray(0,5).toString(),'%PDF-');
}
const fields=Object.fromEntries(seed.settings.stadgarSchema.map(field=>[field.id,field.default?.[0]||'']));
fields.name='Local Verification Association';
fields.purpose='Verify local charter downloads.';
for(const lang of ['en','sv'])for(const format of ['pdf','md','rtf']){
 const response=await request('/api/stadgar.'+format,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({lang,fields})});
 assert.ok((await response.arrayBuffer()).byteLength>500);
}
assert.equal(await (await request('/LICENSE.txt')).text(),await fs.readFile(new URL('../../LICENSE',import.meta.url),'utf8'));
const source=Buffer.from(await (await request('/source.tar.gz')).arrayBuffer());assert.equal(source.readUInt16BE(),0x1f8b);
console.log(`PASS: live Compose health, ${pages} byte-identical page routes (47 page files) at v0.0.1, 70 text exports, PDF signatures, six charter exports, licence and source downloads.`);
