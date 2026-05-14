---
title: v0.2 规范
---

# v0.2 规范

v0.2 的规范正文以 latest 为准：[规范](../../specification.md)。本版本固定以下语义：

1. Agent App 是完整应用包，不是 Markdown prompt。
2. `APP.md` 是 discovery manifest + app guide，不是业务实现。
3. Runtime package 承载 UI、worker、storage、workflow、artifact、policy 等实现。
4. App 不能调用 Lime 内部模块，只能通过 Capability SDK 使用平台能力。
5. Expert 是 `expert-chat` entry，只是 App 的一种入口。
6. Projection 不执行代码，只生成宿主 catalog 对象和 provenance。
7. Readiness 必须检查 capability、permission、knowledge binding、secret、storage migration、tool availability 和 policy。
