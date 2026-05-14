---
title: App 与 Skills / Knowledge 的边界
description: Agent App 如何组合但不替代 Agent Skills 和 Agent Knowledge。
---

# App 与 Skills / Knowledge 的边界

Agent Skills、Agent Knowledge 和 Agent App 回答的问题不同。

| 标准 | 回答的问题 | 入口 |
| --- | --- | --- |
| Agent Skills | Agent 应该如何完成工作？ | `SKILL.md` |
| Agent Knowledge | 哪些可信事实和上下文可以进入模型？ | `KNOWLEDGE.md` |
| Agent App | 哪些能力、知识槽位、入口、工具、产物和评估组成一个可安装应用？ | `APP.md` |

## 判断树

```mermaid
flowchart TD
  Asset[候选资产] --> DoQ{它是否告诉 Agent 如何行动?}
  DoQ -->|是| Skill[Agent Skill]
  DoQ -->|否| FactQ{它是否提供事实、来源、政策、示例或上下文?}
  FactQ -->|是| Knowledge[Agent Knowledge]
  FactQ -->|否| ComposeQ{它是否组合入口、依赖、权限和交付物?}
  ComposeQ -->|是| App[Agent App]
  ComposeQ -->|否| Other[宿主项目文件]
```

## 示例

AI 内容工程化应用应该这样拆：

- 写作方法和流程放在 Agent Skills。
- 个人 IP、产品事实、内容运营 playbook 放在 Agent Knowledge。
- `/IP文章`、`/内容日历`、所需知识槽位、工具依赖、Artifact 合约和质量门禁放在 Agent App 声明。

客户数据属于 Knowledge 包或 Overlay，不属于官方 Agent App 包。
