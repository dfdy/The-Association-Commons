# Development instructions

## Accessibility

WCAG 2.2 Level AA is the accessibility target for the project, including the original site, Grav theme and custom plugins. This is a development requirement, not a claim that the site has passed an accessibility audit.

- Build accessibility into semantic HTML and front-end interactions. Preserve screen-reader usability, logical reading and focus order, descriptive accessible names, and complete keyboard operation.
- Use appropriate headings and landmarks, visible focus indicators, sufficient colour contrast, and adequately sized controls. Do not rely on colour or icons alone to communicate meaning.
- Custom controls must expose their role, name and state. Forms must have associated labels, understandable instructions and accessible validation and status messages.
- Keep content usable on small screens, at increased text size and browser zoom, and with reduced motion or forced colours enabled.
- For interface changes, check keyboard navigation and accessible names and states. Use automated accessibility checks where available and supplement them with screen-reader testing; automated checks alone do not establish conformance. Record checks performed and any untested areas or known barriers.

Use the official [WCAG 2.2 recommendation](https://www.w3.org/TR/WCAG22/) as the normative reference and the [WAI quick reference](https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2&levels=aaa) for implementation guidance.

Interface, design, accessibility and functionality changes apply to all language editions. Only editorial content revisions are English-only: do not translate or propagate revised English prose to other languages until the user explicitly requests translation. Preserve existing translated content when applying shared interface or functionality changes.

The project centres South African needs and possibilities for rebuilding adult education as an emancipatory force. International traditions of autonomous organising and mutual aid inform the framework; Swedish experience is one reference, not its defining model. The framework is a voluntary organising agreement rather than draft legislation.

## Writing preferences

Use the Oxford comma by default; the user almost always prefers it.

## Documentation

Write instructions that help people understand and control their own work. Begin
with the task and its purpose, explain unfamiliar terms where they are needed, and
show how to check the result and recover from common problems. Distinguish ordinary
reading and editing from optional developer tools.

Welcome practical experience, language review, accessibility feedback, and reasoned
disagreement alongside code contributions. Do not imply community approval,
participatory testing, or collective decisions that have not occurred. Keep known
limitations visible without making the reader navigate a development log.

Give examples meaningful to South African adult education and autonomous organising.
Include routes back to the main guides, preserve licence terms, and keep dated
verification reports separate from current instructions.

## First-party packages

Custom plugins written for this project must use a display name beginning with `DDC: ` in their `blueprints.yaml`. Quote the YAML name because it contains a colon. This convention applies to first-party plugins, not upstream dependencies.

All first-party plugin versions must match the main project version (currently `0.3.2`). Set their `author.name` to `The Democratic Development Commons (DDC)`. Do not change upstream dependency versions to match the project.
