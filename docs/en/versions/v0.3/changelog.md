---
title: v0.3 changelog
---

# v0.3 changelog

## Added

- Typed descriptor schemas for v0.3 manifest fields.
- `overlayTemplates` for tenant / workspace / user / customer customization.
- SDK typed-call expectations and stable runtime semantics.
- Package-level `packageHash` in projection provenance.
- Reference `APP 内容工厂` / `content-factory-app` fixture.

## Changed

- `scene` and `home` entries are compatibility-only and invalid for manifestVersion 0.3.
- Reference CLI now checks entry-specific required fields and warns when product-level apps lack runtime packages or permissions.
- Current docs frame Agent App as executable standard, not only installable package metadata.

## Compatibility

- v0.1 and v0.2 documents remain in versioned docs.
- Legacy manifests can still be read by the reference CLI, but current v0.3 manifests should not use legacy entry kinds.
