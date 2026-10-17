import {PGlite} from '@electric-sql/pglite';
import {PGLiteSocketServer} from '@electric-sql/pglite-socket';
import pg from '../../software/node_modules/pg/lib/index.js';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {initialize} from '../../software/db/init.mjs';
import {loadPrivacyPolicy} from '../../software/db/privacy-policy.mjs';
import {parse,stringify} from 'yaml';
const root=fileURLToPath(new URL('../../',import.meta.url));
const temp=await fs.mkdtemp('/tmp/association-db-test-');
const policyPath=temp+'/privacy-policy.yaml';
await fs.copyFile(root+'privacy-policy.yaml',policyPath);
const db=await PGlite.create(temp+'/pgdata');
const socket=new PGLiteSocketServer({db,port:55432,host:'127.0.0.1'});await socket.start();
const connectionString='postgres://postgres:postgres@127.0.0.1:55432/postgres';
let pool=new pg.Pool({connectionString,max:1});
let child;
async function start(){
 child=spawn(process.execPath,['software/server.mjs'],{cwd:root,env:{...process.env,DATABASE_URL:connectionString,PORT:'18080',PRIVACY_POLICY_PATH:policyPath},stdio:['ignore','pipe','pipe']});
 let output='';child.stdout.on('data',b=>output+=b);child.stderr.on('data',b=>output+=b);
 for(let i=0;i<200;i++){if(child.exitCode!==null)throw Error(output);try{if((await fetch('http://127.0.0.1:18080/healthz')).ok)return;}catch{}await new Promise(resolve=>setTimeout(resolve,50));}throw Error('Server startup timeout: '+output);
}
async function stop(){if(child&&child.exitCode===null){const ended=new Promise(resolve=>child.once('exit',resolve));child.kill('SIGTERM');await ended;}}
try{
 await initialize(pool,root+'/content/seed.json');
 assert.equal((await db.query('SELECT count(*)::int n FROM content.pages')).rows[0].n,47);
 // Simulate an installed previous release with an editorial change.
 await db.query('DELETE FROM content.migrations WHERE version=2');
 await db.query("UPDATE content.state SET site_version='0.0.1'");
 await db.query("UPDATE content.pages SET body=replace(body,'0.0.2','0.0.1')||'<!-- retained editorial edit -->' WHERE filename='sv.html'");
 await initialize(pool,root+'/content/seed.json');
 assert.equal((await db.query('SELECT site_version FROM content.state')).rows[0].site_version,'0.0.2');
 const migrated=(await db.query("SELECT body FROM content.pages WHERE filename='sv.html'")).rows[0].body;
 assert.ok(migrated.includes('v0.0.2')&&migrated.endsWith('<!-- retained editorial edit -->'));
 assert.equal((await db.query('SELECT count(*)::int n FROM content.migrations WHERE version=2')).rows[0].n,1);
 await pool.end();
 await start();
 const request=(path,init)=>fetch('http://127.0.0.1:18080'+path,init);
 const seed=JSON.parse(await fs.readFile(root+'/content/seed.json','utf8'));
 assert.equal(await (await request('/privacy/')).text(),seed.pages['privacy.html']);
 const initialRevision=(await db.query('SELECT revision FROM content.state')).rows[0].revision;
 await stop();await start();
 assert.equal((await db.query('SELECT revision FROM content.state')).rows[0].revision,initialRevision,'Identical startup YAML must not advance the revision');
 const policy=parse(await fs.readFile(policyPath,'utf8'));
 policy.section_html=policy.section_html.replace('</section>','<p>Startup policy verification.</p></section>');
 policy.document.blocks.push({type:'p',text:'Startup policy verification.',links:[]});
 await fs.writeFile(policyPath,stringify(policy));
 // YAML is applied on startup, not on each request.
 assert.equal(await (await request('/privacy/')).text(),seed.pages['privacy.html']);
 await stop();await start();
 assert.ok((await (await request('/privacy/')).text()).includes('Startup policy verification.'));
 for(const format of ['md','rtf'])assert.ok((await (await request('/api/document.'+format+'?page=/privacy/')).text()).includes('Startup policy verification.'));
 assert.notEqual((await db.query('SELECT revision FROM content.state')).rows[0].revision,initialRevision);
 const invalidPath=temp+'/invalid.yaml';await fs.writeFile(invalidPath,'format: 1\nsection_html: 12\n');
 const revisionBeforeInvalid=(await db.query('SELECT revision FROM content.state')).rows[0].revision;
 const validationPool=new pg.Pool({connectionString,max:1});
 try{await assert.rejects(loadPrivacyPolicy(validationPool,invalidPath),/Invalid privacy policy/);await assert.rejects(loadPrivacyPolicy(validationPool,temp+'/missing.yaml'),/ENOENT/);}finally{await validationPool.end();}
 assert.equal((await db.query('SELECT revision FROM content.state')).rows[0].revision,revisionBeforeInvalid);
 assert.equal(await (await request('/en/')).text(),seed.pages['index.html']);
 assert.equal((await request('/en/',{method:'HEAD'})).status,200);
 const post=(path,body,extra={})=>request(path,{method:'POST',headers:{'content-type':'application/json',...extra},body:JSON.stringify(body)});
 assert.equal((await post('/api/join',{name:'Database Test',email:'test@example.invalid',consent:true})).status,201);
 assert.equal((await post('/api/join',{name:'Cross Origin',email:'test@example.invalid',consent:true},{origin:'https://other.example'})).status,403);
 assert.equal((await post('/api/join',{name:'Oversized',email:'test@example.invalid',consent:true,reason:'x'.repeat(9000)})).status,413);
 assert.equal((await request('/private/records')).status,404);
 const {randomUUID}=await import('node:crypto');const id=randomUUID();
 assert.equal((await post('/api/language-suggestions',{name:'Portuguese',requestId:id})).status,201);
 assert.equal((await post('/api/language-suggestions',{name:'Portuguese',requestId:id})).status,201);
 const tally=await (await request('/api/language-suggestions')).json();assert.equal(tally.suggestions.find(row=>row.name==='Portuguese').count,1);
 const key='language-suggestions/pt/'+id+'.json';assert.equal((await db.query('SELECT count(*)::int n FROM private.records')).rows[0].n,2);
 // Database edits take effect without an image rebuild or process restart.
 await db.query("UPDATE content.pages SET body=body||'<!-- database edit -->' WHERE filename='index.html'");
 assert.ok((await (await request('/en/')).text()).endsWith('<!-- database edit -->'));
 const rev=(await db.query('SELECT revision FROM content.state')).rows[0].revision;
 await stop();pool=new pg.Pool({connectionString,max:1});await initialize(pool,root+'/content/seed.json');await pool.end();
 assert.equal((await db.query('SELECT revision FROM content.state')).rows[0].revision,rev);
 await start();assert.ok((await (await request('/en/')).text()).endsWith('<!-- database edit -->'));
 assert.equal((await db.query('SELECT count(*)::int n FROM private.records')).rows[0].n,2);
 for(const format of ['pdf','md','rtf'])assert.equal((await request('/api/document.'+format+'?page=/sv/')).status,200);
 console.log('PASS: PostgreSQL-wire initialization, startup YAML policy reload and exports, invalid/missing policy rejection, 47 seeded pages, real HTTP server, submissions, canonical tallies/idempotency, origin/size validation, live database edits, restart/reseed persistence and three export formats.');
}finally{await stop();if(!pool.ended)await pool.end();await socket.stop();await new Promise(resolve=>setTimeout(resolve,100));await db.close();}
