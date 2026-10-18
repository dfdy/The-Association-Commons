# Release 0.3.0

- Restore registered-language suggestions with public aggregate counts and a private
  super-admin table, configurable retention, confirmation, and deletion.
- Improve private submission tables with Open/Close actions, clear dates, responsive
  layouts, and styles that follow the admin light/dark themes.
- Translate proposal, drafting-tool, and donation pages across written language
  editions, retaining canonical-source notices. Kaaps is an Afrikaans-based draft
  requiring community review. Include localized interest forms and English support
  for the SASL proposal, with source/language metadata kept privately.
- Correct identified Afrikaans/Kaaps grammar and terminology errors.
- Add the supplied logo to the responsive header, centred footer, and main README.
  Stack footer links vertically and align their outer edges with the header.
- Join read-aloud buttons into a pill and use SVG playback/settings icons.
- Clarify directory-level licensing, research-data scopes, and private-data exclusions.
- Align first-party package, theme, footer, and image versions at 0.3.0, leaving
  upstream dependency and research dataset versions unchanged.

Machine drafts still need native-speaker review. Screen-reader and real speech-engine
review remain outstanding. Automated checks do not establish WCAG conformance.

## Release verification

Passed against the 0.3.0 image: all 33 translated pages and localized interest
forms, SASL form placement, same-session route protection, private submission
metadata, JavaScript/non-JavaScript submission, public exports, super-admin table
search/Open/Close/delete, editor/anonymous denial, language matching and counts,
read-aloud playback state/focus/mobile/language regression checks, and automated
form/admin accessibility checks (including admin light/dark themes). Synthetic
records/accounts were removed. Speech was simulated. First-party versions and
`git diff --check` passed; upstream versions and historical release notes were retained.
