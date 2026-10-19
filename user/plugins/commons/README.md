# DDC: Commons Downloads

[Editing guide](../../../docs/operations.md) · [All guides](../../../docs/README.md)

Use the download links on a public page to save a reading copy. PDF is useful for
printing, RTF for opening in a word processor, and Markdown for plain-text editing.
Check the downloaded copy before sharing it, especially tables and complex pages.
The technical notes below explain what is included and how exports work.

PDF uses the page's light or dark theme at the time you download it, including a
theme chosen automatically by your device. It preserves the site's headings,
colours, section labels, shaded panels, glossary cards, and local page images in an
A4 document.
Normal document text is 10pt, with headings scaled proportionally. Display text
such as the hero introduction remains larger; attribution and labels remain smaller.
Section labels such as “01 / The Idea” sit above their headings in the PDF, so the
section text uses the full document width rather than a separate sidebar column.
The first page starts with the project logo and name, copyright and full Creative
Commons licence name, the export date in South African Standard Time, and the DDC
software version read from the plugin release metadata.

Paper pagination can differ from the scrolling website. Interactive
controls are omitted, expandable research records are opened, and forms become
links back to the website. Dark PDFs retain dark backgrounds, including when printed.

## Editor and maintainer reference

Part of The Democratic Development Commons **0.3.2**.

Exports published, routable public pages as Markdown, RTF, or PDF through
`?download=md`, `?download=rtf`, or `?download=pdf`. The shared toolbar is right-aligned
on all public pages. There is no active constitution-answer builder.

`onCommonsExportMarkdown` lets custom plugins turn shortcodes into readable prose.
Join fields and tokens are replaced with a form link; research records are expanded
from their public datasets. Research JSON/schema links belong to their own plugins.
Unpublished/non-routable backups are not exportable. Personal Join records are never
part of a public document export.

Root-level legacy routes redirect to their English counterparts, preserving query
parameters. PDF generation uses Chromium installed in the Docker image and the
shared theme/plugin styles, plus small pagination adjustments in
`assets/pdf.css`. The browser emulates screen media and prints backgrounds, so
print-to-paper styles do not force a light theme. `pdf_theme=day` or `night` is
validated; direct downloads fall back to the colour-mode cookie, then light mode.
The ordinary PDF link is updated when the visible theme changes.

`PdfExport.php` strips forms, controls, scripts, embedded documents, unsafe URL
schemes, and arbitrary styles. It embeds approved local raster images and fonts;
remote images are replaced by their alternative text. The renderer receives only
the sanitised document, never a visitor's cookies or private records. Page scripts
and network/file requests are blocked, and each render uses a disposable browser
profile and a 45-second limit. Tagged PDF and document outlines are requested;
assistive-technology validation of the PDF remains a separate check.

RTF conversion preserves supported text formatting. All formats retain the
content-licence attribution. Run `node scripts/test-pdf-export.cjs` with Playwright
and the local site running to check real exports and theme selection. Optional
`PDF_ARTIFACT_DIR` selects a directory for the generated samples. Inspect those
samples visually as well as checking their text and links.

For colour, text, link, and tag checks on those samples, use the development-only
Python `pymupdf` package and run `python3 scripts/check-pdf-export.py SAMPLE_DIRECTORY`.
Replace `SAMPLE_DIRECTORY` with the directory printed by the browser check. The
checker also creates preview images for visual review. These checks do not establish
PDF accessibility conformance; screen-reader review remains outstanding.
