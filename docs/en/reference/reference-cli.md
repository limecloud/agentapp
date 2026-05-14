---
title: Reference CLI
description: agentapp-ref commands.
---

# Reference CLI

`agentapp-ref` is a small reference CLI for validating app packages and exercising the documented contracts.

```bash
agentapp-ref validate <app>
agentapp-ref read-properties <app>
agentapp-ref to-catalog <app>
agentapp-ref project <app>
agentapp-ref readiness <app> [--workspace <path>]
```

The CLI does not run agents, call models, or execute tools. It validates declarations and emits JSON.
