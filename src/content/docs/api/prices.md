---
title: Prices
description: Best-ask snapshots, historical records, candles, and full-catalog streaming.
order: 11
---

## Prices

### List Prices
>
> Returns the current lowest price snapshot across all marketplaces. Paginated and filterable by item, phase, provider, and currency.

- Endpoint: **GET `/prices`**
- Tiers: `free` · `pro` · `quant`
- Rate Limit: <ol>**Free**: 20/min</ol><ol>**Pro**: 100/min</ol><ol>**Quant**: 300/min</ol>

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | integer | Filter by specific item ID. <br>Takes precedence over `market_hash_name` and `phase` if provided. |
| market_hash_name | string | Exact item name as it appears in inventory. |
| phase | string | Doppler/Gamma phase filter. Can be used without `market_hash_name`.<br>Either: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`.  |
| providers | string[] | Provider keys to include. Repeat to pass multiple, e.g. `providers=steam&providers=buff163`. Options: `avanmarket`, `bitskins`, `buff163`, `buffmarket`, `c5`, `csdeals`, `csfloat`, `csgo500`, `csgoempire`, `csmoney_m`, `csmoney_t`, `cstrade`, `dmarket`, `ecosteam`, `gamerpay`, `haloskins`, `itradegg`, `lisskins`, `lootfarm`, `mannco`, `marketcsgo`, `pirateswap`, `rapidskins`, `shadowpay`, `skinbaron`, `skinflow`, `skinout`, `skinplace`, `skinport`, `skinscom`, `skinsmonkey`, `skinswap`, `skinvault`, `steam`, `swapgg`, `tradeit`, `waxpeer`, `whitemarket`, `youpin`. |
| currency | string | Target currency. 160+ ISO 4217 codes supported (see <a href="/api-reference/catalog#get-fx-rates" target="_blank">`/fx`</a> for the full list). <br>Default: `USD`. |
| limit | integer | Results per page. Defaults to the caller's effective tier cap.<br> Free: `100`, Pro/Quant: `1000` |
| offset | integer | Pagination offset.<br>Default: `0` |

**Response Example:**

```json
{
    "meta": {...},
    "items": [
        {
            "provider": "buff163",
            "item_id": 4994,
            "market_hash_name": "★ Karambit | Doppler (Factory New)",
            "phase": "Sapphire",
            "lowest_ask": 531143,
            "quantity": 158,
            "link": "https://cs2c.app/r/buff163/4994",
            "url": "https://buff.163.com/goods/42998?from=market#tag_ids=446968",
            "timestamp": "2026-03-20T13:09:25.771066Z",
            "last_updated": "2026-03-21T05:02:44.450067Z"
        },
        {
            "provider": "csfloat",
            "item_id": 4994,
            "market_hash_name": "★ Karambit | Doppler (Factory New)",
            "phase": "Sapphire",
            "lowest_ask": 528841,
            "quantity": 29,
            "link": "https://cs2c.app/r/csfloat/4994",
            "url": "https://csfloat.com/search?def_index=507&paint_index=416",
            "timestamp": "2026-03-21T05:03:40.179351Z",
            "last_updated": "2026-03-21T05:03:40.837477Z"
        }
    ],
    "pagination": {...}
    }
```

- `lowest_ask` is returned in minor units of the response currency (e.g. `531143` = $5,311.43).
- `link` is the tracked redirect URL; `url` is the direct marketplace URL and is returned only for paid tiers.
- If the item resolves in the catalog but none of the queried providers currently has a listing, the endpoint returns `200` with `items=[]`.
- Indexed-only path — no DB fallback. Returns `503` with `PRICES_INDEX_UNAVAILABLE` only on true index availability or integrity failure.

---

### Price Candles
>
> Returns composite OHLCV candles aggregated across all providers for the resolved item, at 5m/1h/1d intervals, with optional forward-fill for empty buckets.

- Endpoint: GET `/prices/candles`
- Tiers: `free` · `pro` · `quant`
- Rate Limit: <ol>**Free**: 20/min</ol><ol>**Pro**: 100/min</ol><ol>**Quant**: 300/min</ol>

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | integer | Item ID to query. Required if `market_hash_name` is not provided. |
| market_hash_name | string | Exact item name. Required if `item_id` is not provided. |
| phase | string | Doppler/Gamma phase filter. <br>One of: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`. |
| start | date-time | Inclusive ISO 8601 timestamp. `YYYY-MM-DD` or `YYYY-MM-DDThh:mm:ss` |
| end | date-time | Exclusive ISO 8601 timestamp. Defaults to now when omitted. |
| lookback | string | Duration shorthand such as `7d` or `30d`. Overrides `start` when provided. |
| interval | string | Candle interval. One of: `5m`, `1h`, `1d`. Default: `1h`. |
| fill | boolean | Forward-fill empty buckets. Default: `false`. |
| currency | string | Target currency. 160+ ISO 4217 codes supported. Default: `USD`. |
| limit | integer | Results per page. Free: `1–100`, Pro/Quant: `1–1000`. |
| cursor | string | Cursor for keyset pagination. Use `next_cursor` from the previous response. |

**Response Example:**

```json
{
    "meta": {...},
    "data": [
        {
            "t": 1773466200,
            "o": 1783,
            "h": 2529,
            "l": 1529,
            "c": 1782,
            "v": 54792
        },
        {
            "t": 1773776700,
            "o": 1748,
            "h": 2517,
            "l": 1434,
            "c": 1747,
            "v": 91342
        }
    ],
    "pagination": {...}
}
```

- `t` is a Unix epoch timestamp in seconds.
- `o`, `h`, `l`, `c` are in minor units of the response currency. `o` and `c` are unweighted averages across providers; `l` is the minimum; `h` is capped at `median(highs) * 1.5`.
- `v` is the summed close-side listing count across providers.
- `pagination.total = -1` is intentional on cursor endpoints.

---

### Stream Full Prices Snapshot
>
> Streams the complete live prices catalog as NDJSON, one MarketItem JSON object per line, with a stable snapshot captured at request start.

- Endpoint: POST `/prices`
- Tiers: `quant`
- Rate Limit: 1 per 5 minutes

**Response Example:**

```ndjson
{"provider":"avanmarket","item_id":2,"market_hash_name":"'Blueberries' Buckshot | NSWC SEAL","phase":null,"lowest_ask":3460,"quantity":6,"link":"https://cs2c.app/r/avanmarket/2","url":"https://avan.market/en/market/cs/blueberries-buckshot-nswc-seal","timestamp":"2026-03-22T01:41:35.353783Z","last_updated":"2026-03-22T01:41:36.221322Z"}
{"provider":"bitskins","item_id":2,"market_hash_name":"'Blueberries' Buckshot | NSWC SEAL","phase":null,"lowest_ask":3413,"quantity":1,"link":"https://cs2c.app/r/bitskins/2","url":"https://bitskins.com/market/cs2?search=...","timestamp":"2026-03-21T09:22:06.434433Z","last_updated":"2026-03-22T01:42:13.463310Z"}
{"provider":"buff163","item_id":2,"market_hash_name":"'Blueberries' Buckshot | NSWC SEAL","phase":null,"lowest_ask":3187,"quantity":84,"link":"https://cs2c.app/r/buff163/2","url":"https://buff.163.com/goods/835687?from=market","timestamp":"2026-03-22T00:08:50.544878Z","last_updated":"2026-03-22T00:54:22.230624Z"}
{"provider":"c5","item_id":2,"market_hash_name":"'Blueberries' Buckshot | NSWC SEAL","phase":null,"lowest_ask":3156,"quantity":57,"link":"https://cs2c.app/r/c5/2","url":"https://www.c5game.com/csgo/808836530722177024/item/sell","timestamp":"2026-03-22T01:27:20.020270Z","last_updated":"2026-03-22T01:42:46.706601Z"}
```

- Requires a real `sk_*` API key — session JWTs are not accepted.
- Fixed USD output. No filters, request body, pagination, or alternate currencies.
- Snapshot is captured at request start and streamed in full.

---

### Batch Prices Lookup
>
> Returns current best-ask prices for up to 100 items in a single request, grouped by item ID across all queried providers.

- Endpoint: POST `/prices/batch`
- Tiers: `quant`
- Rate Limit: <ol>**Quant**: 300/min</ol>

**Payload:**

| Field | Type | Description |
|-------|------|-------------|
| item_ids | integer[] | **Required.** Array of item IDs to fetch. Must contain 1–100 items. |
| providers | string[] | Provider keys to include. If omitted, queries all providers. |
| currency | string | Target currency. Use `/fx` for supported ISO 4217 codes. Default: `USD`. |

```json
{
  "item_ids": [4994, 2, 9999],
  "providers": ["buff163", "steam"],
  "currency": "USD"
}
```

**Response Example:**

```json
{
  "meta": {...},
  "items": [
    {
      "item_id": 4994,
      "market_hash_name": "★ Karambit | Doppler (Factory New)",
      "phase": "Sapphire",
      "quotes": [
        {
          "provider": "buff163",
          "lowest_ask": 531143,
          "quantity": 158,
          "timestamp": "2026-03-20T13:09:25Z",
          "last_updated": "2026-03-21T05:02:44Z"
        }
      ]
    },
    {
      "item_id": 2,
      "market_hash_name": "'Blueberries' Buckshot | NSWC SEAL",
      "phase": null,
      "quotes": [
        {
          "provider": "buff163",
          "lowest_ask": 3187,
          "quantity": 84,
          "timestamp": "2026-03-22T00:08:50Z",
          "last_updated": "2026-03-22T00:54:22Z"
        },
        {
          "provider": "steam",
          "lowest_ask": 3923,
          "quantity": 57053,
          "timestamp": "2026-03-21T05:00:30Z",
          "last_updated": "2026-03-21T05:00:34Z"
        }
      ]
    }
  ]
}
```

- `lowest_ask` is returned in minor units of the response currency.
- Items not found in any provider are listed in `items_not_found`.
- Max batch size: 100 items per request.

---

### Price History
>
> Returns time-series price history records for a specific item and optional provider filter, using cursor-based pagination ordered newest first.

- Endpoint: GET `/prices/history`
- Tiers: `pro` · `quant`
- Rate Limit: <ol>**Pro**: 100/min</ol><ol>**Quant**: 300/min</ol>

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | integer | Filter by specific item ID. Takes precedence over `market_hash_name` and `phase` if provided. |
| market_hash_name | string | Exact item name as it appears in inventory. |
| phase | string | Doppler/Gamma phase filter. One of: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`. |
| provider | string | Single provider key (singular param, e.g. `provider=steam`). One of the 39 supported provider keys. |
| start | date-time | Inclusive ISO 8601 timestamp (`YYYY-MM-DD` or `YYYY-MM-DDThh:mm:ss`). |
| end | date-time | Exclusive ISO 8601 timestamp (`YYYY-MM-DD` or `YYYY-MM-DDThh:mm:ss`). |
| currency | string | Target currency. 160+ ISO 4217 codes supported. Default: `USD`. |
| limit | integer | Results per page. Range: `1–1000`. |
| cursor | string | Cursor for keyset pagination. Use `next_cursor` from the previous response. |

**Response Example:**

```json
{
    "meta": {...},
    "items": [
        {
            "item_id": 16828,
            "market_hash_name": "★ Karambit | Doppler (Factory New)",
            "phase": "Phase 4",
            "provider": "CSFloat",
            "time": "2026-03-19T23:55:00Z",
            "price": 147150,
            "currency": "USD",
            "quantity": 169
        },
        {
            "item_id": 16828,
            "market_hash_name": "★ Karambit | Doppler (Factory New)",
            "phase": "Phase 4",
            "provider": "Youpin898",
            "time": "2026-03-19T23:50:00Z",
            "price": 143200,
            "currency": "USD",
            "quantity": 668
        }
    ],
    "pagination": {...}
}
```

- `price` is returned in minor units of the response currency.
- `pagination.total = -1` is intentional on cursor endpoints — counting is skipped for performance.
