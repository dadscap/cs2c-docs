---
title: Prices
description: Best-ask snapshots, historical records, candles, and full-catalog streaming.
order: 11
---

## GET /prices

**Parameters:**

- `item_id` | `integer` | Filter by specific item ID. Takes precedence over `market_hash_name` and `phase` if provided.
- `market_hash_name` | `string` | Exact item name as it appears in inventory, e.g. `★ Gut Knife | Fade (Factory New)`.
- `phase` | `string` | Doppler/Gamma phase filter. Can be used without `market_hash_name`.
- `providers` | `Enum[provider key]` | Provider keys to include. Repeat this parameter to pass multiple providers, e.g. `providers=steam&providers=buff163`.
- `currency` | `string` | `default: USD` | Target currency. Use `/fx` for the supported ISO 4217 codes.
- `limit` | `integer` | Free: `1-100`, Pro/Quant: `1-1000` | Results per page. Defaults to the caller's effective tier cap.
- `offset` | `integer` | `default: 0` | Pagination offset.

**Notes:**

- Available to: `free` / `pro` / `quant`
- Authentication: Bearer API key
- Indexed-only runtime path with no DB fallback
- `lowest_ask` is returned in minor units of the response currency
- `link` is the tracked redirect URL; `url` is the direct marketplace URL and is returned only for paid tiers

---

## POST /prices

**Parameters:**

No parameters

**Notes:**

- Available to: `quant`
- Authentication: Bearer API key
- Streams the full live prices snapshot as `application/x-ndjson`
- Requires a real `sk_*` API key; session JWTs are not accepted
- Fixed `USD` output
- No filters, request body, pagination, or alternate currencies
- One `MarketItem` JSON object per line
- Stable snapshot captured at request start
- Per-API-key cooldown: 5 minutes

---

## GET /prices/history

**Parameters:**

- `item_id` | `integer` | Filter by specific item ID. Takes precedence over `market_hash_name` and `phase` if provided.
- `market_hash_name` | `string` | Exact item name as it appears in inventory.
- `phase` | `string` | Doppler/Gamma phase filter. Can be used without `market_hash_name`.
- `provider` | `Enum[provider key]` | Single provider key string, e.g. `provider=steam`.
- `start` | `date` or `date-time` | Inclusive ISO 8601 timestamp (`YYYY-MM-DD` or `YYYY-MM-DDThh:mm:ss`).
- `end` | `date` or `date-time` | Exclusive ISO 8601 timestamp (`YYYY-MM-DD` or `YYYY-MM-DDThh:mm:ss`).
- `currency` | `string` | `default: USD` | Target currency. Use `/fx` for the supported ISO 4217 codes.
- `limit` | `integer` | Pro/Quant: `1-1000` | Results per page.
- `cursor` | `string` | Cursor for keyset pagination. Use `next_cursor` from the previous response.

**Notes:**

- Available to: `pro` / `quant`
- Authentication: Bearer API key
- `price` is returned in minor units of the response currency
- `pagination.total = -1` is intentional on this cursor endpoint

---

## GET /prices/candles

**Parameters:**

- `item_id` | `integer` | Filter by specific item ID. Required if `market_hash_name` is not provided.
- `market_hash_name` | `string` | Exact item name as it appears in inventory. Required if `item_id` is not provided.
- `phase` | `string` | Doppler/Gamma phase filter.
- `start` | `date-time` | Inclusive ISO 8601 timestamp.
- `end` | `date-time` | Exclusive ISO 8601 timestamp. Defaults to now when omitted.
- `lookback` | `string` | Duration shorthand such as `7d` or `30d`. Overrides `start` when provided.
- `interval` | `Literal["5m", "1h", "1d"]` | `default: 1h` | Candle interval.
- `fill` | `boolean` | `default: false` | Forward-fill empty buckets.
- `currency` | `string` | `default: USD` | Target currency. Use `/fx` for the supported ISO 4217 codes.
- `limit` | `integer` | Free: `1-100`, Pro/Quant: `1-1000` | Results per page.
- `cursor` | `string` | Cursor for keyset pagination. Use `next_cursor` from the previous response.

**Notes:**

- Available to: `free` / `pro` / `quant`
- Authentication: Bearer API key
- Composite OHLCV candles across all providers for the resolved item
- `o` and `c` are unweighted averages across provider snapshots in the response currency
- `l` is the minimum provider low
- `h` is capped at `median(provider_highs) * 1.5`
- `v` is the summed close-side listing count across providers
