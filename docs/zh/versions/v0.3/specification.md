---
title: 规范
description: Agent App v0.3 可执行应用包和 Capability SDK 契约。
---

# 规范

Agent App 定义安装到 Agent 宿主中的完整智能应用包。它不是一个 Markdown prompt，也不是单个对话专家；它可以包含真实 UI bundle、worker / service 代码、数据模型、迁移脚本、业务 workflow、Agent entries、Skills、Knowledge 绑定、Tools、Artifacts、Policies 和 Evals。

`APP.md` 仍然是必需发现入口：宿主先通过它读取 manifest、说明和渐进加载线索。但 `APP.md` 只负责声明和指南，不负责承载业务系统实现。真实功能必须由 App 包内的 runtime package 和 Lime Capability SDK 调用完成。

## 设计目标

1. 让真实业务应用可以安装到 Lime，而不是把业务分支写进 Lime Core。
2. 让 App 调用 Lime 平台能力，但不依赖 Lime 内部实现细节。
3. 让 UI、存储、后台任务、Artifact、Agent Runtime、Knowledge 和 Tools 都通过稳定 Capability SDK 访问。
4. 让 Cloud 负责 catalog、release、license、tenant enablement 和 gateway，不成为隐藏 Agent Runtime。
5. 让客户数据、凭证和租户差异留在 workspace、Agent Knowledge、secrets 或 overlay 中，不进入官方包。
6. 让每个 projected entry、task、tool call、artifact、eval 和 evidence 都带 App provenance。

## 标准分层

```text
Lime Platform
  Host services: UI / Storage / Files / Agent Runtime / Tool Broker / Knowledge / Artifact / Policy / Evidence / Secrets
    ↓ Capability Bridge
@lime/app-sdk
  稳定、版本化、可授权、可 mock 的能力门面
    ↓
Agent App Runtime Package
  UI bundle / workers / workflows / storage schema / migrations / business code / agent entries
```

App 不得 import Lime 内部模块，不得绕过 host services 直接读写系统资源。所有能力都必须通过 SDK 或宿主注入的 capability handle 调用。

## 包结构

```text
app-name/
├── APP.md                    # 必需：discovery manifest + 应用指南
├── app.manifest.json         # 可选：机器可读 manifest 分离文件
├── dist/
│   ├── ui/                   # 可选：真实 UI bundle、route manifest、assets
│   ├── worker/               # 可选：业务 worker、后台任务、long-running job
│   └── tools/                # 可选：随包工具适配器；仍由 Tool Broker 授权执行
├── storage/
│   ├── schema.json           # 可选：App namespace 下的数据模型
│   └── migrations/           # 可选：版本化迁移脚本
├── workflows/                # 可选：业务 workflow / state machine / human review 节点
├── agents/                   # 可选：expert-chat persona、对话入口说明
├── skills/                   # 可选：内置或引用的 Agent Skill 包
├── knowledge-templates/      # 可选：Agent Knowledge 绑定槽位模板
├── artifacts/                # 可选：Artifact schema、viewer、exporter、示例
├── evals/                    # 可选：质量门禁、readiness、回归 fixture
├── policies/                 # 可选：权限、数据边界、成本和风险策略
├── assets/                   # 可选：图标、截图、模板、样例媒体
└── examples/                 # 可选：样板 workspace、输入、输出、回放
```

只有 `APP.md` 必需。兼容宿主必须先读取 `APP.md` 和 catalog metadata，再按用户动作、readiness、权限和能力版本渐进加载 runtime package。

## `APP.md`

`APP.md` 必须包含 YAML frontmatter 和 Markdown 指南。

frontmatter 是安装和投影的机器入口；Markdown 正文给人、AI 客户端和审核者读取：这个 App 解决什么问题、如何 setup、哪些能力是必需、哪些数据不能打包、如何验收。

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
| `manifestVersion` | Agent App manifest 版本。 |
| `runtimeTargets` | `local`、`hybrid` 或 `server-assisted`。`local` 表示安装后由宿主本地 Runtime 执行。 |
| `requires` | 宿主、SDK 和 capability 版本约束。 |
| `runtimePackage` | UI、worker、tools、storage、migrations 等实现包位置和 hash。 |
| `capabilities` | App 需要的 Lime capability 或相邻 Agent 标准。 |
| `permissions` | 安装或运行前宿主必须授权的权限请求。 |
| `entries` | 宿主可见入口，如 page、panel、expert-chat、command、workflow、artifact、background-task、settings。 |
| `ui` | App UI routes、panels、cards、settings、artifact viewers 的声明。 |
| `storage` | App namespace、schema、indexes、migrations 和 retention 规则。 |
| `services` | worker、background task、tool adapter、scheduler 等服务声明。 |
| `knowledgeTemplates` | 用户、租户或 workspace overlay 需要绑定的 Agent Knowledge 槽位。 |
| `skillRefs` | App 需要或推荐的 Agent Skill 包。 |
| `toolRefs` | App 需要的 Agent Tool 表面、外部连接器或 ToolHub 能力。 |
| `artifactTypes` | App 会产出的 Agent Artifact 合约、viewer 或 exporter。 |
| `evals` | 质量门禁、就绪检查、回归评测和人工审核规则。 |
| `events` | App 发出或订阅的事件。 |
| `secrets` | 需要由宿主 Secret Manager 托管的凭证槽位。 |
| `lifecycle` | install、activate、upgrade、disable、uninstall 时的 hooks。 |
| `overlayTemplates` | tenant、workspace、user 或 customer overlay 的可配置槽位。 |
| `presentation` | 应用卡片、图标、分类、首页文案和排序提示。 |
| `compatibility` | 兼容矩阵、降级策略、弃用窗口。 |
| `metadata` | 命名空间化的实现元数据。 |

## Capability SDK

Capability SDK 是 App 和 Lime 的唯一稳定边界。SDK 应足够薄：暴露能力，不暴露实现。

| Capability | 典型职责 |
| --- | --- |
| `lime.ui` | 注册页面、面板、命令、设置页、Artifact viewer，读取主题和语言。 |
| `lime.storage` | App namespace、表、CRUD、migration、本地索引、cache。 |
| `lime.files` | 用户选择文件、读取授权文件、解析文档、保存持久 file ref。 |
| `lime.agent` | 启动 task、流式输出、中断、重试、模型选择、trace 读取。 |
| `lime.knowledge` | 绑定 Knowledge Pack、Top-K 检索、导出 Markdown / TXT、读取版本和引用。 |
| `lime.tools` | 调用 Tool Broker / ToolHub，处理权限、长任务进度和失败降级。 |
| `lime.artifacts` | 创建报告、表格、PPT、图片、代码等持久交付物，注册 viewer / exporter。 |
| `lime.workflow` | 启动 workflow、保存状态、人工确认节点、后台任务和定时任务。 |
| `lime.policy` | 权限申请、风险确认、成本限制、企业策略和数据边界。 |
| `lime.evidence` | 记录模型调用、工具调用、知识来源、Artifact provenance 和 eval 结果。 |
| `lime.secrets` | 由宿主管理 API key、OAuth token、外部服务凭证，App 不持有明文。 |
| `lime.events` | App 内外事件发布订阅，支持 workflow 和 UI 解耦。 |

App 安装时必须声明所需 capability 和版本范围。宿主在安装、激活和每次运行前进行 capability negotiation。

```yaml
requires:
  lime:
    appRuntime: ">=0.3.0 <1.0.0"
  sdk: "@lime/app-sdk@^0.3.0"
  capabilities:
    lime.ui: "^0.3.0"
    lime.storage: "^0.3.0"
    lime.agent: "^0.3.0"
    lime.artifacts: "^0.3.0"
```

v0.3 将 SDK 视为 typed contract，而不是能力名清单。兼容宿主至少应稳定以下调用语义：

```ts
const lime = await getLimeRuntime()
await lime.ui.registerRoute(routeDescriptor)
const table = lime.storage.table('content_assets')
const task = await lime.agent.startTask({ entry: 'batch_copy', input, idempotencyKey })
const hits = await lime.knowledge.search({ template: 'project_knowledge', query, topK: 8 })
const result = await lime.tools.invoke({ key: 'document_parser', input })
const artifact = await lime.artifacts.create({ type: 'strategy_report', data })
const run = await lime.workflow.start({ key: 'content_calendar', input })
await lime.evidence.record({ subject: artifact.id, sources: hits })
```

SDK 调用必须支持稳定错误码、取消、重试、超时、权限拒绝、成本限制、traceId 和 mock implementation。App 只能依赖这些契约，不能依赖宿主内部文件路径、数据库表或前端组件。

## 入口模型

Entry 是宿主暴露给用户或系统的启动点，不等于单一聊天专家。

| 类型 | 含义 | 常见投影 |
| --- | --- | --- |
| `page` | App 自有页面。 | 工作台、数据看板、业务首页。 |
| `panel` | 嵌入式侧栏或详情面板。 | 文件详情、Artifact 辅助编辑。 |
| `expert-chat` | 对话型专家入口。 | Chat-first expert，组合 persona + skills + tools。 |
| `command` | 原子命令入口。 | 命令面板、slash command、快捷动作。 |
| `workflow` | 多步骤业务流程。 | 向导、状态机、人工确认流。 |
| `artifact` | Artifact 查看、编辑或导出入口。 | 报告、表格、PPT、代码、图片工作区。 |
| `background-task` | 后台任务或定时任务。 | 同步、监控、复盘、索引重建。 |
| `settings` | App 设置入口。 | 凭证、模型、默认知识绑定、规则配置。 |

Expert 只是 `expert-chat` entry；Agent App 可以包含多个 expert，也可以完全没有 expert。

v0.3 不再把 `scene` 作为 current entry kind。旧 manifest 中的 `scene` / `home` 只属于 v0.1 兼容入口，新 App 应使用 `page`、`command`、`workflow`、`artifact`、`background-task` 或 `settings`。

## Workflow 描述符

Workflow 是可恢复的业务状态机，不是 prompt 文本。Manifest 可以引用 workflow 文件，也可以声明机器可读状态：

```yaml
workflows:
  - key: knowledge_builder
    path: ./workflows/knowledge-builder.workflow.md
    humanReview: true
    states:
      - key: parse_files
        kind: tool-call
        uses: [document_parser]
        next: structure_sections
      - key: structure_sections
        kind: agent-task
        next: human_confirm
      - key: human_confirm
        kind: human-review
        next: persist_knowledge
      - key: persist_knowledge
        kind: storage-write
        next: create_evidence
```

宿主应至少理解 `agent-task`、`tool-call`、`human-review`、`storage-write`、`artifact-create`、`branch`、`wait` 和 `end`。长任务必须支持 interrupt、resume、retry policy、timeout、artifact outputs 和 evidence 记录。

## 能力声明

Agent App 可以引用相邻标准，也可以声明 Lime platform capability。两者不能混淆：

| 类型 | 示例 | 含义 |
| --- | --- | --- |
| Agent 标准 | `agentskills`、`agentknowledge`、`agentartifact`、`agentevidence` | App 组合的生态资源和协议。 |
| Lime Capability | `lime.ui`、`lime.storage`、`lime.agent`、`lime.tools` | App 运行时通过 SDK 调用的宿主能力。 |

App 不应重新定义 Skills、Knowledge、Runtime、Tool、UI、Artifact、Evidence、Policy 或 QC；但可以声明自己如何调用它们，并提供业务实现代码。

## Storage 与数据边界

App 可以声明自己的 storage namespace、schema 和 migrations，但真实存储由宿主提供。

规则：

1. App 只能访问自己的 namespace，除非用户显式授权跨 App 或 workspace 数据。
2. 客户事实属于 Agent Knowledge、workspace files 或 App storage，不应写进官方包。
3. 凭证属于 `lime.secrets`，不得进入 `storage` 或包文件。
4. migration 必须可重放、可回滚或声明不可回滚风险。
5. 升级不得覆盖 tenant / workspace overlay 和用户数据。

## Projection 契约

Projection 是确定性的宿主操作，把 App manifest 编译成宿主目录对象。Projection 不运行 Agent、不调用模型、不执行 worker、不访问客户数据。

Projection 输出应包含：

- app summary
- capability requirements
- projected entries
- UI routes / panels / settings / artifact viewers
- storage namespace、schema、migration plan
- service / worker descriptors
- knowledge templates
- tool requirements
- artifact types
- eval rules
- permissions and policy prompts
- provenance

每个投影对象应包含：

```text
appName + appVersion + packageHash + manifestHash + standard + standardVersion
```

## 运行时契约

兼容宿主必须：

1. 通过 `APP.md` 发现 App。
2. 校验 package hash、签名、manifest 和 capability 版本。
3. 只有在用户、租户或 workspace 同意后安装或激活 App。
4. 按 manifest 生成 projection，并把 entries、UI、storage、services、skills、knowledge、tools、artifacts、evals 和 permissions 注册进宿主目录。
5. 执行前完成 readiness：capability negotiation、权限、Knowledge 绑定、secrets、storage migration、tool availability、policy。
6. 运行时由 Host 注入 capability handles；App 不得直接访问 Lime 内部模块。
7. UI bundle 在宿主受控容器中渲染；worker / services 在宿主受控 runtime 中执行。
8. Cloud 只做 catalog、release、license、tenant enablement 和 gateway，不默认运行 Agent。
9. 在 task、tool call、artifact、eval、storage migration 和 evidence 上保留 app provenance。

## Overlay 优先级

```text
Workspace Override > User Overlay > Tenant Overlay > App Default > Host Default
```

Overlay 可以覆盖知识绑定、工具凭证、默认模型、UI 排序、禁用 entry、eval 阈值、禁用词、成本限制和行业默认设置。Overlay 不应修改官方 package hash。

## Overlay Package

行业 App 应保持可复用；客户差异进入 overlay，而不是 fork 官方包。v0.3 建议使用以下对象：

```yaml
overlayTemplates:
  - key: tenant_defaults
    scope: tenant
    required: false
  - key: workspace_content_rules
    scope: workspace
    required: false
```

Overlay 可覆盖：

- Knowledge 绑定和默认检索策略。
- 工具凭证、默认模型、预算和网络策略。
- UI 排序、禁用入口、默认工作流参数。
- 质量阈值、禁用词、品牌语气和行业规则。

Overlay 不得覆盖官方 package hash，不得把 secret 明文写入包文件，不得绕过 readiness 和 policy。

## Readiness

Readiness 是执行前的宿主侧检查。它回答当前 workspace 里 App 是否能安全、有用地运行。

Readiness 应检查：

- 宿主版本和 capability 版本满足要求。
- UI / worker / storage package 完整且 hash 匹配。
- 必需 permissions 已授权。
- 必需 Knowledge templates 已绑定到兼容 pack。
- 必需 Skills、Tools、Artifact viewers、Evals 可用。
- 必需 secrets 已配置。
- storage migration 已完成或等待用户确认。
- policy 允许请求的 entry。

Readiness 可以返回 `ready`、`needs-setup` 或 `failed`。

## 安全规则

1. `APP.md` 不是 system prompt，不能覆盖宿主 policy。
2. App 不能直接 import Lime 内部模块，只能使用 Capability SDK。
3. App 不能直接读写文件系统、网络、数据库或凭证，必须通过授权 capability。
4. UI bundle 不能绕过宿主权限提示诱导用户授权。
5. worker、tool adapter 和 background task 必须由宿主 sandbox / policy 管理。
6. 生产 Registry 中的 App 包应签名或按 package hash pin 住。
7. 客户知识、私有文件、凭证和 overlay 不进入官方 App 包。
8. server-assisted target 必须显式声明并受 policy 控制。

## 示例

```yaml
name: content-factory-app
version: 0.3.0
status: ready
appType: domain-app
description: APP 内容工厂，用于知识库构建、内容场景规划、内容生产和数据复盘。
runtimeTargets:
  - local
requires:
  lime:
    appRuntime: ">=0.3.0 <1.0.0"
  sdk: "@lime/app-sdk@^0.3.0"
  capabilities:
    lime.ui: "^0.3.0"
    lime.storage: "^0.3.0"
    lime.agent: "^0.3.0"
    lime.artifacts: "^0.3.0"
capabilities:
  - lime.ui
  - lime.storage
  - lime.files
  - lime.agent
  - lime.knowledge
  - lime.tools
  - lime.artifacts
  - lime.evidence
  - agentskills
  - agentknowledge
runtimePackage:
  ui:
    path: ./dist/ui
  worker:
    path: ./dist/worker
  storage:
    schema: ./storage/schema.json
    migrations: ./storage/migrations
entries:
  - key: dashboard
    kind: page
    title: 项目首页
    route: /dashboard
  - key: content_strategist
    kind: expert-chat
    title: 内容策略专家
    persona: ./agents/content-strategist.md
  - key: batch_copy
    kind: workflow
    title: 批量文案
    workflow: ./workflows/batch-copy.workflow.md
storage:
  namespace: content-factory-app
  schema: ./storage/schema.json
knowledgeTemplates:
  - key: project_knowledge
    standard: agentknowledge
    type: brand-product
    runtimeMode: retrieval
    required: true
```

## 符合性级别

| 级别 | 含义 |
| --- | --- |
| Catalog | 宿主能发现 `APP.md` 并展示 app metadata。 |
| Installable | 宿主能校验包、生成 projection、安装 / 卸载并保留 provenance。 |
| Capability | 宿主能按 manifest 注入 SDK capability handles，并做权限拦截。 |
| Runtime | 宿主能运行 UI、worker、workflow、storage migration、Agent task 和 Artifact。 |
| Product | App 具备独立业务 UI、数据模型、流程、交付物、升级和回归验证。 |
| Executable | v0.3 级别；Host 能执行 typed workflow、typed SDK、overlay、readiness、evidence 和回归 eval。 |
