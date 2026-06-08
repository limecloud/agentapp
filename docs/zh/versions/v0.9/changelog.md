---
title: v0.9 变更记录
description: Agent App v0.9 引入的变化。
---

# v0.9 变更记录

## 0.9.0

- 新增 `agentRuntime.bridge`，作为 `lime.agent` 和 `lime.workflow` 执行的 App Server bridge profile。
- 标准化 Capability SDK / Host Bridge 到 Desktop Host IPC、App Server JSON-RPC、RuntimeCore services 和 ExecutionBackend 的路径。
- 扩展 `app-runtime.schema.json`，加入 bridge kind、transport、method mapping 和 event provenance 约束。
- 扩展 `app-install.schema.json`，加入 client package、sidecar、release manifest 和 sha256 分发元数据。
- Reference CLI 升级到 `0.9.0`，支持 `--version 0.9`、`--target 0.9.0`、bridge validation 和 v0.9 migration generation。
- Content Factory 示例升级到 v0.9，并补充 App Server bridge profile 与 runtime distribution metadata。

v0.8 App 继续有效。v0.9 增加的是 bridge 精度，不移除 v0.8 安装模式。
