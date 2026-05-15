---
title: v0.2 规范快照
description: Agent App v0.2 runtime package 契约的冻结摘要。
---

# v0.2 规范快照

本页是历史快照。新 package 应使用最新[规范](../../specification.md)。

## 契约

v0.2 把 Agent App 定义为完整可安装应用包，`APP.md` 是发现入口，runtime package 承载 UI、worker、storage、workflow、artifact、policy 和 example 等资产。

## Runtime package shape

```text
app-name/
├── APP.md
├── dist/ui
├── dist/worker
├── storage/schema.json
├── storage/migrations
├── workflows
├── agents
├── skills
├── knowledge-templates
├── artifacts
├── evals
├── policies
└── examples
```

## Capability SDK

v0.2 引入宿主 capability facade。App 调 `lime.ui`、`lime.storage`、`lime.agent`、`lime.artifacts` 等能力，而不是 import 宿主内部模块。

## App 边界

- App code 属于 runtime package。
- 客户数据属于 Knowledge、workspace files、app storage、secrets 或 overlays。
- Cloud 负责分发和授权，不默认成为 Agent Runtime。
- 宿主负责 install、readiness、policy 和 local execution。

## 被 v0.3 取代的部分

v0.3 保留 runtime package 方向，但强化 descriptor schemas、entry kinds、overlay templates、typed SDK call semantics、readiness shape 和 provenance。

## 迁移姿态

v0.2 packages 比 v0.1 更接近 current apps，但发布前仍需要按 v0.3 收紧。主要工作不是重写业务逻辑，而是把 capabilities、entries、permissions、overlays 和 provenance 显式到足以被宿主自动化处理。

## 迁移后验收标准

- 所有 entries 使用 v0.3 current kinds。
- Runtime assets 可引用且可 hash。
- Required 和 optional capabilities 分离。
- Readiness 能用机器可读 findings 解释缺失 setup。
- Customer overlays 和 secrets 位于官方 package 外。

## Review 问题

- Package body 只是描述 workflow，还是 runtime package 真的包含可运行 assets？
- 所有 capability calls 是否都通过 SDK boundary？
- 宿主能否在不授予宽泛隐式 filesystem、network 或 secret access 的情况下安装 App？
- Registry 能否区分 official package content、tenant overlays 和 customer data？
- v0.3 迁移能否保留用户数据并拒绝不支持的 entry kinds？
