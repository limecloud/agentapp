---
title: v0.8 Specification Snapshot
description: v0.8 adds standalone installation modes, Lime Runtime separation, and Lime App Shell compatibility.
---

# v0.8 Specification Snapshot

v0.8 inherits the [v0.7 specification](../v0.7/specification) and adds **Standalone Installation & Runtime Separation**. See the [latest specification](../../specification) for the complete current contract.

## Incremental requirements

1. Product-level apps should declare install modes in `app.install.yaml` or the `install` manifest shorthand.
2. Hosts must treat Lime Desktop, Lime App Shell, runtime-backed shells, and compatible web hosts as different hosts over the same Capability SDK contract.
3. Standalone apps may carry a runtime bundle, but agent execution, secrets, policy, tool execution, storage namespace, and evidence must still be mediated by Lime Runtime capability handles.
4. Runtime-backed apps must declare the required system runtime name and minimum version.
5. Standalone apps should declare branding, bundle identity, target platforms, update policy, and runtime compatibility.
6. Users must be able to install and launch a standalone Agent App without first understanding or opening Lime Desktop.

## New layered file

```text
app.install.yaml
```

## Minimal install contract

```yaml
install:
  modes:
    - in_lime
    - standalone
    - runtime_backed
  runtime:
    minVersion: 0.8.0
    distribution:
      standalone:
        embedRuntime: true
        shell: lime-app-shell
      runtimeBacked:
        requires: lime-runtime
        minVersion: 0.8.0
  standalone:
    shell: lime-app-shell
    bundleId: ai.limecloud.example
    platforms: [macos, windows]
  runtimeBacked:
    requires: lime-runtime
    minVersion: 0.8.0
  branding:
    name: Example Agent App
    icon: ./assets/icon.svg
    windowTitle: Example Agent App
```

## Forbidden patterns

- Do not make Lime Desktop the mandatory prerequisite for every Agent App.
- Do not let each standalone app create its own model gateway, permission system, plaintext credential store, or evidence store.
- Do not import Lime Desktop internals from app code.
- Do not package customer-private workspace data into public standalone releases.
- Do not treat a web-hosted trial as equivalent to a local governed runtime unless capability and data boundaries match.
