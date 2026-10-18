# TAC: Read Aloud

Adds play/pause and settings controls to each heading and its content inside the theme’s `.prose` article. No Markdown alterations are needed. Each passage ends at the next heading, then playback advances to that heading’s control, including subsections, so text is not repeated. The previous control returns to Play and the current passage receives a subtle highlight. Collapsed passages are skipped. Controls, form fields and decorative numbering are excluded from speech. Hidden Prefiguration text is available through its section control when opened.

One native modal dialog is shared by all controls. It lists browser/device voices, supports asynchronous voice loading, and allows speeds from 0.5× to 2×. Choosing another section stops the current reading. The settings dialog also provides Stop reading. Settings changes apply when a section is started again.

The first-party `tac_read_aloud` cookie contains only the selected voice URI and speed. It lasts one year after a settings change, uses `SameSite=Lax`, applies site-wide, and adds `Secure` on HTTPS. Invalid or blocked cookies fall back safely. An unavailable saved voice falls back to the page language or browser default. There is no automatic playback.

Speech uses the browser’s Web Speech API. Available languages, voice quality and pause/resume support depend on the browser and operating system. Device voices run locally; online voices may send text to their provider. No project speech server, microphone or audio recording is used. Without JavaScript or speech support, the page remains readable and no playback controls are added.

Buttons have descriptive accessible names, settings use a native keyboard-accessible dialog with focus restoration, status changes are announced, and controls are omitted from print and document downloads. The plugin is available on all language editions and shares their day/night palette.

Run the browser regression checks with an installed Playwright module:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright node grav-site/scripts/test-read-aloud.cjs
```

These checks simulate the speech engine to verify interactions deterministically; they do not establish audible voice quality or screen-reader conformance. Test real playback with the browsers and assistive technologies used by your audience.
