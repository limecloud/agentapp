---
title: v0.6 变更记录
description: v0.6 关键变化。
---

# v0.6 变更记录

- 新增 `app.runtime.yaml` 作为 Agent task runtime control plane 的推荐分层配置。
- 标准化 `lime.agent-task-event.v1` 事件信封，覆盖 init、compact boundary、progress、tool call、approval、artifact、evidence 和 result。
- 标准化 Agent task final result subtype，区分成功、最大回合、执行错误、预算上限、结构化输出重试耗尽、权限拒绝和取消。
- 推荐 `expectedOutput.outputFormat.type=json_schema`，并定义结构化输出校验重试与失败语义。
- 引入 Runtime Approval 契约，支持 `allow / deny / defer / updatedInput / remember / interrupt`。
- 引入 `sessionPolicy`，区分 `new / resume / continue / fork`，并声明 compact boundary 事件。
- 引入 `checkpointScope`，分离 workflow、storage、artifact、file、conversation 与 external side effect 的恢复边界。
- 引入 `toolDiscovery`，推荐 on-demand 工具发现和 selected-only schema loading。
- 引入 observability 映射要求，将 runtime profile 映射到 OpenTelemetry span，默认不导出敏感内容。
- Reference CLI 升级到 0.6.0：`validate --version 0.6`、`migrate-check`、`migrate-generate` 会检查或生成 v0.6 runtime contract 建议。
- 向后兼容：v0.5 manifest 仍然有效；v0.6 不改变 v0.5 的分层 manifest 基础。
