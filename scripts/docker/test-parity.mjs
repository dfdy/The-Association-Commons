import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'acorn';
import PDFDocument from 'pdfkit';
import {normalize} from './ast.mjs';
import {loadSoftware,buildRuntime} from '../../software/content.mjs';
const seed=JSON.parse(fs.readFileSync('content/seed.json'));
const software=await loadSoftware();const {worker,assets}=buildRuntime({...seed,revision:'1'},software,PDFDocument);
let js=0,html=0;
for(const [name,hash] of Object.entries(seed.originalHashes)){
 if(name.endsWith('.js')){assert.equal(createHash('sha256').update(JSON.stringify(normalize(parse(assets[name],{ecmaVersion:'latest'})))).digest('hex'),seed.originalAstHashes[name],name);js++;}
 else {assert.equal(createHash('sha256').update(assets[name].replaceAll('0.0.2','0.0.1')).digest('hex'),hash,name);if(name.endsWith('.html'))html++;}
}
const keys=new Map();const env={BUCKET:{put:async(key,value)=>keys.set(key,JSON.parse(value)),list:async({prefix})=>({objects:[...keys.keys()].filter(key=>key.startsWith(prefix)).map(key=>({key})),truncated:false})}};
const languages=['en','sv','zu','xh','af','af-x-kaaps','nso','tn','st','ts','ss','ve','nr','sasl'];
for(const code of languages)for(const suffix of ['','stadgar/','donate/']){
 const request=new Request('http://localhost:8080/'+code+'/'+suffix);
 const response=await worker.fetch(request,env);assert.equal(response.status,200);assert.ok((await response.text()).includes('v0.0.2'));
}
for(const page of Object.keys(seed.documents))for(const format of ['md','rtf']){
 const request=new Request('http://localhost:8080/api/document.'+format+'?page='+page);
 const response=await worker.fetch(request,env);assert.equal(response.status,200,page);assert.equal(createHash('sha256').update((await response.text()).replaceAll('0.0.2','0.0.1')).digest('hex'),seed.exportHashes[page+':'+format],page+' '+format);
}
for(const page of ['/en/','/sv/','/privacy/']){
 const response=await worker.fetch(new Request('http://localhost:8080/api/document.pdf?page='+page),env);assert.equal(response.status,200);assert.equal(Buffer.from(await response.arrayBuffer()).subarray(0,5).toString(),'%PDF-');
}
const fields=Object.fromEntries(seed.settings.stadgarSchema.map(field=>[field.id,field.default?.[0]||'']));fields.name='Test Association';fields.purpose='A specific purpose for this test.';
for(const lang of ['en','sv'])for(const format of ['pdf','md','rtf']){const response=await worker.fetch(new Request('http://localhost:8080/api/stadgar.'+format,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({lang,fields})}),env);assert.equal(response.status,200);assert.ok((await response.arrayBuffer()).byteLength>500);}
const post=body=>worker.fetch(new Request('http://localhost:8080/api/join',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),env);
assert.equal((await post({name:'Test Person',email:'person@example.invalid',consent:true})).status,201);assert.equal(keys.size,1);
assert.equal((await post({name:'Test Person',email:'person@example.invalid',consent:false})).status,400);
const attack='";globalThis.CONTENT_EXECUTED=true;//${1+1}</script>';
const key=Object.keys(seed.strings)[0];const changed={...seed,strings:{...seed.strings,[key]:attack}};buildRuntime(changed,software,PDFDocument);assert.equal(globalThis.CONTENT_EXECUTED,undefined);
console.log(`PASS: ${html} byte-identical pages, ${js} equivalent frontend scripts, 42 project routes, 70 text exports, PDF signatures, bilingual charter exports, forms, and safely escaped content.`);
