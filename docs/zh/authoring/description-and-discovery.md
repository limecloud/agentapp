---
title: 描述与发现
description: 写出宿主、用户和 AI 助手都能理解的 Agent App 元数据。
---

# 描述与发现

发现阶段是用户和宿主第一次接触 App。好的 Agent App 不需要加载完整 runtime package，就能被检索、审查、推荐和安装。

这里追求的不是营销文案，而是准确契约：谁用它、解决什么任务、需要哪些设置、产出什么、什么时候不该用。

## 发现层级

| 层级 | 读者 | 用途 |
| --- | --- | --- |
| Manifest 字段 | 宿主和 registry | catalog、筛选、兼容性、安装审查 |
| Presentation metadata | 用户 | App 卡片、分类、摘要、图标、排序 |
| Markdown 正文 | 用户和 AI 助手 | 设置指南、流程说明、风险、示例 |
| Support files | 作者和 runtime | workflow、schema、eval、artifact 细节 |

宿主应该能只读 `APP.md` 就生成 App 卡片。

## 好描述的结构

一个有用描述应该回答四件事：

```text
面向 [用户]，这个 App 帮助完成 [任务]，使用 [宿主能力和资源]，产出 [持久交付物]。
```

示例：

```yaml
name: content-factory-app
description: 内容工厂，用于知识库构建、内容场景规划、内容生产和数据复盘。
presentation:
  category: content
  title: 内容工厂
  summary: 将项目知识、内容场景、批量产出和复盘沉淀到一个可安装 App 中。
```

## 弱描述和好描述

| 弱描述 | 好描述 |
| --- | --- |
| 帮你提升效率。 | 基于产品事实和客服政策知识库起草可溯源客服回复。 |
| AI 内容工具。 | 构建项目知识、规划内容场景、生成内容资产并记录复盘证据。 |
| 智能法律助手。 | 按批准的合同 playbook 审查条款并生成带注释风险报告。 |
| 企业 Copilot。 | 提供销售 SOP 准备、客户调研和跟进交付物 workflow。 |

好描述会说明用户、任务、数据依赖和产出。

## 影响发现质量的字段

| 字段 | 作用 |
| --- | --- |
| `appType` | 区分 domain app、workflow app、customer app 等。 |
| `runtimeTargets` | 告诉用户本地、混合还是 server-assisted。 |
| `entries` | 安装前展示具体入口。 |
| `knowledgeTemplates` | 暴露运行前需要绑定的知识。 |
| `toolRefs` | 暴露连接器和权限需求。 |
| `artifactTypes` | 展示持久交付物。 |
| `evals` | 展示质量门禁。 |
| `compatibility` | 避免安装到不支持的宿主。 |

## `APP.md` 正文建议结构

1. 这个 App 解决什么问题。
2. 谁应该安装。
3. 主要 entry 和 workflow。
4. 首次运行需要什么设置。
5. Workspace 需要提供什么数据。
6. 哪些数据不能进入官方包。
7. 会生成哪些 Artifact。
8. 质量门禁是什么。
9. 已知限制。
10. 升级和卸载说明。

## 给 AI 助手的激活条件

AI Client 可能会读 `APP.md` 来判断是否推荐 App。要写清：

- 当用户要搭建可复用内容运营系统时使用。
- 如果只是一次性闲聊写作，不需要启动完整 App。
- 运行发布 workflow 前必须绑定 `project_knowledge`。
- 只有用户选择文件时才请求文件读取权限。

这样可以避免 Agent 把所有 App 都当成普通 prompt。

## 非目标也要写

清晰非目标很有价值：

- 本 App 不包含客户私有数据。
- 本 App 默认不运行云端 Agent Runtime。
- 本 App 不绕过宿主 ToolHub 权限。
- 本 App 不替代 Agent Skills 或 Agent Knowledge。

非目标能减少误用，也能加速安全审查。
