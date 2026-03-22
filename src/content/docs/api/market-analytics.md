---
title: Market Analytics
description: Arbitrage scanning, technical indicators, and item-level analytics.
order: 15
---

## GET /market/arbitrage

**Parameters:**

- `min_spread_pct` | `number` | `default: 1.0` | Minimum percentage spread to include.
- `providers_buy` | `Enum[provider key]` | Buy-side provider filters. Repeat this parameter to pass multiple values.
- `providers_sell` | `Enum["buff163", "buffmarket", "csfloat", "dmarket", "ecosteam", "marketcsgo", "steam", "waxpeer", "whitemarket"]` | Sell-side provider filters. Repeat this parameter to pass multiple values.
- `limit` | `integer` | Quant only | Results per page.
- `cursor` | `string` | Cursor for keyset pagination. Use `next_cursor` from the previous response.

**Notes:**

- Available to: `quant`
- Authentication: Bearer API key
- Cursor endpoint with `pagination.total = -1`
- Buy-side providers can be any marketplace provider; sell-side providers are limited to providers with buy orders

---

## GET /market/indicators

**Parameters:**

- `item_id` | `integer` | Filter by specific item ID. Takes precedence over `market_hash_name` and `phase` if provided.
- `market_hash_name` | `string` | Exact item name as it appears in inventory.
- `phase` | `string` | Doppler/Gamma phase filter.
- `provider` | `Enum[provider key]` | Single provider key string. Required for indicator computation.
- `interval` | `Literal["1h", "1d"]` | Candle interval for indicator computation.
- `currency` | `string` | `default: USD` | Output currency for price-level indicators.

**Notes:**

- Available to: `quant`
- Authentication: Bearer API key
- Provide either `item_id` or `market_hash_name`, together with `provider`
- This endpoint computes indicators from composite candle data across all providers
- Volume-dependent indicators use depletion-based candle volume internally
- Response field name `close_price_usd` is retained for compatibility even when `currency` is not `USD`

---

## GET /market/items/{item_id}

**Path Variables:**

- `item_id` | `integer` | Normalized item ID to analyze.

**Parameters:**

- `timeframe` | `Literal["1h", "24h", "7d", "30d"]` | `default: 24h` | Analysis time window.

**Notes:**

- Available to: `pro` / `quant`
- Authentication: Bearer API key
- Returns item-level analytics and liquidity summary data
- `timeframe=1h` reuses the `24h` liquidity horizon
