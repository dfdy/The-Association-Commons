# DDC: Language Menu

[Editing guide](../../../docs/operations.md) · [All guides](../../../docs/README.md)

Choose a language link in the page header to open that edition. The active edition
has a stronger border and bold text. Shading reflects language clicks stored in your
own browser; it is not a popularity ranking across visitors or a translation-quality
rating. The notes below explain that behaviour and its storage.

## Editor and maintainer reference

Part of The Democratic Development Commons **0.3.2**.

The theme includes `partials/language-menu.html.twig`. Languages appear alphabetically as keyboard-accessible pill links; the active language has bold text and a stronger border independently of click history.

The first-party `va_language_menu` cookie stores only the last 50 clicked language codes, shared across language pages. Darkness is the language's share of recorded clicks, capped at 50% forest green on a pale green base. Empty history means pale green; body text stays near-black for contrast at every shade. Page loads do not count as clicks.

The cookie lasts one year after the latest click, uses `SameSite=Lax`, and adds `Secure` on HTTPS. Clearing it resets the shading. It contains no identifiers, timestamps or visitor submissions and is not sent to an external service. Blocked or malformed cookies leave navigation usable. Without JavaScript, the ordinary language links still work.
