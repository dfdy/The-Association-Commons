# Grav website · 0.3.0

The Democratic Development Commons runs on pinned Grav **2.2.10** with Admin Next.
Its public framework follows Part II of white paper **1.7**. First-party theme,
plugins, and integration code use AGPL-3.0-only; editorial content uses CC BY-NC-SA 4.0.
Third-party licences and versions remain separate, including the MIT-licensed
`grav-mcp` **0.1.2** dependency.

## Run and edit

From the repository root (Docker Compose 2.20.3 or newer):

```sh
docker compose up -d --build
docker compose exec --user www-data grav cat user/data/commons-private/admin-login.txt
```

- Website: http://localhost:8388/en
- Administration: http://localhost:8388/admin
- Submissions: **Admin → Project interest** and **Admin → Language suggestions**, for super-admins only.

Sign in with the generated account and change its password and email. Existing
accounts survive rebuilds. Public registration is disabled. The development server
binds only to localhost. Full installation instructions are in the [main README](../README.md).

`user/pages/` is bind-mounted from the checkout. Content and uploaded page media saved
in Admin appear directly in Git; repository edits appear in Grav. No content export
or database synchronisation is required. Rebuild after changing plugins, theme code,
or startup scripts; Markdown changes appear without rebuilding. Local page caching
is disabled. Docker/Colima must share this checkout as writable.

Accounts, API keys, Join records, sessions, and other private runtime data remain in
the named `grav_user` Docker volume. Do not commit them. Rebuilds preserve the volume;
`docker compose down -v` destroys it but does not remove the bind-mounted page files.
Back up the checkout and private volume separately, with restricted access to personal
records. The legacy site is a Git-ignored local reference and is not the active app.

Alternative launcher: `python3 grav-site/setup.py` from the repository root. It stores
initial login information privately in `.local/grav-admin.txt`. Both root Compose
entrypoints and `grav-site/compose.yaml` select the same project and content folder.

## Public content

| Route | Current purpose |
| --- | --- |
| `/en` | Full English public framework: ten principles, fifteen commitments, practical reviews, and glossary |
| `/{language}` | Full translated proposals with machine-translation notices |
| `/{language}/stadgar` | Association Constitution Drafting Tool description; no active builder |
| `/{language}/donate` | Donation information; no payment collection |
| `/en/white-paper` | Working white paper 1.7 |
| `/en/legal-matrix` | Sixteen provisional legal research records |
| `/en/governance-patterns` | Seven untested constitutional patterns |
| `/en/licence/content`, `/en/licence/software` | Content and software licence scope |
| `/en/privacy` | Current Grav/Join privacy notice and unresolved operator details |

The English `/en/languages` page accepts registered-language suggestions via `[language-suggestions /]`, displays aggregate counts, and is linked in every footer. See the [language-suggestions guide](user/plugins/language-suggestions/README.md) for matching, storage, retention, and administration.

There are 13 language sections. All written editions have machine-translated
proposals, drafting-tool descriptions, and donation pages. Kaaps is an Afrikaans-based
draft requiring Kaaps-speaker review. SASL remains unchanged, with written-English
support pending signed content. The machine-translation notice identifies the
English canonical source. Translated navigation labels retain
stable proposal, `/stadgar`, and donation routes.

The original English proposal body is preserved in
`user/pages/01.en/09.proposal-backup-2026-10-18/default.md`. Find the unpublished backup
beneath English in Admin → Pages. It is hidden and non-routable, including downloads.

The six supporting footer pages omit the three project tabs. Downloads remain
right-aligned everywhere; JSON/schema downloads are additional links in the research
resources. Old root-level supporting routes redirect to their English addresses.

## Join records and privacy

`[project-interest /]` under **Join** in English and the translated proposals collects required name, email, and consent,
plus optional organisation/community and message. It records a timestamp, random ID,
source/language, request type, and consent-notice version. It sends no email, creates
no membership, and does not subscribe people to a mailing list.

**Admin → Project interest** allows super-admins to search and inspect every supplied
field, then delete individual submissions with confirmation. Content-only editors and
the MCP account cannot read these records. The list is paginated and responses are
private/non-cacheable. Server operators also have a CLI maintenance tool.

Records are private JSON files in `user/data/commons-private/project-interest/`.
Default retention is 90 days; cleanup runs during submission handling, administrative
listing, or explicit maintenance. Schedule cleanup for expiry independent of traffic:

```sh
docker compose exec --user www-data grav php user/plugins/project-interest/manage.php cleanup 90
```

Pass the configured retention period if it changes. Deleting an active record does
not delete backups. Restrict volume backups and confirm their retention. See the
[Join plugin guide](user/plugins/project-interest/README.md) for other commands and
[the privacy page](user/pages/01.en/06.privacy/default.md) for collection and cookies.
The operator's legal/contact details and production hosting arrangements remain to
be supplied; local implementation checks are not a public-launch privacy audit.

## Theme and plugins

First-party packages are version **0.3.0**, plugin display names begin `DDC:`, and
authorship is **The Democratic Development Commons (DDC)**. Upstream dependencies
retain their own versions and licences.

| Plugin | Purpose and guide |
| --- | --- |
| Commons downloads | [Public page exports](user/plugins/commons/README.md) |
| Hero Intro | [Hero heading and accent shortcodes](user/plugins/hero-intro/README.md) |
| Section Layout | [Numbered and shaded sections](user/plugins/section-layout/README.md) |
| Glossary | [Glossary cards](user/plugins/glossary/README.md) |
| Remember Panel | [Saved collapse/open state](user/plugins/remember-panel/README.md) |
| Language Menu | [Alphabetical language pills and local click shading](user/plugins/language-menu/README.md) |
| Read Aloud | [Playback below passages, shared voice settings, and shortcuts](user/plugins/read-aloud/README.md) |
| Translation Notice | [Machine-translation disclosure](user/plugins/translation-notice/README.md) |
| Legal Matrix | [Versioned legal research data](user/plugins/legal-matrix/README.md) |
| Governance Patterns | [Pattern data and testing evidence](user/plugins/governance-patterns/README.md) |
| Language Suggestions | [Registered-language suggestions and private administration](user/plugins/language-suggestions/README.md) |
| Project Interest | [Join form and private administration](user/plugins/project-interest/README.md) |

Amber header controls provide day/night mode and 100%–400% text sizing. Preferences
persist across languages. Above 200%, the header scrolls normally to keep content
reachable. Read-aloud controls follow passages and hide inside collapsed prefiguration
boxes. The footer separates licence/GitHub/version links from resource/privacy links.

## Content workflow and MCP

Edit pages through Admin or Git, then review `git diff` before committing. Unpublished
new pages use `published: false`; that does not create a separate draft revision of
an already-published page. The migration script is a historical import tool: running
it against a snapshot replaces live page files. It is not a release check or content
synchronisation command.

```sh
python3 grav-site/connect-codex.py
```

The registered MCP name remains `association-commons-grav` for compatibility. It uses
the pinned official `grav-mcp` 0.1.2 server and a scoped `codex-editor` account. That
account can read/edit pages but cannot manage settings, accounts, or Join records.
The 90-day key remains private; revocation is not undone by restart.

## Checks and deployment

The `scripts/test-*.cjs` browser checks require Playwright. Set `PLAYWRIGHT_MODULE`
and optionally `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use an existing installation.
Schema checks require the development-only Python `jsonschema` package. The Join
store unit check requires PHP with mbstring and accepts `GRAV_ROOT` for container runs.
Use synthetic submission details and remove test records afterwards.

Current checks cover proposal layout, hidden backup, reading preferences, read-aloud,
public research libraries, Join submission/privacy controls, and protected admin review.
Keyboard and automated accessibility checks supplement implementation work; they do
not establish WCAG 2.2 AA conformance. Screen-reader and real voice testing remain
outstanding. Translations and initial research records still need human review.

Before public hosting, configure HTTPS, secure session cookies, trusted login host,
restricted admin accounts, retention scheduling, and operator/privacy contact details.
Keep dependency updates separate from the project release version and review them
against the pinned Docker build. See [development instructions](../AGENTS.md).
