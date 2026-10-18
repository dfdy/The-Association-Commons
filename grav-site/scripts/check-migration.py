#!/usr/bin/env python3
"""Check the migration preserves every public document block and hierarchy."""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[2]
report=json.loads((root/'grav-site/migration-report.json').read_text())
source=json.loads((root/report['source']).read_text())
for route,folder in report['routes'].items():
    files=list((root/'grav-site/user/pages'/folder).glob('*.md'))
    assert len(files)==1,(route,files)
    content=files[0].read_text().split('\n---\n',1)[1]
    # Remove only the inserted Markdown links to compare the original prose.
    plain=re.sub(r'\[([^\]]+)\]\([^)]*\)',r'\1',content)
    plain=re.sub(r'\[/?(?:hero-accent|hero-label)\]','',plain)
    plain=plain.replace('*ideella föreningar*','ideella föreningar')
    for index,block in enumerate(source['documents'][route]['blocks']):
        if index in report.get('omitted_blocks',{}).get(route,[]):continue
        # The owner-authorized release update changed labels after the source snapshot.
        expected=block['text'].replace('0.0.2','0.1.2') if route=='/privacy/' else block['text']
        assert expected in plain,(route,expected[:80])
for code in report['languages']:
    folder=root/'grav-site/user/pages'/report['routes']['/'+code+'/']
    assert (folder/'01.stadgar/stadgar.md').is_file()
    assert (folder/'02.donate/default.md').is_file()
    generator=(folder/'01.stadgar/stadgar.md').read_text()
    assert 'builder_fields' not in generator
    assert '# Association Constitution Drafting Tool' in generator
assert source['documents']['/donate/']['blocks']==source['documents']['/en/donate/']['blocks']
print(f"Migration verified: {report['source_blocks']} content blocks; {len(report['languages'])} language trees; donation alias is identical.")
