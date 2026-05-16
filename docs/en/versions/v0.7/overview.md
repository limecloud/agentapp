---
title: v0.7 Overview
description: v0.7 standardizes requirement boundaries, Host/Cloud execution planes, external integrations, and capability handoff.
---

# v0.7 Overview

v0.7 is about **Requirement Boundary & Capability Handoff**. Given a real business requirement, an Agent App must explain what the App owns, what requires Lime Host, what requires Lime Cloud, what belongs to connectors, what remains in external systems, and what needs human decisions.

v0.7 does not encode a single customer, industry, or vendor into the standard. It standardizes the repeated delivery questions: requirement mapping, responsibility boundaries, integrations, side effects, acceptance criteria, MVP scope, and non-goals.

## Core changes

- **`app.requirements.yaml`**: business requirements, MVP scope, non-goals, later phases, and acceptance criteria.
- **`app.boundary.yaml`**: requirement-to-plane mapping across App / Host / Cloud / connector / external system / human.
- **`app.integrations.yaml`**: required external systems, CLI, MCP, API, webhook, or browser adapters, executed by Host/Cloud.
- **`app.operations.yaml`**: operation side effects, approval, dry-run, idempotency, and evidence requirements.
- **App Fit Report**: a pre-implementation report for mapping natural-language requirements into delivery planes.
- **Host/Cloud planes**: Host owns local AgentRuntime, MCP, CLI, tools, files, sandbox, and user confirmation. Cloud owns registries, tenant policy, OAuth broker, webhook, scheduled sync, and team governance.

## Architecture

```mermaid
flowchart LR
  Req[Business requirement] --> App[Agent App\nUX / workflow / artifacts]
  App --> Host[Lime Host\nLocal execution / Agent / MCP / CLI / Tools / Policy]
  App --> Cloud[Lime Cloud\nRegistry / Tenant policy / OAuth / Webhook / Sync]
  Host --> Connector[Connector / Tool Adapter\nCLI / MCP / API / Browser]
  Cloud --> Connector
  Connector --> External[External System\nDocs / Tables / Drives / Publishing / CRM]
  App --> Human[Human Decision\nReview / Publish / High-risk approval]
  External --> App
  Human --> App
```

## Sequence

```mermaid
sequenceDiagram
  autonumber
  participant Planner as AI / Planner
  participant Spec as AgentApp v0.7
  participant App as Agent App
  participant Host as Lime Host
  participant Cloud as Lime Cloud
  participant Conn as Connector
  participant Ext as External System
  participant User as Human

  Planner->>Spec: Provide sanitized business requirement
  Spec-->>Planner: Generate App Fit Report
  Planner->>App: Author requirements / boundary / integrations / operations
  App->>Host: Install and request capability profile
  Host->>Cloud: Query app and connector registry / tenant policy
  Cloud-->>Host: Return allowed connectors, policies, and auth state
  Host-->>App: readiness: ready / needs-setup / blocked
  App-->>User: Show missing connections, permissions, and setup
  User->>Host: Authorize connector or confirm risky action
  Host->>Conn: Controlled CLI / MCP / API / tool invocation
  Conn->>Ext: Read or write external source of truth
  Ext-->>Conn: Structured result
  Conn-->>Host: Result, logs, side-effect status
  Host-->>App: Result + evidence refs
  App-->>User: Show artifact, status, and next step
```

## Flow

```mermaid
flowchart TD
  Start([Business requirement]) --> Extract[Extract requirement items]
  Extract --> Classify[Classify with v0.7\nAPP / HOST / CLOUD / CONNECTOR / EXTERNAL / HUMAN]
  Classify --> Fit{Good Agent App fit?}
  Fit -- No --> Reject[Explain mismatch\nand recommend external system or manual flow]
  Fit -- Yes --> MVP[Define MVP / non-goals / later phases]
  MVP --> Boundary[Write app.boundary.yaml]
  Boundary --> Integrations[Write app.integrations.yaml]
  Integrations --> Operations[Write app.operations.yaml]
  Operations --> Readiness{Host/Cloud/Connector ready?}
  Readiness -- No --> Setup[Connect, authorize, install tools, or enable cloud service]
  Setup --> Readiness
  Readiness -- Yes --> Run[Run app workflow]
  Run --> Review{High-risk side effect?}
  Review -- Yes --> Human[Human review / confirmation / publish]
  Review -- No --> Save[Save artifact and evidence]
  Human --> Save
  Save --> Done([Accepted delivery])
```

## Compatibility

- v0.6 apps remain valid in v0.7 hosts.
- v0.7 does not replace `app.runtime.yaml`; it adds requirement boundaries and capability handoff above the runtime control plane.
- Non-core vendor adapters should be installed as connector packages, MCP servers, CLI adapters, browser adapters, or customer overlays, not merged into Lime Core.
