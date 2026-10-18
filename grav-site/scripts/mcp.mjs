import {readFileSync} from 'node:fs';
process.env.GRAV_API_URL='http://127.0.0.1/api';
process.env.GRAV_API_KEY=readFileSync('/var/www/html/user/data/commons-private/mcp-key','utf8').trim();
const pkg=JSON.parse(readFileSync('/opt/mcp/node_modules/grav-mcp/package.json','utf8'));
const bin=typeof pkg.bin==='string'?pkg.bin:Object.values(pkg.bin)[0];
await import('/opt/mcp/node_modules/grav-mcp/'+bin);
