---
title: v0.2 变更记录
---

# v0.2 变更记录

## Added

- Runtime package 标准包结构。
- Capability SDK 契约和能力协商。
- `page`、`panel`、`expert-chat`、`background-task`、`settings` entry 类型。
- `requires`、`runtimePackage`、`ui`、`storage`、`services`、`events`、`secrets`、`lifecycle` manifest 字段。
- Product-level conformance level。
- `content-engineering-app` 示例升级为 UI + worker + storage + workflow 形态。

## Changed

- Agent App 定义从“组合层”修正为“完整应用包，宿主执行，SDK 调用能力”。
- README、规范、What is、Manifest、Runtime、JSON Schemas 文档同步更新。
- Reference CLI projection 输出更多 runtime package 相关字段。

## Compatibility

- v0.1 的 `scene` / `home` entry 继续保留为兼容类型。
- v0.1 的 array-style `capabilities` 继续有效。
