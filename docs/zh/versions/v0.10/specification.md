---
title: v0.10 规范快照
description: v0.10 对共享宿主模型的定格说明。
---

# v0.10 规范快照

v0.10 继承已有 App Server bridge profile，并新增三个当前要求：

1. App 只能通过宿主管控的 SDK handle 共享用户态和宿主能力。
2. 本地桌面存储默认使用宿主管理的 per-app SQLite。
3. 允许 App 自带后端服务，但必须区分客户端本地服务后端和云端服务后端；两者都必须声明、受治理，并与宿主内部实现隔离。

完整契约以最新 [规范](../../specification) 为准。
