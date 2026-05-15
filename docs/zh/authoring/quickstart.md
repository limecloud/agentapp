---
title: 快速开始
---

# 快速开始

创建一个包含 `APP.md` 的目录：

```text
my-app/
└── APP.md
```

写入 v0.3 frontmatter：

```markdown
---
manifestVersion: 0.3.0
name: my-app
description: 一个最小本地运行 Agent App。
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
    title: 开始
    command: /start
---

# My App

说明宿主什么时候展示这个 App，以及用户需要完成哪些 setup。
```

校验并投影：

```bash
npx agentapp-ref@0.3.0 validate ./my-app
npx agentapp-ref@0.3.0 project ./my-app
npx agentapp-ref@0.3.0 readiness ./my-app
```

随着应用增长，再加入 runtime package、Skill 引用、Knowledge 模板、Tool 需求、Artifact 类型、Overlay 和 Eval。
