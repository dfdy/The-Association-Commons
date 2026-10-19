# Release 0.3.1

This release makes the repository easier to navigate, introduces a language-selection
landing page, and improves themed document exports and shared reading controls.

## Changes

- Move the maintained Grav project to the repository root, with one `compose.yaml`,
  `user/` for content and application code, `scripts/` for tools, `docker/` for Apache
  configuration, and `assets/fonts/` for PDF fonts. Preserve the Docker project and
  private volume names. Retire obsolete import tools and duplicate launchers.
- Rework the README and documentation around reading, editing, participation,
  installation, maintenance, privacy, and recovery. Add contribution guidance,
  cloud-VM resource estimates, and links to South African hosting providers.
- Replace retired licence/source download addresses on the English licence pages
  with links to the tagged release's licence, scope notice, and source archive.
- Serve the language picker at `/`, with English at `/en`. Centre the logo and
  project name, retain keyboard navigation and no-JavaScript links, and keep the
  picker open until a language is selected. Reuse cookie-based language shading.
- Mark draft/community-review editions, including Kaaps, with amber triangles;
  distinguish the pending SASL edition with a green triangle and explanatory text.
  Keep status descriptions accessible without relying on colour or icons alone.
- Add a brown, subtly shaded icon above translation-warning headings and version
  their stylesheet to prevent stale browser styling.
- Generate light/dark PDFs with Chromium and the shared site styles. Use 10pt normal
  text, proportional headings, full-width PDF sections, a first-page logo/name,
  copyright and licence, South African export date, and release version.
- Remove forms, private fields, scripts, and remote resources from the PDF renderer;
  request PDF tags and outlines, and limit rendering to one export at a time.
- Extend text-size preferences to 50%–400%, retaining a 100% default. Retain selected
  speech voices across temporary voice-catalogue refreshes and section transitions.
- Reorder resource links, rename Privacy Policy, make the footer logo return to
  the current page's top, and link the header logo to the current language proposal.
- Align first-party packages, theme, image tag, footer, and current documentation at
  0.3.1. Preserve upstream versions, research-data versions, historical reports, and
  the existing consent-notice identifier.

## Updating an existing checkout

Read the [repository-layout migration notes](repository-layout.md#updating-a-checkout-from-the-former-folder-layout),
then rebuild from the root with `docker compose up -d --build`. Keep the existing
private volume; do not use `down -v`. Startup migrates the old English home alias
without resetting other configuration values. Re-register an older Codex bridge
path using `python3 scripts/connect-codex.py` if needed.

## Verification and remaining limits

See the [landing-page report](landing-2026-10-19.md), [PDF report](pdf-export-2026-10-19.md),
and [reorganisation report](reorganisation-2026-10-19.md) for detailed checks and
historical results.

Passed against the 0.3.1 image: landing-page routing and keyboard/automated
accessibility checks; all 13 language destinations; language-menu preferences;
proposal layout and hidden-backup protection; simulated read-aloud; remembered
panels across all editions; governance-pattern and legal-matrix filters, keyboard
disclosures, deep links, and exports; real themed PDFs with font-size, first-page
metadata, palette, text, link, and tag checks; PDF sanitization; all 33 translated
pages and localised form checks; isolated submission-store validation and retention;
scoped MCP access; research-data schemas; syntax, package versions, and local
documentation links. Synthetic translated-form records were removed by test cleanup.
The legal-matrix test now waits for asynchronous fragment-navigation focus before
asserting its result.

Screen-reader and real speech-engine review remain outstanding. Machine translations
and research records need further human review; Kaaps still invites community review,
and SASL signed media is pending. PDF tags do not establish PDF/UA conformance.
The existing 9-pixel horizontal overflow at 400% text size and a 320-pixel viewport
remains a known website barrier, reproduced with the previous theme script.
Operator/contact and production-hosting arrangements remain to be supplied.
