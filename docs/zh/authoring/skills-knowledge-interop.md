---
title: Skills / Knowledge 互操作
description: Agent App 如何组合 Skills 与 Knowledge，同时保持各自信任模型。
---

# Skills / Knowledge 互操作

Agent App 不替代 Agent Skills，也不替代 Agent Knowledge。它把它们组合成一个可安装应用。

边界很简单：

- Skills 回答如何完成工作。
- Knowledge 提供可信事实和上下文。
- Agent App 声明哪些 entry、capability、workflow、UI、storage、artifact 和 eval 组成应用。

清楚边界可以避免不安全执行，也能让 package 可升级。

## 信任模型

| 资产 | 信任问题 | 运行行为 |
| --- | --- | --- |
| Agent Skill | 这个流程是否安全可执行？ | 经过 Skill 信任和权限检查后激活。 |
| Agent Knowledge | 这些数据是否可信、是否新鲜？ | 作为 fenced data 或检索上下文加载，不执行。 |
| Agent App | 这个应用包是否安全可安装和运行？ | 投影、readiness 后通过宿主能力执行。 |

不要把可执行流程放进 Knowledge，不要把私有事实放进 Skill，也不要把两者都复制进 `APP.md`。

## 引用 Skills

```yaml
skillRefs:
  - id: article-writer
    standard: agentskills
    activation: entry
    required: true
  - id: knowledge-builder
    standard: agentskills
    activation: workflow
    required: true
```

推荐声明：Skill ID、是否 required、版本范围、使用它的 entries、缺失时降级行为、如果随包分发则记录 digest。

## 引用 Knowledge

Knowledge template 描述槽位，不包含私有事实。

```yaml
knowledgeTemplates:
  - key: project_knowledge
    standard: agentknowledge
    type: brand-product
    runtimeMode: retrieval
    required: true
  - key: personal_ip
    standard: agentknowledge
    type: personal-profile
    runtimeMode: data
    required: false
```

安装或 workspace setup 时，宿主把具体 Knowledge Pack 绑定到这些槽位。

## Builder Skill 模式

常见模式是 Builder Skill 先生产 Knowledge Pack，再由 App 使用。

```text
Source files
  -> Builder Skill
  -> Agent Knowledge Pack
  -> App Knowledge template binding
  -> Runtime retrieval
```

Builder Skill 是可执行流程；生成的 Knowledge Pack 是数据；App 引用两者，但不合并信任模型。

## 内容工厂示例

| 需求 | 正确资产 |
| --- | --- |
| 如何采访并整理资料 | Agent Skill |
| 项目事实和表达风格 | Agent Knowledge |
| 项目首页和内容 workflow | Agent App |
| 文档解析 | Agent Tool |
| 内容表 | Agent Artifact |
| 事实支撑检查 | Eval 和 Evidence |

## 常见错误

- 把完整 Skill 复制进 App guide。
- 把 Knowledge Pack 内容打进官方 package。
- 把 Knowledge 当成可执行指令。
- 让 Skill 负责 App storage 或 UI。
- 因为作者机器装了某个 Skill，就让 App 隐式依赖它。

## 检查表

- 每个必要工艺都是 Skill 或 App runtime workflow。
- 每个私有事实都是 Knowledge Pack 或 workspace file。
- 每个 Knowledge template 有 type 和 required。
- 每个 Skill reference 有 activation context。
- Evidence 能串起 app entry、Skill、Knowledge source、Tool call 和 Artifact。
