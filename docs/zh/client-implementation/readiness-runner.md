---
title: Readiness Runner
---

# Readiness Runner

Readiness runner 检查已安装 Skills、已绑定 Knowledge、已授权 Tools、Artifact 支持、Eval 可用性、runtime target 和 policy。输出应是可执行 setup 任务，而不是模糊失败。

## 检查清单

- 声明保持机器可读。
- 流程放在 Agent Skills。
- 事实放在 Agent Knowledge。
- 执行留在宿主 Runtime。
- 投影对象必须带 App provenance。
