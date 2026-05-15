---
title: v0.2 changelog
---

# v0.2 changelog

## Added

- Runtime package standard shape.
- Capability SDK contract and capability negotiation.
- `page`, `panel`, `expert-chat`, `background-task`, and `settings` entry types.
- `requires`, `runtimePackage`, `ui`, `storage`, `services`, `events`, `secrets`, and `lifecycle` manifest fields.
- Product-level conformance level.
- Upgraded `content-factory-app` example with UI, worker, storage, and workflows.

## Changed

- Agent App definition changed from “composition layer” to “complete app package, host-executed, SDK-bound”.
- Updated README, specification, What is, Manifest, Runtime, and JSON Schemas documentation.
- Reference CLI projection emits more runtime package fields.

## Compatibility

- v0.1 `scene` / `home` entries remain compatibility types.
- v0.1 array-style `capabilities` remains valid.
