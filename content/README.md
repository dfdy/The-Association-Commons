# Website content — CC BY-NC-SA 4.0

`seed.json` is the initial content snapshot of the published site at commit
69f6387a868d491b1c20707157056a9be23ca4a8 (original display version 0.0.1), with the owner-authorized release number
updated to 0.0.2.
It contains page HTML, all text/markup fragments used by frontend and document
software, document export models, the bilingual stadgar schema, and language data.
Third-party language registry data retains its original terms; see LICENSING.md.

The seed is an installation fixture, not the live database. The seed service
imports it exactly once, transactionally, on the first `docker compose up`.
Subsequent starts preserve all database edits. Editing this JSON after installation
does not silently replace existing content. Database content is authoritative except for the privacy policy section and
export model: root `../privacy-policy.yaml` is imported on every Docker web start.
Edit both its HTML section and document model together; see the root README.

Software assets are in ../software; no JavaScript programs are stored in the
content tables. Page HTML retains the current presentation for exact continuity;
inline styles/structure in those page bodies are not a general executable plugin
system. The future editor should expose safe structured fields, sanitize HTML,
and require authentication, authorization and revision history.

Live submissions belong to private.records, not the public content tables or seed.
No live submissions or credentials were imported from the hosted site.
