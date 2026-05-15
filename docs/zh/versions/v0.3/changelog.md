---
title: v0.3 变更记录
description: Agent App v0.3.0 引入的变化。
---

# v0.3 变更记录

## Added

- `manifestVersion: 0.3.0` current contract。
- 更强的 `app-manifest`、`app-projection`、`app-readiness` schemas。
- entries、permissions、services、workflows、workflow states、Knowledge templates、Skill refs、Tool refs、Artifact types、Evals、events、secrets、lifecycle、overlay templates descriptor 覆盖。
- Projection 输出中的 `packageHash` provenance。
- Typed SDK expectations：error codes、cancellation、retries、idempotency、traceability、mocks。
- 面向 tenant / workspace customization 的 overlay template model。
- `content-factory-app` reference fixture。
- v0.3 versioned docs。

## Changed

- Agent App 被明确为可执行应用包标准，而不只是声明格式。
- `APP.md` 仍必需，但 runtime implementation 属于 package assets。
- Reference CLI validation 会提示 product-level apps 缺 runtime package declarations。
- Readiness 覆盖 services、workflows、secrets、overlays 和 capability version checks。
- 文档统一把 Expert 视为 `expert-chat` entry，而不是 App 本身。

## Deprecated compatibility

- `scene` 和 `home` entry 只作为兼容历史；`manifestVersion: 0.3.0` 不允许使用。
- 新 App 应使用 `page`、`panel`、`expert-chat`、`command`、`workflow`、`artifact`、`background-task`、`settings`。

## Reference validation

```bash
npm run cli -- validate docs/examples/content-factory-app
npm run cli -- project docs/examples/content-factory-app
npm run cli -- readiness docs/examples/content-factory-app
npm run build
```

## 运行影响

v0.3 把宿主实现工作从“在 UI 里展示文档”变成“安装并运行受治理的 app package”。宿主现在需要 deterministic projection、permission review、runtime capability injection、readiness output 和 package cleanup semantics。

## Release validation set

v0.3 release 应至少检查：

```bash
npm run cli -- validate docs/examples/content-factory-app
npm run cli -- project docs/examples/content-factory-app
npm run cli -- readiness docs/examples/content-factory-app
npm run build
npm pack --dry-run
```

如果通过 registry 分发，还应增加 signature、hash、license、compatibility 和 tenant policy checks。

## 兼容说明

v0.3 不要求宿主立刻执行所有 runtime assets。宿主可以分阶段采用：先 validate 和 project packages，再增加 readiness，再逐个开放 SDK capabilities。关键要求是 current work 不再依赖旧 entry 命名或隐藏 host internals。

## 文档影响

文档现在把每个主要概念都当成页面级契约来写：背景、manifest fields、host behavior、readiness、examples 和 failure modes。这样 App 作者和 client implementors 不需要私有上下文也能 review 标准。
