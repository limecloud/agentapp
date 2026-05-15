---
title: Agent standards ecosystem
description: How Agent App relates to Skills, Knowledge, Tools, Runtime, Artifacts, Evidence, Policy, and QC.
---

# Agent standards ecosystem

Agent App is one layer in a larger agent standards ecosystem. It should compose neighboring standards rather than redefine them.

## Standards map

| Layer | Owns | App relationship |
| --- | --- | --- |
| Agent Skills | Procedures, scripts, workflow instructions, reusable tasks. | App references Skills for how work is performed. |
| Agent Knowledge | Trusted facts, sources, context, provenance, freshness. | App declares Knowledge templates and bindings. |
| Agent Tool | Callable external or host capabilities. | App declares Tool requirements and permissions. |
| Agent Context | Context assembly, budgets, priority, compression. | App describes what context each entry needs. |
| Agent UI | Structured interaction surfaces. | App declares entries and may ship UI runtime package. |
| Agent Artifact | Durable deliverables and viewers. | App declares artifact types and creates outputs. |
| Agent Evidence | Support, provenance, replay, eval records. | App records evidence for trust-sensitive runs. |
| Agent Policy | Permissions, risk, retention, cost, tenant rules. | App declares policy inputs; host enforces decisions. |
| Agent Runtime | Execution of tasks, tools, models, workflows. | App runs through host runtime, not a hidden runtime. |
| Agent QC | Quality gates and acceptance criteria. | App declares evals and review gates. |

## What Agent App owns

Agent App owns composition:

- which entries exist
- which UI and workflows belong to the app
- which Knowledge slots are required
- which Skills and Tools are needed
- which Artifacts can be produced
- which Evals gate outputs
- which permissions and overlays apply
- how runtime package assets are discovered

It does not own the underlying standards.

## Why composition matters

Without an app layer, teams often hardcode vertical workflows into a host product. That makes the host harder to maintain and makes customer-specific work difficult to upgrade.

With Agent App, the host opens stable capabilities and the app packages business behavior on top.

## Example composition

```text
Content Factory App
  entries: dashboard, content_factory, content_calendar
  Skills: article-writer, knowledge-builder
  Knowledge: project_knowledge, personal_ip, content_operations
  Tools: document_parser, competitor_research
  Artifacts: content_table, strategy_report
  Evals: fact_grounding, anti_ai_tone
  Host capabilities: lime.ui, lime.storage, lime.agent, lime.artifacts
```

## Boundary rules

- If it tells the agent how to act, it is likely a Skill.
- If it provides trusted facts, it is Knowledge.
- If it calls an external capability, declare a Tool.
- If it is a durable output, declare an Artifact.
- If it proves quality or provenance, record Evidence or Eval.
- If it composes the product experience, it belongs in Agent App.

## Implementation rule

Hosts should implement one stable Capability SDK boundary. Apps should not learn host internals for each standard. The SDK is the seam where adjacent standards become callable platform capabilities.

## Ecosystem layering

```text
Agent App
  composes entries, runtime package, workflow, storage, permissions, release
    -> Agent Skills
       reusable procedures and agent behavior
    -> Agent Knowledge
       grounded facts, sources, policies, examples
    -> Agent Tools
       external callable systems
    -> Agent Artifacts
       durable outputs and viewers
    -> Agent Evals / QC / Evidence
       acceptance, provenance, audit, and review
```

The standard should keep these layers separate so that each can evolve without forcing a full app migration. A new writing method should be publishable as a Skill; a new customer fact pack should be publishable as Knowledge; a new business workbench should be publishable as an App.

## Integration rule

When adding a new agent standard, define whether Agent App references it by ID, embeds a descriptor, declares a required binding, or calls it through a capability. Avoid making Agent App the dumping ground for every detail.
