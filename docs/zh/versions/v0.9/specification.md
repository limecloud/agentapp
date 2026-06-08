---
title: v0.9 规范快照
description: v0.9 在 v0.8 安装模式之上新增 App Server bridge profile 契约。
---

# v0.9 规范快照

v0.9 继承 [v0.8 规范](../v0.8/specification)，并新增 **App Server Bridge Profile**。完整当前契约见 [latest specification](../../specification)。

最小 bridge profile：

```yaml
agentRuntime:
  bridge:
    kind: app-server-json-rpc
    transport: host-mediated
    protocolVersion: appserver.v0
    clientSurface: capability-sdk
    hostBoundary: desktop-host-ipc
    runtimeOwner: runtime-core
    methods:
      initialize: initialize
      initialized: initialized
      startSession: agentSession/start
      readSession: agentSession/read
      startTurn: agentSession/turn/start
      cancelTurn: agentSession/turn/cancel
      respondAction: agentSession/action/respond
      events: agentSession/event
      listCapabilities: capability/list
      readArtifact: artifact/read
      exportEvidence: evidence/export
    events:
      notification: agentSession/event
      deriveFromRuntimeFacts: true
      allowUiSynthesis: false
```

规则：

- App 只调用 Capability SDK / Host Bridge。
- Desktop Host 拥有壳层 transport 和 sidecar lifecycle。
- App Server JSON-RPC 拥有后端 request / response 形状。
- RuntimeCore / services 拥有 session、turn、event、artifact、evidence、workspace 和 policy facts。
- 生产宿主不得用 mock success 替代失败的 App Server bridge 调用。
