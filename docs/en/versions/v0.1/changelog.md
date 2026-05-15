---
title: v0.1 changelog
description: Historical changelog for the first Agent App draft.
---

# v0.1 changelog

## Added

- Initial `APP.md` package convention.
- YAML frontmatter manifest with Markdown guide body.
- Directory-as-package shape inspired by Agent Skills.
- App entries, capabilities, Knowledge templates, Skill refs, Tool refs, Artifact types, Evals, presentation, compatibility, and metadata fields.
- Host projection and readiness concepts.
- Overlay model for user, tenant, and workspace customization.
- Reference CLI commands: `validate`, `read-properties`, `to-catalog`, `project`, and `readiness`.
- JSON Schema publication path.
- English and Chinese documentation skeleton.
- Example packages for content and support workflows.

## Changed since v0.1

- v0.2 introduced full runtime package and Capability SDK framing.
- v0.3 made descriptor schemas stronger and moved `scene` / `home` to compatibility-only status.

## Migration note

Do not start new work from v0.1. Use v0.3 and keep v0.1 only for historical context.

## Reading this changelog

Use this page to understand why later versions moved beyond a manifest-only mindset. v0.1 was valuable because it named the package boundary, but it should not be used as an implementation target for new hosts.

## If you still have v0.1 packages

- Treat them as legacy catalog drafts.
- Run v0.3 validation before attempting installation.
- Replace old entry kinds before exposing them in new UI.
- Add `requires`, `permissions`, `runtimePackage`, and readiness expectations before release.

## Historical acceptance criteria

A v0.1 package was considered useful when a host could find `APP.md`, parse its frontmatter, show a catalog card, list declared entries, and explain what external assets might be needed. That is no longer enough for current product apps.

## Why it remains documented

Keeping the v0.1 pages prevents old concepts from being rediscovered as new ones. When a reader sees old entry vocabulary or a manifest-only package, this page explains that it is historical context, not current guidance.
