---
title: v0.3 overview
---

# v0.3 overview

v0.3 moves Agent App from a complete package draft to an executable standard layer. The goal is that hosts can validate, project, install, run, and review product-level apps without embedding vertical business logic in the host core.

## Core changes

- Stronger JSON schemas for descriptors: entries, permissions, services, workflows, Knowledge templates, Skill refs, Tool refs, Artifact types, Evals, secrets, and overlay templates.
- Typed SDK expectations for `@lime/app-sdk`, including stable error codes, cancellation, retries, idempotency, provenance, and mocks.
- Runtime ABI guidance for UI bundles, workers, workflows, artifact viewers, settings, and background tasks.
- Overlay templates for tenant, workspace, user, and customer differences.
- `scene` / `home` are compatibility-only; v0.3 apps use `page`, `command`, `workflow`, `artifact`, `background-task`, or `settings`.
- Projection provenance now includes `packageHash` as well as `manifestHash`.
- Reference example is `APP 内容工厂` / `content-factory-app`.

## Good fits

- Content factory systems.
- Customer support workbenches.
- Sales SOP apps.
- Contract review products.
- Investment research workbenches.
- Internal process apps.
