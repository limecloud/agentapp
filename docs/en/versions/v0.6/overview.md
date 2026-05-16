---
title: v0.6 Overview
description: "Standardizes the Agent task runtime control plane: event streams, structured output, approval, sessions, tool discovery, checkpoints, and observability."
---

# v0.6 Overview

v0.6 builds on the v0.5 layered manifest and standardizes the `lime.agent` task runtime control plane. It does not introduce a new AgentRuntime and does not require apps to embed a model SDK. Apps still call host capabilities through the Lime Capability SDK, while the host / AgentRuntime remains responsible for permissions, policy, tools, secrets, evidence, model routing, and telemetry.

## Core changes

- **`app.runtime.yaml`**: recommended layered file for Agent task event/result, structured output, runtime approval, session, tool discovery, checkpoint scope, and observability policies.
- **Agent task event stream**: standardizes `lime.agent-task-event.v1` with stable `appId / taskId / traceId / sessionId / sequence / refs / usage / cost` fields.
- **Final result subtypes**: standardizes `success / error_max_turns / error_during_execution / error_max_budget / error_max_structured_output_retries / error_permission_denied / cancelled`.
- **Structured output contract**: recommends `expectedOutput.outputFormat.type=json_schema`, validation retries, and explicit failure subtype.
- **Runtime approval**: unifies tool approval, user questions, and elicitation with `allow / deny / defer / updatedInput / remember` decisions.
- **Session policy**: distinguishes `new / resume / continue / fork`; session is conversation history, not business state.
- **Checkpoint scope**: separates workflow state, app storage, artifacts, tracked files, conversation, and external side effects.
- **Tool discovery**: recommends on-demand discovery and selected-only schema loading.
- **Observability mapping**: maps runtime profile events to OpenTelemetry spans without exporting sensitive content by default.

## Compatibility

- v0.5 apps remain valid in v0.6 hosts.
- `app.runtime.yaml` is recommended for v0.6; product-level apps using `lime.agent` should add it first.
- v0.6 does not replace v0.5 layered manifests, signing, i18n, readiness, errors, or health checks.
- v0.6 explicitly forbids `bypassPermissions` in app manifests.
