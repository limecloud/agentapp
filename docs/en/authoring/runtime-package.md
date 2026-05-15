---
title: Runtime Package Design
---

# Runtime Package Design

The core of an Agent App is not `APP.md`; it is the runtime package. `APP.md` tells the host what exists, what is required, and where to load it from. The runtime package carries real UI, workers, storage schemas, workflows, and business implementation.

## Minimal shape

```text
app-name/
├── APP.md
├── dist/
│   ├── ui/
│   └── worker/
├── storage/
│   ├── schema.json
│   └── migrations/
├── workflows/
├── agents/
├── artifacts/
└── policies/
```

Not every app needs every directory. A catalog-only app may contain only `APP.md`; a product-level app needs at least one runnable entry and real implementation.

## UI bundle

The UI bundle registers app-owned pages, panels, settings pages, and Artifact viewers. It runs inside a host-controlled container and must not directly access file systems, networks, databases, or credentials.

UI calls platform capabilities only through injected SDK handles:

```ts
const project = await lime.storage.table('projects').get(projectId)
await lime.ui.openArtifact({ id: project.latestReportArtifactId })
```

## Worker / Service

Workers handle long tasks, batch jobs, background sync, index building, and business workflows. They should not implement their own model gateway, file permission layer, credential storage, or artifact store. Those come from host capabilities.

```ts
export default defineWorker(async ({ lime, input }) => {
  const snippets = await lime.knowledge.search(input.query)
  const task = await lime.agent.startTask({ input: { snippets } })
  return lime.artifacts.create({ type: 'report', data: task.output })
})
```

## Storage schema

Apps may declare their own namespace and schema, while the host owns the physical storage implementation.

```yaml
storage:
  namespace: content-factory-app
  schema: ./storage/schema.json
  migrations: ./storage/migrations
```

Design rules:

1. Tables, indexes, and migrations must stay inside the app namespace.
2. User data and overlays must not be overwritten by official package upgrades.
3. Migrations must be tied to app versions.
4. Uninstall must distinguish deleting the app, keeping data, and exporting data.

## Business workflow

Workflow is a business state machine, not a prompt. It may call Skills, Tools, Knowledge, Storage, Artifacts, and human review nodes.

```text
Upload files
→ parse documents
→ AI structured extraction
→ human confirmation
→ write knowledge version
→ create Evidence
```

If a workflow only exists as chat instructions, it is not yet a product-level Agent App.

## Runtime package validation

Hosts should check during install:

- referenced paths exist
- UI / worker / storage / workflow hashes match the package lock
- capability versions satisfy requirements
- migration plan is executable
- every executable entry has policy
- every external network, file, and secret access has a permission declaration

## Author checklist

- Keep `APP.md` to declaration and user guidance; do not hide implementation in it.
- Put real functionality in `dist/`, `storage/`, `workflows/`, and `artifacts/`.
- Call Lime capabilities only through `@lime/app-sdk`.
- Do not copy Lime implementations for files, tasks, artifacts, knowledge, tools, or policy.
- Every entry should trace to UI, worker, workflow, or expert implementation.
