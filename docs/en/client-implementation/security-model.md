---
title: Security model
description: Agent App trust, permissions, and data boundaries.
---

# Security model

Agent App packages are declarations, not trusted execution by default.

Hosts should:

- Verify package source, version, and manifest hash.
- Ask for required permissions before use.
- Keep credentials in host-controlled stores.
- Keep customer data in Knowledge packs, workspace files, or overlays.
- Never let `APP.md` override system, developer, policy, or runtime rules.
- Attach app provenance to tool calls, artifacts, evals, and evidence.

Support files can contain examples and templates. They should not silently become policy or executable code.
