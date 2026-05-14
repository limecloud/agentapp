---
title: Capability SDK
---

# Capability SDK

Capability SDK 是 Agent App 与 Lime 的稳定边界。它解决两个问题：

1. App 不重复实现 Lime 已有的文件、存储、任务、Artifact、Knowledge、Tool、Policy、Evidence。
2. Lime 底层升级时，App 只依赖版本化能力契约，不跟着内部实现大改。

## 架构

```mermaid
flowchart TD
  App[Agent App UI / Worker] --> SDK[@lime/app-sdk]
  SDK --> Bridge[Lime Capability Bridge]
  Bridge --> UI[UI Host]
  Bridge --> Storage[Storage Service]
  Bridge --> Files[File Service]
  Bridge --> Agent[Local Agent Runtime]
  Bridge --> Knowledge[Knowledge Binding]
  Bridge --> Tools[Tool Broker]
  Bridge --> Artifacts[Artifact Store]
  Bridge --> Policy[Policy / Permission]
  Bridge --> Evidence[Evidence / Trace]
  Bridge --> Secrets[Secret Manager]
```

SDK 是 facade，不是 Lime 内部模块重导出。App 不能 import `lime/src/...`，只能请求 capability handle。

## 能力协商

安装时读取 manifest：

```yaml
requires:
  capabilities:
    lime.ui: "^0.1.0"
    lime.storage: "^0.1.0"
    lime.agent: "^0.1.0"
```

Host 决策：

| 结果 | 行为 |
| --- | --- |
| 全部满足 | 可以安装并启用。 |
| 可选能力缺失 | 安装但 readiness 显示降级。 |
| 必需能力缺失 | 阻止启用，提示升级 Lime 或禁用对应 entry。 |
| major 不兼容 | 阻止安装，给出兼容矩阵。 |

## Runtime 注入

App 运行时不携带宿主实现。Host 注入 capability handles：

```ts
const lime = await getLimeRuntime()
const table = lime.storage.table('content_assets')
const task = await lime.agent.startTask({ entry: 'batch_copy', input })
```

每个 handle 都应具备：

- appId / workspaceId / tenantId 上下文。
- permission 和 policy 拦截。
- provenance 自动附加。
- mock implementation，用于 App 单测。
- telemetry 和 evidence hook。

## Capability 版本规则

- Major：允许破坏性变更，必须提供迁移指南。
- Minor：只新增能力，不破坏已有调用。
- Patch：修复 bug，不改变契约。
- Deprecated：至少保留两个 minor 版本或一个明确 LTS 窗口。
- Removed：只在 major 中移除。

## Host 实现者检查清单

- 每个 capability 都有 schema、TypeScript 类型、mock 和 contract tests。
- 所有调用都能关联 appId、entryId、taskId、workspaceId。
- 权限不只在 UI 提示，也在 runtime bridge 拦截。
- 底层服务替换不影响 SDK 契约。
- SDK 错误码稳定，App 可做降级处理。
- capability 调用默认记录 provenance 和 evidence。
