---
title: 运行时模型
---

# 运行时模型

Agent App 是 host-executed，而不是 cloud-executed。App 包可以包含 UI 和 worker，但它们必须运行在宿主受控 runtime 中，并通过 Capability SDK 调用平台能力。

## 核心链路

```text
APP.md / manifest
→ package verification
→ projection
→ readiness
→ capability injection
→ UI / worker / workflow execution
→ artifact / evidence / eval
```

## Host 必须拥有的运行时职责

- 安装、卸载、升级和禁用 App。
- 校验 package hash、签名和 manifest。
- 执行 capability negotiation。
- 注册 UI routes、panels、commands、artifact viewers。
- 创建 App storage namespace 并执行 migrations。
- 注入 `lime.*` capability handles。
- 拦截文件、网络、secret、tool、agent 和 storage 权限。
- 记录 provenance、evidence、telemetry 和 eval 结果。

## Cloud 边界

Cloud 可以做 catalog、release、license、tenant enablement、gateway 和 ToolHub；但 Cloud 不应该成为默认 Agent Runtime。需要 server-assisted execution 时，App 必须显式声明，并由 Policy 控制。
