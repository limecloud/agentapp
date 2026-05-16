---
layout: home
title: Agent App
description: Installable agent application packages.

hero:
  name: Agent App
  text: Complete installable intelligent applications for host runtimes.
  tagline: "Package UI, workers, storage, workflows, Skills, Knowledge, Tools, Artifacts, Evals, and permissions into a local-running intelligent app."
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
    details: "Agent Apps run inside a host such as Lime Desktop. Registries distribute and authorize; the host injects SDK capabilities and executes locally."
  - title: Capability SDK boundary
    details: "Apps use lime.ui, lime.storage, lime.agent, lime.tools, lime.artifacts, and adjacent Agent standards without importing host internals."
  - title: App-like installation
    details: "Like mini-program platforms, a host installs an app package, resolves permissions, and exposes entries to users."
---

## What to read first

Agent App is the application layer for agent hosts. If you are new to the standard, read in this order:

1. [What is Agent App?](/en/what-is-agent-app) explains the boundary between complete apps, experts, Skills, and Knowledge.
2. [Specification](/en/specification) defines the v0.5 package contract.
3. [Quickstart](/en/authoring/quickstart) shows the smallest useful package.
4. [Runtime package design](/en/authoring/runtime-package) explains where real UI, worker, storage, and workflow implementation lives.
5. [Capability SDK](/en/client-implementation/capability-sdk) explains how apps call host capabilities without importing internals.
6. [Content Factory example](/en/examples/content-factory) shows a product-level app shape.

## What the standard covers

| Area | Contract |
| --- | --- |
| Package | `APP.md`, manifest fields, runtime package folders, schemas, examples. |
| Entries | `page`, `panel`, `expert-chat`, `command`, `workflow`, `artifact`, `background-task`, `settings`. |
| Runtime | Host verification, projection, readiness, authorization, capability injection, execution, cleanup. |
| Data | App storage namespace, Knowledge templates, overlays, secrets, artifacts, evidence. |
| Quality | Evals, human review, fact grounding, provenance, readiness status. |
| Distribution | Release metadata, package hash, manifest hash, compatibility, tenant enablement. |

## Current version

The current line is v0.5. It keeps the executable package contract from v0.3/v0.4 and adds layered configuration, AI auto-discovery hints (`triggers`, `quickstart`), bundled Skills (`skills/`), readiness self-check (`evals/readiness.yaml`), standardized errors (`app.errors.yaml`), enhanced signing (`app.signature.yaml`), first-class i18n (`app.i18n.yaml`), and runtime health (`evals/health.yaml`). Legacy `scene` and `home` entries remain compatibility-only.

## Package maturity ladder

| Level | What exists | Host expectation |
| --- | --- | --- |
| Catalog draft | `APP.md` with identity, entries, and intended setup. | Can be indexed and reviewed, but may not activate. |
| Runnable local app | Runtime assets, declared capabilities, storage namespace, and permissions. | Can install, project, authorize, and run under host policy. |
| Tenant-ready app | Overlay templates, Knowledge binding plan, secrets, evals, and release metadata. | Can be enabled per workspace without forking the official package. |
| Marketplace-ready app | Provenance hashes, migration plan, compatibility matrix, examples, and support policy. | Can be distributed, upgraded, audited, and removed predictably. |

## Design boundary

Agent App intentionally sits above Skills and Knowledge. A Skill describes how work is done; Knowledge supplies trusted facts; Tools call external systems; Artifacts persist deliverables. Agent App packages those pieces with UI, workflow, storage, permissions, and quality gates so the host can run a complete product experience without baking vertical business logic into host core.
