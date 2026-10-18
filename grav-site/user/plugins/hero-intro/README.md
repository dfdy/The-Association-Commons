# TAC: Hero Intro

Wrap an existing Markdown heading and summary explicitly:

```markdown
[hero-intro]

[hero-label]A framework for association[/hero-label]

# The freedom to [hero-accent]organise[/hero-accent].

Your introductory paragraph.

[/hero-intro]
```

The wrapper can move anywhere in the page. It never guesses from heading text or position. Normal Markdown headings and paragraphs retain their semantics and reading order. Use one main heading per page. Styling supports day/night modes, responsive text and print without JavaScript.

All language proposals use the same wrapper around their existing headline and summary; no translations are rewritten. Downloads retain the text and headings and omit wrapper markers. Literal shortcode examples inside Markdown fences remain unchanged.

Use `[hero-accent]text[/hero-accent]` inside the headline for the original site’s green accent, adjusted for night mode. The marker is removed from downloads.

The optional `[hero-label]…[/hero-label]` tag adds an uppercase introductory label with a decorative rule. Its text remains in downloads.
