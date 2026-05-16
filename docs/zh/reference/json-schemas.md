---
title: JSON Schemas
description: Agent App manifest、projection 和 readiness 输出的公共 schema。
---

# JSON Schemas

Agent App 发布 JSON Schemas，让宿主、registry、编辑器和 CI 可以机械校验契约。

## 公共 Schema 文件

| Schema | 用途 |
| --- | --- |
| [`app-manifest.schema.json`](/schemas/app-manifest.schema.json) | 校验 `APP.md` 或 `app.manifest.json` 中的 manifest 字段。 |
| [`app-runtime.schema.json`](/schemas/app-runtime.schema.json) | 校验 v0.6 `app.runtime.yaml` Agent task runtime contract。 |
| [`app-requirements.schema.json`](/schemas/app-requirements.schema.json) | 校验 v0.7 业务需求、MVP 范围、非目标和验收标准。 |
| [`app-boundary.schema.json`](/schemas/app-boundary.schema.json) | 校验 v0.7 App / Host / Cloud / connector / external system / human 职责边界。 |
| [`app-integrations.schema.json`](/schemas/app-integrations.schema.json) | 校验 v0.7 Host/Cloud 托管的外部集成需求。 |
| [`app-operations.schema.json`](/schemas/app-operations.schema.json) | 校验 v0.7 操作副作用、审批、dry-run 和 evidence 契约。 |
| [`app-fit-report.schema.json`](/schemas/app-fit-report.schema.json) | 校验 v0.7 商业需求适配评估报告。 |
| [`app-projection.schema.json`](/schemas/app-projection.schema.json) | 校验带 provenance 的宿主 projection 输出。 |
| [`app-readiness.schema.json`](/schemas/app-readiness.schema.json) | 校验 readiness 输出和 setup findings。 |

## 使用场景

1. 作者编辑器自动补全和校验。
2. 发布 package 前 CI 校验。
3. Registry 接收 release 前校验。
4. 宿主安装前校验 manifest shape。

Schema 不替代 runtime policy，只校验结构。

## Manifest Schema

Manifest schema 覆盖 identity、runtime targets、SDK/capability requirements、runtime package、entries、UI、storage、services、workflows、Knowledge、Skills、Tools、Artifacts、Evals、permissions、secrets、lifecycle、overlays、v0.6 `agentRuntime` 简写、v0.7 `requirements` / `boundary` / `integrations` / `operations` 简写、presentation、compatibility。

v0.3 current entry kinds 是 `page`、`panel`、`expert-chat`、`command`、`workflow`、`artifact`、`background-task`、`settings`。

## Projection Schema

Projection schema 确保宿主生成的 catalog objects 包含 app summary、entries、capabilities、storage、services、workflows、requirements、boundary、integrations、operations 和 provenance。

Projection 应包含 `manifestHash` 和 `packageHash`，这样派生对象能追溯到 release。

## Readiness Schema

Readiness schema 确保 setup checks 机器可读。宿主应尽量输出稳定 severity、kind、key、message、remediation 和 version。

## 本地使用

```bash
npm run cli -- validate docs/examples/content-factory-app
npm run cli -- project docs/examples/content-factory-app
npm run cli -- readiness docs/examples/content-factory-app
```

Reference CLI 不替代完整 JSON Schema validator，但能从 App 作者视角验证同一契约。

## 兼容说明

Schema 可能比散文更严格。如果 prose 和 schema 冲突，以 schema 和 CLI 行为作为机械契约，再修正文档。

## CI 集成模式

Package 仓库应按这个顺序运行 schema 和 reference checks：

```text
读取 APP.md
→ 校验 manifest shape
→ 检查本地引用文件
→ 生成 host catalog projection
→ 校验 projection JSON
→ 基于 fixture host profile 运行 readiness
→ required checks 全部通过后才发布 package artifacts
```

Reference CLI 覆盖共享语义。生产 registry 可以继续增加 JSON Schema validator、签名校验、恶意文件扫描、license 检查、package hash 对比和 tenant policy review。

## Schema 归属

| 文件 | 归属 | 兼容预期 |
| --- | --- | --- |
| Manifest schema | 标准作者和 host implementors。 | Minor release 应只增加 optional fields。 |
| Projection schema | Host implementors。 | 相同 package 和 host profile 下 projection 输出应保持确定性。 |
| Readiness schema | Host implementors 和 registry reviewers。 | Findings 应保持稳定 `kind`、`severity` 和 `key`。 |

## 失败解释

- Schema failure 表示文档结构无效。
- Validation failure 表示 package 不能按现状接收。
- Readiness failure 表示 package 结构可能有效，但当前环境不能运行。
- Warning 表示可用于 review，但解决或接受前不应视为 production-ready。
