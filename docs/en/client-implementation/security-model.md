---
title: Security model
description: Security boundaries for installing and running Agent Apps in host clients.
---

# Security model

Agent App security is based on a host-platform model: the app package declares what it needs, and the host controls what it can actually do.

The app should never receive unrestricted access to host internals, filesystem, network, credentials, or databases.

## Trust boundaries

| Boundary | Host responsibility |
| --- | --- |
| Package boundary | Verify hash, signature, manifest shape, and source. |
| Capability boundary | Provide SDK handles; do not expose internal APIs. |
| Data boundary | Namespace storage, artifacts, events, logs, and evidence. |
| Permission boundary | Enforce policy at runtime, not only in UI. |
| Secret boundary | Store credentials in host secret manager. |
| UI boundary | Sandbox app UI and block raw host APIs. |
| Worker boundary | Run only approved workflow steps or sandboxed worker code. |
| Network boundary | Allow only declared and authorized network or tool calls. |

## Threats

Host implementors should design against:

- package tampering
- hidden capability usage
- private data bundled into official packages
- app UI calling raw host APIs
- worker code reading arbitrary files
- tool calls without tenant authorization
- secrets written to logs or artifacts
- overlays bypassing policy
- uninstall leaving orphaned data
- cloud registry acting as hidden Agent Runtime

## Defense layers

```text
Manifest validation
  -> Package verification
  -> Readiness
  -> Policy review
  -> SDK capability injection
  -> Runtime enforcement
  -> Provenance and evidence
  -> Cleanup plan
```

No single layer is enough. For example, UI should hide a blocked button, but the SDK bridge must still reject the call.

## UI sandbox

A controlled UI host should block by default:

- raw Tauri APIs
- Node APIs
- arbitrary file access
- undeclared network access
- popups and downloads
- access to host DOM outside the mount point
- direct import of host source modules

The app UI should receive a narrow injected SDK bridge.

## Worker and workflow runtime

Before executing raw worker bundles, prefer an allowlisted workflow runtime:

| Step kind | Capability |
| --- | --- |
| `storage.set` | `lime.storage` |
| `knowledge.search` | `lime.knowledge` |
| `agent.startTask` | `lime.agent` |
| `artifacts.create` | `lime.artifacts` |
| `evidence.record` | `lime.evidence` |

Raw worker execution requires additional sandboxing, resource limits, and review.

## Provenance and audit

Security review needs traceability. Attach provenance to:

- projected entries
- workflow runs
- model tasks
- tool calls
- storage migrations
- artifacts
- evidence
- exports
- cleanup records

Provenance should include app version, package hash, manifest hash, entry key, and run ID.

## Secret handling

Apps declare secret slots. Hosts bind and protect concrete credentials.

Rules:

- no plaintext credentials in package files
- no plaintext credentials in app storage
- no secret values in evidence or logs
- app receives secret handles or scoped operations
- secret access is policy checked and auditable

## Session and token boundary

`lime.cloudSession` is a host-provided generic session capability only.

- `host:snapshot` exposes tenant context, control-plane base URL, and session presence, but not the bearer token.
- A bearer token may only be fetched through an explicit capability invoke, and only for the current control-plane call.
- `lime.cloudSession.requestLogin` may accept `{ "force": true }` to refresh an existing but rejected session before one retry.
- The host may open the login flow, but it must not act as the business publish executor for the app.
- The token must not be written into app config, storage, artifacts, evidence, or logs, and must not become a long-lived business fact.

## Cleanup security

Uninstall is part of security. Users must be able to remove package code and app data.

Cleanup should include package cache, projection, readiness state, storage namespace, artifacts, evidence, tasks, logs, exports, and secret bindings when policy allows.

## Security checklist

- Package and manifest hashes are verified.
- Unsupported manifest versions are rejected.
- Capabilities are injected, not imported.
- Policy is enforced at bridge level.
- Storage and artifacts are namespaced.
- Secrets never enter package or logs.
- UI and worker runtimes are sandboxed.
- Evidence records trust-sensitive actions.
- Uninstall can remove app-owned data.
- `lime.cloudSession` does not leak tokens in snapshots, and tokens are for short-lived use only.
