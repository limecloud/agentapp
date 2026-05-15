# Knowledge builder workflow

## Purpose

Convert user-selected source files and notes into structured project knowledge that the Content Factory App can reuse across content scenario planning, content generation, review, and reporting.

## Inputs

- User-selected documents, notes, transcripts, or spreadsheets.
- Optional existing `project_knowledge` Knowledge Pack.
- Workspace overlay rules for brand voice, prohibited claims, or review policy.

## States

| State | Kind | Description | Next |
| --- | --- | --- | --- |
| `select_sources` | human-review | User confirms files and scope. | `parse_files` |
| `parse_files` | tool-call | Use `document_parser` or host file parsing capability. | `extract_facts` |
| `extract_facts` | agent-task | Extract product facts, audience, offers, proof points, and constraints. | `human_confirm` |
| `human_confirm` | human-review | User reviews and corrects extracted knowledge. | `persist_knowledge` |
| `persist_knowledge` | storage-write | Save structured records to the app namespace and bind Knowledge refs. | `record_evidence` |
| `record_evidence` | evidence-record | Link sources, parser output, edits, and resulting Knowledge version. | `end` |

## Outputs

- Updated `knowledge_assets` storage records.
- Bound or refreshed `project_knowledge` Knowledge Pack reference.
- Evidence record linking source files and extraction task.

## Quality gates

- Reject unsupported claims without source references.
- Require human confirmation before replacing existing Knowledge bindings.
- Preserve previous Knowledge version references for rollback.

## Failure handling

| Failure | Handling |
| --- | --- |
| File cannot be parsed | Keep the source in pending state and ask the user to replace or summarize it. |
| Conflicting facts | Store both claims with source references and require human confirmation. |
| Missing provenance | Do not promote the extracted claim into trusted Knowledge. |
| User rejects extraction | Preserve the rejected extraction as Evidence but do not bind it as active Knowledge. |
| Existing Knowledge would be overwritten | Create a new version and keep rollback metadata. |

## Completion criteria

The workflow is complete only when source files, extracted facts, human edits, resulting Knowledge version, and Evidence links can be inspected together. A plain summary without source references is not enough for a production Agent App.

## Host integration notes

The host should provide file selection, parser Tool invocation, storage writes, Knowledge binding, and Evidence recording as separate capability calls. This keeps permissions visible and makes the workflow testable without changing host core.

## Test cases

| Case | Expected result |
| --- | --- |
| User selects one product brief | Extract facts, ask for confirmation, create one Knowledge version. |
| User selects conflicting notes | Surface conflict and require human decision before binding. |
| Parser returns partial data | Save partial Evidence and ask for missing context. |
| Existing Knowledge exists | Create a new version rather than overwriting silently. |
| User cancels review | Leave workflow resumable with no active Knowledge replacement. |
