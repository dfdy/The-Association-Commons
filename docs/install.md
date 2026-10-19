# Run the website on your computer

[Back to the project](../README.md) · [All guides](README.md) · [Editing and maintenance](operations.md)

This guide starts a local copy of the website and its editor. "Local" means it
runs on your computer and is reachable there. You do not need a public server,
a domain name, or a paid hosting account to try it.

If you want to rent a server instead, read [cloud VM requirements and South African
hosting options](cloud-hosting.md). A cloud server needs additional preparation
before people can safely use it over the public internet.

No programming experience is assumed. Work through one step at a time. If you are
setting this up with others, take turns at the keyboard and make sure more than one
person understands how to start, edit, and back up the site.

## 1. Install the tools

Git downloads the project and helps keep a history of changes. Docker runs the
website and the software it needs in an isolated environment called a container.
Docker Compose starts those parts together using this project's configuration.

| Your operating system | Git | Docker |
| --- | --- | --- |
| macOS | [Install Git](https://git-scm.com/install/mac) | [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/), or the Colima option below |
| Windows | [Install Git](https://git-scm.com/install/windows) | [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) |
| Linux | [Install Git](https://git-scm.com/install/linux) | [Docker Engine](https://docs.docker.com/engine/install/) and its [Compose plugin](https://docs.docker.com/compose/install/linux/) |

Follow the provider's instructions for your operating system. With Docker Desktop,
open the application and wait until its engine is running. On Windows, use Linux
containers and follow Docker's instructions for its WSL 2 setup.

Open Terminal on macOS or Linux, Git Bash on Windows, or PowerShell 7 or newer.
This is where you type the commands shown in the guide. Copy the commands inside
each code block, without the surrounding backticks. Press Enter after each line.
If you installed a tool while the terminal was open, close and reopen the terminal.

Check that each command prints a version:

```sh
git --version
docker --version
docker compose version
```

The current project requires Docker Compose **2.20.3 or newer**. You do not need to
install PHP, Node.js, or Grav on your computer to run the Docker setup.
The first build downloads dependencies, so it needs an internet connection and may
take several minutes or longer on a slow connection.

### macOS alternative: Colima

Skip this section if Docker Desktop is working. Colima is another way to run
Docker containers on macOS. With [Homebrew](https://brew.sh/) installed, run:

```sh
brew install colima docker docker-compose docker-buildx
mkdir -p ~/.docker/cli-plugins
ln -sfn "$(brew --prefix)/opt/docker-compose/bin/docker-compose" ~/.docker/cli-plugins/docker-compose
ln -sfn "$(brew --prefix)/opt/docker-buildx/bin/docker-buildx" ~/.docker/cli-plugins/docker-buildx
colima start
```

The two link commands make Homebrew's Compose and Buildx tools available to Docker.
If you already manage Docker CLI plugins yourself, check those existing links before
replacing them. After restarting your computer, run `colima start` before starting
the website. See the [Colima installation guide](https://colima.run/docs/installation/)
for its platform requirements.

## 2. Download the project

In the terminal, go to a folder where you want to keep the project. Run:

```sh
git clone https://github.com/dfdy/The-Democratic-Development-Commons.git
cd The-Democratic-Development-Commons
```

The first command creates the project folder; the second enters it.
If you already have a checkout, enter that existing folder instead of cloning again.

All remaining commands in this guide run from the project folder: the directory
containing `README.md`, `Dockerfile`, and `compose.yaml`. When you open a new
terminal, return to that folder before running them.

## 3. Start the site

```sh
docker compose up -d --build
```

Docker builds the website image and starts a container in the background. When the
command returns, check its state:

```sh
docker compose ps
```

Look for the `grav` service. It should be running; its health may briefly say
"starting" before becoming "healthy". If startup fails, use the troubleshooting
section below.

Open these addresses in a browser on the same computer:

- [Open the website and choose a language](http://localhost:8388).
- [Open the administration editor](http://localhost:8388/admin).

These are local addresses, not links to a public DDC service. Other people will not
automatically be able to open your copy from their own computers.

## 4. Sign in and make the account yours

Retrieve the generated initial login:

```sh
docker compose exec --user www-data grav cat user/data/commons-private/admin-login.txt
```

This displays the administrator username and initial password in your terminal.
Keep them private. Open the editor address above, sign in, and use your account
profile to change the password and replace the placeholder email.

The file records the initial password; it is not updated when you change your
password. On an existing installation, use your current account details.
Public account registration is disabled.

Then follow [Edit a page](operations.md#edit-a-page). You can stop after one small
edit, check the result, and learn the rest as you need it.

## Stop and return later

To stop the site while keeping its content and private data:

```sh
docker compose stop
```

To start it again, first start Docker Desktop or Colima, return to the project
folder, and run:

```sh
docker compose up -d
```

Use `docker compose up -d --build` when you have changed theme, plugin, or startup
code. Ordinary page edits do not require a rebuild.

## If something does not work

| What you see | What to check |
| --- | --- |
| "Command not found" for Git or Docker | Complete installation, reopen the terminal, and try the version commands again. |
| Docker cannot connect to its engine | Open Docker Desktop and wait for it to start, or run `colima start` if using Colima. |
| "No configuration file" | Return to the project folder containing `compose.yaml`. |
| The browser cannot load the site | Run `docker compose ps`, check that `grav` is running, and confirm you used `http://localhost:8388/en`. |
| Port 8388 is already in use | Another service or copy may already be running. Identify it before stopping anything; a second clone will not resolve the conflict. |
| Login fails after a previous installation | Use the password you set previously; the saved initial-login file does not track password changes. |
| The editor cannot save content | Check that Docker Desktop or Colima shares the project folder with write access. Do not delete the volume to solve a folder-permission problem. |

For more detail about a failed startup:

```sh
docker compose logs --tail=100 grav
```

Read the last messages for a missing file, permission problem, or failed download.
Before sharing logs, remove passwords, tokens, email addresses, and personal records.
A useful help request includes your operating system, the command you ran, what you
expected, and the relevant error. You can [open a project issue](https://github.com/dfdy/The-Democratic-Development-Commons/issues)
without sharing private details.

## Keep your work

Public page files and uploaded media live in `user/pages/` in the project folder.
Private accounts, keys, and submissions live in the separate `grav_user` Docker
volume. Copying the project folder alone does not back up that volume.

Do not run `docker compose down -v` to stop or troubleshoot the site: it deletes
the volume and its private data. See [storage and backups](operations.md#storage-and-backups)
before removing containers, moving computers, or reinstalling Docker.
