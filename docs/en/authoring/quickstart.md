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
name: my-app
description: A minimal local-running agent app.
version: 0.1.0
status: draft
appType: agent-app
runtimeTargets:
  - local
entries:
  - key: start
    kind: scene
    title: Start
---

# My App

Describe when the host should show this app and what setup the user needs.
```

Validate it:

```bash
npx agentapp-ref validate ./my-app
npx agentapp-ref project ./my-app
```

Then add references to Agent Skills, Agent Knowledge templates, Tool requirements, Artifact outputs, and Evals as the app grows.
