---
title: v0.2 changelog
description: Historical changelog for the runtime package release.
---

# v0.2 changelog

## Added

- Runtime package model for UI bundles, workers, storage schemas, migrations, workflows, artifacts, policies, and examples.
- Capability SDK framing with `lime.*` capability surfaces.
- `requires` section for app runtime, SDK, and capability requirements.
- `runtimePackage`, `ui`, `storage`, `services`, `events`, `secrets`, and `lifecycle` fields.
- Projection output for capability requirements, storage, services, permissions, and runtime descriptors.
- Product-level app framing for content, support, legal, research, and internal workflow apps.

## Clarified

- `APP.md` is discovery and guide, not the app implementation.
- Expert is only an `expert-chat` entry.
- Customer data must stay outside official packages.
- Cloud is a control plane, not default Agent Runtime.

## Superseded

v0.3 supersedes v0.2 with stronger schemas, current entry kinds, typed SDK expectations, overlay templates, and package hash provenance.

## Reading this changelog

v0.2 is the turning point where Agent App stopped being only composition metadata and became a runtime package concept. It is useful for understanding the motivation behind v0.3, but current hosts should implement v0.3 schemas and entry rules.

## Upgrade focus

- Convert any remaining legacy entry vocabulary to v0.3 current entry kinds.
- Add `manifestVersion: 0.3.0` and stronger `requires.capabilities`.
- Add overlay templates and package provenance.
- Ensure runtime code calls host services through typed SDK handles.

## Detailed impact by audience

| Audience | Impact |
| --- | --- |
| App author | Could start shipping UI, worker, storage, and workflow assets instead of only manifest metadata. |
| Host implementor | Needed an install pipeline that checks local paths, capability requirements, and runtime descriptors. |
| Registry operator | Needed to distinguish public package assets from tenant overlays and private setup. |
| End user | Could expect app-like entries and setup checks rather than a loose collection of prompts. |

## What not to copy forward

Do not copy the weak parts of v0.2 into new docs: implied entry semantics, incomplete provenance, and loose capability wording. Use v0.3 schemas and typed SDK expectations for current work.
