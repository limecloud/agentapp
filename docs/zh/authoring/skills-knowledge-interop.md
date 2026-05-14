---
title: Skills / Knowledge 互操作
---

# Skills / Knowledge 互操作

Builder Skill 可以生产 App 所需的 Agent Knowledge pack。但 runtime 消费时仍必须把 Knowledge 作为 fenced data 加载。App 可以同时引用 Builder Skill 和 Knowledge type，但不能混淆二者信任模型。

## 检查清单

- 声明保持机器可读。
- 流程放在 Agent Skills。
- 事实放在 Agent Knowledge。
- 执行留在宿主 Runtime。
- 投影对象必须带 App provenance。
