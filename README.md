# Agent App

Agent App is a draft standard for complete installable intelligent applications in the Agent standards ecosystem. It packages real app implementation - UI bundles, workers, storage schemas, workflows, agent entries, Skills, Knowledge bindings, tool requirements, artifact contracts, policies, evals, presentation metadata, and v0.7 requirement-boundary files - without moving agent execution into the cloud.

Agent Runtime answers **how tasks execute**. Agent UI answers **how interaction surfaces render**. Agent Context answers **how context is assembled**. Skills answer **how reusable work is done**. Knowledge answers **what trusted facts are**. Tools connect external capabilities; Artifacts persist deliverables; Evidence, Policy, and QC make results trustworthy. Agent App answers **how all of those become a complete installable application with host capabilities, UI, data boundaries, entries, lifecycle, and v0.7 requirement handoff**.

## Core boundary

Agent App is the business workspace. Lime Agent is the intelligent runtime capability that apps orchestrate. Users should be able to finish a business workflow inside the app surface instead of being forced back into a generic chat UI. Chat and expert entries are valid app surfaces, but they are optional interaction modes rather than the required container for product work.

| Standard / layer | Owns | Entry point | Runtime behavior |
| --- | --- | --- | --- |
| Agent Runtime | Task lifecycle, model routing, sessions, checkpoints, event streams, structured output. | Runtime contract | Runs under host policy; App declares intent through `app.runtime.yaml`. |
| Agent UI | Pages, panels, commands, viewers, Host Bridge interaction surfaces. | UI descriptors / entries | Rendered in host-controlled surfaces through `lime.ui`. |
| Agent Context | Context assembly, budget, priority, compression, missing-context requests. | Context descriptors | Resolved by host/runtime for each entry or task. |
| Agent Skills | Reusable procedures, scripts, rubrics, and executable process fragments. | `SKILL.md` | Activated by an agent after trust checks. |
| Agent Knowledge | Source-grounded facts, status, provenance, freshness, and safe context. | `KNOWLEDGE.md` | Loaded as fenced data or retrieval context; never executed. |
| Agent Tool / Connector | External callable capabilities, MCP, CLI, API, browser adapters, auth, side effects. | Tool / connector descriptor | Invoked by Host/Cloud policy and evidence surfaces. |
| Agent Artifact | Durable deliverables, schemas, viewers, exporters, state. | Artifact schema | Stored and displayed by host artifact services. |
| Agent Evidence / Policy / QC | Provenance, permissions, risk, quality gates, audits, waivers. | Evidence, policy, eval descriptors | Enforced and recorded by Host/Cloud; App declares inputs and gates. |
| Agent Expert | Chat-first entry composed from persona, context, tools, and app state. | Expert entry | Runs inside a host conversation surface; optional App entry, not the App itself. |
| Agent App | Complete installable app package: UI, workers, storage, workflows, entries, permissions, artifacts, evals, lifecycle, and v0.7 boundaries. | `APP.md` + runtime package | Runs in the host through `@lime/app-sdk` capability handles. |
| Lime Host / Cloud | Local execution, sandbox, secrets, registry, tenant policy, OAuth, webhook, scheduled sync. | `lime.*` capabilities | Injected into apps as authorized handles; apps do not import host internals. |

## App and Lime responsibilities

| Area | Agent App owns | Lime owns |
| --- | --- | --- |
| Product experience | Business UI, pages, tables, forms, dashboards, review steps, and delivery views. | Host shell, navigation, theme, locale, installation, and app lifecycle. |
| Business logic | Workflow state, domain rules, storage schema, structured result write-back, and human confirmation. | Agent task runtime, capability enforcement, retries, cancellation, cost limits, and telemetry. |
| Data boundary | App-local records, package assets, overlays, and references to workspace data. | Namespaced storage, files, Knowledge binding, secrets, policy, cleanup, and audit. |
| Agent execution | Decides when to call an agent task and how the result updates product state. | Runs `lime.agent` tasks, model calls, tools, traces, artifacts, and evidence through SDK contracts. |

The boundary is intentionally strict: business should not leave the app context, and agents should not leave Lime capability governance. If an app bypasses Lime to build its own model gateway, permission system, or evidence store, it is becoming an independent SaaS instead of an Agent App. If an app sends users back to generic chat for core work, it is only a chat wrapper rather than a product-level app.

## Pack shape

```text
my-agent-app/
├── APP.md                    # required: discovery manifest + app guide
├── app.manifest.json         # optional: separated machine manifest
├── dist/
│   ├── ui/                   # optional: UI bundle and route manifest
│   ├── worker/               # optional: business workers and background jobs
│   └── tools/                # optional: packaged tool adapters
├── storage/
│   ├── schema.json           # optional: app namespace data model
│   └── migrations/           # optional: versioned migrations
├── workflows/                # optional: business workflows and state machines
├── agents/                   # optional: expert-chat personas
├── skills/                   # optional: bundled or referenced Agent Skill packages
├── knowledge-templates/      # optional: required knowledge slots and starter templates
├── artifacts/                # optional: output contracts, viewers, exporters
├── evals/                    # optional: readiness and quality checks
├── policies/                 # optional: permissions and data boundaries
├── app.runtime.yaml          # optional: v0.6 agent task runtime control plane
├── app.requirements.yaml     # optional: v0.7 requirements, MVP, non-goals, acceptance
├── app.boundary.yaml         # optional: v0.7 App / Host / Cloud / Connector / Human boundary
├── app.integrations.yaml     # optional: v0.7 Host/Cloud-managed external integrations
├── app.operations.yaml       # optional: v0.7 side effects, approvals, evidence
├── overlay-templates/        # optional: tenant / workspace overlay schemas
├── app.lock.json             # optional: package file hashes and signatures
└── examples/                 # optional: sample workspaces, prompts, outputs
```

`APP.md` is not the app implementation. It is the discovery and review surface. Product-level functionality belongs in the runtime package and calls host services through the Capability SDK.

## Capability SDK contract

Compatible hosts should expose versioned, authorized, mockable capabilities such as:

- `lime.ui` for pages, panels, commands, settings, artifact viewers
- `lime.storage` for app namespaces, tables, indexes, migrations
- `lime.files` for user-selected files and parsing
- `lime.agent` for local agent tasks, streaming, retries, traces
- `lime.knowledge` for Knowledge Pack binding and retrieval
- `lime.tools` for Tool Broker / ToolHub invocation
- `lime.connectors` for Host/Cloud-managed MCP, CLI, API, browser, OAuth, webhook, and sync adapters
- `lime.artifacts` for persistent deliverables
- `lime.workflow` for business state and background tasks
- `lime.policy` for permissions, cost, risk, data boundary
- `lime.evidence` for provenance and replay
- `lime.secrets` for credentials without plaintext app access

Apps must not import host internals. They declare capability requirements in the manifest and receive runtime handles from the host. v0.7 keeps the layered manifest model, keeps v0.6 `app.runtime.yaml` for the `lime.agent` task control plane, and adds requirement-boundary files so each business request can be split across App, Host, Cloud, connector, external-system, and human-decision responsibilities.

## Runtime contract

Compatible hosts should:

1. Discover apps by `APP.md`.
2. Verify package hash, signatures, manifest shape, and capability versions.
3. Install or activate an app only after user, tenant, or workspace consent.
4. Resolve declared UI, storage, workers, Runtime, Context, Skills, Knowledge templates, Tools, Connectors, Artifacts, Evidence, Policy, Evals, and permissions into host catalogs.
5. Inject Capability SDK handles at runtime instead of exposing host internals.
6. Keep agent execution inside the host runtime; cloud registries may distribute and authorize apps but must not become a hidden Agent Runtime.
7. Keep customer data in Agent Knowledge packs, workspace files, app storage namespaces, secrets, or overlays rather than official app packages.
8. Record app provenance on every projected entry, task, tool call, artifact, migration, and eval.

## Documentation

- [Specification](docs/en/specification.md)
- [What is Agent App?](docs/en/what-is-agent-app.md)
- [Runtime package design](docs/en/authoring/runtime-package.md)
- [Capability SDK](docs/en/client-implementation/capability-sdk.md)
- [Agent App and Standards Ecosystem Boundary](docs/en/agent-standards-boundary.md)
- [Runtime model](docs/en/client-implementation/runtime-model.md)
- [中文规范](docs/zh/specification.md)

## Reference CLI

```bash
npx agentapp-ref@0.7.0 validate ./my-agent-app --version 0.7
npx agentapp-ref@0.7.0 to-catalog ./my-agent-app
npx agentapp-ref@0.7.0 project ./my-agent-app
npx agentapp-ref@0.7.0 readiness ./my-agent-app --workspace ./workspace
npx agentapp-ref@0.7.0 migrate-check ./my-agent-app
npx agentapp-ref@0.7.0 migrate-generate ./my-agent-app --target 0.7.0
```

## Local development

```bash
npm install
npm run dev
npm run build
```
