# Voluntary Associations: The Association Commons

![The freedom to organise — a framework for voluntary associations built on shared purpose, democratic self-governance and accountability.](docs/images/association-commons-framework-hero.png)

## The freedom to organise.

A framework for voluntary associations, inspired by international organising best practice: shared purpose, democratic self-governance, and accountability to one another.

The project supports rebuilding adult education in South Africa as an emancipatory practice of critical inquiry, mutual aid and collective action. The framework is a voluntary agreement, not legislation or a grant of legal status.

## Seven organising principles

1. **Freedom of association** — People freely form, join, support or leave associations.
2. **Collective self-governance** — Members determine their shared purposes and arrangements.
3. **Democratic member control** — Members participate in decisions, elections and oversight.
4. **Shared purpose** — Resources advance the association’s purpose rather than private gain.
5. **Constitutional governance** — Written rules define rights, responsibilities and fair procedures.
6. **Separate legal personality** — Where applicable law permits, an association can hold rights and obligations separately from its members.
7. **Accountability** — Delegated decision-makers answer to members.

The multilingual website runs on Grav, with Git-backed Markdown content.
Displayed version: **0.1.2**. Do not increment it without the project owner's instruction.

## Run the website

### 1. Install Git and Docker

Git downloads a copy of this project to your computer. Docker runs the website
and its editor for you. Follow the official installation instructions for your
operating system:

| Operating system | Install Git | Install Docker |
| --- | --- | --- |
| macOS | [Git for macOS](https://git-scm.com/install/mac) | [Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/) or [Colima](https://colima.run/docs/installation/) |
| Windows | [Git for Windows](https://git-scm.com/install/windows) | [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/) |
| Linux | [Git for Linux](https://git-scm.com/install/linux) | [Docker Desktop for Linux](https://docs.docker.com/desktop/setup/install/linux/) |

Docker Desktop includes Docker Compose. After installing it, open Docker Desktop
and wait until it is running. On Windows, follow the Docker guide's WSL 2 setup
instructions and use Linux containers for this project.

**Colima option on macOS:** install [Homebrew](https://brew.sh/) first, then run:

```sh
brew install colima docker docker-compose docker-buildx
mkdir -p ~/.docker/cli-plugins
ln -sfn "$(brew --prefix)/opt/docker-compose/bin/docker-compose" ~/.docker/cli-plugins/docker-compose
ln -sfn "$(brew --prefix)/opt/docker-buildx/bin/docker-buildx" ~/.docker/cli-plugins/docker-buildx
colima start
```

Continue with the same `docker compose` commands below. After restarting your
computer, run `colima start` again; use `colima stop` when finished. See the
official [Colima installation guide](https://colima.run/docs/installation/).

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

Each command should print a version number. This project needs Docker Compose
2.20.3 or newer, using the `docker compose` command.

### 2. Clone and start

```sh
git clone https://github.com/dfdy/The-Association-Commons.git
cd The-Association-Commons
docker compose up -d --build
```

- Website: http://localhost:8388/en
- Editor: http://localhost:8388/admin

Retrieve the initial login:

```sh
docker compose exec --user www-data grav cat user/data/commons-private/admin-login.txt
```

Change the administrator password and email after signing in. Content edits are
saved directly to `grav-site/user/pages/` and can be committed and merged through Git.
Accounts and private keys stay in a Docker volume.

See [Grav editing, setup and MCP instructions](grav-site/README.md).

To stop or restart the site:

```sh
docker compose stop
docker compose up -d
```

Use `docker compose up -d --build` after changing themes or plugins. Markdown
content changes appear without rebuilding. On Colima, the repository share must
be writable for the editor to save content; see the Grav setup guide.

## Local original site

An existing local copy is kept in `legacy-site/`, which is excluded from Git.
It continues to run at http://localhost:8380 with its existing database. This
folder is not included in new clones. To manage that local copy:

```sh
docker compose -f legacy-site/docker-compose.yml up -d --build
```

## Licences and development

Content: CC BY-NC-SA 4.0. Custom software: AGPLv3. See [licensing](LICENSING.md)
and [development instructions](AGENTS.md). Accessibility target: WCAG 2.2 AA.
