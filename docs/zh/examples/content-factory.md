---
title: APP 内容工厂
description: 面向内容工厂流程的 Product-level Agent App 示例。
---

# APP 内容工厂

APP 内容工厂说明 Agent App 是应用包，而不是单个专家或 prompt 集合。它把 UI、storage、workflow、worker、Knowledge binding、Tool、Artifact、Eval、permission 和 overlay 打包成一个可安装业务应用。

参考包：[`docs/examples/content-factory-app/APP.md`](../../examples/content-factory-app/APP.md)

## 产品形态

该 App 面向需要反复把项目知识转成内容运营产出的团队。

```text
项目设置
  -> 知识库构建
  -> 内容场景规划
  -> 内容生产
  -> 审查与 Evidence
  -> 内容排期和运营复盘
```

App 拥有 dashboard、content factory page、workflow entries 和 expert-chat entry。宿主通过 SDK 提供平台能力。

## 声明的 Entries

| Entry | Kind | 作用 |
| --- | --- | --- |
| `dashboard` | `page` | 项目首页和设置状态。 |
| `knowledge_builder` | `workflow` | 把文件和笔记转成结构化项目知识。 |
| `content_factory` | `page` | 生成和管理内容资产。 |
| `content_strategist` | `expert-chat` | 内容策略对话入口。 |
| `content_calendar` | `workflow` | 排期、复盘、更新内容节奏。 |

这个结构说明：专家只是 App 的一个 entry，不是整个 App。

## Runtime Package

示例声明：

- `dist/ui`：App UI routes
- `dist/worker`：后台实现
- `storage/schema.json`：App 数据模型
- `storage/migrations`：版本化 storage 初始化
- `workflows`：业务流程
- `agents`：expert-chat persona

虽然示例很小，但形态和真实 Product-level App 一致。

## 数据模型

| 表 | 作用 |
| --- | --- |
| `content_projects` | 项目配置和状态。 |
| `knowledge_assets` | 结构化知识资产和来源引用。 |
| `content_scenarios` | 受众、痛点、平台、意图场景。 |
| `content_assets` | 草稿、脚本、提示词、报告和审查状态。 |
| `review_reports` | 质量、Evidence 和发布就绪摘要。 |

客户专属事实不进入官方包，应通过 Knowledge、workspace files、App storage、secrets 或 overlays 绑定。

## Capability 使用

| Capability | 示例用途 |
| --- | --- |
| `lime.ui` | 注册首页和内容工厂页面。 |
| `lime.storage` | 保存项目、内容场景和内容资产。 |
| `lime.files` | 读取用户选择的资料文件。 |
| `lime.agent` | 执行知识抽取和内容生成 task。 |
| `lime.knowledge` | 检索绑定的项目知识。 |
| `lime.tools` | 调用文档解析和调研工具。 |
| `lime.artifacts` | 创建内容表、文章草稿、策略报告和 PPT。 |
| `lime.evidence` | 连接输出、来源、task 和 eval。 |
| `lime.policy` | 审查文件、Tool、模型和导出权限。 |
| `lime.secrets` | 绑定可选发布 workspace token。 |

## Readiness 行为

Fixture 可以 validate 通过，但 readiness 可能返回 `needs-setup`，因为 required Skills、Knowledge、Tools、Evals 和 services 需要宿主满足。

这正是正确行为：package 结构有效，但 workspace 还需要设置。

## 示例证明了什么

- Product-level app 不应写进 Lime Core。
- `APP.md` 是声明和指南，不是完整实现。
- Runtime code 必须调用 Capability SDK。
- 客户数据属于官方包外部。
- Entry 不限于聊天。
- Artifact 和 Evidence 让输出可持久、可审查。
- Overlay template 允许租户自定义而不 fork App。

## 本地验证

```bash
npm run cli -- validate docs/examples/content-factory-app
npm run cli -- project docs/examples/content-factory-app
npm run cli -- readiness docs/examples/content-factory-app
```
