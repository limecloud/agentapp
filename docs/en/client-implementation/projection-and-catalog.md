---
title: Projection and catalog
description: Compile APP.md into host-visible catalog entries.
---

# Projection and catalog

Projection is a deterministic host operation that turns app declarations into local catalog entries.

Projection output should include:

- App summary.
- Entries with `appName`, `appVersion`, and `manifestHash` provenance.
- Knowledge templates.
- Tool requirements.
- Artifact types.
- Eval rules.

For Lime, this projection maps naturally to `client/bootstrap` app summaries and `client/skills` entries. The projection does not execute an agent.
