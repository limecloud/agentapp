---
title: v0.9 Specification Snapshot
description: v0.9 adds App Server bridge profile contracts above v0.8 install modes.
---

# v0.9 Specification Snapshot

v0.9 inherits the [v0.8 specification](../v0.8/specification) and adds **App Server Bridge Profile**. See the [latest specification](../../specification) for the complete current contract.

Minimum bridge profile:

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

Rules:

- Apps call Capability SDK / Host Bridge only.
- Desktop Host owns shell transport and sidecar lifecycle.
- App Server JSON-RPC owns backend request / response shape.
- RuntimeCore / services own session, turn, event, artifact, evidence, workspace, and policy facts.
- Product hosts must not replace failed App Server bridge calls with mock success.
