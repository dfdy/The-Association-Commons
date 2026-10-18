# DDC: Remember Panel

Part of The Democratic Development Commons **0.3.0**.

An AGPLv3 Grav plugin using Shortcode Core. Wrap an explicit section in Markdown:

```markdown
[remember-panel id="prefiguration" title="Prefiguration" reset="7d"]

## Prefiguration

Your section text, including normal Markdown formatting and links.

[/remember-panel]
```

Move the entire block to change its position. Keep `id` unchanged to retain the
saved preference. Use a different ID for an independent panel. IDs accept letters,
numbers, hyphens and underscores. No heading matching or positional detection runs.

- A bottom handle opens/closes the panel with keyboard or pointer input.
- Content starts open and remains readable if JavaScript or storage is unavailable.
- Each manual toggle remembers its state for seven days. Visits never extend it.
- Expiry reopens the panel, including while the page stays open.
- The preference is local to the browser and shared by panels with the same ID,
  including language editions. Tabs synchronize through browser storage events.
- Printing and Commons PDF/RTF/Markdown downloads always include the complete text.

`reset` accepts `1d` through `365d`; the default is `7d`. Labels can be translated:

```markdown
[remember-panel id="prefiguration" title="Prefiguration" reset="7d" show="Öppna" hide="Stäng"]

Your content.

[/remember-panel]
```

This plugin registers its own assets. The theme must render Grav's `assets.css()`
and `assets.js()` outputs; the Commons theme does so. The Commons download plugin
fires `onCommonsExportMarkdown`, which removes the wrappers while preserving prose
and literal examples inside fenced code blocks.
