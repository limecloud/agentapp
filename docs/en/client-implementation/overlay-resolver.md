---
title: Overlay resolver
---

# Overlay resolver

The resolver applies Host Default, App Default, Tenant Overlay, User Overlay, and Workspace Override in order. It should output both resolved values and provenance so users can see whether a model, tool, or knowledge binding came from app default or customer overlay.

## Checklist

- Keep declarations machine-readable.
- Keep procedures in Agent Skills.
- Keep facts in Agent Knowledge.
- Keep execution in the host runtime.
- Attach app provenance to projected objects.
