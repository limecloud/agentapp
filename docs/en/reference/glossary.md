---
title: Glossary
description: Terms used by the Agent App standard.
---

# Glossary

This glossary defines terms as they are used in Agent App v0.3.

| Term | Meaning |
| --- | --- |
| Agent App | A complete installable intelligent application package for a host runtime. |
| `APP.md` | Required discovery entry with YAML frontmatter and human-readable guide. |
| Runtime package | UI, worker, storage, workflow, artifact, eval, and support files referenced by `APP.md`. |
| Host | Client or platform that installs, projects, authorizes, and runs the app. |
| Capability SDK | Stable API surface injected by the host, such as `lime.ui` and `lime.storage`. |
| Capability | A host-provided service an app can call through the SDK. |
| Entry | Host-visible launch point such as page, command, workflow, artifact, background task, or settings. |
| Expert | Chat-first entry. In v0.3 it is represented as `expert-chat`, not as the whole app. |
| Projection | Deterministic compilation from manifest to host catalog objects. |
| Readiness | Static setup and compatibility check before runtime execution. |
| Overlay | Tenant, workspace, user, or customer-specific configuration outside the official package. |
| Knowledge template | Slot describing required or optional Agent Knowledge binding. |
| Skill reference | Reference to an Agent Skill that provides procedural capability. |
| Tool reference | Requirement for an external or host callable tool. |
| Artifact type | Durable output contract created or viewed by the app. |
| Eval | Quality gate, readiness check, or human review rule for output acceptance. |
| Evidence | Provenance and support record for tasks, tools, Knowledge sources, Artifacts, and evals. |
| Secret slot | Credential placeholder resolved by host secret manager. |
| Package hash | Integrity hash for package contents. |
| Manifest hash | Integrity hash for the manifest or `APP.md` frontmatter. |
| Local runtime | Host-side execution model where app code runs under host authorization. |
| Server-assisted | Mode where remote services help with catalog, gateway, or tools without becoming hidden default runtime. |

## Deprecated or compatibility terms

| Term | Status |
| --- | --- |
| `scene` entry | Legacy compatibility term. v0.3 apps should use `page`, `command`, `workflow`, `artifact`, `background-task`, or `settings`. |
| `home` entry | Legacy compatibility term. Use `page` for app home or dashboard. |

## Naming guidance

Use `Agent App` for the standard and `app` for a package instance. Use domain names such as `Content Factory App` for product examples. Avoid names that imply a single conversation box when the package owns UI, workflow, storage, and artifacts.

## Term groups

| Group | Terms to review together |
| --- | --- |
| Packaging | Agent App, `APP.md`, runtime package, package hash, manifest hash. |
| Runtime | Host, Capability SDK, capability, local runtime, server-assisted. |
| UI and workflow | Entry, expert, projection, readiness, overlay. |
| Composition | Knowledge template, Skill reference, Tool reference, Artifact type. |
| Governance | Eval, Evidence, secret slot, policy, compatibility. |

## How to use this glossary

Use the glossary as a naming guardrail when writing manifests, SDK docs, release notes, and host UI copy. If a proposed term overlaps an existing one, prefer the existing term unless the new concept owns a different runtime boundary.

## Ambiguity rules

- If it changes how the agent behaves, start with Skill.
- If it supplies trusted facts, start with Knowledge.
- If it calls an external system, start with Tool.
- If it is a durable output, start with Artifact.
- If it combines UI, workflow, storage, permissions, and lifecycle, use Agent App.
