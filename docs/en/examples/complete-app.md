---
title: Complete APP.md
description: A checklist and annotated structure for a complete Agent App manifest.
---

# Complete APP.md

A complete app manifest is not long for its own sake. It is complete because a host can discover, review, project, check readiness, run, audit, upgrade, and uninstall the app without guessing.

Use `docs/examples/content-factory-app/APP.md` as the current fixture. The sections below explain what should be present in a production-ready package.

## Required identity

```yaml
manifestVersion: 0.3.0
name: content-factory-app
description: Content Factory App for knowledge building, content scenario planning, content production, and review.
version: 0.3.0
status: ready
appType: domain-app
runtimeTargets:
  - local
```

Identity fields let registries and hosts index the package. They should be stable and boring.

## Runtime requirements

```yaml
requires:
  lime:
    appRuntime: ">=0.3.0 <1.0.0"
  sdk: "@lime/app-sdk@^0.3.0"
  capabilities:
    lime.ui: "^0.3.0"
    lime.storage: "^0.3.0"
    lime.agent: "^0.3.0"
```

Requirements should describe what the host must provide. They should not describe host internals.

## Runtime package

```yaml
runtimePackage:
  ui:
    path: ./dist/ui
  worker:
    path: ./dist/worker
  storage:
    schema: ./storage/schema.json
    migrations: ./storage/migrations
```

`APP.md` points to implementation assets; it does not contain the implementation.

## Entries

```yaml
entries:
  - key: dashboard
    kind: page
    title: Dashboard
    route: /dashboard
  - key: content_calendar
    kind: workflow
    title: Content calendar
    workflow: ./workflows/content-calendar.workflow.md
```

Entries are user-visible launch points. A complete app usually has more than one entry and is not only an `expert-chat`.

## Storage and data boundary

```yaml
storage:
  namespace: content-factory-app
  schema: ./storage/schema.json
  migrations: ./storage/migrations
  uninstallPolicy: ask
```

Storage must be namespaced so uninstall, export, and audit can work.

## Dependencies and deliverables

A complete app usually declares:

- `knowledgeTemplates` for required and optional Knowledge slots
- `skillRefs` for procedural Skills
- `toolRefs` for external or host-provided tools
- `artifactTypes` for durable outputs
- `evals` for quality gates
- `permissions` for host policy
- `secrets` for credential slots
- `overlayTemplates` for tenant and workspace configuration

## Human guide

The Markdown body should answer:

1. What problem does this app solve?
2. Which entries should users start with?
3. What setup is required?
4. What data should never be included in the official package?
5. What artifacts are created?
6. What quality gates apply?
7. How should the app be upgraded or removed?

## Complete-package checklist

| Area | Complete when |
| --- | --- |
| Manifest | Required fields and v0.3 requirements are present. |
| Runtime package | UI, worker, storage, and workflow paths are declared when used. |
| Entries | Every user launch point has stable key, kind, title, and binding metadata. |
| Data | Storage namespace and Knowledge slots are explicit. |
| Policy | Permissions, secrets, and risky capabilities are declared. |
| Quality | Artifact types and evals are connected to workflows. |
| Overlays | Tenant and workspace differences do not fork the package. |
| Provenance | Projection and runtime outputs can trace back to app version and hashes. |
| Cleanup | Disable, uninstall keep data, and delete data behavior is known. |

## Validation commands

```bash
npm run cli -- validate docs/examples/content-factory-app
npm run cli -- project docs/examples/content-factory-app
npm run cli -- readiness docs/examples/content-factory-app
```

A valid complete app may still return `needs-setup` in readiness if required host assets are not bound yet. That is expected.
