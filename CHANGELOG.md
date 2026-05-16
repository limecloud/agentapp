# Changelog

## 0.5.0

- Inspired by the [Agent Skills standard](https://agentskills.io), introduces a layered manifest model that simplifies `APP.md` frontmatter and moves detailed configuration into independent files (`app.capabilities.yaml`, `app.entries.yaml`, `app.permissions.yaml`, `app.errors.yaml`, `app.i18n.yaml`, `app.signature.yaml`).
- Adds `triggers` field with keywords and scenarios to improve AI auto-discovery accuracy.
- Adds `quickstart` field for first-launch entry and sample workflow guidance.
- Standardizes `skills/` directory for bundled and referenced Agent Skills, supporting `auto`, `on-demand`, and `manual` activation modes.
- Introduces `evals/readiness.yaml` self-check model with `required`, `recommended`, and `performance` checks; readiness state extended to `ready`, `ready-degraded`, `needs-setup`, `blocked`, `unknown`.
- Standardizes error codes via `app.errors.yaml` with stable codes, recovery strategies, retryability, and user-facing actions.
- Strengthens package signing with `app.signature.yaml` covering sigstore signature reference, trust chain, and revocation check.
- Adds `app.i18n.yaml` for first-class internationalization with default locale, supported locales, translation files, and fallback strategy.
- Adds `evals/health.yaml` for startup, runtime, and metric-based health checks.
- Improves workflow descriptors with mermaid diagrams, human-readable overviews, and recovery policies (`onTimeout`, `onError`, `maxRetries`, `saveCheckpoint`).
- Enhances `APP.md` body conventions with "When to Use", "Not Suitable For", "Red Flags", "Verification Checklist", and "Troubleshooting" sections.
- Reference CLI gains `migrate-check` and `migrate-generate` commands for v0.4 → v0.5 migration; `validate` accepts `--version` flag.
- Backward compatible: v0.4 manifests remain valid; new fields are optional except in `manifestVersion: 0.5.0` packages where lifecycle and readiness expectations apply.

## 0.4.0

- Documents Host Bridge v1 as the standard `lime.agentApp.bridge` runtime event protocol for sandboxed Agent App UI.
- Standardizes host-to-app theme, locale, visibility, response, and error events, plus app-to-host ready, snapshot, navigation, toast, download, external-open, and capability invocation requests.
- Clarifies that Host Bridge is a transport layer for `lime.ui` and the Capability SDK, not a private app protocol and not a bypass around readiness, permission, policy, or provenance.

## 0.3.0

- Promotes Agent App to an executable package standard with typed descriptors, typed SDK calls, overlays, readiness, evidence, and regression eval expectations.
- Tightens JSON schemas for entries, permissions, services, workflows, Knowledge templates, Skill refs, Tool refs, Artifact types, Evals, secrets, and overlay templates.
- Removes `scene` from current v0.3 entry kinds; legacy `scene` / `home` are now compatibility warnings and invalid for manifestVersion 0.3.
- Adds package-level provenance with `packageHash` in CLI projection output.
- Extends the reference CLI with entry-specific validation, product-level runtime package checks, executable permission checks, and overlay / secret readiness checks.
- Replaces the industry example with `内容工厂` / `content-factory-app` and keeps customer-specific facts out of the official package.

## 0.2.0

- Upgrades Agent App from a declarative composition package to a complete installable application package.
- Adds runtime package model for UI bundles, workers, storage schemas, migrations, workflows, artifacts, and policies.
- Adds Capability SDK contract for `lime.ui`, `lime.storage`, `lime.files`, `lime.agent`, `lime.knowledge`, `lime.tools`, `lime.artifacts`, `lime.workflow`, `lime.policy`, `lime.evidence`, and `lime.secrets`.
- Clarifies that Expert is an `expert-chat` entry, not Agent App itself.
- Extends manifest and JSON schemas with `requires`, `runtimePackage`, `ui`, `storage`, `services`, `events`, `secrets`, and `lifecycle`.
- Updates `agentapp-ref` projection output to include capability requirements, UI, storage, services, workflows, and permissions.
- Upgrades the content factory example to include UI, worker, storage, workflow, and expert entry fixtures.

## 0.1.0

- Initial Agent App draft standard.
- Defines `APP.md`, directory structure, manifest fields, app projection, overlays, readiness, and runtime boundaries.
- Adds bilingual VitePress documentation and `agentapp-ref` reference CLI.
