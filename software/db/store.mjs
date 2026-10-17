// Adapter for the existing form API. Private records are never included in content exports.
export function recordStore(pool){return {
 async put(key,value){await pool.query('INSERT INTO private.records(key,body) VALUES($1,$2::jsonb) ON CONFLICT(key) DO UPDATE SET body=EXCLUDED.body',[key,value]);},
 async list({prefix,limit=1000,cursor=''}){
  const result=await pool.query('SELECT key FROM private.records WHERE starts_with(key,$1) AND key>$2 ORDER BY key LIMIT $3',[prefix,cursor,Math.min(limit,1000)+1]);
  const truncated=result.rows.length>limit,rows=result.rows.slice(0,limit);
  return {objects:rows,truncated,cursor:truncated?rows.at(-1).key:undefined};
 }
};}
export async function readContent(pool){
 const db=await pool.connect();
 try{
  await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
  const state=(await db.query('SELECT revision,site_version,seed_commit FROM content.state WHERE singleton')).rows[0];
  if(!state)throw Error('Content is not initialized');
  const records={};
  for(const [table,key,value] of [['pages','filename','body'],['strings','key','value'],['documents','path','document'],['settings','key','value']]){
   const result=await db.query(`SELECT ${key},${value} FROM content.${table}`);
   records[table]=Object.fromEntries(result.rows.map(row=>[row[key],row[value]]));
  }
  await db.query('COMMIT');return {...records,...state};
 }catch(error){await db.query('ROLLBACK');throw error;}finally{db.release();}
}
