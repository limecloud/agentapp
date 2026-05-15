---
title: Overlay resolver
description: How hosts merge app defaults, tenant policy, workspace settings, and user choices.
---

# Overlay resolver

Overlays let an official app stay upgradeable while tenants, workspaces, and users customize behavior. They are the answer to customer-specific configuration without forking the app package.

## Overlay layers

A host should apply overlays in a predictable order:

```text
Host defaults
  -> App defaults
  -> Tenant overlay
  -> Workspace overlay
  -> User overlay
  -> Runtime entry input
```

Higher layers can override lower layers only when policy allows it.

## What overlays can configure

| Area | Examples |
| --- | --- |
| Knowledge bindings | Which Knowledge Pack satisfies `project_knowledge`. |
| Model defaults | Preferred model, cost cap, fallback model. |
| Tool availability | Enable or disable optional tools. |
| Entry visibility | Hide beta or high-risk entries for a tenant. |
| Eval thresholds | Required score for publish readiness. |
| Brand rules | Tone, banned phrases, review requirements. |
| Export defaults | File format, destination, retention. |
| Workflow settings | Human review required, batch size, retry policy. |

Overlays should not contain raw credentials; use secret handles.

## Overlay template declaration

Apps can declare configurable slots:

```yaml
overlayTemplates:
  - key: tenant_defaults
    scope: tenant
    required: false
  - key: workspace_content_rules
    scope: workspace
    required: false
```

The template tells the host what can be configured. The concrete overlay value is stored outside the package.

## Resolved value with provenance

The resolver should return both the resolved value and where it came from.

```json
{
  "key": "fact_grounding_threshold",
  "value": 0.86,
  "source": "workspace",
  "overrides": ["app", "tenant"],
  "lockedByPolicy": false
}
```

Provenance is important for debugging. Users need to know whether a setting came from app default, tenant policy, workspace admin, or their own preference.

## Conflict handling

Conflicts should be explicit.

| Conflict | Recommended behavior |
| --- | --- |
| User override violates tenant policy | Reject user override and show tenant policy reason. |
| Workspace chooses unavailable tool | Mark readiness `needs-setup` or `blocked`. |
| App upgrade removes an overlay key | Preserve old overlay as orphaned until admin review. |
| Two overlays bind the same required Knowledge slot | Apply precedence and show provenance. |

## Overlay and upgrades

App upgrades may change defaults, but they should not overwrite overlays. When a new release changes a template, the host should show a diff:

- new configurable keys
- removed keys
- keys with changed default
- keys that now require admin review
- overlays that no longer match schema

## Implementation checklist

- Resolve values deterministically.
- Return provenance for each resolved value.
- Keep overlays outside package hash.
- Validate overlays against declared templates.
- Do not expose plaintext secrets to app code.
- Re-run readiness when overlays change.
- Include overlay state in support diagnostics without leaking private data.
