// Compatibility target for existing Sites hosting. Docker uses PostgreSQL instead.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {materialize} from '../software/content.mjs';
const seed=JSON.parse(fs.readFileSync('content/seed.json','utf8'));
const assets={...seed.pages,'LICENSE.txt':fs.readFileSync('LICENSE','utf8'),'LICENSING.txt':fs.readFileSync('LICENSING.md','utf8')};
for(const name of fs.readdirSync('software/public')){const body=fs.readFileSync('software/public/'+name,'utf8');assets[name]=name.endsWith('.js')?materialize(body,seed.strings):body;}
const files=['Dockerfile','docker-compose.yml','.dockerignore','README.md','LICENSE','LICENSING.md','package.json','package-lock.json','.gitignore','.openai/hosting.json'];
function collect(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','source.tar.gz'].includes(item.name))continue;const file=dir+'/'+item.name;if(item.isDirectory())collect(file);else files.push(file);}}
for(const dir of ['software','content','scripts','docs','.github'])collect(dir);
const archive=execFileSync('tar',['--sort=name','--mtime=@0','--owner=0','--group=0','--numeric-owner','-czf','-','--null','-T','-'],{input:files.sort().join('\0')+'\0',maxBuffer:30*1024*1024});
const fontNames={Regular:'NotoSans-Regular.ttf',Bold:'NotoSans-Bold.ttf',Arabic:'NotoSansArabic-Regular-Latin.ttf',Devanagari:'NotoSansDevanagari-Regular-Latin.ttf',Gujarati:'NotoSansGujarati-Regular-Latin.ttf',Tamil:'NotoSansTamil-Regular-Latin.ttf',Telugu:'NotoSansTelugu-Regular-Latin.ttf'};
const fonts=Object.fromEntries(Object.entries(fontNames).map(([key,name])=>[key,fs.readFileSync('software/fonts/'+name).toString('base64')]));
const pdf='const PDFDocument=(()=>{const module={exports:{}};const exports=module.exports;'+fs.readFileSync('software/runtime/pdfkit.standalone.cjs','utf8')+';return module.exports;})();\n';
const runtime=materialize(fs.readFileSync('software/runtime/site.template.mjs','utf8'),seed.strings);
fs.writeFileSync('worker/index.js',pdf+runtime+'\nexport default createSite('+JSON.stringify({assets,sourceArchiveBase64:archive.toString('base64'),pdfFontSources:fonts,pdfDocuments:seed.documents,pdfStadgarSchema:seed.settings.stadgarSchema,suggestionRegistry:seed.settings.languageRegistry,existingLanguageProjects:seed.settings.languageProjects}).replace(/}$/,',PDFDocument}')+');\n');
console.log('Built Sites compatibility snapshot from the separated content and software.');
