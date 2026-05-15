---
title: v0.1 规范快照
description: 原始 Agent App v0.1 契约的冻结摘要。
---

# v0.1 规范快照

本页是历史快照。新 package 应使用最新[规范](../../specification.md)。

## 契约

v0.1 把 Agent App 定义为可安装组合 package，必须包含 `APP.md`。Package 描述 entries、capabilities、Knowledge templates、Skill refs、Tool requirements、Artifact types、Evals、presentation metadata、compatibility 和可选 support files。

## 必需字段

- `name`
- `description`
- `version`
- `status`
- `appType`

## 推荐字段

- `runtimeTargets`
- `entries`
- `capabilities`
- `permissions`
- `knowledgeTemplates`
- `skillRefs`
- `toolRefs`
- `artifactTypes`
- `evals`
- `presentation`
- `compatibility`
- `metadata`

## 宿主行为

兼容宿主发现 `APP.md`，先读取 catalog metadata，把 app entries 投影到宿主 UI，检查 readiness，并保持 Agent 执行在宿主 runtime 内。

## 历史 Entry 模型

v0.1 使用过 `home`、`scene`、`command`、`workflow`、`artifact` 等语言。v0.3 中 `scene` 和 `home` 只作为兼容历史。当前 App 应使用 v0.3 entry model。

## 历史价值

v0.1 固定了第一条边界：App 是组合；Skills 是流程；Knowledge 是可信数据；Runtime 属于宿主。

## 兼容姿态

v0.1 compatibility 应以只读为主，除非宿主明确选择 import 并迁移 package。新工作不应增加新的 v0.1-only 字段，也不应在 current docs 中延续旧 entry 语言。

## Import policy

宿主可以把 v0.1 package 作为 draft 导入，但必须保留原 manifest、生成迁移报告，并在激活前要求作者 review。不建议静默迁移，因为 entry semantics、permissions 和 runtime assets 可能缺失。

## 快照中的已知缺口

| 缺口 | Current expectation |
| --- | --- |
| Runtime package 未完整定义 | 使用 v0.3 runtime package descriptors 和 SDK requirements。 |
| Permissions 不够明确 | 声明面向用户的 permissions，并在 runtime enforcement。 |
| Readiness shape 宽松 | 输出带 severity、kind、key、remediation 的 structured findings。 |
| Entry 词汇过时 | 新 package 只使用 v0.3 current entry kinds。 |
| Provenance 缺失 | 在 projection 和 release metadata 中包含 manifest/package hashes。 |
