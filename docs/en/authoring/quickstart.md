---
title: Quickstart
description: Create a minimal Agent App package.
---

# Quickstart

Create a directory with `APP.md`:

```text
my-app/
└── APP.md
```

Add frontmatter:

```markdown
---
manifestVersion: 0.3.0
name: my-app
description: A minimal local-running agent app.
version: 0.3.0
status: draft
appType: agent-app
runtimeTargets:
  - local
requires:
  sdk: "@lime/app-sdk@^0.3.0"
entries:
  - key: start
    kind: command
    title: Start
    command: /start
---

# My App

Describe when the host should show this app and what setup the user needs.
```

Validate and project it:

```bash
npx agentapp-ref@0.3.0 validate ./my-app
npx agentapp-ref@0.3.0 project ./my-app
npx agentapp-ref@0.3.0 readiness ./my-app
```

Then add runtime package references, Skills, Knowledge templates, Tool requirements, Artifact outputs, overlays, and Evals as the app grows.
