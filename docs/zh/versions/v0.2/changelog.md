---
title: v0.2 变更记录
description: Runtime package 版本的历史变更记录。
---

# v0.2 变更记录

## Added

- UI bundles、workers、storage schemas、migrations、workflows、artifacts、policies、examples 的 runtime package model。
- `lime.*` capability surfaces 的 Capability SDK framing。
- `requires` 字段，用于 app runtime、SDK、capability requirements。
- `runtimePackage`、`ui`、`storage`、`services`、`events`、`secrets`、`lifecycle` 字段。
- Projection 输出 capability requirements、storage、services、permissions 和 runtime descriptors。
- 面向内容、客服、法务、研究和内部 workflow apps 的 product-level app framing。

## Clarified

- `APP.md` 是 discovery 和 guide，不是 app implementation。
- Expert 只是 `expert-chat` entry。
- 客户数据必须留在官方 package 外。
- Cloud 是控制面，不是默认 Agent Runtime。

## Superseded

v0.3 用 stronger schemas、current entry kinds、typed SDK expectations、overlay templates 和 package hash provenance 取代 v0.2。

## 如何阅读本变更记录

v0.2 是 Agent App 从组合 metadata 走向 runtime package concept 的转折点。它适合用来理解 v0.3 动机，但 current hosts 应实现 v0.3 schemas 和 entry rules。

## 升级重点

- 把剩余旧 entry 词汇转换成 v0.3 current entry kinds。
- 增加 `manifestVersion: 0.3.0` 和更强的 `requires.capabilities`。
- 增加 overlay templates 和 package provenance。
- 确保 runtime code 通过 typed SDK handles 调宿主服务。

## 按角色看影响

| 角色 | 影响 |
| --- | --- |
| App 作者 | 可以开始交付 UI、worker、storage 和 workflow assets，而不只是 manifest metadata。 |
| 宿主实现者 | 需要 install pipeline 检查本地路径、capability requirements 和 runtime descriptors。 |
| Registry 运营者 | 需要区分公开 package assets、tenant overlays 和私有 setup。 |
| 终端用户 | 可以期待 app-like entries 和 setup checks，而不是松散 prompts 集合。 |

## 不应继续复制什么

不要把 v0.2 的弱点复制到新文档里：隐含 entry semantics、不完整 provenance 和宽松 capability 描述。Current work 应使用 v0.3 schemas 和 typed SDK expectations。
