import fs from 'node:fs/promises';
import pg from 'pg';
import {fileURLToPath} from 'node:url';
export async function initialize(pool,seedPath){
 const db=await pool.connect();
 try{
  await db.query('BEGIN');
  await db.query('SELECT pg_advisory_xact_lock(734182901)');
  await db.query(await fs.readFile(new URL('./001-initial.sql',import.meta.url),'utf8'));
  const installed=await db.query('SELECT 1 FROM content.migrations WHERE version=1');
  if(!installed.rowCount){
   const seed=JSON.parse(await fs.readFile(seedPath,'utf8'));
   if(seed.format!==1||!seed.pages||!seed.strings||!seed.documents||!seed.settings)throw Error('Invalid content seed');
   await db.query('INSERT INTO content.state(singleton,seed_commit,site_version) VALUES(true,$1,$2)',[seed.sourceCommit,seed.siteVersion]);
   for(const [filename,body] of Object.entries(seed.pages))await db.query('INSERT INTO content.pages(filename,body) VALUES($1,$2)',[filename,body]);
   for(const [key,value] of Object.entries(seed.strings))await db.query('INSERT INTO content.strings(key,value) VALUES($1,$2)',[key,value]);
   for(const [path,document] of Object.entries(seed.documents))await db.query('INSERT INTO content.documents(path,document) VALUES($1,$2)',[path,JSON.stringify(document)]);
   for(const [key,value] of Object.entries(seed.settings))await db.query('INSERT INTO content.settings(key,value) VALUES($1,$2)',[key,JSON.stringify(value)]);
   await db.query('INSERT INTO content.migrations(version) VALUES(1)');
   console.log('Database initialized with the current website content.');
  }else console.log('Database already initialized; existing content and submissions preserved.');
  await db.query('COMMIT');
 }catch(error){await db.query('ROLLBACK');throw error;}finally{db.release();}
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});
 try{await initialize(pool,process.env.SEED_PATH||'/seed/seed.json');}catch(error){console.error('Database initialization failed:',error.message);process.exitCode=1;}finally{await pool.end();}
}
