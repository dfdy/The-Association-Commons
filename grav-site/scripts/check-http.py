#!/usr/bin/env python3
"""Verify public routes, exports and API isolation against the local Grav trial."""
import json,subprocess,urllib.request,urllib.error
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];base='http://localhost:8388'
report=json.loads((ROOT/'grav-site/migration-report.json').read_text())
def request(path,data=None,headers=None):
    try:
        with urllib.request.urlopen(urllib.request.Request(base+path,data=data,headers=headers or {}),timeout=45) as r:return r.status,r.read(),r.headers
    except urllib.error.HTTPError as e:return e.code,e.read(),e.headers
for route in report['routes']:
    status,body,_=request(route)
    assert status==200,(route,status)
for removed in ['/sv','/sv/stadgar','/sv/donate','/sv/languages']:
    status,_,_=request(removed);assert status==404,(removed,status)
for code in report['languages']:
    status,body,_=request('/'+code+'/stadgar');assert status==200 and b'Association Constitution Drafting Tool' in body and b'id="stadgar-form"' not in body,(code,status)
for route in ['/en','/zu','/en/donate','/en/licence/software','/en/privacy']:
    for fmt,signature in [('md',None),('rtf',b'{\\rtf'),('pdf',b'%PDF-')]:
        status,body,headers=request(route+'?download='+fmt)
        assert status==200 and (not signature or body.startswith(signature)),(route,fmt,status,body[:100])
        assert 'attachment' in headers.get('Content-Disposition','')
for path in ['/user/data/commons-private/mcp-key','/user/data/commons-private/admin-login.txt','/user/accounts/admin.yaml','/user/config/plugins/api-private.php','/user/pages/01.en/proposal.md']:
    status,body,_=request(path);assert status in [403,404],(path,status)
status,_,_=request('/api/v1/pages');assert status==401,status
result=subprocess.run(['docker','compose','-f',str(ROOT/'compose.grav.yml'),'exec','-T','--user','www-data','grav','cat','/var/www/html/user/data/commons-private/mcp-key'],capture_output=True,text=True,check=True)
headers={'X-API-Key':result.stdout.strip()}
status,body,_=request('/api/v1/pages',headers=headers);assert status==200,(status,body[:120])
status,body,_=request('/api/v1/users',headers=headers)
assert status==200 and [u['username'] for u in json.loads(body)['data']]==['codex-editor']
for path in ['/api/v1/users/admin','/api/v1/config/system']:
    status,_,_=request(path,headers=headers);assert status==403,(path,status)
status,body,_=request('/en/stadgar?download=md');assert status==200 and b'Association Constitution Drafting Tool' in body
print('PASS: all migrated routes and generator descriptions; Markdown/RTF/PDF; private-file protection; anonymous API rejection; MCP can read pages but cannot access other accounts/config; generator description download.')
