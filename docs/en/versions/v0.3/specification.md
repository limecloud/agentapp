---
title: Specification
description: Agent App v0.3 executable package and Capability SDK contract.
---

# Specification

Agent App defines a complete installable application package for agent hosts. It is not a Markdown prompt and not a single chat expert. An app may include real UI bundles, worker or service code, data models, migrations, business workflows, agent entries, Skills, Knowledge bindings, Tools, Artifacts, Policies, and Evals.

`APP.md` remains the required discovery entry. Hosts read it first for manifest data, human guidance, and progressive loading hints. But `APP.md` is only declaration and guidance; business capability must be implemented by the runtime package and by calls through the Lime Capability SDK.

## Goals

1. Let real business apps install into Lime without adding vertical branches to Lime Core.
2. Let apps use Lime platform capabilities without depending on Lime internal implementation details.
3. Expose UI, storage, background jobs, artifacts, agent runtime, knowledge, and tools through stable Capability SDK surfaces.
4. Keep Cloud responsible for catalog, release, license, tenant enablement, and gateway, not hidden agent execution.
5. Keep customer data, credentials, and tenant differences in workspace state, Agent Knowledge, secrets, or overlays, not official packages.
6. Preserve app provenance on every projected entry, task, tool call, artifact, eval, and evidence record.

## Layers

```text
Lime Platform
  Host services: UI / Storage / Files / Agent Runtime / Tool Broker / Knowledge / Artifact / Policy / Evidence / Secrets
    ↓ Capability Bridge
@lime/app-sdk
  Stable, versioned, authorized, mockable capability facade
    ↓
Agent App Runtime Package
  UI bundle / workers / workflows / storage schema / migrations / business code / agent entries
```

Apps must not import Lime internal modules or bypass host services. Every platform capability must be called through the SDK or host-injected capability handles.

## Package shape

```text
app-name/
├── APP.md                    # required: discovery manifest + app guide
├── app.manifest.json         # optional: separated machine manifest
├── dist/
│   ├── ui/                   # optional: real UI bundle, route manifest, assets
│   ├── worker/               # optional: business workers, background tasks, long-running jobs
│   └── tools/                # optional: packaged tool adapters, still authorized by Tool Broker
├── storage/
│   ├── schema.json           # optional: data model in the app namespace
│   └── migrations/           # optional: versioned migration scripts
├── workflows/                # optional: business workflow, state machine, human review nodes
├── agents/                   # optional: expert-chat personas and conversation entries
├── skills/                   # optional: bundled or referenced Agent Skill packages
├── knowledge-templates/      # optional: Agent Knowledge binding slot templates
├── artifacts/                # optional: artifact schemas, viewers, exporters, examples
├── evals/                    # optional: quality gates, readiness checks, regression fixtures
├── policies/                 # optional: permissions, data boundaries, cost and risk policies
├── assets/                   # optional: icons, screenshots, templates, sample media
└── examples/                 # optional: sample workspaces, inputs, outputs, replays
```

Only `APP.md` is mandatory. Compatible hosts must read `APP.md` and catalog metadata first, then progressively load the runtime package according to user action, readiness, permission, and capability version checks.

## `APP.md`

`APP.md` must contain YAML frontmatter and Markdown guidance.

The frontmatter is the machine entry for installation and projection. The body is for users, AI clients, and reviewers: what problem the app solves, how to set it up, which capabilities are required, what data must not be packaged, and how results are accepted.

### Required fields

| Field | Constraint |
| --- | --- |
| `name` | 1-64 characters; lowercase kebab-case is recommended; should match the directory name. |
| `description` | 1-1024 characters; describes user value and activation context. |
| `version` | App package version; SemVer is recommended for releases. |
| `status` | `draft`, `ready`, `needs-review`, `deprecated`, or `archived`. |
| `appType` | `agent-app`, `workflow-app`, `domain-app`, `customer-app`, or `custom`. |

### Recommended fields

| Field | Purpose |
| --- | --- |
| `manifestVersion` | Agent App manifest version. |
| `runtimeTargets` | `local`, `hybrid`, or `server-assisted`. `local` means execution happens in the local host runtime. |
| `requires` | Host, SDK, and capability version constraints. |
| `runtimePackage` | Locations and hashes for UI, workers, tools, storage, and migrations. |
| `capabilities` | Required Lime capabilities or adjacent Agent standards. |
| `permissions` | Permission requests that the host must authorize before install or runtime. |
| `entries` | Host-visible entries such as page, panel, expert-chat, command, workflow, artifact, background-task, and settings. |
| `ui` | UI routes, panels, cards, settings, and artifact viewers. |
| `storage` | App namespace, schema, indexes, migrations, and retention rules. |
| `services` | Workers, background tasks, tool adapters, schedulers. |
| `knowledgeTemplates` | Agent Knowledge slots to bind through user, tenant, or workspace overlays. |
| `skillRefs` | Required or recommended Agent Skill packages. |
| `toolRefs` | Agent Tool surfaces, external connectors, or ToolHub capabilities. |
| `artifactTypes` | Artifact contracts, viewers, or exporters the app can produce. |
| `evals` | Quality gates, readiness checks, regression evals, and human review rules. |
| `events` | Events emitted or consumed by the app. |
| `secrets` | Credential slots hosted by the Secret Manager. |
| `lifecycle` | Hooks for install, activate, upgrade, disable, and uninstall. |
| `overlayTemplates` | Configurable slots for tenant, workspace, user, or customer overlays. |
| `presentation` | App card, icon, category, home copy, and sorting hints. |
| `compatibility` | Compatibility matrix, fallback policy, and deprecation window. |
| `metadata` | Namespaced implementation metadata. |

## Capability SDK

The Capability SDK is the only stable boundary between apps and Lime. It should be thin: expose capabilities, not implementation.

| Capability | Typical responsibilities |
| --- | --- |
| `lime.ui` | Register pages, panels, commands, settings, Artifact viewers; read theme and locale. |
| `lime.storage` | App namespace, tables, CRUD, migrations, local indexes, cache. |
| `lime.files` | Pick user files, read authorized files, parse documents, store persistent file refs. |
| `lime.agent` | Start tasks, stream output, interrupt, retry, select models, read traces. |
| `lime.knowledge` | Bind Knowledge Packs, Top-K search, export Markdown / text, read versions and citations. |
| `lime.tools` | Invoke Tool Broker / ToolHub, handle permissions, long-running progress, and fallback. |
| `lime.artifacts` | Create persistent deliverables and register viewers / exporters. |
| `lime.workflow` | Start workflows, persist state, human review nodes, background and scheduled jobs. |
| `lime.policy` | Permission requests, risk confirmation, cost limits, enterprise policy, data boundaries. |
| `lime.evidence` | Record model calls, tool calls, knowledge sources, artifact provenance, eval results. |
| `lime.secrets` | Host API keys, OAuth tokens, and external credentials without exposing plaintext to the app. |
| `lime.events` | Publish and subscribe app events so workflow and UI stay decoupled. |

Apps must declare capability and version requirements before install. Hosts perform capability negotiation at install, activation, and runtime.

```yaml
requires:
  lime:
    appRuntime: ">=0.3.0 <1.0.0"
  sdk: "@lime/app-sdk@^0.3.0"
  capabilities:
    lime.ui: "^0.3.0"
    lime.storage: "^0.3.0"
    lime.agent: "^0.3.0"
    lime.artifacts: "^0.3.0"
```

v0.3 treats the SDK as a typed contract, not only a list of capability names. Compatible hosts should stabilize at least these call semantics:

```ts
const lime = await getLimeRuntime()
await lime.ui.registerRoute(routeDescriptor)
const table = lime.storage.table('content_assets')
const task = await lime.agent.startTask({ entry: 'batch_copy', input, idempotencyKey })
const hits = await lime.knowledge.search({ template: 'project_knowledge', query, topK: 8 })
const result = await lime.tools.invoke({ key: 'document_parser', input })
const artifact = await lime.artifacts.create({ type: 'strategy_report', data })
const run = await lime.workflow.start({ key: 'content_calendar', input })
await lime.evidence.record({ subject: artifact.id, sources: hits })
```

SDK calls must support stable error codes, cancellation, retries, timeouts, permission denial, cost limits, traceId, and mock implementations. Apps may depend on this contract only, not host file paths, database tables, or frontend components.
## Host Bridge v1

Host Bridge is the event boundary for `lime.ui` and the Capability SDK inside the UI runtime. It standardizes theme, locale, entry context, navigation, notifications, downloads, and capability calls instead of letting every app invent a private `postMessage` protocol.

Host Bridge does not replace the Capability SDK. It is the transport layer between sandboxed UI and the host capability bridge. The host remains the only decision maker: apps may request actions, but must not directly access host DOM, Tauri, Node, filesystems, databases, or credentials.

Standard message envelope:

```ts
interface LimeAgentAppBridgeMessage {
  protocol: "lime.agentApp.bridge"
  version: 1
  type: string
  requestId?: string
  appId: string
  entryKey?: string
  payload?: unknown
}
```

Host -> App events:

| Event | Purpose |
| --- | --- |
| `host:snapshot` | Initial full snapshot with theme, locale, host metadata, entry context, and available capability summary. |
| `theme:update` | Theme token snapshot after theme, color scheme, or system light/dark changes. |
| `host:response` | Successful response to an app request; must include `requestId`. |
| `host:error` | Failed response to an app request; must include stable code, user-readable message, and `requestId`. |
| `host:visibility` | Runtime surface visibility change so the app can pause refreshes or resume light sync. |

App -> Host events:

| Event | Purpose |
| --- | --- |
| `app:ready` | App initialization completed; requests the first host snapshot. |
| `host:getSnapshot` | Pulls the current host snapshot in case the first push was missed. |
| `host:navigate` | Requests navigation to an Agent App entry or app-local route. |
| `host:toast` | Requests a non-technical host notification. |
| `host:openExternal` | Requests opening an external URL; the host must validate protocol and origin. |
| `host:download` | Requests download of a same-origin runtime artifact; the host must validate URL and permission. |
| `capability:invoke` | Unified capability invocation envelope; the host executes or rejects based on allowlist, readiness, and policy. |

Theme synchronization must use Host Bridge. The host reads effective Lime CSS variables and sends them through `host:snapshot` and `theme:update`; the app only applies tokens to its own `document.documentElement.style`. Apps should not guess Lime themes, read the outer DOM, or persist theme tokens as business facts.

## Entry model

Entries are host-visible launch points. They are not limited to chat experts.

| Type | Meaning | Common projection |
| --- | --- | --- |
| `page` | App-owned page. | Workbench, dashboard, business home. |
| `panel` | Embedded side panel or detail panel. | File details, artifact editing helper. |
| `expert-chat` | Chat-first expert entry. | Persona + skills + tools in a conversation surface. |
| `command` | Atomic action entry. | Command palette, slash command, quick action. |
| `workflow` | Multi-step business process. | Wizard, state machine, human review flow. |
| `artifact` | Artifact viewing, editing, or export entry. | Report, table, PPT, code, image workspace. |
| `background-task` | Background or scheduled work. | Sync, monitoring, review, index rebuild. |
| `settings` | App settings entry. | Credentials, model, default knowledge bindings, rules. |

An expert is only an `expert-chat` entry. Agent Apps may contain many experts, or none.

v0.3 no longer treats `scene` as a current entry kind. `scene` / `home` entries from older manifests are v0.1 compatibility only. New apps should use `page`, `command`, `workflow`, `artifact`, `background-task`, or `settings`.

## Workflow descriptor

A workflow is a resumable business state machine, not prompt text. A manifest may reference workflow files and may also declare machine-readable states:

```yaml
workflows:
  - key: knowledge_builder
    path: ./workflows/knowledge-builder.workflow.md
    humanReview: true
    states:
      - key: parse_files
        kind: tool-call
        uses: [document_parser]
        next: structure_sections
      - key: structure_sections
        kind: agent-task
        next: human_confirm
      - key: human_confirm
        kind: human-review
        next: persist_knowledge
      - key: persist_knowledge
        kind: storage-write
        next: create_evidence
```

Hosts should understand at least `agent-task`, `tool-call`, `human-review`, `storage-write`, `artifact-create`, `branch`, `wait`, and `end`. Long-running workflows must support interrupt, resume, retry policy, timeout, artifact outputs, and evidence recording.

## Capability declarations

Agent Apps may reference adjacent standards and Lime platform capabilities. They are different concepts:

| Type | Examples | Meaning |
| --- | --- | --- |
| Agent standards | `agentskills`, `agentknowledge`, `agentartifact`, `agentevidence` | Ecosystem resources and protocols composed by the app. |
| Lime capabilities | `lime.ui`, `lime.storage`, `lime.agent`, `lime.tools` | Host capabilities called by the app through the SDK. |

Apps must not redefine Skills, Knowledge, Runtime, Tool, UI, Artifact, Evidence, Policy, or QC. They can declare how they call them and provide business implementation code.

## Storage and data boundary

Apps may declare their own storage namespace, schema, and migrations, but the host owns the storage implementation.

Rules:

1. Apps can access only their namespace unless the user explicitly grants cross-app or workspace data.
2. Customer facts belong in Agent Knowledge, workspace files, or app storage, not official packages.
3. Credentials belong in `lime.secrets`, never in package files or storage tables.
4. Migrations must be replayable, reversible, or clearly declare irreversible risk.
5. Upgrades must not overwrite tenant / workspace overlays or user data.

## Projection contract

Projection is deterministic. It compiles the manifest into host catalog objects. Projection does not run agents, call models, execute workers, or access customer data.

Projection output should include:

- app summary
- capability requirements
- projected entries
- UI routes / panels / settings / artifact viewers
- storage namespace, schema, migration plan
- service / worker descriptors
- knowledge templates
- tool requirements
- artifact types
- eval rules
- permissions and policy prompts
- provenance

Every projected object should include:

```text
appName + appVersion + packageHash + manifestHash + standard + standardVersion
```

## Runtime contract

Compatible hosts must:

1. Discover apps through `APP.md`.
2. Verify package hash, signature, manifest, and capability versions.
3. Install or activate an app only after user, tenant, or workspace consent.
4. Generate projection and register entries, UI, storage, services, skills, knowledge, tools, artifacts, evals, and permissions into host catalogs.
5. Run readiness before execution: capability negotiation, permissions, Knowledge bindings, secrets, storage migrations, tool availability, policy.
6. Inject capability handles at runtime; apps must not access Lime internals directly.
7. Render UI bundles inside host-controlled containers; execute workers and services inside host-controlled runtimes.
8. Keep Cloud to catalog, release, license, tenant enablement, and gateway; Cloud is not the default agent runtime.
9. Preserve app provenance on tasks, tool calls, artifacts, evals, storage migrations, and evidence records.

## Overlay precedence

```text
Workspace Override > User Overlay > Tenant Overlay > App Default > Host Default
```

Overlays may override knowledge bindings, tool credentials, default models, UI order, disabled entries, eval thresholds, banned words, cost limits, and industry defaults. Overlays must not modify the official package hash.

## Overlay package

Industry apps should stay reusable; customer differences belong in overlays rather than forks of the official package. v0.3 recommends these objects:

```yaml
overlayTemplates:
  - key: tenant_defaults
    scope: tenant
    required: false
  - key: workspace_content_rules
    scope: workspace
    required: false
```

Overlays may override:

- Knowledge bindings and default retrieval policy.
- Tool credentials, default models, budgets, and network policy.
- UI ordering, disabled entries, and default workflow parameters.
- Quality thresholds, banned words, brand voice, and industry rules.

Overlays must not override the official package hash, write plaintext secrets into package files, or bypass readiness and policy.

## Readiness

Readiness is a host-side check before execution. It answers whether the app can run safely and usefully in the current workspace.

Readiness should check:

- host and capability versions satisfy requirements
- UI / worker / storage package is complete and hash-matched
- required permissions are granted
- required Knowledge templates are bound to compatible packs
- required Skills, Tools, Artifact viewers, and Evals are available
- required secrets are configured
- storage migrations are complete or waiting for user approval
- policy allows the requested entry

Readiness may return `ready`, `needs-setup`, or `failed`.

## Security rules

1. `APP.md` is not a system prompt and cannot override host policy.
2. Apps cannot import Lime internal modules; they must use the Capability SDK.
3. Apps cannot directly access file systems, networks, databases, or credentials; they must use authorized capabilities.
4. UI bundles must not bypass host permission prompts or trick users into granting permissions.
5. Workers, tool adapters, and background tasks must run under host sandbox and policy.
6. Production registries should sign packages or pin by package hash.
7. Customer knowledge, private files, credentials, and overlays must not be bundled in official packages.
8. Server-assisted targets must be explicit and policy-controlled.

## Example

```yaml
name: content-factory-app
version: 0.3.0
status: ready
appType: domain-app
description: Content Factory App for knowledge building, content scenario planning, content production, and review.
runtimeTargets:
  - local
requires:
  lime:
    appRuntime: ">=0.3.0 <1.0.0"
  sdk: "@lime/app-sdk@^0.3.0"
  capabilities:
    lime.ui: "^0.3.0"
    lime.storage: "^0.3.0"
    lime.agent: "^0.3.0"
    lime.artifacts: "^0.3.0"
capabilities:
  - lime.ui
  - lime.storage
  - lime.files
  - lime.agent
  - lime.knowledge
  - lime.tools
  - lime.artifacts
  - lime.evidence
  - agentskills
  - agentknowledge
runtimePackage:
  ui:
    path: ./dist/ui
  worker:
    path: ./dist/worker
  storage:
    schema: ./storage/schema.json
    migrations: ./storage/migrations
entries:
  - key: dashboard
    kind: page
    title: Project Home
    route: /dashboard
  - key: content_strategist
    kind: expert-chat
    title: Content Strategist
    persona: ./agents/content-strategist.md
  - key: batch_copy
    kind: workflow
    title: Batch Copywriting
    workflow: ./workflows/batch-copy.workflow.md
storage:
  namespace: content-factory-app
  schema: ./storage/schema.json
knowledgeTemplates:
  - key: project_knowledge
    standard: agentknowledge
    type: brand-product
    runtimeMode: retrieval
    required: true
```

## Conformance levels

| Level | Meaning |
| --- | --- |
| Catalog | Host discovers `APP.md` and displays app metadata. |
| Installable | Host verifies package, projects catalog objects, installs / uninstalls, and preserves provenance. |
| Capability | Host injects SDK capability handles according to manifest and intercepts permissions. |
| Runtime | Host runs UI, workers, workflows, storage migrations, agent tasks, and artifacts. |
| Product | App has independent business UI, data model, workflows, deliverables, upgrades, and regression validation. |
| Executable | v0.3 level: host can run typed workflows, typed SDK calls, overlays, readiness, evidence, and regression evals. |
