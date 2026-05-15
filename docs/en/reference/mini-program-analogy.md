---
title: Mini-program analogy
description: A mental model for understanding Agent Apps as host-platform applications.
---

# Mini-program analogy

Agent App uses a host-platform mental model similar to mini-program ecosystems, but it does not copy any specific mini-program framework.

The useful analogy is this: a host opens stable capabilities, apps declare what they need, users install apps, and runtime access is mediated by the host.

## Mapping

| Mini-program idea | Agent App counterpart |
| --- | --- |
| Platform app | Lime Desktop, IDE, AI client, or other host. |
| Mini-program package | Agent App package. |
| Manifest | `APP.md` frontmatter. |
| Pages | `page`, `panel`, `settings`, and `artifact` entries. |
| Platform APIs | Capability SDK such as `lime.ui`, `lime.storage`, `lime.agent`. |
| Permissions | Agent Policy and host permission review. |
| Local storage | App storage namespace. |
| Review and release | Registry and tenant enablement. |

## Where the analogy helps

It helps explain why Agent App is not just a prompt:

- The package can own UI and storage.
- The host controls capabilities.
- Installation is separate from execution.
- Permissions and release metadata are first-class.
- Apps can be upgraded without changing host core.

## Where the analogy stops

Agent App is built for AI hosts. It must compose Agent Skills, Knowledge, Tools, Artifacts, Evidence, Policy, Runtime, and QC. It also must handle model tasks, context assembly, evidence, and evals, which traditional mini-programs do not define.

Do not import assumptions about page technology, rendering engines, or app stores from any specific mini-program ecosystem.

## Practical implication

Host implementors should avoid hardcoding vertical business features into core. Instead, they should expose stable capabilities and let app packages compose them.

App authors should avoid depending on host internals. They should declare entries, permissions, storage, and capabilities, then call the SDK.

## Example

A Content Factory App can have:

- a dashboard page
- a content factory page
- a knowledge-building workflow
- an expert-chat entry
- app storage tables
- Tool requirements
- Artifact outputs
- Evals and Evidence

This is closer to an installable mini-program than to a single chatbot persona.

## Implementation lesson

The analogy should push implementation toward platform capabilities, not toward copying any specific front-end framework. A host should provide stable SDK surfaces, permission prompts, storage namespaces, lifecycle events, and review hooks. App packages should stay portable across hosts that implement the same capabilities.

## Anti-patterns

- Treating the app as a static page instead of a package with runtime, storage, workflow, and policy.
- Letting the app bypass host permission and secret management because it is “just local code”.
- Shipping customer-specific data as part of an official package release.
- Adding every vertical scenario directly to host core instead of projecting entries from packages.
- Assuming a cloud registry should run the agent task by default.

## Host checklist

- Can the host install, disable, update, and remove an app without code changes?
- Can entries be projected from manifest data rather than hardcoded navigation?
- Can SDK calls be authorized, audited, cancelled, and mocked?
- Can tenants customize with overlays without forking the package?
- Can the user understand what data, Tools, and secrets the app requires before activation?
