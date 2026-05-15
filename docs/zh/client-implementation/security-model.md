---
title: 安全模型
description: 在宿主客户端安装和运行 Agent App 的安全边界。
---

# 安全模型

Agent App 的安全模型是宿主平台模型：App package 声明需要什么，宿主决定它实际能做什么。

App 不应该获得宿主内部 API、文件系统、网络、凭证或数据库的无限访问权。

## 信任边界

| 边界 | 宿主职责 |
| --- | --- |
| Package boundary | 校验 hash、signature、manifest shape、source。 |
| Capability boundary | 注入 SDK handles，不暴露内部 API。 |
| Data boundary | 按 app 隔离 storage、artifact、event、log、evidence。 |
| Permission boundary | 运行时强制 policy，而不只靠 UI。 |
| Secret boundary | 凭证保存在宿主 Secret Manager。 |
| UI boundary | 沙箱化 App UI，阻断 raw host API。 |
| Worker boundary | 先执行受控 workflow step 或 sandboxed worker。 |
| Network boundary | 只允许声明并授权的网络或工具调用。 |

## 主要威胁

- package 被篡改
- 隐藏 capability 使用
- 客户私有数据进入官方包
- App UI 调 raw host API
- worker 读取任意文件
- 未授权 Tool call
- secret 写入 log 或 artifact
- overlay 绕过 policy
- uninstall 后残留数据
- cloud registry 变成隐藏 Agent Runtime

## 防御层

```text
Manifest validation
  -> Package verification
  -> Readiness
  -> Policy review
  -> SDK capability injection
  -> Runtime enforcement
  -> Provenance and evidence
  -> Cleanup plan
```

单层防御不够。UI 可以隐藏按钮，但 SDK bridge 必须仍能拒绝未授权调用。

## UI Sandbox

受控 UI Host 默认阻断：raw Tauri API、Node API、任意文件访问、未声明网络、弹窗和下载、mount point 外 DOM、直接 import 宿主源码。

App UI 只能拿到窄口径 injected SDK bridge。

## Worker / Workflow Runtime

在执行 raw worker bundle 前，优先使用 allowlisted workflow runtime：

| Step kind | Capability |
| --- | --- |
| `storage.set` | `lime.storage` |
| `knowledge.search` | `lime.knowledge` |
| `agent.startTask` | `lime.agent` |
| `artifacts.create` | `lime.artifacts` |
| `evidence.record` | `lime.evidence` |

Raw worker 需要额外沙箱、资源限制和审查。

## Provenance 和 Audit

安全审查需要可追踪。Projected entries、workflow runs、model tasks、tool calls、storage migrations、artifacts、evidence、exports、cleanup records 都应该有 provenance。

Provenance 至少包含 app version、package hash、manifest hash、entry key、run ID。

## Secret 处理

规则：package 内无明文凭证；app storage 无明文凭证；evidence / logs 不写 secret；App 拿 handle 或 scoped operation；secret access 受 policy 和 audit 控制。

## Cleanup 安全

Uninstall 是安全模型的一部分。用户必须能删除 package code 和 app data。

Cleanup 应覆盖 package cache、projection、readiness、storage namespace、artifacts、evidence、tasks、logs、exports、secret bindings。

## 安全检查表

- 校验 package 和 manifest hash。
- 拒绝不支持 manifest version。
- Capability 通过注入获得，不通过 import 获得。
- Policy 在 bridge 层执行。
- Storage 和 Artifact 按 app namespace 隔离。
- Secret 不进入 package 或 logs。
- UI / worker runtime 受沙箱控制。
- 信任敏感操作记录 Evidence。
- Uninstall 可删除 app-owned data。
