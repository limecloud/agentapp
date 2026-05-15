---
title: v0.3 概览
---

# v0.3 概览

v0.3 把 Agent App 从完整应用包草案推进到可执行标准层。目标是让宿主可以校验、投影、安装、运行和验收 Product-level App，而不是把行业业务逻辑写进 Host Core。

## 核心变化

- 收紧 JSON Schemas：entries、permissions、services、workflows、Knowledge templates、Skill refs、Tool refs、Artifact types、Evals、secrets 和 overlay templates 都有 typed descriptor。
- 明确 `@lime/app-sdk` typed contract：稳定错误码、取消、重试、幂等、provenance 和 mock。
- 补充 UI bundle、worker、workflow、artifact viewer、settings、background task 的 runtime ABI 方向。
- 增加 tenant、workspace、user、customer overlay template。
- `scene` / `home` 只作为兼容入口；v0.3 App 使用 `page`、`command`、`workflow`、`artifact`、`background-task` 或 `settings`。
- Projection provenance 增加 `packageHash`，不只记录 `manifestHash`。
- 参考示例改为 `APP 内容工厂` / `content-factory-app`。

## 适用场景

- 内容工厂系统。
- 客服工作台。
- 销售 SOP 应用。
- 合同审查产品。
- 投研工作台。
- 企业内部流程应用。
