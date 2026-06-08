---
title: v0.9 Changelog
description: Changes introduced by Agent App v0.9.
---

# v0.9 Changelog

## 0.9.0

- Adds `agentRuntime.bridge` as the App Server bridge profile for `lime.agent` and `lime.workflow` execution.
- Standardizes the path from Capability SDK / Host Bridge to Desktop Host IPC, App Server JSON-RPC, RuntimeCore services, and ExecutionBackend.
- Extends `app-runtime.schema.json` with bridge kind, transport, method mapping, and event provenance constraints.
- Extends `app-install.schema.json` with client package, sidecar, release manifest, and sha256 distribution metadata.
- Updates the reference CLI to `0.9.0` with `--version 0.9`, `--target 0.9.0`, bridge validation, and v0.9 migration generation.
- Updates Content Factory to a v0.9 example with App Server bridge profile and runtime distribution metadata.

v0.8 apps remain valid. v0.9 adds bridge precision; it does not remove v0.8 install modes.
