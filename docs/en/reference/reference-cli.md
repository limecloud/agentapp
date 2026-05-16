---
title: Reference CLI
description: Commands provided by agentapp-ref for validating, projecting, and inspecting Agent App packages.
---

# Reference CLI

`agentapp-ref` is the reference command-line tool for the Agent App package contract. It is intentionally small: it validates package shape, reads manifest properties, emits catalog metadata, projects host-facing objects, and checks static readiness.

It does not run agents or execute app workers.

## Install or run

From this repository:

```bash
npm run cli -- validate docs/examples/content-factory-app
```

From npm after publishing:

```bash
npx agentapp-ref@0.6.0 validate ./my-agent-app --version 0.6
```

## Commands

| Command | Purpose |
| --- | --- |
| `validate <app>` | Validate `APP.md` shape and local references. |
| `read-properties <app>` | Print parsed frontmatter as JSON. |
| `to-catalog <app>` | Emit compact catalog metadata. |
| `project <app>` | Emit host catalog projection with provenance. |
| `readiness <app>` | Check static setup readiness without running an agent. |
| `migrate-check <app> [--target 0.6.0]` | Report migration gaps for the current target version. |
| `migrate-generate <app> [--target 0.6.0]` | Suggest layered config files, including v0.6 `app.runtime.yaml`. |

## Validate

```bash
npm run cli -- validate docs/examples/content-factory-app
```

Use this in CI before publishing. It catches missing required fields, unsupported statuses, unknown app types, invalid v0.3 entry kinds, missing local references, and missing executable permissions.

## Project

```bash
npm run cli -- project docs/examples/content-factory-app
```

Projection output includes app summary, entries, capability requirements, storage, services, workflows, permissions, requirements, and provenance. Hosts can use this as a model for their own projection layer.

## Readiness

```bash
npm run cli -- readiness docs/examples/content-factory-app
```

Readiness reports required and optional setup. A structurally valid package can return `needs-setup` when required Skills, Knowledge, Tools, services, or evals are not satisfied by the host.

## Exit behavior

The CLI writes JSON to stdout. Validation failures set a non-zero exit code. Warnings can still produce `ok: true` if they do not block structural validity.

## What the CLI is not

The CLI is not:

- a full host runtime
- a security sandbox
- a registry
- an app installer
- a JSON Schema validator for every future extension
- an agent executor

It is the shared reference for package shape and static host-facing semantics.

## Recommended automation

Use the CLI in three places:

1. Package author CI: reject invalid manifests and missing local references.
2. Registry ingestion: compare projection output, package hash, and release metadata.
3. Host tests: keep projection and readiness behavior stable across host changes.

A simple package check can run:

```bash
npm run cli -- validate docs/examples/content-factory-app
npm run cli -- project docs/examples/content-factory-app > /tmp/content-factory.projection.json
npm run cli -- readiness docs/examples/content-factory-app > /tmp/content-factory.readiness.json
```

## Output contract expectations

- JSON output should be deterministic for the same inputs.
- Errors should be actionable and tied to manifest keys or local paths.
- Warnings should identify production-readiness gaps without blocking draft exploration.
- Readiness should separate missing host capabilities, missing user setup, and missing package files.
