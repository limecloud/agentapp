---
title: Customer support app
description: Example Agent App for support workflows.
---

# Customer support app

The customer support example shows a smaller workflow app. It is intentionally less complete than the Content Factory fixture, but it demonstrates how Agent App applies outside content production.

Reference package: [`docs/examples/customer-support-app/APP.md`](../../examples/customer-support-app/APP.md)

## User job

A support team wants grounded replies and escalation notes that follow product facts and support policy. The app should help agents answer faster without inventing policy or leaking customer data.

## Package shape

The example declares:

- product and policy Knowledge templates
- a `draft_reply` command entry
- optional ticket lookup Tool requirement
- `reply_draft` Artifact type
- `policy_compliance` Eval
- v0.6 `app.runtime.yaml` for structured reply drafts, approval, session, tool discovery, checkpoints, and observability
- support category presentation metadata

It is a draft app, so validation still warns that a product-level runtime package, full layered config, and explicit permissions should be added before production use.

## Suggested complete version

A production support app would usually add:

| Area | Additions |
| --- | --- |
| Entries | Reply drafting, policy lookup, escalation note, manager review. |
| UI | Ticket side panel and policy citation panel. |
| Storage | Draft history, escalation state, policy version snapshots. |
| Tools | Ticket lookup, CRM update, customer profile, macro export. |
| Artifacts | Reply draft, escalation note, policy citation bundle. |
| Evals | Policy compliance, tone, source grounding, privacy check. |
| Permissions | Ticket read, optional ticket write, CRM tool execution, and runtime approval for risky actions. |
| Secrets | CRM OAuth or tenant ticketing connector handle. |

## Boundary example

| Asset | Correct place |
| --- | --- |
| How to write an empathetic reply | Agent Skill |
| Product facts and refund policy | Agent Knowledge |
| Ticket lookup connector | Agent Tool |
| Draft reply command and review workflow | Agent App |
| Reply draft with JSON Schema | Agent Artifact |
| Policy compliance result | Eval and Evidence |

## Why this matters

Support workflows are high trust. The app should never answer from generic model knowledge when policy Knowledge is required. Readiness should block or warn when `support_policy` is not bound.

## Try it locally

```bash
npm run cli -- validate docs/examples/customer-support-app --version 0.6
npm run cli -- project docs/examples/customer-support-app
npm run cli -- readiness docs/examples/customer-support-app
```

The current v0.6 draft fixture is useful for testing warnings, runtime contract projection, and progressive completeness.

## End-to-end support flow

```text
Open ticket
→ retrieve product facts and support policy
→ draft answer with citations
→ run policy and privacy checks
→ human support agent edits or approves
→ create reply draft artifact
→ optionally export to ticketing system
```

The app should keep the human support agent in control. It can accelerate retrieval, drafting, summarization, and escalation note creation, but final customer communication should remain reviewable and traceable.

## Entry design

| Entry | Kind | Purpose |
| --- | --- | --- |
| `draft_reply` | `command` | Draft a response for the active ticket or pasted customer message. |
| `policy_lookup` | `panel` | Show relevant policy snippets with source links. |
| `escalation_note` | `workflow` | Build an internal note when the case requires specialist review. |
| `reply_history` | `artifact` | Review durable reply drafts and policy evidence. |
| `support_settings` | `settings` | Bind policy Knowledge, tone rules, and ticket connector permissions. |

## Safety expectations

- Required policy Knowledge must be bound before answers can be marked ready.
- PII should stay in host-controlled workspace storage and Evidence, not in the public package.
- Tool calls that write back to CRM or ticketing systems require explicit permission.
- Low-confidence replies should be saved as drafts, not sent automatically.
- Readiness should surface missing product facts, stale policy versions, and missing connector auth separately.

## How to adapt it

For a smaller team, keep only `draft_reply`, product facts, support policy, and manual export. For a regulated support team, add escalation workflow, manager review, redaction, audit exports, and stricter Evals. The same Agent App contract supports both without changing host core.
