---
title: v0.8 Overview
description: v0.8 makes Agent Apps first-class standalone products by separating Lime Desktop from Lime Runtime.
---

# v0.8 Overview

v0.8 is about **Standalone Installation & Runtime Separation**. Agent Apps are first-class installable products: a user should be able to download a business app directly, launch it with its own brand and window, and still receive Lime-governed agent runtime, permissions, secrets, evidence, tools, and storage.

The key split is:

```text
Agent App = product package
Lime Runtime = governed capability substrate
Lime Desktop = one multi-app host, not the mandatory entry point
Lime App Shell = a minimal single-app host for standalone distribution
```

v0.8 keeps all v0.7 requirement-boundary files. It adds install-mode metadata so app authors and hosts can decide whether a package runs inside Lime Desktop, as a standalone app with an embedded runtime, against a system-installed Lime Runtime, or in a compatible web host.

## Core changes

- **`app.install.yaml`**: declares `in_lime`, `standalone`, `runtime_backed`, and optional `web_host` installation modes.
- **Lime Runtime Core**: the shared capability substrate for `lime.agent`, `lime.storage`, `lime.secrets`, `lime.policy`, `lime.evidence`, `lime.tools`, `lime.connectors`, and adjacent surfaces.
- **Lime App Shell**: a minimal host shell that loads one Agent App package, injects capability handles, shows permissions, and runs the app with its own brand.
- **Standalone packaging**: apps can ship as `.app`, `.dmg`, `.exe`, or equivalent bundles without making Lime Desktop a prerequisite.
- **Runtime-backed packaging**: apps can stay lightweight when a compatible system Lime Runtime is already installed.

## Architecture

```mermaid
flowchart TD
  App[Agent App Package\nUI / Worker / Workflow / Storage schema] --> SDK[@lime/app-sdk]
  SDK --> Runtime[Lime Runtime Core\nAgent / Storage / Secrets / Policy / Evidence / Tools]
  Runtime --> Desktop[Lime Desktop\nMulti-app workspace]
  Runtime --> Shell[Lime App Shell\nStandalone single-app host]
  Runtime --> Web[Compatible Web Host]
  Shell --> User[User launches branded app]
  Desktop --> User
  Web --> User
```

## Install modes

| Mode | User experience | Runtime model | Best fit |
| --- | --- | --- | --- |
| `in_lime` | Install from Lime Desktop app center. | Uses the Desktop-hosted Lime Runtime. | Power users, teams, developers, app management. |
| `standalone` | Download and launch the business app directly. | Package embeds or bundles a compatible Lime Runtime profile. | Consumer or departmental apps that should not require Lime Desktop. |
| `runtime_backed` | Install a lightweight app; reuse system Lime Runtime. | Requires `lime-runtime` on the machine. | Many apps on one machine, enterprise managed desktops. |
| `web_host` | Open in compatible hosted environment. | Host provides web capability handles and policy. | Trial, collaboration, and low-sensitivity flows. |

## Compatibility

- v0.7 apps remain valid in v0.8 hosts.
- v0.8 does not move agent execution into app packages; apps still call host-injected capabilities.
- A standalone Agent App may embed runtime components, but it must not bypass Lime Runtime policy, secrets, evidence, or tool governance.
- Lime Desktop becomes a strong host and app manager, not the only way to use an Agent App.
