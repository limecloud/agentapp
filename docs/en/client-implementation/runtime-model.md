---
title: Runtime model
description: How an installed Agent App runs in a host.
---

# Runtime model

Agent App is runtime-neutral but host-executed. It declares what should be available; the host decides how to run it through existing standards.

```mermaid
sequenceDiagram
  participant User
  participant Host as Host app platform
  participant Resolver as App Resolver
  participant Runtime as Agent Runtime
  participant Skills as Agent Skills
  participant Knowledge as Agent Knowledge
  participant Tools as Agent Tool
  participant Artifact as Agent Artifact

  User->>Host: Launch app entry
  Host->>Resolver: Resolve entry, overlay, permissions
  Resolver->>Knowledge: Select bound knowledge packs
  Resolver->>Skills: Select required skills
  Resolver->>Tools: Check tool permissions
  Resolver-->>Runtime: Submit task with refs and provenance
  Runtime->>Skills: Follow activated workflow
  Runtime->>Knowledge: Load fenced context
  Runtime->>Tools: Invoke allowed tools
  Runtime->>Artifact: Write deliverable
  Runtime-->>Host: Emit events and results
```

Cloud services can provide registries, models, or tools, but they should not become a hidden app runtime unless the app explicitly declares a server-assisted target and the host policy permits it.
