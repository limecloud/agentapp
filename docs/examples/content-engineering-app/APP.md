---
manifestVersion: 0.2.0
name: content-engineering-app
description: AI content engineering Agent App with its own UI, storage, workflows, expert entry, and knowledge-backed content pipeline.
version: 0.2.0
status: ready
appType: domain-app
runtimeTargets:
  - local
  - hybrid
requires:
  lime:
    appRuntime: ">=0.2.0 <1.0.0"
  capabilities:
    lime.ui: "^0.1.0"
    lime.storage: "^0.1.0"
    lime.files: "^0.1.0"
    lime.agent: "^0.1.0"
    lime.knowledge: "^0.1.0"
    lime.tools: "^0.1.0"
    lime.artifacts: "^0.1.0"
    lime.evidence: "^0.1.0"
capabilities:
  - lime.ui
  - lime.storage
  - lime.files
  - lime.agent
  - lime.knowledge
  - lime.tools
  - lime.artifacts
  - lime.evidence
  - lime.policy
  - agentskills
  - agentknowledge
runtimePackage:
  ui:
    path: ./dist/ui
  worker:
    path: ./dist/worker
  storage:
    schema: ./storage/schema.json
    migrations: ./storage/migrations
storage:
  namespace: content-engineering-app
  schema: ./storage/schema.json
  migrations: ./storage/migrations
entries:
  - key: dashboard
    kind: page
    title: Content Engineering Dashboard
    route: /dashboard
  - key: knowledge_builder
    kind: workflow
    title: Knowledge Builder
    workflow: ./workflows/knowledge-builder.workflow.md
  - key: content_factory
    kind: page
    title: Content Factory
    route: /content-factory
  - key: content_strategist
    kind: expert-chat
    title: Content Strategist
    persona: ./agents/content-strategist.md
  - key: content_calendar
    kind: workflow
    title: Content Calendar
    workflow: ./workflows/content-calendar.workflow.md
knowledgeTemplates:
  - key: personal_ip
    standard: agentknowledge
    type: personal-profile
    required: false
  - key: project_knowledge
    standard: agentknowledge
    type: brand-product
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
  - key: document_parser
    provider: lime.tools
    required: true
  - key: competitor_research
    provider: lime.tools
    required: false
artifactTypes:
  - key: content_table
    standard: agentartifact
    required: true
  - key: article_draft
    standard: agentartifact
    required: false
  - key: strategy_report
    standard: agentartifact
    required: false
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

Install this app into a host runtime to manage projects, build layered knowledge, exhaust content scenes, generate copy batches, and produce traceable content artifacts.

This is a product-level Agent App example: `APP.md` declares the package, while UI, storage, and workflows live in the runtime package. Customer profiles, brand facts, and private operations playbooks must be bound as Agent Knowledge packs, app storage, or overlays.
