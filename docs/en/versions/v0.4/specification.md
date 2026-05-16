---
title: v0.4 specification snapshot
description: v0.4 layers Host Bridge v1 events on top of the v0.3 package contract.
---

# v0.4 specification snapshot

v0.4 does not replace the v0.3 package contract; it adds the Host Bridge v1 event protocol while keeping all other rules.

Read the [v0.3 specification](../v0.3/specification) as the base, then refer to the v0.4 delta below.

## v0.4 delta: Host Bridge v1

Host Bridge is the event boundary between `lime.ui` and the Capability SDK inside the UI runtime. It standardizes theme, locale, entry context, navigation, notifications, downloads, and capability calls into a controlled message protocol.

### Message envelope

```ts
interface LimeAgentAppBridgeMessage {
  protocol: "lime.agentApp.bridge"
  version: 1
  type: string
  requestId?: string
  appId: string
  entryKey?: string
  payload?: unknown
}
```

### Host -> App events

| Event | Purpose |
| --- | --- |
| `host:snapshot` | Initial full snapshot with theme, locale, host info, entry context. |
| `theme:update` | Theme, color scheme, or system light/dark change. |
| `host:response` | Successful response (with `requestId`). |
| `host:error` | Failed response (with stable code, readable message, `requestId`). |
| `host:visibility` | Runtime surface visibility change. |

### App -> Host events

| Event | Purpose |
| --- | --- |
| `app:ready` | App initialized; request first snapshot. |
| `host:getSnapshot` | Pull current host snapshot. |
| `host:navigate` | Navigate to entry or app-local route. |
| `host:toast` | Request a non-technical host notification. |
| `host:openExternal` | Request opening an external URL. |
| `host:download` | Request download of a same-origin runtime artifact. |
| `capability:invoke` | Unified capability invocation envelope. |

### Boundaries

- Host Bridge is a transport layer; it does not replace the Capability SDK.
- The host remains the only decision maker, deciding execution by capability allowlist, readiness, and policy.
- Apps must not access host DOM, Tauri, Node, filesystems, databases, or credentials directly.

See the Host Bridge v1 section in the [latest specification](../../specification#host-bridge-v1) for full detail.
