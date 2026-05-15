---
title: Readiness 与评估
description: App 作者如何定义运行前检查和输出质量门禁。
---

# Readiness 与评估

Readiness 和 Eval 回答的是两个不同问题。

- Readiness 问：这个 App 现在能不能安全运行？
- Eval 问：这次输出是否足够可信，可以发布、导出或交付？

一个 App 可以结构有效但 `needs-setup`；一个 App 也可以 ready，但输出没有通过 eval。

## Readiness 输入

Readiness 应检查 manifest、package、host profile、workspace setup、tenant policy 和用户选择。

| 区域 | 示例检查 |
| --- | --- |
| Host runtime | 是否满足 `appRuntime` 和 SDK 版本范围。 |
| Capabilities | `lime.ui`、`lime.storage`、`lime.agent` 等是否可用。 |
| Runtime package | UI、worker、schema、workflow 路径是否存在。 |
| Permissions | 必要权限是否声明并可解析。 |
| Knowledge | 必需 Knowledge template 是否绑定。 |
| Skills | 必需 Skill 是否安装或随包提供。 |
| Tools | 必需 Tool 是否可用并授权。 |
| Artifacts | 宿主是否支持声明的 Artifact 类型。 |
| Evals | 必需 Eval 是否存在或可由宿主实现。 |
| Secrets | 必需 secret slot 是否绑定。 |

## Readiness 状态

| 状态 | 含义 |
| --- | --- |
| `ready` | 可运行选定 entry。 |
| `needs-setup` | 需要用户或管理员补 Knowledge、Tool、权限或 secret。 |
| `degraded` | 可降级运行。 |
| `blocked` | Policy、兼容性或必需能力阻塞。 |
| `failed` | package 或 manifest 无效。 |

## 可行动 finding

```json
{
  "severity": "warning",
  "kind": "knowledge",
  "key": "project_knowledge",
  "required": true,
  "message": "运行 content_factory 前请绑定 project_knowledge。",
  "remediation": "选择或创建 brand-product Knowledge Pack。"
}
```

模糊错误会让用户放弃；可行动 finding 会让用户完成设置。

## Eval 类型

| Eval | 用途 |
| --- | --- |
| Fact grounding | 验证主张是否有 Knowledge 或来源支撑。 |
| Policy compliance | 检查客服、法务、安全或品牌规则。 |
| Tone fit | 检查输出是否符合语气。 |
| Completeness | 检查必填章节或字段是否完整。 |
| Artifact validity | 校验表格、JSON、PPT、报告或代码。 |
| Human review | 导出或发布前必须人工确认。 |

## 声明 Eval

```yaml
evals:
  - key: fact_grounding
    kind: quality
    evidenceRequired: true
    required: true
  - key: publish_readiness
    kind: human-review
    required: false
```

如果 Eval 影响信任，就应该链接 Evidence，让用户能看到为什么通过或失败。

## 连接 Artifact

Eval 不应该只是全局 prompt。尽量绑定到 entry 或 artifact type。

```yaml
artifactTypes:
  - key: content_table
    standard: agentartifact
    required: true
evals:
  - key: fact_grounding
    appliesTo: [content_table]
    evidenceRequired: true
```

这样宿主可以在 Artifact 上直接展示质量状态。

## 作者检查表

- 必需设置进入 readiness，而不只写在正文里。
- 可选依赖有降级行为。
- Eval 连接到 entry 或 Artifact。
- 信任敏感 Eval 记录 Evidence。
- Human review gate 明确。
- Readiness 不执行 Agent task。
- Eval 失败不会删除 Artifact，而是标记未通过。
