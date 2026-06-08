---
title: v0.10 变更记录
description: Agent App v0.10 引入的变更。
---

# v0.10 变更记录

## 0.10.0

- 新增共享宿主模型：共享用户态和宿主能力，隔离 App 私有存储与 App 后端服务。
- 明确本地桌面默认使用宿主管理的 per-app SQLite。
- 将 PostgreSQL 定位为 Cloud、企业和团队共享后端，而不是普通桌面安装前置条件。
- 增加可选 `app-backend` service metadata 和后端协议字段。
- 更新 Electron 宿主建议：优先 `WebContentsView` / 受控 `BrowserWindow`，iframe 作为兼容 surface。
- 同步 CLI、schema、示例和发布文档到 `0.10.0`。
