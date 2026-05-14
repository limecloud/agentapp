---
title: v0.2 specification
---

# v0.2 specification

The v0.2 specification tracks latest: [Specification](../../specification.md). This version fixes these semantics:

1. Agent App is a complete application package, not a Markdown prompt.
2. `APP.md` is discovery manifest + app guide, not business implementation.
3. Runtime packages carry UI, workers, storage, workflows, artifacts, and policies.
4. Apps cannot call Lime internals; they must use the Capability SDK.
5. Expert is an `expert-chat` entry, only one kind of app entry.
6. Projection does not execute code; it produces host catalog objects and provenance.
7. Readiness must check capabilities, permissions, knowledge bindings, secrets, storage migrations, tool availability, and policy.
