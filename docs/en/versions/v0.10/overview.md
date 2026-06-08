---
title: v0.10 Update
description: Concise release note for Agent App v0.10.
---

# v0.10 Update

v0.10 tightens Agent App around a mini-program style host model: apps share host-governed user state and platform capabilities, while app UI, workflow state, storage, and optional backend services remain isolated.

| Area | Decision |
| --- | --- |
| Host model | User, tenant, workspace, locale, theme, model profile, secrets, policy, files, artifacts, and agent runtime are host-governed capability projections. Apps do not receive raw tokens, host DB handles, or internal paths. |
| Local storage | Local desktop installs should default to host-managed per-app SQLite. A normal user should not need to install PostgreSQL just to run a desktop app. |
| Server storage | PostgreSQL is appropriate for cloud, enterprise, or team-shared backends, using per-app schemas/roles or dedicated databases for high-risk apps. |
| App backend | Split app backends into client-local services and cloud-remote services. Client-local backends ship with the app and are supervised by the desktop/client host; cloud-remote backends are explicit `server-assisted` capabilities and must declare endpoint, tenant policy, audit, and data boundary. |
| Desktop surface | Electron hosts should prefer `WebContentsView` or a controlled `BrowserWindow`; iframe stays as a compatibility surface and `<webview>` is not the default new path. |

The reference CLI now reports `0.10.0`, accepts `--version 0.10`, validates storage isolation hints, and generates app-backend metadata in migration suggestions.

See the latest [Specification](../../specification), [Runtime model](../../client-implementation/runtime-model), and [Desktop host conformance](../../client-implementation/desktop-host-conformance).
