---
title: Overlay 模型
description: 用户、租户和 workspace 如何定制 Agent App，而不 fork package。
---

# Overlay 模型

Agent App 应该可复用。客户专属知识、凭证、entry 排序、禁用词、品牌语气、模型选择和预算策略，都应该存在 overlay 中，而不是 fork 官方 package。

Overlay 是 package hash 外的配置。它改变某个租户、workspace、用户或客户上下文中的解析结果，但不修改官方 release。

## 优先级

推荐顺序：

```text
Host Default
  -> App Default
  -> Tenant Overlay
  -> Workspace Overlay
  -> User Overlay
  -> Runtime Input
```

某些值可以被高层 policy 锁定。例如租户可以禁止用户覆盖模型成本上限。

## v0.3 overlay template

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

Template 描述能配置什么；具体值由宿主或控制面存储。

## Overlay 可以覆盖什么

- Agent Knowledge bindings 和 retrieval defaults。
- Tool availability 和 credential refs。
- 默认模型、成本限制、fallback 行为。
- UI 排序、禁用 entry、featured entry。
- Workflow 默认值：batch size、retry policy、human review requirement。
- Eval thresholds、禁用词、行业规则、publish gates。
- Artifact export defaults 和 retention policy。

## Overlay 不能做什么

- 修改 package files 或 package hash。
- 保存 plaintext secrets。
- 绕过 readiness、permission 或 policy checks。
- 授予 App 未声明或宿主不允许的 capability。
- 隐藏 provenance。
- App 升级时覆盖用户数据。

## Resolved configuration

宿主应保存最终值和来源：

```json
{
  "key": "default_model",
  "value": "gpt-5.2",
  "source": "tenant",
  "lockedByPolicy": true
}
```

这样才能排查问题：某个 workflow 使用了意外模型时，用户能看到它来自 app default、tenant overlay、workspace setting 还是 runtime input。

## Overlay 与 Readiness

Overlay 变化会影响 readiness。例如绑定 `project_knowledge` 可让 workflow ready；禁用可选 Tool 会导致 entry degraded；提高 eval threshold 会阻塞 publish workflow；移除 secret binding 会让导出不可用。

Overlay 变化后，宿主应重新运行 readiness。

## 升级行为

App 升级时，overlay 留在 package 外。宿主应比较 overlay templates，报告新增槽位、删除槽位、默认值变化、无效 overlay value、与 app requirements 冲突的 policy lock。

## 作者检查表

- 为预期定制声明 overlay templates。
- 私有数据不放 package defaults。
- Overlay key 稳定。
- 文档说明哪些 overlay 影响 readiness。
- 不把 overlay 当隐藏权限绕过。
- 没有 tenant overlay 时也有安全默认值。
