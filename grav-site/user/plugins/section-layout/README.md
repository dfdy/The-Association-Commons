# TAC: Section Layout

```markdown
[section-layout label="01 / The Idea" description="How people organise around a shared purpose."]

## Association begins with people.

Section content.

[/section-layout]
```

The explicit label occupies 25% of the desktop content width. Content occupies 75%. Mobile stacks the label above the content, preserving reading order and semantic Markdown headings. Supports night mode, print, nested glossary cards and marker-free exports. Move a complete block to rearrange it.

English uses the seven original section labels. Other current language proposals contain only a participation section after their intro, so only the existing participation block is marked; no translated prose is added or changed.

On desktop the numbered label sticks 2rem from the top while its section scrolls, then leaves with that section. This uses CSS only, preserves reading order, and does not duplicate or move headings in the document. Labels remain in normal flow on mobile and in print.

The optional `description="Your text here"` attribute adds plain text beneath the label. Both remain sticky together on desktop. Use the opposite quote style if your text contains a quotation mark. Descriptions are escaped as text, included in downloads, and omitted entirely when not supplied.

## Numbered subsections

```markdown
[subsection number="01"]

### Freedom of association

Your existing subsection text.

[/subsection]
```

Each explicit block draws a divider and places the number beside a serif heading. Numbering is visual; real Markdown headings retain the screen-reader hierarchy. Numbers and shortcode wrappers are omitted from exports, while all prose remains. The shared styling is available in every language; existing translated prose is unchanged.

Add `surface="shaded"` to a section wrapper for a darker sage background in day mode and a lighter forest-green surface in night mode. This is explicit Markdown styling and does not depend on the heading text.
