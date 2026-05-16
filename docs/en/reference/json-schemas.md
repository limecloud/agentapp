---
title: JSON Schemas
description: Public schemas for Agent App manifests, projections, and readiness output.
---

# JSON Schemas

Agent App publishes JSON Schemas so hosts, registries, editors, and CI jobs can validate contracts mechanically.

## Public schema files

| Schema | Purpose |
| --- | --- |
| [`app-manifest.schema.json`](/schemas/app-manifest.schema.json) | Validates manifest fields from `APP.md` or `app.manifest.json`. |
| [`app-runtime.schema.json`](/schemas/app-runtime.schema.json) | Validates v0.6 `app.runtime.yaml` Agent task runtime contracts. |
| [`app-projection.schema.json`](/schemas/app-projection.schema.json) | Validates host projection output with provenance. |
| [`app-readiness.schema.json`](/schemas/app-readiness.schema.json) | Validates readiness output and setup findings. |

## When to use schemas

Use schemas in four places:

1. Authoring editors for autocomplete and validation.
2. CI checks before publishing a package.
3. Registry ingestion before accepting a release.
4. Host install flow before projection or readiness.

Schemas do not replace runtime policy. They only validate shape.

## Manifest validation

The manifest schema covers fields such as:

- identity and version
- runtime targets
- SDK and capability requirements
- runtime package descriptors
- entries
- UI, storage, services, workflows
- Knowledge, Skills, Tools, Artifacts, Evals
- permissions, secrets, lifecycle, overlays
- v0.6 `agentRuntime` shorthand for task control-plane intent
- presentation and compatibility

v0.3 current entry kinds are `page`, `panel`, `expert-chat`, `command`, `workflow`, `artifact`, `background-task`, and `settings`.

## Projection validation

Projection schema ensures that host-generated catalog objects include app summary, entries, capabilities, storage, services, workflows, requirements, and provenance.

Projection should include `manifestHash` and `packageHash` so derived objects can be traced back to a release.

## Readiness validation

Readiness schema ensures setup checks are machine-readable. A host should produce stable severities, kinds, keys, messages, remediation, and version fields when possible.

## Local usage

```bash
npm run cli -- validate docs/examples/content-factory-app
npm run cli -- project docs/examples/content-factory-app
npm run cli -- readiness docs/examples/content-factory-app
```

The reference CLI does not replace a full JSON Schema validator, but it exercises the same contract from the package author's perspective.

## Compatibility note

Schemas can be stricter than prose. When prose and schema conflict, treat the schema and CLI behavior as the mechanical contract, then fix the prose.

## CI integration pattern

A package repository should run schema and reference checks in this order:

```text
read APP.md
→ validate manifest shape
→ check local referenced files
→ project host catalog output
→ validate projection JSON
→ run readiness against a fixture host profile
→ publish package artifacts only if all required checks pass
```

The reference CLI covers the shared semantics. A production registry can add a JSON Schema validator, signature verification, malware scanning, license checks, package hash comparison, and tenant policy review.

## Schema ownership

| File | Owned by | Backward compatibility expectation |
| --- | --- | --- |
| Manifest schema | Standard authors and host implementors. | Minor releases should add optional fields only. |
| Projection schema | Host implementors. | Projection output should stay deterministic for the same package and host profile. |
| Readiness schema | Host implementors and registry reviewers. | Findings should keep stable `kind`, `severity`, and `key` values. |

## Failure interpretation

- Schema failure means the document shape is invalid.
- Validation failure means the package cannot be accepted as-is.
- Readiness failure means the package may be valid but cannot run in the current environment.
- Warning means the package is usable for review but should not be treated as production-ready until resolved or accepted.
