---
title: v0.8 规范快照
description: v0.8 新增独立安装模式、Lime Runtime 拆分和 Lime App Shell 兼容契约。
---

# v0.8 规范快照

v0.8 继承 [v0.7 规范](../v0.7/specification)，并新增 **Standalone Installation & Runtime Separation**。完整当前契约见 [latest specification](../../specification)。

## 增量要求

1. 产品级 App 应在 `app.install.yaml` 或 manifest `install` 简写中声明安装模式。
2. 宿主必须把 Lime Desktop、Lime App Shell、runtime-backed shell 和兼容 Web Host 视为同一 Capability SDK 契约上的不同宿主。
3. 独立 App 可以携带 runtime bundle，但 Agent 执行、密钥、policy、tool execution、storage namespace 和 evidence 仍必须通过 Lime Runtime capability handles 托管。
4. Runtime-backed App 必须声明所需系统 runtime 名称和最低版本。
5. Standalone App 应声明品牌、bundle identity、目标平台、更新策略和 runtime 兼容范围。
6. 用户应能不理解、不打开 Lime Desktop，也能安装并启动独立 Agent App。

## 新增分层文件

```text
app.install.yaml
```

## 最小安装契约

```yaml
install:
  modes:
    - in_lime
    - standalone
    - runtime_backed
  runtime:
    minVersion: 0.8.0
    distribution:
      standalone:
        embedRuntime: true
        shell: lime-app-shell
      runtimeBacked:
        requires: lime-runtime
        minVersion: 0.8.0
  standalone:
    shell: lime-app-shell
    bundleId: ai.limecloud.example
    platforms: [macos, windows]
  runtimeBacked:
    requires: lime-runtime
    minVersion: 0.8.0
  branding:
    name: Example Agent App
    icon: ./assets/icon.svg
    windowTitle: Example Agent App
```

## 禁止模式

- 不要让 Lime Desktop 成为所有 Agent App 的强制前置条件。
- 不要让每个独立 App 自建模型网关、权限系统、明文凭证库或 evidence store。
- App 代码不得 import Lime Desktop 内部模块。
- 公共独立安装包不得打包客户私有 workspace 数据。
- 除非 capability 和数据边界一致，不要把 Web 试用版等同于本地受治理 runtime。
