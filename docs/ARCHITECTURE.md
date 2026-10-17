# Container and content architecture

## Data flow

On a fresh `docker compose up`, Compose builds the software image, waits for a
healthy PostgreSQL service, runs the seed importer and then starts the HTTP server.
All database initialization runs inside one transaction under an advisory lock.
The migration marker is committed with the seed. An interrupted import rolls back;
a later start can retry. The seed is never applied over an installed database.

The Node HTTP adapter translates requests to the existing Fetch-based application
runtime. The UI, language routing, speech reader and exports retain their previous
behaviour. The existing application storage contract is implemented by parameterized
PostgreSQL queries instead of Cloudflare object storage in the Docker deployment.
No Cloudflare, OpenAI, browser-PDF or paid API service is required to run the stack.
Browser speech still depends on voices supplied by the visitor's browser/device.

## Content schema

- `content.pages(filename, body, updated_at)`: current page HTML, including layout
  markup. HTML is preserved byte for byte. There are no inline JavaScript programs
  in the seed pages; behaviour lives in `software/public/`.
- `content.strings(key, value, updated_at)`: text, UI labels and markup fragments
  previously embedded in JavaScript. Initial keys are stable SHA-256 identities.
  Edits retain their existing key; do not recompute it when updating a value.
- `content.documents(path, document, updated_at)`: structured blocks/links used for
  PDF, Markdown and RTF exports, including the complete Prefiguration text.
- `content.settings(key, value, updated_at)`: bilingual stadgar schema/defaults,
  language registry, and language/project mappings.
- `content.state`: original seed commit, fixed displayed version and change revision.
- `content.migrations`: applied schema/seed versions.
- `private.records(key, body, submitted_at)`: private submissions, keyed using the
  existing request IDs. Suggestions use an upsert so retries do not add votes.

Application code, rendering algorithms and SQL migrations are not database content.
The JavaScript templates use opaque text placeholders. Database values are inserted
as escaped JSON string literals, never evaluated as executable code. The runtime
factory is rebuilt from trusted software with those literal values when content
changes. Frontend code and CSS stay in the software image. Third-party fonts and
PDFKit remain software assets with their supplied notices.

## Read consistency and cache

Every request checks the content revision. A changed revision loads the public
content in a repeatable-read, read-only transaction and atomically replaces the
runtime snapshot. Concurrent requests share an in-flight refresh. Content updates
must be transactional to publish related page, text and export-model changes
consistently. Private submissions do not invalidate public content caches.

Each application instance has its own cache and in-memory suggestion abuse counter.
The current Compose file runs one web instance. A future multi-instance deployment
should move rate limiting to shared storage or the proxy. The database, not the
web container filesystem, holds persistent state.

## Future administration backend

A future backend should connect to the existing schema with a dedicated database
role and expose authenticated, authorized content operations, not arbitrary SQL.
Add content revisions, audit history, safe HTML editing, validation, CSRF controls,
and a restricted publishing workflow. Page text, UI fragments and export blocks
are separately represented to preserve current behaviour during this migration;
the editor must update related representations together. A later structured-content
model can unify them without coupling the editor to the frontend runtime.

There is currently no public database editor, content write endpoint, submission
listing endpoint or administration login. The public suggestion endpoint returns
only aggregate language names and tallies. New API/admin work belongs in software;
new translations and editorial material belong in the database.

## Boundaries and deployment defaults

The web container runs as the non-root Node user, with a read-only filesystem,
no Linux capabilities and temporary `/tmp`. PostgreSQL is on an internal network
with no host port. Only the web server binds a host port, on localhost by default.
The database credentials embedded in Compose intentionally make a fresh local
installation require no configuration. Public production hosting must choose its
own credentials, TLS termination, operator details, access rules and backup policy.

The hosted Sites build is a compatibility target, not a PostgreSQL emulator. It
materializes the same content seed into a Worker snapshot and retains the hosted
storage interface. Existing hosted submissions are not in the seed or source ZIP.
The Docker build does not include the generated Worker or depend on Sites tooling.

The initial snapshot matches commit
`69f6387a868d491b1c20707157056a9be23ca4a8`. Baseline page hashes, normalized script
AST hashes and text-export hashes in the seed make content parity reviewable.
The displayed site version remains `0.0.2`.

## Privacy policy startup override

The Docker web service mounts root `privacy-policy.yaml` read-only at
`/config/privacy-policy.yaml`. Before creating its content cache or HTTP listener,
it validates the YAML and imports its `section_html` and `document` into the
installed privacy page and export model in one transaction under the initialization
advisory lock. Unchanged values cause no row updates or revision change. Errors
prevent startup; a failed transaction preserves the previous policy.

This is an explicit exception to database-only editorial authority: the YAML
controls this section and export model on every web start. Other page layout and
content remain in PostgreSQL. The YAML stays outside the software image and
software source download and retains CC BY-NC-SA 4.0 terms. It contains trusted
operator-maintained HTML and a matching structured export model, with no executable
software. The importer validates the format; it does not sanitize untrusted HTML.
