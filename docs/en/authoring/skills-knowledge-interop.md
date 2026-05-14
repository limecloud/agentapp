---
title: Skills and Knowledge interop
---

# Skills and Knowledge interop

A Builder Skill may produce Agent Knowledge packs used by the app. Runtime consumption must still load Knowledge as fenced data. The app should reference both the Builder Skill and the expected Knowledge type without merging their trust models.

## Checklist

- Keep declarations machine-readable.
- Keep procedures in Agent Skills.
- Keep facts in Agent Knowledge.
- Keep execution in the host runtime.
- Attach app provenance to projected objects.
