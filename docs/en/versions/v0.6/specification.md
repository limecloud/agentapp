---
title: v0.6 Specification Snapshot
description: v0.6 adds the Agent task runtime control plane on top of v0.5.
---

# v0.6 Specification Snapshot

v0.6 inherits the [v0.5 specification](../v0.5/specification) and adds the Agent task runtime control plane. See the [latest specification](../../specification) for the complete current contract.

## Incremental requirements

1. Apps that use `lime.agent` should provide `app.runtime.yaml` or an equivalent `agentRuntime` manifest field.
2. Hosts should project `lime.agent` execution as `lime.agent-task-event.v1` events.
3. Final results must include stable subtypes instead of natural-language status only.
4. Structured output should use JSON Schema and be validated before artifact / storage write-back.
5. Tool approval, user questions, and elicitation should use Runtime Approval.
6. `sessionPolicy` must distinguish Agent sessions from business state.
7. `checkpointScope` must declare what is restorable and what is evidence-only.
8. Large tool sets should use on-demand tool discovery instead of injecting every schema.
9. Runtime profile events should map to OpenTelemetry with content export disabled by default.

## Forbidden patterns

- Do not declare `bypassPermissions` in Agent App manifests.
- Do not let apps bypass the host to call models, MCP, ToolHub, filesystems, or secrets.
- Do not treat a natural-language summary as a successful structured patch.
- Do not collapse Agent session, workflow checkpoint, app storage, and external side effects into one rollback semantic.
