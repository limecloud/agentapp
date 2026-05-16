---
title: v0.6 规范快照
description: v0.6 在 v0.5 之上新增 Agent task runtime control plane。
---

# v0.6 规范快照

v0.6 继承 [v0.5 规范](../v0.5/specification)，新增 Agent task runtime control plane。完整当前规范见 [最新版规范](../../specification)。

## 增量要求

1. 使用 `lime.agent` 的 App 应提供 `app.runtime.yaml` 或等价的 `agentRuntime` manifest 字段。
2. Host 应把 `lime.agent` 执行过程投影为 `lime.agent-task-event.v1` 事件信封。
3. Final result 必须包含稳定 subtype，不能只返回自然语言状态。
4. 结构化输出应使用 JSON Schema，并在写回 artifact / storage 前校验。
5. 工具审批、用户提问和补上下文应统一为 Runtime Approval。
6. `sessionPolicy` 必须区分 Agent session 与业务状态。
7. `checkpointScope` 必须声明哪些状态可恢复、哪些只记录 evidence。
8. 大工具集应使用 on-demand tool discovery，避免默认注入全部工具 schema。
9. Runtime profile 应能映射到 OpenTelemetry，内容导出默认关闭。

## 禁区

- 不得在 Agent App manifest 中声明 `bypassPermissions`。
- 不得让 App 直接绕过 Host 调用模型、MCP、ToolHub、文件系统或凭证。
- 不得把自然语言总结当作结构化 patch 成功写回。
- 不得把 Agent session、workflow checkpoint、App storage 和外部 side effect 混成同一个回滚语义。
