import {PGlite} from '@electric-sql/pglite';
import {PGLiteSocketServer} from '@electric-sql/pglite-socket';
import pg from '../../software/node_modules/pg/lib/index.js';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import {initialize} from '../../software/db/init.mjs';
const root=new URL('../../',import.meta.url).pathname;
const temp=await fs.mkdtemp('/tmp/association-db-test-');
const db=await PGlite.create(temp+'/pgdata');
const socket=new PGLiteSocketServer({db,port:55432,host:'127.0.0.1'});await socket.start();
const connectionString='postgres://postgres:postgres@127.0.0.1:55432/postgres';
let pool=new pg.Pool({connectionString,max:1});
let child;
async function start(){
 child=spawn(process.execPath,['software/server.mjs'],{cwd:root,env:{...process.env,DATABASE_URL:connectionString,PORT:'18080'},stdio:['ignore','pipe','pipe']});
 let output='';child.stdout.on('data',b=>output+=b);child.stderr.on('data',b=>output+=b);
 for(let i=0;i<200;i++){if(child.exitCode!==null)throw Error(output);try{if((await fetch('http://127.0.0.1:18080/healthz')).ok)return;}catch{}await new Promise(resolve=>setTimeout(resolve,50));}throw Error('Server startup timeout: '+output);
}
async function stop(){if(child&&child.exitCode===null){const ended=new Promise(resolve=>child.once('exit',resolve));child.kill('SIGTERM');await ended;}}
try{
 await initialize(pool,root+'/content/seed.json');
 assert.equal((await db.query('SELECT count(*)::int n FROM content.pages')).rows[0].n,47);
 await pool.end();
 await start();
 const request=(path,init)=>fetch('http://127.0.0.1:18080'+path,init);
 const seed=JSON.parse(await fs.readFile(root+'/content/seed.json','utf8'));
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
 console.log('PASS: PostgreSQL-wire initialization, 47 seeded pages, real HTTP server, submissions, canonical tallies/idempotency, origin/size validation, live database edits, restart/reseed persistence and three export formats.');
}finally{await stop();if(!pool.ended)await pool.end();await socket.stop();await new Promise(resolve=>setTimeout(resolve,100));await db.close();}
