import fs from 'node:fs/promises';
import {readContent} from './db/store.mjs';
const textPattern=/"@@text:([a-f0-9]{64})@@"/g;
export function materialize(template,strings){return template.replace(textPattern,(_,key)=>{
 if(!Object.hasOwn(strings,key))throw Error('Missing content fragment: '+key);
 return JSON.stringify(strings[key]).replaceAll('<','\\u003c').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
});}
export async function loadSoftware(){
 const assets={};for(const name of await fs.readdir(new URL('./public/',import.meta.url)))assets[name]=await fs.readFile(new URL('./public/'+name,import.meta.url),'utf8');
 const runtime=await fs.readFile(new URL('./runtime/site.template.mjs',import.meta.url),'utf8');
 // Only trusted software is compiled; database values are JSON-escaped literals.
 const factory=strings=>new Function(materialize(runtime,strings).replace('export function createSite','return function createSite'))();
 const fontNames={Regular:'NotoSans-Regular.ttf',Bold:'NotoSans-Bold.ttf',Arabic:'NotoSansArabic-Regular-Latin.ttf',Devanagari:'NotoSansDevanagari-Regular-Latin.ttf',Gujarati:'NotoSansGujarati-Regular-Latin.ttf',Tamil:'NotoSansTamil-Regular-Latin.ttf',Telugu:'NotoSansTelugu-Regular-Latin.ttf'};
 const fonts={};for(const [key,name] of Object.entries(fontNames))fonts[key]=(await fs.readFile(new URL('./fonts/'+name,import.meta.url))).toString('base64');
 const licenses={};for(const name of ['LICENSE','LICENSING.md'])licenses[name==='LICENSE'?'LICENSE.txt':'LICENSING.txt']=await fs.readFile(new URL('../'+name,import.meta.url),'utf8');
 const sourceArchiveBase64=(await fs.readFile(new URL('./source.tar.gz',import.meta.url))).toString('base64');
 return {assets,factory,fonts,licenses,sourceArchiveBase64};
}
export function buildRuntime(content,software,PDFDocument){
 const assets={...content.pages,...software.licenses};
 for(const [name,body] of Object.entries(software.assets))assets[name]=name.endsWith('.js')?materialize(body,content.strings):body;
 const worker=software.factory(content.strings)({assets,PDFDocument,sourceArchiveBase64:software.sourceArchiveBase64,pdfFontSources:software.fonts,pdfDocuments:content.documents,pdfStadgarSchema:content.settings.stadgarSchema,suggestionRegistry:content.settings.languageRegistry,existingLanguageProjects:content.settings.languageProjects});
 return {worker,assets,revision:content.revision};
}
export function contentRuntime(pool,software,PDFDocument){
 let active,pending;
 return async function current(){
  const revision=(await pool.query('SELECT revision FROM content.state WHERE singleton')).rows[0]?.revision;
  if(!active||active.revision!==revision){
   if(!pending)pending=readContent(pool).then(content=>{active=buildRuntime(content,software,PDFDocument);}).finally(()=>{pending=null;});
   await pending;
  }
  return active;
 };
}
