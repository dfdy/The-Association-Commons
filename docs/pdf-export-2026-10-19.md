# PDF export checks: 19 October 2026

[All guides](README.md) · [Download feature guide](../user/plugins/commons/README.md)

PDF export now uses the rendered page content and shared site styles in Chromium.
The download link carries the visible light or dark theme, including a theme chosen
by the device. A direct download uses the saved colour-mode cookie, then light mode.
The A4 layout preserves document styling while omitting interactive controls and
replacing forms with website links. Expanded research records are included.

## Checks performed

- Built and started the Docker image with Chromium; service health passed.
- Activated PDF download by keyboard and checked system-dark and selected-light
  links, the colour-toggle state, and the no-JavaScript cookie fallback.
- Generated real PDFs for the English framework in both themes, isiZulu in dark
  mode, the white paper, the legal matrix, and a cookie-selected dark donation page.
- Checked palette colours at the first and last page corners against the shared
  theme styles, selectable text, attribution, PDF tags, and framework links.
- Checked the first-page project identity, copyright and Creative Commons licence,
  export date in South African Standard Time, and software version from release metadata.
- Measured 12pt normal text and proportionally scaled headings in both framework
  themes after the PDF typography adjustment; normal table text is also set to 12pt.
- Checked that main section labels precede their headings vertically and align
  with the full-width text in both framework PDF themes.
- Subsequently reduced normal text, including tables, to 10pt at the user's
  request, scaling headings proportionally and updating the PDF size checks.
- Visually inspected the framework opening, section layout, and research table
  samples. Kept the large hero heading with its introduction during pagination.
- Checked replacement of forms and removal of private values, tokens, scripts,
  event handlers, unsafe URLs, remote images, and embedded documents.
- Checked malformed theme input, hidden-page protection, private cache headers,
  PHP/JavaScript syntax, temporary-profile cleanup, and container health.
- Existing HTTP checks passed for language/supporting routes, Markdown/RTF/PDF,
  private paths, anonymous API rejection, and scoped content-account permissions.

The PDF browser test saves samples; the Python inspection check creates preview
images. See the feature guide for commands and development dependencies.

## Limits and known barriers

The renderer requests PDF tags and document outlines, but these are not proof of
accessible reading order or PDF/UA conformance. PDF screen-reader testing remains
outstanding. A4 pagination differs from the scrolling page. Only approved local
raster page images are embedded; remote or unsupported images retain alternative
text instead. Interactive browser preferences other than the colour theme are not
reproduced as a snapshot of the browser session.

The existing reading-preferences browser check reported horizontal overflow of
9 pixels at 400% text size and a 320-pixel viewport. The failure was reproduced
with the previous theme script, confirming that the new PDF-link behaviour did
not introduce it. This website layout barrier remains unresolved by the PDF work.
