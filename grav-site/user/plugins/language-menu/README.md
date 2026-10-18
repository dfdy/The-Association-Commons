# DDC: Language Menu

Part of The Democratic Development Commons **0.2.1**.

The theme includes `partials/language-menu.html.twig`. Languages appear alphabetically as keyboard-accessible pill links; the active language has bold text and a stronger border independently of click history.

The first-party `va_language_menu` cookie stores only the last 50 clicked language codes, shared across language pages. Darkness is the language's share of recorded clicks, capped at 50% forest green on a pale green base. Empty history means pale green; body text stays near-black for contrast at every shade. Page loads do not count as clicks.

The cookie lasts one year after the latest click, uses `SameSite=Lax`, and adds `Secure` on HTTPS. Clearing it resets the shading. It contains no identifiers, timestamps or visitor submissions and is not sent to an external service. Blocked or malformed cookies leave navigation usable. Without JavaScript, the ordinary language links still work.
