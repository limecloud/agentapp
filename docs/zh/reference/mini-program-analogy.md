---
title: 小程序类比
description: 用宿主平台模型理解 Agent App。
---

# 小程序类比

Agent App 借用了“小程序式宿主平台”的心智模型，但不复制任何具体小程序框架。

有用的类比是：宿主开放稳定能力，App 声明所需能力，用户安装 App，运行时访问由宿主授权和拦截。

## 映射关系

| 小程序概念 | Agent App 对应物 |
| --- | --- |
| 平台 App | Lime Desktop、IDE、AI Client 或其他宿主。 |
| 小程序包 | Agent App package。 |
| Manifest | `APP.md` frontmatter。 |
| 页面 | `page`、`panel`、`settings`、`artifact` entries。 |
| 平台 API | `lime.ui`、`lime.storage`、`lime.agent` 等 Capability SDK。 |
| 权限 | Agent Policy 和宿主权限审查。 |
| 本地存储 | App storage namespace。 |
| 审核发布 | Registry 和 tenant enablement。 |

## 类比有帮助的地方

它说明 Agent App 不是 prompt：package 可以拥有 UI 和 storage；宿主控制能力；安装和执行分离；权限和 release metadata 是一等概念；App 能升级而不用改宿主 Core。

## 类比停止的地方

Agent App 面向 AI Host，必须组合 Agent Runtime、UI、Context、Knowledge、Skills、Tools / Connectors、Artifacts、Evidence、Policy、QC 和可选领域标准。它还要处理模型任务、上下文组装、外部副作用、Evidence 和 Eval，这些不是传统小程序定义的内容。

不要把任何具体小程序生态的页面技术、渲染引擎或应用商店规则直接搬过来。

## 实践含义

宿主实现者不要把垂直业务硬编码到 Core；应该开放稳定 capability，让 App package 去组合。

App 作者不要依赖宿主内部实现；应该声明 entries、permissions、storage、capabilities，再调用 SDK。

## 示例

内容工厂可以有 dashboard page、content factory page、knowledge-building workflow、expert-chat entry、storage tables、Context / Knowledge bindings、Skill references、Tool / Connector requirements、Artifact outputs / viewers、Evidence、Policy 和 QC gates。

这更像可安装应用，而不是单个聊天人设。

## 实现启示

这个类比应该把实现推向平台能力，而不是复制某个具体前端框架。宿主应提供稳定 SDK surfaces、permission prompts、storage namespaces、lifecycle events 和 review hooks。App package 应能在实现相同 capabilities 的宿主之间迁移。

## 反模式

- 把 App 当成静态页面，而不是带 runtime、storage、workflow 和 policy 的 package。
- 因为它“只是本地代码”，就绕过宿主 permission 和 secret management。
- 把客户专属数据作为官方 package release 的一部分发布。
- 把每个垂直场景直接加到 host core，而不是从 package 投影 entries。
- 默认让 cloud registry 执行 agent task。

## 宿主检查表

- 宿主能否不改代码就 install、disable、update、remove 一个 App？
- Entries 能否从 manifest 数据投影，而不是硬编码导航？
- SDK calls 能否被授权、审计、取消和 mock？
- Tenant 能否通过 overlays 定制，而不用 fork package？
- 用户激活前能否理解 App 需要哪些 data、Context、Tools / Connectors、permissions、evidence 和 secrets？
