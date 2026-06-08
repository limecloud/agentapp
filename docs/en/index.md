---
layout: home
title: Agent App
description: Installable agent application packages.

hero:
  name: Agent App
  text: Executable intelligent applications.
  tagline: "A package standard for complete intelligent apps that run through shared host capabilities and App Server bridge contracts."
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
  - title: Standalone install
    details: "Install metadata supports in-host, standalone, runtime-backed, and web-host delivery while keeping runtime execution host-mediated."
  - title: Capability SDK
    details: "Apps call Lime through stable capabilities such as lime.ui, lime.storage, lime.agent, lime.connectors, lime.artifacts, and lime.evidence instead of internals."
  - title: Capability composition
    details: "References Runtime, UI, Context, Knowledge, Skills, Tools / Connectors, Artifacts, Evidence, Policy, QC, and Evals."
  - title: Mini-program mental model
    details: "A host platform opens capabilities; apps declare entries and permissions; users install apps into a local environment."
---

## What Agent App defines

| Contract | Question answered |
| --- | --- |
| App package | What installable app is this and what does it contain? |
| Entries | Which pages, commands, workflows, artifacts, background tasks, or settings can the host expose? |
| Capabilities | Which host standards and capability surfaces does this app need? |
| Bindings and context | Which Context, Knowledge, Skill, Tool, Connector, Artifact, Evidence, Policy, and QC dependencies must the user or tenant satisfy? |
| Projection | How does a host compile the app into a catalog without inventing a second runtime? |
| Readiness | Which runtime, connector, permission, evidence, and quality gates must pass before the app can run? |

## Quick links

- [What is Agent App?](./what-is-agent-app.md)
- [Specification](./specification.md)
- [Standards ecosystem boundary](./agent-standards-boundary.md)
- [Runtime package design](./authoring/runtime-package.md)
- [Capability SDK](./client-implementation/capability-sdk.md)
- [Desktop host conformance](./client-implementation/desktop-host-conformance.md)
- [Runtime model](./client-implementation/runtime-model.md)
- [Content Factory example](./examples/content-factory.md)
- [Lightweight Content Ops example](./examples/lightweight-content-ops.md)

## Recommended path by role

| Role | Start here | Then read |
| --- | --- | --- |
| App author | [Quickstart](./authoring/quickstart.md) | Runtime package, manifest design, permissions, release. |
| Host implementor | [Desktop host conformance](./client-implementation/desktop-host-conformance.md) | Runtime model, Capability SDK, projection, readiness, security. |
| Standards reviewer | [Specification](./specification.md) | JSON Schemas, glossary, version notes. |
| Product planner | [What is Agent App?](./what-is-agent-app.md) | Standards ecosystem boundary, examples, mini-program analogy. |

## Current Promise

A current app should be understandable before execution, installable without changing host core, runnable through typed capability handles, observable through RuntimeCore-derived Agent task events, explicit about delivery boundaries, clear about how users install it, and explicit about how `lime.agent` / `lime.workflow` calls enter App Server JSON-RPC. It should also follow the shared host model: user state and platform capabilities come from the host, while app-local storage and app backend services stay isolated. If a package cannot explain its entries, permissions, data boundary, runtime assets, task output contracts, external integrations, side effects, human approval boundaries, install mode, runtime bridge, and local storage placement, it is not ready to be distributed as an Agent App.

## What a complete app page should answer

Every Agent App page in this documentation should help a reader answer four questions: what boundary this concept owns, which manifest or runtime fields express it, how a host should implement it, and what makes it ready for release. If a page only defines a term but does not show its implementation, readiness, or failure mode, treat it as incomplete.

## Typical implementation sequence

1. Define the app boundary and user-visible entries.
2. Write the requirement, boundary, integration, and operation files.
3. Write the install contract for in-host, standalone, runtime-backed, or web-host distribution.
4. Write the App Server bridge profile for `lime.agent` / `lime.workflow` execution.
5. Declare capabilities, storage, Runtime, UI, Context, Knowledge, Skills, Tools / Connectors, Artifacts, Evidence, Policy, QC, permissions, and Evals.
6. Add runtime package assets and call host services through the Capability SDK.
7. Build projection and readiness checks before enabling execution.
8. Release with package hashes, compatibility metadata, overlays, install metadata, bridge metadata, and rollback guidance.
