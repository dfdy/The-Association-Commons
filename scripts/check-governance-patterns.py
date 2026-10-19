#!/usr/bin/env python3
"""Validate pattern structure, evidence gates, and legal-record references."""
import copy
import json
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker
root = Path(__file__).resolve().parents[1] / 'user/plugins'
data = json.loads((root/'governance-patterns/data/governance-patterns.json').read_text())
schema = json.loads((root/'governance-patterns/data/governance-patterns.schema.json').read_text())
Draft202012Validator.check_schema(schema)
validator = Draft202012Validator(schema, format_checker=FormatChecker())
validator.validate(data)
ids = [p['id'] for p in data['patterns']]
assert len(ids) == len(set(ids))
assert len({p['category'] for p in data['patterns']}) == 7
legal = {r['id'] for r in json.loads((root/'legal-matrix/data/legal-matrix.json').read_text())['records']}
for pattern in data['patterns']:
    assert set(pattern['legal_record_ids']) <= legal
    if pattern['last_tested']:
        assert pattern['last_tested'] <= pattern['updated_at']
for updates in [{'testing_status':'tested'}, {'generator_ready':True}, {'legal_review_status':'reviewed'}]:
    invalid = copy.deepcopy(data)
    invalid['patterns'][0].update(updates)
    assert list(validator.iter_errors(invalid)), 'Evidence-free promotion must fail.'
valid = copy.deepcopy(data)
valid['patterns'][0].update(testing_status='tested', last_tested='2026-10-18', reviewer='Test reviewer', test_evidence=[dict(date='2026-10-18',context='Synthetic validation case',findings='Schema accepts complete evidence',limitations='Not real field evidence',reference='Test fixture only')])
validator.validate(valid)
valid['patterns'][0]['generator_ready'] = True
assert list(validator.iter_errors(valid)), 'Testing alone must not establish readiness.'
print(f'PASS: {len(ids)} patterns; all categories; schema; legal references; testing evidence and readiness gates.')
