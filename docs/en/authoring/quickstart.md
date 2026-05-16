---
title: Quickstart
description: Build, validate, project, and readiness-check a minimal Agent App package.
---

# Quickstart

This guide creates the smallest useful Agent App package and then shows how to grow it into a production app. The goal is not to make a prompt file; the goal is to define an installable package that a host can discover, validate, project into UI entries, and check for readiness.

## What you will create

```text
my-app/
└── APP.md
```

`APP.md` is the mandatory discovery surface. It carries manifest frontmatter and a human-readable guide. Real UI, workers, storage schemas, workflows, agents, artifacts, and evals can be added later as runtime package assets.

## 1. Create the package folder

```bash
mkdir my-app
cd my-app
```

Create `APP.md`:

```markdown
---
manifestVersion: 0.3.0
name: my-app
description: A minimal local-running Agent App.
version: 0.3.0
status: draft
appType: agent-app
runtimeTargets:
  - local
requires:
  sdk: "@lime/app-sdk@^0.3.0"
entries:
  - key: start
    kind: command
    title: Start
    command: /start
---

# My App

Use this app when the user wants to start a guided workflow from the host command palette.

## Setup

No private customer data ships with this package. Bind Knowledge, Tools, secrets, or overlays after installation.

## Runtime behavior

The `start` command should call host capabilities through `@lime/app-sdk`; it must not import host internals directly.
```

## 2. Validate the package

From this repository, run:

```bash
npm run cli -- validate ./my-app
```

From another project after publication, run:

```bash
npx agentapp-ref@0.4.0 validate ./my-app
```

Validation checks the manifest shape, required fields, supported entry kinds, local references, and obvious authoring problems. A `draft` app can pass validation while still needing setup before activation.

## 3. Project it into host catalog data

```bash
npx agentapp-ref@0.4.0 project ./my-app
```

Projection is the deterministic step a host uses to transform package metadata into catalog objects. It should not invent business behavior that is absent from the package. The output should include app summary, entries, requirements, permissions, storage, services, workflows, and provenance when those fields exist.

## 4. Check readiness

```bash
npx agentapp-ref@0.4.0 readiness ./my-app
```

Readiness answers a different question from validation: can this app run in the current host/workspace? A package can be structurally valid but still report `needs-setup` when required Runtime, UI, Context, Knowledge, Skills, Tools / Connectors, Artifacts, Evidence, Policy, QC, capabilities, services, or secrets are not bound.

## Minimal vs production app

| Area | Minimal draft | Production-ready direction |
| --- | --- | --- |
| Entries | One command or page. | Multiple traceable pages, workflows, artifact viewers, settings, or expert chats. |
| Runtime | May only document intended behavior. | UI bundle, worker, workflow files, storage schema, migrations, and tests. |
| Capabilities | SDK version only. | Explicit `requires.capabilities`, optional degradation, and compatibility matrix. |
| Data | No bundled private data. | Knowledge templates, storage namespace, overlays, secrets, and uninstall policy. |
| Quality | Manual review. | Evals, Evidence, readiness checks, and release checklist. |
| Security | No external access. | Permissions for files, network, tools, secrets, background jobs, and artifacts. |

## Add runtime assets

As the app becomes real, add folders such as:

```text
my-app/
├── APP.md
├── dist/
│   ├── ui/
│   └── worker/
├── storage/
│   ├── schema.json
│   └── migrations/
├── workflows/
├── agents/
├── artifacts/
├── evals/
└── examples/
```

Then update `APP.md` so every entry points to its implementation: `route` for pages, `workflow` for workflows, `persona` for expert-chat entries, and artifact descriptors for artifact viewers.

## Author checklist

- `APP.md` explains when to use the app and what setup is required.
- Every current v0.3 entry uses `page`, `panel`, `expert-chat`, `command`, `workflow`, `artifact`, `background-task`, or `settings`.
- Required capabilities are declared under `requires.capabilities` before runtime code calls them.
- Customer-specific data is represented by Knowledge templates, overlays, secrets, or workspace files, not bundled in the package.
- Executable entries have permissions, policy, eval, and Evidence expectations.
- Validation, projection, and readiness are all run before publishing.
