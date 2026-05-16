---
title: v0.4 changelog
description: Key changes in v0.4.
---

# v0.4 changelog

- Standardizes Host Bridge v1 (`lime.agentApp.bridge`) as the runtime event protocol for sandboxed Agent App UI.
- Standardizes host -> app events for theme, locale, visibility, response, and error, plus app -> host requests for ready, snapshot, navigate, toast, download, openExternal, and capability invoke.
- Clarifies that Host Bridge is the transport layer for `lime.ui` and the Capability SDK, not a private app protocol and not a bypass around readiness, permission, policy, or provenance.
