---
title: Readiness and evals
description: How app authors define setup checks and quality gates before an Agent App runs.
---

# Readiness and evals

Readiness and evals answer different questions.

- Readiness asks whether the app can run safely now.
- Evals ask whether the output is good enough to trust, publish, export, or hand off.

A valid app can be not ready. A ready app can still produce an output that fails evals.

## Readiness inputs

Readiness should inspect the manifest, package, host profile, workspace setup, tenant policy, and optional user choices.

| Area | Example check |
| --- | --- |
| Host runtime | Does the host satisfy `appRuntime` and SDK version ranges? |
| Capabilities | Are `lime.ui`, `lime.storage`, `lime.agent`, and other required capabilities available? |
| Runtime package | Do UI, worker, storage schema, and workflow paths exist? |
| Permissions | Are required permission scopes declared and resolvable? |
| Knowledge | Are required Knowledge templates bound? |
| Skills | Are required Skills installed or bundled? |
| Tools | Are required tools available and authorized? |
| Artifacts | Can the host create or view declared artifact types? |
| Evals | Are required evals installed or implementable by the host? |
| Secrets | Are required secret slots bound? |

## Readiness statuses

Use stable statuses so hosts can build UI around them.

| Status | Meaning |
| --- | --- |
| `ready` | The app can run the selected entry. |
| `needs-setup` | The user or admin must bind Knowledge, Tools, permissions, or secrets. |
| `degraded` | The app can run with optional features disabled. |
| `blocked` | Policy, compatibility, or missing required capability prevents execution. |
| `failed` | The package or manifest is invalid. |

## Actionable findings

A readiness finding should include severity, kind, key, message, and remediation.

```json
{
  "severity": "warning",
  "kind": "knowledge",
  "key": "project_knowledge",
  "required": true,
  "message": "Bind project_knowledge before running content_factory.",
  "remediation": "Choose or create a brand-product Knowledge Pack."
}
```

Opaque errors lead users to uninstall apps. Actionable findings lead users to finish setup.

## Eval types

Evals are quality gates. They can be automatic, human-reviewed, or hybrid.

| Eval | Use |
| --- | --- |
| Fact grounding | Verify claims link to Knowledge or sources. |
| Policy compliance | Check support, legal, security, or brand rules. |
| Tone fit | Compare output against approved voice or style. |
| Completeness | Ensure required sections or fields exist. |
| Artifact validity | Validate table schema, JSON, deck, report, or code. |
| Human review | Require approval before export or publish. |

## Declaring evals

```yaml
evals:
  - key: fact_grounding
    kind: quality
    evidenceRequired: true
    required: true
  - key: publish_readiness
    kind: human-review
    required: false
```

If an eval affects trust, it should link to Evidence. The user should be able to inspect why an output passed or failed.

## Connecting evals to artifacts

Evals should not be generic global prompts. Attach them to entries or artifact types when possible.

```yaml
artifactTypes:
  - key: content_table
    standard: agentartifact
    required: true
evals:
  - key: fact_grounding
    appliesTo: [content_table]
    evidenceRequired: true
```

This lets hosts show quality state on the artifact itself.

## Author checklist

- Required setup appears in readiness, not only prose.
- Optional requirements define degraded behavior.
- Evals are connected to entries or artifacts.
- Trust-sensitive evals record Evidence.
- Human review gates are explicit.
- Readiness can be run without executing agent tasks.
- Eval failures do not erase artifacts; they mark them as not accepted.
