---
title: Overlay model
description: How user, tenant, and workspace overlays customize an Agent App.
---

# Overlay model

Agent Apps should be reusable. Customer-specific knowledge, credentials, scene ordering, and copy should live in overlays.

Precedence:

```text
Workspace Override > User Overlay > Tenant Overlay > App Default > Host Default
```

Typical overlay fields:

- Bound Agent Knowledge packs.
- Tool credential references.
- Default model and budget hints.
- Presentation copy and scene order.
- Eval thresholds and review requirements.
- Disabled entries or optional capabilities.

Official app packages should remain upgradeable without overwriting customer state.
