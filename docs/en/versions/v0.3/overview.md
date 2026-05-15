---
title: v0.3 overview
description: Current Agent App standard layer for executable package contracts.
---

# v0.3 overview

v0.3 moves Agent App from a complete package draft to an executable standard layer. The goal is that hosts can validate, project, install, run, and review product-level apps without embedding vertical business logic in host core.

## Core changes

- Strong JSON schemas for entries, permissions, services, workflows, Knowledge templates, Skill refs, Tool refs, Artifact types, Evals, secrets, and overlay templates.
- Typed SDK expectations for `@lime/app-sdk`: stable error codes, cancellation, retries, idempotency, provenance, and mocks.
- Runtime ABI guidance for UI bundles, workers, workflows, artifact viewers, settings, and background tasks.
- Overlay templates for tenant, workspace, user, and customer differences.
- `scene` / `home` are compatibility-only; v0.3 apps use `page`, `panel`, `expert-chat`, `command`, `workflow`, `artifact`, `background-task`, or `settings`.
- Projection provenance includes `packageHash` as well as `manifestHash`.
- Reference example is `内容工厂` / `content-factory-app`.

## Why v0.3 matters

v0.3 is the first version that is explicit enough for host implementation work. It defines not only what appears in `APP.md`, but also how hosts should reason about runtime packages, capability negotiation, readiness, overlays, secrets, and provenance.

## Current mental model

```text
Registry / Cloud
  catalog, release, tenant enablement
    -> Host
       install, project, readiness, policy, SDK injection
         -> Agent App Runtime Package
            UI, workflow, worker, storage, artifacts
```

## Good fits

- Content factory systems.
- Customer support workbenches.
- Sales SOP apps.
- Contract review products.
- Investment research workbenches.
- Internal process apps.
- Customer-specific private business systems.

## Implementation focus

Hosts adopting v0.3 should first implement read-only package inspection, projection, readiness, and cleanup. Runtime execution should be opened capability by capability through a typed SDK bridge.

## Compatibility note

Old packages using `scene` or `home` should be treated as compatibility packages. New work should use current v0.3 entry kinds.

## What counts as complete in v0.3

A v0.3 package is complete when a host can inspect it without executing code, project it into entries, explain setup gaps, authorize required capabilities, run runtime assets through the SDK, record Evidence, and remove or upgrade it without corrupting user data.

## Host implementation phases

1. Read-only inspection and schema validation.
2. Catalog projection with provenance.
3. Readiness runner and setup UI.
4. Capability SDK injection for UI and workers.
5. Lifecycle management: install, update, disable, uninstall, export data.
6. Registry and tenant policy integration.

## Reader checklist

After reading the v0.3 pages, a reader should be able to:

- Decide whether a business capability is an App, Skill, Knowledge pack, Tool, or Artifact.
- Write a manifest that separates discovery, runtime implementation, setup, and release metadata.
- Implement host projection without hardcoding vertical entries.
- Explain readiness findings to users before execution.
- Keep private customer data out of official packages.
- Upgrade or remove an app without losing user-owned data.
