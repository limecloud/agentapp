---
title: 客服知识库应用
description: 面向客服流程的 Agent App 示例。
---

# 客服知识库应用

客服示例展示 Agent App 不只适用于内容生产。它是一个更小的 workflow app，用于测试 draft package、Knowledge slot、Tool requirement、Artifact 和 Eval 的组合。

参考包：[`docs/examples/customer-support-app/APP.md`](../../examples/customer-support-app/APP.md)

## 用户任务

客服团队希望基于产品事实和客服政策，起草可溯源回复和升级说明。App 应帮助客服更快回复，但不能编造政策，也不能泄露客户数据。

## 当前 package 声明

示例声明：

- 产品事实和客服政策 Knowledge templates
- `draft_reply` command entry
- 可选 ticket lookup Tool
- `reply_draft` Artifact type
- `policy_compliance` Eval
- support category presentation metadata

它是 draft app，所以 validate 会提示：生产级 app 还应增加 runtime package 和 explicit permissions。

## 生产级版本应补什么

| 区域 | 补充内容 |
| --- | --- |
| Entries | 回复起草、政策查询、升级说明、主管 review。 |
| UI | 工单侧栏和政策引用面板。 |
| Storage | 草稿历史、升级状态、政策版本快照。 |
| Tools | 工单查询、CRM 更新、客户资料、话术导出。 |
| Artifacts | 回复草稿、升级说明、政策引用包。 |
| Evals | 政策合规、语气、事实支撑、隐私检查。 |
| Permissions | 工单读取、可选工单写入、CRM tool execute。 |
| Secrets | CRM OAuth 或租户工单系统 secret handle。 |

## 边界示例

| 资产 | 正确位置 |
| --- | --- |
| 如何写共情回复 | Agent Skill |
| 产品事实和退款政策 | Agent Knowledge |
| 工单查询连接器 | Agent Tool |
| 回复起草 command 和 review workflow | Agent App |
| 回复草稿 | Agent Artifact |
| 政策合规结果 | Eval 和 Evidence |

## 为什么重要

客服是高信任流程。如果缺少 `support_policy`，App 不应该只靠模型常识回答。Readiness 应阻塞或提醒用户绑定政策知识。

## 本地验证

```bash
npm run cli -- validate docs/examples/customer-support-app
npm run cli -- project docs/examples/customer-support-app
npm run cli -- readiness docs/examples/customer-support-app
```

当前 draft fixture 适合测试 warning 和逐步完善流程。

## 端到端客服流程

```text
打开工单
→ 检索产品事实和客服政策
→ 带引用生成回复草稿
→ 运行政策和隐私检查
→ 人工客服编辑或确认
→ 创建 reply draft artifact
→ 可选导出到工单系统
```

App 应让人工客服保持控制权。它可以加速检索、起草、摘要和升级说明，但最终对客户发出的内容必须可 review、可追踪。

## Entry 设计

| Entry | Kind | 目的 |
| --- | --- | --- |
| `draft_reply` | `command` | 为当前工单或粘贴的客户消息生成回复草稿。 |
| `policy_lookup` | `panel` | 展示相关政策片段和来源链接。 |
| `escalation_note` | `workflow` | 当 case 需要专家介入时生成内部升级说明。 |
| `reply_history` | `artifact` | 查看持久化回复草稿和 policy evidence。 |
| `support_settings` | `settings` | 绑定政策 Knowledge、语气规则和工单 connector 权限。 |

## 安全预期

- 必需政策 Knowledge 绑定前，回复不能标记为 ready。
- PII 留在宿主控制的 workspace storage 和 Evidence 中，不进入公开 package。
- 写回 CRM 或工单系统的 Tool call 必须有显式权限。
- 低置信回复应保存为 draft，不应自动发送。
- Readiness 应分别暴露缺产品事实、政策版本过旧、connector auth 缺失。

## 如何改造成自己的 App

小团队可以只保留 `draft_reply`、产品事实、客服政策和手工导出。强监管团队可以增加升级流程、主管 review、脱敏、审计导出和更严格 Evals。同一套 Agent App 契约可以覆盖两者，而不需要改 host core。
