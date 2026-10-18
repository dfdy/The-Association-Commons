#!/usr/bin/env python3
"""Import public content only. Run explicitly; never overwrite live Grav edits."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
source=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'.local/grav-source.json'
data=json.loads(source.read_text())
docs=data['documents']; settings=data['settings']; out=ROOT/'grav-site/user/pages'
names={'en': 'English', 'af': 'Afrikaans', 'af-x-kaaps': 'Kaaps', 'nr': 'isiNdebele', 'nso': 'Sepedi', 'sasl': 'SASL', 'ss': 'siSwati', 'st': 'Sesotho', 'tn': 'Setswana', 'ts': 'Xitsonga', 've': 'Tshivenḓa', 'xh': 'isiXhosa', 'zu': 'isiZulu'}
codes=[r.strip('/') for r in docs if len(r.strip('/').split('/'))==1 and r not in ['/donate/','/languages/','/privacy/','/licence/']]
codes=sorted(codes,key=lambda x:(x not in ['en','sv'],x!='en',x))
folders={c:f'{i+1:02}.{c}' for i,c in enumerate(codes)}
# Swedish was explicitly removed from Grav; retain the other folder numbers.
codes=[c for c in codes if c!='sv']

def local(url,code):
    if url=='/stadgar/':return f'/{code}/stadgar'
    if url=='/donate/':return '/en/donate'
    if url=='/languages/':return '/en/languages'
    if url.rstrip('/') in ['/privacy','/licence','/licence/content','/licence/software','/white-paper']:return '/en'+url
    return url

def markdown(doc,code):
    blocks=[]
    for b in doc['blocks']:
        text=b['text']; links=b.get('links',[])
        # Preserve all text; add source links without hiding or rewriting wording.
        for link in links:
            url=local(link,code)
            if link=='/stadgar/' and 'stadgar builder' in text:
                text=text.replace('stadgar builder',f'[stadgar builder]({url})')
            else:text+=f' ([Link]({url}))'
        prefix={'h1':'# ','h2':'## ','h3':'### ','li':'- '}.get(b['type'],'')
        blocks.append(prefix+text)
    return '\n\n'.join(blocks)+'\n'

def write(folder,template,header,body):
    p=out/folder;p.mkdir(parents=True,exist_ok=True)
    # JSON is a YAML subset: avoids an additional migration dependency.
    (p/(template+'.md')).write_text('---\n'+json.dumps(header,ensure_ascii=False,indent=2)+'\n---\n\n'+body)

mapped={};total=0;omitted={}
for route,doc in docs.items():
    if route=='/donate/' or route=='/sv/' or route.startswith('/sv/'):continue
    parts=route.strip('/').split('/');code=parts[0] if parts[0] in codes else 'en'
    if parts[0] in codes:
        folder=folders[code]+('/02.donate' if parts[1:]==['donate'] else '/03.languages' if parts[1:]==['languages'] else '')
    elif route=='/languages/':folder=folders['en']+'/03.languages'
    elif parts[0]=='privacy':folder=folders['en']+'/06.privacy'
    elif parts[0]=='licence':folder=folders['en']+'/05.licence'+''.join('/0'+str(i+1)+'.'+p for i,p in enumerate(parts[1:]))
    else:folder='90.'+parts[0]+''.join('/0'+str(i+1)+'.'+p for i,p in enumerate(parts[1:]))
    template='proposal' if route.strip('/') in codes else 'default'
    title=names.get(code,code) if template=='proposal' else doc['title'].split(' — ')[0]
    header={'title':title,'language_code':code,'language_name':names.get(code,code),'published':True,'visible':template=='proposal','source_route':route,'content_license':'CC BY-NC-SA 4.0'}
    if template=='proposal':header['language_sort']=names[code].casefold()
    imported=dict(doc)
    if template!='proposal':
        # Explicitly verify the known source block before omitting it from other pages.
        assert doc['blocks'][:3]==docs['/en/']['blocks'][:3], 'Unexpected source layout: '+route
        imported['blocks']=doc['blocks'][3:]
        omitted[route]=[0,1,2]
    write(folder,template,header,markdown(imported,code));mapped[route]=folder;total+=len(imported['blocks'])
for code in codes:
    sv=code=='sv';i=int(sv)
    fields=[{'id':f['id'],'label':f['label'][i],'value':f['value'][i],'required':bool(f.get('required')),'group':f['group']} for f in settings['stadgarSchema']]
    body='# '+('Skapa era stadgar' if sv else 'Create your stadgar')+'\n\n'+('Anpassa mallen tillsammans. Era svar sparas inte på servern.' if sv else 'Adapt this template together. Your answers are not saved on the server.')+'\n\n'
    if code not in ['en','sv']:body+='The builder is shown in English; a translation is not yet available.\n\n'
    body+='This is a discussion template, not a substitute for advice about applicable law.\n'
    write(folders[code]+'/01.stadgar','stadgar',{'title':'Stadgar','language_code':code,'language_name':names.get(code,code),'published':True,'visible':True,'builder_fields':fields},body)
(ROOT/'grav-site/migration-report.json').write_text(json.dumps({'source':str(source.relative_to(ROOT)),'source_documents':len(docs),'imported_documents':len(mapped),'source_blocks':total,'languages':codes,'routes':mapped,'omitted_blocks':omitted,'alias':{'/donate/':'/en/donate'}},indent=2)+'\n')
print(f'Imported {len(mapped)} documents ({total} blocks), plus {len(codes)} stadgar builders.')
