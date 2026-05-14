---
layout: home
title: Agent App
description: Installable agent application packages.

hero:
  name: Agent App
  text: Installable intelligent applications.
  tagline: "A packaging standard for complete intelligent apps with UI, workflows, storage, and SDK-bound host capabilities."
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
| Entries | Which scenes, commands, homes, workflows, or artifact surfaces can the host expose? |
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
- [AI content engineering example](./examples/content-engineering.md)
