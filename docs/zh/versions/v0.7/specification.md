---
title: v0.7 规范快照
description: v0.7 新增需求边界、Host/Cloud 执行平面、外部集成和能力交接。
---

# v0.7 规范快照

v0.7 继承 [v0.6 规范](../v0.6/specification)，新增 Requirement Boundary & Capability Handoff。完整当前规范见 [最新版规范](../../specification)。

## 增量要求

1. Product-level App 应声明业务需求、MVP、非目标和验收标准。
2. 每个需求项应能映射到 App、Host、Cloud、connector、external system 和 human 平面。
3. App 只能声明外部集成意图；Host/Cloud 负责连接器授权、执行、凭证、策略、审计和 evidence。
4. MCP、CLI、tools、browser automation 等执行能力必须经 Host 或 Cloud 托管，App 不得直接绕过 capability。
5. 外部写入、发布、删除、批量修改等副作用必须声明 approval、dry-run、idempotency 和 evidence 策略。
6. App Fit Report 应在实现前把自然语言需求拆成可交付边界。

## 新增分层文件

```text
app.requirements.yaml
app.boundary.yaml
app.integrations.yaml
app.operations.yaml
```

## 禁区

- 不得把客户私有信息写入公开示例或标准文档。
- 不得把厂商私有业务适配硬编码进 AgentApp 标准。
- 不得让 App 直接保存外部系统明文凭证。
- 不得让 App 直接启动 MCP server、CLI 或 tool runtime。
- 不得默认自动执行高风险外部副作用。
