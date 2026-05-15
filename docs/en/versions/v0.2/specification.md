---
title: v0.2 specification snapshot
description: Frozen summary of the Agent App v0.2 runtime package contract.
---

# v0.2 specification snapshot

This page is a historical snapshot. New packages should use the latest [Specification](../../specification.md).

## Contract

v0.2 defined Agent App as a complete installable app package with `APP.md` as discovery entry and runtime package assets for UI, workers, storage, workflows, artifacts, policies, and examples.

## Runtime package shape

```text
app-name/
├── APP.md
├── dist/ui
├── dist/worker
├── storage/schema.json
├── storage/migrations
├── workflows
├── agents
├── skills
├── knowledge-templates
├── artifacts
├── evals
├── policies
└── examples
```

## Capability SDK

v0.2 introduced a host capability facade. Apps call capabilities such as `lime.ui`, `lime.storage`, `lime.agent`, and `lime.artifacts` instead of importing host internals.

## App boundaries

- App code belongs in runtime package.
- Customer data belongs in Knowledge, workspace files, app storage, secrets, or overlays.
- Cloud distributes and authorizes; it does not become default Agent Runtime.
- Host performs install, readiness, policy, and local execution.

## Superseded by v0.3

v0.3 keeps the runtime package direction but tightens descriptor schemas, entry kinds, overlay templates, typed SDK call semantics, readiness shape, and provenance.

## Migration posture

v0.2 packages are closer to current apps than v0.1 packages, but they still need v0.3 tightening before distribution. The main work is not rewriting business logic; it is making capabilities, entries, permissions, overlays, and provenance explicit enough for host automation.

## Acceptance criteria after migration

- All entries use current v0.3 kinds.
- Runtime assets are referenced and hashable.
- Required and optional capabilities are separated.
- Readiness can explain missing setup in machine-readable findings.
- Customer overlays and secrets are outside the official package.

## Review questions

- Does the package body merely describe a workflow, or does the runtime package actually contain runnable assets?
- Are all capability calls mediated through the SDK boundary?
- Can the host install the app without granting broad implicit filesystem, network, or secret access?
- Can the registry distinguish official package content from tenant overlays and customer data?
- Can a v0.3 migration preserve user data and reject unsupported entry kinds?
