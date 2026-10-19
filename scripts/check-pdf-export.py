#!/usr/bin/env python3
"""Inspect samples from test-pdf-export.cjs: requires the development pymupdf package."""
import re
import sys
from datetime import datetime
from zoneinfo import ZoneInfo
from pathlib import Path

import pymupdf

directory = Path(sys.argv[1])
root = Path(__file__).resolve().parents[1]
css = (root / 'user/themes/commons/css/site.css').read_text()
day = re.search(r':root\{[^}]*background:(#[0-9a-f]{6})', css)[1]
night = re.search(r'html\[data-theme="night"\]\{[^}]*background:(#[0-9a-f]{6})', css)[1]
rgb = lambda value: tuple(int(value[index:index + 2], 16) for index in (1, 3, 5))

for name, colour in [('framework-day', day), ('framework-night', night), ('isizulu-night', night), ('white-paper-night', night), ('legal-matrix-night', night), ('cookie-night', night)]:
    document = pymupdf.open(directory / (name + '.pdf'))
    assert len(document) > 0, name
    text = ''.join(page.get_text() for page in document)
    assert len(text) > 100, name + ': text must remain selectable'
    assert 'CC BY-NC-SA 4.0' in text, name + ': attribution'
    first_page = document[0].get_text()
    assert 'The Democratic Development Commons' in first_page, name + ': first-page project name'
    assert '© The Democratic Development Commons' in first_page, name + ': first-page copyright'
    assert 'CC BY-NC-SA 4.0' in first_page, name + ': first-page licence'
    release = re.search(r'^version:\s*(\S+)', (root / 'user/plugins/commons/blueprints.yaml').read_text(), re.M)[1].strip('\"\'')
    assert 'DDC software version ' + release in first_page, name + ': first-page software version'
    today = datetime.now(ZoneInfo('Africa/Johannesburg')).strftime('%d %B %Y').lstrip('0')
    assert 'Exported ' + today in first_page, name + ': first-page export date'
    assert 'Marked true' in document.xref_get_key(document.pdf_catalog(), 'MarkInfo')[1], name + ': PDF tags'
    for index in {0, len(document) - 1}:
        pixmap = document[index].get_pixmap()
        pixel = pixmap.pixel(3, 3)[:3]
        assert all(abs(a - b) <= 3 for a, b in zip(pixel, rgb(colour))), (name, index, pixel, colour)
    if name.startswith('framework-'):
        spans = [span for page in document for block in page.get_text('dict')['blocks']
                 for line in block.get('lines', []) for span in line['spans']]
        body_spans = [span for span in spans if span['text'].startswith('Prefigurative politics')]
        assert body_spans and all(abs(span['size'] - 10) < 0.05 for span in body_spans), name + ': 10pt body text'
        hero_spans = [span for span in spans if span['text'].startswith('The freedom to')]
        assert hero_spans and abs(hero_spans[0]['size'] - 50 / 1.08) < 0.05, name + ': proportional hero heading'
        section_page = next(page for page in document if page.search_for('01 / THE IDEA'))
        label = section_page.search_for('01 / THE IDEA')[0]
        heading = section_page.search_for('Association begins with people.')[0]
        assert label.y1 <= heading.y0 and abs(label.x0 - heading.x0) < 1, name + ': section label above full-width text'
        assert 'Open the participation form on the website' in text, name
        assert 'form_id' not in text and 'name="nonce"' not in text, name
        assert any(page.get_links() for page in document), name + ': clickable links'
    # Review first pages and the final page without creating images of the entire document.
    for index in {0, min(1, len(document) - 1), len(document) - 1}:
        document[index].get_pixmap(matrix=pymupdf.Matrix(0.9, 0.9)).save(directory / f'{name}-page-{index + 1}.png')
    print(f'PASS: {name}: {len(document)} pages, selected palette, selectable text, attribution, and PDF tags.')
