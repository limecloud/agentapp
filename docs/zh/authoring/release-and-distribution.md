---
title: 发布与分发
description: 如何发布不可变、可回滚、不覆盖客户状态的 Agent App release。
---

# 发布与分发

Agent App release 应该不可变、可审查、可回滚。Registry 可以分发 package 和授权租户，但本地宿主仍负责校验、readiness、policy 和 runtime 执行。

## Release 对象

| 字段 | 作用 |
| --- | --- |
| `appId` | 稳定 App 身份。 |
| `version` | SemVer package version。 |
| `manifestVersion` | Agent App manifest version。 |
| `packageUrl` | 下载地址或 registry ref。 |
| `packageHash` | package 完整性校验。 |
| `manifestHash` | manifest 完整性校验。 |
| `signatureRef` | 可选签名或供应链证明。 |
| `compatibility` | 宿主、SDK、capability 版本范围。 |
| `releaseNotesUrl` | 变更说明。 |
| `rollbackTarget` | 已知安全回滚版本。 |

## Channel 和 Pin

Registry 可以提供 `stable`、`beta`、`internal` 等 channel，但租户启用最终应解析到具体 release。

```text
channel: stable
  -> release: content-factory-app@0.3.0
  -> packageHash: sha256:...
```

Pin 很重要，因为 App 可能包含 migration 和 runtime code。宿主必须知道安装的是哪个精确 package。

## 分发流程

```mermaid
sequenceDiagram
  participant Publisher as 发布者
  participant Registry as Registry
  participant Tenant as 租户管理员
  participant Host as 宿主

  Publisher->>Registry: 上传 package metadata 和 hash
  Registry->>Registry: 校验 manifest 与兼容性
  Tenant->>Registry: 启用 release 或 channel
  Host->>Registry: 请求 bootstrap metadata
  Registry-->>Host: 返回已启用 release 与 policy defaults
  Host->>Host: 下载、校验、投影、readiness
  Host->>Host: 用户确认和 policy 通过后安装
```

Registry 负责分发，宿主负责安装和运行。

## 不能覆盖什么

升级 release 不得覆盖：

- 用户 Knowledge bindings
- workspace files
- app storage records
- secrets
- tenant overlays
- user overrides
- generated artifacts
- evidence history

官方 package 默认值可以变，但用户和租户状态必须分离。

## Migration 说明

如果 release 改 storage schema 或 workflow state，要显式写 migration metadata：

```yaml
lifecycle:
  upgrade:
    migrations:
      - from: "0.2.x"
        to: "0.3.0"
        storage: ./storage/migrations/003_v0_3.sql
        reversible: false
        risk: 删除旧索引前需要用户确认
```

宿主应尽量 dry-run migration，并展示不可逆风险。

## Rollback

回滚不是简单下载旧包。宿主要决定新版写入的数据如何处理。

最低回滚计划：

- 禁用不兼容新 entry
- 默认保留用户数据
- 不自动执行 downgrade migration
- 保留 Evidence
- 记录 Artifact 由哪个 release 创建
- 数据可能丢失时先提供 export

## 发布检查表

- `agentapp-ref validate` 通过。
- `agentapp-ref project` 输出稳定。
- `agentapp-ref readiness` 可行动。
- 记录 package hash 和 manifest hash。
- compatibility 范围准确。
- release notes 说明 breaking changes 和 migration。
- 示例 workspace 仍能通过预期 eval。
- 官方包不包含客户私有数据。
- rollback target 明确。
