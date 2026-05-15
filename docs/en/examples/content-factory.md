---
title: Content Factory App
description: Product-level Agent App example for content factory workflows.
---

# Content Factory App

This example packages content factory as a product-level Agent App, not as a single “content expert”. It has its own UI, storage, workflows, worker, expert-chat entry, Knowledge bindings, Artifacts, and Evals.

It declares:

- `dashboard` and `content_factory` page entries.
- `knowledge_builder` and `content_calendar` workflows.
- `content_strategist` expert-chat entry.
- `content-factory-app` storage namespace and schema.
- Knowledge slots for `project_knowledge`, `personal_ip`, and `content_operations`.
- Tool Broker requirements such as document parsing and competitor research.
- Artifact types for content tables, article drafts, and strategy reports.
- Evals for anti-AI tone and fact grounding.

Customer-specific facts such as founder stories, brand voice, private-domain SOPs, and operation data do not belong in the official app package. They should be bound as Agent Knowledge, workspace files, app storage, or overlays.

Reference package: [`docs/examples/content-factory-app/APP.md`](../../examples/content-factory-app/APP.md)
