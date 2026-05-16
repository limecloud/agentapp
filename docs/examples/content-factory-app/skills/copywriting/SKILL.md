---
name: copywriting
description: Generate publishable copy variants from an approved content idea, brand voice, and channel format. Use when users say "write copy for this idea", "draft 3 variants for LinkedIn", or "produce hero copy for the landing page".
---

# Copywriting

Produce channel-ready copy variants grounded in an approved idea, brand voice, and channel-specific format rules.

## When to Use

- A content idea has been approved and needs production-ready variants
- A user wants A/B variants per channel (LinkedIn, X, email subject, hero)
- A workflow needs human-reviewable drafts before publishing

## How It Works

1. Read approved `idea`, `audience`, `channel`, and `brand_brief`.
2. Draft 2-3 variants matching channel length, tone, and format rules.
3. Run anti-AI tone check against brand voice.
4. Return variants with `headline`, `body`, `cta`, `hashtags`.

## Inputs

- `idea` (required): approved content idea with hook
- `audience` (required): target persona
- `channel` (required): one of LinkedIn, X, email, hero, blog
- `brand_brief` (required): brand voice, tone, restricted claims
- `length_target` (optional): word count or character target

## Output Shape

```json
{
  "variants": [
    {
      "headline": "string",
      "body": "string",
      "cta": "string",
      "hashtags": ["string"],
      "channel": "string",
      "tone_score": 0.0
    }
  ]
}
```

## Red Flags

- ⚠️ Copy reuses generic AI phrasing ("In today's fast-paced world")
- ⚠️ Variants are too similar to each other
- ⚠️ Claims outside `brand_brief.policy`
- ⚠️ Length exceeds channel format limit

## Verification

- ✅ Variants pass `anti_ai_tone` eval
- ✅ Variants pass `fact_grounding` eval (no unsupported claims)
- ✅ Length fits channel format
- ✅ At least 2 variants are meaningfully different
