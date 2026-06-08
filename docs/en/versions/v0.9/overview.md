---
title: v0.9 Overview
description: v0.9 standardizes the App Server bridge profile for Agent App runtime execution.
---

# v0.9 Overview

v0.9 is about **App Server Bridge Profile**. It keeps v0.8 install modes and makes the runtime path explicit:

```text
Agent App UI / Worker
  -> Capability SDK / Host Bridge
  -> Desktop Host IPC
  -> App Server JSON-RPC
  -> RuntimeCore / services
  -> ExecutionBackend
```

The standard remains app-facing. App packages declare what they need and call `@lime/app-sdk`; they do not spawn sidecars, read JSONL transport, call legacy desktop commands, or import RuntimeCore internals.

## Core changes

- **`agentRuntime.bridge`**: declares how `lime.agent` / `lime.workflow` map to App Server JSON-RPC.
- **Host-mediated transport**: Desktop Host owns IPC, preload / WebView allowlists, sidecar lifecycle, and renderer-safe projection.
- **RuntimeCore facts**: Agent events, artifacts, and evidence derive from RuntimeCore / services, not App UI state.
- **Reference CLI**: `agentapp-ref` supports `--version 0.9` and validates App Server bridge profile fields.
- **Runtime distribution metadata**: `app.install.yaml` can declare `app-server-client`, sidecar binary, release manifest, and sha256 requirements.

## Compatibility

- v0.8 apps remain valid in v0.9 hosts.
- v0.9 hosts should warn when `lime.agent` apps do not declare an App Server bridge profile.
- Reference mocks remain allowed for tests and offline evals only; product paths must fail closed when the real bridge is unavailable.
