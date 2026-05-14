---
name: content-engineering-app
description: AI content engineering Agent App for personal IP, product facts, and operations workflows.
version: 0.1.0
status: ready
appType: agent-app
runtimeTargets:
  - local
  - hybrid
capabilities:
  - agentskills
  - agentknowledge
  - agenttool
  - agentartifact
  - agentevidence
entries:
  - key: ip_article
    kind: scene
    title: IP Article
    command: /IP Article
  - key: content_calendar
    kind: workflow
    title: Content Calendar
    command: /Content Calendar
knowledgeTemplates:
  - key: personal_ip
    standard: agentknowledge
    type: personal-profile
    required: true
  - key: content_operations
    standard: agentknowledge
    type: content-operations
    required: false
skillRefs:
  - id: gongzonghao-article-writer
    required: true
  - id: personal-ip-knowledge-builder
    required: false
toolRefs:
  - key: competitor_research
    provider: agenttool
    required: false
artifactTypes:
  - key: article_draft
    standard: agentartifact
    required: true
evals:
  - key: anti_ai_tone
    required: false
  - key: fact_grounding
    required: true
presentation:
  category: content
  title: AI Content Engineering
---

# AI Content Engineering App

Install this app into a host runtime to produce knowledge-backed articles, content calendars, operation cases, and publish-readiness reviews.

Customer profiles, brand facts, and private operations playbooks must be bound as Agent Knowledge packs or overlays.
