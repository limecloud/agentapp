---
title: Best practices
description: Practical rules for authoring upgradeable, safe, and host-friendly Agent Apps.
---

# Best practices

Agent App packages should feel like real applications, but they must remain safe to install into a host runtime. These practices keep packages portable, reviewable, and upgradeable.

## Keep `APP.md` declarative

`APP.md` should describe what the app is, what it needs, and how the host should project it. It should not contain a full implementation.

Good `APP.md` content:

- identity, version, status, app type
- entries and presentation metadata
- capability requirements
- runtime package locations and hashes
- storage namespace and migrations
- Knowledge templates, Skills, Tools, Artifacts, Evals
- permissions, secrets, lifecycle, overlays
- human-readable guide and non-goals

Bad `APP.md` content:

- long procedural prompts that belong in Skills
- private customer knowledge that belongs in Knowledge Packs
- host internal paths or database assumptions
- plaintext credentials
- hidden network or filesystem requirements

## Use stable keys

Keys are part of the contract between app package, host projection, user state, overlays, artifacts, and evidence. Treat them as durable IDs.

| Object | Stable key example |
| --- | --- |
| Entry | `content_factory`, `policy_lookup`, `review_dashboard` |
| Knowledge template | `project_knowledge`, `support_policy` |
| Tool requirement | `document_parser`, `ticket_lookup` |
| Artifact type | `content_table`, `reply_draft` |
| Eval | `fact_grounding`, `policy_compliance` |

Avoid changing keys for cosmetic reasons. If a key must change, provide migration notes.

## Do not bypass the SDK

Apps should call host capabilities through `@lime/app-sdk` or host-injected handles. They should not import host source files, call private Tauri commands, or assume local database schemas.

```ts
const lime = await getLimeRuntime()
const table = lime.storage.table('content_assets')
const task = await lime.agent.startTask({ entry: 'draft', input })
const artifact = await lime.artifacts.create({ type: 'content_table', data })
await lime.evidence.record({ subject: artifact.id, sources: task.traceId })
```

The SDK boundary is what allows host upgrades without breaking every app.

## Declare permissions before runtime

If an app needs files, network, tools, model spend, export, secrets, or tenant data, declare the need in frontmatter. The host can then render an install review, ask at runtime, or block the app.

Do not rely on a sentence such as "this app may read files" in the Markdown body. Policy engines need structured fields.

## Keep customer data outside official packages

Official packages should be reusable. Customer-specific facts belong in:

- Agent Knowledge Packs
- workspace files
- app storage namespaces
- tenant, workspace, or user overlays
- secret handles

This prevents package upgrades from overwriting private data and prevents sensitive data from entering registries.

## Make readiness actionable

A readiness failure should tell the host what to do next:

| Weak message | Better message |
| --- | --- |
| Missing setup | Bind `project_knowledge` Knowledge Pack before running `content_factory`. |
| Tool unavailable | Enable `document_parser` in ToolHub or disable file ingestion workflow. |
| Permission denied | Request filesystem read permission for user-selected files. |
| Eval missing | Install `fact_grounding` eval or mark publish workflow as blocked. |

## Preserve provenance

Every projected entry, workflow run, tool call, artifact, evidence record, and migration should carry app provenance:

- app name and version
- package hash
- manifest hash
- entry key
- workflow run ID when available
- standard and standard version

This is essential for audit, cleanup, rollback, and support.

## Prefer small releases

Release apps in small, verifiable increments:

1. manifest and projection
2. static readiness
3. mock runtime
4. controlled UI host
5. controlled workflow runtime
6. real tool and model integration
7. broader tenant rollout

Do not wait for a giant app to be complete before validating package shape, permissions, and cleanup.

## Anti-patterns

- Treating an app as a single `expert-chat` entry.
- Embedding all prompts in `APP.md`.
- Hardcoding host implementation paths.
- Creating a custom tool protocol for one app.
- Publishing private customer data as an official package.
- Adding vertical business pages to host core instead of packaging them as app UI.
- Running app code before readiness and policy checks.
