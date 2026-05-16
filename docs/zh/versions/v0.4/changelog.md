---
title: v0.4 变更记录
description: v0.4 关键变化。
---

# v0.4 变更记录

- 标准化 Host Bridge v1 作为 sandboxed Agent App UI 的 runtime event 协议（`lime.agentApp.bridge`）。
- 标准化主题、语言、可见性、响应、错误事件（host -> app）和 ready / snapshot / navigate / toast / download / openExternal / capability invoke 请求（app -> host）。
- 明确 Host Bridge 是 `lime.ui` 与 Capability SDK 的传输层，不是私有 App 协议，也不绕过 readiness、permission、policy、provenance。
