---
title: 快速开始
description: 创建、校验、投影并检查一个最小 Agent App package。
---

# 快速开始

本页创建一个最小但有用的 Agent App package，并说明它如何逐步长成生产级应用。目标不是写一个 prompt 文件，而是定义一个宿主可以发现、校验、投影到 UI 入口，并做 readiness 检查的可安装 package。

## 你会创建什么

```text
my-app/
└── APP.md
```

`APP.md` 是必需发现面。它承载 manifest frontmatter 和人类可读指南。真实 UI、worker、storage schema、workflow、agent persona、artifact viewer 和 eval 可以后续作为 runtime package assets 加入。

## 1. 创建 package 目录

```bash
mkdir my-app
cd my-app
```

创建 `APP.md`：

```markdown
---
manifestVersion: 0.3.0
name: my-app
description: 一个最小本地运行 Agent App。
version: 0.3.0
status: draft
appType: agent-app
runtimeTargets:
  - local
requires:
  sdk: "@lime/app-sdk@^0.3.0"
entries:
  - key: start
    kind: command
    title: 开始
    command: /start
---

# My App

当用户希望从宿主命令面板启动一个引导式 workflow 时使用本 App。

## Setup

官方 package 不携带客户私有数据。Knowledge、Tool、secret 或 overlay 在安装后由宿主绑定。

## Runtime behavior

`start` 命令应通过 `@lime/app-sdk` 调用宿主能力，不能直接 import 宿主内部模块。
```

## 2. 校验 package

在本仓库内运行：

```bash
npm run cli -- validate ./my-app
```

发布后在其他项目运行：

```bash
npx agentapp-ref@0.4.0 validate ./my-app
```

Validation 检查 manifest shape、必需字段、entry kind、本地引用和明显作者错误。`draft` App 可以通过结构校验，但仍可能因为缺 setup 而不能激活。

## 3. 投影成宿主 catalog 数据

```bash
npx agentapp-ref@0.4.0 project ./my-app
```

Projection 是宿主把 package metadata 转成 catalog objects 的确定性步骤。它不应发明 package 中不存在的业务行为。输出应包含 app summary、entries、requirements、permissions、storage、services、workflows，以及可用时的 provenance。

## 4. 检查 readiness

```bash
npx agentapp-ref@0.4.0 readiness ./my-app
```

Readiness 回答的问题不是“结构是否正确”，而是“当前宿主和 workspace 是否能运行它”。一个 package 可以结构有效，但因为必需 Knowledge、Skill、Tool、capability、service 或 secret 未绑定而返回 `needs-setup`。

## 最小草稿与生产级 App

| 区域 | 最小草稿 | 生产级方向 |
| --- | --- | --- |
| Entries | 一个 command 或 page。 | 多个可追溯 page、workflow、artifact viewer、settings 或 expert-chat。 |
| Runtime | 可能只写意图说明。 | UI bundle、worker、workflow 文件、storage schema、migration 和测试。 |
| Capabilities | 只声明 SDK 版本。 | 明确 `requires.capabilities`、可降级能力和兼容矩阵。 |
| Data | 不打包私有数据。 | Knowledge templates、storage namespace、overlays、secrets 和 uninstall policy。 |
| Quality | 人工 review。 | Evals、Evidence、readiness checks 和 release checklist。 |
| Security | 无外部访问。 | 文件、网络、Tool、secret、background job、artifact 的权限声明。 |

## 增加 runtime assets

App 变成真实产品时，增加这些目录：

```text
my-app/
├── APP.md
├── dist/
│   ├── ui/
│   └── worker/
├── storage/
│   ├── schema.json
│   └── migrations/
├── workflows/
├── agents/
├── artifacts/
├── evals/
└── examples/
```

然后更新 `APP.md`，让每个 entry 都能追到实现：page 指向 `route`，workflow 指向 `workflow` 文件，expert-chat 指向 `persona`，artifact viewer 指向 artifact descriptor。

## 作者检查表

- `APP.md` 说明什么时候使用 App，以及用户需要完成什么 setup。
- v0.3 current entry 使用 `page`、`panel`、`expert-chat`、`command`、`workflow`、`artifact`、`background-task` 或 `settings`。
- Runtime code 调用能力前，先在 `requires.capabilities` 声明必需 capability。
- 客户专属数据通过 Knowledge templates、overlays、secrets 或 workspace files 表达，不打进官方 package。
- 可执行 entry 有 permissions、policy、eval 和 Evidence 预期。
- 发布前跑过 validation、projection 和 readiness。
