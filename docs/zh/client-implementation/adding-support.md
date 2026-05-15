---
title: 接入支持
description: 宿主客户端接入 Agent App 的分阶段实现路径。
---

# 接入支持

宿主可以分阶段支持 Agent App，不需要一开始就执行任意 App 代码。安全路径是先做 package discovery、projection、readiness 和 cleanup，再逐步开放受控 SDK capability。

## 宿主最低职责

| 职责 | 含义 |
| --- | --- |
| Discover | 找到 `APP.md` 或 registry metadata。 |
| Validate | 解析 manifest、校验 hash、拒绝不支持版本。 |
| Project | 不执行 App 的情况下生成宿主 catalog 对象。 |
| Check readiness | 报告缺失 capability、permission、Knowledge、Tool、Skill、Eval、secret。 |
| Authorize | 激活前取得用户、租户或 workspace owner 授权。 |
| Inject capabilities | 注入 SDK handles，而不是暴露内部 API。 |
| Isolate data | 按 app 隔离 storage、artifact、event、log、secret。 |
| Clean up | 支持 disable、uninstall keep data、uninstall delete data、export then delete。 |

## 推荐阶段

```text
P0 只读 Host
  -> P1 Mock Capability Host
  -> P2 薄 Adapter
  -> P3 受控 UI Host
  -> P4 受控 Workflow Runtime
  -> P5 Registry / Cloud Bootstrap
```

这个顺序能避免在没有 Policy 和 Cleanup 前，就把宿主做成不受控插件平台。

## P0：只读支持

实现 manifest parser、package identity、hash、projection、readiness、cleanup dry-run 和实验页面。P0 不执行 App UI、worker、workflow、Tool 或 Agent task。

## P1：Mock Capability Host

Mock Host 用来验证 SDK 形状，而不是产生真实业务价值。它可以创建 mock storage、artifact、evidence 和 run record，并全部带 app provenance。

## P2：薄 Adapter

SDK facade 稳定后，再接少量真实能力：

- `lime.storage` namespace
- `lime.artifacts.create` 并自动附加 provenance
- `lime.evidence.record`
- `lime.knowledge.search` 只读检索
- `lime.agent.startTask` 支持 trace / cancel

不要直接 import 宿主 UI 组件，不要绕过 policy，不要把 app 数据写进全局表。

## P3 之后

UI Host 和 Workflow Runtime 都应 feature-flagged。App UI 只能拿 injected SDK bridge。Workflow Runtime 应先执行 allowlisted DSL，再考虑 raw worker bundle。

## Compatibility profile

宿主应公开支持的 capability 版本：

```json
{
  "appRuntimeVersion": "0.3.0",
  "capabilities": {
    "lime.ui": { "version": "0.3.0", "enabled": true },
    "lime.storage": { "version": "0.3.0", "enabled": true },
    "lime.agent": { "version": "0.3.0", "enabled": true }
  }
}
```

Readiness 用它和 app requirements 对比。

## 验收标准

宿主支持 Agent App 的最低可用标准：

- 不执行 App 也能安装和审查 package。
- Projection 稳定可检查。
- Readiness 可行动。
- Runtime call 全部经过 SDK handles。
- App 数据按 namespace 隔离并可删除。
- 客户私有数据不进入官方 package。
- Policy 在 runtime bridge 强制执行。
- 失败实验可以删除，不影响宿主正常流程。
