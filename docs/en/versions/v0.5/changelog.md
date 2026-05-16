---
title: v0.5 changelog
description: Key changes in v0.5.
---

# v0.5 changelog

- Inspired by the [Agent Skills standard](https://agentskills.io), introduces a layered manifest: `APP.md` stays small while detailed configuration moves into independent files (`app.capabilities.yaml`, `app.entries.yaml`, `app.permissions.yaml`, `app.errors.yaml`, `app.i18n.yaml`, `app.signature.yaml`, `evals/readiness.yaml`, `evals/health.yaml`).
- Adds `triggers` field (keywords + scenarios) for AI auto-discovery and routing.
- Adds `quickstart` field for first-launch entry and sample workflow guidance.
- Standardizes the `skills/` directory for bundled Agent Skills, with `auto / on-demand / manual` activation modes.
- Introduces `evals/readiness.yaml` self-check model with `required / recommended / performance` tiers; readiness state extended to `ready / ready-degraded / needs-setup / blocked / unknown`.
- Standardizes error codes via `app.errors.yaml` with stable codes, recovery, userAction, retryable, maxRetries.
- Strengthens package signing via `app.signature.yaml` with sigstore signature reference, trust chain, and revocation check.
- Adds `app.i18n.yaml` for first-class i18n: default locale, supported locales, translation files, fallback strategy.
- Adds `evals/health.yaml` for runtime health (startup / runtime / metrics).
- Workflow descriptors gain mermaid diagrams, human-readable overview, and unified recovery policy.
- APP.md body conventions: When to Use, Not Suitable For, Red Flags, Verification Checklist, Troubleshooting.
- Reference CLI bumped to 0.5.0; new commands: `migrate-check`, `migrate-generate`. `validate` accepts `--version`.
- Backward compatible: v0.4 manifests remain valid; new fields are optional outside `manifestVersion: 0.5.0` opt-in.
