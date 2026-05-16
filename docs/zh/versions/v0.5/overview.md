---
title: v0.5 概览
description: 借鉴 Agent Skills 标准的分层 manifest、AI 自动发现 triggers、bundled Skills 与标准化错误码 / 签名 / i18n / 健康检查。
---

# v0.5 概览

v0.5 借鉴 [Agent Skills 标准](https://agentskills.io) 的发现与编写纪律，让 Agent App 标准更利于 AI 客户端理解、作者编写和宿主实现。

## 核心变化

- **分层 manifest**：`APP.md` frontmatter 保持精简，详细配置下沉到独立 YAML 文件（`app.capabilities.yaml`、`app.entries.yaml`、`app.permissions.yaml`、`app.errors.yaml`、`app.i18n.yaml`、`app.signature.yaml`、`evals/readiness.yaml`、`evals/health.yaml`）。
- **AI 自动发现**：新增 `triggers`（keywords / scenarios）和 `quickstart`（entry / sampleWorkflow / setupSteps）。
- **标准化 Skills 集成**：`skills/` 目录承载 bundled Agent Skills（含 SKILL.md），manifest 只声明激活策略（auto / on-demand / manual）。
- **Readiness 自检**：`evals/readiness.yaml` 把 readiness 从宿主硬编码下沉为 App 声明，分 required / recommended / performance 三层；状态扩展为 `ready / ready-degraded / needs-setup / blocked / unknown`。
- **稳定错误码**：`app.errors.yaml` 提供错误码、恢复策略、retryable、maxRetries。
- **包签名与撤销**：`app.signature.yaml` 提供 sigstore 签名、信任链、撤销检查。
- **一等 i18n**：`app.i18n.yaml` + `locales/*.json`。
- **运行时健康**：`evals/health.yaml`（startup / runtime / metrics）。
- **Workflow 增强**：mermaid 流程图、人类可读 overview、统一 recovery 策略（onTimeout / onError / maxRetries / saveCheckpoint）。
- **APP.md 章节约定**：When to Use / Not Suitable For / Workflow / Quickstart / Red Flags / Verification Checklist / Troubleshooting。

## 为什么重要

v0.4 之前 manifest 字段不断膨胀，作者编写门槛上升；v0.5 通过分层让 frontmatter 回归极简、详细配置按需启用，同时为 AI 客户端提供 `triggers`，提升自动路由的准确率。

## 兼容说明

- v0.4 / v0.3 manifest 在 v0.5 宿主中继续可用。
- 新字段都是可选的，仅在 `manifestVersion: 0.5.0` 时建议启用 v0.5 章节约定与 readiness / errors / signature。
- Reference CLI 提供 `migrate-check` / `migrate-generate` 协助迁移。

## 心智模型

```text
APP.md (精简 frontmatter + 人类可读章节)
  ↳ triggers / quickstart                # AI 自动发现
  ↳ app.capabilities.yaml                # 详细能力
  ↳ app.entries.yaml                     # 详细入口
  ↳ app.permissions.yaml                 # 权限与 policy
  ↳ app.errors.yaml                      # 稳定错误码
  ↳ app.i18n.yaml + locales/*.json       # 一等 i18n
  ↳ app.signature.yaml                   # 签名与撤销
  ↳ evals/readiness.yaml                 # 自检
  ↳ evals/health.yaml                    # 运行时健康
  ↳ skills/<name>/SKILL.md               # bundled Agent Skills
```

## 架构图

v0.5 把标准、宿主、运行时切成三层，分层 manifest 与 Capability SDK 是稳定边界。

```mermaid
flowchart TD
  subgraph Standard[Agent App v0.5 标准]
    APPMD[APP.md frontmatter + 人类章节]
    LAYERED[app.*.yaml 分层配置]
    SKILLS[skills/ 内置 Skills]
    EVALS[evals/ readiness + health]
    SIG[app.signature.yaml]
    I18N[app.i18n.yaml + locales]
  end

  subgraph Host[宿主运行时]
    Discover[Discovery & Trigger 路由]
    Verify[签名与 hash 校验]
    Project[Projection 投影]
    Readiness[Readiness 自检]
    SDK[Capability SDK Bridge]
    Bridge[Host Bridge v1]
    Health[Health 监控]
  end

  subgraph Runtime[App Runtime Package]
    UI[dist/ui]
    Worker[dist/worker]
    Workflow[workflows/]
    Storage[(storage namespace)]
    Artifacts[artifacts/ + evidence]
  end

  APPMD --> Discover
  LAYERED --> Project
  SKILLS --> SDK
  EVALS --> Readiness
  EVALS --> Health
  SIG --> Verify
  I18N --> SDK

  Verify --> Project
  Project --> Readiness
  Readiness --> SDK
  SDK --> Bridge
  Bridge --> UI
  SDK --> Worker
  SDK --> Workflow
  SDK --> Storage
  SDK --> Artifacts
  Health --> Readiness
```

## 安装与启动时序图

下图展示 v0.5 一个完整的安装→启动流程，含 trigger 路由、签名校验、readiness 自检与 Host Bridge 注入：

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

## Readiness 自检流程图

`evals/readiness.yaml` 把自检分三层，状态机如下：

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

## Host Bridge 消息时序图

App UI 与 Host 之间通过 `lime.agentApp.bridge` 协议交换事件，所有能力调用走 `capability:invoke`：

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

## Workflow 状态机示例

v0.5 workflow 描述符在 v0.3 状态机基础上引入 mermaid 流程图与统一 recovery 策略：

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

