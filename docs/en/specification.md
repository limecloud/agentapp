---
title: Specification
description: Agent App package format draft.
---

# Specification

Agent App defines an installable application composition package for agent hosts. It follows the Agent Skills package style: directory-as-package, a top-level Markdown entry file, YAML frontmatter, progressive loading, optional support directories, and validation tooling.

Agent App is intentionally a composition layer. It does not define a new runtime, tool protocol, knowledge format, UI component model, artifact format, evidence model, or policy engine. It references neighboring standards and tells a host how to install, project, and prepare an app-like agent experience.

## Design goals

1. Make app-like agent systems portable across host products.
2. Let hosts expose capability surfaces while keeping execution under host control.
3. Let users install a scenario-specific app without modifying the host core.
4. Keep customer data outside official app packages.
5. Preserve provenance from app package to projected entries, runtime tasks, artifacts, evals, and evidence.
6. Allow cloud registries to distribute and authorize apps without becoming hidden Agent Runtimes.

## Package shape

```text
app-name/
├── APP.md                 # required: manifest + app guide
├── skills/                # optional: bundled or referenced Agent Skill packages
├── knowledge-templates/   # optional: knowledge slot templates and setup docs
├── workflows/             # optional: scene/workflow definitions and fixtures
├── tools/                 # optional: tool requirement docs and permission hints
├── artifacts/             # optional: output contracts, viewer hints, examples
├── evals/                 # optional: readiness, quality, and review fixtures
├── assets/                # optional: icons, screenshots, templates, sample media
└── examples/              # optional: sample workspaces, prompts, outputs
```

Only `APP.md` is required. Support directories must be progressively loaded: catalog consumers read `APP.md` first and load support files only when authoring, installing, validating, or running a specific entry.

## `APP.md`

`APP.md` MUST contain YAML frontmatter followed by Markdown guidance.

The frontmatter is the machine-readable manifest. The Markdown body is the human- and AI-readable guide: when to use the app, what setup it requires, how to evaluate results, and what the host must not infer.

### Required fields

| Field | Constraint |
| --- | --- |
| `name` | 1-64 characters; lowercase kebab-case recommended; should match the package directory. |
| `description` | 1-1024 characters; describes user value and activation context. |
| `version` | App package version. SemVer is recommended for released apps. |
| `status` | `draft`, `ready`, `needs-review`, `deprecated`, or `archived`. |
| `appType` | `agent-app`, `workflow-app`, `domain-app`, `customer-app`, or `custom`. |

### Recommended fields

| Field | Purpose |
| --- | --- |
| `runtimeTargets` | `local`, `hybrid`, or `server-assisted`. `local` means the host runtime executes the app locally after installation. |
| `entries` | Host-visible app entries such as scenes, commands, homes, workflows, or artifact surfaces. |
| `capabilities` | Standards or host capability surfaces required by the app. |
| `permissions` | Permission requests the host must resolve before execution. |
| `knowledgeTemplates` | Agent Knowledge slots that user, tenant, or workspace overlays must bind. |
| `skillRefs` | Agent Skill packages required or recommended by the app. |
| `toolRefs` | Agent Tool surfaces or connectors required by the app. |
| `artifactTypes` | Agent Artifact contracts or viewer hints produced by the app. |
| `evals` | Quality gates, readiness checks, and review rules. |
| `presentation` | Store card, icon, category, home copy, and ordering hints. |
| `compatibility` | Host, standard, or capability version constraints. |
| `metadata` | Namespaced implementation metadata. |

## Entry model

Entries are the app-level equivalent of mini-program pages, but they are not UI pages by default. They are host-visible launch points that can project into command palettes, slash commands, home cards, guided flows, artifact workspaces, or templates.

| Kind | Meaning | Typical projection |
| --- | --- | --- |
| `home` | App landing surface. | App home card or dashboard. |
| `scene` | Product scenario. | Slash-style entry or guided prompt. |
| `command` | Atomic command entry. | Command palette or `@` command. |
| `workflow` | Multi-step guided flow. | Wizard, checklist, or staged runtime task. |
| `artifact` | Artifact viewer, editor, or export entry. | Artifact workspace action. |

Each entry should have a stable `key`, a `kind`, a user-facing title, and enough binding metadata for the host to select Skills, Knowledge templates, Tools, Artifacts, and Evals.

## Capability declarations

Agent App SHOULD reference neighboring standards by name instead of redefining them:

| Capability | Meaning |
| --- | --- |
| `agentskills` | The app depends on procedural Skills. |
| `agentknowledge` | The app needs source-grounded knowledge slots. |
| `agentruntime` | The host needs a compatible runtime to execute app entries. |
| `agenttool` | The app requires callable tool surfaces or connectors. |
| `agentcontext` | The app depends on explicit context assembly or budget behavior. |
| `agentui` | The app projects structured interaction surfaces. |
| `agentartifact` | The app produces durable deliverables. |
| `agentevidence` | The app records support, provenance, verification, or replay. |
| `agentpolicy` | The app has permission, risk, retention, or approval requirements. |
| `agentqc` | The app carries quality gates or acceptance scenarios. |

## Knowledge templates

Knowledge templates describe required or optional slots, not customer data.

A template SHOULD declare:

- stable `key`
- `standard: agentknowledge`
- Knowledge `type`
- `runtimeMode: data | persona`
- `required: true | false`
- optional grounding, freshness, or trust requirements

Official apps MUST NOT embed private customer knowledge. Hosts bind concrete Agent Knowledge packs through user, tenant, or workspace overlays.

## Skill references

Skill references point to existing Agent Skill packages or host-provided Skills. They describe how the app does work but do not inline all procedural details into `APP.md`.

A Skill reference SHOULD declare:

- stable `id`
- version or compatibility range when known
- whether it is required
- which entries use it
- optional source or bundle digest

## Tool and permission references

Tool references declare required host capabilities and permission needs. Credentials remain in host-controlled stores.

A tool reference SHOULD declare:

- stable `key`
- provider or capability family
- required vs optional
- permission scope
- whether degraded operation is allowed

Permission requests SHOULD be resolved by Agent Policy or host policy before runtime execution.

## Artifact and eval declarations

Artifact declarations describe the durable outputs an entry may produce. Eval declarations describe quality gates or review checks that apply before outputs are considered ready.

Apps SHOULD attach evals to artifacts or entries rather than treating evals as generic global prompts. Evals that affect user trust should link to Agent Evidence records when executed.

## Projection contract

Projection is a deterministic host operation that compiles the app manifest into host catalog objects.

Projection output SHOULD include:

- app summary
- projected entries
- knowledge templates
- tool requirements
- artifact types
- eval rules
- provenance

Every projected object SHOULD include:

```text
appName + appVersion + manifestHash + standard + standardVersion
```

Projection MUST NOT run an agent, call a model, or invoke tools.

## Runtime contract

A compatible host MUST:

1. Discover apps by `APP.md`.
2. Read catalog metadata before loading support files.
3. Install or activate an app only after user, tenant, or workspace consent.
4. Resolve entries, skills, knowledge templates, tools, artifacts, evals, and permissions into host-owned catalogs.
5. Keep execution in the host Agent Runtime.
6. Treat cloud registries as distribution and authorization surfaces, not hidden Agent Runtimes.
7. Keep customer data in Agent Knowledge packs, workspace files, or overlays.
8. Preserve app provenance on projected entries, runtime tasks, tool calls, artifacts, evals, and evidence.

## Overlay precedence

```text
Workspace Override > User Overlay > Tenant Overlay > App Default > Host Default
```

Official apps should remain upgradeable. Overlays bind customer knowledge, brand copy, tool credentials, default model choices, scene ordering, eval thresholds, and disabled entries.

## Readiness

Readiness is a host-side check before execution. It answers whether the app can run safely and usefully in the current workspace.

Readiness SHOULD check:

- required Skills are installed and trusted
- required Knowledge templates are bound to compatible packs
- required Tools exist and permissions are granted
- required Artifact viewers or storage surfaces are available
- required Evals can run
- runtime target is supported
- policy allows the requested entry

Readiness may return `ready`, `needs-setup`, or `failed`.

## Security rules

1. `APP.md` is not a system prompt and cannot override host policy.
2. Support files are not executable unless the host explicitly activates a referenced Skill or Tool.
3. App packages should be signed or pinned by manifest hash in production registries.
4. Credentials must never be stored in official app packages.
5. Customer facts belong in Agent Knowledge or overlays.
6. Server-assisted targets must be explicit and policy controlled.

## Example

```markdown
---
name: ai-content-engineering
version: 0.1.0
status: ready
appType: agent-app
description: AI content engineering app for personal IP and operations content.
runtimeTargets:
  - local
  - hybrid
capabilities:
  - agentskills
  - agentknowledge
  - agenttool
  - agentartifact
  - agentevidence
entries:
  - key: ip_article
    kind: scene
    title: IP Article
    command: /IP Article
knowledgeTemplates:
  - key: personal_ip
    standard: agentknowledge
    type: personal-profile
    runtimeMode: persona
    required: true
skillRefs:
  - id: gongzonghao-article-writer
    required: true
---

# AI Content Engineering

Use this app to build knowledge-backed content workflows.
```

## Conformance levels

| Level | Meaning |
| --- | --- |
| Catalog | Host can discover `APP.md` and show app metadata. |
| Install | Host can cache the package, validate it, and resolve overlays. |
| Project | Host can compile entries and requirements into local catalogs. |
| Run | Host can execute entries through Agent Runtime with provenance. |
| Evidence | Host can connect outputs, evals, and evidence back to app provenance. |
