---
title: Description and discovery
description: How to write Agent App metadata that hosts, users, and agents can understand.
---

# Description and discovery

Discovery is the first contact between an Agent App and a host. A good package can be indexed, searched, reviewed, installed, and recommended without loading the full runtime package.

The goal is not marketing copy. The goal is a compact, truthful contract: who the app is for, what job it does, what it needs, what it produces, and when it should not be used.

## Discovery layers

| Layer | Reader | Purpose |
| --- | --- | --- |
| Manifest fields | host and registry | catalog, filtering, compatibility, install review |
| Presentation metadata | user | app card, category, summary, icon, sorting |
| Markdown body | user and AI assistant | setup guide, workflow explanation, risks, examples |
| Support files | app author and runtime | detailed workflows, schemas, evals, artifacts |

Hosts should be able to build a catalog card from `APP.md` alone.

## Required description shape

A useful description answers four questions:

```text
For [audience], this app helps [job], by using [host capabilities and resources], and produces [durable deliverables].
```

Example:

```yaml
name: content-factory-app
description: Content Factory App for knowledge building, content scenario planning, content production, and review.
presentation:
  category: content
  title: Content Factory App
  summary: Build project knowledge, plan content scenarios, create content assets, and review results in one installable app.
```

## Good and weak descriptions

| Weak | Better |
| --- | --- |
| Helps users work faster. | Drafts grounded support replies from product facts and support policy Knowledge Packs. |
| AI content tool. | Builds project knowledge, plans content scenarios, generates content assets, and records evidence. |
| Smart legal assistant. | Reviews contract clauses against approved playbooks and produces annotated risk reports. |
| Enterprise copilot. | Provides workflow entries for sales SOP preparation, customer research, and follow-up artifacts. |

The better examples state audience, task, required data, and output.

## Fields that improve discovery

| Field | Why it matters |
| --- | --- |
| `appType` | Helps hosts separate domain apps, workflow apps, customer apps, and custom packages. |
| `runtimeTargets` | Tells users whether the app runs locally, hybrid, or server-assisted. |
| `entries` | Lets hosts show concrete launch points before installation. |
| `knowledgeTemplates` | Reveals required setup before a user tries to run the app. |
| `toolRefs` | Makes connector and permission requirements visible. |
| `artifactTypes` | Shows expected durable outputs. |
| `evals` | Shows quality gates and acceptance rules. |
| `compatibility` | Prevents installing a package into unsupported hosts. |

## Markdown body structure

Use the body of `APP.md` for information that is too long for frontmatter:

1. What this app does.
2. Who should install it.
3. Main entries and workflow paths.
4. Required setup.
5. What data must be provided by the workspace.
6. What data must not be packaged.
7. Expected artifacts.
8. Quality gates.
9. Known limitations.
10. Upgrade and uninstall notes.

## Discovery for AI assistants

AI clients may read `APP.md` to decide whether to suggest an app. Write clear activation conditions:

- Use this app when the user wants to build a reusable content operations workflow.
- Do not use this app for one-off casual writing with no knowledge binding.
- Require `project_knowledge` before running publish workflows.
- Ask for file permission only when the user chooses source documents.

This prevents agents from treating every app as a generic prompt.

## Non-goals belong in discovery

A precise non-goal is useful. For example:

- This app does not include customer private data.
- This app does not run a cloud Agent Runtime by default.
- This app does not bypass host ToolHub permissions.
- This app does not replace Agent Skills or Agent Knowledge.

Non-goals reduce misuse and make security review faster.

## Review checklist

Before publishing, verify that a user can answer these questions from the catalog and `APP.md`:

- What job does this app do?
- Which entries will appear after install?
- What setup is required before first run?
- What data stays outside the package?
- What artifacts and evidence will be created?
- What capabilities and permissions are required?
- Which host versions are compatible?
