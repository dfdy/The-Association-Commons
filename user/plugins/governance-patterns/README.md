# DDC: Governance Patterns

[Editing guide](../../../docs/operations.md) · [All guides](../../../docs/README.md)

Open the Governance patterns link in the website footer to explore draft ways of
organising. Read a pattern's problem, limits, member choices, and testing evidence
before discussing whether it fits your association. These patterns are untested;
sharing a lived experience or a reason a pattern would fail is a useful contribution.
The notes below explain how to maintain the research.

## Editor and maintainer reference

Part of The Democratic Development Commons **0.3.1**.

English-only public library at `/en/governance-patterns`, linked from the shared
footer. `[governance-patterns /]` renders a searchable index and native disclosures.
The JSON dataset and schema are independent of page prose and future generator code.

## Dataset

`data/governance-patterns.json` contains seven initial patterns covering contributions,
hardship, rotating facilitation, reviewer models, federation mandates, conflict
procedures, and accessible meetings. Each has a stable ID, problem, suitability and
unsuitability conditions, implementation steps, illustrative clause, member choices,
risks, accessibility considerations, and links to related legal research.

All initial entries are `untested_draft`, legally `not_reviewed`, and not generator-ready.
The draft clauses are discussion material, not validated legal drafting. Legal links
identify questions in the legal matrix, not evidence of compliance.

## Maintaining patterns

1. Preserve record IDs and record a dataset version, edit date, and dated change history.
2. Record what members tried, the organisational context, findings, limitations, date,
   and a reference before claiming testing. Avoid identifying participants or publishing
   sensitive conflict, hardship, disability, or financial information in public evidence.
3. A `tested` record needs evidence, a last-tested date, and a reviewer. Testing in one
   setting never establishes universal suitability. Record negative findings and revise
   or retire patterns when appropriate; retain history rather than silently overwriting it.
4. Legal review is separate: record its status, date, reviewer, and notes. A reviewed
   pattern is not automatically generator-ready. Readiness additionally requires tested
   status and a review schedule. The future generator must check current applicability,
   review currency, and conflicts with applicable legal requirements.
5. Run schema/reference and browser checks before publishing edits.

The JSON Schema enforces nonempty suitability/unsuitability lists, testing evidence,
and legal-review evidence. `Library.php` additionally rejects unsupported classifications,
duplicate IDs, evidence-free tested claims, and unsupported readiness claims at runtime.

JSON downloads: `?download=json`; schema: `?download=schema`. Markdown, RTF, and PDF
exports expand the patterns into prose. Full evidence and history remain in the JSON.
No public editing endpoint is exposed.

## Dependencies and licences

Requires `legal-matrix` for its locally served DataTables 2.3.4, jQuery 3.7.1, and shared
presentation styles. No vendor library is duplicated and no external CDN is used at
runtime. Vendor MIT notices remain in `legal-matrix/assets/vendor/`.
First-party code: AGPL-3.0-only. Editorial pattern data: CC-BY-NC-SA-4.0 under the
repository licence scopes. Plugin metadata matches project version 0.3.1.

## Checks

```sh
python scripts/check-governance-patterns.py
node scripts/test-governance-patterns.cjs
```

The Python check requires the development-only `jsonschema` package. Playwright may
be selected using `PLAYWRIGHT_MODULE` and `PLAYWRIGHT_CHROMIUM_EXECUTABLE`; `GRAV_URL`
defaults to `http://localhost:8388`.

Passed: PHP/JavaScript syntax, schema, legal references, evidence/readiness rejection,
search and combined filters, reset focus, keyboard disclosure, fragment-link focus,
JSON/schema and document exports, English-only rendering, footer links, no-JavaScript
content, and forced-colour focus. Screen-reader and real speech testing remain outstanding.

Axe-core 4.10.3 reported no WCAG-tagged violations on the full library page in day
and night modes; ARIA and colour-contrast manual-review items remain. Layout also
passed at 400% text in a 320px viewport. Automated checks do not establish conformance.

## Licence scope

The first-party research records in `data/governance-patterns.json` are editorial
content under CC BY-NC-SA 4.0. The validation schema, plugin code, and technical
documentation are AGPL-3.0-only. Cited third-party sources retain their own terms.
See the [repository licence map](../../../LICENSING.md#where-each-licence-applies).
