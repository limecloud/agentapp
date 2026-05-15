---
name: customer-support-app
description: Customer support Agent App for grounded replies, policy lookup, and escalation notes.
version: 0.3.0
status: draft
appType: agent-app
runtimeTargets:
  - local
capabilities:
  - agentknowledge
  - agenttool
  - agentartifact
  - agentpolicy
entries:
  - key: draft_reply
    kind: command
    title: Draft Reply
    command: /draft-reply
knowledgeTemplates:
  - key: product_facts
    standard: agentknowledge
    type: brand-product
    required: true
  - key: support_policy
    standard: agentknowledge
    type: organization-knowhow
    required: true
toolRefs:
  - key: ticket_lookup
    provider: agenttool
    required: false
artifactTypes:
  - key: reply_draft
    standard: agentartifact
    required: true
evals:
  - key: policy_compliance
    required: true
presentation:
  category: support
  title: Customer Support
---

# Customer Support App

Install this app to draft grounded support replies and escalation notes.

## Product boundary

This package is a draft support workbench, not a standalone ticketing system. The host owns installation, permission prompts, storage, secrets, Evidence, and the runtime bridge. The app owns the support-specific entries, required Knowledge slots, reply artifact shape, and policy compliance checks.

## Intended entries

| Entry | Kind | Runtime expectation |
| --- | --- | --- |
| `draft_reply` | `command` | Starts a reply-drafting task from the active ticket or pasted customer message. |
| `policy_lookup` | `panel` | Shows relevant policy Knowledge with source links and version metadata. |
| `escalation_note` | `workflow` | Produces an internal note for specialist or manager handoff. |
| `reply_draft` | `artifact` | Stores the generated reply, citations, edits, and approval state. |

Only `draft_reply` is declared in the draft frontmatter. The other entries describe the complete target shape a production version would add.

## Required setup

- Bind `product_facts` to a current product or service Knowledge Pack.
- Bind `support_policy` to the approved support-policy Knowledge Pack.
- Optionally connect `ticket_lookup` for ticket metadata, history, and customer context.
- Configure tenant overlays for tone, prohibited promises, escalation rules, and region-specific policy.
- Review permissions before enabling any write-back Tool.

## Drafting workflow

```text
Receive ticket context
→ retrieve product facts and support policy
→ identify customer intent and risk category
→ draft answer with citations
→ run policy compliance eval
→ ask human agent to approve or edit
→ create reply_draft artifact
```

## Quality and safety gates

- Do not answer from generic model memory when required Knowledge is missing.
- Do not cite policy unless the source exists in bound Knowledge.
- Do not mark a draft as approved when `policy_compliance` fails.
- Do not write back to ticketing systems without an explicit Tool permission.
- Preserve rejected drafts and eval reasons so reviewers can audit the decision.

## Upgrade path

To make this fixture production-ready, add runtime package assets, explicit `requires.capabilities`, storage schema, workflow descriptors, artifact viewer, secrets for ticket connectors, permissions for read/write operations, and release metadata with package provenance.
