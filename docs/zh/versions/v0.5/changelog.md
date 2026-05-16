---
title: v0.5 变更记录
description: v0.5 关键变化。
---

# v0.5 变更记录

- 借鉴 [Agent Skills 标准](https://agentskills.io)，引入分层 manifest：`APP.md` 保持精简，详细配置下沉到独立文件（`app.capabilities.yaml`、`app.entries.yaml`、`app.permissions.yaml`、`app.errors.yaml`、`app.i18n.yaml`、`app.signature.yaml`、`evals/readiness.yaml`、`evals/health.yaml`）。
- 新增 `triggers` 字段（keywords + scenarios），用于 AI 自动发现和路由。
- 新增 `quickstart` 字段，用于首次启动建议入口与示例 workflow。
- 标准化 `skills/` 目录承载 bundled Agent Skills，支持 `auto / on-demand / manual` 激活策略。
- 引入 `evals/readiness.yaml` 自检模型，三层 required / recommended / performance；readiness 状态扩展为 `ready / ready-degraded / needs-setup / blocked / unknown`。
- 通过 `app.errors.yaml` 标准化错误码：稳定 code、recovery、userAction、retryable、maxRetries。
- 通过 `app.signature.yaml` 强化包签名与信任链，支持 sigstore signature reference 与撤销检查。
- 新增 `app.i18n.yaml` 提供一等 i18n：默认语言、支持语言列表、翻译文件、回退策略。
- 新增 `evals/health.yaml` 运行时健康检查：startup / runtime / metrics。
- Workflow 描述符引入 mermaid 流程图、人类可读 overview、统一 recovery 策略。
- APP.md 章节约定：When to Use、Not Suitable For、Red Flags、Verification Checklist、Troubleshooting。
- Reference CLI 升级到 0.5.0：新增 `migrate-check`、`migrate-generate`；`validate` 接受 `--version` 参数。
- 向后兼容：v0.4 manifest 仍然有效，新字段在 `manifestVersion: 0.5.0` 之外都是可选的。
