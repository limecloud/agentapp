---
title: APP 内容工厂
---

# APP 内容工厂

这个示例把内容工厂做成 Product-level Agent App，而不是单个“内容专家”。它有自己的 UI、storage、workflow、worker、expert-chat entry、Knowledge 绑定、Artifact 和 Eval。

它声明：

- `dashboard` 和 `content_factory` 页面入口。
- `knowledge_builder` 和 `content_calendar` workflow。
- `content_strategist` 对话专家入口。
- `content-factory-app` storage namespace 和 schema。
- `project_knowledge`、`personal_ip`、`content_operations` 知识槽位。
- 文档解析、竞品调研等 Tool Broker 需求。
- 内容表、文章草稿、策略报告等 Artifact 类型。
- 去 AI 味、事实支撑等 Eval。

客户专属事实，比如创始人故事、品牌语气、私域 SOP、投放数据，不进入官方 App 包。它们应绑定为 Agent Knowledge、workspace files、App storage 或 overlay。

参考包：[`docs/examples/content-factory-app/APP.md`](../../examples/content-factory-app/APP.md)
