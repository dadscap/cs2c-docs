# API Reference

Complete API documentation for the CS2C-API service.

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
  - [Getting an API Key](#getting-an-api-key)
- [Rate Limiting](#rate-limiting)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Items](#items)
  - [Providers](#providers)
  - [Prices](#prices)
  - [Market Intelligence](#market-intelligence)
  - [Buy Orders](#buy-orders)
  - [Recent Sales](#recent-sales)
- [Schemas](#schemas)
- [Code Examples](#code-examples)
- [Related Documentation](#related-documentation)

## Base URL

```text
https://api.cs2c.app
```

## Authentication

Endpoints require authentication using an API key via the `Authorization` header:

```http
Authorization: Bearer your_api_key_here
```

## Getting an API Key

1. Sign up with OAuth.
2. Set and verify an email address associated with the account.
3. Save the initial, or reissue a new, API key through the account flow.
4. Use the key with `Authorization: Bearer {api_key}` when sending requests.

Max 1 API key per account.
Keys on the free-tier are bound to a single IP source bind.

## Rate Limiting

Rate limits are enforced per API key based on the user's tier:

| Tier    | Requests/Minute | Requests/Month | Max `limit` Param |
| ------- | --------------- | -------------- | ----------------- |
| `free`  | 20              | 1,000          | 100               |
| `pro`   | 100             | 50,000         | 1,000             |
| `quant` | 300             | 200,000        | 1,000             |

**Rate Limit Headers:**

```http
X-RateLimit-Tier: pro
```

Quota-exceeded (`429`) responses include additional headers:

```http
Retry-After: 12345
X-RateLimit-Limit: 50000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 12345
```

**Rate Limit Exceeded Response:**

```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "detail": "Too Many Requests"
}
```

Monthly quota violations use:

```json
{
  "code": "RATE_LIMIT_MONTHLY_QUOTA_EXCEEDED",
  "detail": "Monthly quota exceeded (50000/50000 requests)."
}
```

Monthly quota is charged only on public core market-data endpoints. Non-core account, billing,
verification, and recovery routes keep burst protection but do not consume the advertised monthly
quota.

## Response Format

All responses follow a consistent JSON structure:

**Success Response:**

```json
{
  "items": [...],
  "count": 100,
  "limit": 50,
  "offset": 0
}
```

**Error Response:**

```json
{
  "code": "AUTH_INVALID_API_KEY",
  "detail": "Invalid API key"
}
```

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
| ---- | ------- | ----------- |
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 403 | Forbidden | Valid key but insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Codes

Error responses include a stable machine-readable `code` plus a human-readable `detail`.

| Code | Description | Resolution |
| ---- | ----------- | ---------- |
| `AUTH_INVALID_API_KEY` | API key is invalid | Check your API key |
| `AUTH_API_KEY_REVOKED` | API key was revoked | Create a new key via account endpoints |
| `AUTH_ACCOUNT_DISABLED` | Account is disabled | Contact support/admin |
| `AUTH_FREE_TIER_IP_RESTRICTED` | Free-tier key used from a different IP | Use the original IP or upgrade tier |
| `RATE_LIMIT_MONTHLY_QUOTA_EXCEEDED` | Monthly quota exceeded | Wait for reset or upgrade tier |
| `PRICES_INDEX_UNAVAILABLE` | Indexed prices data unavailable | Retry shortly |
| `BIDS_INDEX_UNAVAILABLE` | Indexed bids data unavailable | Retry shortly |
| `VALIDATION_ERROR` | Request validation failed | Check request parameters |

### Account

#### POST /v1/account/key/reset-ip

Rebind the active API key to the caller's current IP.

- Free tier: immediately replaces the previous bound IP.
- Pro/Quant: succeeds but does not change account state.
- Cooldown: once every 24 hours per account.
- Authentication: Bearer API key or session JWT.
- Monthly quota: exempt.

## Endpoints

**Provider Parameter Naming Convention:**

- `providers` / `providers_buy` / `providers_sell` (plural): repeatable query params with provider-key enum values (for example `&providers=steam&providers=skinport`).
- `provider` (singular): one provider key as a single string (for example `&provider=steam`).

---

### Items

#### GET /v1/items

Available to: `free`/`pro`/`quant`

Search and retrieve items from the catalog.

**Query Parameters:**

| Parameter          | Type          | Required | Default  | Description                                                       |
| ------------------ | ------------- | -------- | -------- | ----------------------------------------------------------------- |
| `q`                | string        | No       | -        | Search by market hash name substring (case-insensitive)           |
| `item_id`          | integer       | No       | -        | Exact item ID match                                               |
| `market_hash_name` | string        | No       | -        | Exact market hash name match (case-insensitive)                   |
| `item_type`        | string        | No       | -        | Exact item type match (case-insensitive)                          |
| `item_subtype`     | string        | No       | -        | Exact item subtype match (case-insensitive)                       |
| `weapon_type`      | string        | No       | -        | Exact weapon type match (case-insensitive)                        |
| `base_name`        | string        | No       | -        | Exact base name match (case-insensitive)                          |
| `skin_name`        | string        | No       | -        | Exact skin name match (case-insensitive)                          |
| `wear_name`        | string        | No       | -        | Exact wear name match (case-insensitive)                          |
| `phase`            | string        | No       | -        | Exact phase match (case-insensitive)                              |
| `collection`       | string        | No       | -        | Exact collection match (case-insensitive)                         |
| `crates`           | array[string] | No       | -        | Filter by crate names (matches any value)                         |
| `rarity_name`      | string        | No       | -        | Exact rarity name match (case-insensitive)                        |
| `rarity_color`     | string        | No       | -        | Exact rarity color match (case-insensitive)                       |
| `style_name`       | string        | No       | -        | Exact style name match (case-insensitive)                         |
| `is_stattrak`      | boolean       | No       | -        | Filter by StatTrak items                                          |
| `is_souvenir`      | boolean       | No       | -        | Filter by Souvenir items                                          |
| `limit`            | integer       | No       | 100/1000 | Results per page (tier-capped: `free` = 100, `pro`/`quant` = 1000 |
| `offset`           | integer       | No       | 0        | Pagination offset                                                 |

**Example Request:**

```bash
curl -H "Authorization: Bearer your_key" \
  "https://api.cs2c.app/v1/items?item_type=Agent&collection=Operation%20Riptide%20Agents&limit=10"
```

**Example Response:**

```json
{
    "items": [
        {
            "item_id": 1,
            "market_hash_name": "Bloody Darryl The Strapped | The Professionals",
            "phase": null,
            "item_type": "Agent",
            "item_subtype": "Terrorist",
            "weapon_type": null,
            "base_name": "Bloody Darryl The Strapped",
            "skin_name": "The Professionals",
            "wear_name": null,
            "def_index": "4613",
            "paint_index": null,
            "collection": "Operation Riptide Agents",
            "crates": [
                ""
            ],
            "rarity_name": "Superior",
            "rarity_color": "d32ce6",
            "style_name": null,
            "is_stattrak": false,
            "is_souvenir": false,
            "min_float": null,
            "max_float": null,
            "image_url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIa-2lmxU-LR0dnuNm6E8Vl45Iv181z1fgn8oYby8iRe_OGnZ6psLM-FD3WWlKAhtLhqHXDilxgm4z7dztesJH2SbgApCMchFrQNsRSxw4XhYeK0swbYlcsbmucxTysR",
            "supply": null
        }
  ...
    ],
    "pagination": {
        "limit": 1000,
        "offset": 0,
        "total": 37340,
        "has_next": true,
        "has_prev": false,
        "next_cursor": null
    }
}
```

---

#### GET /v1/items/market-ids

Available to: `free`/`pro`/`quant`

Return a mapping of every `market_hash_name` to its provider-specific IDs (e.g. `buff163_goods_id`, `csfloat_id`, `steam_nameid`). Useful for translating catalog items to marketplace-native identifiers without doing the lookup yourself.

No query parameters.

**Example Request:**

```bash
curl -H "Authorization: Bearer your_key" \
  "https://api.cs2c.app/v1/items/market-ids"
```

**Example Response:**

```json
{
    "items": {
        "Bloody Darryl The Strapped | The Professionals": {
            "c5game_id": 914665027831566336,
            "youpin_id": 101006,
            "buff163_goods_id": 871457,
            "haloskins_id": 914665027831566336,
            "steam_nameid": 176262928,
            "csfloat_id": 4613,
            "marketcsgo_id": 45234,
            "bitskins_id": 4138,
            "buffmarket_goods_id": 20030,
            "ecosteam_classid": 4738189084,
            "pirateswap_mhnc": -1747201319,
            "csmoney_nameid": 1087079,
            "shadowpay_item_id": 40283
        }
        ...
    }
}
```

---

### Providers

#### GET /v1/providers

Available to: `free`/`pro`/`quant`

List all providers with health status, fees, and market coverage.

`health.total_value` is the estimated aggregate listing value in each provider's native currency
(`default_currency`), while `health.total_value_usd` is the same value normalized to USD using current FX rates.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |
| `provider` | string | No | - | Filter to a single provider key (e.g., `skinport`) |

**Example Request:**

```bash
curl -H "Authorization: Bearer your_key" \
  "https://api.cs2c.app/v1/providers"
```

**Example Response:**

```json
{
    "Youpin898": {
        "key": "youpin",
        "code": "YOUP",
        "market_type": "P2P",
        "default_currency": "CNY",
        "fees": {
            "sell_fee": 0.01,
            "insta_sell_fee": null,
            "trading_spread_fee": null
        },
        "features": {
            "has_buy_orders": false,
            "has_recent_sales": true
        },
        "health": {
            "status": "up",
            "last_checked_at": "2026-03-08T21:16:03.377733+00:00",
            "total_offers": 3081980,
            "unique_items": 25863,
            "market_coverage": 69.26,
            "total_value": 132256661633,
            "total_value_usd": 19116472009
        }
    }
}
```

**Error Codes:**

| Code | Description |
| ---- | ----------- |
| 404 | Provider key not found (when `provider` filter is specified) |

---

### Prices

#### GET /v1/prices

Available to: `free`/`pro`/`quant`

Retrieve current lowest-ask listings across providers.

`lowest_ask` is returned as minor units of the response currency (for example USD cents when `currency=USD`).

**Query Parameters:**

| Parameter          | Type                | Required | Default  | Description                                                                                                                  |
| ------------------ | ------------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `item_id`          | integer             | No       | -        | Exact item ID lookup (fast path)                                                                                             |
| `market_hash_name` | string              | No       | -        | Exact item name lookup                                                                                                       |
| `phase`            | string              | No       | -        | Doppler phase filter (empty strings treated as unset)                                                                        |
| `providers`        | array[enum[string]] | No       | -        | Provider-key enum values to include (repeat `providers` for multiple providers)                                              |
| `currency`         | string              | No       | USD      | Any ISO 4217 code supported by `/v1/fx` (see `/v1/fx` for the full list of available currencies). Invalid codes return `422` |
| `limit`            | integer             | No       | 100/1000 | Results per page (tier-capped: `free` = 100, `pro`/`quant` = 1000                                                            |
| `offset`           | integer             | No       | 0        | Pagination offset                                                                                                            |

**Link Fields (`/v1/prices` response):**

- `link`: Branded redirect URL through this API domain (`/r/{provider}/{item_id}`), intended for tracked marketplace navigation and affiliate/referral attribution.
- `url`: Raw direct marketplace listing URL (no API redirect). Returned only for paid tiers (`pro`, `quant`).

**Example Request:**

```bash
curl -H "Authorization: Bearer your_key" \
  "https://api.cs2c.app/v1/prices?providers=avanmarket&currency=USD&limit=1"
```

**Example Response:**

```json
{
    "meta": {
        "currency": "USD",
        "filters": {
            "market_hash_name": null,
            "phase": null,
            "requested_providers": null
        },
        "returned_providers": [
            "avanmarket",
            "bitskins",
            "buff163",
            "buffmarket",
            "c5",
            "csdeals",
            "csfloat",
            "csgo500",
            "csgoempire",
            "csmoney_m",
            "csmoney_t",
            "cstrade",
            "dmarket",
            "ecosteam",
            "gamerpay",
            "haloskins",
            "itradegg",
            "lisskins",
            "lootfarm",
            "mannco",
            "marketcsgo",
            "pirateswap",
            "rapidskins",
            "shadowpay",
            "skinbaron",
            "skinflow",
            "skinout",
            "skinplace",
            "skinport",
            "skinscom",
            "skinsmonkey",
            "skinswap",
            "skinvault",
            "steam",
            "swapgg",
            "tradeit",
            "waxpeer",
            "whitemarket",
            "youpin"
        ]
    },
    "items": [
        {
            "provider": "avanmarket",
            "item_id": 2,
            "market_hash_name": "'Blueberries' Buckshot | NSWC SEAL",
            "phase": null,
            "lowest_ask": 2327,
            "quantity": 6,
            "link": "https://cs2c.app/r/avanmarket/2",
            "url": "https://avan.market/en/market/cs/blueberries-buckshot-nswc-seal",
            "timestamp": "2026-03-07T23:26:20.956949Z",
            "last_updated": "2026-03-08T21:41:03.792573Z"
        }
        ...
    ],
    "pagination": {
        "limit": 1000,
        "offset": 0,
        "total": 592203,
        "has_next": true,
        "has_prev": false
    }
}
```

---

#### GET /v1/prices/history

Available to: `pro`/`quant`

Historical price snapshots from `price_history` (cursor-based pagination).

`price` is returned as minor units of the response currency (for example USD cents when `currency=USD`).

**Query Parameters:**

| Parameter          | Type    | Required | Default  | Description                                                                                                                  |
| ------------------ | ------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `item_id`          | integer | No       | -        | Filter by item ID                                                                                                            |
| `market_hash_name` | string  | No       | -        | Filter by item name                                                                                                          |
| `phase`            | string  | No       | -        | Filter by phase (empty strings treated as unset)                                                                             |
| `provider`         | string  | No       | -        | Single provider key string (`provider=...`, one provider only)                                                               |
| `start`            | string  | No       | -        | ISO 8601 start timestamp                                                                                                     |
| `end`              | string  | No       | -        | ISO 8601 end timestamp                                                                                                       |
| `currency`         | string  | No       | USD      | Any ISO 4217 code supported by `/v1/fx` (see `/v1/fx` for the full list of available currencies). Invalid codes return `422` |
| `limit`            | integer | No       | 100/1000 | Results per page (tier-capped: `free` = 100, `pro`/`quant` = 1000                                                            |
| `cursor`           | string  | No       | -        | Opaque cursor from `next_cursor`                                                                                             |

**Notes:**

- `pagination.total` is intentionally `-1` to avoid expensive COUNT queries.
- Cursor pagination state is returned in `pagination.has_next` and `pagination.next_cursor`.

**Example Request:**

```bash
curl -H "Authorization: Bearer your_key" \
  "https://api.cs2c.app/v1/prices/history?market_hash_name=AK-47+%7C+Redline+%28Field-Tested%29&provider=steam&limit=50"
```

**Example Response:**

```json
{
  "meta": {
    "currency": "USD",
    "filters": {
      "item_id": 156,
      "market_hash_name": "AK-47 | Redline (Field-Tested)",
      "phase": null,
      "provider": "steam",
      "start": "2025-12-29T00:00:00Z",
      "end": "2025-12-30T00:00:00Z"
    },
    "result_count": 1
  },
  "items": [
    {
      "time": "2025-12-29T10:00:00Z",
      "item_id": 156,
      "market_hash_name": "AK-47 | Redline (Field-Tested)",
      "phase": null,
      "provider": "Steam Community Market",
      "price": 2550,
      "currency": "USD",
      "quantity": 142
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": -1,
    "has_next": false,
    "has_prev": false,
    "next_cursor": null
  }
}
```

---

#### GET /v1/prices/candles

Available to: `free`/`pro`/`quant`

OHLC candles for a single item/provider.

**Query Parameters:**

| Parameter          | Type    | Required      | Default  | Description                                                                                                                  |
| ------------------ | ------- | ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `item_id`          | integer | Conditionally | -        | Item ID (required if `market_hash_name` not provided)                                                                        |
| `market_hash_name` | string  | Conditionally | -        | Item name (required if `item_id` not provided)                                                                               |
| `phase`            | string  | No            | -        | Optional phase filter                                                                                                        |
| `provider`         | string  | Yes           | -        | Single provider key string (`provider=...`, exactly one provider)                                                            |
| `start`            | string  | No            | -        | ISO 8601 start timestamp                                                                                                     |
| `end`              | string  | No            | now      | ISO 8601 end timestamp                                                                                                       |
| `lookback`         | string  | No            | -        | Duration shorthand (`7d`, `30d`); overrides `start`                                                                          |
| `interval`         | string  | No            | `1h`     | One of: `5m`, `1h`, `1d`                                                                                                     |
| `fill`             | boolean | No            | `false`  | Forward-fill empty buckets                                                                                                   |
| `currency`         | string  | No            | USD      | Any ISO 4217 code supported by `/v1/fx` (see `/v1/fx` for the full list of available currencies). Invalid codes return `422` |
| `limit`            | integer | No            | 100/1000 | Results per page (tier-capped: `free` = 100, `pro`/`quant` = 1000                                                            |
| `cursor`           | string  | No            | -        | Opaque cursor from `next_cursor`                                                                                             |

**Example Request:**

```bash
curl -H "Authorization: Bearer your_key" \
  "https://api.cs2c.app/v1/prices/candles?item_id=156&provider=steam&interval=1h&lookback=7d"
```

**Example Response:**

```json
{
  "meta": {
    "item_id": 156,
    "market_hash_name": "AWP | Dragon Lore (Factory New)",
    "phase": null,
    "provider": "Steam Community Market",
    "currency": "USD",
    "interval": "1h",
    "start": "2025-12-22T10:30:00+00:00",
    "end": "2025-12-29T10:30:00+00:00"
  },
  "data": [
    {
      "t": 1766998800,
      "o": 2245050,
      "h": 2250000,
      "l": 2240000,
      "c": 2248000
    }
  ],
  "pagination": {
    "limit": 500,
    "offset": 0,
    "total": -1,
    "has_next": false,
    "has_prev": false,
    "next_cursor": null
  }
}
```

---

#### GET /v1/fx

Available to: `free`/`pro`/`quant`

Current foreign exchange rates (167 currencies total).

Base currency: `USD`

**Example Request:**

```bash
curl -H "Authorization: Bearer your_key" \
  "https://api.cs2c.app/v1/fx"
```

**Example Response:**

```json
{
 "timestamp": "2026-03-08T20:24:54.886213+00:00",
 "rates": {
  "USD": 1.0,
  "EUR": 0.92,
  "GBP": 0.79,
  "CNY": 7.25,
  "RUB": 92.5,
  "BRL": 5.15,
  ...
 }
}
```

---

### Buy Orders

#### GET /v1/bids

Available to: `pro`/`quant`

List buy orders/bids with filtering by item, provider, and phase.

`highest_bid` is returned as minor units of the response currency (for example USD cents when `currency=USD`).

**Query Parameters:**

| Parameter          | Type                | Required | Default  | Description                                                                                                                  |
| ------------------ | ------------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `item_id`          | integer             | No       | -        | Filter by item ID                                                                                                            |
| `market_hash_name` | string              | No       | -        | Filter by item name                                                                                                          |
| `phase`            | string              | No       | -        | Filter by Doppler phase (applies globally, not just with market_hash_name); empty strings treated as unset                   |
| `providers`        | array[enum[string]] | No       | -        | Provider-key enum values (repeat `providers` for multiple providers)                                                         |
| `currency`         | string              | No       | USD      | Any ISO 4217 code supported by `/v1/fx` (see `/v1/fx` for the full list of available currencies). Invalid codes return `422` |
| `limit`            | integer             | No       | 100/1000 | Results per page (tier-capped: `free` = 100, `pro`/`quant` = 1000                                                            |
| `offset`           | integer             | No       | 0        | Pagination offset                                                                                                            |

**Providers with Buy Orders:**

- `buff163`, `buffmarket`, `csfloat`, `dmarket`, `ecosteam`,
- `marketcsgo`, `steam`, `waxpeer`, `whitemarket`

**Example Request:**

```bash
curl -H "Authorization: Bearer your_key" \
  "https://api.cs2c.app/v1/bids?market_hash_name=★+Karambit+|+Gamma+Doppler+(Factory+New)&phase=Phase+2"
```

**Example Response:**

```json
{
    "meta": {
        "currency": "USD",
        "filters": {
            "item_id": null,
            "market_hash_name": null,
            "phase": null,
            "requested_providers": null
        },
        "providers_queried": [
            "buff163",
            "buffmarket",
            "csfloat",
            "dmarket",
            "ecosteam",
            "marketcsgo",
            "steam",
            "waxpeer",
            "whitemarket"
        ]
    },
    "items": [
        {
            "item_id": 60,
            "market_hash_name": "'The Doctor' Romanov | Sabre",
            "phase": null,
            "provider": "buff163",
            "highest_bid": 1663,
            "num_bids": 224,
            "timestamp": "2026-03-08T21:07:34.278922Z",
            "last_updated": "2026-03-08T21:07:49.422001Z"
        },
        {
            "item_id": 60,
            "market_hash_name": "'The Doctor' Romanov | Sabre",
            "phase": null,
            "provider": "csfloat",
            "highest_bid": 1620,
            "num_bids": 1,
            "timestamp": "2026-03-08T21:24:52.084750Z",
            "last_updated": "2026-03-08T21:26:14.308082Z"
        }
        ...
    ],
    "pagination": {
        "limit": 1000,
        "offset": 0,
        "total": 132020,
        "has_next": true,
        "has_prev": false,
        "next_cursor": null
    }
}
```

---

### Recent Sales

#### GET /v1/sales

Available to: `pro`/`quant`

Retrieve sales transaction history with on-demand provider fetching.

`price` is returned as minor units of the response currency (for example USD cents when `currency=USD`). Divide by 100 for display.

**This is a live-query endpoint (not pre-ingested): cache misses trigger synchronous provider API calls, so response times vary by provider/network conditions.**

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |
| `item_id` | integer | No | - | Filter by item ID |
| `market_hash_name` | string | No | - | Filter by item name (`item_id` or `market_hash_name` required) |
| `phase` | string | No | - | Filter by Doppler phase; empty strings treated as unset |
| `providers` | array[enum[string]] | No | - | Provider-key enum values to query (repeat `providers` for multiple providers) |
| `currency` | string | No | USD | Any ISO 4217 code supported by `/v1/fx` (see `/v1/fx` for the full list of available currencies). Invalid codes return `422` |
| `limit` | integer | No | 25 | Results per page (tier-capped, endpoint max 50) |

**Cache Behavior (`cache_status`):**

- `cache_status` is a map keyed by provider key: `{ [provider_key]: status }`.
- Status values:
  - `hit`: served from Redis sales cache
  - `miss`: cache miss, fetched live during this request
  - `error`: live fetch attempted but failed
  - `unavailable`: provider was requested but is not available in the active runtime registry
- Sales cache TTL for a hit is currently **1 hour** per `item_id + provider`.

**Providers with Recent Sales:**

- `bitskins`, `buff163`, `buffmarket`, `c5`, `csfloat`, `csgo500`
- `csgoempire`, `dmarket`, `skinbaron`, `youpin`

**Example Request:**

```bash
curl -H "Authorization: Bearer your_key" \
  "https://api.cs2c.app/v1/sales?market_hash_name=AK-47+%7C+Redline+%28Field-Tested%29&providers=csfloat&providers=buff163"
```

**Example Response:**

```json
{
    "meta": {
        "currency": "USD",
        "filters": {
            "item_id": 12635,
            "market_hash_name": "StatTrak™ AK-47 | Redline (Well-Worn)",
            "phase": null,
            "requested_providers": null,
            "limit": 50
        },
        "providers_queried": [
            "c5",
            "skinbaron",
            "bitskins",
            "buffmarket",
            "dmarket",
            "buff163",
            "csgo500",
            "csfloat",
            "csgoempire",
            "youpin"
        ],
        "result_count": 50
    },
    "items": [
        {
            "date": "2026-02-20T16:00:00+00:00",
            "provider": "buff163",
            "price": 7054,
            "currency": "USD",
            "item_id": 12635,
            "market_hash_name": "StatTrak™ AK-47 | Redline (Well-Worn)",
            "phase": null,
            "float": 0.3843424618244171,
            "paint_seed": 896,
            "stickers": [
                {
                    "name": "Sticker | Cloud9 (Foil) | Krakow 2017",
                    "slot": 0,
                    "wear": null
                },
                {
                    "name": "Sticker | Virtus.Pro (Holo) | Krakow 2017",
                    "slot": 1,
                    "wear": null
                },
                {
                    "name": "Sticker | ELEAGUE (Holo) | Atlanta 2017",
                    "slot": 3,
                    "wear": null
                },
                {
                    "name": "Sticker | NiKo (Glitter) | Shanghai 2024",
                    "slot": 2,
                    "wear": null
                },
                {
                    "name": "Sticker | MAJ3R | Austin 2025",
                    "slot": 2,
                    "wear": 0.6200000047683716
                }
            ],
            "charms": [
                {
                    "name": "Charm | Lil' Crass",
                    "pattern_id": 42531
                }
            ],
            "inspect": {
                "in_game": "steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20001807209A02280538899193F6034080079AD9F0F9",
                "screenshot_front": "https://spect.fp.ps.netease.com/file/6999dec15bf7f4fc0db4f14a8Mb3yhGR07",
                "screenshot_back": "https://spect.fp.ps.netease.com/file/6999dec15bf7f4fc0db4f14a8Mb3yhGR07"
            }
        }
        ...
    ],
    "cache_status": {
        "c5": "hit",
        "skinbaron": "hit",
        "bitskins": "miss",
        "buffmarket": "miss",
        "dmarket": "miss",
        "buff163": "hit",
        "csgo500": "miss",
        "csfloat": "hit",
        "csgoempire": "hit",
        "youpin": "hit"
    }
}
```

**Error Codes:**

| Code | Description |
| ---- | ----------- |
| 400 | Missing item filter (`item_id` or `market_hash_name`) or invalid provider selection |
| 404 | Item could not be resolved |

**400 Example (Missing Required Item Filter):**

```json
{
  "code": "BAD_REQUEST",
  "detail": "Either item_id or market_hash_name must be provided"
}
```

---

### Market Intelligence

Market intelligence endpoints provide quant-focused analytics with consistent `meta` + `data` envelopes.
`/v1/market/arbitrage` and `/v1/market/items/{item_id}` are USD-only. `/v1/market/indicators` also accepts a `currency` parameter for price-level output conversion.
Access is tiered by endpoint: `pro` can access `/v1/market/items/{item_id}`, while `quant` can access all `/v1/market/*` endpoints.

**Active market endpoints only:**

- `GET /v1/market/arbitrage`
- `GET /v1/market/items/{item_id}`
- `GET /v1/market/indicators`

#### GET /v1/market/arbitrage

Available to: `quant`

Find arbitrage opportunities across providers.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |
| `min_spread_pct` | number | No | 1.0 | Minimum spread percentage to filter by |
| `limit` | integer | No | tier cap | Number of opportunities to return (effective default is the tier cap; quant currently resolves to 100, capped at 100) |
| `cursor` | string | No | — | Opaque cursor from previous page |
| `providers_buy` | array[enum[string]] | No | — | Buy-side provider-key enum values (repeat `providers_buy` for multiple providers) |
| `providers_sell` | array[enum[string]] | No | — | Sell-side provider-key enum values (repeat `providers_sell` for multiple providers) |

**Cursor behavior:**

- pagination is cursor-only
- `pagination.total` is intentionally `-1`
- cursor tokens are tied to endpoint, sort context, and filter hash
- changing filters or reusing a mismatched cursor returns `400`
- malformed cursor tokens also return `400`

**Example Request:**

```bash
curl -H "Authorization: Bearer your_key" \
  "https://api.cs2c.app/v1/market/arbitrage?min_spread_pct=5.0&limit=20"
```

---

#### GET /v1/market/items/{item_id}

Available to: `pro`/`quant`

Get detailed analytics for a specific item.

**Path Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `item_id` | integer | Yes | Item ID to analyze |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |
| `timeframe` | string | No | 24h | Time window (1h, 24h, 7d, 30d) |

**Response shape notes:**

- `meta.window` contains preset-only metadata: `timeframe`
- `timeframe` selects the liquidity horizon used for `data.summary.liquidity_*`
- item-level liquidity fields live in `data.summary`
- `timeframe=1h` reuses the `24h` liquidity horizon
- provider rows keep pricing, bid-side, spread, depth, volume, and `bid_anomaly`
- provider rows no longer include liquidity component metrics
- `data.providers[].volume_24h` is always trailing 24h depletion activity
- `data.providers[].volume_7d` is always trailing 7d depletion activity
- `data.summary.total_volume_24h` is always the sum of trailing 24h provider volume

**Example Request:**

```bash
curl -H "Authorization: Bearer your_key" \
  "https://api.cs2c.app/v1/market/items/156?timeframe=24h"
```

---

#### GET /v1/market/indicators

Available to: `quant`

Compute technical indicators for one item from live OHLCV candle data.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |
| `item_id` | integer | No | — | Item ID for indicator computation |
| `market_hash_name` | string | No | — | Alternate item selector for indicator computation |
| `phase` | string | No | — | Optional phase filter; primarily relevant when resolving by `market_hash_name` |
| `provider` | string | Yes | — | Single provider key string (`provider=...`) |
| `interval` | string | No | 1d | Candle interval (`1h`, `1d`) |
| `currency` | string | No | USD | Output currency for price-level indicators (response field name `close_price_usd` is retained for compatibility) |

**Required selector:** provide `item_id` or `market_hash_name` together with `provider`.

**Error behavior:**

| Status | Condition |
| --- | --- |
| `400` | `provider` missing |
| `400` | both `item_id` and `market_hash_name` missing |
| `400` | unknown provider |
| `404` | unknown item |
| `422` | insufficient candle history for indicator computation |
| `503` | FX rate unavailable for requested output currency |

---

## Schemas

### Item Schema

```typescript
{
  item_id: number;          // Normalized dictionary ID
  market_hash_name: string; // Full item name
  phase: string | null;     // Doppler phase (if applicable)
}
```

### MarketItem Schema

```typescript
{
  provider: string;                // Provider key
  item_id: number;                 // Item ID
  market_hash_name: string;        // Full item name
  phase: string | null;            // Doppler phase
  lowest_ask: integer;             // Best asking price (minor units of response currency; divide by 100 for display)
  quantity: number;                // Available quantity
  link: string | null;             // Branded redirect URL via /r/{provider}/{item_id}; may include tracking/referral attribution
  url?: string | null;             // Raw marketplace listing URL (paid tiers only: pro, quant)
  timestamp: datetime | null;      // Provider observed timestamp
  last_updated: datetime | null;   // Last ingestion timestamp
}
```

### SaleRecord Schema

```typescript
{
  date: string;                // ISO 8601 timestamp
  price: integer;              // Sale price (minor units of response currency; divide by 100 for display)
  currency: string;            // Currency code
  market_hash_name: string;    // Item name
  provider: string;            // Provider name
  phase: string | null;        // Doppler phase
  float: number | null;        // Float value (0-1)
  paint_seed: number | null;   // Paint seed
  stickers: Array<{            // Sticker details
    name: string;
    slot: number;
    wear: number | null;
  }> | null;
  charms: Array<{              // Charm/keychain details
    name: string;
    pattern_id: number | null;
  }> | null;
  inspect: {                   // Inspect links
    in_game: string | null;
    screenshot_front: string | null;
    screenshot_back: string | null;
  } | null;
}
```

### SalesHistoryResponse Schema

```typescript
{
  meta: {
    currency: string;
    filters: {
      item_id: number | null;
      market_hash_name: string | null;
      phase: string | null;
      requested_providers: string[] | null;
      limit: number;
    };
    providers_queried: string[];
    result_count: number;
  };
  items: SaleRecord[];
  cache_status: {
    [provider_key: string]: "hit" | "miss" | "error" | "unavailable";
  }; // Per-provider cache outcome map (sales cache hit TTL: 1 hour)
}
```

### MarketArbitrageResponse Schema

```typescript
{
  meta: {
    generated_at: string;
    data_source: "live";
    freshness_sec: number;
    window: null;
  };
  data: {
    items: Array<{
      item_id: number;
      market_hash_name: string;
      phase: string | null;
      buy_provider: string;
      sell_provider: string;
      buy_price_usd: string;
      sell_price_usd: string;
      gross_spread_pct: number;
      estimated_fees_usd: string;
      net_profit_usd: string;
      last_updated: string | null;
    }>;
  };
  pagination: {
    limit: number;
    total: -1;
    has_next: boolean;
    has_prev: boolean;
    next_cursor: string | null;
  };
}
```

### MarketItemAnalyticsResponse Schema

```typescript
{
  meta: {
    generated_at: string;
    data_source: "live";
    freshness_sec: number;
    window: {
      timeframe: "1h" | "24h" | "7d" | "30d";
    };
  };
  data: {
    item_id: number;
    market_hash_name: string;
    phase: string | null;
    summary: {
      provider_count: number;
      total_volume_24h: number | null;
      best_ask_usd: string | null;
      best_bid_usd: string | null;
      avg_spread_pct: number | null;
      liquidity_score: number | null;
      listing_score: number | null;
      gap_score: number | null;
      volume_score: number | null;
      doppler_bonus: boolean;
      price_anomaly: boolean;
      high_tier_override: boolean;
      liquidity_last_updated: string | null;
    };
    providers: MarketItemAnalyticsProvider[];
    coverage: {
      provider_count: number;
      providers_with_volume: number;
      providers_with_bid_side: number;
    };
  };
}
```

### MarketIndicatorsItemResponse Schema

```typescript
{
  meta: {
    generated_at: string;
    data_source: "live";
    freshness_sec: number;
    interval: "1h" | "1d";
    provider: string;
  };
  data: {
    item_id: number;
    market_hash_name: string;
    phase: string | null;
    provider: string;
    interval: "1h" | "1d";
    close_price_usd: string;
    momentum: object;
    volatility: object;
    volume: object;
    signals: object;
    coverage: {
      candle_count: number;
      first_bucket: string | null;
      last_bucket: string | null;
      sufficient_for: string[];
      insufficient_for: string[];
    };
  };
}
```

### LiquidityScore Schema

```typescript
{
  item_id: number;             // Item ID
  provider: string;            // "global" for ranked liquidity listings
  liquidity_score: number;     // 0-100 aggregate score
  listing_score: number;       // 0-33 listing-count component
  gap_score: number;           // 0-33 bid/ask gap component
  volume_score: number;        // 0-34 volume component
  doppler_bonus: boolean;      // Whether Doppler multiplier was applied
  price_anomaly: boolean;      // Bid >= ask anomaly short-circuit
  high_tier_override: boolean; // High-tier fallback volume override
  volume_source: "steam" | "depletion" | "none";
  currency: string;            // Target currency for reference
  last_updated: string;        // ISO 8601 timestamp
}
```

## Code Examples

### Python

#### Basic Price Lookup

```python
import requests

API_KEY = "your_api_key"
BASE_URL = "https://api.cs2c.app"

def get_item_prices(market_hash_name: str):
    """Get prices for an item across all providers."""
    headers = {"Authorization": f"Bearer {API_KEY}"}
    params = {
        "market_hash_name": market_hash_name,
        "currency": "USD"
    }

    response = requests.get(
        f"{BASE_URL}/v1/prices",
        headers=headers,
        params=params
    )
    response.raise_for_status()
    return response.json()

# Usage
prices = get_item_prices("AWP | Dragon Lore (Factory New)")
print(f"Providers: {prices['meta']['returned_providers']}")
for item in prices["items"]:
    print(f"{item['provider']}: ${(item['lowest_ask'] / 100):.2f}")
```

#### Async Batch Processing

```python
import asyncio
import aiohttp

API_KEY = "your_api_key"
BASE_URL = "https://api.cs2c.app"

async def get_item_prices(session: aiohttp.ClientSession, item_id: int):
    """Async fetch prices for an item."""
    headers = {"Authorization": f"Bearer {API_KEY}"}
    params = {"item_id": item_id}

    async with session.get(
        f"{BASE_URL}/v1/prices",
        headers=headers,
        params=params
    ) as response:
        return await response.json()

async def batch_price_lookup(item_ids: list[int]):
    """Fetch prices for multiple items concurrently."""
    async with aiohttp.ClientSession() as session:
        tasks = [get_item_prices(session, item_id) for item_id in item_ids]
        return await asyncio.gather(*tasks)

# Usage
item_ids = [1, 2, 3, 4, 5]
results = asyncio.run(batch_price_lookup(item_ids))
```

### JavaScript/TypeScript

#### Basic Usage with Fetch

```typescript
const API_KEY = "your_api_key";
const BASE_URL = "https://api.cs2c.app";

async function getItemPrices(marketHashName: string) {
  const params = new URLSearchParams({
    market_hash_name: marketHashName,
    currency: "USD"
  });

  const response = await fetch(
    `${BASE_URL}/v1/prices?${params}`,
    {
      headers: {
        "Authorization": `Bearer ${API_KEY}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return await response.json();
}

// Usage
getItemPrices("AWP | Dragon Lore (Factory New)")
  .then(data => {
    console.log("Providers:", data.meta.returned_providers);
    data.items.forEach(item => {
      console.log(`${item.provider}: $${(item.lowest_ask / 100).toFixed(2)}`);
    });
  });
```

#### Rate Limit Handling

```typescript
class CS2CAPI {
  private apiKey: string;
  private baseUrl: string;
  private requestQueue: Promise<any>[] = [];

  constructor(apiKey: string, baseUrl: string = "https://api.cs2c.app") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async request(endpoint: string, params: Record<string, any> = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
        return;
      }
      searchParams.set(key, String(value));
    });
    const queryString = searchParams.toString();
    const url = `${this.baseUrl}${endpoint}?${queryString}`;

    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${this.apiKey}`
      }
    });

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("retry-after") || "60");
      console.log(`Rate limited. Retrying after ${retryAfter}s`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return this.request(endpoint, params);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  }

  async getPrices(params: {
    market_hash_name?: string;
    providers?: string[];
    currency?: string;
  }) {
    return this.request("/v1/prices", params);
  }
}

// Usage
const api = new CS2CAPI("your_api_key");
const prices = await api.getPrices({
  market_hash_name: "AWP | Dragon Lore (Factory New)",
  providers: ["steam", "skinport"],
  currency: "USD"
});
```

### cURL Examples

#### Get Prices with Providers Filter

```bash
curl -X GET "https://api.cs2c.app/v1/prices?market_hash_name=AWP%20%7C%20Dragon%20Lore%20%28Factory%20New%29&providers=steam&providers=skinport&currency=USD" \
  -H "Authorization: Bearer your_api_key" \
  -H "Accept: application/json"
```

#### Get Recent Sales

```bash
curl -X GET "https://api.cs2c.app/v1/sales?market_hash_name=AK-47%20%7C%20Redline%20%28Field-Tested%29&providers=csfloat&providers=buff163" \
  -H "Authorization: Bearer your_api_key" \
  -H "Accept: application/json"
```

---

## Best Practices

### 1. Error Handling

Always implement proper error handling:

```python
try:
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    data = response.json()
except requests.exceptions.HTTPError as e:
    if e.response.status_code == 429:
        # Handle rate limit
        retry_after = int(e.response.headers.get("retry-after", 60))
        time.sleep(retry_after)
    elif e.response.status_code == 401:
        # Handle authentication error
        print("Invalid API key")
    else:
        # Handle other errors
        print(f"HTTP error: {e}")
except requests.exceptions.RequestException as e:
    # Handle network errors
    print(f"Request failed: {e}")
```

### 2. Caching

Implement client-side caching to reduce API calls:

```python
from functools import lru_cache
import time

@lru_cache(maxsize=128)
def get_prices_cached(item_id: int, cache_time: int):
    """Cache results for cache_time seconds."""
    # cache_time is used to bust cache periodically
    return get_item_prices(item_id)

# Usage with 5-minute cache
current_period = int(time.time() / 300)  # 5 minutes
prices = get_prices_cached(item_id=1, cache_time=current_period)
```

### 3. Respect Rate Limits

Monitor your usage and implement backoff strategies:

```python
import time
from collections import deque

class RateLimiter:
    def __init__(self, requests_per_second: int):
        self.rate = requests_per_second
        self.allowance = requests_per_second
        self.last_check = time.time()

    def wait_if_needed(self):
        current = time.time()
        elapsed = current - self.last_check
        self.last_check = current
        self.allowance += elapsed * self.rate

        if self.allowance > self.rate:
            self.allowance = self.rate

        if self.allowance < 1.0:
            sleep_time = (1.0 - self.allowance) / self.rate
            time.sleep(sleep_time)
            self.allowance = 0.0
        else:
            self.allowance -= 1.0

# Usage
limiter = RateLimiter(requests_per_second=5)  # Basic tier

for item_id in item_ids:
    limiter.wait_if_needed()
    prices = get_item_prices(item_id)
```

### 4. Batch Requests

Use async/concurrent requests for better performance:

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

def batch_requests(item_ids: list[int], batch_size: int = 10):
    """Process items in batches to avoid overwhelming the API."""
    results = []

    for i in range(0, len(item_ids), batch_size):
        batch = item_ids[i:i + batch_size]
        batch_results = asyncio.run(batch_price_lookup(batch))
        results.extend(batch_results)
        time.sleep(1)  # Brief pause between batches

    return results
```

---

## Related Documentation

Essential guides for working with CS2C-API:

- **[Quick Start](getting-started.md)** — Fast path to first successful API request
- **[Pagination Guide](pagination.md)** — Offset vs cursor pagination patterns and iteration examples
- **[Core Concepts](core-concepts.md)** — Canonical domain definitions and endpoint-to-concept mapping

---

## Support

- **Email**: <dadscaptv@gmail.com>
