---
title: v0.10 更新
description: Agent App v0.10 的精简版本说明。
---

# v0.10 更新

v0.10 把 Agent App 收敛到类似小程序的宿主模型：App 共享宿主管控的用户态和平台能力，但 App UI、workflow state、私有存储和可选后端服务保持隔离。

| 领域 | 结论 |
| --- | --- |
| 宿主模型 | user、tenant、workspace、locale、theme、model profile、secrets、policy、files、artifacts 和 agent runtime 都由宿主以 capability projection 方式提供。App 不拿 raw token、宿主 DB handle 或内部路径。 |
| 本地存储 | 本地桌面安装默认使用宿主管理的 per-app SQLite。普通用户不应为了运行桌面 App 额外安装 PostgreSQL。 |
| 服务端存储 | PostgreSQL 适合 Cloud、企业或团队共享后端；高风险 App 使用独立 schema/role 或独立 database。 |
| App 后端 | App 可以携带 Node.js、Python、Go、Rust、Java、Wasm 等多语言后端，但必须由宿主管控，并声明 `stdio-jsonrpc`、本地 socket/HTTP、`wasm` 或 `remote-http` 等协议。 |
| 桌面承载 | Electron 宿主优先使用 `WebContentsView` 或受控 `BrowserWindow`；iframe 保留为兼容 surface，`<webview>` 不作为新默认路径。 |

Reference CLI 现在输出 `0.10.0`，支持 `--version 0.10`，会检查 storage 隔离提示，并在迁移建议中生成 app-backend metadata。

完整规则见最新 [规范](../../specification)、[运行时模型](../../client-implementation/runtime-model) 和 [桌面宿主一致性](../../client-implementation/desktop-host-conformance)。
