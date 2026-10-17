import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const files=['LICENSE','LICENSING.md','Dockerfile','docker-compose.yml'];
function collect(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','source.tar.gz'].includes(item.name))continue;const file=dir+'/'+item.name;if(item.isDirectory())collect(file);else files.push(file);}}
collect('software');
const archive=execFileSync('tar',['--sort=name','--mtime=@0','--owner=0','--group=0','--numeric-owner','-czf','-','--null','-T','-'],{input:files.sort().join('\0')+'\0',maxBuffer:20*1024*1024});fs.writeFileSync('software/source.tar.gz',archive);
