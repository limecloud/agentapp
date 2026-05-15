---
title: 参考 CLI
description: agentapp-ref 提供的验证、投影和检查命令。
---

# 参考 CLI

`agentapp-ref` 是 Agent App package contract 的参考命令行工具。它刻意保持小范围：校验 package shape、读取 manifest properties、输出 catalog metadata、生成 host projection、检查静态 readiness。

它不运行 Agent，也不执行 App worker。

## 运行方式

仓库内：

```bash
npm run cli -- validate docs/examples/content-factory-app
```

发布到 npm 后：

```bash
npx agentapp-ref@0.3.0 validate ./my-agent-app
```

## 命令

| 命令 | 作用 |
| --- | --- |
| `validate <app>` | 校验 `APP.md` 结构和本地引用。 |
| `read-properties <app>` | 以 JSON 输出 frontmatter。 |
| `to-catalog <app>` | 输出紧凑 catalog metadata。 |
| `project <app>` | 输出带 provenance 的 host catalog projection。 |
| `readiness <app>` | 不运行 Agent，只做静态 setup readiness。 |

## Validate

```bash
npm run cli -- validate docs/examples/content-factory-app
```

适合发布前 CI 使用。它能发现缺必需字段、不支持 status、未知 appType、v0.3 无效 entry kind、本地引用缺失、可执行入口缺少 permissions 等问题。

## Project

```bash
npm run cli -- project docs/examples/content-factory-app
```

Projection 输出 app summary、entries、capability requirements、storage、services、workflows、permissions、requirements 和 provenance。宿主可以用它作为自己 projection 层的参考。

## Readiness

```bash
npm run cli -- readiness docs/examples/content-factory-app
```

Readiness 报告 required 和 optional setup。结构有效的 package 可能返回 `needs-setup`，表示宿主还没满足必需 Skill、Knowledge、Tool、service 或 eval。

## Exit 行为

CLI 将 JSON 写入 stdout。结构失败时返回非零退出码。Warning 不一定让 `ok` 变成 false。

## CLI 不是什么

CLI 不是完整宿主 runtime、安全沙箱、registry、installer、完整 JSON Schema validator，也不是 Agent executor。它是 package shape 和静态宿主语义的共享参考。

## 推荐自动化方式

CLI 适合放在三个位置：

1. Package author CI：拒绝无效 manifest 和缺失本地引用。
2. Registry ingestion：对比 projection output、package hash 和 release metadata。
3. Host tests：保证 projection 和 readiness 行为在宿主变化时保持稳定。

一个简单 package check 可以运行：

```bash
npm run cli -- validate docs/examples/content-factory-app
npm run cli -- project docs/examples/content-factory-app > /tmp/content-factory.projection.json
npm run cli -- readiness docs/examples/content-factory-app > /tmp/content-factory.readiness.json
```

## 输出契约预期

- 相同输入下 JSON output 应保持确定性。
- Error 应能行动，并关联到 manifest key 或本地路径。
- Warning 应指出 production-readiness gaps，但不阻塞 draft exploration。
- Readiness 应区分缺 host capabilities、缺 user setup 和缺 package files。
