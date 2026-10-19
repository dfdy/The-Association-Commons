# WCAG 2.2 AA accessibility evaluation

Date: 18 October 2026. Site version: 0.1.2. Source revision: `ffa65d7`.

## Conclusion

**The current site does not meet WCAG 2.2 AA.** Confirmed barriers include a visible-label/accessibility-name mismatch, incorrect language declarations, insufficient night-mode focus contrast, text clipping when enlarged, and a keyboard-inaccessible preview in WebKit. PDF exports also lack document structure and need remediation or a verified conforming alternative.

This is an engineering evaluation, not a certification. An automated pass is not a conformance determination. VoiceOver, NVDA, real mobile assistive technology and authenticated editor workflows still need human testing before a conformance claim.

No site code or content was changed by this evaluation. The local original site was excluded; the current Grav site was evaluated.

## Scope and method

- All **44 public routes**: 31 document pages and 13 constitution builders. Every route was scanned in both day and night modes: **88 public page states**.
- Additional automated scans of the shared read-aloud settings dialog and the unauthenticated Grav Admin login: **90 scanned states** total.
- axe-core **4.14.0**, using WCAG 2.0 A/AA, 2.1 A/AA and 2.2 AA rule tags. Some criteria cannot be assessed by axe.
- Chromium with desktop 1280px and mobile-equivalent 320px viewports. Targeted Firefox and WebKit checks covered preview keyboard access, dialog opening and mobile reflow. Browser engines are not substitutes for testing installed browsers with assistive technology.
- Keyboard traversal, skip navigation, panel activation, dialog Escape/focus restoration, native required-field validation, and inspection of page language and accessible names.
- Reflow and text-spacing checks on the English proposal, builder, Donate, Privacy and Software Licence pages; 200% root-font enlargement on the same pages. Root-font enlargement is a text-resize stress test, not a replacement for testing native browser zoom.
- Source inspection of custom theme and plugins; representative rendered-text contrast calculations, including the full-width shaded framework section.
- Inspection of the English proposal PDF for structural tags and language metadata.
- Existing read-aloud regression tests, which simulate speech rather than verify audible output.

The public pages and dialogs were tested without modifying submissions, accounts or stored content. No production deployment was evaluated. Private administrator credentials were not used.

## Prioritised findings

### F01 — Markdown download label does not match its accessible name

**Priority: high. Confirmed. SC 2.5.3 Label in Name (A).**

The visible document badge says **MD**, while its link or button is named **Download Markdown**. The visible abbreviation is not contained in the accessible name, making voice-input activation by the visible label unreliable. This affects all 44 public pages in both modes.

Evidence: axe `label-content-name-mismatch`, 88 instances across 88 page states. Example: `/en/languages?download=md`, `aria-label="Download Markdown"`, visible SVG text `MD`. The badge remains visible even though the SVG is hidden from the accessibility tree.

Location: `user/themes/commons/templates/default.html.twig`, download controls.

Recommendation: use a name such as **Download MD (Markdown)**, retaining the visible abbreviation verbatim, or change the visible badge. Verify the accessible name and a voice-input command after the change.

### F02 — SASL routes use an invalid HTML language tag

**Priority: high. Confirmed. SC 3.1.1 Language of Page (A).**

`/sasl`, `/sasl/stadgar` and `/sasl/donate` render `<html lang="sasl">`. `sasl` is not a valid language subtag for this purpose. The route identifier is being used as the document language without considering the actual written content.

Evidence: axe `html-lang-valid`, three routes in two modes, six instances.

Location: `default.html.twig`, the root `lang` attribute; language metadata in those pages.

Recommendation: separate the edition/route code from the written-content language. English text on a signed-language edition should be marked as English. A signed-language edition does not make its English fallback text sign language. Use appropriate language metadata for actual signed media if introduced.

### F03 — English fallback content and shared English controls inherit other languages

**Priority: high. Confirmed. SC 3.1.1 (A) and 3.1.2 Language of Parts (AA).**

For example, `/zu/stadgar` declares `lang="zu"` while its heading is “Create your stadgar,” its instructions and field labels are English, and the builder uses English defaults. Other non-English builder editions have the same fallback pattern. Other-language Donate pages also require language correction for their English fallback content.

Shared English interface phrases such as “Night mode,” “Read aloud,” the read-aloud settings dialog and English preview text inherit the surrounding page’s language. The language menu’s own language attributes do not resolve language marking elsewhere.

Impact: screen readers and browser speech may use the wrong pronunciation or voice. This is a semantic metadata issue; it can be fixed without translating or rewriting the editorial content.

Recommendation: add an actual content-language field distinct from `language_code`. Mark whole English fallback pages as English and mark English interface regions within translated pages with `lang="en"`. Then test pronunciation and language switching with VoiceOver and NVDA. Do not treat isolated names or technical terms as automatic failures: SC 3.1.2 has exceptions.

### F04 — Night-mode language-pill focus indicator has insufficient contrast

**Priority: medium. Confirmed. SC 1.4.11 Non-text Contrast (AA).**

The language-menu plugin’s specific focus rule overrides the theme’s lighter night-mode outline. Its focus outline is `#294b35` against the page’s `#151d1a`, approximately **1.76:1**, below the required 3:1 for this author-styled focus indicator.

Reproduce: enable night mode, then Tab to a language pill. The active-language border and keyboard focus are different states; the active border does not replace an adequate focus indicator.

Location: `user/plugins/language-menu/assets/language-menu.css`, `.languages.va-language-menu a:focus-visible`.

Recommendation: supply an equally specific night-mode focus rule with a contrasting light outline. Verify current and non-current pills at every history-dependent background shade, including forced colours.

### F05 — Constitution preview depends on browser-specific automatic keyboard focus

**Priority: high for WebKit users. Confirmed in the tested WebKit engine; browser-dependent. SC 2.1.1 Keyboard (A).**

On desktop the preview has a maximum height and internal scrolling. The sampled preview measured **810px visible height and 3392px content height**. Its `<aside>` has no `tabindex` and contains no interactive descendants.

axe flagged `scrollable-region-focusable` on all 13 builders in both modes, 26 instances. This warning needs interpretation: current Chromium and Firefox automatically place the preview in keyboard focus order. In tested WebKit the preview could not be focused, including by calling `focus()`, so keyboard users cannot reliably reach its internal scrolling area.

Location: `user/themes/commons/templates/stadgar.html.twig`, `.builder-preview`.

Recommendation: explicitly make the scrollable preview keyboard-focusable, label it from its heading, and give it a visible focus style. Verify arrow/Page Down scrolling and exit with Tab in installed Safari, Firefox and Chromium. This fixes the interoperability problem rather than relying solely on the automated warning.

### F06 — Enlarged text is clipped and produces horizontal overflow

**Priority: medium. Confirmed clipping; additional reflow/spacing risks. SC 1.4.4 Resize Text (AA); further checks for 1.4.10 and 1.4.12.**

At a 320px viewport with the root font increased to 200%, the brand tagline is clipped by its fixed `max-height`, the mode selector extends outside the viewport, and the Prefiguration handle no longer fits. A captured example shows only the beginning of the tagline. This is content loss in the expanded header, separate from the intentional compact-header design.

Measured page widths in this stress test: proposal **515px**, builder **416px**, Donate **344px**, Privacy **599px**, Software Licence **344px**, against a 320px viewport. At 1280px with the same text enlargement, these pages did not overflow.

At standard text size, the sampled 320px layouts passed horizontal-reflow checks in Chromium, with the proposal also passing in Firefox and WebKit. Do **not** classify the default mobile layout as a blanket SC 1.4.10 failure from the enlarged-text result alone.

Required text-spacing overrides also caused 329px page widths on several 320px samples and 387px on Privacy. No clipped link/button labels were detected in that spacing sample. Horizontal overflow alone does not establish SC 1.4.12 failure; inspect for actual loss of content or functionality under native zoom and user styles.

Locations: header/action flex layout and brand tagline rules in `site.css`; handle layout in `remember-panel.css`; long tokens and content gutters.

Recommendation: let expanded-header text grow naturally, allow controls to wrap, use a responsive tagline-collapse technique that does not clip enlarged text, and retest browser zoom, text-only zoom and prescribed text spacing. Keep the compact header accessible at short viewport heights.

### F07 — PDF export has no tagged document structure

**Priority: high for PDF use. Confirmed export limitation. SC 1.3.1 Info and Relationships (A); language/reading-order checks also needed.**

The sampled English proposal PDF contains no `/StructTreeRoot`, `/MarkInfo` or `/Lang`. Visual heading sizes in a PDF do not provide heading semantics to a screen reader. The current exporter does not produce a tagged document with programmatically identified sections and lists.

Location: `user/plugins/commons/commons.php`, Dompdf export path.

Recommendation: produce and validate tagged accessible PDFs, or provide and verify an explicitly identified conforming HTML alternative for the same information and functionality. Do not claim the PDF is accessible because its HTML source or visual layout is accessible. In particular, the constitution preview’s flat `<pre>` output needs evaluation as an alternative for structured generated documents.

PDF/UA, full reading order, links and RTF accessibility were not comprehensively evaluated. WCAG permits conforming alternate versions under defined conditions; the presence of this PDF does not by itself settle whether those conditions have been met for the whole site.

## Other issues and testing gaps

- **Misleading section label:** “05 / Swedish Roots” currently introduces the English Glossary. Rename it to match its subject. This is a headings/labels concern for SC 2.4.6, but the actual `h2` correctly says “Glossary”; it is recorded as an improvement rather than an independently established failure.
- **Multiple ways to find pages:** the site has language/project navigation and contextual links, but no search or sitemap. Verify that each page in the relevant page set has two qualifying ways of being located (SC 2.4.5). Lack of search alone is not a failure.
- **Link wording:** some content uses repeated “Link” text. Assess its programmatic surrounding context under SC 2.4.4; a generic label alone does not prove a failure if its context identifies the destination. Prefer descriptive link text.
- **Native tooltips and external links:** new-window behaviour is not consistently announced. This is useful predictability guidance; opening a link in a new window on explicit activation is not automatically an A/AA failure. Browser-native title tooltips fall under SC 1.4.13’s user-agent exception.
- **Speech availability:** actual audible synthesis, operating-system voice selection, language pronunciation and pause/resume reliability need testing on user devices. Browser read-aloud is an additional feature, not a replacement for screen-reader access to the page.
- **Older panel regression script is stale:** `test-remember-panel.cjs` selects every `button` within a panel and now finds the two new reading controls as well as the handle. The script stops on an ambiguous selector. Direct keyboard checks of the specific handle worked. The old suite cannot currently substantiate all its advertised scenarios; update its selectors and rerun it during remediation.
- **Private editor:** login was sampled, but authenticated editing, upload, saving, validation, sessions and recovery were not audited. Native password-manager support on the observed login is promising, not evidence of an accessible complete editing process.

## Checks that worked

- Public routes have a main landmark and labelled navigation regions. Sampled pages expose headings, links, form labels and buttons programmatically.
- The skip link advances sequential keyboard navigation into the content. Chromium’s active element briefly remains `BODY`, but the next Tab reaches “Read aloud: Prefiguration,” confirming bypass behaviour in that sample.
- Normal keyboard traversal of the sampled proposal and builder found no content control entirely hidden by the sticky header. Header controls and the fixed skip link were excluded from the obstruction calculation because they are displayed above/within the header, not behind it.
- The Prefiguration handle toggled its controlled content with Enter and updated `aria-expanded` in Chromium and WebKit.
- The shared speech dialog had no axe violations in the scanned state. It opened in Chromium, Firefox and WebKit; Escape closed it and restored focus to the opener in the sampled Chromium interaction.
- The read-aloud regression suite passed pause/resume, automatic transitions, playing-state/highlight handoff, completion, stop/error recovery, cookie persistence, focus restoration, mobile layout and unsupported/no-JavaScript fallback. Its speech engine is simulated.
- Native builder required-field validation identified missing name/purpose fields and moved focus to the first invalid field. Generated files are user-requested; the public builder does not submit a legal agreement or persist the draft.
- No axe text-contrast violation was reported, but **79 English proposal nodes were marked incomplete for contrast**, so this is not a clean contrast certificate. Additional rendered-colour calculations on sampled text in both modes, including the shaded section, found no text pair below its applicable minimum. SVG badges, all interaction states and assistive-technology rendering still need review.
- The login scan had no axe violations. Username and password inputs expose `autocomplete="username"` and `autocomplete="current-password"`.
- Custom playback and mode controls have descriptive names; there is no automatic speech on page load. Playback status and builder export status have live status regions.
- Main custom controls satisfy the 24px minimum size by their measured/design dimensions: read-aloud buttons are 32px on fine pointers and 44px on coarse pointers; download and mode controls retain 44px targets. Inline text links use the SC 2.5.8 exception; target spacing needs real-touch review.

## Criterion coverage ledger

This ledger covers every A and AA criterion in WCAG 2.2. **Observed** means no issue was found within the stated sample, not a certified pass. **Partial** means further human or complete-process testing is required. **N/A** applies only to features absent from the tested public site. **Fail** refers to a confirmed barrier above. The removed SC 4.1.1 is not a WCAG 2.2 requirement.

| Criterion | Level | Assessment and evidence |
| --- | --- | --- |
| 1.1.1 Non-text Content | A | Partial: icon controls have names; review all image alternatives and document graphics. |
| 1.2.1 Audio-only and Video-only (Prerecorded) | A | N/A: no prerecorded media in the sampled public content; generated reading mirrors text. |
| 1.2.2 Captions (Prerecorded) | A | N/A: no prerecorded video with audio. |
| 1.2.3 Audio Description or Media Alternative | A | N/A: no applicable prerecorded video. |
| 1.2.4 Captions (Live) | AA | N/A: no live media. |
| 1.2.5 Audio Description (Prerecorded) | AA | N/A: no applicable video. |
| 1.3.1 Info and Relationships | A | Partial for HTML; PDF failure F07. Check headings/lists and generated document structure with a screen reader. |
| 1.3.2 Meaningful Sequence | A | Observed DOM sequence; manual screen-reader reading-order check pending. |
| 1.3.3 Sensory Characteristics | A | Observed: sampled instructions do not depend solely on position, shape or sound. |
| 1.3.4 Orientation | AA | Partial: responsive layouts observed; real portrait/landscape device checks pending. |
| 1.3.5 Identify Input Purpose | AA | Observed login autocomplete; public builder primarily collects association content, not the user's personal details. |
| 1.4.1 Use of Color | A | Observed: active pills have bold/border treatment; playback also changes its icon/name. |
| 1.4.2 Audio Control | A | Observed: playback requires user activation and provides pause and stop. |
| 1.4.3 Contrast (Minimum) | AA | Partial: sampled rendered text calculations passed; automated incomplete results and untested states remain. |
| 1.4.4 Resize Text | AA | Fail F06: tagline clipping at enlarged text; native zoom testing still required. |
| 1.4.5 Images of Text | AA | Partial: primarily real HTML text; inspect format badges and future content imagery. |
| 1.4.10 Reflow | AA | Observed at standard-text 320px samples; additional zoom/spacing combinations need review, F06. |
| 1.4.11 Non-text Contrast | AA | Fail F04: night-mode language-pill focus outline. |
| 1.4.12 Text Spacing | AA | Partial: 1280px samples retained layout; 320px overflow needs loss-of-content inspection, F06. |
| 1.4.13 Content on Hover or Focus | AA | Observed: no custom hover-only disclosure identified; native tooltip exception applies. |
| 2.1.1 Keyboard | A | Fail in tested WebKit preview, F05; sampled remaining controls operated. |
| 2.1.2 No Keyboard Trap | A | Observed in public controls and dialog; full editor untested. |
| 2.1.4 Character Key Shortcuts | A | N/A: no custom single-character shortcuts identified. |
| 2.2.1 Timing Adjustable | A | Observed public forms have no completion time limit; authenticated editor session untested. |
| 2.2.2 Pause, Stop, Hide | A | Observed: user-started reading can pause/stop; no automatic moving content found. |
| 2.3.1 Three Flashes or Below Threshold | A | Observed: no flashing content found. |
| 2.4.1 Bypass Blocks | A | Observed skip navigation and main landmark in Chromium. |
| 2.4.2 Page Titled | A | Partial: all scans found titles; improve language-only proposal titles and review descriptive quality. |
| 2.4.3 Focus Order | A | Observed in sampled public flows/dialog; lengthy reading-control sequences and editor need user testing. |
| 2.4.4 Link Purpose (In Context) | A | Partial: download names descriptive; repeated “Link” labels need contextual review. |
| 2.4.5 Multiple Ways | AA | Partial: verify two qualifying page-finding mechanisms for the relevant page set. |
| 2.4.6 Headings and Labels | AA | Partial: controls/forms labelled; misleading glossary sidebar and overall hierarchy need review. |
| 2.4.7 Focus Visible | AA | Indicators exist in sampled controls; assess night-mode usability alongside F04. |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Observed in sampled keyboard traversal; zoom, native mobile keyboards and all scroll positions not exhausted. |
| 2.5.1 Pointer Gestures | A | Observed: no multipoint/path-dependent custom interaction. |
| 2.5.2 Pointer Cancellation | A | Observed: actions use native click activation rather than pointer-down. |
| 2.5.3 Label in Name | A | Fail F01: visible MD abbreviation omitted from the accessible name. |
| 2.5.4 Motion Actuation | A | N/A: no motion-operated features. |
| 2.5.7 Dragging Movements | AA | N/A in public site; authenticated editor dragging workflows untested. |
| 2.5.8 Target Size (Minimum) | AA | Observed principal controls meet 24px; inline-link exception applies; touch verification pending. |
| 3.1.1 Language of Page | A | Fail F02/F03: invalid SASL tag and incorrectly marked English fallbacks. |
| 3.1.2 Language of Parts | AA | Fail F03: substantial English interface/fallback regions inherit other languages. |
| 3.2.1 On Focus | A | Observed: focusing controls did not start speech or navigate. |
| 3.2.2 On Input | A | Observed: settings change preferences without navigation/submission. |
| 3.2.3 Consistent Navigation | AA | Observed shared header, menu, tabs and footer across scanned pages. |
| 3.2.4 Consistent Identification | AA | Observed shared controls; editorial naming consistency can improve. |
| 3.2.6 Consistent Help | A | Observed consistent shared help/settings placement where provided; absence of a help service alone is not a failure. |
| 3.3.1 Error Identification | A | Observed native public-form errors; screen-reader announcement and server-error paths need human testing. |
| 3.3.2 Labels or Instructions | A | Observed builder labels and required markers; evaluate comprehensibility with users. |
| 3.3.3 Error Suggestion | AA | Observed native missing-field suggestions; other error types and editor untested. |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | N/A for public draft export: no stored data change/legal transaction. Editor publishing process untested. |
| 3.3.7 Redundant Entry | A | Observed public export retains field values; multi-step authenticated workflows untested. |
| 3.3.8 Accessible Authentication (Minimum) | AA | Partial: login supports recognised username/password autocomplete; password-manager/paste, recovery and MFA processes untested. |
| 4.1.2 Name, Role, Value | A | Observed native controls/dialog and panel state; screen-reader/browser combinations still required. |
| 4.1.3 Status Messages | AA | Observed status regions in source and interaction tests; actual assistive-technology announcements unverified. |

## Remediation and acceptance plan

1. Correct MD naming and language metadata without changing translations. Make the preview explicitly focusable and correct night-mode focus contrast.
2. Fix enlarged-text clipping; test normal and compact headers, short viewports, user text spacing and native 200%/400% zoom. Preserve section-label clearance below the sticky header.
3. Decide the accessible-document strategy and validate exported PDFs/RTFs or their conforming alternatives, including builder-generated content.
4. Update the stale panel-test selectors. Add the confirmed failures as automated checks, including both colours and fallback-language pages. Treat axe incomplete results as review tasks rather than passes.
5. Perform complete user journeys with VoiceOver + Safari and NVDA + Firefox/Chrome: navigate headings/landmarks; open/close Prefiguration; choose a language; edit and validate a constitution; download and read it; use/stop speech; open/close settings; sign in and edit/save a page. Include real mobile screen-reader, touch and low-vision testing.
6. Re-evaluate all applicable criteria and complete processes. Claim AA only when failures are resolved and remaining partial assessments have sufficient evidence. Do not calculate a conformance percentage from automated rule counts.

## Evidence and references

Raw scan and diagnostic outputs were generated in `/tmp/tac-wcag-audit/` (`results.json`, `modal.json`, `admin.json`, `manual.json`, `contrast.json`, `cross-browser.json`, `proposal.pdf`, `200-text-mobile.png`). These are temporary local audit artifacts, not permanent repository fixtures.

Automated summary: `label-content-name-mismatch` 88 nodes; `html-lang-valid` 6; `scrollable-region-focusable` 26. The last item is browser-dependent as explained in F05. The dialog and login scans reported no violations in their sampled states. No conclusion of whole-site conformance follows from those clean states.

- [WCAG 2.2 normative recommendation and conformance requirements](https://www.w3.org/TR/WCAG22/)
- [W3C: Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html)
- [W3C: Language of Parts](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html)
- [W3C: Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [W3C: Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [W3C: Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
