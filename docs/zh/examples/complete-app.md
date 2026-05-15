---
title: 完整 APP.md
description: 完整 Agent App manifest 的检查表和注释结构。
---

# 完整 APP.md

完整不是指字段堆得多，而是宿主不需要猜测就能发现、审查、投影、检查 readiness、运行、审计、升级和卸载。

当前完整 fixture 可参考 `docs/examples/content-factory-app/APP.md`。以下说明生产级 package 应包含什么。

## 必需身份字段

```yaml
manifestVersion: 0.3.0
name: content-factory-app
description: APP 内容工厂，用于知识库构建、内容场景规划、内容生产和数据复盘。
version: 0.3.0
status: ready
appType: domain-app
runtimeTargets:
  - local
```

身份字段用于 registry 和宿主索引，应该稳定、清晰、不过度营销。

## Runtime requirements

```yaml
requires:
  lime:
    appRuntime: ">=0.3.0 <1.0.0"
  sdk: "@lime/app-sdk@^0.3.0"
  capabilities:
    lime.ui: "^0.3.0"
    lime.storage: "^0.3.0"
    lime.agent: "^0.3.0"
```

Requirements 描述宿主必须提供什么，而不是宿主内部如何实现。

## Runtime package

```yaml
runtimePackage:
  ui:
    path: ./dist/ui
  worker:
    path: ./dist/worker
  storage:
    schema: ./storage/schema.json
    migrations: ./storage/migrations
```

`APP.md` 指向实现资产，但不包含实现本身。

## Entries

```yaml
entries:
  - key: dashboard
    kind: page
    title: 项目首页
    route: /dashboard
  - key: content_calendar
    kind: workflow
    title: 内容排期与复盘
    workflow: ./workflows/content-calendar.workflow.md
```

Entry 是用户可见启动点。完整 App 通常不止一个 entry，也不只是 `expert-chat`。

## Storage 和数据边界

```yaml
storage:
  namespace: content-factory-app
  schema: ./storage/schema.json
  migrations: ./storage/migrations
  uninstallPolicy: ask
```

Storage 必须 namespace 化，才能支持卸载、导出和审计。

## 依赖和交付物

完整 App 通常还声明：

- `knowledgeTemplates`：必需和可选 Knowledge slots
- `skillRefs`：流程工艺 Skills
- `toolRefs`：外部或宿主工具
- `artifactTypes`：持久输出契约
- `evals`：质量门禁
- `permissions`：宿主 Policy 输入
- `secrets`：凭证槽位
- `overlayTemplates`：租户和 workspace 配置

## Human guide

`APP.md` 正文应回答：

1. App 解决什么问题。
2. 用户从哪个 entry 开始。
3. 首次运行需要什么设置。
4. 哪些数据不能进官方 package。
5. 会生成哪些 Artifact。
6. 质量门禁是什么。
7. 如何升级和删除。

## 完整性检查表

| 区域 | 完整标准 |
| --- | --- |
| Manifest | 必需字段和 v0.3 requirements 已声明。 |
| Runtime package | 使用到的 UI、worker、storage、workflow 路径已声明。 |
| Entries | 每个启动点有稳定 key、kind、title 和绑定信息。 |
| Data | Storage namespace 和 Knowledge slots 明确。 |
| Policy | Permissions、secrets、风险能力已声明。 |
| Quality | Artifact types 和 evals 连接到 workflow。 |
| Overlays | 租户 / workspace 差异不 fork package。 |
| Provenance | Projection 和 runtime output 能追溯到版本和 hash。 |
| Cleanup | disable、keep data、delete data 行为明确。 |

## 验证命令

```bash
npm run cli -- validate docs/examples/content-factory-app
npm run cli -- project docs/examples/content-factory-app
npm run cli -- readiness docs/examples/content-factory-app
```

完整 App 仍可能在 readiness 中返回 `needs-setup`，因为宿主还没有绑定 required Skill、Knowledge、Tool 或 Eval。这是正常状态。
