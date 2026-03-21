# API Reference

Reference for authentication, tiers, response conventions, and public endpoints.

## Base URL

```text
https://api.cs2c.app/v1
```

## Authentication

Market-data endpoints require an API key in the `Authorization` header:

```http
Authorization: Bearer your_api_key_here
```

Account watchlist and alert endpoints accept Bearer authentication with either an API key or a
session JWT. `POST /account/key/reset-ip` requires an API key.

### Getting an API Key

1. Sign up with OAuth.
2. Set and verify an email address associated with the account.
3. Save the initial, or reissue a new, API key through the account flow.
4. Use the key with `Authorization: Bearer {api_key}` when sending requests.

Constraints:

- Maximum 1 active API key per account
- Free-tier keys bind to the first source IP that uses them
- Email verification is required before initial API key issuance or reissue

## Rate Limits

Rate limits are enforced per API key based on the user's tier:

| Tier | Requests/Minute | Requests/Month | Max `limit` Param |
| ---- | --------------- | -------------- | ----------------- |
| `free` | 20 | 1,000 | 100 |
| `pro` | 100 | 50,000 | 1,000 |
| `quant` | 300 | 200,000 | None* |

* Unlimited streaming applies only to `POST /prices` and `POST /bids`. Most endpoints still use
per-route caps.

`429` responses can include:

```http
Retry-After: 12345
X-RateLimit-Limit: 50000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 12345
X-RateLimit-Tier: pro
```

Monthly quota is charged only on public core market-data endpoints. Non-core account, billing,
verification, recovery, and alert/watchlist routes keep burst protection but do not consume the
advertised monthly quota.

## Response Conventions

- Most list endpoints return `items` plus `meta` and `pagination` when relevant.
- Cursor endpoints intentionally use `pagination.total = -1`.
- Price fields such as `lowest_ask`, `highest_bid`, and `price` are returned in minor units of the
  response currency.
- `providers`, `providers_buy`, and `providers_sell` are repeatable query parameters.
- `provider` is a single provider-key string.

## Error Handling

Errors always return a stable machine-readable `code` plus a human-readable `detail`.

| Status | Meaning |
| ------ | ------- |
| `400` | Bad request |
| `401` | Missing or invalid API key |
| `403` | Valid credentials but insufficient permissions |
| `404` | Resource not found |
| `409` | Conflict with current account or resource state |
| `422` | Validation error |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `503` | Service temporarily unavailable |

Common error payload:

```json
{
  "code": "AUTH_INVALID_API_KEY",
  "detail": "Invalid API key"
}
```

Common codes:

- `AUTH_INVALID_API_KEY`
- `AUTH_API_KEY_REVOKED`
- `AUTH_ACCOUNT_DISABLED`
- `AUTH_FREE_TIER_IP_RESTRICTED`
- `RATE_LIMIT_EXCEEDED`
- `RATE_LIMIT_MONTHLY_QUOTA_EXCEEDED`
- `PRICES_INDEX_UNAVAILABLE`
- `BIDS_INDEX_UNAVAILABLE`
- `VALIDATION_ERROR`

## POST `/account/key/reset-ip`

**Parameters:**

No parameters

**Notes:**

- Available to: all tiers
- Authentication: Bearer API key
- Free tier: rebinds the active API key to the caller's current IP
- Pro/Quant: succeeds but does not change account state
- Cooldown: once every 24 hours per account
- Monthly quota: exempt

---

## GET `/prices`

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

## POST `/prices`

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

## GET `/prices/history`

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

## GET `/prices/candles`

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

---

## GET `/bids`

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

## POST `/bids`

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

## GET `/sales`

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

---

## GET `/items`

**Parameters:**

- `q` | `string` | Search by name substring (case-insensitive).
- `item_id` | `integer` | Exact item ID match.
- `market_hash_name` | `string` | Exact market hash name match (case-insensitive).
- `item_type` | `string` | Exact item type match (case-insensitive).
- `item_subtype` | `string` | Exact item subtype match (case-insensitive).
- `weapon_type` | `string` | Exact weapon type match (case-insensitive).
- `base_name` | `string` | Exact base name match (case-insensitive).
- `skin_name` | `string` | Exact skin name match (case-insensitive).
- `wear_name` | `string` | Exact wear name match (case-insensitive).
- `phase` | `string` | Exact phase match (case-insensitive).
- `collection` | `string` | Exact collection match (case-insensitive).
- `crates` | `string` | Filter by crate names. Repeat the parameter or pass multiple values as supported by your client.
- `rarity_name` | `string` | Exact rarity name match (case-insensitive).
- `rarity_color` | `string` | Exact rarity color hex or alias match (case-insensitive).
- `style_name` | `string` | Exact style name match (case-insensitive).
- `is_stattrak` | `boolean` | Filter by StatTrak items.
- `is_souvenir` | `boolean` | Filter by Souvenir items.
- `limit` | `integer` | `1-1000` | Maximum number of returned items when provided. Omit to return the full matched payload.

**Notes:**

- Available to: `free` / `pro` / `quant`
- Authentication: Bearer API key
- If `limit` is omitted, `/items` returns all matched items in a single response
- Item payloads can include optional `supply`

---

## GET `/items/market-ids`

**Parameters:**

No parameters

**Notes:**

- Available to: `free` / `pro` / `quant`
- Authentication: Bearer API key
- Returns a mapping of every `market_hash_name` to provider-native item identifiers

---

## GET `/providers`

**Parameters:**

- `provider` | `Enum[provider key]` | Optional single provider-key filter. Omit to return all providers.

**Notes:**

- Available to: `free` / `pro` / `quant`
- Authentication: Bearer API key
- `health.total_value` is in the provider's native `default_currency`
- `health.total_value_usd` is the same value normalized to USD

---

## GET `/fx`

**Parameters:**

No parameters

**Notes:**

- Available to: `free` / `pro` / `quant`
- Authentication: Bearer API key
- Returns the current FX table with base currency `USD`

---

## GET `/market/arbitrage`

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

## GET `/market/indicators`

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
- Volume-dependent indicators use depletion-based candle volume internally
- Response field name `close_price_usd` is retained for compatibility even when `currency` is not `USD`

---

## GET `/market/items/{item_id}`

**Path Variables:**

- `item_id` | `integer` | Normalized item ID to analyze.

**Parameters:**

- `timeframe` | `Literal["1h", "24h", "7d", "30d"]` | `default: 24h` | Analysis time window.

**Notes:**

- Available to: `pro` / `quant`
- Authentication: Bearer API key
- Returns item-level analytics and liquidity summary data
- `timeframe=1h` reuses the `24h` liquidity horizon

---

## POST `/account/watchlist`

**Parameters:**

No parameters

**Request Body:**

- `item_id` | `integer` | Use this for a single-item add.
- `item_ids` | `integer[]` | Use this for a batch add.

**Notes:**

- Available to: tiers with watchlist access
- Authentication: Bearer API key or session JWT
- Every submitted item ID must exist in `/v1/items`
- Batch creates are all-or-nothing
- Duplicate saves return `409`
- Hitting the tier watchlist cap returns `409`

---

## GET `/account/watchlist`

**Parameters:**

- `limit` | `integer` | `default: 50` | Page size. Clamped to `1..200`.
- `offset` | `integer` | `default: 0` | Zero-based starting position.
- `search` | `string` | Exact numeric `item_id` match or case-insensitive item-name substring.

**Notes:**

- Available to: tiers with watchlist access
- Authentication: Bearer API key or session JWT
- Ordered by newest saved first
- Offset pagination with a real `pagination.total`

---

## DELETE `/account/watchlist/{item_id}`

**Path Variables:**

- `item_id` | `integer` | Normalized catalog item ID to remove from the default watchlist.

**Parameters:**

No parameters

**Notes:**

- Available to: tiers with watchlist access
- Authentication: Bearer API key or session JWT
- This path uses the catalog item ID, not the watchlist entry UUID
- Returns `404` if that item is not currently saved by the authenticated user

---

## POST `/account/alerts`

**Parameters:**

No parameters

**Request Body:**

- `item_id` | `integer` | Normalized catalog item ID for the alert target.
- `kind` | `Literal["price_below", "price_above", "spread_exceeds"]` | Alert kind.
- `threshold_value` | `decimal string` | Threshold value. Must be greater than zero.
- `threshold_currency` | `string` | Currency for price alerts. Omit for `spread_exceeds`.
- `is_enabled` | `boolean` | Whether the alert is enabled at creation time.

**Notes:**

- Available to: tiers with alert access
- Authentication: Bearer API key or session JWT
- `price_below` and `price_above` compare against the current best ask
- `spread_exceeds` compares percentage spread: `((best_ask - best_bid) / best_ask) * 100`
- `threshold_currency` defaults to the account preferred currency for price alerts when omitted. Accounts that have not changed it use USD
- alert emails are enabled by default and can be disabled in account preferences
- verified email is required only for enabled alerts
- Disabled alerts can be created first and enabled later
- Enabled-alert count is tier-capped

---

## GET `/account/alerts`

**Parameters:**

- `limit` | `integer` | `default: 50` | Page size. Clamped to `1..200`.
- `offset` | `integer` | `default: 0` | Zero-based starting position.
- `search` | `string` | Exact numeric `item_id` match or case-insensitive item-name substring.

**Notes:**

- Available to: tiers with alert access
- Authentication: Bearer API key or session JWT
- Ordered by newest created first
- Offset pagination with a real `pagination.total`

---

## PATCH `/account/alerts/{alert_id}`

**Path Variables:**

- `alert_id` | `uuid` | Alert definition ID.

**Parameters:**

No parameters

**Request Body:**

- `threshold_value` | `decimal string` | Optional updated threshold value. Must be greater than zero if supplied.
- `threshold_currency` | `string` | Optional updated currency for price alerts. Ignored for spread alerts.
- `is_enabled` | `boolean` | Optional enabled-state change.

**Notes:**

- Available to: tiers with alert access
- Authentication: Bearer API key or session JWT
- Provide at least one request-body field
- Enabling an alert re-runs the same checks as creation
- Returns `404` if the alert does not belong to the authenticated user

---

## DELETE `/account/alerts/{alert_id}`

**Path Variables:**

- `alert_id` | `uuid` | Alert definition ID.

**Parameters:**

No parameters

**Notes:**

- Available to: tiers with alert access
- Authentication: Bearer API key or session JWT
- Returns `404` if the alert does not exist for the authenticated user

---

## GET `/account/alerts/events`

**Parameters:**

- `limit` | `integer` | `default: 50` | Cursor page size. Clamped to `1..100`.
- `cursor` | `string` | Opaque next-page cursor from a previous response.

**Notes:**

- Available to: tiers with alert access
- Authentication: Bearer API key or session JWT
- Ordered by newest first
- Cursor endpoint with `pagination.total = -1`
- Delivery rows currently reflect email delivery attempts only
