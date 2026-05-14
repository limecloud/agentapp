---
title: JSON Schemas
---

# JSON Schemas

参考 schema 发布在 `docs/public/schemas`，覆盖 app manifest、app projection 和 readiness result。当前 schema 保持向前兼容，允许宿主实验；但已经把 Agent App 从“声明组合包”推进到“runtime package + Capability SDK”模型。

## Schema 文件

| 文件 | 说明 |
| --- | --- |
| `app-manifest.schema.json` | `APP.md` frontmatter / `app.manifest.json` 的机器契约，包含 `requires`、`runtimePackage`、`ui`、`storage`、`services`、`entries`、`secrets`、`lifecycle` 等字段。 |
| `app-projection.schema.json` | 宿主把 App 编译为 catalog projection 的输出契约，包含 capability requirements、entries、UI、storage、services、permissions 和 provenance。 |
| `app-readiness.schema.json` | 安装或运行前 readiness 检查结果。 |

## 检查清单

- `APP.md` 是发现入口，不是业务实现。
- Runtime package 承载 UI、worker、storage、workflow 和 Artifact 实现。
- App 只能通过 Capability SDK 使用 Lime 平台能力。
- 客户事实放在 Agent Knowledge、workspace files、App storage 或 overlay。
- 凭证放在 `lime.secrets`，不进入官方包。
- Projection 对象必须带 App provenance。
