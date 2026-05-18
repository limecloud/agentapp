---
title: v0.8 Changelog
description: Changes introduced by Agent App v0.8.
---

# v0.8 Changelog

## 0.8.0

- Adds `app.install.yaml` as the v0.8 layered install contract.
- Defines `in_lime`, `standalone`, `runtime_backed`, and `web_host` install modes.
- Splits the product model into Agent App package, Lime Runtime Core, Lime Desktop host, and Lime App Shell.
- Updates the reference CLI to `0.8.0` with `--version 0.8`, `--target 0.8.0`, v0.8 migration suggestions, and projection of install metadata.
- Adds `app-install.schema.json` and extends the manifest schema with `manifestVersion: 0.8.0` and `install` shorthand support.
- Updates the Content Factory example to v0.8 with a standalone/runtime-backed install contract.

v0.7 apps remain valid. v0.8 adds distribution shape; it does not remove the v0.7 requirement-boundary and capability handoff model.
