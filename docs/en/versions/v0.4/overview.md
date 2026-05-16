---
title: v0.4 overview
description: Host Bridge v1 runtime event protocol for sandboxed Agent App UI.
---

# v0.4 overview

v0.4 standardizes Host Bridge v1 as the runtime event transport between Agent App UI and the Lime Host.

## Key changes

- Standard `lime.agentApp.bridge` runtime event protocol with controlled message envelope, version, requestId, appId, entryKey, payload.
- Host -> App events: `host:snapshot`, `theme:update`, `host:response`, `host:error`, `host:visibility`.
- App -> Host events: `app:ready`, `host:getSnapshot`, `host:navigate`, `host:toast`, `host:openExternal`, `host:download`, `capability:invoke`.
- Theme, locale, entry context, visibility, navigation, notifications, downloads, and capability invocations all share the same bridge.
- Host Bridge is a transport layer; it does not replace the Capability SDK. The host remains the only decision maker.

## Why it matters

Before v0.4 each app had to invent a private `postMessage` protocol, which made theme, locale, and policy interception impossible to standardize. v0.4 fixes the events so apps no longer need a private bridge.

## Compatibility

v0.4 keeps the v0.3 manifest schema, typed SDK expectations, overlay model, and readiness unchanged. It only adds the Host Bridge protocol as the UI runtime boundary.

## Backward compatibility

Apps using v0.3 manifests continue to work in a v0.4 host. Host Bridge is a host capability and does not require manifest changes.
