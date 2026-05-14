---
title: v0.2 概览
---

# v0.2 概览

v0.2 把 Agent App 从“声明式组合包”升级为“完整可安装应用包”：App 可以有自己的 UI、worker、storage schema、migrations、workflow 和业务实现，但所有平台能力都必须通过 Capability SDK 调用。

## 核心变化

- `APP.md` 仍是必需发现入口，但不再被视为业务实现。
- 新增 runtime package 模型：`dist/ui`、`dist/worker`、`storage`、`workflows`、`artifacts`、`policies`。
- 新增 Capability SDK 边界：`lime.ui`、`lime.storage`、`lime.files`、`lime.agent`、`lime.knowledge`、`lime.tools`、`lime.artifacts`、`lime.workflow`、`lime.policy`、`lime.evidence`、`lime.secrets`。
- 明确 Expert 只是 `expert-chat` entry，不是 Agent App 本身。
- Manifest 支持 `requires`、`runtimePackage`、`ui`、`storage`、`services`、`events`、`secrets`、`lifecycle`。
- Reference CLI projection 输出 capability requirements、storage、services、permissions 等对象。

## 适用场景

v0.2 面向 Product-level Agent App：内容工程化、客服工作台、法务合同系统、投研工作台、企业流程应用等。
