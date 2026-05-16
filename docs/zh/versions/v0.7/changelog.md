---
title: v0.7 变更记录
description: v0.7 关键变化。
---

# v0.7 变更记录

- 新增 Requirement Boundary & Capability Handoff 作为 v0.7 主题。
- 新增 `app.requirements.yaml`，声明需求项、MVP、非目标和验收标准。
- 新增 `app.boundary.yaml`，声明 App / Host / Cloud / connector / external system / human 职责边界。
- 新增 `app.integrations.yaml`，声明 Host/Cloud 托管的外部集成需求。
- 新增 `app.operations.yaml`，声明操作副作用、审批、dry-run、幂等和 evidence。
- 新增 `app-fit-report.schema.json`，用于需求适配评估报告。
- Reference CLI 升级到 0.7.0：`validate --version 0.7`、`migrate-check`、`migrate-generate` 支持 v0.7 分层文件。
- 向后兼容：v0.6 manifest 仍然有效。
