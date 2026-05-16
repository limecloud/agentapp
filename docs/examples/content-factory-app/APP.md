---
manifestVersion: 0.5.0
name: content-factory-app
displayName: 内容工厂
displayNameI18n:
  en-US: Content Factory
  zh-CN: 内容工厂
shortDescription: 内容团队的一站式策划 / 生产 / 复盘工作台
shortDescriptionI18n:
  en-US: One-stop planning, production, and review workspace for content teams.
  zh-CN: 内容团队的一站式策划 / 生产 / 复盘工作台
description: 内容工厂帮助团队规划、生产和管理营销内容。使用场景："创建内容日历"、"批量生成文案"、"内容资产管理"、"知识库构建"。
version: 0.5.0
status: ready
appType: domain-app
keywords:
  - content
  - marketing
  - copywriting
  - calendar
  - asset
  - knowledge
categories:
  - content
  - marketing
  - productivity
publisher:
  publisherId: lime-official
  name: Lime Cloud
  displayName: Lime Cloud
  kind: platform
  verified: true
  verifiedDomain: limecloud.example
  homepage: https://limecloud.example
  email: apps@limecloud.example
  logoUrl: https://limecloud.example/brand/lime.svg
  country: CN
author:
  name: Lime Cloud Content Team
  email: content-apps@limecloud.example
  url: https://limecloud.example/team/content
maintainers:
  - name: Lime Cloud App Maintainers
    email: app-maintainers@limecloud.example
    role: lead
  - name: Lime Cloud Content Quality
    email: content-quality@limecloud.example
    role: quality
createdAt: 2026-01-08T00:00:00Z
updatedAt: 2026-05-16T00:00:00Z
releasedAt: 2026-05-16T00:00:00Z
supportWindow:
  channel: stable
  supportedUntil: 2027-05-16T00:00:00Z
homepage: https://limecloud.example/apps/content-factory
repository:
  type: git
  url: https://github.com/limecloud/agentapp.git
  directory: docs/examples/content-factory-app
documentation: https://limecloud.github.io/agentapp/zh/examples/content-factory
issues: https://github.com/limecloud/agentapp/issues
changelog: ./CHANGELOG.md
license: Apache-2.0
licenseUrl: https://www.apache.org/licenses/LICENSE-2.0
copyright: Copyright (c) 2026 Lime Cloud. All rights reserved.
support:
  email: support@limecloud.example
  url: https://limecloud.example/support
  statusPageUrl: https://status.limecloud.example
  discussionsUrl: https://github.com/limecloud/agentapp/discussions
  responseSla: 工作时间内 1 个工作日响应；P0 故障 4 小时内响应。
distribution:
  channel: stable
  visibility: public
  pricing: free
  billingModel: none
  regions:
    - cn
    - us
    - jp
compliance:
  dataResidency:
    - cn
    - global
  dataRetention: 内容场景与资产保留 365 天；evidence 保留 90 天；任务执行日志保留 30 天。
  certifications:
    - soc2
    - iso27001
    - gdpr
  privacyPolicyUrl: https://limecloud.example/legal/privacy
  termsOfServiceUrl: https://limecloud.example/legal/terms
  dpaUrl: https://limecloud.example/legal/dpa
  subprocessorsUrl: https://limecloud.example/legal/subprocessors
runtimeTargets:
  - local
  - hybrid
requires:
  sdk: "@lime/app-sdk@^0.5.0"
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
triggers:
  keywords:
    - 内容
    - 营销
    - 文案
    - 创意
    - 日历
    - 知识库
    - content
    - marketing
    - copywriting
  scenarios:
    - content_planning
    - batch_generation
    - asset_management
    - knowledge_build
quickstart:
  entry: dashboard
  sampleWorkflow: knowledge_builder
  setupSteps:
    - bind_knowledge: project_knowledge
    - configure_tool: document_parser
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
skills:
  bundled:
    - path: ./skills/content_ideation
      activation: on-demand
    - path: ./skills/copywriting
      activation: on-demand
  references:
    - id: knowledge-builder
      version: ^1.0.0
      activation: on-demand
      required: true
    - id: article-writer
      version: ^1.0.0
      activation: on-demand
      required: true
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
  minHostVersion: 0.5.0
metadata:
  example: true
---

# 内容工厂

一站式内容生产工作台，从知识库构建、内容场景规划、批量生产、人工审核到资产管理的完整闭环。

`APP.md` 只声明应用边界和加载线索；真实 UI、worker、storage schema、workflow 和 Artifact 由 runtime package 提供，并通过 `@lime/app-sdk` 调用宿主能力。

客户专属事实、品牌语气、禁用词、投放数据和私有 SOP 不进入官方 App 包，应通过 Agent Knowledge、workspace files、App storage、secrets 或 overlay 绑定。

## 何时使用

- ✅ 需要从原始资料构建可检索的知识库
- ✅ 规划内容主题、场景、日历和发布渠道
- ✅ 批量生成多版本文案和创意
- ✅ 团队协作审核与人工确认
- ✅ 内容资产版本管理与复用
- ✅ 内容投放后的策略复盘

## 不适用场景

- ❌ 单次零散文案（用通用 Chat 即可）
- ❌ 代码注释或开发文档（使用 Code Skills）
- ❌ 数据分析报告（使用 Analytics App）
- ❌ 客服对话回复（使用 Customer Support App）

## 工作流程

1. **知识库构建** - 从素材文件、网页、内部 SOP 构建可检索的项目知识库
2. **场景规划** - 根据品牌、受众、渠道生成内容场景与日历
3. **批量生产** - 调用 Agent 按场景批量生成文案与创意
4. **人工审核** - 团队审阅与修改，记录评论与版本
5. **资产沉淀** - 通过 Artifact 持久化内容资产并支持导出
6. **复盘归因** - 根据投放数据回到知识库与策略迭代

## 快速开始

安装后宿主会引导你完成最小化 setup：

1. 在 `dashboard` 入口点击"开始"。
2. 绑定 `project_knowledge` 知识库（必需）。
3. 启用 `document_parser` 工具（必需）。
4. 进入 `knowledge_builder` workflow 跑通示例项目。

## 红旗信号

⚠️ 出现以下情况说明使用方式偏离正轨：

- App 频繁回跳到通用 Chat 才能完成业务流程
- 用户必须把数据复制粘贴到外部工具
- Agent 任务失败后无法在 App 内重试
- 同一份知识被多次手工录入而不是绑定到 `project_knowledge`
- 客户私有信息被写入官方 package 而不是 overlay

## 验证清单

✅ 安装后应能：

- [ ] 在 Agent Apps 页面看到内容工厂卡片
- [ ] 进入 `dashboard` 看到工作台首页
- [ ] 启动 `knowledge_builder` workflow 并完成示例项目
- [ ] 看到生成的 `content_table` Artifact 和 `fact_grounding` Evidence
- [ ] 在 `content_factory` 入口批量生成文案
- [ ] 在 `content_calendar` 入口完成排期与复盘
- [ ] 卸载 App 时按 `uninstallPolicy: ask` 询问数据保留

## 故障排查

### 问题：Agent 任务立即失败

可能原因：

1. 未绑定 `project_knowledge` 知识库（`needs-setup`）
2. `document_parser` 工具未启用（`blocked`）
3. SDK 版本低于 `^0.5.0`

排查命令：

```bash
agentapp-ref readiness ./content-factory-app --workspace ./workspace
agentapp-ref validate ./content-factory-app --version 0.5.0
```

### 问题：内容资产无法导出

可能原因：

1. `presentation_export` 工具未启用
2. 缺少导出格式 viewer / exporter

排查方式：

```bash
agentapp-ref project ./content-factory-app | jq '.artifactTypes'
```

### 问题：人工审核节点卡住

工作流停在 `human_confirm`，确认：

1. UI host 已正常加载 `content_factory` 页面
2. 当前用户具备 `call_content_tools` 权限
3. policy 没有禁用 `human-review` 节点
