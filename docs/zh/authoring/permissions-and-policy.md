---
title: 权限与 Policy
description: Agent App 如何声明权限、策略门禁、secret 和运行风险。
---

# 权限与 Policy

Agent App 是可执行包。它可能注册 UI、运行 workflow、读取用户选择的文件、调用工具、启动 Agent task、创建 Artifact、写入 storage 或请求凭证。宿主必须能在运行前审查并在运行时强制执行这些行为。

Permission 是声明；Policy 是宿主把声明变成 allow、ask、deny、audit、retain、degrade 的决策过程。

## 权限原则

1. 运行前声明。
2. 只请求完成任务所需的最小 scope。
3. 区分安装审查和运行时确认。
4. 凭证保存为 secret handle，不保存明文。
5. 信任敏感操作要记录 Evidence 或 audit。
6. 官方默认值、租户 overlay、workspace override 分离。

## 权限字段

```yaml
permissions:
  - key: read_selected_files
    scope: filesystem
    access: read
    required: true
    reason: 读取用户主动选择的资料文件，用于知识库构建。
  - key: call_content_tools
    scope: tool
    access: execute
    required: true
    reason: 调用文档解析和导出工具。
```

推荐字段：

| 字段 | 含义 |
| --- | --- |
| `key` | 稳定权限 ID。 |
| `scope` | `filesystem`、`network`、`tool`、`model`、`storage`、`artifact`、`secret` 等。 |
| `access` | `read`、`write`、`execute`、`export`、`admin`、`request`。 |
| `required` | 缺失时是否阻塞。 |
| `reason` | 用户可读说明。 |
| `entries` | 可选，哪些 entry 需要此权限。 |
| `degradedBehavior` | 可选权限被拒绝后的降级行为。 |

## 安装时和运行时

| 权限 | 安装时 | 运行时 |
| --- | --- | --- |
| App storage namespace | 展示创建计划。 | 激活时执行 migration。 |
| 用户选择文件 | 展示可能需要。 | 用户选文件时确认。 |
| 外部 Tool | 检查可用性。 | 高风险调用前确认。 |
| 模型成本 | 展示成本策略。 | 按 run 或月度限额拦截。 |
| Secrets | 声明 secret slot。 | 用户或租户管理员绑定。 |
| Export | 展示输出类型。 | 确认目标和保留策略。 |

## Secret

App 只能声明 secret slot，不能包含 secret value。

```yaml
secrets:
  - key: publishing_workspace_token
    provider: lime.secrets
    scope: workspace
    required: false
```

App 应拿到宿主提供的 handle，而不是明文凭证。

## Policy 结果

| 结果 | 行为 |
| --- | --- |
| `allow` | 可以继续。 |
| `ask` | 需要用户、管理员或 workspace owner 确认。 |
| `deny` | 不能使用该能力。 |
| `degraded` | 降级运行。 |
| `audit-only` | 可运行，但必须记录审计或 Evidence。 |
| `blocked` | 设置变更前不能激活。 |

Readiness 应把这些结果展示为用户可行动任务。

## 运行时强制拦截

权限 UI 不够。Capability SDK bridge 必须执行拦截。即使 UI 没隐藏按钮，未授权 tool call 也必须被 bridge 拒绝。

拦截点包括：SDK handle 创建、storage namespace、tool invocation、file read/write、model task、artifact export、secret access、network access、background task schedule。

## 发布前检查

- 每个可执行 entry 都声明了权限。
- 每个 secret 都是 slot，不是 value。
- 可选权限有降级行为。
- Policy error code 稳定可读。
- Bridge 层强制执行，而不只靠 UI。
- 信任敏感运行会记录 Evidence。
