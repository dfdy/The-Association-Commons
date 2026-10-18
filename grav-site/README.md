# Grav website · 0.1.2

The website runs on Grav **2.2.10**, with its native Admin Next editor
and a reading-focused design. Grav and its official MCP server use the MIT
licence; this project's integration uses AGPLv3. Editorial content retains
CC BY-NC-SA 4.0.

Start from the repository root (Docker Compose 2.20.3 or newer):

```sh
cd grav-site
docker compose up -d
```

Use `docker compose up -d --build` after changing application code. Content
changes appear without rebuilding.

- **Website:** http://localhost:8388/en
- **Editor:** http://localhost:8388/admin
- **Initial login:** a unique administrator password is generated on first startup.
  Retrieve it from the `grav-site/` directory:

  ```sh
  docker compose exec --user www-data grav cat user/data/commons-private/admin-login.txt
  ```

Sign in as `admin`, then change the password and email in your profile. Existing
logins are preserved. Public registration is disabled; native login rate limits
apply. The site listens only on your computer.

Alternatively, `python3 grav-site/setup.py` from the repository root starts Grav
and saves the initial login privately in `.local/grav-admin.txt`.

In **Pages**, select a language proposal, edit its content, and save. Expand the
language to edit **Association Constitution Drafting Tool** or **Donate**. The generator page
describes the planned tool; the previous builder and its answer fields have been
removed. Markdown, RTF, and PDF downloads use the current page content.

## Content structure

```text
/en                     English proposal
/en/stadgar             Association Constitution Drafting Tool (existing URL retained)
/en/donate              English donations page
/zu                     isiZulu project
/zu/stadgar              Association Constitution Drafting Tool (English fallback)
/zu/donate               Donations page (English fallback)
```

All 13 language projects have this structure. Untranslated material
keeps the existing English fallback. Supporting documents live under English:
`/en/white-paper`, `/en/licence` (with `/content` and `/software` children), and
`/en/privacy`. Their files are children of `user/pages/01.en/`, ready for future
translated equivalents under other languages. The old root-level addresses,
including `/donate` and `/languages`, redirect to their English pages and retain
download query parameters.

The initial import contains 31 distinct public documents and 13 builder pages, now replaced by descriptions of the future generator.
**The running editor reads and writes `grav-site/user/pages/` directly.** This
bind mount includes Markdown, frontmatter, page folders and uploaded page media.
Edits made in Grav Admin or through MCP appear in your Git working tree. Files
changed through Git are also available to Grav; no export or database sync is
needed. Startup never replaces these files with content from the Docker image. Page
caching is disabled for local editing. Docker file sharing can take a moment
to reflect host-side edits.

Accounts, API keys and other private runtime data remain in the `grav_user`
Docker volume. They are not mounted into the checkout or included in commits.
Rebuilding/restarting keeps both content and logins. `docker compose down -v`
removes accounts and keys, but keeps the repository's page files.

The original PostgreSQL site is kept separately in the Git-ignored `legacy-site/` folder. Private visitor records
are not imported. Language suggestion information is preserved as text; the old
submission service is not connected to Grav. The current Join section provides
information only; there is no live join-request form.

If Colima shares this repository as read-only, change its existing project mount
in `colima.yaml` to `writable: true`, then run `colima stop` and `colima start`.
Colima does not support overlapping parent/subfolder shares. Docker mounts only
`user/pages/` into Grav for content editing.

## Commit edited content

From `grav-site/`, return to the repository root and create a branch before editing:

```sh
cd ..
git switch -c content-update
```

Make your changes in Grav Admin and save, then review and commit:

```sh
git status --short
git add grav-site/user/pages
git diff --cached -- grav-site/user/pages
git commit -m "Update website content"
```

Open a pull request into `main`, or merge locally:

```sh
git switch main
git merge content-update
```

To regenerate the initial tree from a public snapshot, run
`python3 grav-site/scripts/migrate.py path/to/snapshot.json` from the repository
root. This now changes the live page files too; use it only when intentionally
replacing imported content, and review the Git diff before committing.

## Codex MCP

```sh
python3 grav-site/connect-codex.py
```

Connection name: **association-commons-grav**. Reopen the Codex chat after adding
it. Try: “Use association-commons-grav to list the website pages.”

The launcher runs the official **grav-mcp 0.1.2** server inside the container.
Its separate `codex-editor` account can read and edit pages, but cannot manage
users, settings or packages. The 90-day API key stays in the private Docker
volume, outside Git and the Codex configuration. Revoke it in Grav's API key
management; restarting does not replace a revoked key.

Grav saves edits to published pages immediately. To prepare a new unpublished
page, set its `published` frontmatter to `false`. This is not a separate draft
revision of an already published page.

Stop/restart:

```sh
cd grav-site
docker compose stop
docker compose up -d
```

For public hosting, configure HTTPS, secure cookies and `plugins.login.site_host`
with your public address before exposing the site.
Use Grav's user interface for core/plugin updates only after backing up; the
container image pins core dependencies for reproducible rebuilds.

From the repository root, `docker compose -f compose.grav.yml up -d` runs the
same Grav project and uses the same content folder and private volume.

Official guides: [Grav installation](https://learn.getgrav.org/2/basics/installation),
[Admin Next](https://learn.getgrav.org/2/admin-panel),
[Grav MCP](https://learn.getgrav.org/2/advanced/mcp-server).

## Collapsible sections

Wrap a section with the [Remember Panel shortcode](user/plugins/remember-panel/README.md).
The Prefiguration blocks already use it. Move the complete marked block anywhere;
its stable ID retains the saved open/closed preference, which resets to open seven
days after the last manual toggle. Downloads and printing include the full text.

## Theme and custom plugins

The shared interface includes day/night modes, language pills, page tabs and
Markdown/RTF/PDF downloads. The theme choice uses a one-year cookie. Language
shading uses a separate cookie containing the last 50 menu clicks.

All project plugins use the `DDC:` prefix, version **0.1.2**, and author
**The Democratic Development Commons (DDC)**. Their Markdown syntax is documented here:

- [Hero introduction and accent text](user/plugins/hero-intro/README.md)
- [Numbered sections, descriptions and subsections](user/plugins/section-layout/README.md)
- [Glossary cards](user/plugins/glossary/README.md)
- [Remembered open/close panels](user/plugins/remember-panel/README.md)
- [Language menu](user/plugins/language-menu/README.md)
- [Browser read-aloud controls and shared voice settings](user/plugins/read-aloud/README.md)

Interface and functionality changes apply to all languages. Editorial revisions
remain English-only until translation is requested. Existing other-language
content may therefore reflect an earlier version of the framework.

Accessibility target: **WCAG 2.2 AA**. See the repository’s development instructions;
this target is not a completed conformance audit.

### Future generator replacement checks

The old `/[language]/stadgar` routes now describe the planned constitution generator
from white paper section 21. The former form, preview, editable builder schema, and
answer-to-constitution export handler have been removed. Migration retains these
description pages. The replacement uses English fallback content marked `lang="en"`.

Chromium checks passed for all 13 editions: description headings, absence of builder
controls, current navigation state, Markdown downloads, and English content language.
RTF/PDF description exports, a 360px viewport, and keyboard focus order also passed.
PHP and JavaScript syntax checks passed. Screen-reader testing remains unperformed.

Project navigation labels are translated in
`user/themes/commons/templates/partials/project-navigation.html.twig`.
“Constitution Jumpstart” uses an equivalent invitation to begin a constitution.
SASL retains written English support. Chromium checks covered translated labels,
navigation names, language attributes, links, current-page states, a 360px viewport,
and keyboard order across all 39 proposal, generator, and donation pages.
Fluent-speaker review and screen-reader testing remain outstanding.

### Reading preferences

The header offers minus/plus Text size buttons with a percentage indicator (100%–400%) beside Night mode.
Both use the translation notice's amber palette. Text size scales the root font
relative to the browser default, works alongside browser zoom, and persists across
editions in the first-party `ddc-text-size` cookie for one year after a change.
Without JavaScript, browser zoom remains available and inactive controls are hidden.

`node grav-site/scripts/test-reading-preferences.cjs` checks size changes, keyboard
focus, keyboard theme activation, cross-language persistence, amber styling,
200% text at 320–1280px widths, compact-header layout, forced-colour focus, and
reduced-motion operation. Set `PLAYWRIGHT_MODULE` and, if needed,
`PLAYWRIGHT_CHROMIUM_EXECUTABLE` for a custom browser installation.
Chromium checks passed; screen-reader and manual screen-reader testing
remain outstanding.

### Legal matrix

The English-only [legal matrix](http://localhost:8388/en/legal-matrix) is linked from
the shared footer. Its first research release contains 16 provisional records,
separate proposed-reform tracking, JSON/schema downloads, and server-rendered indexes
with locally hosted DataTables search, filters, and sorting. No initial record is
verified or generator-ready. See the [plugin maintenance guide](user/plugins/legal-matrix/README.md)
for the data model, source-review process, licences, and checks.

Text sizing now extends to 400% (250%, 300%, 350%, and 400% above the original
steps). Zoom buttons have no internal border dividers. Above 200%, the header
scrolls normally and navigation reflows to keep enlarged controls and content
reachable. Regression checks passed at 400% across 320–1280px viewport widths,
including size limits, saved preferences, keyboard activation, and focus.

### Governance-pattern library

The English-only [governance-pattern library](http://localhost:8388/en/governance-patterns)
is linked from the shared footer. Seven initial draft patterns cover the white paper's
§25.5 categories. Each explains the problem, suitability limits, member choices,
illustrative clauses, risks, accessibility, and testing evidence. All initially remain
untested, legally unreviewed, and unavailable for automatic generator use. See the
[maintenance guide](user/plugins/governance-patterns/README.md) for the data/schema,
review process, dependencies, and checks.

### English proposal revision and backup

The English proposal now presents white paper Part II within its existing visual
structure: the prefiguration panel, hero, seven labelled sections, shaded framework,
numbered subsections, and glossary cards. The headings “The freedom to organise” and
“Association begins with people” remain. Its content covers ten principles, fifteen
commitments, eight practical subsections, and 28 glossary terms.

The preceding page body is preserved exactly in
`user/pages/01.en/09.proposal-backup-2026-10-18/default.md`, titled **English proposal —
backup before Part II revision (18 October 2026)**. In Grav Admin, expand English in
Pages to find it. It is unpublished, hidden from navigation, and non-routable; do not
publish it merely to edit or inspect it. The backup's frontmatter identifies its source
and date. Other language editions were not revised.

`node grav-site/scripts/test-proposal-layout.cjs` checks retained headings and structure,
backup public/download isolation, Markdown export, narrow layouts, and white-paper
scrollable tables. The read-aloud browser regression suite also passed. Screen-reader
and real speech testing remain outstanding.
