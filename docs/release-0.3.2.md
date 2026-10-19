# Release 0.3.2

This small release makes the work ahead easier to find. It adds a practical To-Do
list to the README, drawn from Part III of the white paper, with the proposed
constitution generator first. These remain open tasks, not claims of completed
work or agreed answers.

## Changes

- Add tasks covering participatory research, accountable leadership, participation
  burdens, South African and African sources of ideas, rights safeguards,
  accountability to affected nonmembers, and evidence that could challenge the DDC.
- Put participatory constitution-generator design and testing at the top of the list.
- Update first-party package metadata, the theme, Docker image tag, visible site
  version, source-download links, and current documentation to 0.3.2. Preserve
  upstream versions, historical reports, and the existing consent-notice identifier.

## Updating

From the repository root, run `docker compose up -d --build`. Keep the existing
private volume; do not use `down -v`. No content or private-data migration is
introduced by this release. For older folder layouts, see the
[0.3.1 migration instructions](release-0.3.1.md#updating-an-existing-checkout).

## Verification and remaining limits

Release checks cover whitespace, consistent first-party versions, and local
Markdown document links. This release changes documentation and release metadata;
it does not introduce a new interface or functionality. The browser, screen-reader,
and real speech-engine checks have not been rerun for 0.3.2. The
[0.3.1 verification notes and known limitations](release-0.3.1.md#verification-and-remaining-limits)
remain applicable, including the known narrow-screen overflow at 400% text size.

[Back to the documentation index](README.md)
