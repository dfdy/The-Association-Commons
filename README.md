# Voluntary Associations: The Association Commons

![The freedom to organise — a proposed South African law for voluntary associations, inspired by the Swedish tradition of ideella föreningar.](docs/images/association-commons-freedom-to-organise.png)

The current multilingual website, packaged for self-hosting with PostgreSQL.
Displayed version: **0.0.2**. Do not increment it without the project owner's instruction.

## Run the website

Install Docker with Docker Compose v2, extract this project, then run from its directory:

```sh
docker compose up
```

Open **http://localhost:8380** once the web service is healthy. No `.env` file,
manual database setup, configuration edits, Node installation or separate build
command is needed. The first run downloads the images/dependencies and builds the
software image. `docker compose up -d` runs the same stack in the background.
Use `docker compose logs -f web seed` to inspect startup.

The stack has three services:

- `db`: PostgreSQL 17, with a persistent named volume and no published database port.
- `seed`: waits for PostgreSQL, creates the schema and imports the current content
  transactionally on first installation, then exits successfully.
- `web`: starts after the seed service succeeds; serves the website on port 8380.

The default web binding is localhost, so starting the stack does not make it public.
The Compose file includes working local database credentials. These are development
and single-host defaults, not deployment-specific secrets. For public hosting, put
this stack behind your HTTPS reverse proxy and supply your production credentials
and access policy. No such setup is required for the command above.

## Software and content are separate

| Location | Purpose | Licence |
| --- | --- | --- |
| `software/` | HTTP server, frontend behaviour, styling, exports, DB adapter and migrations | GNU AGPLv3; third-party exceptions retained |
| `content/seed.json` | Initial pages, translations, UI text, template defaults, export content and language metadata | CC BY-NC-SA 4.0; registry exceptions retained |
| PostgreSQL `content` schema | Authoritative installed website content | Same content terms |
| PostgreSQL `private` schema | Visitor submissions and language suggestions | Private records, excluded from public content/source distribution |
| `scripts/`, `docs/` | Development, verification, packaging and architecture documentation | GNU AGPLv3 |
| `worker/` | Generated compatibility snapshot for existing Sites hosting | Generated software/content retain their separate terms |

The software image contains no page content or seed. Only the one-shot importer
mounts `content/` read-only. The web service also mounts the privacy policy YAML
read-only and imports it on every startup (see below). It reads page bodies, translations,
text fragments, document models and stadgar defaults from PostgreSQL. It does not
fall back to a bundled content file. Content can change in the database without
rebuilding the image; a revision trigger makes the next request refresh its cache.
The current frontend presentation and language behaviour are retained.

The initial seed reproduces the current published content: 47 page files,
22 frontend scripts, 35 document models, all 14 language projects, stadgar builders,
donation pages, privacy/licence pages, suggestions, speech controls, and PDF,
Markdown and RTF downloads. Forms save to PostgreSQL. Draft stadgar text remains
in memory for export and is not saved as a submission. No historic visitor
submissions were copied from the existing hosted site's private storage.

`content/seed.json` is an installation fixture. Once seeded, the **database** is
canonical: restarting or recreating containers does not overwrite edited content
or duplicate the initial content. Changing the seed file does not update an
already installed database. Future schema changes should use numbered migrations;
future content changes should use the database/editor, not reseeding.

There is deliberately no administration/editor interface yet. See
[the architecture guide](docs/ARCHITECTURE.md) for the future backend boundary.
The older mixed source/generation files have been replaced by the separated
software and seed; they remain recoverable in Git history and the prior backup.

## Privacy policy configuration

`privacy-policy.yaml` contains the complete current privacy notice: draft status,
pending operator/contact details, retention and hosting arrangements, cookies,
rights and references. It is editorial content under CC BY-NC-SA 4.0. Missing
operational facts remain pending.

Edit `section_html` for the policy section on `/privacy/` and `document` for its
PDF, Markdown and RTF downloads. Keep both representations consistent. The page's
surrounding layout and other database content are preserved. This is trusted
operator-authored HTML, not an upload interface or HTML sanitization service.

After editing, run `docker compose restart web`. Every web process start reads
and validates the mounted file before opening the HTTP port, then transactionally
updates only the privacy page section and `/privacy/` export model in PostgreSQL.
Unchanged values do not advance the content revision. Missing or invalid YAML
prevents startup and preserves the last installed policy. Changes are not watched
while running. No image rebuild or reseeding is required.

For Docker, this file is authoritative for the privacy policy: direct database
edits to its section or export model are replaced on the next web start. Keep the
YAML alongside database backups. Non-Docker server users can opt into the same
behavior with `PRIVACY_POLICY_PATH`; the generated Sites snapshot continues to
use the original seed.

## Stop, restart, update

```sh
docker compose down
docker compose up
```

The named PostgreSQL volume persists across these operations. `docker compose
restart web` restarts only the application. After changing application code, use
`docker compose up --build -d`. Removing the named volume (for example with
`docker compose down -v`) removes the installed database and submissions; the next
start would create a fresh database from the supplied seed.

## Database backup and restore

Back up the installed database, including later content edits and private records:

```sh
docker compose exec -T db pg_dump -U commons -d association_commons --clean --if-exists > association-commons.sql
```

Store that file privately. A project/source ZIP is not a backup of live submissions.
To restore a dump into this stack, stop the web service, start the database, and
load the dump (this replaces the corresponding installed data):

```sh
docker compose stop web
docker compose up -d --wait db
docker compose exec -T db psql -v ON_ERROR_STOP=1 -U commons -d association_commons < association-commons.sql
docker compose up -d
```

Keep the source release together with your database backup. The `content.state`
record identifies the original seed commit and displayed version.

## Development and checks

Production dependencies are pinned in `software/package-lock.json`. Development
checks are separate from the application image:

```sh
npm ci
npm --prefix software ci
npm test
```

The parity test compares page bytes, frontend JavaScript syntax/values and export
hashes with the pre-refactor snapshot, normalizing only the authorized release
number change from 0.0.1 to 0.0.2. The database test runs a PostgreSQL engine
(PGlite) over its PostgreSQL wire protocol and exercises the actual Node HTTP
server, initialization, content edits, submissions, restarts and persistence.
The Compose contract test checks the declared services and isolation. These do
not replace an actual Docker build/run on the target host. A GitHub Actions
workflow also builds and smoke-tests the Compose stack with native PostgreSQL.

The HTTP health endpoint is `/healthz`; it checks the database connection. Container
and HTTP logs do not intentionally log submitted form bodies. A reverse proxy
must preserve the real request host. Set `TRUST_PROXY=true` only behind a trusted
proxy when it supplies `X-Forwarded-Proto: https`; client IP rate limiting otherwise
uses the immediate peer address. Configure proxy-level abuse limits for a public
installation. No proxy is required for localhost use.

## Existing hosted site

The existing Sites address remains a compatible snapshot. Sites does not run this
Docker Compose stack or provide its PostgreSQL service. `npm run build` generates
that compatibility target from the same separated seed and software, using the
existing Sites storage adapter. The Docker deployment uses PostgreSQL exclusively.
Moving the live domain/audience to a Docker host is a separate hosting operation.

The privacy policy remains a draft: the operator/contact details and production
hosting/retention arrangements still need to be supplied. Its existing hosted-site
provider references must be reviewed for the chosen self-hosting provider before
public launch. No operator identity, public access, donation provider or NPO status
has been invented by this refactor.

See [LICENSING.md](LICENSING.md) for the content/software licence boundaries and
[LICENSE](LICENSE) for the authoritative AGPLv3 text. The software source download
at `/source.tar.gz` is retained.
