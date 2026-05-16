---
title: v0.5 overview
description: Layered manifest, AI auto-discovery triggers, bundled Skills, readiness self-check, standardized errors, signing, i18n, and runtime health, inspired by the Agent Skills standard.
---

# v0.5 overview

v0.5 adopts the discovery and authoring discipline of the [Agent Skills standard](https://agentskills.io), making the Agent App standard easier for AI clients to understand, easier for authors to write, and easier for hosts to implement.

## Key changes

- **Layered manifest**: `APP.md` keeps a small frontmatter; detailed configuration moves into independent YAML files (`app.capabilities.yaml`, `app.entries.yaml`, `app.permissions.yaml`, `app.errors.yaml`, `app.i18n.yaml`, `app.signature.yaml`, `evals/readiness.yaml`, `evals/health.yaml`).
- **AI auto-discovery**: new `triggers` (keywords / scenarios) and `quickstart` (entry / sampleWorkflow / setupSteps) fields.
- **Standardized Skills integration**: `skills/` directory hosts bundled Agent Skills (with SKILL.md); the manifest only declares activation strategy (auto / on-demand / manual).
- **Readiness self-check**: `evals/readiness.yaml` declarative model with `required / recommended / performance` tiers; states extended to `ready / ready-degraded / needs-setup / blocked / unknown`.
- **Stable error codes**: `app.errors.yaml` provides codes, recovery, retryable, maxRetries.
- **Signing and revocation**: `app.signature.yaml` provides sigstore signature reference, trust chain, and revocation check.
- **First-class i18n**: `app.i18n.yaml` + `locales/*.json`.
- **Runtime health**: `evals/health.yaml` (startup / runtime / metrics).
- **Workflow enhancements**: mermaid diagram, human-readable overview, unified recovery (`onTimeout` / `onError` / `maxRetries` / `saveCheckpoint`).
- **APP.md body conventions**: When to Use / Not Suitable For / Workflow / Quickstart / Red Flags / Verification Checklist / Troubleshooting.

## Why it matters

Manifest fields kept growing through v0.4, raising the authoring barrier. v0.5 returns the frontmatter to a minimal core and lets authors opt into detailed configuration on demand, while giving AI clients `triggers` for accurate request routing.

## Compatibility

- v0.4 / v0.3 manifests continue to work in v0.5 hosts.
- All new fields are optional except in `manifestVersion: 0.5.0` packages where the v0.5 conventions and readiness / errors / signature opt-in apply.
- Reference CLI provides `migrate-check` / `migrate-generate`.

## Mental model

```text
APP.md (small frontmatter + human-readable sections)
  ↳ triggers / quickstart                # AI auto-discovery
  ↳ app.capabilities.yaml                # detailed capabilities
  ↳ app.entries.yaml                     # detailed entries
  ↳ app.permissions.yaml                 # permissions and policy
  ↳ app.errors.yaml                      # stable error codes
  ↳ app.i18n.yaml + locales/*.json       # first-class i18n
  ↳ app.signature.yaml                   # signing and revocation
  ↳ evals/readiness.yaml                 # self-check
  ↳ evals/health.yaml                    # runtime health
  ↳ skills/<name>/SKILL.md               # bundled Agent Skills
```

## Architecture

v0.5 splits the standard, host, and runtime into three layers; the layered manifest and the Capability SDK are the stable boundaries.

```mermaid
flowchart TD
  subgraph Standard[Agent App v0.5 standard]
    APPMD[APP.md frontmatter + sections]
    LAYERED[app.*.yaml layered config]
    SKILLS[skills/ bundled Skills]
    EVALS[evals/ readiness + health]
    SIG[app.signature.yaml]
    I18N[app.i18n.yaml + locales]
  end

  subgraph Host[Host runtime]
    Discover[Discovery & trigger routing]
    Verify[Signature & hash verify]
    Project[Projection]
    Readiness[Readiness self-check]
    SDK[Capability SDK bridge]
    Bridge[Host Bridge v1]
    Health[Health monitoring]
  end

  subgraph Runtime[App runtime package]
    UI[dist/ui]
    Worker[dist/worker]
    Workflow[workflows/]
    Storage[(storage namespace)]
    Artifacts[artifacts/ + evidence]
  end

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
  Bridge --> UI
  SDK --> Worker
  SDK --> Workflow
  SDK --> Storage
  SDK --> Artifacts
  Health --> Readiness
```

## Install and launch sequence

A complete v0.5 install → launch flow with trigger routing, signature verification, readiness self-check, and Host Bridge injection:

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

## Readiness flow

`evals/readiness.yaml` splits checks into three tiers; the resulting state machine:

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

## Host Bridge sequence

App UI and Host exchange events through `lime.agentApp.bridge`; capability calls go through `capability:invoke`:

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

## Workflow state machine example

v0.5 workflow descriptors keep the v0.3 state machine and add a mermaid diagram and unified recovery policy:

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
