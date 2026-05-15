---
title: Manifest Design
---

# Manifest Design

The manifest declares what the app needs, what it provides, where implementation is loaded from, and how the host can project it safely. It is not the business implementation itself.

## Principles

1. Keep `APP.md` discoverable, readable, and reviewable.
2. Put real UI, workers, storage, and workflows in the runtime package.
3. Declare every Lime capability through `capabilities` and `requires.capabilities`.
4. Separate required and optional capabilities so readiness can degrade gracefully.
5. Keep customer data, credentials, and tenant overlays out of the official manifest.
6. Every entry should trace to a UI route, worker, workflow, expert persona, or artifact type.

## Recommended shape

```yaml
name: example-domain-app
version: 0.3.0
status: ready
appType: domain-app
manifestVersion: 0.3.0
runtimeTargets:
  - local
requires:
  lime:
    appRuntime: ">=0.3.0 <1.0.0"
  sdk: "@lime/app-sdk@^0.3.0"
  capabilities:
    lime.ui: "^0.3.0"
    lime.storage: "^0.3.0"
    lime.agent: "^0.3.0"
capabilities:
  - lime.ui
  - lime.storage
  - lime.agent
  - agentskills
runtimePackage:
  ui:
    path: ./dist/ui
  worker:
    path: ./dist/worker
storage:
  namespace: example-domain-app
  schema: ./storage/schema.json
entries:
  - key: dashboard
    kind: page
    title: Dashboard
    route: /dashboard
  - key: advisor
    kind: expert-chat
    title: Advisor
    persona: ./agents/advisor.md
```

## v0.3 extra requirements

- `scene` / `home` are v0.1 compatibility entries only; new apps use `page`, `command`, `workflow`, `artifact`, `background-task`, or `settings`.
- Product-level apps should declare `runtimePackage` and make every entry traceable to UI, worker, workflow, expert, or artifact implementation.
- Executable entries, workers, tool adapters, or secrets must declare `permissions`.
- Customer differences belong in `overlayTemplates`; do not fork official packages.

## Common mistakes

- Putting business implementation into `APP.md`.
- Declaring only `expert-chat` while claiming to be a full app.
- Calling Lime internals directly instead of the SDK.
- Reimplementing files, storage, artifacts, knowledge, and Tool Broker in each app.
- Forgetting storage migration, secret, network, and background-task permissions.

## Entry design table

| Entry kind | Use it for | Must point to |
| --- | --- | --- |
| `page` | App-owned full page such as dashboard or workspace. | Route or UI bundle registration. |
| `panel` | Contextual side panel embedded in host UI. | Route, panel placement, and data contract. |
| `expert-chat` | Chat-first specialist inside the app. | Persona file plus required Skills / Knowledge. |
| `command` | Command palette or slash-command action. | Command handler or workflow start. |
| `workflow` | Multi-step business state machine. | Workflow descriptor and optional worker. |
| `artifact` | Viewer or creator for durable outputs. | Artifact type descriptor and UI viewer. |
| `background-task` | Scheduled or event-driven work. | Worker/service descriptor and permissions. |
| `settings` | App configuration surface. | Settings route and overlay/storage policy. |

## Manifest review checklist

- Identity fields are stable enough for registry, cache, and upgrade logic.
- `requires` declares SDK and host capability versions before runtime code uses them.
- Optional capabilities have degraded behavior documented in the guide body.
- Each entry has a unique key and can be traced to runtime implementation.
- Permissions describe user impact, not just internal technical scope.
- Overlay templates describe tenant/workspace customization without duplicating official packages.
- Compatibility metadata explains minimum host version and migration constraints.
