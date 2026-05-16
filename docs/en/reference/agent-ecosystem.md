---
title: Agent standards ecosystem
description: How Agent App relates to Runtime, UI, Context, Knowledge, Skills, Tools, Connectors, Artifacts, Evidence, Policy, QC, and domain standards.
---

# Agent standards ecosystem

Agent App is one layer in a larger agent standards ecosystem. It should compose neighboring standards rather than redefine them or narrow the ecosystem to one or two asset types.

Current fact source: **Agent App is the installable application composition layer; adjacent standards own reusable capabilities; Lime Host and Lime Cloud provide execution, connectors, policy, secrets, registry, and evidence infrastructure.**

## Standards map

| Layer | Owns | App relationship |
| --- | --- | --- |
| Agent App | Installable package, entries, runtime package, workflow, storage, readiness, release, v0.7 boundary files. | Composes a complete business product without becoming the host runtime. |
| Agent Runtime | Task execution, model routing, sessions, checkpoints, event streams, structured output. | App declares task intent through `app.runtime.yaml` and calls `lime.agent`. |
| Agent UI | Pages, panels, commands, viewers, Host Bridge interaction surfaces. | App declares entries and may ship UI assets, while Host renders them in controlled surfaces. |
| Agent Context | Context assembly, budgets, priority, compression, missing-context requests. | App describes what context each entry or workflow needs. |
| Agent Knowledge | Trusted facts, sources, provenance, freshness, retrieval or data mode. | App declares Knowledge templates and bindings, but does not ship private facts in official packages. |
| Agent Skills | Procedures, scripts, rubrics, workflow instructions, reusable tasks. | App references Skills for reusable methods without copying full procedures into `APP.md`. |
| Agent Tool / Connector | Callable external capabilities, MCP, CLI, API, browser adapters, auth, and side effects. | App declares tool requirements, integrations, operations, and permissions. |
| Agent Artifact | Durable deliverables, schemas, viewers, exporters, versions, states. | App declares artifact types and writes outputs through host services. |
| Agent Evidence | Support, provenance, trace, replay, redaction, eval records, audit export. | App records evidence refs for trust-sensitive runs. |
| Agent Policy | Permissions, risk, retention, cost, tenant rules, human-review thresholds. | App declares policy inputs; Host and Cloud enforce decisions. |
| Agent QC | Quality gates, acceptance criteria, regression checks, waivers, reports. | App declares evals, readiness, and review gates. |
| Domain standards | Long-running workspace semantics and file shapes for a business domain. | App may implement domain profiles without hardcoding domain logic into Host Core. |
| Lime Host / Cloud | Local execution, sandbox, secrets, registry, tenant policy, OAuth, webhook, scheduled sync. | App declares requirements; Host and Cloud provide governed capabilities. |

## What Agent App owns

Agent App owns composition:

- which user-visible entries, routes, commands, workflows, and settings exist
- which UI, worker, storage, workflow, and app-local state belong to the product
- which Runtime tasks are started and how structured results write back into app state
- which Context, Knowledge, Skill, Tool, Connector, Artifact, Evidence, Policy, and QC bindings are required
- which permissions, overlays, setup steps, readiness gates, and release metadata apply
- how runtime package assets are discovered, installed, projected, upgraded, and removed

It does not own the underlying standards.

## What Agent App must not absorb

- A private model gateway, scheduler, MCP runtime, or tool broker belongs to Runtime / Host / Cloud.
- OAuth, secrets, tenant policy, registry sync, and connector execution belong to Host / Cloud.
- Private customer facts belong to Knowledge packs, workspace files, secrets, or overlays.
- Reusable methods belong to Skills; domain-wide semantics belong to domain standards.
- Durable output contracts belong to Artifact; trust chains belong to Evidence; gates belong to Policy and QC.
- Vertical business logic should not be hardcoded into Host Core just because one app needs it.

## Why composition matters

Without an app layer, teams often hardcode vertical workflows into a host product. That makes the host harder to maintain and makes customer-specific work difficult to upgrade.

With Agent App, the host opens stable capabilities and the app packages business behavior on top.

## Example composition

```text
Business Workspace App
  App: entries, workflow state, storage schema, readiness, release
  Runtime: app.runtime.yaml, agent task events, structured output
  UI: dist/ui pages, panels, artifact viewers, Host Bridge
  Context: workspace context budget, source priority, missing-context prompts
  Knowledge: project_knowledge, policy_library, brand_rules
  Skills: research-method, draft-review-rubric, approval-playbook
  Tool / Connector: document_parser, crm_sync, spreadsheet_export, MCP / CLI / API adapters
  Artifact: draft, report, table, deck, export package
  Evidence: source refs, tool-call logs, human approval records, replay bundles
  Policy: data-retention rule, cost limit, external-write approval
  QC: fact grounding, tone fit, publish readiness, regression checks
  Domain profile: optional vertical workspace semantics
  Host / Cloud: lime.ui, lime.storage, lime.agent, lime.connectors, lime.secrets, lime.evidence
```

## Boundary rules

- If it defines task execution semantics, put it in Agent Runtime.
- If it defines an interaction surface, put it in Agent UI.
- If it decides context assembly, budget, or compression, put it in Agent Context.
- If it provides trusted source-grounded facts, put it in Agent Knowledge.
- If it tells the agent how to perform reusable work, put it in Agent Skills.
- If it calls an external system or creates a side effect, put it in Agent Tool / Connector.
- If it is a durable output, put it in Agent Artifact.
- If it proves source, trace, or auditability, put it in Agent Evidence.
- If it decides permission, cost, risk, or retention, put it in Agent Policy.
- If it gates acceptance quality, put it in Agent QC.
- If it composes installed product experience, lifecycle, state, and delivery, put it in Agent App.

## Implementation rule

Hosts should implement one stable Capability SDK boundary. Apps should not learn host internals for each standard. The SDK is the seam where adjacent standards become callable platform capabilities.

## Ecosystem layering

```text
Lime Host / Cloud
  provides runtime, sandbox, connectors, registry, secrets, policy, evidence
    -> Agent Runtime
       task execution, model/tool routing, sessions, streaming
    -> Agent UI
       host-controlled pages, panels, viewers, bridge
    -> Agent Context
       context assembly, budget, priority, compression
    -> Agent App
       installable business product composition
         -> Agent Knowledge
            grounded facts, sources, policies, examples
         -> Agent Skills
            reusable procedures and agent behavior
         -> Agent Tool / Connector
            external callable systems and side effects
         -> Agent Artifact
            durable outputs, schemas, viewers, exporters
         -> Agent Evidence / Policy / QC
            provenance, authorization, acceptance, audit, and review
         -> Domain standards
            vertical workspace profiles when needed
```

The standard should keep these layers separate so that each can evolve without forcing a full app migration. A new model execution contract should evolve in Runtime; a new interaction contract in UI; a new reusable method as a Skill; a new customer fact pack as Knowledge; a new connector as Tool / Connector; a new business workbench as an App.

## Integration rule

When adding a new agent standard, define whether Agent App references it by ID, embeds a descriptor, declares a required binding, or calls it through a capability. Avoid making Agent App the dumping ground for every detail.
