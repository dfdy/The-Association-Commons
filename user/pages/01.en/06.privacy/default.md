---
{
  "title": "Privacy policy",
  "language_code": "en",
  "language_name": "English",
  "published": true,
  "visible": false,
  "source_route": "/privacy/",
  "content_license": "CC BY-NC-SA 4.0"
}
---

# Privacy policy

The Democratic Development Commons · Site version **0.3.1** · Last reviewed: **19 October 2026**

This notice describes the current Grav website and its project-interest and language-suggestions plugins. It does not describe the retired site's forms or promise features that are not implemented.

## Responsible party and contact

The project's responsible party's legal name, postal address, privacy contact, and Information Officer details are still pending confirmation. Production hosting locations, provider arrangements, and backup retention also remain to be confirmed. These details must be supplied before public launch; no fictitious identity or contact address is given here. The project does not claim registered NPO, PBO, or section 18A status.

There is not yet a published privacy-request contact. Do not use the Join form to send identity documents, sensitive complaints, or information about another person. The Information Regulator's independent request and complaint resources are linked below.

## What the Join form collects

The interest form on the proposal pages and the English **Contact** page asks for:

- Your name and email address, both required.
- Your organisation or community, optional.
- A message about how you would like to take part, optional.
- Required confirmation that the project may store and use these details to consider and respond to your interest.

The server saves these fields with a random record identifier, UTC submission time, request type, source page, language code, consent confirmation, and consent-notice version. The source page and language code identify the edition used to submit. Translated form labels and messages use bundled machine-translated text; submission contents are not sent to a translation service. It does not add your IP address or user-agent string to the submission record.

Submitting the form expresses interest only. It does not approve membership, create an account, enrol you in a mailing list, forward your details to another language project, or send an automatic email. The purpose is to consider and respond to your interest, including translation-project proposals and participation enquiries, and coordinate participation you have requested. Your details are not permission for unrelated newsletters, marketing, or donation appeals. Browsing and downloads do not require a submission.

Avoid sensitive information, including health details, identity numbers, political affiliations, and information about children. The form is not designed to collect those categories of information or to verify consent on another person's behalf.

## Private storage and back-end access

Submissions are JSON records in a private directory in the Grav server's data volume. They are separate from public page content, excluded from Git, and blocked from direct web access. The plugin does not send them to an external form service.

Authenticated **super-admins** can review and search submissions in **Admin → Project interest**, including the name, email, optional fields, consent, and submission metadata. They can delete individual records after confirmation. Ordinary page editors and the content-editing MCP account cannot use these private submission endpoints. Authorised server operators can also inspect and delete records through the maintenance command. The administration responses are marked private and not cacheable.

There is no public directory of submissions or public export of personal records. The public content and software licences do not licence personal submissions for reuse. Server operators and hosting providers may still have infrastructure-level access; restrict those accounts and backups separately.

## Retention and deletion

The default submission-retention setting is **90 days**, configurable by an administrator. Expired active records are removed when a later submission is handled, when a super-admin loads the submission list, or when an operator runs maintenance cleanup. Without traffic or a scheduled cleanup, expired files can remain until the next cleanup event. Administrators must schedule cleanup if deletion is required independently of use.

A super-admin can delete an individual record from the back end, and a server operator can delete one using the maintenance command. These actions remove the active stored record. They do not erase separately retained backups, correspondence, or hosting logs. Backup retention and any justified need to retain other copies must be established by the responsible party.

## Form security and session data

The form uses a Grav session cookie, a session-bound verification token, and an issued form identifier. These support verification, error handling, confirmation, and duplicate-retry protection. Issued form identifiers expire after one hour; the current session timeout is one hour. Session cookies are required for the form, including its non-JavaScript version. Removing a browser cookie does not remove a submission already saved on the server.

A private rate counter uses a keyed hash of the connecting IP address. The default limit is ten accepted submissions from a connection in an hour; people sharing a connection share that limit. Repeating the same issued form does not save a second record. Counters expire after one hour and are removed or reset on later processing. An expired counter can remain on disk until cleanup. A hidden spam field and server-side size and field validation also help prevent abuse.

The local development site uses HTTP on localhost. Public hosting must configure HTTPS and secure session cookies. These controls do not amount to a completed security or privacy-compliance audit.

## Reading preferences and browser speech

The current site stores these functional preferences:

| Storage | Contents and duration |
| --- | --- |
| `tac-colour-mode` cookie | Day/night choice, up to one year after a change. Without a saved choice, the site follows your device preference. |
| `ddc-text-size` cookie | Text-size percentage from 50% to 400%, up to one year after a change. |
| `va_language_menu` cookie | The last 50 clicked language codes, up to one year after a click, used to shade language buttons. The list remains alphabetical. |
| `tac_read_aloud` cookie | Selected voice identifier and speed, up to one year after a settings change. No reading history is saved. |
| Browser local storage for remembered panels | Open/closed state and expiry for the prefiguration box, normally seven days after a manual toggle, shared between language editions. |

Preference cookies use SameSite=Lax and add Secure when the site uses HTTPS. They contain no form name or email. You can clear or block them through your browser, which may reset the corresponding preferences. Administrative sign-in has separate authentication/session storage managed by Grav.

Read-aloud playback starts only when you choose it. The browser or operating system supplies voices; online voices may send the chosen page text to their provider, while device voices can operate locally. The site does not record microphone input or save speech recordings. The read-aloud plugin excludes form fields from the text it sends to the speech engine. There is no signed-language video translation yet; the SASL edition provides written-English support.

## Downloads, research resources, and other services

The old constitution builder has been removed. The **Association Constitution Drafting Tool** page describes a planned tool and does not collect constitution answers. Markdown, RTF, and PDF buttons export the current public page content, processed in request memory. The Join form's fields and tokens are replaced by a link to the corresponding language proposal in those exports.

The legal matrix and governance-pattern library publish research records, not Join submissions. Their JSON/schema downloads contain that public research data. Search and filters run in the browser; DataTables and jQuery are served locally. They do not send visitor searches or submissions to a third-party table service.

The English **Suggest a language** page saves only a random identifier, the matched registered language name and code, and the UTC submission time. It does not save the typed spelling, name, email, or other contact details. Public tallies show only language names and totals, not individual timestamps or identifiers. These are counts of accepted suggestions, not verified unique people, and decrease when records expire or are deleted. Existing language editions cannot be suggested again.

Language suggestions use a separate private storage directory, session-bound verification, duplicate-retry protection, a hidden spam field, and a separate keyed-IP rate counter with the same defaults as Join: ten accepted submissions per connection per hour and 90-day retention. Counts, administrative listing, subsequent submissions, and manual maintenance trigger retention cleanup. Without traffic or scheduled maintenance, expired files can remain until cleanup. Backups are separate. Only super-admins can search, inspect, and delete individual suggestions under **Admin → Language suggestions**; ordinary editors and the MCP account are denied. No external registry service receives submitted names: matching uses a bundled snapshot. Public page downloads replace the suggestion form with a link.

No payment form, advertising tracker, analytics script, or automatic marketing service is configured. Linked external websites have their own privacy practices.

## Hosting, logs, and transfers

The configured PHP/Apache host receives network requests. Apache access logs include the connection address, time, request method/path, protocol, status, and response size; the configured log format excludes query strings and form bodies. Infrastructure and authentication services may keep additional operational or security logs. The project-interest plugin does not deliberately log submitted field values.

The current implementation stores Join records in the Grav data volume, rather than the previous site's object-storage service. Production hosting regions, recipient countries, provider log periods, contractual safeguards, and backup handling have not yet been verified. This notice therefore does not promise South African-only processing or a particular international-transfer arrangement. Browser voice services and external links may involve separate providers outside South Africa.

## Requests, rights, and complaints

The project intends to process expressions of interest on the consent requested in the form. Withdrawing that consent, asking to access or correct information, requesting deletion, or raising an objection requires an effective project contact, which is still pending publication. Once available, provide the email used and approximate submission date; do not send unnecessary identity documents. Applicable legal conditions can affect what must be corrected, deleted, or retained.

The [Information Regulator's POPIA guidance](https://inforegulator.org.za/popia/) explains the relevant framework. Its [request forms](https://inforegulator.org.za/popia-forms/) include objection and correction/deletion forms, and its [complaints guidance](https://inforegulator.org.za/complaints/) provides an independent complaint route. This notice does not claim completed POPIA compliance.

## Changes

Material changes to collection, purposes, recipients, retention, or services will require an updated notice and any necessary additional choices. A later policy edit does not by itself authorise an incompatible use of earlier submissions. This page's review date and the site's version identify the implementation described here.
