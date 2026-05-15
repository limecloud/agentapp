---
title: v0.1 变更记录
description: 第一个 Agent App 草案的历史变更记录。
---

# v0.1 变更记录

## Added

- 初始 `APP.md` package 约定。
- YAML frontmatter manifest 和 Markdown guide body。
- 受 Agent Skills 启发的 directory-as-package shape。
- App entries、capabilities、Knowledge templates、Skill refs、Tool refs、Artifact types、Evals、presentation、compatibility、metadata 字段。
- Host projection 和 readiness 概念。
- 用户、租户、workspace customization 的 overlay model。
- Reference CLI：`validate`、`read-properties`、`to-catalog`、`project`、`readiness`。
- JSON Schema 发布路径。
- 中英文文档骨架。
- 内容和客服 workflow 示例包。

## 后续变化

- v0.2 引入完整 runtime package 和 Capability SDK。
- v0.3 强化 descriptor schemas，并把 `scene` / `home` 移为 compatibility-only。

## Migration note

不要从 v0.1 开始新工作。新包使用 v0.3，v0.1 只保留历史语境。

## 如何阅读本变更记录

本页用于理解为什么后续版本要走出“只有 manifest”的心智。v0.1 的价值在于命名了 package 边界，但不应作为新宿主的实现目标。

## 如果仍有 v0.1 packages

- 把它们视为 legacy catalog drafts。
- 安装前先跑 v0.3 validation。
- 在新 UI 暴露前替换旧 entry kinds。
- 发布前补 `requires`、`permissions`、`runtimePackage` 和 readiness 预期。

## 历史验收标准

v0.1 package 在当时只要宿主能发现 `APP.md`、解析 frontmatter、展示 catalog card、列出声明 entries，并说明可能需要的外部 assets，就算有用。但这已经不足以支撑 current product apps。

## 为什么仍保留文档

保留 v0.1 页面是为了避免旧概念被重新当成新概念发明出来。当读者看到旧 entry 词汇或 manifest-only package 时，本页能说明那是历史语境，不是 current guidance。
