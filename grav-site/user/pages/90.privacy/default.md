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

Voluntary Associations: The Association Commons

Last reviewed: 17 October 2026. This policy describes the current site, version 0.1.2. It covers browsing, expressions of interest, language suggestions, document creation and accessibility preferences.

## Draft — operator details still to be confirmed

The collection described below is implemented, but this notice is not ready for a public launch until the responsible party’s legal name, address, privacy contact and Information Officer details are supplied. Retention arrangements and account-specific hosting locations and transfer safeguards also need confirmation. No fictitious contact details or registration status are supplied here.

## 1. Who is responsible and how to contact us

The person or organisation deciding how this project uses personal information is the responsible party under South Africa’s Protection of Personal Information Act 4 of 2013 (POPIA). The project name alone does not identify that legal person. The project does not currently claim registered NPO, PBO or section 18A status.

Responsible party’s legal name: pending confirmation. Physical or postal address: pending confirmation. Privacy email and Information Officer contact: pending confirmation. There is currently no dedicated privacy-request form or published project privacy email. Do not put identity documents or sensitive privacy requests into the interest form as a substitute. The Regulator’s independent complaint route is listed below.

## 2. Information supplied through the interest forms

When you submit a general or language-project expression of interest, the application receives your name, email address, optional organisation or community, optional explanation, and the consent checkbox. For a language project it also receives the selected project code. Name, email and the consent checkbox are required for the form to succeed; the other descriptive fields are optional. No law requires you to submit this form. You can browse and use the document tools without doing so.

The saved record contains your name, email, optional organisation and explanation, request type, project code where applicable, a random record identifier and submission time. The checkbox is checked by the server but is not stored as a separate consent-history record. Records are held in private hosted object storage; the application provides no public listing or public download of them. The brief About summary remains unchanged; this policy gives the current operational storage detail.

These details are used to consider and respond to your stated interest and coordinate requested participation. Submitting the form does not create membership. There is no automated acceptance, mailing-list enrolment or automatic email forwarding. A language project does not automatically receive a copy of your personal record merely because you selected it.

## 3. Language suggestions and public tallies

When you type a suggestion and submit it, your spelling is sent to this site for matching against a language-name registry. A request identifier and, if you confirm a match, the chosen language code are sent too. The saved suggestion contains the registered language code and name and the submission time; the request identifier forms part of its storage key to prevent duplicate counts on retries. The application does not save the typed spelling, name or email as part of the suggestion record.

Visitors can see language names and aggregate suggestion counts. Individual suggestion records, request identifiers and submission timestamps are not exposed by the public tally endpoint. Counts are not verified unique people. They should not be used to infer who supports a language or project.

For abuse prevention, the suggestion endpoint temporarily uses the connection IP address in an in-memory counter with an hour-long submission window. It does not write that IP address into the saved suggestion. Old counter entries are removed on later requests or when the server runtime resets; an idle runtime may retain an expired entry until that cleanup occurs. Hosting providers may separately process network records as described below.

## 4. Stadgar drafts and document downloads

While you edit, your draft is held in the page’s memory. The application does not autosave it to an account, database, browser local storage or session storage. Leaving or reloading the page can lose the draft. Names, purposes, optional locations, adoption records, signatories and any other information you enter may identify you or other people.

When you request PDF, Markdown or RTF from the builder, the current form values and document language are sent over HTTPS to this site’s export endpoint. The application processes them in memory and returns the requested file. It does not intentionally persist the draft, add it to the interest records or log the draft body. The application does not send the text to an AI model or a separate document-conversion service. Hosting infrastructure still handles the request; this is not a promise that no service provider can process it.

Downloading a regular content page sends its page address to the export endpoint, rather than a personal draft. Export responses are marked private and no-store. Files you save, share, print, synchronise or back up afterwards are under your control and any services you choose. Avoid putting another person’s unnecessary personal or sensitive details into a draft.

## 5. Cookies, preferences and the language heat map

On the Grav site, the first-party tac-colour-mode cookie remembers your day/night choice for up to one year after you change it. It contains only day or night, applies across the site, and uses SameSite=Lax and Secure on HTTPS. Without a saved choice, the site follows your device’s colour preference. Your browser sends this cookie with requests to the same site. Clearing it resets the preference. A previously saved local-storage choice is moved into the cookie when available.

On the Grav site, va_language_menu stores the last 50 language-menu clicks as language codes for up to one year after your latest click. Each language’s share of those clicks determines its button shading, capped at 50% darkness. The list remains alphabetical. The cookie contains no visitor identifier or timestamps; clearing it resets the shading.

The application sets first-party preference cookies automatically. It has no advertising tracker, third-party analytics script, individual advertising profile or cookie-consent manager. Functional preferences are not presented as consent to unrelated processing. Browsers send applicable cookies with requests to the same site, even though this application uses the preference values in the browser rather than writing them into its submission records.

association_edition_preferences: theme, language order, per-language integer click counts, chosen speech voice identifier and reading speed. Its requested lifetime is up to 400 days from a save, and it is renewed when preferences are saved, including on page visits. The browser may expire it sooner. Click counts shade and reorder your own language buttons; the application does not combine them into a central visitor analytics dataset. This cookie contains no form name or email and no separately generated visitor identifier.

association_prefiguration_seen_until: remembers a display expiry for up to 24 hours. association_prefiguration_week_until: remembers the optional close-for-one-week choice for seven days. Older visit-count and open-state cookies are removed during migration.

You can remove or block these cookies using your browser’s site-data settings. Preferences and collapsed-state choices may then reset. Removing cookies does not delete a form submission already stored on the server. Any hosting or account-authentication cookies are separate from these application cookies and are subject to the relevant provider’s notice.

## 6. Browser speech and accessibility

The reader uses your browser’s speech-synthesis interface. It reads the available voice names and language identifiers to populate the selector, and sends the passage you choose to the browser’s speech engine. Some voices are local and others may use a browser or operating-system provider’s online service. In the latter case that provider may receive the text, including draft text if you play your draft. Its processing depends on your device, selected voice and provider settings.

The application does not record microphone input or save generated speech recordings. It saves the chosen voice identifier and speed in the preference cookie. Pre-generated audio and signed-language media are not currently implemented. You can use the page without enabling speech.

## 7. Hosting, service providers and other recipients

The site is hosted through ChatGPT Sites, operated by OpenAI, and the current application uses Cloudflare Worker and private object-storage infrastructure. Providers necessarily handle network requests and may process IP addresses, requested addresses, browser or device headers, security events and service logs. The application itself does not add a general visitor log or analytics database. Provider log contents, retention and backup arrangements have not been independently confirmed for this account.

Access to project-held personal records is intended to be limited to authorised project administrators and service providers supporting hosting, storage, security and maintenance. Personal submissions are not covered by the public content/software licences and are excluded from the downloadable source archive. The application includes no sale of personal records, advertising-data feed, public member directory or automatic disclosure to other language projects. Any later additional recipient or purpose needs a lawful basis and an updated notice.

Platform sign-in or access controls may operate separately from the site’s forms. This application does not request or read a ChatGPT account profile. Account information processed by the platform is governed by its own arrangements. See OpenAI’s privacy policy, Cloudflare’s privacy policy and Sites privacy guidance. These provider notices do not replace the project’s own responsibilities. ([Link](https://openai.com/policies/privacy-policy/)) ([Link](https://www.cloudflare.com/privacypolicy/)) ([Link](https://help.openai.com/en/articles/20001341-preparing-a-privacy-policy-for-your-chatgpt-site))

## 8. Purposes and lawful grounds

Interest-form processing relies on the consent requested at submission, under POPIA section 11(1)(a). The identified legitimate interests for limited technical processing are delivering the site and requested exports, remembering functional choices, securing the service and preventing suggestion spam, subject to section 11(1)(f) and your applicable objection rights. The responsible party must assess necessity and impacts and confirm these grounds before public launch. Legal obligations may justify specific preservation or disclosure where applicable. Merely browsing is not blanket consent.

Contact details supplied for an expression of interest are not permission for donation appeals, unrelated newsletters or other direct marketing. The current site sends none automatically. Any future marketing process must meet POPIA’s applicable requirements, including section 69 for electronic direct marketing.

## 9. Retention and deletion

POPIA section 14 limits retention to a justified period and permits specified exceptions. Relevant factors include whether the requested participation is still being considered, whether correspondence is needed, and whether a specific legal obligation or dispute requires preservation.

Current implementation: there is no automatic expiry or deletion job for interest or language-suggestion records. They remain in private storage until an authorised administrator deletes them. No maximum period, review timetable or backup-deletion interval has yet been confirmed. Those operational arrangements must be settled before public collection, rather than treating indefinite storage as the policy. Unneeded identifiable records should then be deleted or effectively de-identified, with any legally necessary retained copy restricted to its justified purpose.

Draft exports are processed temporarily in request memory and are not intentionally stored by the application. IP-based suggestion counters and cookies have the windows described above. Hosting logs, account data and provider backups follow separately confirmed provider arrangements; this notice does not promise immediate erasure from infrastructure the application does not control. Aggregate language counts may be kept after they no longer identify anyone.

## 10. Security and security incidents

Implemented application controls include HTTPS access, private record storage, server-side validation and request-size limits, same-origin checks for submitted forms, a hidden spam field, a basic suggestion rate limit, and no public route for personal submissions. These measures do not establish complete security: administrator access, account protection, provider contracts, backup controls and operational monitoring must also be maintained. Avoid sensitive details that are not necessary for your request.

If a qualifying security compromise occurs, POPIA section 22 requires notification to the Information Regulator and affected people as soon as reasonably possible, subject to statutory exceptions and permitted delay. Incident investigation should preserve necessary evidence while limiting further access.

## 11. International processing

Global hosting, storage, support or an online speech provider may process information outside South Africa. This account’s storage region, recipient countries and contractual transfer safeguards have not yet been verified; this policy does not claim South African-only hosting or an executed transfer agreement. Before public collection, the responsible party must verify recipients and establish an applicable POPIA section 72 transfer ground and appropriate safeguards. Choosing a language is not consent to an unspecified international transfer.

## 12. Sensitive information, children and decisions

The forms do not request identity numbers, health records, racial or ethnic information, religious beliefs, political persuasion, trade-union membership, criminal history or biometric data. Free text or an association’s stated purpose could nevertheless disclose sensitive information. The ordinary interest checkbox does not authorise every category of special personal information; POPIA sections 26–33 require an applicable authorisation.

No child-specific consent or verification process is configured. Before knowingly collecting a child’s information, the responsible party must establish an applicable basis under POPIA sections 34–35. Until appropriate arrangements are confirmed, do not submit a child’s identifying details through these forms.

Language-name matching suggests registered names; uncertain matches require your confirmation. Spam checks and rate limits can reject a request but do not decide membership. The application does not make automated membership decisions or build a profile for legal or similarly significant decisions.

## 13. Your rights and how to exercise them

Subject to the applicable legal conditions, you can ask whether personal information is held about you, request access, seek correction, request deletion of information that is inaccurate or no longer lawfully retained, and request restriction where appropriate. You can withdraw consent for future consent-based processing or object on applicable grounds. Withdrawal does not make earlier lawful processing unlawful. Some records may need to be retained for a specific lawful reason; a refusal should explain that reason and available recourse.

The project privacy contact is still pending, so an effective project request route must be published before public launch. Once available, identify the form or project, approximate submission date and the email used; provide only proportionate evidence needed to verify your request. Do not send an identity-document copy unless a justified verification process requires it. Browser cookies can be removed locally without identifying yourself. Anonymous suggestion counts may not be traceable to you without your request identifier.

The Information Regulator provides POPIA request forms, including objection and correction/deletion forms. Access to records may also involve PAIA where applicable; any required manual and Information Officer arrangements must be confirmed for the responsible party. ([Link](https://inforegulator.org.za/popia-forms/))

## 14. Complaints, external links and changes

You can raise concerns with the project once its contact channel is published, and you may independently complain to South Africa’s Information Regulator. Use its current complaints instructions and eServices portal. General enquiries: enquiries@inforegulator.org.za, 010 023 5200. Current contact information is available on the Regulator’s contact page. You do not waive complaint rights by using this site. ([Link](https://inforegulator.org.za/complaints/)) ([Link](https://eservices.inforegulator.org.za/)) ([Link](https://inforegulator.org.za/contact-us/))

External legislation, licence and other resource links take you to separate sites with their own privacy practices. No payment method is currently provided, and this application does not collect card or bank-account details for donations. Before a payment provider, mailing list, analytics tool, new data-sharing arrangement or other collection is introduced, this policy and any necessary choices must be updated.

Changes will be dated here. A policy update does not automatically authorise a new incompatible use of information previously collected. Additional notices or consent will be provided where required. The site’s displayed release number remains 0.1.2 unless its owner explicitly changes it.

## 15. Legal and operational references

This policy is framed around South African POPIA, including sections 9–14, 18–25, 26–35, 55, 69, 71–72 and 74. Other laws may apply where the responsible party or visitors are located; this notice does not claim universal legal compliance. Official sources and the implementation facts above should guide the operator’s final review.

POPIA — Department of Justice text · POPIA — original Government Gazette · Information Regulator’s POPIA guidance · Rights request forms. ([Link](https://www.justice.gov.za/legislation/acts/2013-004.pdf)) ([Link](https://www.gov.za/sites/default/files/gcis_document/201409/3706726-11act4of2013protectionofpersonalinforcorrect.pdf)) ([Link](https://inforegulator.org.za/popia/)) ([Link](https://inforegulator.org.za/popia-forms/))
