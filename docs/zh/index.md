---
layout: home
title: Agent App
description: 面向 Agent 的可安装应用包标准。

hero:
  name: Agent App
  text: 可执行的完整智能应用。
  tagline: "像小程序一样安装到宿主平台，拥有自己的 UI / Workflow / Storage；v0.6 在 v0.5 分层 manifest 之上，标准化 Agent task 事件流、结构化输出、审批、session、工具发现、checkpoint 与可观测性。"
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
  - title: Runtime Package
    details: "APP.md 只是发现入口；真实 UI、worker、storage、workflow 和业务实现属于 runtime package。"
  - title: Capability SDK
    details: "App 通过 lime.ui、lime.storage、lime.agent、lime.artifacts 等稳定能力调用 Lime，不依赖内部实现。"
  - title: 组合已有标准
    details: "Agent App 引用 Skills、Knowledge、Tool、Context、UI、Artifact、Evidence、Policy、Runtime、QC，不重新定义它们。"
  - title: 小程序平台心智
    details: "宿主开放能力，App 声明入口和权限，用户安装后在本地环境运行。"
---

## Agent App 定义什么

| 契约 | 回答的问题 |
| --- | --- |
| App 包 | 这是哪个可安装应用，包含什么？ |
| 入口 | 宿主应暴露哪些 page、command、workflow、artifact、background-task 或 settings？ |
| 能力 | 这个 App 依赖哪些宿主标准和能力表面？ |
| 知识模板 | 用户或租户需要绑定哪些 Agent Knowledge 槽位？ |
| 投影 | 宿主如何把 App 编译成目录，而不发明第二套 Runtime？ |
| 就绪检查 | 运行前哪些 Skill、Knowledge、Tool、权限或 Eval 必须具备？ |

## 快速入口

- [什么是 Agent App？](./what-is-agent-app.md)
- [规范](./specification.md)
- [App 与 Skills / Knowledge 的边界](./agent-app-vs-skills-knowledge.md)
- [Runtime Package 设计](./authoring/runtime-package.md)
- [Capability SDK](./client-implementation/capability-sdk.md)
- [运行时模型](./client-implementation/runtime-model.md)
- [内容工厂示例](./examples/content-factory.md)

## 按角色阅读

| 角色 | 先读 | 再读 |
| --- | --- | --- |
| App 作者 | [快速开始](./authoring/quickstart.md) | Runtime Package、Manifest 设计、权限、发布。 |
| 宿主实现者 | [运行时模型](./client-implementation/runtime-model.md) | Capability SDK、投影、Readiness、安全模型。 |
| 标准审查者 | [规范](./specification.md) | JSON Schemas、术语表、版本说明。 |
| 产品规划者 | [什么是 Agent App？](./what-is-agent-app.md) | App 与 Skills / Knowledge 的边界、示例、小程序类比。 |

## v0.6 承诺

v0.6 App 应该在执行前可理解，不修改宿主 Core 也能安装，通过 typed capability handles 运行，并且能通过稳定 Agent task 事件观测。v0.6 保留 v0.5 分层 manifest，并新增 `app.runtime.yaml` 表达 `lime.agent` 的事件 / 结果信封、结构化输出、runtime approval、session resume / fork、工具发现、checkpoint scope 与可观测性。如果一个 package 不能从文档和 manifest 字段说明 entry、权限、数据边界、runtime assets、任务输出契约和恢复边界，它还不适合作为 Agent App 分发。

## 完整页面应回答什么

本 docs 中每个 Agent App 页面都应帮助读者回答四个问题：这个概念负责什么边界、manifest 或 runtime 用哪些字段表达、宿主应如何实现、达到发布级需要哪些检查。如果一个页面只解释术语，却没有实现线索、readiness 或失败模式，就应继续补齐。

## 典型实现顺序

1. 定义 App 边界和用户可见 entries。
2. 声明 capabilities、storage、Knowledge templates、Tools、Artifacts、permissions 和 Evals。
3. 增加 runtime package assets，并通过 Capability SDK 调宿主能力。
4. 先做 projection 和 readiness，再开放执行。
5. 发布时带 package hashes、compatibility metadata、overlays 和 rollback guidance。
