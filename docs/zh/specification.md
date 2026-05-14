---
title: 规范
description: Agent App 应用包格式草案。
---

# 规范

Agent App 定义面向 Agent 宿主的可安装应用组合包。它学习 Agent Skills 的包形态：目录即包、顶层 Markdown 入口、YAML frontmatter、渐进加载、可选支撑目录和校验工具。

Agent App 只做组合层。它不定义新的 Runtime、工具协议、知识格式、UI 组件模型、Artifact 格式、Evidence 模型或 Policy 引擎。它引用相邻标准，并告诉宿主如何安装、投影和准备一个类似应用的智能体体验。

## 设计目标

1. 让类似应用的 Agent 系统可以跨宿主产品迁移。
2. 让宿主开放能力，但仍由宿主控制执行边界。
3. 让用户安装一个场景应用，而不是修改宿主 Core。
4. 让客户数据留在 Knowledge、workspace 或 Overlay 中。
5. 从 App 包到目录投影、运行任务、Artifact、Eval 和 Evidence 保留 provenance。
6. 允许云端 Registry 分发和授权 App，但不变成隐藏 Agent Runtime。

## 包结构

```text
app-name/
├── APP.md                 # 必需：manifest + 应用指南
├── skills/                # 可选：内置或引用的 Agent Skill 包
├── knowledge-templates/   # 可选：知识槽位模板和 setup 文档
├── workflows/             # 可选：scene / workflow 定义和 fixture
├── tools/                 # 可选：工具需求文档和权限提示
├── artifacts/             # 可选：输出合约、viewer 提示和示例
├── evals/                 # 可选：readiness、质量和评审 fixture
├── assets/                # 可选：图标、截图、模板、样例媒体
└── examples/              # 可选：样板 workspace、prompt、输出
```

只有 `APP.md` 必需。其他目录必须渐进加载：目录消费者先读 `APP.md`，只有在作者编写、安装、校验或运行具体入口时，才加载支撑文件。

## `APP.md`

`APP.md` 必须包含 YAML frontmatter 和 Markdown 指南。

frontmatter 是机器可读 manifest。Markdown 正文给人和 AI 读取：什么时候使用这个 App、需要什么 setup、如何评估结果、宿主不应该推断什么。

### 必需字段

| 字段 | 约束 |
| --- | --- |
| `name` | 1-64 字符；建议 lowercase kebab-case；建议匹配目录名。 |
| `description` | 1-1024 字符；描述用户价值和激活场景。 |
| `version` | App 包版本；正式发布建议 SemVer。 |
| `status` | `draft`、`ready`、`needs-review`、`deprecated` 或 `archived`。 |
| `appType` | `agent-app`、`workflow-app`、`domain-app`、`customer-app` 或 `custom`。 |

### 推荐字段

| 字段 | 用途 |
| --- | --- |
| `runtimeTargets` | `local`、`hybrid` 或 `server-assisted`。`local` 表示安装后由宿主本地 Runtime 执行。 |
| `entries` | 宿主可见入口，如 scene、command、home、workflow、artifact surface。 |
| `capabilities` | App 依赖的标准或宿主能力表面。 |
| `permissions` | 运行前宿主必须处理的权限请求。 |
| `knowledgeTemplates` | 用户、租户或 workspace overlay 需要绑定的 Agent Knowledge 槽位。 |
| `skillRefs` | App 需要或推荐的 Agent Skill 包。 |
| `toolRefs` | App 需要的 Agent Tool 表面或连接器。 |
| `artifactTypes` | App 会产出的 Agent Artifact 合约或 viewer 提示。 |
| `evals` | 质量门禁、就绪检查和评审规则。 |
| `presentation` | 应用卡片、图标、分类、首页文案和排序提示。 |
| `compatibility` | 宿主、标准或能力版本约束。 |
| `metadata` | 命名空间化的实现元数据。 |

## 入口模型

Entries 类似小程序的 pages，但默认不是 UI 页面。它们是宿主可见的启动点，可以投影到命令面板、slash 命令、首页卡片、引导流程、Artifact 工作台或模板。

| 类型 | 含义 | 常见投影 |
| --- | --- | --- |
| `home` | App 着陆面。 | App 首页卡片或仪表盘。 |
| `scene` | 产品场景。 | slash 风格入口或引导 prompt。 |
| `command` | 原子命令入口。 | 命令面板或 `@` 命令。 |
| `workflow` | 多步骤引导流程。 | 向导、检查表或阶段化 runtime task。 |
| `artifact` | Artifact 查看、编辑或导出入口。 | Artifact workspace action。 |

每个 entry 应有稳定 `key`、`kind`、用户可见标题，以及足够的绑定元数据，让宿主选择 Skills、Knowledge templates、Tools、Artifacts 和 Evals。

## 能力声明

Agent App 应通过名称引用相邻标准，而不是重新定义它们：

| 能力 | 含义 |
| --- | --- |
| `agentskills` | App 依赖流程化 Skills。 |
| `agentknowledge` | App 需要有来源的知识槽位。 |
| `agentruntime` | 宿主需要兼容 runtime 执行 App entries。 |
| `agenttool` | App 需要可调用工具表面或连接器。 |
| `agentcontext` | App 依赖显式上下文装配或预算行为。 |
| `agentui` | App 投影结构化交互表面。 |
| `agentartifact` | App 产出持久交付物。 |
| `agentevidence` | App 记录支撑、provenance、校验或 replay。 |
| `agentpolicy` | App 有权限、风险、留存或审批要求。 |
| `agentqc` | App 携带质量门禁或验收场景。 |

## Knowledge templates

Knowledge templates 描述必选或可选槽位，不保存客户数据。

一个 template 应声明：

- 稳定 `key`
- `standard: agentknowledge`
- Knowledge `type`
- `runtimeMode: data | persona`
- `required: true | false`
- 可选 grounding、新鲜度或 trust 要求

官方 App 不能内置客户私有知识。宿主通过用户、租户或 workspace overlay 绑定具体 Agent Knowledge packs。

## Skill references

Skill references 指向已有 Agent Skill 包或宿主提供的 Skills。它们描述 App 如何做事，但不把所有流程细节内联到 `APP.md`。

一个 Skill reference 应声明：

- 稳定 `id`
- 已知版本或兼容范围
- 是否必需
- 哪些 entries 使用它
- 可选来源或 bundle digest

## Tool 与权限引用

Tool references 声明宿主能力和权限需求。凭证必须保存在宿主受控存储中。

一个 tool reference 应声明：

- 稳定 `key`
- provider 或 capability family
- required / optional
- permission scope
- 是否允许降级运行

权限请求应在 runtime 执行前由 Agent Policy 或宿主 policy 处理。

## Artifact 与 Eval 声明

Artifact declarations 描述 entry 可能产出的持久输出。Eval declarations 描述结果被认为 ready 前需要通过的质量门禁或评审。

App 应把 eval 绑定到 artifact 或 entry，而不是把 eval 当成泛用全局 prompt。影响用户信任的 eval 执行后应链接到 Agent Evidence 记录。

## Projection 契约

Projection 是确定性的宿主操作，把 App manifest 编译成宿主目录对象。

Projection 输出应包含：

- app summary
- projected entries
- knowledge templates
- tool requirements
- artifact types
- eval rules
- provenance

每个投影对象应包含：

```text
appName + appVersion + manifestHash + standard + standardVersion
```

Projection 不得运行 Agent、调用模型或调用工具。

## 运行时契约

兼容宿主必须：

1. 通过 `APP.md` 发现 App。
2. 先读取 catalog metadata，再加载支撑文件。
3. 只有在用户、租户或 workspace 同意后才安装或激活 App。
4. 把 entries、skills、knowledge templates、tools、artifacts、evals 和 permissions 解析进宿主拥有的目录。
5. 执行必须发生在宿主 Agent Runtime。
6. 云端 Registry 只是分发和授权面，不是隐藏 Agent Runtime。
7. 客户数据必须放在 Agent Knowledge packs、workspace files 或 overlays。
8. 在 projected entries、runtime tasks、tool calls、artifacts、evals 和 evidence 上保留 app provenance。

## Overlay 优先级

```text
Workspace Override > User Overlay > Tenant Overlay > App Default > Host Default
```

官方 App 应保持可升级。Overlay 负责绑定客户知识、品牌文案、工具凭证、默认模型、场景排序、eval 阈值和禁用入口。

## Readiness

Readiness 是执行前的宿主侧检查。它回答当前 workspace 里 App 是否能安全、有用地运行。

Readiness 应检查：

- 必需 Skills 已安装并可信
- 必需 Knowledge templates 已绑定到兼容 pack
- 必需 Tools 存在且权限已授予
- 必需 Artifact viewer 或存储表面可用
- 必需 Evals 可运行
- runtime target 被宿主支持
- policy 允许请求的 entry

Readiness 可以返回 `ready`、`needs-setup` 或 `failed`。

## 安全规则

1. `APP.md` 不是 system prompt，不能覆盖宿主 policy。
2. 支撑文件默认不可执行，除非宿主明确激活引用的 Skill 或 Tool。
3. 生产 Registry 中的 App 包应签名或按 manifest hash pin 住。
4. 凭证不得存储在官方 App 包中。
5. 客户事实属于 Agent Knowledge 或 overlays。
6. server-assisted target 必须显式声明并受 policy 控制。

## 示例

```markdown
---
name: ai-content-engineering
version: 0.1.0
status: ready
appType: agent-app
description: AI 内容工程化 App，用于个人 IP 和运营内容。
runtimeTargets:
  - local
  - hybrid
capabilities:
  - agentskills
  - agentknowledge
  - agenttool
  - agentartifact
  - agentevidence
entries:
  - key: ip_article
    kind: scene
    title: IP 文章
    command: /IP文章
knowledgeTemplates:
  - key: personal_ip
    standard: agentknowledge
    type: personal-profile
    runtimeMode: persona
    required: true
skillRefs:
  - id: gongzonghao-article-writer
    required: true
---

# AI 内容工程化

使用这个 App 构建基于知识的内容工作流。
```

## 符合性级别

| 级别 | 含义 |
| --- | --- |
| Catalog | 宿主能发现 `APP.md` 并展示 app metadata。 |
| Install | 宿主能缓存包、校验包并解析 overlay。 |
| Project | 宿主能把 entries 和 requirements 编译进本地目录。 |
| Run | 宿主能通过 Agent Runtime 带 provenance 执行 entries。 |
| Evidence | 宿主能把输出、eval 和 evidence 关联回 app provenance。 |
