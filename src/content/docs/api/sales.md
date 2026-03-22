---
title: Sales
description: Recent transaction history with live fetch on cache miss.
order: 13
---

## GET /sales

**Parameters:**

- `item_id` | `integer` | Filter by specific item ID. Takes precedence over `market_hash_name` and `phase` if provided.
- `market_hash_name` | `string` | Exact item name as it appears in inventory. Ignored when `item_id` is provided.
- `phase` | `string` | Doppler/Gamma phase filter. Ignored when `item_id` is provided.
- `providers` | `Enum["bitskins", "buff163", "buffmarket", "c5", "csfloat", "csgo500", "csgoempire", "dmarket", "skinbaron", "youpin"]` | Provider keys to query. Repeat this parameter to pass multiple providers.
- `currency` | `string` | `default: USD` | Target currency. Use `/fx` for the supported ISO 4217 codes.
- `limit` | `integer` | Pro/Quant: `1-50` | Results per page.

**Notes:**

- Available to: `pro` / `quant`
- Authentication: Bearer API key
- Live-query endpoint on cache miss; response time depends on provider/network behavior
- Sales cache TTL is 1 hour per `item_id + provider`
- `price` is returned in minor units of the response currency
