# DDC: Legal Matrix

An English-only public research matrix at `/en/legal-matrix`, linked from the shared
footer. `[legal-matrix /]` renders the dataset as semantic HTML, two research indexes,
and native detail disclosures. DataTables adds search, intersecting filters, and
sorting. Every record remains readable without JavaScript; no client state is saved.

## Files and updates

- `data/legal-matrix.json`: canonical dataset, independent of page prose and generator code.
- `data/legal-matrix.schema.json`: JSON Schema 2020-12 definition.
- `Matrix.php`: server rendering, plain-Markdown export, and readiness validation.
- `assets/vendor/`: locally served DataTables 2.3.4 and jQuery 3.7.1, with MIT licences.

The plugin's first-party code uses AGPL-3.0-only; editorial data uses CC-BY-NC-SA-4.0
under the repository's licence scopes. Vendored code retains its MIT licences.

Keep stable record IDs: record links use `#legal-record-ID`. Forms, registration/tax
statuses, and activities are distinct dimensions. Provision classification, legal
status, and review status are independent. A `legal_requirement` classification on
an unverified record is a research candidate, not a finding that a duty applies.

The initial 16 records derive from white paper §§3, 21, and 25.2. They include
candidate source leads, not a completed legal review. Every initial record has
`awaiting_verification`, `last_verified: null`, and `generator_ready: false`.
The reform record preserves the white paper's historical description; it makes no
claim that the bill's present parliamentary status was independently checked.

To update a record:

1. Check primary sources, including amendments, commencement, and scope conditions.
2. Record the precise legal basis/locator, source-check date, applicability conditions,
   effective dates, reviewer, verification date, and review schedule where established.
3. Keep absent knowledge as `null`, not a guessed date. An edit date is not verification.
4. Add a dated change-history entry; update record/dataset edit dates and dataset version.
5. Run the schema and browser checks before committing. Proposed, uncertain, repealed,
   or unverified records cannot be marked generator-ready. The future generator must
   additionally evaluate applicability and review currency; this plugin is not a rule engine.

JSON and schema downloads use `/en/legal-matrix?download=json` and `?download=schema`.
The existing Markdown, RTF, and PDF downloads contain the matrix's research prose
rather than an unresolved shortcode. The full JSON is the authoritative structured export.
No public editing endpoint is exposed: review updates in Git.

## Validation

Install the development-only `jsonschema` package in a virtual environment, then run:

```sh
python grav-site/scripts/check-legal-matrix.py
node grav-site/scripts/test-legal-matrix.cjs
```

The browser test uses Playwright. `PLAYWRIGHT_MODULE`,
`PLAYWRIGHT_CHROMIUM_EXECUTABLE`, and `GRAV_URL` can select existing local tools.

Checks performed: PHP/JavaScript syntax; JSON Schema, unique IDs, dates, and rejected
unsafe readiness changes; English-only rendering; search and combined filters;
separate reforms; reset focus; keyboard disclosure and fragment-link focus;
JSON/schema and Markdown/RTF/PDF exports; a 320px viewport at 200% text size;
forced-colour focus; no-JavaScript content; and the shared footer link.
The existing read-aloud regression suite also passed after the shared table-wrapper
repair. Automated accessibility checks do not establish WCAG conformance.
Screen-reader and real speech testing remain outstanding.

Axe-core 4.10.3 reported no WCAG-tagged violations in the matrix or full page in day
and night modes. It flagged manual-review items for ARIA/dialog references and
colour contrast; these remain for manual review and do not replace assistive-technology testing.
