---
title: 运行时模型
description: 宿主如何安装、授权、执行、观察和清理 Agent App。
---

# 运行时模型

Agent App 默认由宿主执行，而不是由 registry 执行。Package 可以包含 UI bundle、worker、workflow、App 后端服务、storage schema 和业务代码，但这些资产必须在宿主控制的 runtime 中运行，并通过 Capability SDK 调平台能力。

运行时模型保护三个边界：

1. 宿主拥有执行和 policy。
2. App 拥有产品行为和 app-local state。
3. Registry 拥有分发和 release metadata，不拥有隐藏 runtime。

Agent App 使用类似小程序的运行时模型：用户态和平台能力由宿主共享，App code、App storage 和 App 自有后端服务保持隔离。

## 核心流程

```text
APP.md / manifest
  -> package verification
  -> projection
  -> readiness
  -> user or tenant authorization
  -> capability injection
  -> UI / workflow / worker execution
  -> artifact / evidence / eval
  -> cleanup or upgrade
```

每一步都应可检查。宿主应该能在执行前停下，并告诉用户 App 会添加什么。

## Runtime 角色

| 角色 | 职责 |
| --- | --- |
| Registry / Cloud | Catalog、release metadata、package URL、tenant enablement、license、policy defaults。 |
| Host installer | 下载、校验、缓存、投影、readiness。 |
| Capability bridge | 注入授权 SDK handles 并强制权限。 |
| UI host | 在沙箱中挂载 pages、panels、settings、artifact viewers。 |
| Workflow runtime | 执行受控 workflow steps，支持 trace、retry、cancel、evidence。 |
| Worker / backend runtime | 只在沙箱和 policy 边界内运行后台代码和 App 自有后端服务。 |
| Storage service | 提供 app namespace、schema、migrations、cleanup。 |
| Artifact / Evidence services | 持久化输出和 provenance。 |
| App Server client | 由宿主持有，完成 JSON-RPC 初始化、session / turn / action 请求、事件订阅、重连和错误投影。 |
| RuntimeCore / services | Agent session、turn、tool、action、artifact、evidence、workspace 和 policy 的事实源。 |

## App 内 Agent Task 契约

业务流程不应该要求用户跳回通用聊天框。App 需要智能能力时，应通过注入的 SDK 启动 App 作用域内的任务，并把任务过程渲染在自己的页面、面板、workflow 步骤或人工确认队列里。

最小契约：

- App 通过 `lime.agent.startTask()` 或 `lime.workflow.start()` 启动任务，并传入 app id、entry key、idempotency key、业务上下文、请求的工具、知识绑定和期望输出 schema。
- Host runtime 流式返回任务事件：状态、进度、工具调用、知识引用、局部 artifact、权限阻断、错误、取消和 trace id。
- App 在自己的产品 UI 内展示这些事件，并允许用户取消、重试、修改输入、确认或拒绝结果，不需要离开 App。
- 最终结果是结构化数据，不只是聊天文本。App 在 policy 检查和必要的人工确认后，通过 `lime.storage`、`lime.artifacts` 和 `lime.evidence` 写回业务状态。
- Expert Chat 可以作为协作者嵌入，但必须共享同一份 App 上下文和任务生命周期，不能变成核心业务脱离产品状态运行的旁路。

这个契约同时防止两种偏航：App 退化成直接调模型的普通 Web App，或 Lime 通用 Chat 被迫继续承载所有业务流程。

## App Server bridge profile

支持 `app.runtime.yaml` 中 `agentRuntime.bridge.kind=app-server-json-rpc` 的桌面宿主必须把 App 面能力调用投影到 App Server current 协议：

```text
lime.agent.startTask()
  -> Host Bridge capability:invoke
  -> Desktop Host IPC / preload allowlist
  -> App Server JSON-RPC agentSession/start
  -> App Server JSON-RPC agentSession/turn/start
  -> RuntimeCore / services / ExecutionBackend
  -> App Server JSON-RPC notification agentSession/event
  -> Host Bridge host:response / host:event projection
```

映射规则：

| App / SDK 语义 | App Server 方法 | 说明 |
| --- | --- | --- |
| 初始化宿主 runtime client | `initialize` + `initialized` | 每个 transport connection 必须先完成握手；`clientInfo.name` 由宿主显式声明。 |
| 创建或恢复 App task session | `agentSession/start` | 绑定 `appId`、`workspaceId` 和可选 `businessObjectRef`。 |
| 读取恢复态 | `agentSession/read` | 本地缓存 session id 必须先经服务端确认存在且归属当前 workspace。 |
| 启动一轮任务 | `agentSession/turn/start` | 承接 SDK input、附件、结构化输出、capabilityId、stream、queue 策略和 host options。 |
| 取消任务 | `agentSession/turn/cancel` | 取消 active turn，不由 App 直接杀进程。 |
| 响应审批或人工输入 | `agentSession/action/respond` | 响应 `action.required`，保留 policy 和 evidence。 |
| 接收事件 | `agentSession/event` | 唯一公共事件入口；事件从 RuntimeCore facts 派生。 |
| 能力发现 | `capability/list` | Host 投影当前 App 可用能力，不能把内部模块路径暴露给 App。 |
| 读取产物 | `artifact/read` | App 读取 artifact ref / preview，不绕过 Artifact service。 |
| 导出证据 | `evidence/export` | App 读取 evidence pack 摘要或 export ref，不重建 evidence store。 |

禁用路径：

- App UI / Worker 直接 spawn `app-server`、读取 stdout JSONL、连接本地 socket、或 import Lime Rust / JS 内部模块。
- Electron main / preload 承接 Agent 执行业务事实；它只能做 Desktop Host bridge、sidecar lifecycle、窗口和 IPC 白名单。
- App 用本地 UI state 合成 `assistant:delta`、tool result、artifact 或 evidence 成功事件。
- 生产路径在 App Server 不可用时回退 mock 成功。

## 宿主职责

- 安装、卸载、升级、禁用、导出 App。
- 校验 package hash、manifest hash、signature、compatibility。
- 做 capability negotiation。
- 注册 UI routes、panels、commands、settings、artifact viewers。
- 审查后创建 storage namespace 并执行 migration。
- 创建 App 后端服务沙箱，监管其生命周期，并只暴露已授权 capability handles。
- 注入 `lime.*` capability handles。
- 拦截 file、network、secret、tool、agent、storage、export permissions。
- 记录 provenance、evidence、telemetry、eval results、cleanup records。
- 保持 app state 和宿主 global state 分离。

## 共享宿主运行时 Profile

宿主可以跨 App 共享这些 projection：

| 共享 projection | 允许 | 禁止 |
| --- | --- | --- |
| 用户 / 租户 / workspace | 稳定 id、展示名、locale、timezone、workspace 摘要。 | Bearer token、refresh token、私有文件内容。 |
| 会话和 OAuth | 是否已登录、账号标签、provider 可用状态、setup action。 | 原始 OAuth token 或 provider credential。 |
| 模型设置 | 有效模型 profile、限制、setup action。 | Provider API key 或宿主私有路由表。 |
| Billing / entitlement | 套餐摘要、quota 状态、blocked reason。 | 原始 billing 账本或支付凭证。 |
| 宿主 UI | Theme tokens、navigation、toast、download、shell actions。 | Host DOM、Electron 对象、Tauri command、Node API。 |
| 平台能力 | Capability 可用性和 typed SDK handles。 | 直接 service object、database handle、filesystem path。 |

共享用户态是宿主 projection，不是 App 私有状态。App 只能缓存维持 UI 连续性所需的最小非敏感快照，并且必须把 Host snapshot 视为可刷新的事实。

## 执行模式

| 模式 | 含义 | 要求 |
| --- | --- | --- |
| `local` | App 在本地宿主 runtime 中运行。 | Host capability bridge、本地 storage、本地 policy。 |
| `hybrid` | 本地 runtime 使用远端 registry、gateway 或 ToolHub。 | 明确 tool 和 gateway policy。 |
| `server-assisted` | 部分执行在服务端发生。 | Manifest 声明、租户 policy、audit、data boundary。 |

`local` 是默认心智；server-assisted 必须显式声明。

## UI Runtime

App UI 应运行在受控宿主表面。它可以获得 theme、locale、route、entry context 和 injected SDK bridge，但不能获得 raw host API、Node API、任意文件系统访问或宿主源码模块。

禁用 App 时，UI entry 应能从宿主中移除，而不改变 Core route。

## Host Bridge v1

UI Host 挂载 iframe 或等价沙箱表面后，必须建立 Host Bridge。它负责把宿主状态和受控动作传给 App UI，而不是把宿主 API 暴露给 App。

Host Bridge 首包快照至少包含：

- `appId`、`entryKey`、`route` 和 runtime origin。
- `themeMode`、`effectiveThemeMode`、`colorSchemeId` 和主题 CSS variables。
- `locale`、`timezone`、`workspaceId`、`tenantId` 的非敏感摘要。
- 当前 entry 可用 capability 摘要和 blocked 原因。

Host 必须验证消息来源：`event.source` 必须是当前 App frame，`event.origin` 必须匹配 runtime origin，消息 `protocol` 和 `version` 必须匹配。无法验证的消息必须静默丢弃或记录调试事件，不能执行能力调用。

`capability:invoke` 只是一种传输信封。文件、模型、工具、下载、外链、secret、storage 写入等仍需经过 readiness、permission、policy、allowlist 和 provenance 记录；被阻断时返回 `host:error`，不能用 mock 结果伪装成功。

Host Bridge 不暴露 App Server transport。App 看到的是 SDK task、事件和产物 projection；App Server client、sidecar 路径、JSON-RPC envelope、Electron IPC channel、Tauri command 名称和 RuntimeCore 内部类型都属于宿主实现细节。

## Workflow / Worker / App Backend Runtime

执行任意 worker code 前，应先支持受控 workflow runtime。Allowlisted workflow DSL 可以调用 storage、Knowledge、agent task、Artifact、Evidence 等 SDK 能力。

Raw worker 或 App 后端服务需要额外沙箱：资源限制、文件限制、网络 policy、secret handling、cancel / timeout、audit logs、package provenance。

App 后端服务可以是多语言实现，但必须先声明运行平面：

| 运行平面 | 含义 | 宿主要求 |
| --- | --- | --- |
| `client-local` | 客户端本地服务后端，随 App 包安装，在用户机器上由桌面宿主启动和监管。 | 使用本机进程、loopback / socket 或 Wasm；宿主负责生命周期、鉴权、资源限制和清理；本地数据默认走 per-app SQLite。 |
| `cloud-remote` | 云端服务后端，由 App 作者、企业或 Cloud 远端部署。 | 使用 `remote-http`；必须声明 `server-assisted`、endpoint、认证、租户 policy、审计、数据边界和失败降级。 |

宿主应优先选择能保留监管和 capability mediation 的协议：

| Runtime 形态 | 推荐协议 | 说明 |
| --- | --- | --- |
| Python / Go / Rust / Node / Java 本地服务 | `stdio-jsonrpc` | 跨语言服务默认优先；宿主管进程、环境变量、stdio、取消和重启策略。 |
| 长驻本地服务 | `local-http` 或本地 socket | 宿主管随机绑定、单次启动认证、健康检查和关闭。 |
| 确定性计算 | `wasm` | 无默认文件系统、网络或 secret 访问。 |
| 云端服务后端 | `remote-http` | 必须显式声明 `server-assisted`、租户 policy、audit 和数据边界。 |

App 后端不是绕过宿主的后门。它们不得直接读取宿主数据库、workspace 文件、secret、模型 key 或用户态；必须像 UI 和 workflow code 一样通过 capability bridge 请求。

## 数据生命周期

App runtime 可能创建 storage records、artifacts、evidence、tasks、traces、logs、telemetry、cache、indexes、secret bindings。这些都需要 app provenance 和 cleanup 行为。

存储位置是实现细节，但逻辑边界不是。宿主 core database 必须和 App 自有 migration 分离。宿主可以把多个 App store 放在同一个物理数据库引擎中，但仍必须强制 app、workspace 和 tenant 边界。本地桌面宿主默认使用每个 App 独立 SQLite 文件，可以避免跨 App 写锁竞争，也让卸载、备份、migration 回滚和损坏恢复更简单。服务端宿主如果使用 PostgreSQL，共享实例应使用每个 App 独立 schema；高风险 App 使用独立 database；共享表只适合低风险 metadata，并必须有数据库层 scope enforcement。

## Cloud 边界

Cloud 可以提供 catalog、release、license、tenant enablement、gateway、ToolHub，但不应默认成为 Agent Runtime。需要 server-assisted 时，App 必须声明，并由 Policy 控制。

## 验收标准

- verification、projection、readiness、authorization 前不执行 App code。
- 每个 capability call 都经过 injected SDK handles。
- Policy 在 bridge 层强制执行。
- Artifact 和 Evidence 带 package provenance。
- App data namespace 化。
- Disable 和 uninstall 可用。
- Registry 故障不影响已安装本地 App，除非 policy 要求禁用。
