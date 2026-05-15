---
title: Overlay Resolver
description: 宿主如何合并 App 默认值、租户策略、workspace 设置和用户选择。
---

# Overlay Resolver

Overlay 让官方 App 保持可升级，同时允许租户、workspace 和用户做差异化配置。它用于表达客户特定配置，而不是 fork 官方 package。

## Overlay 层级

推荐顺序：

```text
Host defaults
  -> App defaults
  -> Tenant overlay
  -> Workspace overlay
  -> User overlay
  -> Runtime entry input
```

高层可以覆盖低层，但必须受 policy 限制。

## Overlay 可配置什么

| 区域 | 示例 |
| --- | --- |
| Knowledge binding | 哪个 Knowledge Pack 绑定到 `project_knowledge`。 |
| Model defaults | 默认模型、成本上限、fallback model。 |
| Tool availability | 启用或禁用可选 Tool。 |
| Entry visibility | 对租户隐藏 beta 或高风险 entry。 |
| Eval thresholds | publish readiness 分数线。 |
| Brand rules | 语气、禁用词、review 要求。 |
| Export defaults | 文件格式、目标、保留策略。 |
| Workflow settings | 是否强制人工 review、批量大小、重试策略。 |

Overlay 不应保存明文凭证；凭证使用 secret handle。

## Overlay template

```yaml
overlayTemplates:
  - key: tenant_defaults
    scope: tenant
    required: false
  - key: workspace_content_rules
    scope: workspace
    required: false
```

Template 描述可配置槽位；具体 overlay value 存在 package 外。

## Resolved value 和 provenance

Resolver 应同时返回最终值和来源：

```json
{
  "key": "fact_grounding_threshold",
  "value": 0.86,
  "source": "workspace",
  "overrides": ["app", "tenant"],
  "lockedByPolicy": false
}
```

Provenance 有助于排查：用户需要知道配置来自 app default、tenant policy、workspace admin 还是自己设置。

## 冲突处理

| 冲突 | 建议行为 |
| --- | --- |
| User override 违反 tenant policy | 拒绝并展示 tenant policy 原因。 |
| Workspace 选择不可用 Tool | readiness 标为 `needs-setup` 或 `blocked`。 |
| App upgrade 删除 overlay key | 保留 orphaned overlay，等待管理员审查。 |
| 两层 overlay 绑定同一 Knowledge slot | 按优先级选择，并展示 provenance。 |

## 升级关系

App 升级可以改变默认值，但不能覆盖 overlay。新 release 改 template 时，宿主应展示新增 key、删除 key、默认值变化、需要管理员 review 的 key、schema 不匹配 overlay。

## 实现检查表

- 解析结果确定性。
- 每个 resolved value 都有 provenance。
- Overlay 不进入 package hash。
- Overlay 按 template 校验。
- 不向 App 暴露明文 secret。
- Overlay 变化后重新运行 readiness。
- 支持诊断时不泄露私有数据。
