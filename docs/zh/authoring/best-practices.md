---
title: 最佳实践
description: 编写安全、可升级、宿主友好的 Agent App 的实用规则。
---

# 最佳实践

Agent App 应该像真实应用，但必须保持可审查、可授权、可升级、可清理。以下规则用于避免 App 变成不可控插件或一次性 prompt 包。

## 让 `APP.md` 保持声明式

`APP.md` 描述 App 是什么、需要什么、宿主应如何投影它。它不是完整实现。

适合放在 `APP.md` 的内容：

- identity、version、status、appType
- entries 和 presentation metadata
- capability requirements
- runtime package 路径和 hash
- storage namespace 与 migrations
- Knowledge templates、Skills、Tools、Artifacts、Evals
- permissions、secrets、lifecycle、overlays
- 人类可读指南和非目标

不适合放在 `APP.md` 的内容：

- 应该属于 Skill 的长流程 prompt
- 应该属于 Knowledge Pack 的客户私有事实
- 宿主内部路径或数据库假设
- 明文凭证
- 隐藏的网络、文件或工具权限需求

## 使用稳定 key

key 是 App package、projection、workspace state、overlay、artifact 和 evidence 之间的契约。

| 对象 | 稳定 key 示例 |
| --- | --- |
| Entry | `content_factory`、`policy_lookup`、`review_dashboard` |
| Knowledge template | `project_knowledge`、`support_policy` |
| Tool requirement | `document_parser`、`ticket_lookup` |
| Artifact type | `content_table`、`reply_draft` |
| Eval | `fact_grounding`、`policy_compliance` |

不要因为文案调整而改 key。必须改时，要写迁移说明。

## 不绕过 SDK

App 应通过 `@lime/app-sdk` 或宿主注入的 capability handles 调能力。不要 import 宿主源码、调用私有 Tauri command、假设本地数据库表。

```ts
const lime = await getLimeRuntime()
const table = lime.storage.table('content_assets')
const task = await lime.agent.startTask({ entry: 'draft', input })
const artifact = await lime.artifacts.create({ type: 'content_table', data })
await lime.evidence.record({ subject: artifact.id, sources: task.traceId })
```

SDK 边界是 App 和宿主都能独立升级的前提。

## 权限先声明，再运行

文件、网络、工具、模型成本、导出、secret、租户数据都要在 manifest 中声明。不要只在正文里写一句“可能读取文件”。Policy engine 需要结构化字段。

## 客户数据不进官方包

官方包应该可复用。客户差异应该进入：

- Agent Knowledge Packs
- workspace files
- App storage namespace
- tenant / workspace / user overlays
- secret handles

这样 package 升级不会覆盖私有数据，也不会把敏感资料带进 registry。

## Readiness 要可行动

| 弱提示 | 好提示 |
| --- | --- |
| Missing setup | 运行 `content_factory` 前请绑定 `project_knowledge`。 |
| Tool unavailable | 请在 ToolHub 启用 `document_parser`，或禁用文件导入 workflow。 |
| Permission denied | 需要读取用户主动选择的文件。 |
| Eval missing | 请安装 `fact_grounding` eval，或阻塞 publish workflow。 |

## 保留 Provenance

每个 projected entry、workflow run、tool call、artifact、evidence、migration 都应带 app provenance：

- app name / version
- package hash
- manifest hash
- entry key
- workflow run ID
- standard / standard version

这对审计、清理、回滚和支持都必要。

## 反模式

- 把 App 当成单个 `expert-chat`。
- 把所有 prompt 写进 `APP.md`。
- 硬编码宿主内部路径。
- 为一个 App 新造工具协议。
- 把客户私有资料打进官方包。
- 把垂直业务页面写进宿主 Core，而不是做成 App UI。
- Readiness 和 Policy 前就执行 App 代码。
