---
title: Agent App vs Skills and Knowledge
description: How Agent App composes but does not replace Agent Skills or Agent Knowledge.
---

# Agent App vs Skills and Knowledge

Agent Skills, Agent Knowledge, and Agent App answer different questions.

| Standard | Answers | Entry |
| --- | --- | --- |
| Agent Skills | How does the agent do the work? | `SKILL.md` |
| Agent Knowledge | What trusted facts and context can enter the model? | `KNOWLEDGE.md` |
| Agent App | Which capabilities, knowledge slots, entries, tools, artifacts, and evals make up an installable app? | `APP.md` |

## Decision tree

```mermaid
flowchart TD
  Asset[Candidate asset] --> DoQ{Does it tell the agent how to act?}
  DoQ -->|Yes| Skill[Agent Skill]
  DoQ -->|No| FactQ{Does it provide facts, sources, policy, examples, or context?}
  FactQ -->|Yes| Knowledge[Agent Knowledge]
  FactQ -->|No| ComposeQ{Does it compose entries, dependencies, permissions, and deliverables?}
  ComposeQ -->|Yes| App[Agent App]
  ComposeQ -->|No| Other[Host project file]
```

## Example

An AI content engineering application should package:

- Writing method and workflow as Agent Skills.
- Personal IP, product facts, and content operations playbooks as Agent Knowledge.
- `/IP Article`, `/Content Calendar`, required knowledge slots, tool requirements, artifact contracts, and quality gates as Agent App declarations.

Customer data belongs in Knowledge packs or overlays, not in the official Agent App package.
