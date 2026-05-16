---
title: 架构概览
description: Agent App v0.7 的项目级架构图、时序图、流程图和状态机示意。
---

# 架构概览

本页用图集中展示 Agent App v0.7 的关键结构、需求边界与运行时流程。各章节图与 [规范](./specification) 互相补充：规范是规则，本页是图。

## 1. 标准分层架构

v0.7 继承 v0.6 分层，并把整个生态切成 App、Host、Cloud、Connector、外部系统和人工决策平面。分层 manifest 与 Capability SDK 是稳定边界，宿主和 Cloud 控制面只看接口、不看业务实现。

```mermaid
flowchart TD
  subgraph Cloud[Cloud / Registry 控制面]
    Catalog[App Catalog]
    Release[Release Metadata]
    Tenant[Tenant Enablement]
    Reg[Registration / License]
  end

  subgraph Standard[Agent App v0.7 标准]
    APPMD[APP.md frontmatter + 人类章节]
    LAYERED[app.*.yaml 分层配置]
    BOUNDARY[requirements / boundary / integrations / operations]
    SKILLS[skills/ 内置 Skills]
    EVALS[evals/ readiness + health]
    SIG[app.signature.yaml]
    I18N[app.i18n.yaml + locales]
  end

  subgraph Host[宿主运行时（Lime Desktop）]
    Discover[Discovery & Trigger 路由]
    Verify[签名与 hash 校验]
    Project[Projection 投影]
    Readiness[Readiness 自检]
    SDK[Capability SDK Bridge]
    Bridge[Host Bridge v1]
    Policy[Policy / Permission]
    Health[Health 监控]
  end

  subgraph Runtime[App Runtime Package]
    UI[dist/ui]
    Worker[dist/worker]
    Workflow[workflows/]
    Storage[(storage namespace)]
    Artifacts[artifacts/ + evidence]
  end

  Catalog --> Discover
  Release --> Verify
  Tenant --> Policy
  Reg --> Policy

  APPMD --> Discover
  LAYERED --> Project
  BOUNDARY --> Project
  BOUNDARY --> Readiness
  SKILLS --> SDK
  EVALS --> Readiness
  EVALS --> Health
  SIG --> Verify
  I18N --> SDK

  Verify --> Project
  Project --> Readiness
  Readiness --> SDK
  SDK --> Bridge
  SDK --> Policy
  Bridge --> UI
  SDK --> Worker
  SDK --> Workflow
  SDK --> Storage
  SDK --> Artifacts
  Health --> Readiness
```

## 2. 责任分工矩阵

| 层 | 拥有 | 不拥有 |
| --- | --- | --- |
| Cloud / Registry | catalog、release metadata、tenant enablement、registration、license、ToolHub metadata | App 运行、UI 渲染、本地 storage |
| 宿主运行时 | discovery、签名校验、projection、readiness、Capability SDK 注入、Host Bridge、policy、cleanup | 业务实现、客户数据、行业逻辑 |
| App Runtime | UI、worker、workflow、storage 业务、artifact、evidence 写回 | 模型 / 工具 / 凭证 / 权限调度（必须走 SDK） |
| 标准（agentapp） | manifest schema、reference CLI、SDK 契约、最佳实践 | 任意宿主或 App 的具体实现 |


## 3. v0.7 需求边界架构

v0.7 用这个图回答普通用户和交付团队最关心的问题：App 能做什么，哪些需要 Lime Host / Lime Cloud / 外部连接器 / 人工确认配合。

```mermaid
flowchart LR
  User[普通用户] --> App[Agent App\n业务体验 / Workflow / Artifact / Review]
  App --> Host[Lime Host\n本地 Agent / MCP / CLI / Tools / 文件 / 权限]
  App --> Cloud[Lime Cloud\nRegistry / Tenant Policy / OAuth / Webhook / Sync]
  Host --> Connector[Connector / Tool Adapter\nMCP / CLI / API / Browser]
  Cloud --> Connector
  Connector --> External[外部系统\n文档 / 表格 / 网盘 / 发布平台 / CRM]
  App --> Human[人工决策\n审核 / 发布 / 高风险确认]
  External --> App
  Human --> App
```

```mermaid
sequenceDiagram
  autonumber
  participant User as 普通用户
  participant App as Agent App
  participant Host as Lime Host
  participant Cloud as Lime Cloud
  participant Conn as Connector
  participant Ext as 外部系统

  User->>App: 选择业务流程
  App->>Host: 请求能力画像和 readiness
  Host->>Cloud: 查询 connector registry、tenant policy、OAuth 状态
  Cloud-->>Host: 返回允许能力和缺失设置
  Host-->>App: 返回 ready / needs-setup / blocked
  App-->>User: 展示需要连接或授权的项目
  User->>Host: 授权连接或确认高风险动作
  App->>Host: 发起 workflow / agent task
  Host->>Conn: 受控调用 MCP / CLI / API / tool
  Conn->>Ext: 读取或写入外部事实源
  Ext-->>Conn: 结构化结果
  Conn-->>Host: 结果 + 日志 + 副作用状态
  Host-->>App: 结果 + evidence refs
  App-->>User: 展示产物和下一步
```

```mermaid
flowchart TD
  Start([脱敏业务需求]) --> Split[拆成需求项]
  Split --> Classify[分类为 App / Host / Cloud / Connector / External / Human]
  Classify --> Fit{适合做 Agent App?}
  Fit -- 否 --> Explain[说明需要外部系统、云服务或人工流程配合]
  Fit -- 是 --> Scope[确定 MVP / 非目标 / 后续阶段]
  Scope --> Files[写 requirements / boundary / integrations / operations]
  Files --> Ready{依赖能力就绪?}
  Ready -- 否 --> Setup[连接、授权、安装工具或启用云能力]
  Setup --> Ready
  Ready -- 是 --> Run[运行 App workflow]
  Run --> Risk{有高风险副作用?}
  Risk -- 是 --> Review[人工确认 + evidence]
  Risk -- 否 --> Save[保存 artifact + evidence]
  Review --> Save
  Save --> Done([完成验收])
```

## 4. 安装与启动时序

完整的从 Cloud bootstrap → 本地下载 → 校验 → projection → readiness → 启动的端到端流程。

```mermaid
sequenceDiagram
  autonumber
  participant User as 用户
  participant Cloud as Cloud Catalog
  participant Host as Lime Desktop
  participant Pkg as App Package
  participant SDK as Capability SDK
  participant App as App UI

  User->>Cloud: 请求或浏览 App（带关键词）
  Cloud-->>Host: bootstrap payload + triggers
  User->>Host: 选择安装
  Host->>Pkg: 下载 package
  Host->>Host: 校验 packageHash + sigstore + 撤销
  Host->>Pkg: 解析 APP.md + app.*.yaml + evals/*.yaml
  Host->>Host: 生成 projection（带 provenance）
  Host->>Host: 运行 evals/readiness.yaml 三层自检
  alt 必需检查未通过
    Host-->>User: 显示 needs-setup + setupActions
    User->>Host: 完成 setup（绑定 Knowledge / 授权 / 配 Secret）
    Host->>Host: 重新运行 readiness
  end
  User->>Host: 启动 quickstart.entry
  Host->>SDK: 注入 Capability handles
  Host->>App: 初始化 UI（iframe / 原生）
  App->>Host: app:ready
  Host-->>App: host:snapshot（主题 / 语言 / 入口上下文）
  App->>SDK: capability:invoke（业务调用）
  SDK-->>App: host:response 或 host:error
```

## 5. Readiness 自检流程

`evals/readiness.yaml` 三层 required / recommended / performance 检查，对应 5 种状态机输出。

```mermaid
flowchart TD
  Start([App 启动请求]) --> Required{required 全部通过?}
  Required -- 否 --> Blocker{是否有 blocker?}
  Blocker -- 是 --> Blocked[blocked<br/>列出 blockers + setupActions]
  Blocker -- 否 --> NeedsSetup[needs-setup<br/>列出 setupActions]
  Required -- 是 --> Recommended{recommended 全部通过?}
  Recommended -- 否 --> Degraded[ready-degraded<br/>列出 warnings]
  Recommended -- 是 --> Performance{performance 满足?}
  Performance -- 否 --> Degraded
  Performance -- 是 --> Ready[ready<br/>允许启动]
  Blocked --> SetupFlow{用户完成 setup?}
  NeedsSetup --> SetupFlow
  SetupFlow -- 是 --> Required
  SetupFlow -- 否 --> Stop([中止启动])
  Degraded --> Launch[启动并提示 warnings]
  Ready --> Launch
```

## 6. Host Bridge v1 消息时序

App UI 与 Host 之间通过 `lime.agentApp.bridge` 协议交换事件，所有能力调用都走 `capability:invoke`，由 Host 裁决放行或拒绝。

```mermaid
sequenceDiagram
  autonumber
  participant App as App iframe
  participant Bridge as Host Bridge v1
  participant Policy as Policy / Readiness
  participant Cap as Capability Handler

  App->>Bridge: app:ready
  Bridge-->>App: host:snapshot（主题 / 语言 / 入口上下文 / 能力摘要）
  Note over App,Bridge: 主题或语言变化
  Bridge-->>App: theme:update
  Note over App,Bridge: 业务调用
  App->>Bridge: capability:invoke (capability, method, args, requestId)
  Bridge->>Policy: 检查 allowlist / readiness / policy
  alt 允许执行
    Policy-->>Bridge: 通过
    Bridge->>Cap: 路由到对应 capability handler
    Cap-->>Bridge: 结果 + traceId + evidenceId
    Bridge-->>App: host:response (requestId, value)
  else 拒绝
    Policy-->>Bridge: 拒绝（错误码）
    Bridge-->>App: host:error (requestId, code, message)
  end
  Note over App,Bridge: surface 不可见
  Bridge-->>App: host:visibility { visible: false }
```

## 7. Capability 调用拓扑

`capability:invoke` 请求被 Host 路由到不同的 capability handler，每个能力都有独立的权限、policy 和 evidence 边界。

```mermaid
flowchart LR
  AppUI[App UI / Worker] -->|capability:invoke| Bridge[Host Bridge v1]
  Bridge --> Allow{Allowlist + Readiness + Policy}
  Allow -- 拒绝 --> Err[host:error 稳定错误码]
  Allow -- 通过 --> Router[Capability Router]
  Router --> UI[lime.ui]
  Router --> Storage[(lime.storage)]
  Router --> Files[lime.files]
  Router --> Agent[lime.agent]
  Router --> Knowledge[(lime.knowledge)]
  Router --> Tools[lime.tools]
  Router --> Artifacts[(lime.artifacts)]
  Router --> Workflow[lime.workflow]
  Router --> Evidence[(lime.evidence)]
  Router --> Secrets[(lime.secrets)]
  Storage --> Evidence
  Agent --> Evidence
  Tools --> Evidence
  Artifacts --> Evidence
```

## 8. Workflow 状态机示例

v0.5 workflow 描述符在 v0.3 状态机基础上引入 mermaid 流程图与统一 recovery 策略。下面是内容工厂 `content_scenario_planning` workflow 的状态机示例。

```mermaid
stateDiagram-v2
  [*] --> input_topic
  input_topic: user-input
  input_topic --> analyze_topic
  analyze_topic: agent-task<br/>entry=content_ideation<br/>timeout=60s
  analyze_topic --> generate_scenarios
  analyze_topic --> show_error_and_retry: onError
  generate_scenarios: agent-task
  generate_scenarios --> human_review
  human_review: human-review
  human_review --> save_calendar: approve
  human_review --> generate_scenarios: modify
  human_review --> input_topic: reject
  save_calendar: storage-write
  save_calendar --> create_artifact
  create_artifact: artifact-create
  create_artifact --> [*]
  show_error_and_retry --> analyze_topic
```

## 9. 包文件依赖关系

`APP.md` 是发现入口；其余分层文件被 manifest 按文件名约定加载，构成完整投影输入。

```mermaid
flowchart LR
  APPMD[APP.md frontmatter] --> Discover
  APPMD --> Sections[正文章节<br/>When to Use / Red Flags / Verification]
  Sections --> Onboarding[首启引导]

  APPMD --> Capabilities[app.capabilities.yaml]
  APPMD --> Entries[app.entries.yaml]
  APPMD --> Permissions[app.permissions.yaml]
  APPMD --> Errors[app.errors.yaml]
  APPMD --> I18N[app.i18n.yaml]
  APPMD --> Sig[app.signature.yaml]
  APPMD --> Runtime[app.runtime.yaml]
  APPMD --> Req[app.requirements.yaml]
  APPMD --> Boundary[app.boundary.yaml]
  APPMD --> Integrations[app.integrations.yaml]
  APPMD --> Operations[app.operations.yaml]

  Capabilities --> Project[Projection]
  Entries --> Project
  Permissions --> Project
  Errors --> Project
  I18N --> Project
  Sig --> Verify[签名与撤销]
  Runtime --> Project
  Runtime --> AgentRT[lime.agent task control plane]
  Req --> Project
  Boundary --> Project
  Integrations --> Readiness
  Operations --> Readiness

  APPMD --> Readiness[evals/readiness.yaml]
  APPMD --> Health[evals/health.yaml]
  Readiness --> ReadyCheck[Readiness 自检]
  Health --> HealthCheck[Health 监控]

  APPMD --> Skills[skills/<name>/SKILL.md]
  Skills --> AgentRT

  APPMD --> Locales[locales/*.json]
  Locales --> I18N
```

## 10. 升级与回滚关系

v0.6 / v0.5 / v0.4 / v0.3 manifest 在 v0.7 宿主中继续可用；reference CLI 提供 `migrate-check` / `migrate-generate`。

```mermaid
flowchart LR
  v03[v0.3 manifest] -->|宿主直接读取| v07Host[v0.7 宿主]
  v04[v0.4 manifest] -->|宿主直接读取| v07Host
  v06[v0.6 manifest] -->|宿主直接读取| v07Host
  v05[v0.5 manifest] -->|宿主直接读取| v07Host
  v03 -->|migrate-check / migrate-generate| v07[v0.7 manifest]
  v04 -->|migrate-check / migrate-generate| v07
  v06 -->|migrate-check / migrate-generate| v07
  v05 -->|migrate-check / migrate-generate| v07
  v07 --> v07Host
  v07Host -. 失败 .-> Rollback[回滚到旧版本]
  Rollback --> v04
  Rollback --> v03
```

## 11. 后续阅读

- [规范](./specification)：字段、约束、契约的规则文本。
- [快速开始](./authoring/quickstart)：从零创建一个 v0.7 包。
- [运行时模型](./client-implementation/runtime-model)：宿主侧实现细节。
- [Capability SDK](./client-implementation/capability-sdk)：稳定能力调用契约。
- [v0.7 当前快照](./versions/v0.7/overview)：定格版本说明。
