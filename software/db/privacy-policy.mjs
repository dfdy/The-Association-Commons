import fs from 'node:fs/promises';
import {parseDocument} from 'yaml';

const sectionPattern=/<section id="privacy-policy-content"[\s\S]*?<\/section>/g;

export async function loadPrivacyPolicy(pool,path){
 const yaml=parseDocument(await fs.readFile(path,'utf8'),{uniqueKeys:true});
 if(yaml.errors.length)throw Error('Invalid privacy policy YAML: '+yaml.errors[0].message);
 const policy=yaml.toJS({maxAliasCount:0});
 if(policy?.format!==1||typeof policy.section_html!=='string'||
    !/^<section id="privacy-policy-content"[\s\S]*<\/section>\s*$/.test(policy.section_html)||
    !policy.document||typeof policy.document.title!=='string'||
    typeof policy.document.filename!=='string'||policy.document.lang!=='en'||
    !Array.isArray(policy.document.pdfLabels)||policy.document.pdfLabels.length!==2||
    !policy.document.pdfLabels.every(label=>typeof label==='string')||
    !Array.isArray(policy.document.blocks)||!policy.document.blocks.length||
    !policy.document.blocks.every(block=>['h1','h2','h3','p','li'].includes(block.type)&&typeof block.text==='string'&&Array.isArray(block.links)&&block.links.every(link=>typeof link==='string')))
  throw Error('Invalid privacy policy: expected format 1, section_html and a complete English document model');
 const db=await pool.connect();
 try{
  await db.query('BEGIN');
  await db.query('SELECT pg_advisory_xact_lock(734182901)');
  const page=(await db.query("SELECT body FROM content.pages WHERE filename='privacy.html' FOR UPDATE")).rows[0];
  if(!page||[...page.body.matchAll(sectionPattern)].length!==1)throw Error('Expected one installed privacy policy section');
  const body=page.body.replace(sectionPattern,()=>policy.section_html.trimEnd());
  if(body!==page.body)await db.query("UPDATE content.pages SET body=$1,updated_at=now() WHERE filename='privacy.html'",[body]);
  // Avoid revision changes for identical YAML on repeated starts.
  const document=JSON.stringify(policy.document);
  const unchanged=(await db.query("SELECT document=$1::jsonb AS unchanged FROM content.documents WHERE path='/privacy/'",[document])).rows[0]?.unchanged;
  if(!unchanged)await db.query(`INSERT INTO content.documents(path,document) VALUES('/privacy/',$1::jsonb)
   ON CONFLICT(path) DO UPDATE SET document=EXCLUDED.document,updated_at=now()
   WHERE content.documents.document IS DISTINCT FROM EXCLUDED.document`,[document]);
  await db.query('COMMIT');
  console.log('Privacy policy loaded from YAML.');
 }catch(error){await db.query('ROLLBACK');throw error;}finally{db.release();}
}
