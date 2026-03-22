---
title: Sales
description: Recent transaction history with live fetch on cache miss.
order: 13
---

## Recent Sales

### List Recent Sales
>
> Returns recent sale transaction records for a specific item across selected providers, fetched live on cache miss with a 1-hour TTL per item+provider pair.

- Endpoint: GET `/sales`
- Tiers: `pro` · `quant`
- Rate Limit: Pro: 100/min · Quant: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | integer | Filter by specific item ID. Takes precedence over `market_hash_name` and `phase` if provided. |
| market_hash_name | string | Exact item name as it appears in inventory. Ignored when `item_id` is provided. |
| phase | string | Doppler/Gamma phase filter. One of: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`. Ignored when `item_id` is provided. |
| providers | string[] | Provider keys to include. Repeat to pass multiple, e.g. `providers=buff163&providers=csfloat`. One of: `bitskins`, `buff163`, `buffmarket`, `c5`, `csfloat`, `csgo500`, `csgoempire`, `dmarket`, `skinbaron`, `youpin`. |
| currency | string | Target currency. 160+ ISO 4217 codes supported (see `/fx` for the full list). Default: `USD`. |
| limit | integer | Results per page. Maximum 50 per page. |

**Response Example:**

```json
{
    "meta": {...},
    "items": [
        {
            "date": "2026-03-13T01:31:47.752001Z",
            "provider": "csfloat",
            "price": 846105,
            "currency": "USD",
            "item_id": 6154,
            "market_hash_name": "AWP | Gungnir (Field-Tested)",
            "phase": null,
            "float": 0.2155461460351944,
            "paint_seed": 815,
            "stickers": [
                {
                    "name": "Sticker | zevy | Budapest 2025",
                    "slot": 2,
                    "wear": 0.74
                },
                {
                    "name": "Sticker | zont1x | Budapest 2025",
                    "slot": 0,
                    "wear": 0.73
                }
            ],
            "charms": [
                {
                    "name": "Charm | Semi-Precious",
                    "pattern_id": 66122
                }
            ],
            "inspect": {
                "in_game": "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20...",
                "screenshot_front": "https://csfloat.pics/m/1640912832771024139/playside.png?v=3",
                "screenshot_back": "https://csfloat.pics/m/1640912832771024139/backside.png?v=3"
            }
        },
        {
            "date": "2026-03-05T16:00:00+00:00",
            "provider": "buff163",
            "price": 942052,
            "currency": "USD",
            "item_id": 6154,
            "market_hash_name": "AWP | Gungnir (Field-Tested)",
            "phase": null,
            "float": 0.15253503620624542,
            "paint_seed": 105,
            "stickers": null,
            "charms": [
                {
                    "name": "Charm | Semi-Precious",
                    "pattern_id": 79972
                }
            ],
            "inspect": {
                "in_game": "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20...",
                "screenshot_front": "https://spect.fp.ps.netease.com/file/69aadbc88046f513e7f7de78TiWERWCN07",
                "screenshot_back": "https://spect.fp.ps.netease.com/file/69aadbc88046f513e7f7de78TiWERWCN07"
            }
        }
    ],
    "cache_status": {...}
}
```

- `price` is returned in minor units of the response currency (e.g. `846105` = $8,461.05).
- `cache_status` shows whether each provider's result was served from cache (`hit`) or fetched live (`miss`). Live fetches increase response time.
- `stickers`, `charms`, `float`, `paint_seed`, and `inspect` are provider-dependent and may be `null`.

---
