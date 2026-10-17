import http from 'node:http';
import {Readable} from 'node:stream';
import {webcrypto} from 'node:crypto';
import pg from 'pg';
import PDFDocument from 'pdfkit';
import {recordStore} from './db/store.mjs';
import {loadSoftware,contentRuntime} from './content.mjs';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,max:10,connectionTimeoutMillis:5000,statement_timeout:15000});
pool.on('error',()=>console.error('A database connection was interrupted.'));
const current=contentRuntime(pool,await loadSoftware(),PDFDocument);
await current(); // Fail startup rather than serve an empty/unseeded website.
const env={BUCKET:recordStore(pool)};
const server=http.createServer(async(req,res)=>{
 try{
  if(req.url==='/healthz'){
   await pool.query('SELECT 1 FROM content.state WHERE singleton');
   res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end('{"ok":true}');return;
  }
  const host=req.headers.host;
  if(!host||!/^([a-z0-9.-]+|\[[a-f0-9:]+\])(?::\d+)?$/i.test(host)){res.writeHead(400);res.end();return;}
  const headers=new Headers();for(const [name,value] of Object.entries(req.headers))if(value!==undefined)headers.set(name,Array.isArray(value)?value.join(','):value);
  // Never trust client-supplied forwarding/IP headers. A configured proxy must be
  // on the private trusted network and TRUST_PROXY must be explicitly enabled.
  headers.set('cf-connecting-ip',req.socket.remoteAddress||'unknown');
  const trusted=process.env.TRUST_PROXY==='true';
  const protocol=trusted&&req.headers['x-forwarded-proto']==='https'?'https':'http';
  const url=new URL(req.url,protocol+'://'+host);
  if(url.host!==host){res.writeHead(400);res.end();return;}
  const abort=new AbortController();req.on('aborted',()=>abort.abort());
  const request=new Request(url,{method:req.method,headers,signal:abort.signal,...(!['GET','HEAD'].includes(req.method)?{body:Readable.toWeb(req),duplex:'half'}:{})});
  const response=await (await current()).worker.fetch(request,env);
  res.writeHead(response.status,Object.fromEntries(response.headers));
  if(req.method==='HEAD'||!response.body){res.end();return;}
  Readable.fromWeb(response.body).on('error',()=>res.destroy()).pipe(res);
 }catch{if(!res.headersSent){res.writeHead(503,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end('{"error":"Service temporarily unavailable."}');}else res.destroy();}
});
server.requestTimeout=60000;server.headersTimeout=15000;
server.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Association Commons listening on port '+(process.env.PORT||3000)));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.close(async()=>{await pool.end();process.exit(0);});setTimeout(()=>process.exit(1),10000).unref();});
