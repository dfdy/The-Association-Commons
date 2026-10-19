# DDC: Read Aloud

[Editing guide](../../../docs/operations.md) · [All guides](../../../docs/README.md)

## Listen to a passage

1. Find the play button after the passage you want to hear and activate it.
2. Use the same button to pause or resume. Reading continues through subsequent
   visible passages.
3. Open the settings button beside a play button to choose a voice and reading
   speed. Changes take effect when a section starts; start the section again to
   use them immediately.
4. Choose **Stop reading** in settings to end playback. Close the settings dialog
   with **Done** or Escape.

The same voice setting applies across sections and language pages. Available
voices depend on your browser and device. Online voices may send the page text to
their provider; choose a device voice if you need local speech. If no suitable voice
is available, the text and downloads remain usable.

You can reach buttons with Tab and activate them with Enter or Space. The settings
dialog lists keyboard shortcuts. Screen-reader or browser shortcuts can take priority.
If playback fails, try another available voice or read a downloaded copy.

## Editor and maintainer reference

Part of The Democratic Development Commons **0.3.2**.

Adds play/pause and settings controls after each heading’s passage inside the theme’s `.prose` article. No Markdown alterations are needed. Each passage ends at the next heading, then playback advances to that heading’s control, including subsections, so text is not repeated. The previous control returns to Play and the current passage receives a subtle highlight. Collapsed passages are skipped. Controls, form fields and decorative numbering are excluded from speech. Hidden Prefiguration text is available through its section control when opened.

One native modal dialog is shared by all controls. It lists browser/device voices, supports asynchronous voice loading, and allows speeds from 0.5× to 2×. Choosing another section stops the current reading. The settings dialog also provides Stop reading. Settings changes apply when a section is started again.

The bottom of the dialog lists working keyboard shortcuts: Alt+Shift+P for play/pause, Alt+Shift+Right/Left for next/previous passage, Alt+Shift+X to stop, and Alt+Shift+V for settings (Option instead of Alt on Mac). They are inactive in text fields, editable content and selects, and require modifiers to avoid single-character shortcut conflicts. Enter/Space activate focused buttons and Escape closes the dialog. Browser or assistive-technology shortcuts may take priority.

The first-party `tac_read_aloud` cookie contains only the selected voice URI and speed. It lasts one year after a settings change, uses `SameSite=Lax`, applies site-wide, and adds `Secure` on HTTPS. Invalid or blocked cookies fall back safely. An unavailable saved voice falls back to the page language or browser default. There is no automatic playback.

Speech uses the browser’s Web Speech API. Available languages, voice quality and pause/resume support depend on the browser and operating system. Device voices run locally; online voices may send text to their provider. No project speech server, microphone or audio recording is used. Without JavaScript or speech support, the page remains readable and no playback controls are added.

Buttons have descriptive accessible names, settings use a native keyboard-accessible dialog with focus restoration, status changes are announced, and controls are omitted from print and document downloads. The plugin is available on all language editions and shares their day/night palette.

Run the browser regression checks with an installed Playwright module:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright node scripts/test-read-aloud.cjs
```

These checks simulate the speech engine to verify interactions deterministically; they do not establish audible voice quality or screen-reader conformance. Test real playback with the browsers and assistive technologies used by your audience.

Playback and settings controls appear after each heading’s passage, before the next heading. Nested content wrappers retain their controls.

Placement validation: Chromium regression checks passed for controls following passage content, accessible names, play/pause, keyboard shortcuts, dialog focus restoration, mobile, language editions and no-JavaScript fallback. Speech was simulated; real audio and screen-reader testing remain unperformed.

Remember-panel passages end inside `.remember-panel__content`, before the separate
open/close handle. Their playback controls hide with the collapsed content.
Chromium checks verify keyboard collapse/reopen, playback-control visibility, and
focus remaining on the open/close handle. Screen-reader testing remains outstanding.
