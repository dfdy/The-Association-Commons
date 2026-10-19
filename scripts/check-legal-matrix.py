#!/usr/bin/env python3
"""Validate the versioned dataset; requires jsonschema (development-only)."""
import copy
import json
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker

root = Path(__file__).resolve().parents[1] / 'user/plugins/legal-matrix/data'
data = json.loads((root / 'legal-matrix.json').read_text())
schema = json.loads((root / 'legal-matrix.schema.json').read_text())
Draft202012Validator.check_schema(schema)
validator = Draft202012Validator(schema, format_checker=FormatChecker())
validator.validate(data)
ids = [record['id'] for record in data['records']]
assert len(ids) == len(set(ids)), 'Record IDs must be unique and stable.'
assert len(data['records']) >= 16
for record in data['records']:
    if record['last_verified']:
        assert record['last_verified'] <= record['updated_at']
    if record['review_status'] == 'verified':
        assert record['reviewer'] and record['last_verified']
        assert all(source['source_checked_on'] for source in record['sources'])

# An editor must not accidentally promote a provisional or proposed rule.
for status in ['proposed', 'uncertain', 'repealed']:
    bad = copy.deepcopy(data)
    bad['records'][0].update(generator_ready=True, review_status='verified', last_verified='2026-10-18', reviewer='Test reviewer', legal_status=status)
    assert list(validator.iter_errors(bad)), status
bad = copy.deepcopy(data)
bad['records'][0]['generator_ready'] = True
assert list(validator.iter_errors(bad)), 'Missing verification must block generator readiness.'
bad = copy.deepcopy(data)
bad['records'][0].update(generator_ready=True, review_status='verified', last_verified='2026-10-18', reviewer='Test reviewer')
assert list(validator.iter_errors(bad)), 'Unchecked source leads must block generator readiness.'
print(f'PASS: {len(ids)} legal records; JSON schema, dates, unique IDs, and generator-readiness constraints.')
