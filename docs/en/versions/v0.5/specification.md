---
title: v0.5 specification snapshot
description: v0.5 adds layered manifest, AI auto-discovery triggers, bundled Skills, readiness self-check, standardized errors, signing, i18n, and runtime health on top of v0.4.
---

# v0.5 specification snapshot

v0.5 does not rewrite the v0.3 / v0.4 package contract; it adds layered configuration and authoring conventions. Read the [latest specification](../../specification) for the full text.

## v0.5 delta at a glance

- Package shape adds `app.*.yaml` layered files, `evals/readiness.yaml`, `evals/health.yaml`, `skills/` bundled Agent Skills, `locales/` translation files.
- Recommended frontmatter fields gain `triggers` and `quickstart`; `skills` partially replaces `skillRefs` for bundled cases.
- Readiness states extended to `ready / ready-degraded / needs-setup / blocked / unknown`, with `tiers`, `setupActions`, `blockers`, `warnings` in result envelopes.
- Workflow descriptors gain `overview`, `diagram` (mermaid), `recovery` (`onTimeout` / `onError` / `maxRetries` / `saveCheckpoint`).
- APP.md body conventions: When to Use / Not Suitable For / Workflow / Quickstart / Red Flags / Verification Checklist / Troubleshooting.

## Layered files

| File | Purpose |
| --- | --- |
| `app.capabilities.yaml` | Detailed capability, entry, route, panel, command config |
| `app.entries.yaml` | Detailed entry config (permissions / requiredCapabilities / quickActions / titleI18n) |
| `app.permissions.yaml` | Permission requests, scope, policy hints, reasonI18n, consentPrompt |
| `app.errors.yaml` | Standardized error codes, recovery, userAction, retryable, maxRetries |
| `app.i18n.yaml` | defaultLocale, supportedLocales, translations, fallback |
| `app.signature.yaml` | sigstore signature, trust chain, revocation check |
| `evals/readiness.yaml` | Three-tier required / recommended / performance self-check |
| `evals/health.yaml` | startup / runtime / metrics runtime health |

## Reference CLI 0.5.0

```bash
agentapp-ref validate ./my-app --version 0.5
agentapp-ref project ./my-app
agentapp-ref readiness ./my-app --workspace ./workspace
agentapp-ref migrate-check ./my-app
agentapp-ref migrate-generate ./my-app --target 0.5.0
```

## Compatibility

- v0.4 / v0.3 manifests continue to work in v0.5 hosts.
- New fields are optional except in `manifestVersion: 0.5.0`.
- Reference CLI provides `migrate-check` and `migrate-generate` to ease the transition.

For the complete normative text, see the [latest specification](../../specification).
