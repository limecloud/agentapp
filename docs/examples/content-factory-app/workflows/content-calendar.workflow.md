# Content calendar workflow

## Purpose

Turn confirmed project knowledge and content scenarios into a reviewable content calendar with drafts, artifacts, and evidence.

## Inputs

- Project ID.
- Bound `project_knowledge` and optional `personal_ip` Knowledge.
- Selected content scenarios.
- Platform, cadence, format, and review rules.

## States

| State | Kind | Description | Next |
| --- | --- | --- | --- |
| `select_scenarios` | human-review | User chooses scenarios, audience, platform, and quantity. | `retrieve_knowledge` |
| `retrieve_knowledge` | knowledge-search | Retrieve relevant facts, proof points, and constraints. | `draft_assets` |
| `draft_assets` | agent-task | Generate drafts, scripts, hooks, or image prompts. | `run_quality_gates` |
| `run_quality_gates` | eval | Apply fact grounding, tone, and publish readiness checks. | `save_assets` |
| `save_assets` | storage-write | Persist content assets, scores, and review status. | `create_artifact` |
| `create_artifact` | artifact-create | Create `content_table`, `article_draft`, or `strategy_report`. | `record_evidence` |
| `record_evidence` | evidence-record | Link outputs to Knowledge, model task, tools, and evals. | `end` |

## Outputs

- Content assets in app storage.
- Content table or draft Artifact.
- Evidence record with source and eval references.

## Review rules

- Do not mark content publish-ready without fact grounding.
- Keep low-confidence outputs editable but not accepted.
- Preserve failed evals so the user can inspect why a draft was rejected.

## Failure handling

| Failure | Handling |
| --- | --- |
| Required Knowledge is missing | Stop at setup and request binding instead of generating generic content. |
| Eval fails | Keep the draft editable, mark it not publish-ready, and show the failed criterion. |
| Tool timeout | Save partial state and allow retry with the same idempotency key. |
| User changes scenario selection | Recompute affected drafts and keep previous artifact versions. |
| Export fails | Preserve the artifact in local storage and surface export remediation. |

## Completion criteria

The workflow is complete when the selected scenarios, generated assets, eval results, artifact IDs, and Evidence records are all persisted. A content list that cannot be traced to Knowledge and evals is only a draft, not an accepted calendar.

## Host integration notes

The host should treat each state as resumable. Long generation and export steps should support cancellation, retry, and trace IDs so the app can recover from model, Tool, or network failures without duplicating artifacts.

## Test cases

| Case | Expected result |
| --- | --- |
| Required Knowledge is present | Generate scenario-linked drafts and create artifacts. |
| Required Knowledge is missing | Stop with setup remediation and no generic draft. |
| Fact grounding fails | Store draft as not ready and expose failed evidence links. |
| User retries export | Reuse idempotency key and avoid duplicate artifacts. |
| User edits a scenario | Recompute only affected content assets. |
