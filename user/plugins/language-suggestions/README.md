# DDC: Language Suggestions

[Editing guide](../../../docs/operations.md) · [All guides](../../../docs/README.md)

Choose **Suggest a language** in the footer, enter a language name, and confirm the
registered match if asked. Read the feedback before submitting again. Public totals
count accepted suggestions, not unique people or a binding vote about which language
will be added. Adding an edition still needs people, review, and a shared decision.
The maintenance notes below are for editors and operators.

## Editor and maintainer reference

Project release: **0.3.2**. First-party Grav plugin, AGPL-3.0-only.

Place `[language-suggestions /]` in a published, routable Markdown page with shortcode
processing enabled. The English page is `/en/languages`, linked as **Suggest a language**
in the shared footer. It omits project tabs and keeps page downloads.

The plugin restores the original site's registered-language matching and public
counts. The bundled `data/languages.json` is copied from the retired site's
`content/seed.json` IANA registry snapshot dated 2026-09-17. It includes canonical
codes/names and aliases, requires no remote request, and must be updated deliberately
when registry changes are needed. Source: https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry.

Exact unambiguous matches can be submitted directly. Close spelling matches (including
adjacent transpositions) and ambiguous names require a native select confirmation;
the server checks that the selected code matches the typed name. Existing editions
are rejected, including Kaaps and SASL. No contact fields are collected. Only a random
ID, canonical name/code, and UTC timestamp are saved. The spelling entered is not saved.

Public tallies contain names and counts only. Counts represent accepted submissions,
not unique people, and cover retained records rather than permanent historical votes.
There is no import of the retired site's suggestions.

## Private administration and retention

**Admin → Language suggestions** is super-admin only. The searchable, paginated table
shows date, language, code, and an Open link to the full entry. Keyboard focus moves
to the entry heading and returns to Open via Back to submissions. Delete requires
confirmation. Ordinary editors and the MCP account are denied. API routes:

- `GET /api/v1/language-suggestions/submissions?page=1&q=French`
- `DELETE /api/v1/language-suggestions/submissions/{id}`

Both require `admin.super` and honour API scope caps; responses are private/no-store.
All submitted text is escaped on the public page and inserted with `textContent` in
the administration view.

Records live in `user/data/commons-private/language-suggestions/` with private directory
and file permissions, excluded from Git and blocked from direct web access. Storage
uses locking, atomic writes, and idempotent retries. Session-bound nonces and issued
form IDs expire after one hour, with same-origin checks, field/body limits, a honeypot,
and separate keyed-IP rate counters (default ten accepted suggestions per hour).
Raw IP addresses and user-agent strings are not saved in records.

Configure `hourly_limit` and `retention_days` in plugin settings. Default retention is
90 days, minimum one, with no configured upper bound. Cleanup runs on public tally
loads, administrative listing, submission processing, or manual maintenance. Schedule
cleanup for deletion independently of traffic. Backups have separate retention.

```sh
docker compose exec --user www-data grav php user/plugins/language-suggestions/manage.php list
docker compose exec --user www-data grav php user/plugins/language-suggestions/manage.php show RECORD_ID
docker compose exec --user www-data grav php user/plugins/language-suggestions/manage.php delete RECORD_ID
docker compose exec --user www-data grav php user/plugins/language-suggestions/manage.php cleanup 90
```

Run the commands separately from the repository root. Replace `RECORD_ID` with
the actual ID. `show` displays that record; `delete` removes it from active storage,
and `cleanup` removes expired records. Keep displayed records private.

The maintenance tool is CLI-only, meaning it runs in a terminal, not a web page.
Pass the configured retention to scheduled cleanup.
The English privacy notice documents this collection. Downloads replace the form
with a link and contain no tokens or private entries.

## Verification

`test-language-suggestions.cjs`, `test-language-suggestions-admin.cjs`, and
`test-language-suggestions-store.php` cover matching/confirmation, validation,
existing-edition rejection, CSRF/origin checks, private paths, deduplication, rate
limits, retention, permissions, no-JavaScript submission, public counts, exports,
admin authorisation/search/deletion, focus return, and 400% text at a narrow viewport.
Browser tests use temporary submissions/accounts and remove them afterward.
Automated axe checks pass for the form and administrative component; keyboard focus
and semantic names/states are checked. Screen-reader testing remains unperformed;
these checks do not establish WCAG conformance.

The table action toggles between Open and Close, with an accessible expanded state.
Opening another entry resets the previous row to Open.

Admin lists use Grav colour tokens, shaded headers and alternating rows, readable UTC dates,
separate entry-detail cards, and a responsive search panel. Light/dark axe checks and
320-pixel layout checks pass; screen-reader testing remains outstanding.
