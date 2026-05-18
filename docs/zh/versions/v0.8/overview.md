---
title: v0.8 概览
description: v0.8 通过拆分 Lime Desktop 与 Lime Runtime，让 Agent App 成为可独立安装的产品。
---

# v0.8 概览

v0.8 的主题是 **Standalone Installation & Runtime Separation**。Agent App 是一等可安装产品：用户应能直接下载某个业务应用，用它自己的品牌和窗口启动，同时继续获得 Lime 受治理的 Agent Runtime、权限、密钥、Evidence、Tools 和 Storage。

核心拆分是：

```text
Agent App = 产品包
Lime Runtime = 受治理的能力底座
Lime Desktop = 多 App 工作台宿主，不是强制入口
Lime App Shell = 面向独立分发的最小单 App 宿主
```

v0.8 保留全部 v0.7 需求边界文件，并新增安装模式元数据。App 作者和宿主可以明确一个包是安装到 Lime Desktop、以独立 App 内置 runtime、复用系统 Lime Runtime，还是运行在兼容 Web Host 中。

## 核心变化

- **`app.install.yaml`**：声明 `in_lime`、`standalone`、`runtime_backed` 和可选 `web_host` 安装模式。
- **Lime Runtime Core**：统一承载 `lime.agent`、`lime.storage`、`lime.secrets`、`lime.policy`、`lime.evidence`、`lime.tools`、`lime.connectors` 等能力。
- **Lime App Shell**：加载单个 Agent App 包、注入 capability handles、展示权限，并以 App 自有品牌运行的最小宿主。
- **独立打包**：App 可以发布成 `.app`、`.dmg`、`.exe` 等安装包，不强制用户先安装 Lime Desktop。
- **Runtime-backed 打包**：当机器已有兼容 Lime Runtime 时，App 包可以保持轻量。

## 架构图

```mermaid
flowchart TD
  App[Agent App Package\nUI / Worker / Workflow / Storage schema] --> SDK[@lime/app-sdk]
  SDK --> Runtime[Lime Runtime Core\nAgent / Storage / Secrets / Policy / Evidence / Tools]
  Runtime --> Desktop[Lime Desktop\n多 App 工作台]
  Runtime --> Shell[Lime App Shell\n独立单 App 宿主]
  Runtime --> Web[兼容 Web Host]
  Shell --> User[用户启动品牌 App]
  Desktop --> User
  Web --> User
```

## 安装模式

| 模式 | 用户体验 | Runtime 模型 | 适用场景 |
| --- | --- | --- | --- |
| `in_lime` | 从 Lime Desktop 应用中心安装。 | 使用 Desktop 托管的 Lime Runtime。 | 重度用户、团队、开发者、App 管理。 |
| `standalone` | 直接下载并启动业务 App。 | 包内嵌或随包带兼容 Lime Runtime profile。 | 不希望用户先下载 Lime Desktop 的消费级或部门级 App。 |
| `runtime_backed` | 安装轻量 App，复用系统 Lime Runtime。 | 依赖机器上的 `lime-runtime`。 | 一台机器使用多个 Agent App、企业托管桌面。 |
| `web_host` | 在兼容托管环境中打开。 | Host 提供 Web capability handles 和 policy。 | 试用、协作、低敏场景。 |

## 兼容说明

- v0.7 App 在 v0.8 Host 中继续有效。
- v0.8 不把 Agent 执行搬进 App 包；App 仍通过宿主注入的 capability 调用底座。
- 独立 Agent App 可以内置 runtime 组件，但不能绕过 Lime Runtime 的 policy、secrets、evidence 或 tool governance。
- Lime Desktop 成为强宿主和 App 管理器，但不再是使用 Agent App 的唯一入口。
