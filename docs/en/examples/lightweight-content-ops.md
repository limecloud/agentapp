---
title: Lightweight Content Ops App
description: Sanitized v0.7 example for requirement boundary and capability handoff.
---

# Lightweight Content Ops App

This is a sanitized v0.7 example for a common content-operations workflow. It demonstrates how Agent App separates what the app can do from what Lime Host, Lime Cloud, connectors, external systems, and humans must provide.

Reference package: [`docs/examples/lightweight-content-ops-app/APP.md`](../../examples/lightweight-content-ops-app/APP.md)

## Ordinary-user flow

```mermaid
flowchart TD
  Open([Open workspace]) --> Setup{Connector ready?}
  Setup -- No --> Connect[Ask Lime to connect the external source]
  Connect --> Setup
  Setup -- Yes --> Select[Select source records]
  Select --> Draft[Generate reviewable draft]
  Draft --> Review{Approve?}
  Review -- Modify --> Draft
  Review -- Reject --> Stop([Stop])
  Review -- Approve --> Save[Save artifact + evidence]
  Save --> Write{Write back enabled?}
  Write -- No --> Done([Done])
  Write -- Yes --> Confirm[Human confirms dry-run]
  Confirm --> External[Host connector writes external draft]
  External --> Done
```

## v0.7 files

| File | Purpose |
| --- | --- |
| `app.requirements.yaml` | MVP, non-goals, later phases, and acceptance criteria. |
| `app.boundary.yaml` | App / Host / Cloud / connector / external-system / human responsibilities. |
| `app.integrations.yaml` | Host/Cloud-managed `source_records` and optional `draftbox` connectors. |
| `app.operations.yaml` | Side effects, approval, dry-run, idempotency, and evidence rules. |

## Boundary summary

- App owns the workspace UI, draft review workflow, content draft artifact, and handoff status.
- Host owns local agent execution, connector invocation, secrets, policy, sandbox, and evidence.
- Cloud may own connector registry, tenant policy, OAuth broker, webhook, or scheduled sync.
- External systems own source records and optional draft-box records.
- Humans own approval before write-back, publish, delete, or bulk update.

## Try it locally

```bash
npm run cli -- validate docs/examples/lightweight-content-ops-app --version 0.7
npm run cli -- project docs/examples/lightweight-content-ops-app
npm run cli -- readiness docs/examples/lightweight-content-ops-app
```
