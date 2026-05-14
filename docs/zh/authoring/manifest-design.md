---
title: Manifest 设计
---

# Manifest 设计

Manifest 的职责是声明 App 需要什么、提供什么、从哪里加载实现，以及宿主如何安全投影。它不是业务实现本身。

## 设计原则

1. `APP.md` 保持可发现、可读、可审查。
2. 真实 UI、worker、storage、workflow 放在 runtime package。
3. 所有 Lime 能力通过 `capabilities` 和 `requires.capabilities` 显式声明。
4. 必需能力和可选能力分开，便于 readiness 降级。
5. 客户数据、凭证和 tenant overlay 不进入官方 manifest。
6. 每个 entry 都能追溯到 UI route、worker、workflow、expert persona 或 artifact type。

## 推荐结构

```yaml
name: example-domain-app
version: 0.1.0
status: ready
appType: domain-app
manifestVersion: 0.2.0
runtimeTargets:
  - local
requires:
  lime:
    appRuntime: ">=0.2.0 <1.0.0"
  capabilities:
    lime.ui: "^0.1.0"
    lime.storage: "^0.1.0"
    lime.agent: "^0.1.0"
capabilities:
  - lime.ui
  - lime.storage
  - lime.agent
  - agentskills
runtimePackage:
  ui:
    path: ./dist/ui
  worker:
    path: ./dist/worker
storage:
  namespace: example-domain-app
  schema: ./storage/schema.json
entries:
  - key: dashboard
    kind: page
    title: Dashboard
    route: /dashboard
  - key: advisor
    kind: expert-chat
    title: Advisor
    persona: ./agents/advisor.md
```

## 常见错误

- 把完整业务逻辑写进 `APP.md`。
- 只声明 expert-chat，却声称是完整 App。
- App 直接调用 Lime 内部模块而不是 SDK。
- 每个 App 自己实现文件、存储、Artifact、Knowledge、Tool Broker。
- 忘记声明 storage migration、secret、network 和 background-task 权限。
