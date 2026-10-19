# Content and software licences

[Back to the project](README.md) · [Contribution guide](CONTRIBUTING.md)

Start with the kind of material you want to use: the framework's writing, the
website's software, or a third-party component. The table below identifies each.
You do not need to choose one licence for the whole project.

For a quick orientation, the README has a [content and software summary](README.md#sharing-the-work).
This guide gives the detailed scope. The complete licence texts linked below remain
the reference for their terms; this guide does not replace them.

This repository contains separately licensed content and software. The licence
for each part is determined by its scope below, not by GitHub’s single repository
licence summary. The licences are not interchangeable options for the same material.

| Scope | SPDX identifier | Complete licence text |
| --- | --- | --- |
| First-party editorial content | `CC-BY-NC-SA-4.0` | [LICENSE-CC-BY-NC-SA-4.0.txt](LICENSE-CC-BY-NC-SA-4.0.txt) |
| First-party software and software documentation | `AGPL-3.0-only` | [LICENSE](LICENSE) |

## Where each licence applies

The table identifies material by its role as well as its location. A directory
containing software can also contain separately licensed editorial content.
Third-party notices and the private-data exclusions below take precedence over
these first-party classifications.

| Location | Material | Licence or treatment |
| --- | --- | --- |
| `user/pages/` | First-party Markdown prose, translations, glossary entries, white paper, and editorial page media, including hidden editorial backups | CC BY-NC-SA 4.0 |
| `docs/images/` and `user/themes/commons/images/` | First-party website screenshots, the supplied site logo, and editorial images | CC BY-NC-SA 4.0 |
| `user/plugins/legal-matrix/data/legal-matrix.json` | First-party legal-mapping explanations, classifications, review notes, and research records | CC BY-NC-SA 4.0; cited sources retain their own terms |
| `user/plugins/governance-patterns/data/governance-patterns.json` | First-party governance-pattern explanations, draft clauses, suitability guidance, and research records | CC BY-NC-SA 4.0; cited sources retain their own terms |
| `user/plugins/*/data/*.schema.json` | JSON validation schemas | AGPL-3.0-only |
| `user/plugins/` and `user/themes/commons/` | First-party PHP, JavaScript, CSS, Twig/HTML structure, configuration, and technical documentation | AGPL-3.0-only; embedded editorial passages remain CC BY-NC-SA 4.0 |
| `scripts/`, Dockerfiles, and Compose files | First-party build, deployment, maintenance, and test software | AGPL-3.0-only |
| Root `README.md` | Project/framework descriptions and organising principles | CC BY-NC-SA 4.0 |
| Root `README.md`, `CONTRIBUTING.md`, plugin READMEs, and guides and technical reports in `docs/` | Installation, architecture, operation, testing, and other software documentation | AGPL-3.0-only; separately identifiable editorial passages retain the content licence |
| `.local/archive/legacy-site/content/seed.json` and `.local/archive/legacy-site/privacy-policy.yaml` | Archived first-party editorial pages, prose, translations, glossary, and templates | CC BY-NC-SA 4.0; registry data and other third-party material are excluded |
| `.local/archive/legacy-site/software/`, `.local/archive/legacy-site/worker/`, and `.local/archive/legacy-site/scripts/` | Archived first-party application, generated application code, scripts, and software documentation | AGPL-3.0-only; embedded editorial content remains CC BY-NC-SA 4.0, and bundled dependencies retain upstream terms |
| `user/plugins/language-suggestions/data/languages.json` and the archived registry in `.local/archive/legacy-site/content/seed.json` | IANA-derived language registry and CLDR-derived names/aliases | Third-party material; retain source attribution and applicable upstream terms, not a first-party CC or AGPL grant |
| Vendored libraries, upstream Grav components, and font files | Third-party software and fonts | Their supplied licences; see component notices |
| Runtime `user/data/commons-private/`, accounts, credentials, and visitor records | Private operational data, including Join and language-suggestion submissions | Excluded from both project licences and source distributions |

For mixed files, the distinction follows the material: editorial passages do not
become AGPL merely because they are stored in JSON, PHP, or a README, and software
or validation schemas do not become CC-licensed merely because they render or
validate content. The research-record JSON files above are editorial resources;
their corresponding schemas and the code that displays them are software.

`.local/archive/legacy-site/` preserves the earlier implementation and its notices; it is not the
current editorial source. Use `user/pages/` and the two research-record
JSON files above for maintained website content. This map clarifies the existing
content/software distinction and does not revoke permissions granted for earlier
copies or relicense third-party works.

## Website content: CC BY-NC-SA 4.0

The first-party organising framework, explanatory prose, translations, glossary,
constitution templates, editorial images and other editorial content of
The Democratic Development Commons are licensed under Creative Commons
Attribution-NonCommercial-ShareAlike 4.0 International (CC-BY-NC-SA-4.0).
The Markdown pages in `user/pages/` and first-party website screenshots
in `docs/images/` are editorial content under these same terms. The complete
unmodified content licence is in [LICENSE-CC-BY-NC-SA-4.0.txt](LICENSE-CC-BY-NC-SA-4.0.txt).

You may share and adapt this content for noncommercial purposes, with appropriate
credit, a licence link and an indication of changes. Shared adaptations must use
the same or a compatible licence as permitted by the legal code. Do not imply
endorsement or add restrictions that prevent permitted uses. Credit this project
by its title, retain supplied creator credits, and link to the source page.
The legal code controls: https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.en
The summary is at https://creativecommons.org/licenses/by-nc-sa/4.0/.

## Website software: GNU AGPLv3

The first-party application software, JavaScript, CSS, HTML structure, backend,
build/generation scripts and tests are licensed under the GNU Affero General
Public License version 3 (SPDX: AGPL-3.0-only). Editorial content embedded in
software files remains under the content licence above; it is separate material
and is not relicensed as software. Documentation of the code/build is AGPLv3.

The software may be used, studied, modified and shared, including commercially,
under the AGPLv3 terms. Distributed covered versions must provide corresponding
source and preserve applicable notices and licence terms. If you modify it and
let people interact with that version remotely over a network, prominently offer
those users its corresponding source at no charge as required by section 13.
No noncommercial restriction applies to the software licence itself.
The unmodified AGPLv3 text is in LICENSE.
Authoritative licence: https://www.gnu.org/licenses/agpl-3.0.html
The current Grav integration source is available in this repository. The optional
local archive preserves the original implementation and its source notices.

## Scope, earlier releases and exclusions

This notice sets the terms for this version and future contributions covered by
this notice. Earlier releases were offered under GPL-3.0-or-later; recipients
retain the permissions already granted for those earlier copies.

Third-party material retains its own terms. Language names and registry metadata
in the bundled current and archived language registries originate in the IANA Language Subtag Registry
(https://www.iana.org/assignments/language-subtag-registry/) and names supplied by
the runtime's Unicode CLDR/Intl.DisplayNames data. Their existing rights, terms
and attribution remain applicable. External linked pages retain their own terms.
The GNU licence text retains the Free Software Foundation's notice.

Private visitor submissions, names, email addresses, consent records, preferences
and server storage are excluded from both licences and the source download.
The project conversation archive is not part of the published source bundle.
These works are provided without warranty, subject to the respective licences.

## Current Grav website

The integration code and theme are GNU AGPLv3. The migrated editorial
material in `user/pages/` remains CC BY-NC-SA 4.0 under the existing
content notices. Grav 2, its bundled plugins and the official grav-mcp server
retain their upstream MIT licences. Chromium and its system dependencies retain
their upstream terms and bundled notices. Noto Sans retains
its SIL Open Font License (see `assets/fonts/`). Runtime accounts, API keys
and private data are excluded from source distributions.
