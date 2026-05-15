---
title: Release and distribution
description: How to publish immutable Agent App releases without overwriting customer state.
---

# Release and distribution

Agent App releases should be immutable, reviewable, and safe to roll back. A registry can distribute packages and authorize tenants, but the host still performs local verification, readiness, policy checks, and runtime execution.

## Release object

A release should include enough metadata for a host to decide whether it can install the package before downloading every support file.

| Field | Purpose |
| --- | --- |
| `appId` | Stable package identity. |
| `version` | SemVer package version. |
| `manifestVersion` | Agent App manifest version. |
| `packageUrl` | Download or registry reference. |
| `packageHash` | Integrity check for the package. |
| `manifestHash` | Integrity check for `APP.md` or extracted manifest. |
| `signatureRef` | Optional signature or supply-chain attestation. |
| `compatibility` | Host, SDK, and capability version ranges. |
| `releaseNotesUrl` | Human-readable change notes. |
| `rollbackTarget` | Known safe previous release. |

## Channels and pins

Registries may expose channels such as `stable`, `beta`, or `internal`, but tenant enablement should resolve to a concrete release.

```text
channel: stable
  -> release: content-factory-app@0.3.0
  -> packageHash: sha256:...
```

Pinning matters because app packages can include migrations and runtime code. A host should know exactly which package was installed.

## Distribution flow

```mermaid
sequenceDiagram
  participant Publisher as Publisher
  participant Registry as Registry
  participant Tenant as Tenant admin
  participant Host as Host runtime

  Publisher->>Registry: Upload package metadata and hash
  Registry->>Registry: Validate manifest and compatibility
  Tenant->>Registry: Enable release or channel
  Host->>Registry: Request bootstrap metadata
  Registry-->>Host: Enabled releases and policy defaults
  Host->>Host: Download, verify, project, readiness check
  Host->>Host: Install only after consent and policy pass
```

The registry distributes. The host installs and runs.

## What must not be overwritten

A release upgrade must not overwrite:

- user Knowledge bindings
- workspace files
- app storage records
- secrets
- tenant overlays
- user overrides
- generated artifacts
- evidence history

Official package defaults can change. User and tenant state must remain separate.

## Migration notes

If a release changes storage schema or workflow state, ship explicit migration metadata:

```yaml
lifecycle:
  upgrade:
    migrations:
      - from: "0.2.x"
        to: "0.3.0"
        storage: ./storage/migrations/003_v0_3.sql
        reversible: false
        risk: requires user confirmation before deleting old indexes
```

Hosts should dry-run migrations when possible and show irreversible risks.

## Rollback

Rollback is not just downloading the older package. The host must decide what to do with data written by the newer version.

Minimum rollback plan:

- disable new entries if incompatible
- keep user data by default
- avoid running downgrade migrations automatically
- preserve evidence records
- record which release created each artifact
- expose export before delete when data loss is possible

## Release checklist

Before publishing a release:

- `agentapp-ref validate` passes.
- `agentapp-ref project` output is deterministic.
- `agentapp-ref readiness` produces actionable setup tasks.
- Package hash and manifest hash are recorded.
- Compatibility ranges are accurate.
- Release notes describe breaking changes and migrations.
- Example workspace still passes expected evals.
- Customer data is not bundled in the official package.
- Rollback target is known.

## Recommended version policy

| Change | Version impact |
| --- | --- |
| Text-only docs or examples | Patch |
| Optional entry, optional tool, optional eval | Minor |
| Required capability, schema migration, breaking entry key | Major or explicit compatibility note |
| Security fix | Patch with clear advisory |
| Deprecation | Minor with removal window |

Agent App is still pre-1.0, but app authors should behave as if users depend on stable contracts.
