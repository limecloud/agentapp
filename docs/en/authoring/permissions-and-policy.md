---
title: Permissions and policy
description: How Agent Apps declare permissions, policy gates, secrets, and runtime risk.
---

# Permissions and policy

Agent Apps are executable packages. They may register UI, run workflows, read user-selected files, call tools, start agent tasks, create artifacts, store data, or request credentials. The host must be able to review and enforce these actions before runtime.

Permissions are declarations. Policy is the host decision process that turns declarations into allow, ask, deny, audit, retain, or degrade behavior.

## Permission principles

1. Declare before runtime.
2. Ask only for the smallest useful scope.
3. Separate install-time review from runtime confirmation.
4. Store credentials as secret handles, not plaintext.
5. Record decisions in evidence or audit logs when trust matters.
6. Keep user and tenant overlays separate from official package defaults.

## Permission fields

A permission request should be stable, explainable, and enforceable.

```yaml
permissions:
  - key: read_selected_files
    scope: filesystem
    access: read
    required: true
    reason: Read user-selected documents to build project knowledge.
  - key: call_content_tools
    scope: tool
    access: execute
    required: true
    reason: Invoke document parsing and export tools.
```

Recommended fields:

| Field | Meaning |
| --- | --- |
| `key` | Stable permission ID. |
| `scope` | `filesystem`, `network`, `tool`, `model`, `storage`, `artifact`, `secret`, or host-specific scope. |
| `access` | `read`, `write`, `execute`, `export`, `admin`, or `request`. |
| `required` | Whether the app blocks without this permission. |
| `reason` | User-readable explanation. |
| `entries` | Optional list of entries that need the permission. |
| `degradedBehavior` | What happens when optional permission is denied. |

## Install-time and runtime policy

Some permissions can be reviewed at install time. Others must be confirmed at runtime because the user has not selected the concrete resource yet.

| Permission | Install-time | Runtime |
| --- | --- | --- |
| App storage namespace | Create namespace plan. | Execute migrations when activated. |
| User-selected files | Show possible need. | Ask when user selects files. |
| External tool | Check availability. | Confirm tool execution if risky. |
| Model spend | Show cost policy. | Enforce per run or monthly budget. |
| Secrets | Declare secret slot. | Ask user or tenant admin to bind credential. |
| Export | Show output types. | Confirm destination and retention. |

## Secrets

Apps should declare secret slots, not secret values.

```yaml
secrets:
  - key: publishing_workspace_token
    provider: lime.secrets
    scope: workspace
    required: false
```

The app receives a handle from the host. It should never see plaintext unless the host capability explicitly returns a temporary authorized value.

## Policy outcomes

A host policy engine can return:

| Outcome | Behavior |
| --- | --- |
| `allow` | The app can proceed. |
| `ask` | The user, admin, or workspace owner must confirm. |
| `deny` | The app cannot use the capability. |
| `degraded` | The app can run with a reduced workflow. |
| `audit-only` | The app can run but evidence or audit must be recorded. |
| `blocked` | The app cannot be activated until setup changes. |

Readiness should surface these outcomes in a way users can act on.

## Data boundary policy

Policies should cover where data may live:

- official package files
- app storage namespace
- workspace files
- Knowledge Packs
- artifacts
- evidence records
- logs
- secrets
- tenant overlays

Private customer data should not enter official package files. If an app needs private facts, it should declare Knowledge templates or overlay slots.

## Runtime enforcement

A permission UI is not enough. The Capability SDK bridge must enforce decisions. If a workflow tries to call a tool without permission, the bridge must block the call even if the UI failed to hide the button.

Enforcement points:

- SDK capability handle creation
- storage namespace access
- tool invocation
- file read and write
- model task start
- artifact export
- secret access
- network access
- background task scheduling

## Review checklist

Before release, confirm:

- Every executable entry has declared permissions.
- Every secret is a slot, not a value.
- Optional permissions define degraded behavior.
- Policy errors are stable and user-readable.
- Host enforcement happens at the bridge, not only in UI.
- Evidence records are created for trust-sensitive runs.
