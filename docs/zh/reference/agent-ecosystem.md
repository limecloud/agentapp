---
title: Agent 标准生态
description: Agent App 与 Skills、Knowledge、Tools、Runtime、Artifacts、Evidence、Policy、QC 的关系。
---

# Agent 标准生态

Agent App 是 Agent 标准生态中的应用层。它应该组合相邻标准，而不是重新定义它们。

## 标准地图

| 层 | 负责什么 | 与 App 的关系 |
| --- | --- | --- |
| Agent Skills | 流程、脚本、任务工艺、可复用步骤。 | App 引用 Skills 来完成工作。 |
| Agent Knowledge | 可信事实、来源、上下文、provenance、新鲜度。 | App 声明 Knowledge templates 和 bindings。 |
| Agent Tool | 可调用外部能力或宿主能力。 | App 声明 Tool requirements 和权限。 |
| Agent Context | 上下文组装、预算、优先级、压缩。 | App 描述每个 entry 需要的上下文。 |
| Agent UI | 结构化交互界面。 | App 声明 entries，也可以携带 UI runtime package。 |
| Agent Artifact | 持久交付物和 viewer。 | App 声明 artifact types 并创建输出。 |
| Agent Evidence | 支撑、provenance、replay、eval records。 | App 为高信任运行记录 Evidence。 |
| Agent Policy | 权限、风险、保留、成本、租户规则。 | App 声明 policy 输入，宿主执行决策。 |
| Agent Runtime | task、tool、model、workflow 执行。 | App 通过宿主 Runtime 运行，不自带隐藏 Runtime。 |
| Agent QC | 质量门禁和验收标准。 | App 声明 eval 和 review gates。 |

## Agent App 负责什么

Agent App 负责组合：entry、UI、workflow、Knowledge slot、Skill、Tool、Artifact、Eval、permission、overlay、runtime package 发现和安装边界。

它不负责重新定义底层标准。

## 为什么需要组合层

没有 App 层，团队很容易把垂直业务写死到宿主产品里，导致 Core 越来越重，客户差异难升级。

有了 Agent App，宿主开放稳定能力，业务 App 在能力之上组合自己的产品流程。

## 组合示例

```text
APP 内容工厂
  entries: dashboard, content_factory, content_calendar
  Skills: article-writer, knowledge-builder
  Knowledge: project_knowledge, personal_ip, content_operations
  Tools: document_parser, competitor_research
  Artifacts: content_table, strategy_report
  Evals: fact_grounding, anti_ai_tone
  Host capabilities: lime.ui, lime.storage, lime.agent, lime.artifacts
```

## 边界规则

- 告诉 Agent 如何行动的，通常是 Skill。
- 提供可信事实的，是 Knowledge。
- 调用外部能力的，要声明 Tool。
- 持久输出要声明 Artifact。
- 证明质量或来源的，要记录 Evidence 或 Eval。
- 组合产品体验的，属于 Agent App。

## 实现原则

宿主应实现一个稳定 Capability SDK 边界。App 不应该为每个标准学习宿主内部实现。SDK 是相邻标准变成可调用平台能力的 seam。

## 生态分层

```text
Agent App
  组合 entries、runtime package、workflow、storage、permissions、release
    -> Agent Skills
       可复用流程和 agent 行为
    -> Agent Knowledge
       有来源的事实、政策、案例和上下文
    -> Agent Tools
       外部可调用系统
    -> Agent Artifacts
       持久输出和 viewer
    -> Agent Evals / QC / Evidence
       验收、provenance、审计和 review
```

标准应保持这些层分离，让每层可以独立演进，而不迫使整个 App 迁移。新的写作方法应能作为 Skill 发布；新的客户事实包应能作为 Knowledge 发布；新的业务工作台才应作为 App 发布。

## 集成规则

新增 agent standard 时，要定义 Agent App 是通过 ID 引用、内嵌 descriptor、声明 required binding，还是通过 capability 调用它。不要让 Agent App 变成所有细节的堆放处。
