---
title: v0.1 overview
description: Historical overview of the first Agent App package draft.
---

# v0.1 overview

Agent App v0.1 established the first package contract: a directory with `APP.md`, YAML frontmatter, human-readable guidance, host projection, readiness, overlays, schemas, bilingual docs, and reference CLI commands.

v0.1 should be read as a foundation release. It proved that app-like agent systems need a package boundary that is larger than a Skill and more structured than a prompt.

## Main ideas

- `APP.md` is the required discovery entry.
- Apps are installed into a host, not executed by a hidden registry runtime.
- Hosts project app declarations into local catalog entries.
- Skills and Knowledge remain separate standards.
- Customer data stays outside official packages.
- Readiness checks setup before execution.
- Overlays allow tenant and workspace customization.

## Package shape in v0.1

```text
my-agent-app/
├── APP.md
├── skills/
├── knowledge-templates/
├── workflows/
├── tools/
├── artifacts/
├── evals/
├── assets/
└── examples/
```

Only `APP.md` was required. Support folders were progressively loaded.

## What v0.1 did not solve

v0.1 was still mostly a composition draft. It did not fully define runtime package ABI, typed SDK calls, worker execution, strong descriptor schemas, package provenance, or current v0.3 entry kinds.

## Upgrade guidance

Authors with v0.1 packages should:

1. Add `manifestVersion: 0.3.0` for current packages.
2. Replace legacy `scene` or `home` entries with `page`, `command`, `workflow`, `artifact`, `background-task`, or `settings`.
3. Add `requires.sdk` and `requires.capabilities`.
4. Move implementation into runtime package folders.
5. Add permissions, secrets, overlays, and provenance-aware readiness.

## Host behavior in hindsight

A host that only supports v0.1 can list apps and show rough entries, but it cannot confidently run product-level apps. It lacks the stronger runtime package boundary, SDK negotiation, permission model, and provenance expected by v0.3.

## Migration checklist

| Area | v0.1 signal | v0.3 replacement |
| --- | --- | --- |
| Entry model | `home` / `scene` style entries. | Current entry kinds with implementation pointers. |
| Runtime | Mostly implied by docs. | Declared runtime package and Capability SDK. |
| Data | Generic Knowledge references. | Required templates, overlays, secrets, storage namespace. |
| Quality | Initial eval concept. | Evals, Evidence, readiness, and human review paths. |
| Release | Draft metadata. | Package hash, manifest hash, compatibility, lifecycle. |
