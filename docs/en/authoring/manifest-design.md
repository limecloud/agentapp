---
title: Manifest design
description: Design APP.md frontmatter for a stable host projection.
---

# Manifest design

`APP.md` should be small enough for discovery and explicit enough for a host to build a catalog projection.

Good manifests:

- Use stable keys for every entry.
- Declare local runtime support when the app can run after installation.
- Reference existing standards instead of inventing local protocols.
- Separate required setup from optional enhancements.
- Keep customer facts out of the official package.

## Mini-program analogy

WeChat Mini Programs use `app.json` to list pages and global settings. Agent App uses `APP.md` frontmatter to list host entries and capability dependencies. The analogy stops there: Agent App does not define a JavaScript UI framework or a cloud execution environment.
