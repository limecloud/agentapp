# Changelog

## 0.3.0

- Promotes Agent App to an executable package standard with typed descriptors, typed SDK calls, overlays, readiness, evidence, and regression eval expectations.
- Tightens JSON schemas for entries, permissions, services, workflows, Knowledge templates, Skill refs, Tool refs, Artifact types, Evals, secrets, and overlay templates.
- Removes `scene` from current v0.3 entry kinds; legacy `scene` / `home` are now compatibility warnings and invalid for manifestVersion 0.3.
- Adds package-level provenance with `packageHash` in CLI projection output.
- Extends the reference CLI with entry-specific validation, product-level runtime package checks, executable permission checks, and overlay / secret readiness checks.
- Replaces the industry example with `APP 内容工厂` / `content-factory-app` and keeps customer-specific facts out of the official package.

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
