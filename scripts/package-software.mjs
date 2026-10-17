import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';
const files=['LICENSE','LICENSING.md','Dockerfile','docker-compose.yml'];
function collect(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','source.tar.gz','.DS_Store'].includes(item.name))continue;const file=dir+'/'+item.name;if(item.isDirectory())collect(file);else files.push(file);}}
collect('software');
// Stage normalized files so both macOS BSD tar and GNU tar can package them.
const staging=fs.mkdtempSync(path.join(os.tmpdir(),'commons-source-'));
try{
 for(const file of files){const target=path.join(staging,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);fs.chmodSync(target,fs.statSync(file).mode&0o777);fs.utimesSync(target,0,0);}
 const gnu=execFileSync('tar',['--version'],{encoding:'utf8'}).includes('GNU tar');
 const ownership=gnu?['--owner=0','--group=0','--numeric-owner']:['--uid','0','--gid','0','--uname','','--gname',''];
 const archive=execFileSync('tar',['--format=ustar',...ownership,'-czf','-','--null','-T','-'],{cwd:staging,env:{...process.env,COPYFILE_DISABLE:'1'},input:files.sort().join('\0')+'\0',maxBuffer:20*1024*1024});fs.writeFileSync('software/source.tar.gz',archive);
}finally{fs.rmSync(staging,{recursive:true,force:true});}
