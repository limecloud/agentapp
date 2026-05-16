---
title: v0.7 Changelog
description: Key v0.7 changes.
---

# v0.7 Changelog

- Adds Requirement Boundary & Capability Handoff as the v0.7 theme.
- Adds `app.requirements.yaml` for requirements, MVP scope, non-goals, and acceptance criteria.
- Adds `app.boundary.yaml` for App / Host / Cloud / connector / external system / human responsibility boundaries.
- Adds `app.integrations.yaml` for Host/Cloud-managed external integration requirements.
- Adds `app.operations.yaml` for side effects, approval, dry-run, idempotency, and evidence.
- Adds `app-fit-report.schema.json` for pre-implementation fit reports.
- Updates the reference CLI to 0.7.0: `validate --version 0.7`, `migrate-check`, and `migrate-generate` understand v0.7 layered files.
- Backward compatible: v0.6 manifests remain valid.
