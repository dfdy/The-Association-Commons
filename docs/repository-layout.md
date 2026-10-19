# Find your way around the project

[Back to the project](../README.md) · [All guides](README.md) · [Editing guide](operations.md)

The repository is the shared project folder and its version history. Grav is the
software that turns the Markdown pages into the website. Its core and upstream
dependencies are installed in the Docker image; they are not copied into this
repository.

## Where does a change belong?

| If you want to change… | Look here |
| --- | --- |
| Page text or uploaded page media | `user/pages/` |
| Shared site settings | `user/config/` |
| A feature such as reading aloud or the Join form | `user/plugins/` |
| Shared page layout, navigation, colours, or typography | `user/themes/commons/` |
| Setup, maintenance, or verification commands | `scripts/` |
| Apache access controls and logging | `docker/apache.conf` |
| PDF fonts and their licence notices | `assets/fonts/` |
| Instructions, release notes, and verification reports | `docs/` |
| Container build and local startup | `Dockerfile`, `compose.yaml`, and `.dockerignore` |

For example, the English privacy page is
`user/pages/01.en/06.privacy/default.md`. Its operator details are ordinary page
text, not a separate settings form. Editing and committing them makes them part of
the public source history.

The numbers in page-folder names control ordering. The word after the number is
the page's name in the folder tree; Grav uses that structure to build addresses.
Keep existing folder names unless you intend to change a page's address and check
its links.

## What is public, and what stays private?

`user/pages/` is the maintained public content source. An unpublished page is
hidden from website visitors, but a file committed to a public repository can still
be read there. Publication settings are not a way to keep secrets.

Accounts and visitor submissions belong in the Docker volume, not the public page
tree. The ignored `.local/` folder can hold local credentials and reference copies.
"Git-ignored" means Git does not normally add the files; it does not encrypt them
or prevent access by someone using your computer.

Docker builds use an allowlist of required inputs in `.dockerignore`. Local archives,
accounts, and private submission data are excluded. See [storage and backups](operations.md#storage-and-backups)
and the [licence map](../LICENSING.md#where-each-licence-applies) for their different roles.

## Updating a checkout from the former folder layout

If your checkout already uses the root-level `user/` and `compose.yaml`, you can
skip this section.

After updating an older checkout, run this from the repository root:

```sh
docker compose up -d --build
```

This recreates the service with the new `user/pages/` folder connection. The
project name `association-commons-grav`, service `grav`, and `grav_user` volume
remain unchanged. Keep that volume: it holds existing accounts and private records.

Commands that selected `compose.grav.yml` or `docker-compose.yml` should now use
`compose.yaml`, or simply omit `-f`. The optional setup launcher is
`python3 scripts/setup.py`. Existing Codex users can follow the
[connection instructions](operations.md#optional-content-editing-with-codex)
to register the relocated bridge.

Some development checkouts have old import tools and a legacy site in ignored
`.local/archive/`. Those are optional historical references, not a requirement
for a fresh clone. Current language and route checks use `user/pages/`.
The [dated reorganisation report](reorganisation-2026-10-19.md) records what was
moved and checked.
