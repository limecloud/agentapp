---
manifestVersion: 0.3.0
name: content-factory-app
description: 内容工厂，用于知识库构建、内容场景规划、批量生成、策略报告和运营复盘。
version: 0.3.0
status: ready
appType: domain-app
runtimeTargets:
  - local
  - hybrid
requires:
  lime:
    appRuntime: ">=0.3.0 <1.0.0"
  sdk: "@lime/app-sdk@^0.3.0"
  capabilities:
    lime.ui: "^0.3.0"
    lime.storage: "^0.3.0"
    lime.files: "^0.3.0"
    lime.agent: "^0.3.0"
    lime.knowledge: "^0.3.0"
    lime.tools: "^0.3.0"
    lime.artifacts: "^0.3.0"
    lime.workflow: "^0.3.0"
    lime.policy: "^0.3.0"
    lime.evidence: "^0.3.0"
    lime.secrets: "^0.3.0"
capabilities:
  - lime.ui
  - lime.storage
  - lime.files
  - lime.agent
  - lime.knowledge
  - lime.tools
  - lime.artifacts
  - lime.workflow
  - lime.policy
  - lime.evidence
  - lime.secrets
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
  namespace: content-factory-app
  schema: ./storage/schema.json
  migrations: ./storage/migrations
  uninstallPolicy: ask
entries:
  - key: dashboard
    kind: page
    title: 内容工厂首页
    route: /dashboard
  - key: knowledge_builder
    kind: workflow
    title: 知识库构建
    workflow: ./workflows/knowledge-builder.workflow.md
  - key: content_factory
    kind: page
    title: 内容生产工厂
    route: /content-factory
  - key: content_strategist
    kind: expert-chat
    title: 内容策略专家
    persona: ./agents/content-strategist.md
  - key: content_calendar
    kind: workflow
    title: 内容排期与复盘
    workflow: ./workflows/content-calendar.workflow.md
services:
  - key: content_worker
    kind: worker
    path: ./dist/worker/index.js
    required: true
workflows:
  - key: knowledge_builder
    path: ./workflows/knowledge-builder.workflow.md
    humanReview: true
  - key: content_calendar
    path: ./workflows/content-calendar.workflow.md
    humanReview: true
knowledgeTemplates:
  - key: personal_ip
    standard: agentknowledge
    type: personal-profile
    runtimeMode: data
    required: false
  - key: project_knowledge
    standard: agentknowledge
    type: brand-product
    runtimeMode: retrieval
    required: true
  - key: content_operations
    standard: agentknowledge
    type: content-operations
    runtimeMode: data
    required: false
skillRefs:
  - id: article-writer
    standard: agentskills
    activation: entry
    required: true
  - id: knowledge-builder
    standard: agentskills
    activation: entry
    required: true
toolRefs:
  - key: document_parser
    provider: lime.tools
    required: true
  - key: competitor_research
    provider: lime.tools
    required: false
  - key: presentation_export
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
  - key: presentation_deck
    standard: agentartifact
    required: false
evals:
  - key: anti_ai_tone
    kind: quality
    required: false
  - key: fact_grounding
    kind: quality
    evidenceRequired: true
    required: true
  - key: publish_readiness
    kind: human-review
    required: false
permissions:
  - key: read_selected_files
    scope: filesystem
    access: read
    required: true
    reason: 读取用户主动选择的资料文件，用于知识库构建。
  - key: call_content_tools
    scope: tool
    access: execute
    required: true
    reason: 调用文档解析、调研和导出工具。
secrets:
  - key: publishing_workspace_token
    provider: lime.secrets
    scope: workspace
    required: false
overlayTemplates:
  - key: tenant_defaults
    scope: tenant
    required: false
  - key: workspace_content_rules
    scope: workspace
    required: false
presentation:
  category: content
  title: 内容工厂
  summary: 面向内容团队的行业 Agent App。
compatibility:
  minHostVersion: 0.3.0
metadata:
  example: true
---

# 内容工厂

安装这个 App 后，宿主可以提供项目首页、知识库构建、内容生产、策略报告和运营复盘入口。

`APP.md` 只声明应用边界和加载线索；真实 UI、worker、storage schema、workflow 和 Artifact 由 runtime package 提供，并通过 `@lime/app-sdk` 调用宿主能力。

客户专属事实、品牌语气、禁用词、投放数据和私有 SOP 不进入官方 App 包，应通过 Agent Knowledge、workspace files、App storage、secrets 或 overlay 绑定。
