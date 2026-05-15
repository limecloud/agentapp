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
