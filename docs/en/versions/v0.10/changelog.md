---
title: v0.10 Changelog
description: Changes introduced by Agent App v0.10.
---

# v0.10 Changelog

## 0.10.0

- Adds the shared host model: shared user state and host capabilities, isolated app storage and app backend services.
- Sets local desktop storage guidance to host-managed per-app SQLite by default.
- Positions PostgreSQL for cloud, enterprise, and team-shared server backends, not normal desktop prerequisites.
- Adds optional `app-backend` service metadata and backend protocol fields.
- Updates Electron host guidance toward `WebContentsView` / controlled `BrowserWindow` and keeps iframe as compatibility.
- Updates CLI, schemas, examples, and release docs to `0.10.0`.
