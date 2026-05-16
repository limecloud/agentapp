---
title: Agent 标准生态
description: Agent App 与 Runtime、UI、Context、Knowledge、Skills、Tools、Connectors、Artifacts、Evidence、Policy、QC 和领域标准的关系。
---

# Agent 标准生态

Agent App 是 Agent 标准生态中的应用层。它应该组合相邻标准，而不是重新定义它们，也不应该把生态缩窄成一两个资产类型。

当前事实源：**Agent App 是可安装应用组合层；相邻标准负责可复用能力；Lime Host 和 Lime Cloud 负责执行、连接、策略、密钥、registry 和 evidence 基础设施。**

## 标准地图

| 层 | 负责什么 | 与 App 的关系 |
| --- | --- | --- |
| Agent App | 可安装包、entry、runtime package、workflow、storage、readiness、release、v0.7 边界文件。 | 组合完整业务产品，但不变成宿主 Runtime。 |
| Agent Runtime | task 执行、model routing、session、checkpoint、event stream、structured output。 | App 通过 `app.runtime.yaml` 声明任务意图，并调用 `lime.agent`。 |
| Agent UI | 页面、面板、命令、viewer、Host Bridge 交互表面。 | App 声明 entries，也可以携带 UI assets；Host 在受控表面中渲染。 |
| Agent Context | 上下文组装、预算、优先级、压缩、缺失上下文请求。 | App 描述每个 entry 或 workflow 需要什么上下文。 |
| Agent Knowledge | 可信事实、来源、provenance、新鲜度、检索或 data mode。 | App 声明 Knowledge templates 和 bindings，但不把私有事实放进官方包。 |
| Agent Skills | 流程、脚本、rubric、任务工艺、可复用步骤。 | App 引用可复用方法，不把完整流程复制进 `APP.md`。 |
| Agent Tool / Connector | 可调用外部能力、MCP、CLI、API、browser adapter、授权和副作用。 | App 声明 Tool requirements、integration、operation 和权限。 |
| Agent Artifact | 持久交付物、schema、viewer、exporter、版本和状态。 | App 声明 artifact types，并通过宿主服务写入输出。 |
| Agent Evidence | 支撑、provenance、trace、replay、redaction、eval records、audit export。 | App 为高信任运行记录 evidence refs。 |
| Agent Policy | 权限、风险、保留、成本、租户规则、人审门槛。 | App 声明 policy 输入，Host 和 Cloud 执行决策。 |
| Agent QC | 质量门禁、验收标准、回归检查、waiver、报告。 | App 声明 evals、readiness 和 review gates。 |
| 领域标准 | 某类业务域的长期工作台语义和文件结构。 | App 可实现领域 profile，不把领域逻辑写进 Host Core。 |
| Lime Host / Cloud | 本地执行、沙箱、密钥、registry、tenant policy、OAuth、webhook、scheduled sync。 | App 声明需求，Host 和 Cloud 提供受治理的能力。 |

## Agent App 负责什么

Agent App 负责组合：

- 用户可见的 entries、routes、commands、workflows 和 settings
- 属于产品自己的 UI、worker、storage、workflow 和 app-local state
- 哪些 Runtime task 会被启动，以及结构化结果如何写回 App 状态
- 需要哪些 Context、Knowledge、Skill、Tool、Connector、Artifact、Evidence、Policy 和 QC 绑定
- 哪些权限、overlay、setup 步骤、readiness gates 和 release metadata 生效
- runtime package assets 如何被发现、安装、投影、升级和移除

它不负责重新定义底层标准。

## Agent App 不应该吸收什么

- 私有模型网关、调度器、MCP runtime 或 tool broker 属于 Runtime / Host / Cloud。
- OAuth、secrets、tenant policy、registry sync 和 connector 执行属于 Host / Cloud。
- 客户私有事实属于 Knowledge packs、workspace files、secrets 或 overlays。
- 可复用方法属于 Skills；领域通用语义属于领域标准。
- 持久输出契约属于 Artifact；可信链路属于 Evidence；门禁属于 Policy 和 QC。
- 不应因为一个 App 需要某个业务能力，就把垂直业务逻辑写死进 Host Core。

## 为什么需要组合层

没有 App 层，团队很容易把垂直业务写死到宿主产品里，导致 Core 越来越重，客户差异难升级。

有了 Agent App，宿主开放稳定能力，业务 App 在能力之上组合自己的产品流程。

## 组合示例

```text
业务工作台 App
  App: entries、workflow state、storage schema、readiness、release
  Runtime: app.runtime.yaml、agent task events、structured output
  UI: dist/ui pages、panels、artifact viewers、Host Bridge
  Context: workspace context budget、source priority、missing-context prompts
  Knowledge: project_knowledge、policy_library、brand_rules
  Skills: research-method、draft-review-rubric、approval-playbook
  Tool / Connector: document_parser、crm_sync、spreadsheet_export、MCP / CLI / API adapters
  Artifact: draft、report、table、deck、export package
  Evidence: source refs、tool-call logs、human approval records、replay bundles
  Policy: data-retention rule、cost limit、external-write approval
  QC: fact grounding、tone fit、publish readiness、regression checks
  Domain profile: 可选垂直工作台语义
  Host / Cloud: lime.ui、lime.storage、lime.agent、lime.connectors、lime.secrets、lime.evidence
```

## 边界规则

- 定义 task 执行语义的，归 Agent Runtime。
- 定义交互表面的，归 Agent UI。
- 决定上下文装配、预算或压缩的，归 Agent Context。
- 提供有来源可信事实的，归 Agent Knowledge。
- 告诉 Agent 如何复用某种做事方法的，归 Agent Skills。
- 调用外部系统或产生副作用的，归 Agent Tool / Connector。
- 持久输出，归 Agent Artifact。
- 证明来源、trace 或审计性的，归 Agent Evidence。
- 决定权限、成本、风险或保留的，归 Agent Policy。
- 判断验收质量的，归 Agent QC。
- 组合安装后的产品体验、生命周期、状态和交付边界的，归 Agent App。

## 实现原则

宿主应实现一个稳定 Capability SDK 边界。App 不应该为每个标准学习宿主内部实现。SDK 是相邻标准变成可调用平台能力的 seam。

## 生态分层

```text
Lime Host / Cloud
  提供 runtime、sandbox、connectors、registry、secrets、policy、evidence
    -> Agent Runtime
       task 执行、model/tool routing、session、streaming
    -> Agent UI
       宿主受控 page、panel、viewer、bridge
    -> Agent Context
       上下文装配、预算、优先级、压缩
    -> Agent App
       可安装业务产品组合
         -> Agent Knowledge
            有来源的事实、政策、案例和上下文
         -> Agent Skills
            可复用流程和 agent 行为
         -> Agent Tool / Connector
            外部可调用系统和副作用
         -> Agent Artifact
            持久输出、schema、viewer、exporter
         -> Agent Evidence / Policy / QC
            provenance、授权、验收、审计和 review
         -> 领域标准
            必要时提供垂直工作台 profile
```

标准应保持这些层分离，让每层可以独立演进，而不迫使整个 App 迁移。新的模型执行契约应在 Runtime 演进；新的交互契约应在 UI 演进；新的可复用方法应作为 Skill 发布；新的客户事实包应作为 Knowledge 发布；新的连接器应作为 Tool / Connector 发布；新的业务工作台才应作为 App 发布。

## 集成规则

新增 agent standard 时，要定义 Agent App 是通过 ID 引用、内嵌 descriptor、声明 required binding，还是通过 capability 调用它。不要让 Agent App 变成所有细节的堆放处。
