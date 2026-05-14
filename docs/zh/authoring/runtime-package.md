---
title: Runtime Package 设计
---

# Runtime Package 设计

Agent App 的核心不是 `APP.md`，而是 runtime package。`APP.md` 让宿主知道“有什么、要什么、从哪里加载”；runtime package 才承载真实 UI、worker、storage schema、workflow 和业务实现。

## 最小结构

```text
app-name/
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
└── policies/
```

不是每个 App 都要有全部目录。Catalog-only App 可以只有 `APP.md`；Product-level App 必须有至少一个可运行入口和真实实现。

## UI bundle

UI bundle 用于注册 App 自有页面、面板、设置页和 Artifact viewer。它应该运行在宿主受控容器中，不能直接访问文件系统、网络、数据库或凭证。

UI 只能通过注入的 SDK capability 调用平台能力：

```ts
const project = await lime.storage.table('projects').get(projectId)
await lime.ui.openArtifact({ id: project.latestReportArtifactId })
```

## Worker / Service

Worker 用于长任务、批处理、后台同步、索引构建和业务 workflow。Worker 不应该自己实现模型网关、文件权限、凭证存储或 Artifact 存储；这些都应通过宿主 capability 完成。

```ts
export default defineWorker(async ({ lime, input }) => {
  const snippets = await lime.knowledge.search(input.query)
  const task = await lime.agent.startTask({ input: { snippets } })
  return lime.artifacts.create({ type: 'report', data: task.output })
})
```

## Storage schema

App 可以声明自己的 namespace 和 schema，但宿主拥有物理存储实现。

```yaml
storage:
  namespace: shenlan-content-engineering
  schema: ./storage/schema.json
  migrations: ./storage/migrations
```

设计规则：

1. 表名、索引、migration 都必须限定在 App namespace 下。
2. 用户数据和 overlay 不随官方包升级被覆盖。
3. Migration 必须和 App version 绑定。
4. App 卸载时要区分删除应用、保留数据、导出数据三种策略。

## 业务 Workflow

Workflow 是业务状态机，不是 prompt。它可以调用 Skills、Tools、Knowledge、Storage、Artifact 和人工确认节点。

```text
上传资料
→ 文件解析
→ AI 分层结构化
→ 人工确认
→ 写入知识库版本
→ 生成 Evidence
```

如果 workflow 只能通过聊天描述，说明它还不是 Product-level Agent App。

## Runtime package 校验

Host 安装时应检查：

- manifest 引用的路径存在。
- UI / worker / storage / workflow 的 hash 与 package lock 一致。
- capability 版本满足要求。
- migration plan 可执行。
- 所有 executable 入口都有 policy。
- 所有外部网络、文件和 secret 都有 permission 声明。

## 作者检查清单

- `APP.md` 只写声明和使用指南，不塞业务实现。
- 真实功能进入 `dist/`、`storage/`、`workflows/`、`artifacts/`。
- 业务逻辑只通过 `@lime/app-sdk` 调 Lime 能力。
- 不复制 Lime 的文件、任务、Artifact、Knowledge、Tool、Policy 实现。
- 每个 entry 都能追溯到 UI、worker、workflow 或 expert 实现。
