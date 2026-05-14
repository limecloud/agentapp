---
title: Readiness and evals
description: Check whether an Agent App is safe and useful before running.
---

# Readiness and evals

Readiness is a static host-side check before execution. It answers whether required Skills, Knowledge slots, Tools, permissions, Artifacts, and Evals are available.

Evals are app-specific quality gates. They should reference Agent Evidence and Agent Artifact when possible.

Examples:

- Required personal IP Knowledge pack is missing.
- Tool permission for competitor research is not granted.
- Artifact contract for `article_draft` is unsupported.
- Publish readiness eval is warning-only or blocking.

The reference CLI performs static readiness only. It does not call a model or run an agent.
