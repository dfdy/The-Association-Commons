<p align="center"><img src="user/themes/commons/images/ddc-logo.svg" alt="The Democratic Development Commons logo" width="120"></p>

# The Democratic Development Commons

The Democratic Development Commons (DDC) is a working framework for people in South
Africa to learn, organise, and govern together. It explores how voluntary associations
can rebuild adult education as an emancipatory force through collective learning,
mutual aid, and democratic self-government.

**We learn democracy by doing democracy.** People should be able to understand,
question, and change the arrangements they live with. This includes the framework
and the tools in this repository: they are open to discussion, testing, and revision.

The framework is a voluntary organising agreement, not proposed legislation.
Adopting it does not confer legal personality, registration, or tax status, or replace
applicable law. International experiences inform the work, alongside South African
organising traditions and needs.

## Start where you are

You do not need to install software to read the documents or join the discussion.

| What would you like to do? | Start here |
| --- | --- |
| Understand the proposal | [Read the public framework](user/pages/01.en/proposal.md) |
| Explore the reasoning and open questions | [Read the white paper, working version 1.7](user/pages/01.en/04.white-paper/default.md) |
| Try the website on your computer | [Follow the installation guide](docs/install.md) |
| Plan a cloud-hosted site | [Compare VM requirements and South African hosting providers](docs/cloud-hosting.md) |
| Change a page or add an image | [Use the editing guide](docs/operations.md#edit-a-page) |
| Help with language, accessibility, research, or code | [Find a way to contribute](CONTRIBUTING.md) |
| Find a file or understand the software | [Explore the repository layout](docs/repository-layout.md) |
| Reuse the writing or software | [Read the licence guide](LICENSING.md) |

The linked framework and white paper are the website's source documents. On GitHub,
some formatting instructions may appear in square brackets. For the fully formatted
versions, start the local website and open [the framework](http://localhost:8388/en)
or [the white paper](http://localhost:8388/en/white-paper). These addresses work only
while the site is running on your computer.

The white paper is a longer discussion. Its executive summary offers an overview;
Part I develops the reasoning, Part II presents the public framework, and Part III
examines criticisms and unresolved questions. You can begin with the part that
speaks to your interests.

![The Democratic Development Commons: The freedom to organise. Collective learning, mutual aid, and democratic self-government.](docs/images/democratic-development-commons-hero.png)

## What holds the framework together?

The proposal develops ten organising principles:

1. Freedom and voluntary association.
2. Equal standing.
3. Collective self-government.
4. Difference without domination.
5. Substantive participation and accessibility.
6. Collective learning and inquiry.
7. Shared stewardship, mutual aid, and ecological responsibility.
8. Accountable power, dissent, and review.
9. Autonomy and federation.
10. Open-ended and reflexive development.

These are starting points for collective work. The [public framework](user/pages/01.en/proposal.md)
connects them to practical commitments, recurring reviews, and a glossary.

## What can the website do now?

The current website is version **0.3.1**.

- Read the framework in 13 language sections, adjust text size and colours, listen
  to passages, and download public pages as Markdown, RTF, or PDF.
- Explore 16 provisional legal research records and seven draft governance patterns.
  These resources identify questions and possibilities; the initial records still
  need verification, and the patterns have not been tested.
- Express interest in participation or a community-led translation project through
  the contact or Join form. Submission does not create membership or subscribe
  anyone to a mailing list, and no automatic email is sent.
- Suggest another registered language and see counts of accepted suggestions.
- Read about the planned Association Constitution Drafting Tool, reached through
  the **Constitution Jumpstart** tab. It is a description of future work; no
  constitution-building form or payment collection is active.

Written language editions include machine-generated translations that need review
by speakers of those languages. The Kaaps proposal includes user-supplied reviewed
text; its edition still invites Kaaps-speaker community review. South African Sign Language (SASL) currently has written-English
support, pending signed media. A language section does not mean a translation has
been approved by its community.

The [privacy notice](user/pages/01.en/06.privacy/default.md) explains what the forms
store and who can read it. Operator contact details and production hosting
arrangements remain to be supplied. The supplied setup runs locally on your
computer; [public hosting requires further preparation](docs/operations.md#before-public-hosting).

## Try it locally

You need Git and a running Docker installation. The [installation guide](docs/install.md)
explains these tools, gives instructions for macOS, Windows, and Linux, and helps
with common problems. If they are already installed, run each line in order:

```sh
git clone https://github.com/dfdy/The-Democratic-Development-Commons.git
cd The-Democratic-Development-Commons
docker compose up -d --build
```

Open [the language-selection landing page](http://localhost:8388) or [the editor](http://localhost:8388/admin)
when startup finishes. To retrieve the generated initial login, run:

```sh
docker compose exec --user www-data grav cat user/data/commons-private/admin-login.txt
```

Keep the password private and change it after signing in. Page edits are saved in
`user/pages/` in your project folder. Accounts and private submissions are stored
separately in a Docker volume, which is storage managed by Docker. Keep both when
backing up your site.

See [installation and troubleshooting](docs/install.md), [editing and maintenance](docs/operations.md),
or the [documentation index](docs/README.md) for the next step.

## Sharing the work

The writing and the software have separate licences:

| Material | Licence |
| --- | --- |
| Framework, translations, glossary, constitution templates, and first-party editorial images | [CC BY-NC-SA 4.0](LICENSE-CC-BY-NC-SA-4.0.txt): attribution, noncommercial use, and share-alike |
| Custom theme, plugins, scripts, tests, and software documentation | [GNU AGPLv3 only](LICENSE): software use, modification, and sharing under its terms, including commercially |

These apply to different material; they are not alternative licences for the same
work. Third-party components retain their own terms. The [licence guide](LICENSING.md)
explains the scope and exclusions, including private submissions.

Our accessibility target is WCAG 2.2 Level AA. This is a development commitment,
not a claim of a completed audit. [Contributions](CONTRIBUTING.md) can include
identifying barriers, explaining an unfamiliar term, or sharing a disagreement.
