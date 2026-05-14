# Agent App

Agent App is a draft companion standard in the Agent Skills ecosystem for packaging installable agent applications. It describes how a user-facing agent app composes Agent Skills, Agent Knowledge templates, tool requirements, scene entries, artifact contracts, evals, and presentation metadata without moving agent execution into the cloud.

Agent Skills answer **how to do work**. Agent Knowledge answers **what trusted knowledge assets are**. Agent App answers **which capabilities, knowledge templates, tools, UI entries, deliverables, and quality gates make up an installable application**.

## Core boundary

| Standard | Owns | Entry point | Runtime behavior |
| --- | --- | --- | --- |
| Agent Skills | Executable workflows, scripts, tools, templates, and procedural instructions. | `SKILL.md` | Activated by the agent after trust checks. |
| Agent Knowledge | Source-grounded knowledge assets, status, provenance, and safe context. | `KNOWLEDGE.md` | Loaded as fenced data; never executed. |
| Agent App | Installable application composition, dependencies, scenes, permissions, artifact contracts, evals, and presentation. | `APP.md` | Resolved by the host; execution still happens in the host agent runtime through Skills, Knowledge, Tools, and Runtime. |

## Pack shape

```text
my-agent-app/
├── APP.md                 # required: manifest + app guide
├── skills/                # optional: bundled or referenced Agent Skill packages
├── knowledge-templates/   # optional: required knowledge slots and starter templates
├── workflows/             # optional: scene and workflow definitions
├── tools/                 # optional: tool requirements and permission hints
├── artifacts/             # optional: output contracts and viewer hints
├── evals/                 # optional: readiness and quality checks
├── assets/                # optional: icons, examples, templates, screenshots
└── examples/              # optional: sample workspaces, prompts, and expected outputs
```

## Runtime contract

Compatible hosts should:

1. Discover apps by `APP.md`.
2. Load only catalog metadata first.
3. Install or activate an app only after user, tenant, or workspace consent.
4. Resolve declared Skills, Knowledge templates, Tools, Artifacts, and Evals into the host catalog.
5. Keep agent execution inside the host runtime; cloud registries may distribute and authorize apps but must not become a hidden Agent Runtime.
6. Keep customer data in Agent Knowledge packs, workspace files, or overlays rather than official app packages.
7. Record app provenance on every projected scene, command, artifact, and eval.

## Documentation

- [Specification](docs/en/specification.md)
- [What is Agent App?](docs/en/what-is-agent-app.md)
- [Agent App vs Skills and Knowledge](docs/en/agent-app-vs-skills-knowledge.md)
- [Runtime model](docs/en/client-implementation/runtime-model.md)
- [中文规范](docs/zh/specification.md)

## Reference CLI

```bash
npx agentapp-ref@0.1.0 validate ./my-agent-app
npx agentapp-ref@0.1.0 to-catalog ./my-agent-app
npx agentapp-ref@0.1.0 project ./my-agent-app
npx agentapp-ref@0.1.0 readiness ./my-agent-app --workspace ./workspace
```

## Local development

```bash
npm install
npm run dev
npm run build
```
