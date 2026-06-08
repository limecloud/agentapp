---
title: v0.9 概览
description: v0.9 标准化 Agent App runtime execution 的 App Server bridge profile。
---

# v0.9 概览

v0.9 的主题是 **App Server Bridge Profile**。它保留 v0.8 安装模式，并把 runtime 路径明确为：

```text
Agent App UI / Worker
  -> Capability SDK / Host Bridge
  -> Desktop Host IPC
  -> App Server JSON-RPC
  -> RuntimeCore / services
  -> ExecutionBackend
```

标准仍然面向 App。App package 声明需求并调用 `@lime/app-sdk`；它不直接启动 sidecar、不读取 JSONL transport、不调用旧 desktop command、不 import RuntimeCore 内部类型。

## 核心变化

- **`agentRuntime.bridge`**：声明 `lime.agent` / `lime.workflow` 如何映射到 App Server JSON-RPC。
- **宿主中介 transport**：Desktop Host 负责 IPC、preload / WebView 白名单、sidecar lifecycle 和 renderer-safe projection。
- **RuntimeCore facts**：Agent events、artifacts 和 evidence 来自 RuntimeCore / services，不由 App UI state 合成。
- **Reference CLI**：`agentapp-ref` 支持 `--version 0.9`，并校验 App Server bridge profile 字段。
- **Runtime 分发元数据**：`app.install.yaml` 可以声明 `app-server-client`、sidecar binary、release manifest 和 sha256 要求。

## 兼容性

- v0.8 App 在 v0.9 Host 中继续有效。
- v0.9 Host 应对使用 `lime.agent` 但没有声明 App Server bridge profile 的 App 给出 warning。
- Reference mock 只允许用于测试和离线 eval；生产路径没有真实 bridge 时必须 fail closed。
