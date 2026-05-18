---
title: v0.8 变更记录
description: Agent App v0.8 引入的变化。
---

# v0.8 变更记录

## 0.8.0

- 新增 `app.install.yaml` 作为 v0.8 分层安装契约。
- 定义 `in_lime`、`standalone`、`runtime_backed` 和 `web_host` 安装模式。
- 把产品模型拆成 Agent App package、Lime Runtime Core、Lime Desktop host 和 Lime App Shell。
- Reference CLI 升级到 `0.8.0`，支持 `--version 0.8`、`--target 0.8.0`、v0.8 migration suggestions 和 install metadata projection。
- 新增 `app-install.schema.json`，并在 manifest schema 中加入 `manifestVersion: 0.8.0` 与 `install` 简写。
- Content Factory 示例升级到 v0.8，并补充独立安装 / runtime-backed 安装契约。

v0.7 App 继续有效。v0.8 新增的是分发形态，不移除 v0.7 需求边界与能力交接模型。
