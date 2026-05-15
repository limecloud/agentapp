---
title: v0.1 specification snapshot
description: Frozen summary of the original Agent App v0.1 contract.
---

# v0.1 specification snapshot

This page is a historical snapshot. New packages should use the latest [Specification](../../specification.md).

## Contract

v0.1 defined an Agent App as an installable composition package with a required `APP.md`. The package described entries, capabilities, Knowledge templates, Skill references, Tool requirements, Artifact types, Evals, presentation metadata, compatibility, and optional support files.

## Required manifest fields

- `name`
- `description`
- `version`
- `status`
- `appType`

## Recommended manifest fields

- `runtimeTargets`
- `entries`
- `capabilities`
- `permissions`
- `knowledgeTemplates`
- `skillRefs`
- `toolRefs`
- `artifactTypes`
- `evals`
- `presentation`
- `compatibility`
- `metadata`

## Host behavior

A compatible host discovered `APP.md`, loaded catalog metadata first, projected app entries into host UI, checked readiness, and kept agent execution inside the host runtime.

## Historical entry model

v0.1 used `home`, `scene`, `command`, `workflow`, and `artifact` language. In v0.3, `scene` and `home` are compatibility-only. Current apps should use the v0.3 entry model.

## Historical value

v0.1 matters because it fixed the first boundary: App is composition; Skills are procedures; Knowledge is trusted data; Runtime belongs to the host.

## Compatibility posture

v0.1 compatibility should be read-only unless a host explicitly chooses to import and migrate a package. New work should not add new v0.1-only fields or normalize old entry language in current docs.

## Import policy

A host may import a v0.1 package as a draft when it can preserve the original manifest, generate a migration report, and require author review before activation. Silent migration is discouraged because entry semantics, permissions, and runtime assets may be missing.

## Known gaps in the snapshot

| Gap | Current expectation |
| --- | --- |
| Runtime package not fully defined | Use v0.3 runtime package descriptors and SDK requirements. |
| Permissions under-specified | Declare user-facing permissions and enforce them at runtime. |
| Readiness shape loose | Emit structured findings with severity, kind, key, and remediation. |
| Entry vocabulary dated | Use current v0.3 entry kinds only for new packages. |
| Provenance missing | Include manifest and package hashes in projection and release metadata. |
