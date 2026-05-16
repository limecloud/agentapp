---
title: Responsibility Boundary
description: v0.7 ownership across App, Host, Cloud, connectors, external systems, and human decisions.
---

# Responsibility Boundary

v0.7 asks a practical delivery question: not only “can AI help”, but “which plane should own each part of the requirement”. Agent App owns product experience and workflow orchestration. Lime Host, Lime Cloud, connectors, external systems, and human decisions own execution, governance, integration, source-of-truth state, and risk approval.

## Boundary overview

```mermaid
flowchart LR
  User[End user] --> App[Agent App\nUX / workflow / artifacts]
  App --> Host[Lime Host\nLocal execution / Agent / MCP / CLI / Tools / Policy]
  App --> Cloud[Lime Cloud\nRegistry / Tenant policy / OAuth / Webhook / Sync]
  Host --> Conn[Connector / Tool Adapter\nMCP / CLI / API / Browser]
  Cloud --> Conn
  Conn --> Ext[External System\nDocs / Tables / Drives / Publishing]
  App --> Human[Human Decision\nReview / Publish / Risk approval]
  Ext --> App
  Human --> App
```

## Ownership table

| Plane | Owns | Must not own |
| --- | --- | --- |
| Agent App | User experience, business workflow, app state, artifacts, review, acceptance rules | Credential hosting, direct MCP/CLI startup, bypassing host policy, direct external-system control |
| Lime Host | Local AgentRuntime, MCP, CLI, tools, files, sandbox, user confirmation, local evidence | Vertical business rules, customer-private workflow, hard-coded vendor-specific adapters |
| Lime Cloud | Registry, tenant policy, OAuth broker, webhook, scheduled sync, team governance | Default local agent execution, customer business implementation, non-core vendor logic |
| Connector / Tool Adapter | External protocol adaptation, field mapping, read/write actions, error translation | Product UX, final tenant-policy decision, plaintext credential storage |
| External System | Source-of-truth records, third-party state, publishing platform, existing business system | Agent App internal state, Lime permission model |
| Human | High-risk decisions, final review, publish confirmation, exception handling | Repetitive mechanical execution that is safe to automate |

## Decision flow

```mermaid
flowchart TD
  Need([Requirement]) --> UserValue{Needs a user-facing\noperational surface?}
  UserValue -- Yes --> App[App experience or workflow]
  UserValue -- No --> System{What kind of capability?}
  System -- Local execution --> Host[Host capability]
  System -- Tenant/team governance --> Cloud[Cloud capability]
  System -- External protocol --> Conn[Connector / Adapter]
  System -- External source of truth --> Ext[External System]
  App --> Risk{External write, publish, or delete?}
  Risk -- Yes --> Human[Human approval + evidence]
  Risk -- No --> Ready[Eligible for App MVP]
  Host --> Ready
  Cloud --> Ready
  Conn --> Ready
  Ext --> Ready
  Human --> Ready
```

## Rules

- Apps **must** declare external side effects, required connections, acceptance criteria, and non-goals before execution.
- Host / Cloud **must** own MCP, CLI, tools, credentials, policy, authorization, and evidence execution.
- Apps **must not** store plaintext third-party credentials.
- Apps **must not** directly start MCP servers, CLIs, or tool runtimes.
- Apps **must not** auto-execute publish, delete, or bulk-update operations by default.
- Non-core vendor adapters should be installed as connector packages, MCP servers, CLI adapters, browser adapters, or customer overlays.

