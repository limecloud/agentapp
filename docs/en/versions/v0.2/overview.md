---
title: v0.2 overview
---

# v0.2 overview

v0.2 upgrades Agent App from a declarative composition package to a complete installable application package. Apps may own UI, workers, storage schemas, migrations, workflows, and business implementation, while all platform capabilities must be called through the Capability SDK.

## Core changes

- `APP.md` remains the required discovery entry but is no longer treated as business implementation.
- Added runtime package model: `dist/ui`, `dist/worker`, `storage`, `workflows`, `artifacts`, `policies`.
- Added Capability SDK boundary: `lime.ui`, `lime.storage`, `lime.files`, `lime.agent`, `lime.knowledge`, `lime.tools`, `lime.artifacts`, `lime.workflow`, `lime.policy`, `lime.evidence`, `lime.secrets`.
- Clarified that Expert is only an `expert-chat` entry, not Agent App itself.
- Manifest now supports `requires`, `runtimePackage`, `ui`, `storage`, `services`, `events`, `secrets`, `lifecycle`.
- Reference CLI projection now emits capability requirements, storage, services, permissions, and related objects.

## Good fits

v0.2 targets product-level Agent Apps such as content engineering, support workbenches, legal contract systems, research workbenches, and enterprise workflow apps.
