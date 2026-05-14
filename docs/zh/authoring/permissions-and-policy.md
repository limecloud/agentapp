---
title: 权限与 Policy
---

# 权限与 Policy

权限必须显式声明并由宿主处理。App 可以请求 tool、filesystem、network、model、export 或 tenant scope。Agent Policy 或宿主 policy 决定 allow、ask、deny、留存和审计。

## 检查清单

- 声明保持机器可读。
- 流程放在 Agent Skills。
- 事实放在 Agent Knowledge。
- 执行留在宿主 Runtime。
- 投影对象必须带 App provenance。
