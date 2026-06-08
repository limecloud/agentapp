---
title: Runtime Model
description: How a host installs, authorizes, executes, observes, and cleans up Agent Apps.
---

# Runtime Model

Agent App is host-executed, not registry-executed by default. A package may contain UI bundles, workers, workflows, app backend services, storage schemas, and business code, but those assets must run inside host-controlled runtimes and call platform capabilities through the Capability SDK.

The runtime model protects three boundaries:

1. The host owns execution and policy.
2. The app owns product behavior and app-local state.
3. The registry owns distribution and release metadata, not hidden runtime execution.

Agent App uses a mini-program style runtime: user state and platform capabilities are shared by the host, while app code, app storage, and app-owned backend services remain isolated.

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
| Worker / backend runtime | Run packaged background code and app-owned backend services only inside a sandbox and policy boundary. |
| Storage service | Provide app namespace, schema, migrations, and cleanup. |
| Artifact and Evidence services | Persist outputs and provenance. |
| App Server client | Owned by the host; performs JSON-RPC initialization, session / turn / action requests, event subscription, reconnect, and error projection. |
| RuntimeCore / services | Fact source for Agent sessions, turns, tools, actions, artifacts, evidence, workspace, and policy. |

## In-app Agent task contract

Business workflows should not require a handoff back to generic chat. When an app needs agent intelligence, it starts an app-scoped task through the injected SDK and renders the task inside its own page, panel, workflow step, or review queue.

Minimum contract:

- The app starts work with `lime.agent.startTask()` or `lime.workflow.start()` and includes app id, entry key, idempotency key, business context, requested tools, knowledge bindings, and expected output schema.
- The host runtime streams task events such as status, progress, tool calls, knowledge citations, partial artifacts, blocked permissions, errors, cancellation, and trace id.
- The app presents those events in its own product UI and lets the user cancel, retry, edit input, approve, or reject results without leaving the app.
- The final result is structured data, not only chat text. The app writes it back through `lime.storage`, `lime.artifacts`, and `lime.evidence` after policy checks and any required human review.
- Expert chat may be embedded as a collaborator, but it must share the same app context and task lifecycle. It must not become a detached place where core app work happens outside product state.

This contract keeps the app from becoming a plain web app that calls models directly, and keeps Lime chat from becoming the mandatory container for every business process.

## App Server bridge profile

A desktop host that supports `agentRuntime.bridge.kind=app-server-json-rpc` in `app.runtime.yaml` must project app-facing capability calls into the current App Server protocol:

```text
lime.agent.startTask()
  -> Host Bridge capability:invoke
  -> Desktop Host IPC / preload allowlist
  -> App Server JSON-RPC agentSession/start
  -> App Server JSON-RPC agentSession/turn/start
  -> RuntimeCore / services / ExecutionBackend
  -> App Server JSON-RPC notification agentSession/event
  -> Host Bridge host:response / host:event projection
```

Mapping rules:

| App / SDK meaning | App Server method | Notes |
| --- | --- | --- |
| Initialize host runtime client | `initialize` + `initialized` | Every transport connection must handshake first; `clientInfo.name` is explicitly provided by the host. |
| Create or resume an app task session | `agentSession/start` | Binds `appId`, `workspaceId`, and optional `businessObjectRef`. |
| Read recoverable state | `agentSession/read` | Locally cached session ids must be confirmed by the server and must belong to the current workspace. |
| Start one task turn | `agentSession/turn/start` | Carries SDK input, attachments, structured output, capabilityId, stream, queue policy, and host options. |
| Cancel task | `agentSession/turn/cancel` | Cancels the active turn; apps do not kill processes directly. |
| Respond to approval or human input | `agentSession/action/respond` | Responds to `action.required` while preserving policy and evidence. |
| Receive events | `agentSession/event` | The only public event ingress; events derive from RuntimeCore facts. |
| Discover capabilities | `capability/list` | Host projects capabilities available to the app without exposing internal module paths. |
| Read artifacts | `artifact/read` | App reads artifact refs / previews without bypassing Artifact service. |
| Export evidence | `evidence/export` | App reads evidence pack summaries or export refs without rebuilding the evidence store. |

Forbidden paths:

- App UI / Worker directly spawning `app-server`, reading stdout JSONL, connecting local sockets, or importing Lime Rust / JS internals.
- Electron main / preload owning Agent execution facts; it only provides Desktop Host bridge, sidecar lifecycle, windows, and IPC allowlists.
- App UI state fabricating successful `assistant:delta`, tool result, artifact, or evidence events.
- Product paths falling back to mock success when App Server is unavailable.

## Host runtime responsibilities

- Install, uninstall, upgrade, disable, and export apps.
- Verify package hash, manifest hash, signature, and compatibility.
- Run capability negotiation.
- Register UI routes, panels, commands, settings, and artifact viewers.
- Create app storage namespace and apply migrations only after review.
- Create app backend service sandboxes, supervise their lifecycle, and expose only approved capability handles.
- Inject `lime.*` capability handles.
- Intercept file, network, secret, tool, agent, storage, and export permissions.
- Record provenance, evidence, telemetry, eval results, and cleanup records.
- Keep app state separate from host global state.

## Shared host runtime profile

Hosts may share these projections across apps:

| Shared projection | Allowed | Forbidden |
| --- | --- | --- |
| User / tenant / workspace | Stable ids, display name, locale, timezone, workspace summary. | Bearer tokens, refresh tokens, private file contents. |
| Session and OAuth | Presence, account label, provider availability, setup action. | Raw OAuth tokens or provider credentials. |
| Model settings | Effective model profile, limits, setup action. | Provider API keys or host-private routing tables. |
| Billing and entitlement | Plan summary, quota status, blocked reason. | Raw billing ledger or payment credentials. |
| Host UI | Theme tokens, navigation, toast, download, shell actions. | Host DOM, Electron objects, Tauri commands, Node APIs. |
| Platform capabilities | Capability availability and typed SDK handles. | Direct service objects, database handles, filesystem paths. |

Shared user state is a host projection, not app-owned state. Apps may cache only the minimum non-sensitive snapshot needed for UI continuity, and must treat host snapshots as refreshable facts.

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

Host Bridge does not expose App Server transport. The app sees SDK tasks, events, and artifact projections. The App Server client, sidecar path, JSON-RPC envelope, Electron IPC channel, Tauri command name, and RuntimeCore internal types are host implementation details.

## Workflow, worker, and app backend runtime

Start with a controlled workflow runtime before executing arbitrary worker code. An allowlisted workflow DSL can call SDK capabilities such as storage, Knowledge, agent tasks, Artifacts, and Evidence.

Raw worker or app backend execution requires additional sandboxing:

- resource limits
- filesystem restrictions
- network policy
- secret handling
- cancellation and timeout
- audit logs
- package provenance

App backend services may be multi-language. The host should prefer protocols that preserve supervision and capability mediation:

| Runtime shape | Recommended protocol | Notes |
| --- | --- | --- |
| Python / Go / Rust / Node / Java local service | `stdio-jsonrpc` | Best default for cross-language services; host owns process, environment, stdio, cancellation, and restart policy. |
| Long-lived local service | `local-http` or local socket | Host owns random binding, per-launch auth, health checks, and shutdown. |
| Deterministic compute | `wasm` | No ambient filesystem, network, or secret access. |
| Remote backend | `remote-http` | Requires explicit `server-assisted` declaration, tenant policy, audit, and data boundary. |

Backend services are not a loophole around the host. They must not read host databases, workspace files, secrets, model keys, or user state directly; they request those through the same capability bridge as UI and workflow code.

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

Storage placement is an implementation detail, but the logical boundary is not. The host core database must remain separate from app-owned migrations. A host may co-locate multiple app stores in one physical database engine only when it still enforces app, workspace, and tenant boundaries. For local desktop hosts, per-app SQLite files avoid cross-app write contention and make uninstall, backup, migration rollback, and corruption recovery simpler. For server hosts, shared PostgreSQL instances should use per-app schemas or dedicated databases for high-risk apps; shared tables are only appropriate for low-risk metadata with database-enforced scoping.

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
