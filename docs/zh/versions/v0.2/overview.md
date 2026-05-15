---
title: v0.2 概览
description: Runtime package 转型版本的历史概览。
---

# v0.2 概览

v0.2 把 Agent App 从声明式组合包推进为完整可安装应用包。它明确 `APP.md` 是发现和审查入口，真实产品行为属于 runtime package。

## 核心变化

- `APP.md` 仍必需，但不再被视为业务实现。
- 增加 runtime package model：`dist/ui`、`dist/worker`、`storage`、`workflows`、`artifacts`、`policies`。
- 引入 Capability SDK 边界：`lime.ui`、`lime.storage`、`lime.files`、`lime.agent`、`lime.knowledge`、`lime.tools`、`lime.artifacts`、`lime.workflow`、`lime.policy`、`lime.evidence`、`lime.secrets`。
- 明确 Expert 只是 `expert-chat` entry，不是整个 Agent App。
- Manifest 扩展到 `requires`、`runtimePackage`、`ui`、`storage`、`services`、`events`、`secrets`、`lifecycle`。
- Reference CLI projection 开始输出 capability requirements、storage、services、permissions 和 runtime descriptors。

## 适合场景

v0.2 面向 product-level apps，例如内容工厂、客服工作台、合同审查系统、研究工作台和企业内部 workflow apps。

## 局限

v0.2 仍保留部分旧 entry 词汇，也没有完全锁定 typed descriptor schemas、overlay templates、package hash provenance 和 v0.3 compatibility rules。

## 升级建议

升级到 v0.3 时，应补 typed SDK expectations、stronger permissions、overlay templates、`packageHash` provenance、current entry kinds 和 richer readiness output。

## v0.2 打开了什么

v0.2 让 app installation、local runtime assets 和 host capability injection 可以作为一个 package lifecycle 来讨论。它给 UI bundles、workers、migrations 和 workflow descriptors 提供了位置，而不是继续把 `APP.md` 当成万能实现文件。

## 升级时要保留什么

保留 v0.2 的核心洞察：真实实现属于 package assets，不属于 discovery document。把弱描述或隐含描述替换为 v0.3 typed fields、更强 readiness findings 和 provenance hashes。

## 前后对比示例

| 关注点 | v0.1 风格 | v0.2 风格 |
| --- | --- | --- |
| Dashboard | 写在 Markdown 里。 | 声明为 UI bundle route。 |
| 长任务 | 隐含在 chat instructions 中。 | Worker 或 workflow asset。 |
| 本地数据 | 非正式 notes。 | Storage namespace 和 schema。 |
| 宿主调用 | 边界不清。 | Capability SDK boundary。 |
| Setup | 主要靠 prose。 | 面向 readiness 的 requirements。 |

## 读者应带走什么

设计新的 product-level app 时，先继承 v0.2 的关键想法：实现需要被打包；然后立刻应用 v0.3 entry kinds、permission rules、overlay model、provenance 和 typed SDK calls。
