---
title: Skills and Knowledge interop
description: How Agent Apps compose Agent Skills and Agent Knowledge without merging their trust models.
---

# Skills and Knowledge interop

Agent App does not replace Agent Skills or Agent Knowledge. It composes them into an installable application.

The boundary is simple:

- Skills explain how work is performed.
- Knowledge provides trusted facts and context.
- Agent App declares which entries, capabilities, workflows, UI, storage, artifacts, and evals make up the app.

Keeping the boundary clear prevents unsafe execution and makes packages upgradeable.

## Trust model

| Asset | Trust question | Runtime behavior |
| --- | --- | --- |
| Agent Skill | Is this procedure safe to execute? | Activated after skill trust and permission checks. |
| Agent Knowledge | Is this data trustworthy and current? | Loaded as fenced data or retrieved context; not executed. |
| Agent App | Is this application package safe to install and run in the host? | Projected, checked for readiness, then executed through host capabilities. |

Do not put executable procedures into Knowledge. Do not put private facts into Skills. Do not put either directly into `APP.md` when a reusable reference is enough.

## Referencing Skills

An app can require or recommend Skills.

```yaml
skillRefs:
  - id: article-writer
    standard: agentskills
    activation: entry
    required: true
  - id: knowledge-builder
    standard: agentskills
    activation: workflow
    required: true
```

Recommended metadata:

- stable Skill ID
- required or optional
- version range or source when known
- entries that use the Skill
- degraded behavior if optional Skill is missing
- bundle digest if the Skill is packaged with the app

## Referencing Knowledge

Knowledge templates describe slots, not private facts.

```yaml
knowledgeTemplates:
  - key: project_knowledge
    standard: agentknowledge
    type: brand-product
    runtimeMode: retrieval
    required: true
  - key: personal_ip
    standard: agentknowledge
    type: personal-profile
    runtimeMode: data
    required: false
```

At install or workspace setup time, the host binds concrete Knowledge Packs to these slots.

## Builder Skill pattern

A common pattern is a Builder Skill that creates Knowledge Packs used later by the app.

```text
Source files
  -> Builder Skill
  -> Agent Knowledge Pack
  -> App Knowledge template binding
  -> Runtime retrieval
```

The Builder Skill is executable. The resulting Knowledge Pack is data. The app references both but should not collapse them into one asset.

## Runtime context assembly

When an entry runs, the host should assemble context from declared bindings:

1. Read the entry key.
2. Resolve the Knowledge templates used by that entry.
3. Retrieve or load Knowledge according to `runtimeMode`.
4. Select Skills required by the workflow or task.
5. Invoke Tools through host policy.
6. Record Evidence linking Knowledge sources, Skill IDs, Tool calls, and Artifacts.

This context assembly should be reproducible enough for review.

## Example: content app

| Need | Correct asset |
| --- | --- |
| How to interview a founder | Agent Skill |
| Founder background and voice | Agent Knowledge |
| Project dashboard and content workflow | Agent App |
| Document parsing | Agent Tool |
| Content table output | Agent Artifact |
| Fact grounding check | Eval and Evidence |

## Common mistakes

- Copying an entire Skill into the app guide.
- Embedding Knowledge Pack content in the official package.
- Treating Knowledge as a prompt that can execute actions.
- Making a Skill responsible for app storage or UI.
- Making the app depend on an undeclared Skill because it is installed on the author's machine.

## Checklist

- Every required procedure is a Skill or app runtime workflow.
- Every private fact is a Knowledge Pack or workspace file.
- Every Knowledge template has a type and required flag.
- Every Skill reference has an activation context.
- Runtime evidence links app entry, Skill, Knowledge source, Tool call, and Artifact.
