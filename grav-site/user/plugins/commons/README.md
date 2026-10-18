# DDC: Commons Downloads

Part of The Democratic Development Commons **0.3.0**.

Exports published, routable public pages as Markdown, RTF, or PDF through
`?download=md`, `?download=rtf`, or `?download=pdf`. The shared toolbar is right-aligned
on all public pages. There is no active constitution-answer builder.

`onCommonsExportMarkdown` lets custom plugins turn shortcodes into readable prose.
Join fields and tokens are replaced with a form link; research records are expanded
from their public datasets. Research JSON/schema links belong to their own plugins.
Unpublished/non-routable backups are not exportable. Personal Join records are never
part of a public document export.

Root-level legacy routes redirect to their English counterparts, preserving query
parameters. PDF generation uses the pinned local Dompdf dependency and bundled fonts;
remote HTML/PHP/JavaScript execution is disabled. RTF conversion preserves supported
text formatting. Exports carry the content-licence attribution.
