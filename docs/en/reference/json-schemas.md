---
title: JSON Schemas
---

# JSON Schemas

Reference schemas are published under `docs/public/schemas` and cover app manifests, app projections, and readiness results. The current schemas remain forward-compatible and host-friendly, while moving Agent App toward the runtime package + Capability SDK model.

## Schema files

| File | Description |
| --- | --- |
| `app-manifest.schema.json` | Machine contract for `APP.md` frontmatter or `app.manifest.json`, including `requires`, `runtimePackage`, `ui`, `storage`, `services`, `entries`, `secrets`, and `lifecycle`. |
| `app-projection.schema.json` | Host catalog projection output, including capability requirements, entries, UI, storage, services, permissions, and provenance. |
| `app-readiness.schema.json` | Readiness check result before install or runtime. |

## Checklist

- `APP.md` is the discovery entry, not the business implementation.
- Runtime packages carry UI, workers, storage, workflows, and artifact implementation.
- Apps use Lime platform capabilities only through the Capability SDK.
- Customer facts stay in Agent Knowledge, workspace files, app storage, or overlays.
- Credentials stay in `lime.secrets`, not official packages.
- Projection objects must include app provenance.
