---
title: v0.6 Changelog
description: Key v0.6 changes.
---

# v0.6 Changelog

- Adds `app.runtime.yaml` as the recommended layered config for the Agent task runtime control plane.
- Standardizes the `lime.agent-task-event.v1` event envelope for init, compact boundary, progress, tool call, approval, artifact, evidence, and result events.
- Standardizes final result subtypes for success, max turns, execution error, budget limit, structured output retry exhaustion, permission denial, and cancellation.
- Recommends `expectedOutput.outputFormat.type=json_schema` with validation retry semantics.
- Introduces Runtime Approval with `allow / deny / defer / updatedInput / remember / interrupt` decisions.
- Introduces `sessionPolicy` for `new / resume / continue / fork` and compact boundary events.
- Introduces `checkpointScope` for workflow, storage, artifact, file, conversation, and external side-effect recovery boundaries.
- Introduces on-demand `toolDiscovery` and selected-only schema loading.
- Introduces observability mapping from runtime profile events to OpenTelemetry spans with content export disabled by default.
- Updates the reference CLI to 0.6.0: `validate --version 0.6`, `migrate-check`, and `migrate-generate` understand v0.6 runtime contract recommendations.
- Backward compatible: v0.5 manifests remain valid.
