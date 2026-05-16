---
title: What is Agent App?
description: Agent App is a complete installable intelligent application package for hosts such as Lime.
---

# What is Agent App?

Agent App is a draft standard for complete installable applications in agent hosts. An app may include real UI, business workflows, data storage, background jobs, agent entries, Skills, Tools, Knowledge bindings, Artifacts, Policies, and Evals.

In one sentence: **Agent App is an intelligent application running on Lime platform capabilities. It is not a Markdown file and not a single chat expert.**

`APP.md` is only the discovery entry and manifest carrier. Real business capability comes from the runtime package and from calls through the Lime Capability SDK.

## Business workspace, not a chat wrapper

The product boundary is:

> Business work stays inside the app context; agent execution stays inside Lime capability governance.

An Agent App should be the surface where the user finishes the job: dashboards, forms, tables, review queues, artifacts, settings, and embedded assistant panels all belong there. The app can call `lime.agent`, `lime.knowledge`, `lime.tools`, `lime.storage`, `lime.artifacts`, and `lime.evidence`, but the user should not have to jump back to a generic Lime chat just to complete the app's core workflow.

This also prevents the opposite failure mode. An app should not rebuild its own model gateway, credential store, permission system, evidence store, or tool broker just to avoid Lime. That would make Lime a distribution shell for independent SaaS products. Agent App exists for the middle path: the app owns business shape and business state; Lime owns the agent runtime and governed platform capabilities.

## Difference from Lime Experts

The Lime Experts module is closer to a conversational specialist: useful for quick answers, consultation, analysis, and lightweight tasks. Agent App is closer to an installable business workspace: useful when pages, workflows, data, deliverables, and background jobs need to become one product.

| Dimension | Lime Experts module | Agent App |
| --- | --- | --- |
| User entry | Conversation-first. | Pages, panels, commands, workflows, artifacts, and settings can all be entries. |
| Best fit | Q&A, consultation, ad hoc analysis, lightweight execution. | Content factories, support workbenches, contract review, research workspaces, and other complete workflows. |
| State | Mostly conversation context and bound knowledge. | Own app storage, workflow state, artifacts, and evidence. |
| Output | Usually answers, suggestions, or drafts. | Durable business objects and deliverables that can be saved, reused, and audited. |
| Extension model | Configure persona, Knowledge, Skills, and Tools. | Package UI, workers, storage schemas, workflows, permissions, and runtime contracts. |

Simple rule: if the user wants to ask a specialist, use Lime Experts. If the user needs to finish a business workflow inside a product surface, use Agent App. An Agent App may include expert entries, but an expert entry is only one interaction mode, not the whole app.

## Mini-program analogy

Agent App can be understood as a mini-program-like model for AI agents, without copying the WeChat Mini Program framework.

| Mini-program mental model | Agent App counterpart |
| --- | --- |
| WeChat is the host platform. | Lime / IDE / AI Client is the host platform. |
| Mini-programs declare pages, components, permissions, storage. | Agent Apps declare UI, entries, capabilities, storage, permissions. |
| Mini-programs call `wx.*`. | Agent Apps call `lime.ui`, `lime.storage`, `lime.agent`, etc. through `@lime/app-sdk`. |
| The platform manages review, release, and permissions. | Cloud / Registry manages release, tenant enablement, license, policy. |
| The client runs the mini-program. | Lime Desktop installs and runs the app package locally. |

The important part is not how it looks, but that the host opens capabilities and apps call those capabilities through a stable SDK.

## What regular users see

Regular users do not need to understand manifests, SDKs, or runtimes. An Agent App should feel like a business app with an intelligent assistant inside it: open the app, complete the setup checklist, choose a task, confirm important actions, and receive a durable result.

### From install to completed work

```mermaid
sequenceDiagram
  autonumber
  participant User as User
  participant Lime as Lime app center
  participant App as Agent App
  participant Assistant as Assistant
  participant Result as Results and history

  User->>Lime: Search for or open an app
  Lime-->>User: Show purpose, permissions, and example outputs
  User->>Lime: Install the app
  Lime->>App: Install and prepare the workspace
  App-->>User: Show home page and setup checklist
  User->>App: Bind knowledge, choose an entry, enter a goal
  App->>Assistant: Ask for generation, analysis, or checks
  Assistant-->>App: Return progress, questions, and drafts
  App-->>User: Show draft, citations, and risk hints
  User->>App: Edit, approve, or reject
  App->>Result: Save final artifact, evidence, and history
  Result-->>User: Download, reuse, audit, or continue
```

### User decision flow

```mermaid
flowchart TD
  Start([I want to finish a business task]) --> Find[Find a suitable Agent App]
  Find --> Understand{Do I understand the purpose and output?}
  Understand -- No --> Stop[Do not install yet<br/>choose a clearer app]
  Understand -- Yes --> Permission{Are permissions and data scope acceptable?}
  Permission -- No --> Stop
  Permission -- Yes --> Setup[Complete first-time setup<br/>bind data / choose tools / connect accounts]
  Setup --> Ready{Does setup check pass?}
  Ready -- No --> Fix[Follow the prompts<br/>or ask an admin for access]
  Fix --> Ready
  Ready -- Yes --> Run[Start the task]
  Run --> Review{Does the result need human review?}
  Review -- Yes --> Approve[Check citations, risks, and draft<br/>then edit or approve]
  Review -- No --> Save[Save the result]
  Approve --> Save
  Save --> Next[Download, share, continue, or view history]
```

Regular users only need to remember three things:

- Before installing, check what the app does, which permissions it needs, and what output it creates.
- During execution, read confirmation prompts for citations, risks, and the action about to run.
- After completion, the result should stay in the app as something traceable, editable, and reusable.

## Position in Lime

```mermaid
flowchart TD
  Cloud[Lime Cloud
Catalog / Release / License / Tenant Enablement] --> Desktop[Lime Desktop
Install / Cache / Resolver]
  Desktop --> Bridge[Capability Bridge]
  Bridge --> SDK["@lime/app-sdk"]
  SDK --> App[Agent App Runtime Package
UI / Worker / Workflow / Storage]
  Bridge --> UI[Lime UI]
  Bridge --> Storage[Lime Storage]
  Bridge --> Runtime[Local Agent Runtime]
  Bridge --> Knowledge[Agent Knowledge]
  Bridge --> Tools[Tool Broker / ToolHub]
  Bridge --> Artifact[Agent Artifact]
  Bridge --> Evidence[Agent Evidence]
  Bridge --> Policy[Policy / Secrets]
```

Lime Cloud may distribute, authorize, and enable Agent Apps. Lime Desktop installs, authorizes, injects capabilities, and runs them locally. Cloud should not become a hidden Agent Runtime by default.

## Good fits

- Content Factory systems.
- Customer support knowledge workbenches.
- Sales SOP applications.
- Legal contract review products.
- Investment research workbenches.
- Internal enterprise workflow apps.
- Customer-specific private business systems.

These scenarios should not be implemented by changing Lime Core. New scenarios should become Agent Apps that call Lime platform capabilities.

## Non-goals

Agent App is not:

- a collection of `APP.md` documents
- a single Expert or Persona
- a replacement for `SKILL.md`
- a knowledge base format
- a tool protocol
- a cloud Agent Runtime
- a package containing customer private data

## Why it exists

Skills, Knowledge, and Tools are not enough for real business applications. Apps also need:

- their own UI pages, panels, and settings
- their own data models, indexes, migrations, and caches
- business workflows, background jobs, and human review nodes
- multiple chat or non-chat entries
- traceable Artifacts, Evidence, and Evals
- permissions, costs, credentials, tenant overlays, upgrade policies
- an SDK boundary that decouples apps from Lime internals

Agent App is the application layer that ties these pieces together.
