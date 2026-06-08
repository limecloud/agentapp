# Release Notes

## v0.10.0

v0.10 defines Agent App as a mini-program style package: shared user state and host capabilities come from the host, while app UI, workflow, app-local storage, and optional app backend services stay isolated. Local desktop installs should default to host-managed per-app SQLite; PostgreSQL is reserved for cloud, enterprise, or team-shared server backends. The release updates schemas, CLI, examples, Electron host guidance, and adds a concise v0.10 update page.

## v0.9.0

v0.9 standardizes the App Server Bridge Profile for Agent App runtime execution. It keeps v0.8 install modes, then makes the runtime path explicit: `@lime/app-sdk` / Host Bridge -> Desktop Host IPC -> App Server JSON-RPC -> RuntimeCore services -> ExecutionBackend. The release adds `agentRuntime.bridge`, extends runtime and install schemas with bridge / sidecar / release manifest metadata, upgrades `agentapp-ref` to `0.9.0`, and updates Content Factory as a v0.9 example. v0.8 packages remain valid; v0.9 adds bridge precision without weakening capability governance.

## v0.8.0

v0.8 makes Agent Apps first-class standalone products without letting each app rebuild the platform. It separates Agent App package, Lime Runtime Core, Lime Desktop, and Lime App Shell. The release adds `app.install.yaml`, `app-install.schema.json`, install-mode projection, and reference CLI support for `--version 0.8` / `--target 0.8.0`. Apps can now declare `in_lime`, `standalone`, `runtime_backed`, and optional `web_host` distribution modes while still relying on Lime-governed capabilities for agent execution, secrets, policy, tools, storage, and evidence. v0.7 packages remain valid; v0.8 adds install topology above the existing requirement-boundary model.

## v0.7.0

v0.7 standardizes Requirement Boundary & Capability Handoff. It helps teams turn a sanitized business request into a concrete Agent App plan: what the App owns, what Lime Host must execute locally, what Lime Cloud must govern, what connectors adapt, what remains in external systems, and what requires human confirmation. The release adds `app.requirements.yaml`, `app.boundary.yaml`, `app.integrations.yaml`, `app.operations.yaml`, and the App Fit Report schema. The documentation now includes end-user architecture, sequence, and flow diagrams, and the reference CLI can validate, project, and generate v0.7 boundary files. v0.6 apps remain valid; v0.7 adds planning and handoff contracts above the existing runtime control plane.

## v0.6.0

v0.6 standardizes the `lime.agent` task runtime control plane without moving execution out of the host. It adds the recommended `app.runtime.yaml` layer for task event/result envelopes, JSON Schema structured output, runtime approvals, session resume/continue/fork, on-demand tool discovery, checkpoint scope, and observability mapping. Hosts can now project Agent App tasks into stable event streams with result subtypes, usage/cost, artifact refs, and evidence refs. v0.5 manifests remain valid; v0.6 is an incremental hardening layer for product-level apps that already use Lime AgentRuntime.

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
