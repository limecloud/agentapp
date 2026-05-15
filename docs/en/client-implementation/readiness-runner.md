---
title: Readiness runner
description: Host algorithm for producing actionable setup status before Agent App execution.
---

# Readiness runner

The readiness runner protects the user and the host from failed or unsafe runs. It examines an installed app, host profile, policy, and workspace setup, then produces a status and setup tasks.

It must not execute agent tasks, app workers, tools, or UI bundle code.

## Inputs

- normalized manifest
- projection output
- host capability profile
- installed Skill catalog
- available Knowledge bindings
- ToolHub availability
- Artifact and Eval support
- policy decisions
- secret binding state
- selected workspace

## Output shape

```json
{
  "ok": true,
  "status": "needs-setup",
  "app": "content-factory-app",
  "checks": [
    {
      "severity": "warning",
      "kind": "knowledge",
      "key": "project_knowledge",
      "required": true,
      "message": "Bind project_knowledge before running."
    }
  ]
}
```

The output should be stable enough for UI, CLI, tests, and support tools.

## Check categories

| Category | Examples |
| --- | --- |
| Compatibility | host runtime, SDK, manifest version. |
| Capability | `lime.ui`, `lime.storage`, `lime.agent`, `lime.tools`. |
| Package | referenced paths, hashes, signatures. |
| Storage | namespace, schema, migrations, retention. |
| Permissions | install review, runtime ask, policy denial. |
| Knowledge | required templates bound or missing. |
| Skills | required Skill packages installed or missing. |
| Tools | ToolHub availability and tenant authorization. |
| Artifacts | artifact type support and viewer availability. |
| Evals | quality gates and human review requirements. |
| Secrets | secret slots bound or pending. |

## Status decision

A simple decision rule:

```text
any error -> failed or blocked
any required missing setup -> needs-setup
only optional missing setup -> degraded or ready with warnings
all checks pass -> ready
```

Hosts may use more detailed states, but the user should always know what action to take.

## Remediation

Every blocking or warning check should map to a remediation:

- install a Skill
- bind a Knowledge Pack
- enable a ToolHub connector
- grant a permission
- bind a secret
- upgrade host runtime
- choose a compatible app release
- disable an optional entry

## Entry-specific readiness

Readiness can be global or entry-specific. Entry-specific readiness is more useful for large apps.

Example: a dashboard page may be ready while a publish workflow is blocked by a missing export credential.

```json
{
  "entryKey": "content_calendar",
  "status": "needs-setup",
  "missing": ["publishing_workspace_token"]
}
```

## Caching

Cache readiness only when inputs are unchanged. Invalidate when:

- host capability profile changes
- Knowledge bindings change
- tool availability changes
- permissions change
- secrets are added or removed
- app package or manifest hash changes
- overlays change

## Checklist

- Does not execute app code.
- Produces machine-readable checks.
- Separates required and optional gaps.
- Supports global and entry-specific views.
- Provides remediation text.
- Can be run by CLI and UI.
- Includes enough detail for support without leaking secrets.
