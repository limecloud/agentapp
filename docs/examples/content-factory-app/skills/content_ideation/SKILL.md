---
name: content-ideation
description: Generate content ideas and angles from a brand brief, audience description, and channel constraints. Use when users say "give me content ideas", "brainstorm angles for this campaign", or "find new content directions for the brand".
---

# Content Ideation

Generate content ideas, angles, and concept variations grounded in brand voice, audience, and channel constraints.

## When to Use

- User asks for new content ideas, angles, or campaigns
- A planning workflow needs candidate scenarios before producing copy
- Existing content is stale and needs fresh angles

## How It Works

1. Read the brand brief, audience description, and channel constraints from `lime.knowledge` or workflow input.
2. Generate 5-10 candidate content angles, each with hook, value proposition, and channel fit.
3. Cluster overlapping ideas; surface 3-5 differentiated directions.
4. Return structured output with `idea`, `hook`, `audience`, `channel`, `rationale`.

## Inputs

- `brand_brief` (required): brand voice, tone, restricted words, claims policy
- `audience` (required): target persona, pain points, jobs-to-be-done
- `channels` (optional): channel list with format constraints
- `existing_content` (optional): list of recent posts to avoid repetition

## Output Shape

```json
{
  "ideas": [
    {
      "idea": "string",
      "hook": "string",
      "audience": "string",
      "channel": "string",
      "rationale": "string"
    }
  ]
}
```

## Red Flags

- ⚠️ Ideas reuse banned words from brand brief
- ⚠️ Ideas drift from declared audience
- ⚠️ All ideas collapse onto one angle (lack of diversification)

## Verification

- ✅ At least 3 differentiated angles
- ✅ Each idea references a real brand value or audience pain
- ✅ No banned words; no claims outside policy
