---
title: Content Factory App
description: Product-level Agent App example for content factory workflows.
---

# Content Factory App

The Content Factory App shows why Agent App is an application package, not a single expert or a prompt collection. It packages a business workflow with UI, storage, workflows, workers, Knowledge bindings, Tools, Artifacts, Evals, permissions, and overlays.

Reference package: [`docs/examples/content-factory-app/APP.md`](../../examples/content-factory-app/APP.md)

## Product shape

The app is designed for teams that repeatedly turn project knowledge into content operations output.

```text
Project setup
  -> Knowledge building
  -> Content scenario planning
  -> Content production
  -> Review and evidence
  -> Content calendar and operational review
```

The app owns product surfaces such as dashboard, content factory page, workflow entries, and expert-chat entries. The host provides platform capabilities through the SDK.

## Declared entries

| Entry | Kind | Purpose |
| --- | --- | --- |
| `dashboard` | `page` | Project home and setup status. |
| `knowledge_builder` | `workflow` | Turn selected files and notes into structured project knowledge. |
| `content_factory` | `page` | Generate and manage content assets. |
| `content_strategist` | `expert-chat` | Strategy conversation entry for content decisions. |
| `content_calendar` | `workflow` | Plan, review, and update content cadence. |

This structure proves that an expert is only one entry in a larger app.

## Runtime package

The example declares:

- `dist/ui` for app UI routes
- `dist/worker` for background implementation
- `storage/schema.json` for app-owned data model
- `storage/migrations` for versioned storage setup
- `workflows` for business processes
- `agents` for expert-chat persona files

The package is intentionally small, but it has the same shape as a real product-level app.

## Data model

The example storage schema includes:

| Table | Purpose |
| --- | --- |
| `content_projects` | Project-level configuration and status. |
| `knowledge_assets` | Structured knowledge assets and source references. |
| `content_scenarios` | Planned audience, pain point, platform, and intent scenarios. |
| `content_assets` | Drafts, scripts, prompts, reports, and review state. |
| `review_reports` | Quality, evidence, and publish readiness summaries. |

Customer-specific facts are not bundled. They are bound through Knowledge, workspace files, app storage, secrets, or overlays.

## Capability use

| Capability | Example use |
| --- | --- |
| `lime.ui` | Register dashboard and content factory page. |
| `lime.storage` | Store projects, content scenarios, and assets. |
| `lime.files` | Read user-selected source documents. |
| `lime.agent` | Run knowledge extraction and content generation tasks. |
| `lime.knowledge` | Search bound project knowledge. |
| `lime.tools` | Invoke document parsing and research tools. |
| `lime.artifacts` | Create content tables, drafts, strategy reports, and decks. |
| `lime.evidence` | Link outputs to sources, tasks, and evals. |
| `lime.policy` | Review file, tool, model, and export permissions. |
| `lime.secrets` | Bind optional publishing workspace token. |

## v0.6 Agent task runtime

The fixture includes [`app.runtime.yaml`](../../examples/content-factory-app/app.runtime.yaml) to make `lime.agent` execution explicit. It declares:

- `lime.agent-task-event.v1` / `lime.agent-task-result.v1` event and result envelopes
- JSON Schema structured output via `artifacts/content-factory-workspace-patch.schema.json`
- host-mediated approvals with updated input and defer support
- `new`, `resume`, `continue`, and `fork` session modes
- on-demand tool discovery with selected-only schemas
- checkpoint boundaries for workflow state, app storage, artifacts, tracked files, conversation, and external side effects
- OpenTelemetry mapping with content export disabled by default

## Readiness behavior

The fixture validates successfully, but readiness can report `needs-setup` because required Skills, Knowledge, Tools, Evals, and services must be satisfied by the host.

That is correct behavior. The package is structurally valid; the workspace may still need setup before execution.

## What the example demonstrates

- Product-level apps should not be written into Lime Core.
- `APP.md` is declaration and guide, not the full app.
- Runtime code must call the Capability SDK.
- Customer data belongs outside official packages.
- Entries are not limited to chat.
- Artifacts and Evidence make output durable and reviewable.
- Overlay templates let tenants customize without forking the app.

## Try it locally

```bash
npm run cli -- validate docs/examples/content-factory-app --version 0.6
npm run cli -- project docs/examples/content-factory-app
npm run cli -- readiness docs/examples/content-factory-app
```
