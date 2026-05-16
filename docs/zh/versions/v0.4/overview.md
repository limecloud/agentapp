---
title: v0.4 概览
description: Host Bridge v1 的运行时事件协议。
---

# v0.4 概览

v0.4 把 Host Bridge v1 写入标准，作为 Agent App UI 与 Lime Host 之间的事件传输层。

## 核心变化

- 标准 `lime.agentApp.bridge` runtime event 协议：受控 message envelope、版本号、requestId、appId、entryKey、payload。
- Host -> App 事件：`host:snapshot`、`theme:update`、`host:response`、`host:error`、`host:visibility`。
- App -> Host 事件：`app:ready`、`host:getSnapshot`、`host:navigate`、`host:toast`、`host:openExternal`、`host:download`、`capability:invoke`。
- 主题、语言、入口上下文、可见性、导航、通知、下载、能力调用统一走同一个桥。
- Host Bridge 是传输层，不替代 Capability SDK；Host 仍是唯一裁决方。

## 为什么重要

v0.3 之前每个 App 都要自定义 `postMessage` 协议，导致主题、语言、policy 拦截无法标准化。v0.4 把这些事件固定下来，App 不再需要私有桥。

## 兼容说明

v0.4 保持 v0.3 的 manifest schema、typed SDK 期望、overlay 模型、readiness 不变。仅新增 Host Bridge 协议作为 UI runtime 边界。

## 兼容旧 App

仍使用 v0.3 manifest 的 App 在 v0.4 宿主里继续工作。Host Bridge 是宿主能力，不要求 App 改动 manifest。
