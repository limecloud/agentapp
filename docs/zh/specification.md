---
title: 规范
description: Agent App 应用包格式草案。
---

# 规范

Agent App 定义面向 Agent 宿主的可安装应用组合包。它学习 Agent Skills 的包形态：目录即包、顶层 Markdown 入口、YAML frontmatter、渐进加载、可选支撑目录和校验工具。

## 包结构

```text
app-name/
├── APP.md
├── skills/
├── knowledge-templates/
├── workflows/
├── tools/
├── artifacts/
├── evals/
├── assets/
└── examples/
```

只有 `APP.md` 必需，其余目录都是可选支撑资产。

## `APP.md`

`APP.md` 必须包含 YAML frontmatter 和 Markdown 指南。

### 必需字段

| 字段 | 约束 |
| --- | --- |
| `name` | 1-64 字符，建议匹配目录名。 |
| `description` | 给人和 AI 读取的描述。 |
| `version` | App 包版本。 |
| `status` | `draft`、`ready`、`needs-review`、`deprecated` 或 `archived`。 |
| `appType` | `agent-app`、`workflow-app`、`domain-app`、`customer-app` 或 `custom`。 |

### 推荐字段

| 字段 | 用途 |
| --- | --- |
| `runtimeTargets` | `local`、`hybrid` 或 `server-assisted`。`local` 表示宿主本地 Runtime 执行。 |
| `entries` | 宿主可见入口，如 scene、command、home、workflow、artifact surface。 |
| `capabilities` | App 依赖的标准或宿主能力表面。 |
| `permissions` | 运行前宿主必须处理的权限请求。 |
| `knowledgeTemplates` | 用户、租户或 workspace 需要绑定的 Agent Knowledge 槽位。 |
| `skillRefs` | App 需要或推荐的 Agent Skill 包。 |
| `toolRefs` | App 需要的 Agent Tool 表面或连接器。 |
| `artifactTypes` | App 会产出的 Agent Artifact 合约或 viewer 提示。 |
| `evals` | 质量门禁、就绪检查和评审规则。 |
| `presentation` | 应用卡片、图标、分类、首页文案和排序提示。 |
| `compatibility` | 宿主、标准或能力版本约束。 |
| `metadata` | 命名空间化的实现元数据。 |

## 入口类型

| 类型 | 含义 |
| --- | --- |
| `home` | App 首页或着陆页。 |
| `scene` | 产品场景或 slash 风格入口。 |
| `command` | 原子命令入口。 |
| `workflow` | 多步骤引导流程。 |
| `artifact` | Artifact 查看、编辑或导出入口。 |

## 运行时契约

兼容宿主必须：

1. 通过 `APP.md` 发现 App。
2. 先读取 catalog metadata，再按需加载支撑文件。
3. 只有在用户、租户或 workspace 同意后才安装或激活 App。
4. 把 entries、skills、knowledge templates、tools、artifacts、evals 和 permissions 解析进宿主拥有的目录。
5. 执行必须发生在宿主 Agent Runtime。
6. 云端 Registry 只是分发和授权面，不是隐藏 Agent Runtime。
7. 客户数据必须放在 Agent Knowledge 包、workspace 文件或 Overlay 中。
8. 在投影出来的 entries、artifacts、evals 和 tool requirements 上保留 App provenance。

## Overlay 优先级

```text
Workspace Override > User Overlay > Tenant Overlay > App Default > Host Default
```

官方 App 不应内置客户知识或凭证。Overlay 负责绑定客户知识、品牌文案、工具凭证、默认模型、场景排序和评估阈值。
