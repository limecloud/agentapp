---
title: v0.1 概览
description: 第一个 Agent App package 草案的历史概览。
---

# v0.1 概览

Agent App v0.1 建立了最早的 package contract：包含 `APP.md` 的目录、YAML frontmatter、人类可读指南、host projection、readiness、overlays、schemas、中英文文档和参考 CLI。

v0.1 是基础版本。它证明了 agent 应用需要一个比 Skill 更大、比 prompt 更结构化的 package 边界。

## 核心想法

- `APP.md` 是必需发现入口。
- App 安装进宿主，而不是由隐藏 registry runtime 执行。
- 宿主把 app 声明投影成本地 catalog entries。
- Skills 和 Knowledge 保持独立标准。
- 客户数据留在官方 package 外。
- Readiness 在执行前检查 setup。
- Overlays 支持租户和 workspace 定制。

## v0.1 package shape

```text
my-agent-app/
├── APP.md
├── skills/
├── knowledge-templates/
├── workflows/
├── tools/
├── artifacts/
├── evals/
├── assets/
└── examples/
```

只有 `APP.md` 必需，support folders 渐进加载。

## v0.1 没解决什么

v0.1 仍主要是组合草案，还没有完整定义 runtime package ABI、typed SDK calls、worker execution、强 descriptor schemas、package provenance 和 v0.3 current entry kinds。

## 升级建议

1. 新包使用 `manifestVersion: 0.3.0`。
2. 把旧 `scene` / `home` entry 替换为 current entry kinds。
3. 增加 `requires.sdk` 和 `requires.capabilities`。
4. 把实现移入 runtime package folders。
5. 增加 permissions、secrets、overlays 和 provenance-aware readiness。

## 事后看宿主行为

只支持 v0.1 的宿主可以列出 App 和粗略 entries，但不能有信心运行 product-level apps。它缺少 v0.3 需要的 runtime package 边界、SDK negotiation、permission model 和 provenance。

## 迁移检查表

| 区域 | v0.1 信号 | v0.3 替代 |
| --- | --- | --- |
| Entry model | `home` / `scene` 风格 entries。 | Current entry kinds，并带 implementation pointers。 |
| Runtime | 大多只在 docs 中暗示。 | 声明 runtime package 和 Capability SDK。 |
| Data | 泛化 Knowledge references。 | Required templates、overlays、secrets、storage namespace。 |
| Quality | 初始 eval 概念。 | Evals、Evidence、readiness 和 human review paths。 |
| Release | 草稿 metadata。 | Package hash、manifest hash、compatibility、lifecycle。 |
