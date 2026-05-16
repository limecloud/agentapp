---
title: v0.4 规范快照
description: v0.4 是在 v0.3 之上叠加 Host Bridge v1 的事件协议层。
---

# v0.4 规范快照

v0.4 不替换 v0.3 包契约，只新增 Host Bridge v1 事件协议；其他规则与 v0.3 一致。

请阅读 [v0.3 规范](../v0.3/specification) 作为基础，再参考下文的 v0.4 增量。

## v0.4 增量：Host Bridge v1

Host Bridge 是 UI runtime 内 `lime.ui` 与 Capability SDK 的事件边界。它把主题、语言、入口上下文、导航、通知、下载和能力调用统一到一个受控消息协议里。

### 消息信封

```ts
interface LimeAgentAppBridgeMessage {
  protocol: "lime.agentApp.bridge"
  version: 1
  type: string
  requestId?: string
  appId: string
  entryKey?: string
  payload?: unknown
}
```

### Host -> App 事件

| 事件 | 用途 |
| --- | --- |
| `host:snapshot` | 首次完整快照，包含主题、语言、宿主信息、入口上下文。 |
| `theme:update` | 主题、配色或系统深浅色变化。 |
| `host:response` | 对 App 请求的成功响应（带 `requestId`）。 |
| `host:error` | 对 App 请求的失败响应（带稳定错误码、可读消息、`requestId`）。 |
| `host:visibility` | runtime surface 可见性变化。 |

### App -> Host 事件

| 事件 | 用途 |
| --- | --- |
| `app:ready` | App 初始化完成，请求首包快照。 |
| `host:getSnapshot` | 主动拉取当前 Host 快照。 |
| `host:navigate` | 切换 entry 或 App 内 route。 |
| `host:toast` | 请求宿主展示非技术提示。 |
| `host:openExternal` | 请求宿主打开外链。 |
| `host:download` | 请求下载同源 runtime 产物。 |
| `capability:invoke` | 统一能力调用信封。 |

### 边界

- Host Bridge 是传输层，不替代 Capability SDK。
- Host 是唯一裁决方，按 capability allowlist、readiness 和 policy 决定执行或拒绝。
- App 不允许直接访问宿主 DOM、Tauri、Node、文件系统、数据库或凭证。

更多细节见 [latest 规范](../../specification#host-bridge-v1) 中 Host Bridge v1 章节。
