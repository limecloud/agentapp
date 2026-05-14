---
name: customer-support-app
description: Customer support Agent App for grounded replies, policy lookup, and escalation notes.
version: 0.1.0
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
    kind: scene
    title: Draft Reply
    command: /Draft Reply
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
