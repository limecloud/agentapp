---
title: v0.6 概览
description: 标准化 Agent task runtime control plane：事件流、结构化输出、审批、session、工具发现、checkpoint 与可观测性。
---

# v0.6 概览

v0.6 在 v0.5 分层 manifest 基础上，把 `lime.agent` 任务运行控制面标准化。它不引入新的 AgentRuntime，也不要求 App 集成某个模型 SDK；App 仍然通过 Lime Capability SDK 调用宿主能力，Host / AgentRuntime 仍然负责权限、策略、工具、凭证、证据、模型路由和遥测。

## 核心变化

- **`app.runtime.yaml`**：新增推荐分层文件，集中声明 Agent task event/result、结构化输出、runtime approval、session、tool discovery、checkpoint scope 和 observability 策略。
- **Agent task 事件流**：标准化 `lime.agent-task-event.v1`，要求 `appId / taskId / traceId / sessionId / sequence / refs / usage / cost` 等稳定字段。
- **最终结果 subtype**：标准化 `success / error_max_turns / error_during_execution / error_max_budget / error_max_structured_output_retries / error_permission_denied / cancelled`。
- **结构化输出契约**：推荐 `expectedOutput.outputFormat.type=json_schema`，支持有限校验重试和失败 subtype，不再只靠 prompt 约定。
- **Runtime approval**：统一工具审批、用户提问和补上下文，支持 `allow / deny / defer / updatedInput / remember`。
- **Session policy**：区分 `new / resume / continue / fork`，明确 session 是 Agent 对话历史，不等于业务状态。
- **Checkpoint scope**：区分 workflow state、App storage、artifacts、tracked files、conversation 和 external side effects。
- **Tool discovery**：推荐 on-demand tool discovery，只加载最相关工具的 schema，避免上下文膨胀。
- **Observability mapping**：将 runtime profile 事件映射到 OpenTelemetry span，默认不导出敏感内容。

## 兼容说明

- v0.5 App 在 v0.6 宿主中继续有效。
- `app.runtime.yaml` 对 v0.6 是推荐项；使用 `lime.agent` 的 product-level App 应优先补齐。
- v0.6 不改变 v0.5 的分层 manifest、签名、i18n、readiness、errors 和 health 设计。
- v0.6 明确禁止 App manifest 声明 `bypassPermissions`。

## 心智模型

```text
APP.md / app.capabilities.yaml / app.permissions.yaml  # App 边界与权限
  ↳ app.runtime.yaml                                   # Agent task 运行控制面
      ↳ eventSchema / resultSchema                    # 统一事件和结果
      ↳ structuredOutput                              # JSON Schema + 校验重试
      ↳ approval                                      # Host-mediated runtime approval
      ↳ sessionPolicy                                 # new / resume / continue / fork
      ↳ toolDiscovery                                 # on-demand 工具发现
      ↳ checkpointScope                               # 可恢复边界
      ↳ observability                                 # profile + OTel 映射
```

## 最小示例

```yaml
agentRuntime:
  agentTask:
    eventSchema: lime.agent-task-event.v1
    resultSchema: lime.agent-task-result.v1
    structuredOutput:
      type: json_schema
      schemaRef: ./artifacts/workspace-patch.schema.json
      maxValidationRetries: 2
      failureSubtype: error_max_structured_output_retries
    approval:
      behavior: host-mediated
      supportsUpdatedInput: true
      supportsDefer: true
      rememberScopes: [task, session, workspace]
    sessionPolicy:
      modes: [new, resume, continue, fork]
      compactionEvents: true
    toolDiscovery:
      mode: on_demand
      topK: 5
      includeSchemas: selected_only
    checkpointScope:
      workflowState: true
      appStorage: true
      artifacts: true
      files: tracked_only
      conversation: resume_only
      externalSideEffects: record_only
    observability:
      profileEvents: true
      openTelemetryMapping: true
      exportContentByDefault: false
```
