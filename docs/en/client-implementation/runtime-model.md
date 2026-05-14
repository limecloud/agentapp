---
title: Runtime Model
---

# Runtime Model

Agent App is host-executed, not cloud-executed. The package may contain UI and workers, but they must run inside host-controlled runtimes and call platform capabilities through the Capability SDK.

## Core flow

```text
APP.md / manifest
→ package verification
→ projection
→ readiness
→ capability injection
→ UI / worker / workflow execution
→ artifact / evidence / eval
```

## Host runtime responsibilities

- Install, uninstall, upgrade, and disable apps.
- Verify package hash, signature, and manifest.
- Run capability negotiation.
- Register UI routes, panels, commands, and artifact viewers.
- Create app storage namespace and apply migrations.
- Inject `lime.*` capability handles.
- Intercept file, network, secret, tool, agent, and storage permissions.
- Record provenance, evidence, telemetry, and eval results.

## Cloud boundary

Cloud may provide catalog, release, license, tenant enablement, gateway, and ToolHub. Cloud should not become the default Agent Runtime. If server-assisted execution is required, the app must declare it explicitly and Policy must control it.
