# Repository reorganisation: 19 October 2026

[All guides](README.md) · [Current repository map](repository-layout.md)

This is a historical record of one structural change and its checks. Use the
current guides for everyday work; these results do not certify later changes.

## What moved

The maintained Grav project moved from its subfolder to the repository root.
One Compose file replaced duplicate launchers. Apache configuration moved to
`docker/`, fonts to `assets/fonts/`, local tools to `scripts/`, and operating
instructions to `docs/`. The Docker project, service, and private volume names
were preserved.

The original importer, snapshot comparison, and migration report were retired.
On the development checkout, they and the ignored legacy implementation were
archived in `.local/archive/` for recovery. Those files are not shipped to fresh
clones or included in Docker builds. Existing local credentials were preserved.

The README hero and theme logo remained in use. The obsolete hero and release
0.2.1 notes had already been deleted before the reorganisation. Font and vendor
licence notices, translated content, and the unpublished English proposal backup
were retained.

## What was checked

- Root Compose build, service recreation, and Apache syntax.
- Existing private volume, new content-folder mount, and exclusion of private
  runtime files from the image.
- Current public language and supporting routes, Markdown/RTF/PDF exports,
  private-file protection, and scoped API access.
- Temporary unpublished page creation, API edits visible in the checkout, and
  checkout edits read by Grav; the test page was removed.
- Proposal layout, mobile overflow, reader controls, accessible names, keyboard
  actions, dialog focus restoration, and remembered panels in all 13 editions.
- No-JavaScript and blocked-storage panel fallbacks.
- Both research-data schemas, syntax, local documentation links, and file mapping.
- Relocated content bridge and its eight-tool allowlist in the local registration.

Canonical content files were compared with their previous Git locations and were
unchanged. The voice-persistence fix from earlier work was retained. Two older
tests were corrected to account for hero markup and additional reader buttons.

Speech was simulated. Screen-reader and audible voice testing were not performed.
These checks do not establish WCAG conformance or public-hosting readiness.
