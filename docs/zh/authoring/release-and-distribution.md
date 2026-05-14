---
title: 发布与分发
---

# 发布与分发

Registry 应发布不可变 App release，包含 manifest hash、version、channel、owner、compatibility 和 rollback target。租户启用应 pin release 或 channel。新版本不得覆盖客户 overlay。

## 检查清单

- 声明保持机器可读。
- 流程放在 Agent Skills。
- 事实放在 Agent Knowledge。
- 执行留在宿主 Runtime。
- 投影对象必须带 App provenance。
