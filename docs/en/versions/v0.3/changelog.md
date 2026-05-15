---
title: v0.3 changelog
description: Changes introduced in Agent App v0.3.0.
---

# v0.3 changelog

## Added

- `manifestVersion: 0.3.0` current contract.
- Stronger `app-manifest`, `app-projection`, and `app-readiness` schemas.
- Descriptor coverage for entries, permissions, services, workflows, workflow states, Knowledge templates, Skill refs, Tool refs, Artifact types, Evals, events, secrets, lifecycle, and overlay templates.
- `packageHash` provenance in projection output.
- Typed SDK expectations: error codes, cancellation, retries, idempotency, traceability, and mocks.
- Overlay template model for tenant and workspace customization.
- `content-factory-app` reference fixture.
- v0.3 versioned documentation pages.

## Changed

- Agent App is framed as an executable app package standard, not only a declaration format.
- `APP.md` remains required but runtime implementation belongs in the package assets.
- Reference CLI validation now warns about product-level apps without runtime package declarations.
- Readiness now includes services, workflows, secrets, overlays, and capability version checks.
- Documentation now consistently treats Expert as one `expert-chat` entry, not the app itself.

## Deprecated compatibility

- `scene` and `home` entries are compatibility-only and invalid for `manifestVersion: 0.3.0`.
- New apps should use `page`, `panel`, `expert-chat`, `command`, `workflow`, `artifact`, `background-task`, and `settings`.

## Reference validation

```bash
npm run cli -- validate docs/examples/content-factory-app
npm run cli -- project docs/examples/content-factory-app
npm run cli -- readiness docs/examples/content-factory-app
npm run build
```

## Operational impact

v0.3 changes host implementation work from “show a document in the UI” to “install and run a governed app package.” Hosts now need deterministic projection, permission review, runtime capability injection, readiness output, and package cleanup semantics.

## Release validation set

A v0.3 release should be checked with:

```bash
npm run cli -- validate docs/examples/content-factory-app
npm run cli -- project docs/examples/content-factory-app
npm run cli -- readiness docs/examples/content-factory-app
npm run build
npm pack --dry-run
```

If the package is distributed through a registry, add signature, hash, license, compatibility, and tenant policy checks.

## Compatibility note

v0.3 does not require hosts to execute every runtime asset immediately. A host can adopt v0.3 in phases: first validate and project packages, then add readiness, then open selected SDK capabilities. The important requirement is that no new current work depends on legacy entry naming or hidden host internals.

## Documentation impact

The docs now treat every major concept as a page-level contract: background, manifest fields, host behavior, readiness, examples, and failure modes. This makes the standard reviewable by app authors and client implementors without private context.
