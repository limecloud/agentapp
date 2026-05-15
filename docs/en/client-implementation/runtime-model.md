---
title: Runtime Model
description: How a host installs, authorizes, executes, observes, and cleans up Agent Apps.
---

# Runtime Model

Agent App is host-executed, not registry-executed by default. A package may contain UI bundles, workers, workflows, storage schemas, and business code, but those assets must run inside host-controlled runtimes and call platform capabilities through the Capability SDK.

The runtime model protects three boundaries:

1. The host owns execution and policy.
2. The app owns product behavior and app-local state.
3. The registry owns distribution and release metadata, not hidden runtime execution.

## Core flow

```text
APP.md / manifest
  -> package verification
  -> projection
  -> readiness
  -> user or tenant authorization
  -> capability injection
  -> UI / workflow / worker execution
  -> artifact / evidence / eval
  -> cleanup or upgrade
```

Each step should be inspectable. A host should be able to stop before execution and still show the user what the app would add.

## Runtime actors

| Actor | Responsibility |
| --- | --- |
| Registry or Cloud | Catalog, release metadata, package URL, tenant enablement, license, policy defaults. |
| Host installer | Download, verify, cache, project, and run readiness. |
| Capability bridge | Inject authorized SDK handles and enforce permissions. |
| UI host | Mount app pages, panels, settings, and artifact viewers in a sandbox. |
| Workflow runtime | Execute approved workflow steps with trace, retry, cancel, and evidence. |
| Worker runtime | Run packaged background code only inside a sandbox and policy boundary. |
| Storage service | Provide app namespace, schema, migrations, and cleanup. |
| Artifact and Evidence services | Persist outputs and provenance. |

## In-app Agent task contract

Business workflows should not require a handoff back to generic chat. When an app needs agent intelligence, it starts an app-scoped task through the injected SDK and renders the task inside its own page, panel, workflow step, or review queue.

Minimum contract:

- The app starts work with `lime.agent.startTask()` or `lime.workflow.start()` and includes app id, entry key, idempotency key, business context, requested tools, knowledge bindings, and expected output schema.
- The host runtime streams task events such as status, progress, tool calls, knowledge citations, partial artifacts, blocked permissions, errors, cancellation, and trace id.
- The app presents those events in its own product UI and lets the user cancel, retry, edit input, approve, or reject results without leaving the app.
- The final result is structured data, not only chat text. The app writes it back through `lime.storage`, `lime.artifacts`, and `lime.evidence` after policy checks and any required human review.
- Expert chat may be embedded as a collaborator, but it must share the same app context and task lifecycle. It must not become a detached place where core app work happens outside product state.

This contract keeps the app from becoming a plain web app that calls models directly, and keeps Lime chat from becoming the mandatory container for every business process.

## Host runtime responsibilities

- Install, uninstall, upgrade, disable, and export apps.
- Verify package hash, manifest hash, signature, and compatibility.
- Run capability negotiation.
- Register UI routes, panels, commands, settings, and artifact viewers.
- Create app storage namespace and apply migrations only after review.
- Inject `lime.*` capability handles.
- Intercept file, network, secret, tool, agent, storage, and export permissions.
- Record provenance, evidence, telemetry, eval results, and cleanup records.
- Keep app state separate from host global state.

## Execution modes

| Mode | Meaning | Requirements |
| --- | --- | --- |
| `local` | App runs in the local host runtime. | Host capability bridge, local storage, local policy. |
| `hybrid` | Local runtime uses remote registry, gateway, or ToolHub services. | Explicit tool and gateway policy. |
| `server-assisted` | Some app execution happens server side. | Manifest declaration, tenant policy, audit, data boundary. |

`local` should be the default mental model. Server assistance must be explicit.

## UI runtime

App UI should run in a controlled host surface. It can receive theme, locale, route, entry context, and injected SDK bridge. It should not receive raw host APIs, Node APIs, arbitrary filesystem access, or direct access to host source modules.

UI runtime output should be reversible: disabling the app should remove the UI entries without changing host core routes.

## Host Bridge v1

After the UI host mounts an iframe or equivalent sandbox surface, it must establish Host Bridge. The bridge sends host state and controlled actions to app UI without exposing raw host APIs to the app.

The first host snapshot should include at least:

- `appId`, `entryKey`, `route`, and runtime origin.
- `themeMode`, `effectiveThemeMode`, `colorSchemeId`, and theme CSS variables.
- Non-sensitive `locale`, `timezone`, `workspaceId`, and `tenantId` summary.
- Capability summary for the current entry and reasons for blocked capabilities.

The host must validate message source: `event.source` must be the current app frame, `event.origin` must match runtime origin, and message `protocol` and `version` must match. Untrusted messages must be ignored or logged for debugging, never executed as capability calls.

`capability:invoke` is only a transport envelope. Files, models, tools, downloads, external URLs, secrets, and storage writes must still pass readiness, permission, policy, allowlists, and provenance recording. Blocked calls return `host:error`; mock results must not masquerade as success.

## Workflow and worker runtime

Start with a controlled workflow runtime before executing arbitrary worker code. An allowlisted workflow DSL can call SDK capabilities such as storage, Knowledge, agent tasks, Artifacts, and Evidence.

Raw worker execution requires additional sandboxing:

- resource limits
- filesystem restrictions
- network policy
- secret handling
- cancellation and timeout
- audit logs
- package provenance

## Runtime data lifecycle

App runtime may create:

- storage namespace records
- artifact records
- evidence records
- tasks and traces
- logs and telemetry
- caches and indexes
- secret bindings

All of these need app provenance and cleanup behavior.

## Cloud boundary

Cloud may provide catalog, release, license, tenant enablement, gateway, and ToolHub. Cloud should not become the default Agent Runtime. If server-assisted execution is required, the app must declare it explicitly and Policy must control it.

## Runtime acceptance criteria

A host runtime is acceptable when:

- no app code runs before verification, projection, readiness, and authorization
- every capability call goes through injected SDK handles
- policy is enforced at the bridge
- artifacts and evidence include package provenance
- app data is namespaced
- disable and uninstall are implemented
- registry failure does not break already installed local apps unless policy requires disablement
