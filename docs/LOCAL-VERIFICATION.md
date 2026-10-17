# Local verification — 2026-10-17

Branch: `setup/local-verification`. Displayed version remains `0.0.1`.

Verified on macOS with Colima, Docker Compose 5.6.0, the Node 22 container
image and native PostgreSQL 17.11. The host development tests used Node 26.10.0.

## Results

- Fresh Compose initialization succeeded after fixing the local VM mount.
- `npm test` passed: page/script/export parity, PostgreSQL-wire integration,
  transactional initialization, live content edits, submissions, restart/reseed
  persistence and Compose isolation contracts.
- Live HTTP verification passed for all 47 seeded page files over 48 routes,
  including all 14 language projects and the existing SASL English fallback.
  Every page matched its seed bytes and retained `v0.0.1`.
- All 70 Markdown/RTF exports matched baseline hashes after normalizing the
  request origin used in download links. Three document PDFs had PDF signatures;
  all six English/Swedish charter downloads succeeded. Licence and source
  downloads succeeded. These checks do not inspect visual browser/PDF rendering.
- Full container removal with `docker compose down`, followed by recreation
  using the same named volume, preserved the database fingerprint covering every
  row in all six content tables and `private.records`. Repeat initialization
  reported that existing content/submissions were preserved. A unique temporary
  private test record survived recreation and was then removed.
- Repeated source packaging produced identical archive hashes on macOS.

No database volumes were deleted. No commits were pushed and nothing was deployed.
The seed, page content and licence files were not changed.

## Failures and fixes

The host's Colima configuration shared only `/Volumes/Base`; the importer could
not read this workspace's bind-mounted seed. Colima was restarted with its existing
writable `/Volumes/Base` mount plus a read-only mount of this project. This is a
host configuration change, not a change to the software/content boundary.

The existing `searxng-core` container occupies port 8080. Verification used a
temporary override at `/private/tmp/commons-compose-verification.yml`:

```yaml
services:
  web:
    ports: !override
      - "127.0.0.1:18081:3000"
```

The initial verification ran at http://127.0.0.1:18081. Its commands were:

```sh
docker compose -f docker-compose.yml -f /private/tmp/commons-compose-verification.yml ps -a
docker compose -f docker-compose.yml -f /private/tmp/commons-compose-verification.yml down
```

The override is temporary; recreate it from the snippet if the OS removes it.
The owner subsequently changed the default port to 8380. The stack was rerun
with the main Compose file alone; the temporary override is no longer needed.
The current address is http://127.0.0.1:8380. Manage it with `docker compose`
without an override.

Source packaging previously required GNU tar options unsupported by macOS BSD tar.
It now stages normalized file timestamps, uses supported ownership options for
each tar implementation and writes the portable ustar format. Finder metadata
is excluded. `.gitignore` excludes installed dependencies and generated archives;
`.dockerignore` limits build input to software and the required packaging files,
excluding local dependencies, generated archives, content and private files.

The database integration test and initializer compared URL pathnames without
decoding spaces. Both now use Node's `fileURLToPath`, so this workspace path works.

## Repeat live checks

After starting a stack with the supplied seed:

```sh
node scripts/docker/test-live.mjs
# To check a different local port:
COMMONS_TEST_URL=http://127.0.0.1:18081 node scripts/docker/test-live.mjs
```

This check reads pages and generates downloads without storing submissions or
editing content. It expects the initial seed, so intentional later database edits
can cause parity failures. The container recreation check was performed separately;
the live check does not stop services or alter volumes.
