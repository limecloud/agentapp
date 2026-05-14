---
title: 安全模型
---

# 安全模型

Agent App 包默认只是声明。宿主应校验来源、版本、hash，运行前请求权限，把凭证放在宿主受控存储，把客户数据放在 Knowledge / workspace / Overlay，并禁止 `APP.md` 覆盖系统、开发者、policy 或 runtime 规则。
