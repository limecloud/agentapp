---
title: 术语表
description: Agent App 标准中的核心术语。
---

# 术语表

本页定义 Agent App v0.3 中的术语。

| 术语 | 含义 |
| --- | --- |
| Agent App | 安装到宿主 Runtime 的完整智能应用包。 |
| `APP.md` | 必需发现入口，包含 YAML frontmatter 和人类可读指南。 |
| Runtime package | `APP.md` 引用的 UI、worker、storage、workflow、artifact、eval 等文件。 |
| Host | 安装、投影、授权并运行 App 的客户端或平台。 |
| Host Bridge | 沙箱 UI 与宿主之间的标准事件桥，协议为 `lime.agentApp.bridge`。 |
| Capability SDK | 宿主注入的稳定 API，例如 `lime.ui`、`lime.storage`。 |
| Capability | App 通过 SDK 调用的宿主能力。 |
| Entry | 宿主可见入口，例如 page、command、workflow、artifact、background-task、settings。 |
| Expert | 聊天优先入口；v0.3 中是 `expert-chat`，不是整个 App。 |
| Projection | 从 manifest 到宿主 catalog objects 的确定性编译。 |
| Readiness | 运行前静态设置和兼容性检查。 |
| Overlay | 官方 package 外的租户、workspace、用户或客户配置。 |
| Knowledge template | 描述必需或可选 Knowledge binding 的槽位。 |
| Skill reference | 指向 Agent Skill 的流程工艺引用。 |
| Tool reference | 外部或宿主 Tool 的需求声明。 |
| Artifact type | App 创建或查看的持久输出契约。 |
| Eval | 输出验收的质量门禁或人工 review 规则。 |
| Evidence | task、Tool、Knowledge source、Artifact、Eval 的 provenance 和支撑记录。 |
| Secret slot | 由宿主 Secret Manager 解析的凭证占位。 |
| Package hash | package 内容完整性 hash。 |
| Manifest hash | manifest 或 `APP.md` frontmatter 完整性 hash。 |
| Local runtime | App 在宿主本地授权环境中运行。 |
| Server-assisted | 远端服务辅助 catalog、gateway 或 Tool，但不默认成为隐藏 Runtime。 |

## 兼容或弃用术语

| 术语 | 状态 |
| --- | --- |
| `scene` entry | 历史兼容术语。v0.3 App 应使用 `page`、`command`、`workflow`、`artifact`、`background-task` 或 `settings`。 |
| `home` entry | 历史兼容术语。App 首页应使用 `page`。 |

## 命名建议

标准使用 `Agent App`，具体包使用 `app`。产品示例使用 `内容工厂` 这类领域名。避免把完整应用说成单个对话框。

## 术语分组

| 分组 | 应一起 review 的术语 |
| --- | --- |
| Packaging | Agent App、`APP.md`、runtime package、package hash、manifest hash。 |
| Runtime | Host、Capability SDK、capability、local runtime、server-assisted。 |
| UI 与 workflow | Entry、expert、projection、readiness、overlay。 |
| Composition | Knowledge template、Skill reference、Tool reference、Artifact type。 |
| Governance | Eval、Evidence、secret slot、policy、compatibility。 |

## 如何使用术语表

写 manifest、SDK 文档、release note 和 host UI 文案时，把术语表当作命名护栏。如果新术语和已有术语重叠，除非它拥有不同 runtime boundary，否则优先复用已有术语。

## 消歧规则

- 改变 agent 如何行动，优先归为 Skill。
- 提供可信事实，优先归为 Knowledge。
- 调用外部系统，优先归为 Tool。
- 形成持久输出，优先归为 Artifact。
- 组合 UI、workflow、storage、permissions 和 lifecycle，使用 Agent App。
