---
title: App engineering loop
description: A repeatable loop for turning a business workflow into a complete Agent App package.
---

# App engineering loop

A strong Agent App is not written in one pass. It is shaped through a loop that keeps product intent, runtime implementation, host capability usage, and readiness evidence in sync.

The loop is useful because Agent App sits between several systems: UI, workflows, storage, Skills, Knowledge, Tools, Artifacts, Evals, permissions, and host runtime capabilities. If one layer is designed in isolation, the package becomes either a prompt bundle, a single expert, or an unsafe plugin. The loop keeps it a complete installable app.

## Loop overview

```text
User job
  -> App map
  -> Manifest
  -> Runtime package
  -> Capability binding
  -> Readiness and evals
  -> Example workspace
  -> Release
  -> Observed improvements
```

Each turn should produce a versioned artifact in the package or docs. Avoid relying on meeting notes that never become `APP.md`, schemas, workflow descriptors, example outputs, or tests.

## 1. Define the user job

Start with a concrete job rather than a technology surface.

| Question | Good answer |
| --- | --- |
| Who installs it? | A content operations lead, support manager, analyst, teacher, or internal team admin. |
| What work starts the app? | Build a knowledge base, draft replies, review contracts, generate a report, prepare a campaign. |
| What must be durable? | Tables, reports, drafts, review notes, metrics, project configuration, evidence. |
| What must remain outside the package? | Customer facts, credentials, private files, tenant policy, and workspace overrides. |

The output of this step is a short product brief that can be pasted into the Markdown body of `APP.md`.

## 2. Map entries and owned surfaces

Turn the job into entries. Do not make every feature a chat expert.

| Need | Entry kind |
| --- | --- |
| App dashboard or project home | `page` |
| Guided multi-step process | `workflow` |
| Atomic action from command palette | `command` |
| Persona-led conversation | `expert-chat` |
| Durable deliverable view or editor | `artifact` |
| Long running sync or review | `background-task` |
| Model, credential, or binding setup | `settings` |

At this point, remove entries that are only implementation details. A worker function is not necessarily a user entry.

## 3. Separate Skills, Knowledge, Tools, and app code

The app should compose adjacent standards instead of copying them.

- Put procedural instructions in Agent Skills.
- Put grounded facts and source material in Agent Knowledge.
- Put external calls behind Tool requirements and host policy.
- Put UI, workflow state, storage schema, workers, and product composition in Agent App.

The goal is upgradeability: a better Skill or Knowledge Pack can improve the app without forking the app package.

## 4. Draft `APP.md`

The first manifest should be small but real. It should include identity, runtime targets, required capabilities, entries, storage namespace, runtime package hints, Knowledge slots, Tool requirements, Artifact types, Evals, permissions, compatibility, and presentation metadata.

```yaml
manifestVersion: 0.3.0
name: content-factory-app
version: 0.3.0
status: draft
appType: domain-app
runtimeTargets: [local]
requires:
  sdk: "@lime/app-sdk@^0.3.0"
  capabilities:
    lime.ui: "^0.3.0"
    lime.storage: "^0.3.0"
    lime.agent: "^0.3.0"
entries:
  - key: dashboard
    kind: page
    title: Dashboard
    route: /dashboard
```

Do not hide required runtime assumptions in prose. Hosts need machine-readable fields.

## 5. Build the runtime package

`APP.md` is only the discovery and review surface. Product behavior belongs in the runtime package:

```text
content-factory-app/
├── APP.md
├── dist/ui
├── dist/worker
├── storage/schema.json
├── storage/migrations
├── workflows
├── agents
├── artifacts
├── evals
└── overlay-templates
```

The runtime package must call host capabilities through the SDK. It must not import Lime internals or assume host database tables.

## 6. Run readiness before execution

Readiness answers: can the host safely run this app now?

Minimum checks:

- host runtime and SDK version match
- required capabilities are available
- Knowledge slots are bound or setup tasks are generated
- Tools are installed and authorized
- permissions are declared and resolvable
- Artifact viewers and Evals exist
- storage namespace and migrations are acceptable
- secrets are requested through a secret manager

A package can be valid but not ready. That is a healthy state: it means the host can explain missing setup.

## 7. Add example workspaces

Every app should ship at least one example workspace. The example should include input data shape, expected artifacts, eval expectations, and cleanup behavior. It should not include private customer data.

For example, a content app can ship synthetic project notes, sample content scenarios, expected content table output, and a fact-grounding eval fixture.

## 8. Release and observe

A release should pin:

- package version
- manifest hash
- package hash
- compatibility matrix
- release notes
- rollback target
- migration notes

After release, observe readiness failures, permission denials, tool gaps, eval failures, and overlay conflicts. Feed those observations into the next loop.

## Definition of done

An Agent App is ready for a release candidate when:

- `agentapp-ref validate` passes without errors
- projection output is deterministic
- readiness output is actionable
- every executable path uses the Capability SDK
- every durable output has provenance
- customer data is outside the official package
- uninstall or disable behavior is documented
- at least one example workspace proves the main user job
