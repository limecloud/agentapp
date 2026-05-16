---
title: v0.7 概览
description: v0.7 标准化需求边界、Host/Cloud 执行平面、外部集成和能力交接。
---

# v0.7 概览

v0.7 的主题是 **Requirement Boundary & Capability Handoff**：给定一个真实业务需求，Agent App 必须能说明哪些由 App 负责，哪些需要 Lime Host、Lime Cloud、connector、外部系统或人工决策共同完成。

v0.7 不把某个行业、客户或厂商写进标准。它把真实交付中反复出现的问题标准化：需求拆解、职责边界、外部集成、操作副作用、验收范围和非目标。

## 核心变化

- **`app.requirements.yaml`**：声明业务需求项、MVP 范围、非目标、后续阶段和验收标准。
- **`app.boundary.yaml`**：把每个需求映射到 App / Host / Cloud / connector / external system / human 平面。
- **`app.integrations.yaml`**：声明外部系统、CLI、MCP、API、webhook 或 browser adapter 需求，但执行由 Host/Cloud 托管。
- **`app.operations.yaml`**：声明读写动作、副作用、审批、dry-run、幂等和 evidence 要求。
- **App Fit Report**：新增售前 / 方案阶段报告，用于把自然语言需求标准化拆成可交付平面。
- **Host/Cloud 执行平面**：Host 负责本地 AgentRuntime、MCP、CLI、tools、文件、沙箱和用户确认；Cloud 负责 registry、tenant policy、OAuth broker、webhook、scheduled sync 和团队治理。

## 架构图

```mermaid
flowchart LR
  Req[业务需求] --> App[Agent App\n业务体验 / workflow / artifacts]
  App --> Host[Lime Host\n本地执行 / Agent / MCP / CLI / Tools / 权限]
  App --> Cloud[Lime Cloud\nRegistry / Tenant policy / OAuth / Webhook / Sync]
  Host --> Connector[Connector / Tool Adapter\nCLI / MCP / API / Browser]
  Cloud --> Connector
  Connector --> External[External System\n文档 / 表格 / 网盘 / 发布平台 / CRM]
  App --> Human[Human Decision\n审核 / 发布 / 高风险确认]
  External --> App
  Human --> App
```

## 时序图

```mermaid
sequenceDiagram
  autonumber
  participant Planner as AI / 方案人员
  participant Spec as AgentApp v0.7
  participant App as Agent App
  participant Host as Lime Host
  participant Cloud as Lime Cloud
  participant Conn as Connector
  participant Ext as External System
  participant User as Human

  Planner->>Spec: 输入脱敏业务需求
  Spec-->>Planner: 生成 App Fit Report
  Planner->>App: 写入 requirements / boundary / integrations / operations
  App->>Host: 安装并请求 capability profile
  Host->>Cloud: 查询 App 与 connector registry / tenant policy
  Cloud-->>Host: 返回允许的 connector、策略和授权状态
  Host-->>App: readiness：ready / needs-setup / blocked
  App-->>User: 显示缺失连接、权限和人工设置
  User->>Host: 授权连接或确认高风险动作
  Host->>Conn: 受控调用 CLI / MCP / API / tool
  Conn->>Ext: 读取或写入外部事实源
  Ext-->>Conn: 结构化结果
  Conn-->>Host: 结果、日志和副作用状态
  Host-->>App: 结果 + evidence refs
  App-->>User: 展示 artifact、状态和下一步
```

## 流程图

```mermaid
flowchart TD
  Start([收到业务需求]) --> Extract[提取需求项]
  Extract --> Classify[按 v0.7 分类\nAPP / HOST / CLOUD / CONNECTOR / EXTERNAL / HUMAN]
  Classify --> Fit{适合做 Agent App 吗?}
  Fit -- 否 --> Reject[输出不适合原因\n建议外部系统或人工流程]
  Fit -- 是 --> MVP[定义 MVP / 非目标 / 后续阶段]
  MVP --> Boundary[写 app.boundary.yaml]
  Boundary --> Integrations[写 app.integrations.yaml]
  Integrations --> Operations[写 app.operations.yaml]
  Operations --> Readiness{Host/Cloud/Connector 就绪吗?}
  Readiness -- 否 --> Setup[提示连接、授权、安装工具或云服务]
  Setup --> Readiness
  Readiness -- 是 --> Run[运行 App workflow]
  Run --> Review{有高风险副作用吗?}
  Review -- 是 --> Human[人工确认 / 审核 / 发布]
  Review -- 否 --> Save[保存 artifact 和 evidence]
  Human --> Save
  Save --> Done([验收交付])
```

## 兼容说明

- v0.6 App 在 v0.7 Host 中继续有效。
- v0.7 不替代 `app.runtime.yaml`；它在 runtime control plane 之上补齐需求边界和能力交接。
- 非 Lime 核心的厂商适配应以 connector package、MCP server、CLI adapter、browser adapter 或 customer overlay 接入，不应写入 Lime Core。
