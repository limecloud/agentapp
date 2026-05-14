---
title: Adding Agent App support
description: Host implementation checklist.
---

# Adding Agent App support

A host should implement these steps:

1. Discover `APP.md` packages.
2. Parse catalog metadata.
3. Validate required fields and dependency declarations.
4. Store installed app packages in a local cache.
5. Resolve overlays.
6. Project entries into the host catalog.
7. Route execution to the host Agent Runtime.
8. Record app provenance on entries, artifacts, and evals.

For Lime, Lime Cloud owns app catalog and release distribution. Lime Desktop owns installation, cache, resolver, and local execution.
