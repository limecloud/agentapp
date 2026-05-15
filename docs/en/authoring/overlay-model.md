---
title: Overlay model
description: How user, tenant, and workspace overlays customize an Agent App without forking the package.
---

# Overlay model

Agent Apps should be reusable. Customer-specific knowledge, credentials, entry ordering, banned words, brand voice, model choices, and budget policy should live in overlays instead of forks of the official package.

An overlay is configuration outside the package hash. It changes how a package is resolved in a tenant, workspace, user, or customer context without modifying the official release.

## Precedence

Recommended resolution order:

```text
Host Default
  -> App Default
  -> Tenant Overlay
  -> Workspace Overlay
  -> User Overlay
  -> Runtime Input
```

Some values can be locked by higher-level policy. For example, a tenant can prevent users from overriding model cost limits.

## v0.3 overlay template

Apps may declare configurable slots:

```yaml
overlayTemplates:
  - key: tenant_defaults
    scope: tenant
    required: false
  - key: workspace_content_rules
    scope: workspace
    required: false
```

The template describes what can be configured. The actual overlay values are stored by the host or control plane.

## What overlays may override

- Agent Knowledge bindings and retrieval defaults.
- Tool availability and tool credential references.
- Default models, cost limits, and fallback behavior.
- UI ordering, disabled entries, and featured entries.
- Workflow defaults such as batch size, retry policy, and human review requirement.
- Eval thresholds, banned words, industry rules, and publish gates.
- Artifact export defaults and retention policy.

## What overlays must not do

- Modify package files or package hash.
- Store plaintext secrets.
- Bypass readiness, permission, or policy checks.
- Grant capabilities not declared by the app or allowed by the host.
- Hide provenance from users or auditors.
- Overwrite user data during package upgrade.

## Resolved configuration

A host should keep both resolved values and provenance:

```json
{
  "key": "default_model",
  "value": "gpt-5.2",
  "source": "tenant",
  "lockedByPolicy": true
}
```

This makes support possible. If a workflow uses an unexpected model, the user can see whether it came from app default, tenant overlay, workspace setting, or runtime input.

## Overlay and readiness

Overlay changes can affect readiness. Examples:

- Binding `project_knowledge` can make a workflow ready.
- Disabling an optional Tool can downgrade an entry.
- Changing eval threshold can block publish workflow until review.
- Removing a secret binding can make export unavailable.

Hosts should re-run readiness when overlays change.

## Upgrade behavior

When an app upgrades, overlays stay outside the package. The host should compare overlay templates and report:

- new configurable slots
- removed slots
- changed defaults
- invalid overlay values
- policy locks that now conflict with app requirements

## Author checklist

- Declare overlay templates for expected customization.
- Keep private data outside package defaults.
- Use stable overlay keys.
- Document which overlays affect readiness.
- Do not use overlays as a hidden permission bypass.
- Provide safe defaults for users without tenant overlays.
