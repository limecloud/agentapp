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

## How they work together

```mermaid
flowchart LR
  User[User launches app entry] --> App[APP.md entry]
  App --> Skill[Agent Skill: how to do it]
  App --> KSlot[Knowledge Template: required knowledge slot]
  KSlot --> KPack[Agent Knowledge Pack: concrete customer facts]
  App --> Tool[Agent Tool: callable capability]
  App --> Artifact[Agent Artifact: deliverable]
  App --> Eval[Eval / QC: deliverability]
```

Agent App does not copy procedural details from Skills or factual content from Knowledge. It declares how the host combines those assets into an application.

## Content engineering example

| Asset | Correct place | Reason |
| --- | --- | --- |
| How to interview a founder and compile IP facts | Agent Skill | It is a knowledge-production method. |
| Founder history, voice, boundaries, quotes | Agent Knowledge | It is source-grounded persona data. |
| How to draft articles and remove AI tone | Agent Skill | It is writing and review procedure. |
| `/IP Article`, `/Content Calendar`, `/Review Report` | Agent App | They are user-visible entries. |
| Competitor research, image generation, Feishu export | Agent Tool | They are external capabilities. |
| Article draft, script batch, strategy report | Agent Artifact | They are durable deliverables. |
| Fact grounding, voice fit, publish readiness | Eval / Agent QC / Evidence | They are quality and trust checks. |

## Common mistakes

- Embedding customer data in an official app package.
- Putting full writing procedures in `APP.md` instead of a Skill.
- Treating Knowledge as executable instructions.
- Inventing a new tool protocol for one app.
- Letting a cloud registry become a hidden Agent Runtime.
- Hardcoding business entries in host core instead of generating them from app projection.

## Fixed conclusions

- App is composition, not execution.
- Skill is procedure, not customer fact.
- Knowledge is data, not instruction.
- Runtime is execution truth, not app manifest.
- Cloud may distribute apps, but it should not run agents by default.
