# Voluntary Associations: The Association Commons

## The freedom to organise.

A proposed South African law for voluntary associations, inspired by the Swedish tradition of ideella föreningar (voluntary / non-profit associations): collective purpose, member self-governance, and accountability from below.

This text is a proposal for consideration. It is not an Act of Parliament and has no legal force.

## Seven organising principles

1. **Freedom of association** — föreningsfrihet — People may form, join, support or leave voluntary associations without a general requirement for prior state permission.
2. **Collective self-governance** — självbestämmande — Members decide their shared purposes, internal arrangements and activities subject to constitutional rights and the law.
3. **Democratic member control** — medlemsdemokrati — The constitution provides fair and meaningful routes for members to participate in decisions, elections and oversight.
4. **Shared purpose** — gemensamt ändamål — The association acts for a declared common purpose; surplus resources advance that purpose instead of being distributed as profits.
5. **Constitutional governance** — stadgar — Written rules establish membership rights, office-bearer powers, decisions, accountability, amendments and winding-up.
6. **Separate legal personality** — självständighet — An eligible association may hold rights and incur obligations in its own name, separately from individual members.
7. **Accountability** — ansvarsskyldighet — Delegated decision-makers answer to members through reporting, scrutiny, review and fair procedures.

![The freedom to organise — a proposed South African law for voluntary associations, inspired by the Swedish tradition of ideella föreningar.](docs/images/association-commons-freedom-to-organise.png)

The multilingual website is packaged for self-hosting with PostgreSQL.
Displayed version: **0.0.2**. Do not increment it without the project owner's instruction.

## Run the website

### 1. Install Git and Docker

Git downloads a copy of this project to your computer. Docker runs the website
and its database for you. Follow the official installation instructions for your
operating system:

| Operating system | Install Git | Install Docker |
| --- | --- | --- |
| macOS | [Git for macOS](https://git-scm.com/install/mac) | [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/) |
| Windows | [Git for Windows](https://git-scm.com/install/windows) | [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/) |
| Linux | [Git for Linux](https://git-scm.com/install/linux) | [Docker Desktop for Linux](https://docs.docker.com/desktop/setup/install/linux/) |

Docker Desktop includes Docker Compose. After installing it, open Docker Desktop
and wait until it is running. On Windows, follow the Docker guide's WSL 2 setup
instructions and use Linux containers for this project.

If you prefer Docker Engine on Linux, follow the official
[Docker Engine installation guide](https://docs.docker.com/engine/install/) for
your distribution and install the
[Docker Compose plugin](https://docs.docker.com/compose/install/linux/).

Open **Terminal** on macOS or Linux, or **PowerShell** on Windows. If your terminal
was open during installation, close it and open it again. Run these commands,
one line at a time, to check that the tools are available:

```sh
git --version
docker --version
docker compose version
```

Each command should print a version number. This project needs Docker Compose v2
or later, using the `docker compose` command.

### 2. Download the project with Git

In your terminal, go to the folder where you want to keep the project, then run:

```sh
git clone https://github.com/dfdy/The-Association-Commons.git
cd The-Association-Commons
```

The first command downloads the project into a new `The-Association-Commons`
folder. The second moves your terminal into that folder. Run the remaining
Docker commands from this folder, which contains `docker-compose.yml`.

### 3. Start the website

```sh
docker compose up -d
```

The first run downloads the images and dependencies, builds the software image,
and sets up the database. This can take several minutes. The `-d` option keeps
the website running in the background after you close the terminal.

Check whether the website is ready:

```sh
docker compose ps
```

Once `web` shows `healthy`, open **[http://localhost:8380](http://localhost:8380)**
in your browser. No `.env` file, manual database setup, configuration edits, Node
installation or separate build command is needed.

If the website does not open, check that Docker is running and inspect startup:

```sh
docker compose logs -f web seed
```

Press **Ctrl+C** to stop following the logs; the website will keep running.
If Docker reports that it cannot connect to the daemon, start Docker Desktop
(or the Docker Engine service on Linux) and retry the startup command.

### What Docker runs

- `db`: PostgreSQL 17, stored in a persistent Docker volume.
- `seed`: creates the database schema and imports initial content, then exits.
- `web`: serves the website on port 8380 after setup succeeds.

The website is accessible only from your computer by default. For public hosting,
use an HTTPS reverse proxy, production database credentials, and access controls.

## Software and content

| Location | Purpose | Licence |
| --- | --- | --- |
| `software/` | Application code and database migrations | GNU AGPLv3, with third-party exceptions |
| `content/seed.json` | Initial website content | CC BY-NC-SA 4.0, with registry exceptions |
| PostgreSQL `content` schema | Installed website content | Same content terms |
| PostgreSQL `private` schema | Visitor submissions and suggestions | Private; excluded from public downloads |
| `scripts/`, `docs/` | Development tools and documentation | GNU AGPLv3 |
| `worker/` | Generated Sites snapshot | Separate software and content terms apply |

After the first start, PostgreSQL holds the website's content. Restarts preserve
edits; changing `content/seed.json` does not update an existing database. Use
numbered migrations for schema changes. There is no administration interface yet.
See the [architecture guide](docs/ARCHITECTURE.md) for details.

Forms save to PostgreSQL. Draft stadgar text stays in memory for export. Historic
submissions from the hosted site are not included.

## Edit the privacy policy

Edit `privacy-policy.yaml`: `section_html` controls the policy page section, and
`document` controls its PDF, Markdown and RTF downloads. Keep both consistent and
use trusted HTML. Apply changes with:

```sh
docker compose restart web
```

The file is validated and imported on every web startup. Invalid or missing YAML
blocks startup without replacing the saved policy. Direct database edits to this
policy are overwritten on restart. No rebuild is needed.

Keep this file with your database backups. Outside Docker, set
`PRIVACY_POLICY_PATH` to enable the same behaviour. The Sites snapshot uses the seed.

The policy is a draft. Before public launch, complete operator/contact details and
review hosting, retention, and provider references.

## Stop, restart, update

Run these commands from the `The-Association-Commons` folder. To stop the website:

```sh
docker compose down
```

To start it again:

```sh
docker compose up -d
```

These commands preserve your database. To restart only the application, run
`docker compose restart web`. After changing application code, run
`docker compose up --build -d`.

**Data loss:** `docker compose down -v` deletes the database and submissions.
The next start creates a fresh database from the seed.

## Database backup and restore

Back up the installed database, including later content edits and private records:

```sh
docker compose exec -T db pg_dump -U commons -d association_commons --clean --if-exists > association-commons.sql
```

Store the backup privately, alongside `privacy-policy.yaml` and the matching
source release. A source ZIP does not contain live submissions.

To restore, run the following in macOS/Linux Terminal or Windows Git Bash
(PowerShell does not support `<` input redirection). **This replaces installed data.**

```sh
docker compose stop web
docker compose up -d --wait db
docker compose exec -T db psql -v ON_ERROR_STOP=1 -U commons -d association_commons < association-commons.sql
docker compose up -d
```

## Development and checks

With Node.js and npm installed, run:

```sh
npm ci
npm --prefix software ci
npm test
```

Tests cover content parity, database behaviour, and the Compose configuration.
GitHub Actions also builds and smoke-tests the Docker stack with PostgreSQL.
Validate Docker on your target host before deployment.

`/healthz` checks the database connection. For public hosting, preserve the real
request host and configure proxy-level abuse limits. Set `TRUST_PROXY=true` only
behind a trusted proxy that supplies `X-Forwarded-Proto: https`.

## Existing hosted site

The Sites deployment is a separate snapshot, generated with `npm run build`.
It uses Sites storage rather than this Docker/PostgreSQL stack. Moving the live
site to Docker requires a separate hosting migration.

## Licensing

See [LICENSING.md](LICENSING.md) for software/content terms and
[LICENSE](LICENSE) for the AGPLv3 licence. The website provides its software source
at `/source.tar.gz`.
