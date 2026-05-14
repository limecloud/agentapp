---
title: JSON Schemas
---

# JSON Schemas

参考 schema 发布在 docs/public/schemas，覆盖 app manifest、app projection 和 readiness result。v0.1 有意保持宽松，方便宿主实验，同时固定必需字段。

## 检查清单

- 声明保持机器可读。
- 流程放在 Agent Skills。
- 事实放在 Agent Knowledge。
- 执行留在宿主 Runtime。
- 投影对象必须带 App provenance。
