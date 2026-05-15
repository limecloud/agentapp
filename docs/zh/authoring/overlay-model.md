---
title: Overlay 模型
---

# Overlay 模型

Agent App 应可复用。客户知识、凭证、入口排序、禁用词、品牌语气、模型选择和预算策略应放在 Overlay，而不是 fork 官方 App 包。

优先级固定为：

```text
Workspace Override > User Overlay > Tenant Overlay > App Default > Host Default
```

## v0.3 Overlay Template

App 可以声明可配置槽位：

```yaml
overlayTemplates:
  - key: tenant_defaults
    scope: tenant
    required: false
  - key: workspace_content_rules
    scope: workspace
    required: false
```

Overlay 可以覆盖：

- Agent Knowledge 绑定和默认检索策略。
- 工具凭证引用、默认模型和预算限制。
- UI 排序、禁用 entry、默认 workflow 参数。
- Eval 阈值、人工审核要求、禁用词和行业规则。

Overlay 不能修改官方 package hash，不能包含 secret 明文，不能跳过 readiness、permission 或 policy。
