# Edit and care for the website

[Back to the project](../README.md) · [All guides](README.md) · [Installation help](install.md)

This guide is for people editing content and looking after a local DDC website.
You can learn one task at a time. Where a decision affects other people, discuss
its purpose and consequences with them and keep a record of what changed.

Go directly to [editing](#edit-a-page), [public pages](#find-the-right-public-page),
[private records](#review-participation-and-language-suggestions),
[backups](#storage-and-backups), or [feature guides](#feature-guides).

## Start or reopen your site

If this is your first visit, follow [the installation guide](install.md).
Otherwise, start Docker Desktop or Colima, open a terminal in the project folder
(the folder containing `compose.yaml`), and run:

```sh
docker compose up -d
```

Open [the language-selection landing page](http://localhost:8388) or [the editor](http://localhost:8388/admin).
These addresses work on the computer running the site. Use your current account
details; the generated initial-login file does not track later password changes.

## Edit a page

1. Sign in to the editor and open **Pages**.
2. Find the language and page you want to change. The main English framework is
   under **English**. Supporting pages, including Privacy and the white paper,
   are beneath it.
3. Copy the passage you plan to change, or keep a Git revision, so you can compare
   or recover it. Ask the group who should review a substantial editorial change.
4. Edit the page body. It uses Markdown: ordinary text with markers such as
   `## A heading`, `**bold text**`, and `[link text](address)`.
5. Save, then open that page on the website and refresh it. Read the surrounding
   text too, check links, and try a small-screen view.
6. If the change is ready to share, review the changed files and agree how to
   commit or propose them. See [the contribution guide](../CONTRIBUTING.md).

Square-bracket instructions such as `[remember-panel ...]` are **shortcodes**:
instructions that create a feature on the page. Keep opening and closing markers
together. The [feature guides](#feature-guides) show complete examples.
Do not change an English passage and silently copy that change over existing
translations; translation is a separate task requiring language review.

You can also edit files directly under `user/pages/`. Admin edits and file edits
change the same files. Avoid editing the same passage in both places at once.
Refresh the website to see ordinary content changes; no container rebuild is needed.

### Add an image

Use the page editor's media upload area, then insert the image in the page body
using the uploaded filename. In Markdown, an image looks like:

```markdown
![People arranging chairs in a circle before a learning session](meeting-circle.jpg)
```

Replace the example filename and description with your own. Describe what matters
in the image; put essential information in the surrounding text too. Only upload
material you have permission to share, including the permission of identifiable
people where appropriate. Resize or compress large images before upload so people
with limited data or slower connections can read the page.

Save and check the result on the website. Uploaded page media is saved beside the
page in `user/pages/` and can become part of the public repository.

### Prepare an unpublished page

When creating a page, set its publication setting to unpublished before saving
work that is not ready for website visitors. In the page file's header, this is
`published: false`. Hiding a page from the menu alone does not unpublish it.

Saving changes to an already published page changes that page; it does not create
a separate draft awaiting approval. For larger revisions, agree a review method
first, such as an unpublished working copy or a Git branch.

Unpublished files committed to a public repository are still public there. Never
use an unpublished page to store passwords, private submissions, or personal case
notes. The existing unpublished English proposal backup is editorial reference
material, not confidential storage.

### Update the privacy operator details

Open **Pages → English → Privacy**, or edit
`user/pages/01.en/06.privacy/default.md`. The operator name, address, privacy
contact, and Information Officer details currently appear as pending in the text.
There is no separate operator-details settings form.

Agree the correct public details before replacing the pending text. Review the
whole notice for consistency, including hosting and backup arrangements. Details
committed to Git remain in the source history even if later removed from the page.
This guide explains storage and editing; it does not determine your legal duties.

## Find the right public page

Add the address below to `http://localhost:8388` while your site is running.
For example, the white paper is at `http://localhost:8388/en/white-paper`.

| Address | What you can find |
| --- | --- |
| `/` | Language-selection modal, with a logo and links to all language editions |
| `/en` | English framework, commitments, practical reviews, glossary, and Join form |
| `/{language}` | Another language edition; for example, `/zu` for isiZulu |
| `/{language}/stadgar` | Planned Constitution Drafting Tool description |
| `/{language}/donate` | Donation information; no payment collection |
| `/en/white-paper` | Working white paper 1.7 |
| `/en/legal-matrix` | Sixteen provisional legal research records |
| `/en/governance-patterns` | Seven untested governance patterns |
| `/en/languages` | Suggest a language and see accepted suggestion counts |
| `/en/contact` | Participation and community-led translation enquiries |
| `/en/privacy` | Form storage, preferences, access, and unresolved operator details |
| `/en/licence/content`, `/en/licence/software` | Content and software licence information |

There are 13 language sections. Machine-generated written translations require
speaker review. Kaaps includes user-supplied reviewed proposal text and still invites
Kaaps-speaker community review. The SASL edition provides
written-English support pending signed media. Keep those limitations visible.

Reading controls offer colour mode, 50%–400% text sizing, and speech where the
browser supports it. Public pages offer Markdown, RTF, and PDF downloads. Use the
website and downloads to check that formatting instructions have become readable
content. Personal submission records are excluded from public page downloads.

## Review participation and language suggestions

A **super-admin** is an account with full administrative permissions. Only these
accounts can access **Admin → Project interest** and **Admin → Language suggestions**.
Ordinary page editors and the content-editing connection cannot read private records.
Do not grant full administrative permissions merely so someone can edit a page.

Project interest records contain required name, email, and consent, optional
organisation/community and message, and submission metadata. Language suggestions
contain a random ID, registered name/code, and time; they do not collect contact
details or save the typed spelling. Suggestion counts represent accepted records,
not verified unique people.

Super-admins can search and inspect records and delete individual records after
confirmation. Submission sends no automatic email, grants no membership, and adds
no mailing-list subscription. Agree who will review enquiries and respond; the
software does not assign that responsibility.

The default retention period is 90 days. Cleanup happens during later submissions,
administrative listing, or explicit maintenance; without traffic or a schedule,
expired records can remain. Operators should arrange a cleanup schedule consistent
with their chosen policy. For example, this command deletes expired Project interest
records using a 90-day period:

```sh
docker compose exec --user www-data grav php user/plugins/project-interest/manage.php cleanup 90
```

Use the configured retention period if it differs. Deletion of an active record does
not delete backups. See the [Project Interest guide](../user/plugins/project-interest/README.md),
[Language Suggestions guide](../user/plugins/language-suggestions/README.md), and
[privacy notice](../user/pages/01.en/06.privacy/default.md) before managing records.

## Storage and backups

Two stores need care:

| Store | What it contains | What preserves it |
| --- | --- | --- |
| Project folder, especially `user/pages/` | Public content, uploaded media, and maintained software | Your checkout, reviewed Git history, and a separate backup |
| Docker volume `grav_user` | Accounts, API keys, sessions, and private submission records | The existing Docker volume and a restricted volume backup |

A **volume** is storage managed by Docker outside the project folder. The Compose
project is named `association-commons-grav`; Docker normally gives the volume the
full name `association-commons-grav_grav_user`. Rebuilding the container preserves it.

Stopping the site with `docker compose stop` keeps both stores.
**Do not use `docker compose down -v` as a stop or repair command:** it deletes the
private volume. Deleting or reinstalling Docker storage can also lose that data.
Copying the project folder or committing pages to Git does not back up accounts
or submissions.

Before moving computers or removing storage, have the operator back up both stores
and test restoration in an isolated copy. Agree who can access private backups and
when they expire. A useful backup record states what was copied, when, where it is
stored, and whether restoration was tested.

`.local/` holds ignored local files, such as the optional setup script's initial
login copy. Keep these private too. See [the repository map](repository-layout.md)
for the difference between public files, ignored local files, and runtime storage.

## Feature guides

A **plugin** adds a specific website feature. These guides are for editors who need
shortcode examples and developers changing the feature. You do not need to read
every guide to edit ordinary prose.

| Plugin | Purpose and guide |
| --- | --- |
| Commons downloads | [Public page exports](../user/plugins/commons/README.md) |
| Hero Intro | [Hero heading and accent shortcodes](../user/plugins/hero-intro/README.md) |
| Section Layout | [Numbered and shaded sections](../user/plugins/section-layout/README.md) |
| Glossary | [Glossary cards](../user/plugins/glossary/README.md) |
| Remember Panel | [Saved collapse/open state](../user/plugins/remember-panel/README.md) |
| Language Menu | [Alphabetical language pills and local click shading](../user/plugins/language-menu/README.md) |
| Read Aloud | [Playback below passages, shared voice settings, and shortcuts](../user/plugins/read-aloud/README.md) |
| Translation Notice | [Machine-translation disclosure](../user/plugins/translation-notice/README.md) |
| Legal Matrix | [Versioned legal research data](../user/plugins/legal-matrix/README.md) |
| Governance Patterns | [Pattern data and testing evidence](../user/plugins/governance-patterns/README.md) |
| Language Suggestions | [Registered-language suggestions and private administration](../user/plugins/language-suggestions/README.md) |
| Project Interest | [Join form and private administration](../user/plugins/project-interest/README.md) |


## Developer checks

Run commands from the repository root. Python schema checks require the development
package `jsonschema`:

```sh
python3 scripts/check-legal-matrix.py
python3 scripts/check-governance-patterns.py
```

Browser checks in `scripts/test-*.cjs` require Node.js, Playwright, and a compatible
installed browser. If Playwright is not available through the normal Node module
lookup, set `PLAYWRIGHT_MODULE` to your installation; optionally set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its Chromium executable. The examples below
assume those dependencies are available and the local site is running:

```sh
node scripts/test-proposal-layout.cjs
node scripts/test-read-aloud.cjs
node scripts/test-remember-panel.cjs
```

The PHP store checks require PHP with mbstring; `GRAV_ROOT` can point to an
installed Grav tree. Some integration tests create temporary pages, accounts, or
synthetic submissions. Read a test before running it and use an isolated development
copy rather than a service holding real enquiries.

Choose checks appropriate to the change. Record what passed, what remains untested,
and any known barriers. Keyboard and automated checks do not establish WCAG
conformance. Screen-reader and real speech testing remain outstanding.
Follow the [development requirements](../AGENTS.md).

## Optional content editing with Codex

This is an optional tool connection for developers already using Codex. Ordinary
reading and page editing do not require it. **MCP** means Model Context Protocol,
the connection used to let the coding assistant work with page content.

With Python 3.11 or newer and the Codex command available, run:

```sh
python3 scripts/connect-codex.py
```

The script updates your Codex configuration to register the local bridge and
limits the exposed tools to content editing. Other connections are preserved.
Reopen the chat to load the connection. Its name is
`association-commons-grav`; the `codex-editor` account can read and edit pages,
but cannot manage settings, accounts, or private records. Review proposed content
changes as you would any other contribution.

The pinned `grav-mcp` dependency is 0.1.2. The generated key has a 90-day lifetime,
stays in the private volume, and is not replaced automatically after revocation.
The optional launcher `python3 scripts/setup.py` starts the local service and
saves the initial login privately in `.local/grav-admin.txt`.

## Before public hosting

See [cloud VM requirements and South African hosting providers](cloud-hosting.md)
for an estimated minimum, recommended resources, and questions to ask a provider.

The supplied setup binds to localhost. It is a development setup, not a complete
public-hosting guide. Before inviting people to submit information, resolve the
operator/contact details, hosting arrangements, HTTPS, secure session cookies,
trusted login host, administrative access, retention schedule, and backup policy.
Update the privacy notice to reflect actual arrangements.

The website uses Grav **2.2.10** with Admin Next. First-party packages are **0.3.1**,
with separate upstream dependency versions and licences. Review dependency changes
against the Docker build. [Licence scopes](../LICENSING.md) and [contribution guidance](../CONTRIBUTING.md)
apply to published copies too.
