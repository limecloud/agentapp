---
title: Adding support
description: Implementation path for adding Agent App support to a host client.
---

# Adding support

A host can add Agent App support incrementally. It does not need to start by executing arbitrary app code. The safest path is to begin with package discovery, projection, readiness, and cleanup, then add controlled SDK capabilities.

## Minimum host responsibilities

| Responsibility | Meaning |
| --- | --- |
| Discover | Find `APP.md` or registry metadata. |
| Validate | Parse manifest, verify hashes, reject unsupported versions. |
| Project | Compile manifest into host catalog objects without executing the app. |
| Check readiness | Report missing capabilities, permissions, Knowledge, Tools, Skills, Evals, and secrets. |
| Authorize | Ask user, tenant, or workspace owner before activation. |
| Inject capabilities | Provide SDK handles instead of exposing internals. |
| Isolate data | Keep storage, artifacts, events, logs, and secrets namespaced by app. |
| Clean up | Support disable, uninstall keep data, uninstall delete data, and export then delete. |

## Recommended phases

```text
P0 read-only host
  -> P1 mock capability host
  -> P2 thin adapters
  -> P3 controlled UI host
  -> P4 controlled workflow runtime
  -> P5 registry / cloud bootstrap
```

This order keeps the host from becoming a plugin platform before it has policy and cleanup.

## P0: read-only support

Implement:

- manifest parser and normalizer
- package identity and hash
- projection output
- readiness output
- cleanup dry-run
- lab or admin page for inspection

Do not execute app UI, workers, workflows, tools, or agent tasks in P0.

## P1: mock capability host

A mock host validates the SDK shape before touching production services. It should create mock storage records, artifacts, evidence, and run records with app provenance.

The goal is contract design, not real business value.

## P2: thin adapters

Add real adapters only after the SDK facade is stable.

Good adapters:

- `lime.storage` namespace backed by host storage
- `lime.artifacts.create` with provenance
- `lime.evidence.record` with source references
- `lime.knowledge.search` as read-only retrieval
- `lime.agent.startTask` with trace and cancel

Bad adapters:

- direct imports of host UI components
- bypassing policy checks
- writing app data into global host tables without namespace
- allowing raw network or filesystem access

## P3 and beyond

UI host and workflow runtime should be controlled and feature-flagged. App UI should receive an injected SDK bridge. Workflow runtime should execute an allowlisted DSL before raw worker bundles are considered.

## Compatibility contract

A host should publish the capability versions it supports:

```json
{
  "appRuntimeVersion": "0.3.0",
  "capabilities": {
    "lime.ui": { "version": "0.3.0", "enabled": true },
    "lime.storage": { "version": "0.3.0", "enabled": true },
    "lime.agent": { "version": "0.3.0", "enabled": true }
  }
}
```

Readiness compares this profile with the app requirements.

## Acceptance criteria

A host has meaningful Agent App support when:

- it can install a package without executing it
- projection is deterministic and inspectable
- readiness is actionable
- runtime calls go through SDK handles
- app data is namespaced and removable
- private customer data stays outside official packages
- policy enforcement happens in the runtime bridge
- failed experiments can be removed without affecting normal host flows
