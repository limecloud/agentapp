# Release Notes

## v0.5.0

v0.5 absorbs the Agent Skills standard's discovery and authoring discipline into Agent App. The manifest is now layered: `APP.md` keeps a small, human-friendly frontmatter while detailed capability, entry, permission, error, i18n, and signature configuration moves into dedicated files. New `triggers` and `quickstart` fields drive AI auto-discovery and first-launch UX. The `skills/` directory gives apps a standard way to bundle or reference Agent Skills. A new readiness self-check model (`evals/readiness.yaml`), standardized error codes (`app.errors.yaml`), enhanced signing (`app.signature.yaml`), first-class i18n (`app.i18n.yaml`), and runtime health (`evals/health.yaml`) round out the upgrade. Workflow descriptors gain mermaid diagrams and recovery policies. The reference CLI ships `migrate-check` and `migrate-generate` to ease the v0.4 → v0.5 transition. v0.4 manifests remain valid.

## v0.4.0

Host Bridge v1 is now documented as the standard runtime event bridge for Agent App UI. It covers theme sync, locale/context snapshots, visibility, navigation, toast, downloads, external links, and capability invocation envelopes while preserving host-side readiness, permission, policy, and provenance checks.

## v0.3.0

v0.3 turns Agent App from an installable package draft into an executable standard layer. It adds typed descriptor schemas, typed SDK expectations, overlay templates, stronger readiness semantics, package provenance, and compatibility handling for legacy entry kinds. The reference example is now `内容工厂` / `content-factory-app`.

## v0.2.0

Agent App now represents a complete installable application package, not only a declarative composition layer. It includes runtime package shape, Capability SDK boundaries, storage and workflow support, and product-level examples.

## v0.1.0

Initial draft: APP.md manifest, projection, overlays, readiness, examples, bilingual docs, and reference CLI.
