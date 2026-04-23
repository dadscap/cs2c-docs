---
title: Sales
description: Recent sale history with live fetch on cache miss.
order: 13
---

## Recent Sales

### List Recent Sales
>
> Returns recent sale records for one item across the selected providers. Results are cached for 1 hour per item/provider pair. On a cache miss, the API fetches live data.

- Endpoint: GET `/sales`
- Tiers: `pro` · `quant`
- Rate Limit: Pro: 100/min · Quant: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | integer | **Required if `market_hash_name` is not provided.** Filter by item ID. If provided, it takes precedence over `market_hash_name` and `phase`. |
| market_hash_name | string | **Required if `item_id` is not provided.** Exact item name as it appears in inventory. Ignored when `item_id` is provided. |
| phase | string | Doppler/Gamma phase filter. One of: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`. Ignored when `item_id` is provided. |
| providers | string[] | Provider keys to include. Repeat to pass multiple values, for example `providers=buff163&providers=csfloat`. One of: `bitskins`, `buff163`, `c5`, `csfloat`, `csgo500`, `csgoempire`, `dmarket`, `youpin`. |
| currency | string | Target currency. 160+ ISO 4217 codes are supported. See `/fx` for the full list. Default: `USD`. |
| limit | integer | Maximum number of results to return. Capped at 50. Single-page only: no cursor or offset pagination. |

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

- `price` is returned in minor units of the response currency, for example `846105` = $8,461.05.
- `cache_status` shows whether each provider result came from cache (`hit`) or was fetched live (`miss`). Live fetches increase response time.
- `stickers`, `charms`, `float`, `paint_seed`, and `inspect` depend on the provider and may be `null`.
