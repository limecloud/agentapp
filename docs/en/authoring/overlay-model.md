---
title: Overlay model
description: How user, tenant, and workspace overlays customize an Agent App.
---

# Overlay model

Agent Apps should be reusable. Customer-specific knowledge, credentials, entry ordering, banned words, brand voice, model choices, and budget policy should live in overlays instead of forks of the official package.

Precedence:

```text
Workspace Override > User Overlay > Tenant Overlay > App Default > Host Default
```

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

Overlays may override:

- Agent Knowledge bindings and default retrieval policy.
- Tool credential references, default models, and budget limits.
- UI ordering, disabled entries, and default workflow parameters.
- Eval thresholds, human review requirements, banned words, and industry rules.

Overlays must not modify the official package hash, contain plaintext secrets, or bypass readiness, permission, or policy.
