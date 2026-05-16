---
title: v0.5 规范快照
description: v0.5 在 v0.4 之上引入分层 manifest、AI 自动发现 triggers、bundled Skills、自检与标准化错误 / 签名 / i18n / 健康检查。
---

# v0.5 规范快照

v0.5 不重写 v0.3 / v0.4 包契约，而是叠加分层配置与作者编写约定。完整内容请阅读 [latest 规范](../../specification)。

## v0.5 增量速览

- 包结构新增 `app.*.yaml` 分层文件、`evals/readiness.yaml`、`evals/health.yaml`、`skills/` bundled Agent Skills、`locales/` 翻译文件。
- frontmatter 推荐字段新增 `triggers`、`quickstart`，`skills` 替代部分 `skillRefs` 用法。
- Readiness 状态集合扩展为 `ready / ready-degraded / needs-setup / blocked / unknown`，并新增 `tiers`、`setupActions`、`blockers`、`warnings`。
- Workflow 描述符新增 `overview`、`diagram`（mermaid）、`recovery`（`onTimeout` / `onError` / `maxRetries` / `saveCheckpoint`）。
- APP.md 正文章节建议：When to Use / Not Suitable For / Workflow / Quickstart / Red Flags / Verification Checklist / Troubleshooting。

## 分层文件清单

| 文件 | 用途 |
| --- | --- |
| `app.capabilities.yaml` | 详细 capability、entry、route、panel、command 配置 |
| `app.entries.yaml` | 入口的详细配置（permissions / requiredCapabilities / quickActions / titleI18n） |
| `app.permissions.yaml` | 权限请求、scope、policy hints、reasonI18n、consentPrompt |
| `app.errors.yaml` | 标准化错误码、recovery、userAction、retryable、maxRetries |
| `app.i18n.yaml` | defaultLocale、supportedLocales、translations、fallback |
| `app.signature.yaml` | sigstore 签名、信任链、撤销检查 |
| `evals/readiness.yaml` | required / recommended / performance 三层自检 |
| `evals/health.yaml` | startup / runtime / metrics 运行时健康 |

## Reference CLI 0.5.0

```bash
agentapp-ref validate ./my-app --version 0.5
agentapp-ref project ./my-app
agentapp-ref readiness ./my-app --workspace ./workspace
agentapp-ref migrate-check ./my-app
agentapp-ref migrate-generate ./my-app --target 0.5.0
```

## 兼容说明

- v0.4 / v0.3 manifest 在 v0.5 宿主中继续可用。
- 新字段除 `manifestVersion: 0.5.0` 之外都是可选。
- Reference CLI 提供 `migrate-check` / `migrate-generate` 协助迁移。

完整规范见 [latest specification](../../specification)。
