---
title: v0.7 Specification Snapshot
description: v0.7 adds requirement boundaries, Host/Cloud execution planes, integrations, and capability handoff.
---

# v0.7 Specification Snapshot

v0.7 inherits the [v0.6 specification](../v0.6/specification) and adds Requirement Boundary & Capability Handoff. See the [latest specification](../../specification) for the complete current contract.

## Incremental requirements

1. Product-level apps should declare business requirements, MVP scope, non-goals, and acceptance criteria.
2. Each requirement should map to App, Host, Cloud, connector, external system, and human planes.
3. Apps declare integration intent only; Host/Cloud owns connector auth, execution, credentials, policy, audit, and evidence.
4. MCP, CLI, tools, browser automation, and other execution surfaces must be mediated by Host or Cloud capabilities.
5. External writes, publish, delete, and bulk update operations must declare approval, dry-run, idempotency, and evidence policy.
6. App Fit Reports should map natural-language requirements into delivery boundaries before implementation.

## New layered files

```text
app.requirements.yaml
app.boundary.yaml
app.integrations.yaml
app.operations.yaml
```

## Forbidden patterns

- Do not put customer-private information into public examples or standard documents.
- Do not hard-code vendor-specific business adaptation into the AgentApp standard.
- Do not let apps store plaintext external credentials.
- Do not let apps directly start MCP servers, CLIs, or tool runtimes.
- Do not auto-execute high-risk external side effects by default.
