---
title: 应用工程闭环
description: 把业务流程打磨成完整 Agent App 包的可重复方法。
---

# 应用工程闭环

一个好的 Agent App 不是一次写完的 `APP.md`。它需要在产品目标、运行时实现、宿主能力、权限、数据边界和验收证据之间反复闭环。

Agent App 同时涉及 Runtime、UI、Context、workflow、storage、worker、Knowledge、Skills、Tools、Connectors、Artifacts、Evidence、Policy、QC 和宿主能力。任何一层单独设计，都会让 App 退化成 prompt 包、单个专家、隐藏 runtime，或者不安全的插件。

## 闭环总览

```text
用户任务
  -> App 地图
  -> Manifest
  -> Runtime package
  -> Capability 绑定
  -> Readiness / Eval
  -> 示例 workspace
  -> Release
  -> 真实反馈
```

每一轮都应该产出仓库内可版本化的工件：`APP.md`、schema、workflow descriptor、example output、eval fixture、测试或发布说明。不要让关键决策只存在于聊天记录里。

## 1. 先定义用户任务

先回答业务问题，不要先讨论技术入口。

| 问题 | 好答案 |
| --- | --- |
| 谁安装这个 App？ | 内容运营、客服主管、分析师、交付顾问、内部管理员。 |
| 哪个任务触发使用？ | 构建知识库、起草回复、生成报告、审查合同、准备活动。 |
| 哪些结果必须持久化？ | 表格、报告、草稿、复盘、指标、项目配置、Evidence。 |
| 哪些内容不能进官方包？ | 客户事实、凭证、私有文件、租户政策、workspace override。 |

这一步的输出可以直接成为 `APP.md` 正文里的产品说明。

## 2. 画出 Entry 和产品表面

把任务拆成用户可见入口，不要把所有能力都塞进专家对话。

| 需求 | Entry kind |
| --- | --- |
| App 首页 / 项目首页 | `page` |
| 多步骤业务流程 | `workflow` |
| 命令面板里的原子动作 | `command` |
| 人设型对话 | `expert-chat` |
| 持久交付物查看或编辑 | `artifact` |
| 后台同步 / 审查 | `background-task` |
| 模型、凭证、绑定配置 | `settings` |

如果某个入口只是实现细节，就不要暴露成用户 entry。

## 3. 拆清相邻标准和 App 代码

Agent App 应该组合已有标准，而不是复制它们。

- 任务执行语义放进 Agent Runtime。
- 交互表面放进 Agent UI。
- 上下文装配和预算放进 Agent Context。
- 可信事实和素材放进 Agent Knowledge。
- 工作方法放进 Agent Skills。
- 外部调用声明为 Tool / Connector requirements，并交给宿主 Policy 授权。
- 持久交付物放进 Agent Artifact。
- provenance、授权和质量门禁放进 Evidence、Policy 和 QC。
- workflow state、storage schema、worker、lifecycle 和产品组合属于 Agent App。

这样才能保证 Runtime、UI、Context 策略、Skill、Knowledge Pack、connector、artifact viewer、policy gate 和 QC rule 都能独立升级，而不需要 fork 官方 App 包。

## 4. 起草 `APP.md`

第一个 manifest 可以小，但必须是真实结构。

```yaml
manifestVersion: 0.3.0
name: content-factory-app
version: 0.3.0
status: draft
appType: domain-app
runtimeTargets: [local]
requires:
  sdk: "@lime/app-sdk@^0.3.0"
  capabilities:
    lime.ui: "^0.3.0"
    lime.storage: "^0.3.0"
    lime.agent: "^0.3.0"
entries:
  - key: dashboard
    kind: page
    title: 项目首页
    route: /dashboard
```

不要把运行时要求藏在正文里；宿主需要机器可读字段。

## 5. 实现 Runtime Package

`APP.md` 只是发现入口和审查界面。真实业务能力属于 runtime package：

```text
content-factory-app/
├── APP.md
├── dist/ui
├── dist/worker
├── storage/schema.json
├── storage/migrations
├── workflows
├── agents
├── artifacts
├── evals
└── overlay-templates
```

Runtime package 必须通过 SDK 调宿主能力，不能 import Lime 内部模块，也不能假设宿主数据库表。

## 6. 运行前先做 Readiness

Readiness 回答：这个 App 现在能不能安全运行？

最低检查项：

- 宿主 runtime 和 SDK 版本是否匹配
- 必需 capability 是否存在
- Runtime、UI、Context 需求是否可解析
- Knowledge slot 是否已绑定
- Tool / Connector 是否可用并授权
- permission 是否声明并可解析
- Artifact viewer、Evidence capture 和 Eval 是否存在
- storage namespace 和 migration 是否可接受
- secret 是否通过 Secret Manager 绑定

有效包可以是 `needs-setup`。这不是失败，而是告诉用户还差哪些设置。

## 7. 补示例 Workspace

每个 App 至少应该有一个示例 workspace，说明输入数据形态、期望 Artifact、Eval 要求和清理行为。示例不能包含客户私有资料。

比如内容类 App 可以提供合成项目资料、内容场景样例、内容表期望输出和 fact grounding eval fixture。

## 8. 发布后继续观察

Release 至少应固定：

- package version
- manifest hash
- package hash
- compatibility matrix
- release notes
- rollback target
- migration notes

发布后观察 readiness 失败、权限拒绝、Tool 缺失、Eval 失败和 Overlay 冲突，再进入下一轮。

## 完成标准

一个 Agent App 可以进入 release candidate，当且仅当：

- `agentapp-ref validate` 无 error
- projection 输出稳定可复现
- readiness 输出可行动
- 所有执行路径都通过 Capability SDK
- 持久产物都有 provenance
- 客户数据不在官方 package 内
- disable / uninstall / delete data 行为明确
- 至少一个示例 workspace 能证明主业务任务
