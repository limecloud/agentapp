---
title: Specification
description: Agent App package format draft.
---

# Specification

Agent App defines an installable application composition package for agent hosts. It follows the Agent Skills package style: directory-as-package, a top-level Markdown entry file, YAML frontmatter, progressive loading, optional support directories, and validation tooling.

## Package shape

```text
app-name/
├── APP.md
├── skills/
├── knowledge-templates/
├── workflows/
├── tools/
├── artifacts/
├── evals/
├── assets/
└── examples/
```

Only `APP.md` is required. Other directories are optional support assets.

## `APP.md`

`APP.md` MUST contain YAML frontmatter followed by Markdown guidance.

### Required frontmatter fields

| Field | Constraint |
| --- | --- |
| `name` | 1-64 characters, should match the package directory. |
| `description` | Human and AI-readable description. |
| `version` | App package version. |
| `status` | `draft`, `ready`, `needs-review`, `deprecated`, or `archived`. |
| `appType` | `agent-app`, `workflow-app`, `domain-app`, `customer-app`, or `custom`. |

### Recommended fields

| Field | Purpose |
| --- | --- |
| `runtimeTargets` | `local`, `hybrid`, or `server-assisted`. Local means the host runtime executes the app locally. |
| `entries` | Host-visible app entries such as scenes, commands, homes, workflows, or artifact surfaces. |
| `capabilities` | Standards or host capability surfaces required by the app. |
| `permissions` | Permission requests the host must resolve before execution. |
| `knowledgeTemplates` | Agent Knowledge slots that must or may be bound by user, tenant, or workspace. |
| `skillRefs` | Agent Skill packages required or recommended by the app. |
| `toolRefs` | Agent Tool surfaces or connectors required by the app. |
| `artifactTypes` | Agent Artifact contracts or viewer hints produced by the app. |
| `evals` | Quality gates, readiness checks, and review rules. |
| `presentation` | Store card, icon, category, home copy, and ordering hints. |
| `compatibility` | Host, standard, or capability version constraints. |
| `metadata` | Namespaced implementation metadata. |

## Entry kinds

| Kind | Meaning |
| --- | --- |
| `home` | App landing surface. |
| `scene` | Product scenario or slash-style entry. |
| `command` | Atomic command entry. |
| `workflow` | Multi-step guided flow. |
| `artifact` | Artifact viewer, editor, or export entry. |

## Runtime contract

A compatible host MUST:

1. Discover apps by `APP.md`.
2. Read catalog metadata before loading support files.
3. Install or activate an app only after user, tenant, or workspace consent.
4. Resolve entries, skills, knowledge templates, tools, artifacts, evals, and permissions into host-owned catalogs.
5. Keep execution in the host Agent Runtime.
6. Treat cloud registries as distribution and authorization surfaces, not hidden Agent Runtimes.
7. Keep customer data in Agent Knowledge packs, workspace files, or overlays.
8. Preserve app provenance on projected entries, artifacts, evals, and tool requirements.

## Overlay precedence

```text
Workspace Override > User Overlay > Tenant Overlay > App Default > Host Default
```

Official apps should not embed customer knowledge or credentials. Overlays bind customer knowledge, brand copy, tool credentials, default model choices, scene ordering, and evaluation thresholds.

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
    required: true
skillRefs:
  - id: gongzonghao-article-writer
    required: true
---

# AI Content Engineering

Use this app to build knowledge-backed content workflows.
```
