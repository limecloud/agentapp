---
title: v0.10 Specification Snapshot
description: v0.10 snapshot for the shared host model.
---

# v0.10 Specification Snapshot

v0.10 inherits the previous App Server bridge profile and adds three current requirements:

1. Apps share user state and host capabilities only through governed SDK handles.
2. Local desktop storage defaults to per-app SQLite managed by the host.
3. App-owned backend services are allowed, but must distinguish client-local services from cloud-remote services; both must be declared, governed, and isolated from host internals.

Use the [latest specification](../../specification) as the full contract.
