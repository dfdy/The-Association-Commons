# Release 0.2.1

18 October 2026 · The Democratic Development Commons

- Added the shortcode Join form under the English proposal, with private storage,
  server-side validation, consent metadata, duplicate protection, and non-JavaScript support.
- Added super-admin-only submission search, detail review, and confirmed deletion in
  Admin → Project interest. Ordinary content-editor access is denied.
- Replaced obsolete privacy descriptions with the current form, back-end access,
  retention triggers, cookies, logs, speech, and public-download behaviour.
- Updated the main README and maintained plugin/site READMEs to match the current
  ten-principle framework, planned drafting tool, research resources, and reading controls.
- Set the theme, all first-party plugins, displayed footer, project guidance, and
  Docker image to 0.2.1. Upstream Grav, MCP, PDF, and table-library versions are unchanged.
- Excluded private form data from Git and Docker image contexts.

Operator/privacy contact and production hosting details remain unconfirmed; the
privacy page says so. No automatic emails or membership approvals are introduced.

## Verification

Passed against the rebuilt 0.2.1 image: public Join submission with and without
JavaScript; validation/focus; nonce/origin rejection; private-file protection;
duplicate retry; isolated rate-limit/retention/permission checks; super-admin
search/read/delete; anonymous/editor denial; cached API route loading; admin sidebar
and component discovery; safe display of submitted markup; delete/cancel focus;
proposal layout and hidden-backup isolation; read-aloud; 100%–400% sizing; both research
libraries; document and JSON/schema exports; HTTP/API isolation; dataset schemas;
first-party metadata versions; and local README links.

Axe-core reported no WCAG-tagged violations in the custom admin component. The public
form checks likewise reported no violations, with colour-contrast manual-review items.
Screen-reader and real speech testing remain outstanding. This is not a conformance
or production security/privacy audit. Temporary test accounts and synthetic records
were removed; existing accounts and private records were preserved.
