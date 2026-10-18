#!/usr/bin/env python3
"""Check an API edit becomes a Git-visible file; remove only our temporary page."""
import json,subprocess,sys,time,urllib.request,uuid
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
key=subprocess.run(['docker','compose','-f',str(ROOT/'compose.grav.yml'),'exec','-T','--user','www-data','grav','cat','/var/www/html/user/data/commons-private/mcp-key'],capture_output=True,text=True,check=True).stdout.strip()
slug='git-content-check-'+uuid.uuid4().hex[:10]
route='/en/'+slug;created=False;file=None

def request(path,method='GET',body=None,etag=None):
    headers={'X-API-Key':key,'Content-Type':'application/json'}
    if etag:headers['If-Match']=etag
    with urllib.request.urlopen(urllib.request.Request('http://localhost:8388/api/v1'+path,method=method,headers=headers,data=None if body is None else json.dumps(body).encode()),timeout=30) as r:
        return r.status,(json.load(r) if r.status!=204 else {}),r.headers
try:
    status,_,_=request('/pages','POST',{'route':route,'title':'Temporary Git verification','template':'default','header':{'published':False,'visible':False},'content':slug+' first revision'})
    assert status==201;created=True
    files=[p for p in (ROOT/'grav-site/user/pages').rglob('*.md') if slug in p.read_text()]
    assert len(files)==1,'API-created page did not appear in the checkout'
    file=files[0]
    result=subprocess.run(['git','status','--porcelain','--untracked-files=all','--',str(file.relative_to(ROOT))],cwd=ROOT,capture_output=True,text=True,check=True)
    assert str(file.relative_to(ROOT)) in result.stdout,'Content file is not visible to Git'
    _,_,headers=request('/pages'+route)
    status,_,_=request('/pages'+route,'PATCH',{'content':slug+' updated revision'},headers['ETag']);assert status==200
    assert slug+' updated revision' in file.read_text(),'API edit did not update the working file'
    if '--restart' in sys.argv:
        subprocess.run(['docker','compose','-f',str(ROOT/'compose.grav.yml'),'restart','grav'],cwd=ROOT,capture_output=True,check=True)
        for attempt in range(30):
            try:
                _,saved,_=request('/pages'+route)
                break
            except (OSError,urllib.error.URLError):time.sleep(1)
        else:raise AssertionError('Grav did not return after restart')
        assert slug+' updated revision' in saved['data']['content'],'Restart lost the saved content'
        print('PASS: saved content and the existing MCP credentials survive restart.')
    # A host-side edit must also be returned by the native API.
    file.write_text(file.read_text().replace(slug+' updated revision',slug+' local revision'))
    # Allow the VM filesystem's metadata propagation delay.
    for attempt in range(20):
        _,data,_=request('/pages'+route)
        if slug+' local revision' in data['data']['content']:break
        time.sleep(0.25)
    else:raise AssertionError('API did not read the local file edit')
    print('PASS: API creates/edits are visible to Git; local file edits are read by Grav.')
finally:
    if created:
        request('/pages'+route,'DELETE')
        if file is not None:assert not file.exists(),'API deletion did not remove the working file'
