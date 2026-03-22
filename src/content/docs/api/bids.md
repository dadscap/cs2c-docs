---
title: Bids
description: Current buy orders and full-catalog bid streaming.
order: 12
---

## GET /bids

**Parameters:**

- `item_id` | `integer` | Filter by specific item ID. Takes precedence over `market_hash_name` and `phase` if provided.
- `market_hash_name` | `string` | Exact item name as it appears in inventory.
- `phase` | `string` | Doppler/Gamma phase filter. Can be used without `market_hash_name`.
- `providers` | `Enum["buff163", "buffmarket", "csfloat", "dmarket", "ecosteam", "marketcsgo", "steam", "waxpeer", "whitemarket"]` | Buy-order providers to include. Repeat this parameter to pass multiple providers.
- `currency` | `string` | `default: USD` | Target currency. Use `/fx` for the supported ISO 4217 codes.
- `limit` | `integer` | Pro/Quant: `1-1000` | Results per page.
- `offset` | `integer` | `default: 0` | Pagination offset.

**Notes:**

- Available to: `pro` / `quant`
- Authentication: Bearer API key
- Indexed-only runtime path with no DB fallback
- `highest_bid` is returned in minor units of the response currency

---

## POST /bids

**Parameters:**

No parameters

**Notes:**

- Available to: `quant`
- Authentication: Bearer API key
- Streams the full live bids snapshot as `application/x-ndjson`
- Requires a real `sk_*` API key; session JWTs are not accepted
- Fixed `USD` output
- No filters, request body, pagination, or alternate currencies
- One `BuyOrderItem` JSON object per line
- Stable snapshot captured at request start
- Per-API-key cooldown: 5 minutes

---

## POST /bids/batch

**Parameters:**

- `item_ids` | `array[integer]` | Required. Array of item IDs to fetch. Must contain 1–100 items.
- `providers` | `array[Enum[provider key]]` | Optional. Provider keys to include. If omitted, queries all providers.
- `currency` | `string` | `default: USD` | Target currency. Use `/fx` for the supported ISO 4217 codes.

**Request Body Example:**

```json
{
  "item_ids": [1, 2, 3],
  "providers": ["steam", "buff163"],
  "currency": "USD"
}
```

**Response:**

Returns per-item bid quotes from each queried provider, grouped by item_id.

**Notes:**

- Available to: `quant`
- Authentication: Bearer API key
- `highest_bid` is returned in minor units of the response currency
- No `url` or `link` fields in batch responses (data-only)
- Items not found in any provider are listed in `items_not_found` array
- Max batch size: 100 items per request
