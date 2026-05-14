---
layout: home
title: Agent App
description: 面向 Agent 的可安装应用包标准。

hero:
  name: Agent App
  text: 可安装的智能体应用。
  tagline: "像小程序一样安装到宿主平台，但由宿主本地 Agent Runtime 解析和运行。"
  actions:
    - theme: brand
      text: 阅读规范
      link: /zh/specification
    - theme: alt
      text: 快速开始
      link: /zh/authoring/quickstart
    - theme: alt
      text: 标准生态
      link: /zh/reference/agent-ecosystem
    - theme: alt
      text: LLM 完整上下文
      link: ../llms-full.txt

features:
  - title: APP.md 入口
    details: "学习 Agent Skills 的 SKILL.md：YAML frontmatter 给机器，Markdown 指南给人和 AI 客户端。"
  - title: 本地运行边界
    details: "云端目录可以分发和授权 App，但真正执行发生在宿主本地 Agent Runtime。"
  - title: 组合已有标准
    details: "Agent App 引用 Skills、Knowledge、Tool、Context、UI、Artifact、Evidence、Policy、Runtime、QC，不重新定义它们。"
  - title: 小程序平台心智
    details: "宿主开放能力，App 声明入口和权限，用户安装后在本地环境运行。"
---

## Agent App 定义什么

| 契约 | 回答的问题 |
| --- | --- |
| App 包 | 这是哪个可安装应用，包含什么？ |
| 入口 | 宿主应暴露哪些 scene、command、home、workflow 或 artifact surface？ |
| 能力 | 这个 App 依赖哪些宿主标准和能力表面？ |
| 知识模板 | 用户或租户需要绑定哪些 Agent Knowledge 槽位？ |
| 投影 | 宿主如何把 App 编译成目录，而不发明第二套 Runtime？ |
| 就绪检查 | 运行前哪些 Skill、Knowledge、Tool、权限或 Eval 必须具备？ |

## 快速入口

- [什么是 Agent App？](./what-is-agent-app.md)
- [规范](./specification.md)
- [App 与 Skills / Knowledge 的边界](./agent-app-vs-skills-knowledge.md)
- [运行时模型](./client-implementation/runtime-model.md)
- [AI 内容工程化示例](./examples/content-engineering.md)
