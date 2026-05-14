---
title: Overlay Resolver
---

# Overlay Resolver

Resolver 按 Host Default、App Default、Tenant Overlay、User Overlay、Workspace Override 顺序合并。输出 resolved value 的同时要保留 provenance。

## 检查清单

- 声明保持机器可读。
- 流程放在 Agent Skills。
- 事实放在 Agent Knowledge。
- 执行留在宿主 Runtime。
- 投影对象必须带 App provenance。
