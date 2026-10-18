#!/usr/bin/env python3
"""Smoke-test the registered official stdio MCP server without exposing its key."""
import json,subprocess,sys
from pathlib import Path
root=Path(__file__).resolve().parents[2]
p=subprocess.Popen([sys.executable,str(root/'grav-site/codex-bridge.py')],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,cwd=root)
def call(number,method,params):
    p.stdin.write(json.dumps({'jsonrpc':'2.0','id':number,'method':method,'params':params})+'\n');p.stdin.flush()
    while True:
        line=p.stdout.readline()
        if not line:raise RuntimeError('MCP ended before responding: '+p.stderr.read()[:350])
        result=json.loads(line)
        if result.get('id')==number:
            assert 'error' not in result,result.get('error')
            return result['result']
try:
    init=call(1,'initialize',{'protocolVersion':'2024-11-05','capabilities':{},'clientInfo':{'name':'commons-smoke','version':'1'}})
    p.stdin.write(json.dumps({'jsonrpc':'2.0','method':'notifications/initialized'})+'\n');p.stdin.flush()
    catalog=call(2,'tools/list',{})
    print('Official MCP server:',init.get('serverInfo'),'; advertised tools:',len(catalog['tools']))
    for name in ['list_pages','get_page']:
        tool=next(t for t in catalog['tools'] if t['name']==name)
        print(name,'schema:',json.dumps(tool['inputSchema']))
    result=call(3,'tools/call',{'name':'list_pages','arguments':{}})
    assert not result.get('isError'),result
    text=' '.join(c.get('text','') for c in result.get('content',[]))
    assert '/en' in text and '/zu' in text,text[:300]
    print('MCP list_pages succeeded; English and Zulu roots returned.')
    result=call(4,'tools/call',{'name':'get_page','arguments':{'route':'/en','children':True}})
    assert not result.get('isError'),result
    body=' '.join(c.get('text','') for c in result.get('content',[]))
    assert 'The freedom to organise.' in body and 'stadgar' in body,body[:250]
    print('MCP get_page returned the English proposal and its children.')
finally:
    p.terminate();p.wait(timeout=10)
