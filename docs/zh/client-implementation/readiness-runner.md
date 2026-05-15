---
title: Readiness Runner
description: 宿主生成 Agent App 运行前可行动设置状态的算法。
---

# Readiness Runner

Readiness Runner 保护用户和宿主，避免失败或不安全运行。它检查已安装 App、host profile、policy 和 workspace setup，输出状态和设置任务。

它不能执行 Agent task、App worker、Tool 或 UI bundle。

## 输入

- normalized manifest
- projection output
- host capability profile
- installed Skill catalog
- available Knowledge bindings
- ToolHub availability
- Artifact / Eval support
- policy decisions
- secret binding state
- selected workspace

## 输出结构

```json
{
  "ok": true,
  "status": "needs-setup",
  "app": "content-factory-app",
  "checks": [
    {
      "severity": "warning",
      "kind": "knowledge",
      "key": "project_knowledge",
      "required": true,
      "message": "运行前请绑定 project_knowledge。"
    }
  ]
}
```

输出应足够稳定，供 UI、CLI、测试和支持工具复用。

## 检查类别

| 类别 | 示例 |
| --- | --- |
| Compatibility | host runtime、SDK、manifest version。 |
| Capability | `lime.ui`、`lime.storage`、`lime.agent`、`lime.tools`。 |
| Package | 引用路径、hash、signature。 |
| Storage | namespace、schema、migration、retention。 |
| Permissions | 安装审查、运行时 ask、policy denial。 |
| Knowledge | 必需 template 是否绑定。 |
| Skills | 必需 Skill 是否安装。 |
| Tools | ToolHub 可用性和租户授权。 |
| Artifacts | artifact type 和 viewer 是否支持。 |
| Evals | 质量门禁和人工 review。 |
| Secrets | secret slot 是否绑定。 |

## 状态决策

```text
存在 error -> failed 或 blocked
存在必需设置缺失 -> needs-setup
只缺可选设置 -> degraded 或 ready with warnings
全部通过 -> ready
```

宿主可以有更细状态，但用户必须知道下一步动作。

## Remediation

每个阻塞或 warning 都应该映射到 remediation：安装 Skill、绑定 Knowledge Pack、启用 ToolHub connector、授权 permission、绑定 secret、升级 host runtime、选择兼容 release、禁用可选 entry。

## Entry-specific readiness

大 App 需要按 entry 展示 readiness。比如 dashboard 可以 ready，但 publish workflow 因缺少导出凭证而 blocked。

```json
{
  "entryKey": "content_calendar",
  "status": "needs-setup",
  "missing": ["publishing_workspace_token"]
}
```

## Cache

只有输入不变时才能缓存 readiness。host profile、Knowledge binding、tool availability、permissions、secrets、package hash、manifest hash、overlay 变化都应失效缓存。

## 检查表

- 不执行 app code。
- 输出机器可读 checks。
- 区分 required 和 optional 缺口。
- 支持 global 和 entry-specific 视图。
- 提供 remediation 文案。
- CLI 和 UI 可复用。
- 诊断信息不泄露 secret。
