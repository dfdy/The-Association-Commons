# Run the site on a cloud virtual machine

[Back to the project](../README.md) · [All guides](README.md) · [Operating guide](operations.md)

A cloud virtual machine (VM) is a computer you rent from a hosting company. You
choose its resources and usually look after its operating system and software.
This guide helps you choose a starting size for one DDC site, including its editor
and PDF exports. It is not a complete public deployment guide.

## Minimum and recommended resources

These are planning estimates for a small, low-traffic site, not certified minimums
or a guarantee of capacity. The minimum assumes you run an image built elsewhere;
building the supplied Docker image on the VM needs more headroom.

| Resource | Estimated minimum: run a prebuilt image | Recommended starting VM |
| --- | --- | --- |
| Processor | 1 modern 64-bit virtual CPU (vCPU) | 2 vCPUs |
| Memory | 1 GB RAM for the VM | 2 GB RAM; consider 4 GB for more traffic or other services |
| SSD storage | 10 GB total, with at least 5 GB free after installing the operating system | 20 GB total or more, with at least 10 GB free for the application, builds, and growth |
| Operating system | A supported 64-bit Linux distribution compatible with Docker Engine | A maintained Debian or Ubuntu server release |
| Software and access | Docker Engine, Docker Compose 2.20.3 or newer, and SSH access with permission to manage Docker | The same, with someone responsible for updates, monitoring, and backups |

A vCPU is a share of the host's processor. Providers allocate it differently, so
core count alone does not guarantee the same performance across plans.

For building directly from this repository, use **at least 2 GB RAM, 2 vCPUs, and
20 GB SSD storage** as a planning floor. Builds temporarily need more resources
than serving pages. Keep extra free space for downloaded layers and build caches;
repeated builds can fill a small disk. Store backups separately rather than treating
unused space on the same VM as your only backup.

For a modest installation, start with **2 vCPUs, 2 GB RAM, and 20 GB SSD**, then
measure actual use. Leave room for the operating system, HTTPS proxy, logs, uploaded
media, private records, and future updates. Docker Desktop and a desktop browser
are not required on the Linux VM.

### What the estimates are based on

On the development installation, measurements on 19 October 2026 showed roughly
47 MiB of idle container memory, a sampled peak of 329 MiB while producing the
white-paper PDF, and an application image of about 539 MB. The peak sample included
a small monitoring process. It was one export on the current content, not a load
test or a measurement of the whole VM.

The PDF renderer allows one export at a time and asks other requests to retry while
busy. A smaller VM can therefore serve pages but still feel slow during PDF work.
Watch memory, CPU, free disk space, response times, and failed exports before
deciding whether to resize. Larger documents or additional visitors can change the
requirements.

## South African hosting companies to compare

The following are starting points for your own comparison, not an endorsement or
a claim that the DDC deployment has been tested with them. Links were checked on
19 October 2026; packages, terms, and prices can change.

| Company | Relevant service |
| --- | --- |
| [xneelo](https://xneelo.co.za/cloud/) | Cloud virtual machines with configurable compute, storage, and networking; its Cloud page describes South African hosting and support. |
| [Afrihost](https://www.afrihost.com/cloud-hosting) | Cloud hosting, with self-managed and managed options to compare. |
| [Domains.co.za](https://www.domains.co.za/vps-hosting) | Virtual private server (VPS) hosting. A VPS is another form of virtual server. |

Ask for a **Linux VM or VPS that permits Docker and Chromium**, not simply a shared
website-hosting package. A managed plan may restrict custom software or cover only
part of the administration; confirm what the provider will actually maintain.

Compare the full cost, including storage, public IP addresses, data transfer,
snapshots, backups, VAT, and support. Confirm where the selected VM, backups, and
support access are located rather than assuming every service offered by a South
African company keeps all data in South Africa. Agree who will maintain the server
and who can access private submissions.

## Before making the site public

The supplied Compose file binds the website to **127.0.0.1:8388 on the VM**. Buying
a VM and running the startup command does not make the website publicly reachable.
Likewise, `localhost` in your own browser refers to your own computer, not the VM.

For a private preview, an operator can forward the VM's local port through SSH.
For public hosting, arrange a domain, DNS, an HTTPS reverse proxy, and suitable
firewall rules. A reverse proxy receives public requests and forwards them to the
local website. Keep the application port private; do not simply expose it to bypass
HTTPS setup.

Complete the [public-hosting preparation](operations.md#before-public-hosting),
including secure cookies, administrative access, operator/privacy details, retention
scheduling, and separate backups. Back up both `user/pages/` and the private Docker
volume, and test restoration. The [storage guide](operations.md#storage-and-backups)
explains why a copy of the repository alone is not enough.
