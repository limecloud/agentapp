---
title: Architecture overview
description: Project-level architecture, sequence, flow, and state-machine diagrams for Agent App v0.5.
---

# Architecture overview

This page collects the key structural and runtime diagrams for Agent App v0.5 in one place. The [specification](./specification) defines rules; this page renders them.

## 1. Standard layers

v0.5 splits the ecosystem into three layers. The layered manifest and Capability SDK are the stable boundaries; hosts and the Cloud control plane stay on contracts and never on business implementation.

```mermaid
flowchart TD
  subgraph Cloud[Cloud / Registry control plane]
    Catalog[App Catalog]
    Release[Release metadata]
    Tenant[Tenant enablement]
    Reg[Registration / License]
  end

  subgraph Standard[Agent App v0.5 standard]
    APPMD[APP.md frontmatter + sections]
    LAYERED[app.*.yaml layered config]
    SKILLS[skills/ bundled Skills]
    EVALS[evals/ readiness + health]
    SIG[app.signature.yaml]
    I18N[app.i18n.yaml + locales]
  end

  subgraph Host[Host runtime - Lime Desktop]
    Discover[Discovery & trigger routing]
    Verify[Signature & hash verify]
    Project[Projection]
    Readiness[Readiness self-check]
    SDK[Capability SDK bridge]
    Bridge[Host Bridge v1]
    Policy[Policy / permission]
    Health[Health monitoring]
  end

  subgraph Runtime[App runtime package]
    UI[dist/ui]
    Worker[dist/worker]
    Workflow[workflows/]
    Storage[(storage namespace)]
    Artifacts[artifacts/ + evidence]
  end

  Catalog --> Discover
  Release --> Verify
  Tenant --> Policy
  Reg --> Policy

  APPMD --> Discover
  LAYERED --> Project
  SKILLS --> SDK
  EVALS --> Readiness
  EVALS --> Health
  SIG --> Verify
  I18N --> SDK

  Verify --> Project
  Project --> Readiness
  Readiness --> SDK
  SDK --> Bridge
  SDK --> Policy
  Bridge --> UI
  SDK --> Worker
  SDK --> Workflow
  SDK --> Storage
  SDK --> Artifacts
  Health --> Readiness
```

## 2. Responsibility matrix

| Layer | Owns | Does not own |
| --- | --- | --- |
| Cloud / Registry | catalog, release metadata, tenant enablement, registration, license, ToolHub metadata | app execution, UI rendering, local storage |
| Host runtime | discovery, signature verify, projection, readiness, SDK injection, Host Bridge, policy, cleanup | business logic, customer data, vertical rules |
| App runtime | UI, workers, workflows, storage business code, artifact, evidence write-back | model / tool / credential / permission scheduling (must go through the SDK) |
| Standard (agentapp) | manifest schema, reference CLI, SDK contract, best practices | concrete host or app implementations |

## 3. Install and launch sequence

End-to-end flow from Cloud bootstrap → local download → verify → projection → readiness → launch.

```mermaid
sequenceDiagram
  autonumber
  participant User
  participant Cloud as Cloud catalog
  participant Host as Lime Desktop
  participant Pkg as App package
  participant SDK as Capability SDK
  participant App as App UI

  User->>Cloud: Browse or request app (with keywords)
  Cloud-->>Host: bootstrap payload + triggers
  User->>Host: Choose to install
  Host->>Pkg: Download package
  Host->>Host: Verify packageHash + sigstore + revocation
  Host->>Pkg: Parse APP.md + app.*.yaml + evals/*.yaml
  Host->>Host: Build projection (with provenance)
  Host->>Host: Run evals/readiness.yaml three-tier check
  alt Required checks fail
    Host-->>User: Show needs-setup + setupActions
    User->>Host: Complete setup (bind knowledge / grant permission / set secret)
    Host->>Host: Re-run readiness
  end
  User->>Host: Launch quickstart.entry
  Host->>SDK: Inject capability handles
  Host->>App: Initialize UI (iframe / native)
  App->>Host: app:ready
  Host-->>App: host:snapshot (theme / locale / entry context)
  App->>SDK: capability:invoke (business call)
  SDK-->>App: host:response or host:error
```

## 4. Readiness flow

`evals/readiness.yaml` runs three tiers (required / recommended / performance) and produces five states.

```mermaid
flowchart TD
  Start([App launch request]) --> Required{required all pass?}
  Required -- No --> Blocker{any blocker?}
  Blocker -- Yes --> Blocked[blocked<br/>list blockers + setupActions]
  Blocker -- No --> NeedsSetup[needs-setup<br/>list setupActions]
  Required -- Yes --> Recommended{recommended all pass?}
  Recommended -- No --> Degraded[ready-degraded<br/>list warnings]
  Recommended -- Yes --> Performance{performance ok?}
  Performance -- No --> Degraded
  Performance -- Yes --> Ready[ready<br/>allow launch]
  Blocked --> SetupFlow{user completes setup?}
  NeedsSetup --> SetupFlow
  SetupFlow -- Yes --> Required
  SetupFlow -- No --> Stop([abort launch])
  Degraded --> Launch[launch with warnings]
  Ready --> Launch
```

## 5. Host Bridge v1 sequence

App UI and Host exchange events through `lime.agentApp.bridge`; all capability calls go through `capability:invoke` and the host decides allow or deny.

```mermaid
sequenceDiagram
  autonumber
  participant App as App iframe
  participant Bridge as Host Bridge v1
  participant Policy as Policy / readiness
  participant Cap as Capability handler

  App->>Bridge: app:ready
  Bridge-->>App: host:snapshot (theme / locale / entry context / capability summary)
  Note over App,Bridge: Theme or locale change
  Bridge-->>App: theme:update
  Note over App,Bridge: Business call
  App->>Bridge: capability:invoke (capability, method, args, requestId)
  Bridge->>Policy: Check allowlist / readiness / policy
  alt Allowed
    Policy-->>Bridge: Pass
    Bridge->>Cap: Route to capability handler
    Cap-->>Bridge: Result + traceId + evidenceId
    Bridge-->>App: host:response (requestId, value)
  else Denied
    Policy-->>Bridge: Deny (error code)
    Bridge-->>App: host:error (requestId, code, message)
  end
  Note over App,Bridge: Surface hidden
  Bridge-->>App: host:visibility { visible: false }
```

## 6. Capability invocation topology

`capability:invoke` requests are routed to capability handlers; each capability has its own permission, policy, and evidence boundary.

```mermaid
flowchart LR
  AppUI[App UI / Worker] -->|capability:invoke| Bridge[Host Bridge v1]
  Bridge --> Allow{Allowlist + Readiness + Policy}
  Allow -- Deny --> Err[host:error stable code]
  Allow -- Allow --> Router[Capability router]
  Router --> UI[lime.ui]
  Router --> Storage[(lime.storage)]
  Router --> Files[lime.files]
  Router --> Agent[lime.agent]
  Router --> Knowledge[(lime.knowledge)]
  Router --> Tools[lime.tools]
  Router --> Artifacts[(lime.artifacts)]
  Router --> Workflow[lime.workflow]
  Router --> Evidence[(lime.evidence)]
  Router --> Secrets[(lime.secrets)]
  Storage --> Evidence
  Agent --> Evidence
  Tools --> Evidence
  Artifacts --> Evidence
```

## 7. Workflow state machine example

v0.5 workflow descriptors keep the v0.3 state machine and add a mermaid diagram and unified recovery policy. The example below is the Content Factory `content_scenario_planning` workflow.

```mermaid
stateDiagram-v2
  [*] --> input_topic
  input_topic: user-input
  input_topic --> analyze_topic
  analyze_topic: agent-task<br/>entry=content_ideation<br/>timeout=60s
  analyze_topic --> generate_scenarios
  analyze_topic --> show_error_and_retry: onError
  generate_scenarios: agent-task
  generate_scenarios --> human_review
  human_review: human-review
  human_review --> save_calendar: approve
  human_review --> generate_scenarios: modify
  human_review --> input_topic: reject
  save_calendar: storage-write
  save_calendar --> create_artifact
  create_artifact: artifact-create
  create_artifact --> [*]
  show_error_and_retry --> analyze_topic
```

## 8. Package file dependency

`APP.md` is the discovery entry; layered files are loaded by file-name convention and form the projection input together.

```mermaid
flowchart LR
  APPMD[APP.md frontmatter] --> Discover
  APPMD --> Sections[Body sections<br/>When to Use / Red Flags / Verification]
  Sections --> Onboarding[First-launch onboarding]

  APPMD --> Capabilities[app.capabilities.yaml]
  APPMD --> Entries[app.entries.yaml]
  APPMD --> Permissions[app.permissions.yaml]
  APPMD --> Errors[app.errors.yaml]
  APPMD --> I18N[app.i18n.yaml]
  APPMD --> Sig[app.signature.yaml]

  Capabilities --> Project[Projection]
  Entries --> Project
  Permissions --> Project
  Errors --> Project
  I18N --> Project
  Sig --> Verify[Signature & revocation]

  APPMD --> Readiness[evals/readiness.yaml]
  APPMD --> Health[evals/health.yaml]
  Readiness --> ReadyCheck[Readiness self-check]
  Health --> HealthCheck[Health monitoring]

  APPMD --> Skills[skills/<name>/SKILL.md]
  Skills --> AgentRT[lime.agent runtime]

  APPMD --> Locales[locales/*.json]
  Locales --> I18N
```

## 9. Upgrade and rollback

v0.4 / v0.3 manifests continue to work in v0.5 hosts; the reference CLI provides `migrate-check` / `migrate-generate`.

```mermaid
flowchart LR
  v03[v0.3 manifest] -->|host reads directly| v05Host[v0.5 host]
  v04[v0.4 manifest] -->|host reads directly| v05Host
  v03 -->|migrate-check / migrate-generate| v05[v0.5 manifest]
  v04 -->|migrate-check / migrate-generate| v05
  v05 --> v05Host
  v05Host -. failure .-> Rollback[Rollback to previous version]
  Rollback --> v04
  Rollback --> v03
```

## 10. Further reading

- [Specification](./specification): rules, fields, and constraints.
- [Quickstart](./authoring/quickstart): build a v0.5 package from scratch.
- [Runtime model](./client-implementation/runtime-model): host implementation detail.
- [Capability SDK](./client-implementation/capability-sdk): stable capability call contract.
- [v0.5 snapshot](./versions/v0.5/overview): pinned version notes.
