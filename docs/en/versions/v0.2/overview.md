---
title: v0.2 overview
description: Historical overview of the runtime package transition.
---

# v0.2 overview

v0.2 upgraded Agent App from a declarative composition package to a complete installable application package. It introduced the idea that `APP.md` is discovery and review, while real product behavior lives in a runtime package.

## Core changes

- `APP.md` remains required but is not treated as business implementation.
- Runtime package model was added: `dist/ui`, `dist/worker`, `storage`, `workflows`, `artifacts`, `policies`.
- Capability SDK boundary was introduced: `lime.ui`, `lime.storage`, `lime.files`, `lime.agent`, `lime.knowledge`, `lime.tools`, `lime.artifacts`, `lime.workflow`, `lime.policy`, `lime.evidence`, `lime.secrets`.
- Expert was clarified as only an `expert-chat` entry, not the whole app.
- Manifest support expanded to `requires`, `runtimePackage`, `ui`, `storage`, `services`, `events`, `secrets`, and `lifecycle`.
- Reference CLI projection started emitting capability requirements, storage, services, permissions, and related descriptors.

## Good fits

v0.2 targeted product-level apps such as content factory, support workbenches, legal contract systems, research workbenches, and internal enterprise workflow apps.

## Limitations

v0.2 still allowed some old entry vocabulary and did not fully lock down typed descriptor schemas, overlay templates, package hash provenance, or current v0.3 compatibility rules.

## Upgrade guidance

Move v0.2 packages to v0.3 by adding typed SDK expectations, stronger permissions, overlay templates, `packageHash` provenance, current entry kinds, and richer readiness output.

## What v0.2 enabled

v0.2 made it possible to discuss app installation, local runtime assets, and host capability injection as one package lifecycle. It gave authors a place to put UI bundles, workers, migrations, and workflow descriptors instead of overloading `APP.md`.

## What to preserve when upgrading

Keep the v0.2 insight that real implementation belongs in package assets, not in the discovery document. Replace weak or implied descriptors with v0.3 typed fields, stronger readiness findings, and provenance hashes.

## Example before and after

| Concern | v0.1 style | v0.2 style |
| --- | --- | --- |
| Dashboard | Described in Markdown. | Declared as UI bundle route. |
| Long task | Implied by chat instructions. | Worker or workflow asset. |
| Local data | Informal notes. | Storage namespace and schema. |
| Host calls | Not clearly separated. | Capability SDK boundary. |
| Setup | Mostly prose. | Readiness-facing requirements. |

## Reader takeaway

If you are designing a new product-level app, start from the v0.2 idea that implementation is packaged, then immediately apply v0.3 entry kinds, permission rules, overlay model, provenance, and typed SDK calls.
