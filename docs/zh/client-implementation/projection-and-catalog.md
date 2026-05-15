---
title: 投影与目录
description: 宿主如何把 APP.md 编译成 catalog entries 和 runtime descriptors。
---

# 投影与目录

Projection 是确定性的编译步骤。它把 Agent App manifest 变成宿主可读的 catalog objects。Projection 不运行 App。

通过 Projection，宿主可以在激活前展示 App entry、设置需求、权限和 Artifact。

## 输入

Projection 使用 parsed manifest、package identity、manifest hash、package hash、host capability profile，以及可选 tenant enablement metadata。它不应该使用客户数据或运行时输出。

## 输出

| 输出 | 用途 |
| --- | --- |
| App summary | Catalog card 和安装审查。 |
| Entries | page、panel、command、workflow、artifact、background-task、settings。 |
| Capability requirements | SDK 和宿主能力协商。 |
| UI descriptors | routes、panels、cards、artifact viewers。 |
| Storage descriptors | namespace、schema、migration、retention。 |
| Workflow descriptors | 状态机和人工 review 节点。 |
| Permission prompts | 安装时和运行时权限审查。 |
| Knowledge slots | 必需和可选 Knowledge bindings。 |
| Tool requirements | ToolHub 和 policy 检查。 |
| Artifact types | 持久输出契约。 |
| Eval rules | 质量门禁和验收状态。 |
| Provenance | app version、package hash、manifest hash、standard version。 |

## Projection 示例

```json
{
  "app": {
    "name": "content-factory-app",
    "version": "0.3.0",
    "appType": "domain-app"
  },
  "entries": [
    {
      "key": "content_factory",
      "kind": "page",
      "title": "内容工厂",
      "route": "/content-factory",
      "provenance": {
        "appName": "content-factory-app",
        "appVersion": "0.3.0",
        "manifestHash": "sha256:...",
        "packageHash": "sha256:..."
      }
    }
  ]
}
```

## 确定性

同一个 package 和 host profile 应产生同样 projection。确定性支持 cache validation、review diff、rollback、audit、reproducible readiness 和 cleanup plan。

Projection 阶段不要生成随机 ID；runtime ID 只在 entry 真正运行时生成。

## Catalog 层级

| Catalog | 内容 |
| --- | --- |
| Registry catalog | 下载前的 App metadata。 |
| Installed catalog | 本地已安装 App。 |
| Workspace catalog | Workspace 已启用 entry。 |
| Runtime catalog | 当前 ready 的 entry。 |
| Artifact catalog | App run 产生的输出。 |

Projection 主要喂给 installed 和 workspace catalog。

## Cache 失效

当 package hash、manifest hash、host capability profile、tenant enablement、policy defaults、app upgrade / disable / uninstall 变化时，应失效 projection。

Knowledge binding 或 secret 通常影响 readiness，而不是 projection 形状。

## 安全规则

Projection 不能执行 workflow、调用 Tool、启动 Agent task、读取私有文件、加载 secret、运行 UI bundle、执行 storage migration。

## 检查表

- 每个对象都带 provenance。
- Entry key 稳定。
- 不支持的 entry kind 被拒绝或标为兼容历史。
- Runtime package 路径被记录但不执行。
- 激活前可见权限和设置需求。
- Projection 可由 package metadata 删除后重建。
