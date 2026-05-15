---
title: v0.3 变更记录
---

# v0.3 变更记录

## Added

- v0.3 manifest 字段的 typed descriptor schemas。
- tenant / workspace / user / customer 定制用的 `overlayTemplates`。
- SDK typed-call 期望与稳定运行时语义。
- Projection provenance 增加 package-level `packageHash`。
- 新参考 fixture：`APP 内容工厂` / `content-factory-app`。

## Changed

- `scene` 和 `home` entry 只作为兼容入口；manifestVersion 0.3 不再允许使用。
- 参考 CLI 会检查 entry-specific 必填字段，并在 Product-level App 缺 runtime package 或权限声明时给出 warning。
- 当前文档把 Agent App 定位为可执行标准，而不只是可安装包 metadata。

## Compatibility

- v0.1 和 v0.2 文档保留在版本目录。
- 参考 CLI 仍能读取 legacy manifest，但 current v0.3 manifest 不应继续使用 legacy entry kind。
