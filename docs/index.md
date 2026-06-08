---
layout: home
title: Agent App
description: Installable agent application packages.

hero:
  name: Agent App
  text: Complete installable intelligent applications for host runtimes.
  tagline: "Package UI, workers, storage, workflows, Runtime, Context, Skills, Knowledge, Tools, Connectors, Artifacts, Evidence, Policy, Evals, permissions, install metadata, and App Server bridge contracts into a governed intelligent app."
  actions:
    - theme: brand
      text: Read the spec
      link: /en/specification
    - theme: alt
      text: 中文文档
      link: /zh/
    - theme: alt
      text: LLM full context
      link: /llms-full.txt

features:
  - title: Host platform model
    details: "Agent Apps can run in Lime Desktop, Lime App Shell, a runtime-backed shell, or a compatible Web Host while still using host-injected SDK capabilities."
  - title: Capability SDK boundary
    details: "Apps use lime.ui, lime.storage, lime.agent, lime.connectors, lime.artifacts, lime.evidence, lime.policy, and adjacent Agent standards without importing host internals."
  - title: App-like installation
    details: "Keeps in-Lime, standalone, runtime-backed, and web-host install modes while making the App Server bridge explicit."
---

## What to read first

Agent App is the application layer for agent hosts. If you are new to the standard, read in this order:

1. [What is Agent App?](/en/what-is-agent-app) explains the boundary between complete apps, experts, Runtime, UI, Context, Knowledge, Skills, Tools / Connectors, Artifacts, Evidence, Policy, and QC.
2. [Specification](/en/specification) defines the package contract.
3. [Quickstart](/en/authoring/quickstart) shows the smallest useful package.
4. [Runtime package design](/en/authoring/runtime-package) explains where real UI, worker, storage, and workflow implementation lives.
5. [Capability SDK](/en/client-implementation/capability-sdk) explains how apps call host capabilities without importing internals.
6. [Desktop host conformance](/en/client-implementation/desktop-host-conformance) explains how Lime Desktop Platform, Electron hosts, and Tauri hosts conform to the same standard.
7. [Content Factory example](/en/examples/content-factory) shows a product-level app shape.

## What the standard covers

| Area | Contract |
| --- | --- |
| Package | `APP.md`, manifest fields, runtime package folders, schemas, examples. |
| Entries | `page`, `panel`, `expert-chat`, `command`, `workflow`, `artifact`, `background-task`, `settings`. |
| Runtime | Host verification, projection, readiness, authorization, capability injection, execution, cleanup. |
| Context and data | Context requirements, app storage namespace, Knowledge templates, overlays, secrets, artifacts, evidence. |
| Trust and quality | Evidence, Policy, QC, evals, human review, fact grounding, provenance, readiness status. |
| Distribution | Release metadata, package hash, manifest hash, compatibility, tenant enablement. |

## Current Model

The current contract treats Agent App as a mini-program style package: the host shares user state and platform capabilities through governed SDK handles, while each app owns its UI, workflow state, app-local storage, and optional backend services. Local desktop storage should default to host-managed per-app SQLite. PostgreSQL belongs to cloud, enterprise, or team-shared backends rather than normal consumer installation.

## Package maturity ladder

| Level | What exists | Host expectation |
| --- | --- | --- |
| Catalog draft | `APP.md` with identity, entries, and intended setup. | Can be indexed and reviewed, but may not activate. |
| Runnable local app | Runtime assets, declared capabilities, storage namespace, permissions, and install mode. | Can install, project, authorize, and run under host policy. |
| Tenant-ready app | Overlay templates, Knowledge binding plan, secrets, evals, and release metadata. | Can be enabled per workspace without forking the official package. |
| Marketplace-ready app | Provenance hashes, migration plan, compatibility matrix, examples, and support policy. | Can be distributed, upgraded, audited, and removed predictably. |

## Design boundary

Agent App intentionally sits above the surrounding standards as the composition layer. Runtime executes tasks; UI renders interaction surfaces; Context assembles task context; Skills describe reusable procedures; Knowledge supplies trusted facts; Tools and Connectors call external systems; Artifacts persist deliverables; Evidence, Policy, and QC make results trustworthy. Agent App packages those pieces with workflow, storage, permissions, lifecycle, boundary files, install metadata, and bridge metadata so a compatible host can run a complete product experience without baking vertical business logic into host core.
