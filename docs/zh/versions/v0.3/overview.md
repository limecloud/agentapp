---
title: v0.3 概览
description: 当前 Agent App 可执行 package 契约标准层。
---

# v0.3 概览

v0.3 把 Agent App 从完整 package 草案推进为可执行标准层。目标是让宿主可以验证、投影、安装、运行、审查 product-level apps，而不用把垂直业务写进 host core。

## 核心变化

- 强 JSON schemas：entries、permissions、services、workflows、Knowledge templates、Skill refs、Tool refs、Artifact types、Evals、secrets、overlay templates。
- `@lime/app-sdk` typed SDK expectations：stable error codes、cancellation、retries、idempotency、provenance、mocks。
- UI bundles、workers、workflows、artifact viewers、settings、background tasks 的 runtime ABI guidance。
- 面向 tenant、workspace、user、customer differences 的 overlay templates。
- `scene` / `home` 只作为 compatibility-only；v0.3 App 使用 `page`、`panel`、`expert-chat`、`command`、`workflow`、`artifact`、`background-task`、`settings`。
- Projection provenance 包含 `packageHash` 和 `manifestHash`。
- 参考示例改为 `内容工厂` / `content-factory-app`。

## 为什么重要

v0.3 是第一个足够支撑宿主实现的版本。它不仅定义 `APP.md`，也定义宿主如何理解 runtime package、capability negotiation、readiness、overlays、secrets 和 provenance。

## 当前心智模型

```text
Registry / Cloud
  catalog, release, tenant enablement
    -> Host
       install, project, readiness, policy, SDK injection
         -> Agent App Runtime Package
            UI, workflow, worker, storage, artifacts
```

## 适合场景

内容工厂、客服工作台、销售 SOP 应用、合同审查产品、投资研究工作台、内部流程 App、客户专属私有业务系统。

## 实现重点

宿主接入 v0.3 时，应先实现只读 package inspection、projection、readiness 和 cleanup，再通过 typed SDK bridge 逐个打开 runtime capability。

## 兼容说明

使用 `scene` 或 `home` 的旧 package 应视为兼容历史。新工作应使用 v0.3 current entry kinds。

## v0.3 中什么才算完整

一个 v0.3 package 只有在宿主能不执行代码就 inspect、投影 entries、解释 setup gaps、授权 required capabilities、通过 SDK 运行 runtime assets、记录 Evidence，并且能在不破坏用户数据的情况下 remove 或 upgrade 时，才算完整。

## 宿主实现阶段

1. Read-only inspection 和 schema validation。
2. 带 provenance 的 catalog projection。
3. Readiness runner 和 setup UI。
4. 给 UI 和 workers 注入 Capability SDK。
5. Lifecycle management：install、update、disable、uninstall、export data。
6. Registry 和 tenant policy integration。

## 读者检查表

读完 v0.3 页面后，读者应能：

- 判断一个业务能力应归为 App、Skill、Knowledge pack、Tool 还是 Artifact。
- 写出区分 discovery、runtime implementation、setup 和 release metadata 的 manifest。
- 在不硬编码垂直 entries 的情况下实现 host projection。
- 执行前向用户解释 readiness findings。
- 让客户私有数据留在官方 package 外。
- 在不丢失用户自有数据的情况下 upgrade 或 remove App。
