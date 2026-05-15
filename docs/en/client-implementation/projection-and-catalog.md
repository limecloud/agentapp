---
title: Projection and catalog
description: How hosts compile APP.md into catalog entries and runtime descriptors.
---

# Projection and catalog

Projection is a deterministic compilation step. It turns an Agent App manifest into host-readable catalog objects. It does not run the app.

Projection lets a host show app entries, setup needs, permissions, and artifacts before activation.

## Inputs

Projection uses:

- parsed manifest from `APP.md`
- package identity
- manifest hash
- package hash
- host capability profile
- optional tenant enablement metadata

It should not use customer data or runtime outputs.

## Outputs

A projection can include:

| Output | Purpose |
| --- | --- |
| App summary | Catalog card and install review. |
| Entries | Pages, panels, commands, workflows, artifacts, background tasks, settings. |
| Capability requirements | SDK and host capability negotiation. |
| UI descriptors | Routes, panels, cards, artifact viewers. |
| Storage descriptors | Namespace, schema, migrations, retention. |
| Workflow descriptors | State machines and human review nodes. |
| Permission prompts | Install-time and runtime review. |
| Knowledge slots | Required and optional Knowledge bindings. |
| Tool requirements | ToolHub and policy checks. |
| Artifact types | Durable output contracts. |
| Eval rules | Quality gates and acceptance state. |
| Provenance | App version, package hash, manifest hash, standard version. |

## Projection example

```json
{
  "app": {
    "name": "content-factory-app",
    "version": "0.3.0",
    "appType": "domain-app"
  },
  "entries": [
    {
      "key": "content_factory",
      "kind": "page",
      "title": "Content Factory",
      "route": "/content-factory",
      "provenance": {
        "appName": "content-factory-app",
        "appVersion": "0.3.0",
        "manifestHash": "sha256:...",
        "packageHash": "sha256:..."
      }
    }
  ]
}
```

## Determinism

Given the same package and host profile, projection should produce the same output. Determinism enables:

- cache validation
- review diffs
- rollback
- audit
- reproducible readiness
- cleanup plans

Avoid generating random IDs during projection. Generate runtime IDs only when entries run.

## Catalog levels

A host can maintain several catalog views:

| Catalog | Contents |
| --- | --- |
| Registry catalog | App metadata before download. |
| Installed catalog | Apps installed in local cache. |
| Workspace catalog | Entries enabled for a workspace. |
| Runtime catalog | Entries currently ready to run. |
| Artifact catalog | Outputs created by app runs. |

Projection feeds the installed and workspace catalogs.

## Cache invalidation

Invalidate projection when:

- package hash changes
- manifest hash changes
- host capability profile changes
- tenant enablement changes
- policy defaults change
- app is upgraded, disabled, or uninstalled

Knowledge bindings or secrets usually affect readiness, not projection shape, unless the host chooses to hide entries based on setup.

## Safety rules

Projection must not:

- execute workflows
- call tools
- start agent tasks
- read private files
- load secrets
- run UI bundle code
- apply storage migrations

If an app requires these actions to understand its catalog, the package is not valid for safe host review.

## Checklist

- Projection output includes provenance on every object.
- Entry keys are stable.
- Unsupported entry kinds are rejected or marked compatibility-only.
- Runtime package paths are recorded but not executed.
- Permissions and setup needs are visible before activation.
- Projection can be deleted and rebuilt from package metadata.
