---
layout: home
title: Agent App
description: Installable agent application packages.

hero:
  name: Agent App
  text: Executable intelligent applications.
  tagline: "A v0.5 package standard for complete intelligent apps with UI, workflows, storage, typed SDK calls, overlays, readiness, layered manifests, AI auto-discovery triggers, bundled Skills, standardized error codes, signing, i18n, and runtime health."
  actions:
    - theme: brand
      text: Read specification
      link: /en/specification
    - theme: alt
      text: Quickstart
      link: /en/authoring/quickstart
    - theme: alt
      text: Ecosystem
      link: /en/reference/agent-ecosystem
    - theme: alt
      text: LLM context
      link: ../llms-full.txt

features:
  - title: Runtime package
    details: "APP.md is discovery only; real UI, workers, storage, workflows, and business implementation live in the runtime package."
  - title: Capability SDK
    details: "Apps call Lime through stable capabilities such as lime.ui, lime.storage, lime.agent, and lime.artifacts instead of internals."
  - title: Capability composition
    details: "References Skills, Knowledge templates, Tools, Artifacts, Evals, UI entries, Context, Evidence, Policy, and QC."
  - title: Mini-program mental model
    details: "A host platform opens capabilities; apps declare entries and permissions; users install apps into a local environment."
---

## What Agent App defines

| Contract | Question answered |
| --- | --- |
| App package | What installable app is this and what does it contain? |
| Entries | Which pages, commands, workflows, artifacts, background tasks, or settings can the host expose? |
| Capabilities | Which host standards and capability surfaces does this app need? |
| Knowledge templates | Which Agent Knowledge slots must the user or tenant bind? |
| Projection | How does a host compile the app into a catalog without inventing a second runtime? |
| Readiness | What must be installed, authorized, or reviewed before the app can run? |

## Quick links

- [What is Agent App?](./what-is-agent-app.md)
- [Specification](./specification.md)
- [App vs Skills and Knowledge](./agent-app-vs-skills-knowledge.md)
- [Runtime package design](./authoring/runtime-package.md)
- [Capability SDK](./client-implementation/capability-sdk.md)
- [Runtime model](./client-implementation/runtime-model.md)
- [Content Factory example](./examples/content-factory.md)

## Recommended path by role

| Role | Start here | Then read |
| --- | --- | --- |
| App author | [Quickstart](./authoring/quickstart.md) | Runtime package, manifest design, permissions, release. |
| Host implementor | [Runtime model](./client-implementation/runtime-model.md) | Capability SDK, projection, readiness, security. |
| Standards reviewer | [Specification](./specification.md) | JSON Schemas, glossary, version notes. |
| Product planner | [What is Agent App?](./what-is-agent-app.md) | App vs Skills and Knowledge, examples, mini-program analogy. |

## v0.5 promise

A v0.5 app should be understandable before execution, installable without changing host core, runnable through typed capability handles, and removable with a clear cleanup plan. APP.md frontmatter stays small while detailed configuration moves into layered files. `triggers` and `quickstart` let AI clients route requests correctly. `skills/` bundles Agent Skills. `evals/readiness.yaml` shifts readiness from host-coded logic to declarative app intent. `app.errors.yaml` provides stable error codes and recovery. `app.signature.yaml` strengthens signing and revocation. `app.i18n.yaml` makes i18n first-class. If a package cannot explain its entries, permissions, data boundary, runtime assets, and quality gates from documentation and manifest fields, it is not ready to be distributed as an Agent App.

## What a complete app page should answer

Every Agent App page in this documentation should help a reader answer four questions: what boundary this concept owns, which manifest or runtime fields express it, how a host should implement it, and what makes it ready for release. If a page only defines a term but does not show its implementation, readiness, or failure mode, treat it as incomplete.

## Typical implementation sequence

1. Define the app boundary and user-visible entries.
2. Declare capabilities, storage, Knowledge templates, Tools, Artifacts, permissions, and Evals.
3. Add runtime package assets and call host services through the Capability SDK.
4. Build projection and readiness checks before enabling execution.
5. Release with package hashes, compatibility metadata, overlays, and rollback guidance.
