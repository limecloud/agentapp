---
manifestVersion: 0.7.0
name: lightweight-content-ops-app
displayName: Lightweight Content Ops
displayNameI18n:
  zh-CN: 轻量内容运营工作台
shortDescription: Turn source records into reviewable content drafts with clear boundary handoff.
description: A sanitized v0.7 example that shows how an Agent App handles content operations without embedding customer-private data or vendor-specific logic.
version: 0.7.0
status: draft
appType: domain-app
publisher:
  publisherId: lime-examples
  name: Lime Examples
updatedAt: 2026-05-17T00:00:00Z
homepage: https://limecloud.github.io/agentapp/en/examples/lightweight-content-ops
repository:
  type: git
  url: https://github.com/limecloud/agentapp.git
  directory: docs/examples/lightweight-content-ops-app
documentation: https://limecloud.github.io/agentapp/en/examples/lightweight-content-ops
license: Apache-2.0
support:
  url: https://github.com/limecloud/agentapp/issues
compliance:
  privacyPolicyUrl: https://limecloud.example/legal/privacy
runtimeTargets:
  - local
  - hybrid
requires:
  sdk: "@lime/app-sdk@^0.7.0"
  capabilities:
    - lime.ui
    - lime.storage
    - lime.agent
    - lime.artifacts
    - lime.policy
    - lime.evidence
    - lime.secrets
    - lime.connectors
triggers:
  keywords:
    - content
    - draft
    - review
    - operations
    - 内容
    - 草稿
    - 审核
  scenarios:
    - lightweight_content_ops
    - draft_review
quickstart:
  entry: workspace
  sampleWorkflow: draft_review
runtimePackage:
  ui:
    path: ./dist/ui
entries:
  - key: workspace
    kind: page
    title: Content Ops Workspace
    route: /workspace
  - key: draft_review
    kind: workflow
    title: Draft Review Flow
    workflow: ./workflows/draft-review.workflow.md
storage:
  namespace: lightweight-content-ops-app
  uninstallPolicy: ask
permissions:
  - key: read_source_records
    scope: tool
    access: read
    required: true
    reason: Read external source records through a Host-managed connector.
  - key: write_draftbox
    scope: tool
    access: write
    required: false
    reason: Write reviewed drafts back only after human approval.
artifactTypes:
  - key: content_draft
    standard: agentartifact
    schema: ./artifacts/content-draft.schema.json
    required: true
secrets:
  - key: source_connector_token
    provider: lime.secrets
    scope: workspace
    required: false
presentation:
  category: content
  title: Lightweight Content Ops
  summary: Sanitized v0.7 example for requirement boundary handoff.
metadata:
  example: true
  sanitized: true
---

# Lightweight Content Ops App

This example demonstrates v0.7 boundary handoff for a common content-operations workflow. It does not include customer names, private source links, real accounts, or contract details.

## What the App owns

- A workspace that shows source status, draft status, review status, and evidence.
- A workflow that turns selected source records into structured draft artifacts.
- Human review before external write-back.

## What Lime owns

- Lime Host runs the agent task, connector invocation, tool policy, secrets, sandbox, and evidence.
- Lime Cloud may provide tenant policy, OAuth brokering, connector registry, webhook, or scheduled sync.

## What stays outside

- The external table or document system remains the source of truth.
- Connector adapters are installed outside the App package.
- High-risk publish or bulk update operations require human confirmation.
