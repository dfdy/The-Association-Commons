# DDC: Project Interest

[Editing guide](../../../docs/operations.md) · [All guides](../../../docs/README.md)

Visitors can express interest through **Join** or **Contact** on the running site.
Read the privacy notice before entering details. The form sends records to the
operator of that copy of the site; it does not create membership, subscribe anyone,
or send an automatic email. The notes below explain placement and private handling.

## Editor and maintainer reference

Part of The Democratic Development Commons **0.3.1**.

Place `[project-interest /]` on its own line to show the form. It is installed under
**Join** on all language proposals and on the English Contact page. Bundled language
files provide translated labels and messages, with English fallback and written-English
support for SASL. Use one tag per page. The page must be published and routable,
meaning visitors can reach it at its website address. Placement does not create membership.

## Behaviour

Collects required name, email, and consent, plus optional organisation/community and
participation message. Successful submissions are stored privately; no emails,
mailing-list subscriptions, membership approvals, or external forwarding occur.
JavaScript adds in-place validation and confirmation. Without it, the server renders
errors and redirects successful submissions back to the page with a one-use session
confirmation. A success response is sent only after storage succeeds.

The form uses the native Grav session and session-bound nonce, an expiring issued-form
identifier, same-origin checks, bounded server-side validation, a honeypot, and a
per-connection limit (default ten successful records per hour). Repeated submissions
of the same form ID return success without saving another record. Submission data is
escaped when redisplayed. Server error responses never include submitted details.

Pages containing the tag opt out of page caching and return `Cache-Control: private,
no-store`. Exports replace the tag with a link to the web form; tokens and fields are
not included. Configure secure session cookies when serving the production site over
HTTPS. The form can still submit if JavaScript is unavailable, but requires session
cookies for request verification.

## Private storage and maintenance

Records live in `user/data/commons-private/project-interest/` in the Grav data volume.
The directory is mode 0700 and files are mode 0600. Apache denies HTTP access to the
private data tree. The corresponding checkout location is also ignored by Git.
Records include a random ID, UTC timestamp, source route/language, supplied fields,
consent confirmation, and consent-notice version (`0.3.0-2026-10-18` for new records). Raw IP addresses and user agents are
not added to submission records. Rate counters use a keyed IP hash and expire after an
hour; shared connections share the quota.

Super-admins can open **Admin → Project interest** (`/admin/plugin/project-interest`)
to search records, read every submitted field and metadata item, and delete an
individual submission after confirmation. The table lists date (UTC), name, email, and community and message excerpts (up to 80 characters). Each Open link displays the complete entry, including metadata, with a Back to submissions link. Keyboard focus moves to the entry heading and returns to its Open link. The list is paginated at 25 records.
The JSON endpoints require `admin.super`, enforce API-key scope caps, and send
`Cache-Control: private, no-store`. Ordinary content editors and the MCP account
are denied. Submitted values are inserted into the admin DOM as text, not HTML.
Deleting removes active storage only; backups require separate handling.

Authorised server operators can also use the CLI-only maintenance tool (404 over HTTP):

```sh
docker compose -f compose.yaml exec --user www-data grav php user/plugins/project-interest/manage.php list
docker compose -f compose.yaml exec --user www-data grav php user/plugins/project-interest/manage.php show RECORD_ID
docker compose -f compose.yaml exec --user www-data grav php user/plugins/project-interest/manage.php delete RECORD_ID
docker compose -f compose.yaml exec --user www-data grav php user/plugins/project-interest/manage.php cleanup 90
```

Run these commands separately from the repository root. Replace `RECORD_ID` with
the actual ID from the list. `delete` removes the chosen active record, and
`cleanup` removes expired records; neither removes backup copies.

`list` prints only IDs and timestamps; `show` deliberately reveals that one private
record to the authorised operator. Do not paste real records into public issues,
logs, or commits. Access to the server/container must remain restricted.

`retention_days` defaults to 90 and `hourly_limit` to 10 in `project-interest.yaml`.
Expired records are purged during later submission handling and administrative listing; schedule the
cleanup command for deletion independent of traffic. Pass the configured retention
days to scheduled cleanup, and manage backups separately. The privacy policy now
records the Grav implementation; responsible-party/contact details remain pending as
already noted there. Review those details and production retention before launch.

## Checks

- PHP syntax and isolated `scripts/test-project-interest-store.php`: validation,
  malicious field types, length limits, honeypot, rate limiting, idempotency, private
  permissions, and expiry cleanup.
- Playwright `scripts/test-project-interest.cjs`: placement, names, CSRF/origin
  rejection, validation summaries and focus, successful private save, duplicate retry,
  no-JavaScript save/confirmation, protected storage, exports, and 400% narrow layout.
- Axe-core 4.10.3 found no WCAG-tagged violations in the form in day/night modes;
  colour-contrast manual-review items remain. Screen-reader testing is unperformed.

Browser checks write clearly synthetic records. `INTEREST_TEST_IDS` can select a local
JSON file containing their IDs for cleanup; never use real contact details in tests.
The store test uses an isolated temporary directory and removes it afterwards.


## Back-end verification

`scripts/test-project-interest-admin.cjs` creates isolated synthetic admin/editor
accounts and a test record using its CLI-only fixture, then removes them in cleanup.
It checks anonymous and content-editor denial, super-admin reads/search/deletion,
private cache headers, cached-route autoloading, sidebar/page discovery, escaped
submitted text, and keyboard cancel/delete focus. API routes use the core super-admin
permission gate, including scoped-key restrictions. No MCP tools expose these records.

The table action toggles between Open and Close, with an accessible expanded state.
Opening another entry resets the previous row to Open.

Admin lists use Grav colour tokens, shaded headers and alternating rows, readable UTC dates,
separate entry-detail cards, and a responsive search panel. Light/dark axe checks and
320-pixel layout checks pass; screen-reader testing remains outstanding.

## Language editions

The shortcode is included under Join in English and all translated proposal pages,
including written-English support on the SASL proposal. Bundled `languages/*.json` files translate
labels, consent, validation, and JavaScript status messages; English is the fallback.
The form exposes the edition's language to assistive technology and preserves user
input verbatim. Source route and language code are stored with each private record.
No submission is sent to a translation service. Page exports link back to the form
on the corresponding language proposal. Kaaps wording is an Afrikaans-based draft
requiring community review, as stated on its pages.

The English `/en/contact` page also uses the interest shortcode for participation
enquiries and community-led translation proposals, with the same private storage,
retention, consent, and super-admin access as the proposal forms.
