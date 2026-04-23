---
title: Prices
description: Current asks, historical records, candles, and full-catalog price streaming.
order: 11
---

## Prices

### List Prices
>
> Returns the current lowest ask across marketplaces. Results can be filtered by item, phase, provider, and currency.

- Endpoint: **GET `/prices`**
- Tiers: `free` · `pro` · `quant`
- Rate Limit: **Free**: 20/min · **Pro**: 100/min · **Quant**: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | integer | Filter by item ID. If provided, it takes precedence over `market_hash_name` and `phase`. |
| market_hash_name | string | Exact item name as it appears in inventory. |
| phase | string | Doppler/Gamma phase filter. Can be used without `market_hash_name`. One of: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`. |
| providers | string[] | Provider keys to include. Repeat the parameter to pass more than one, for example `providers=steam&providers=buff163`. Options: `avanmarket`, `bitskins`, `buff163`, `buffmarket`, `c5`, `csdeals`, `csfloat`, `csgo500`, `csgoempire`, `csmoney_m`, `csmoney_t`, `cstrade`, `dmarket`, `ecosteam`, `gamerpay`, `haloskins`, `itradegg`, `lisskins`, `lootfarm`, `mannco`, `marketcsgo`, `pirateswap`, `rapidskins`, `shadowpay`, `skinbaron`, `skinflow`, `skinout`, `skinplace`, `skinport`, `skinscom`, `skinsmonkey`, `skinswap`, `skinvault`, `steam`, `swapgg`, `tradeit`, `waxpeer`, `whitemarket`, `youpin`. |
| currency | string | Target currency. 160+ ISO 4217 codes are supported. See `/fx` for the full list. Default: `USD`. |
| limit | integer | Results per page. Defaults to the caller's effective tier cap. Free: `100`, Pro/Quant: `1000`. |
| offset | integer | Pagination offset. Default: `0`. |

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

- `lowest_ask` is returned in minor units of the response currency, for example `531143` = $5,311.43.
- `link` is the tracked redirect URL.
- `url` is the direct marketplace URL and is returned only on paid tiers.
- If the item exists in the catalog but none of the selected providers currently has a listing, the endpoint still returns `200` with `items=[]`.
- This endpoint reads from the live price index only. There is no database fallback. If the index is unavailable or fails integrity checks, the response is `503 PRICES_INDEX_UNAVAILABLE`.

---

### Stream Full Prices Snapshot
>
> Streams the full live prices catalog as NDJSON, with one JSON object per line. The snapshot is fixed at request start.

- Endpoint: POST `/prices`
- Tiers: `pro` · `quant`
- Rate Limit: 1 per 30 seconds per API key

**Response Example:**

```ndjson
{"provider":"avanmarket","item_id":2,"market_hash_name":"'Blueberries' Buckshot | NSWC SEAL","phase":null,"lowest_ask":3460,"quantity":6,"link":"https://cs2c.app/r/avanmarket/2","url":"https://avan.market/en/market/cs/blueberries-buckshot-nswc-seal","timestamp":"2026-03-22T01:41:35.353783Z","last_updated":"2026-03-22T01:41:36.221322Z"}
{"provider":"bitskins","item_id":2,"market_hash_name":"'Blueberries' Buckshot | NSWC SEAL","phase":null,"lowest_ask":3413,"quantity":1,"link":"https://cs2c.app/r/bitskins/2","url":"https://bitskins.com/market/cs2?search=...","timestamp":"2026-03-21T09:22:06.434433Z","last_updated":"2026-03-22T01:42:13.463310Z"}
{"provider":"buff163","item_id":2,"market_hash_name":"'Blueberries' Buckshot | NSWC SEAL","phase":null,"lowest_ask":3187,"quantity":84,"link":"https://cs2c.app/r/buff163/2","url":"https://buff.163.com/goods/835687?from=market","timestamp":"2026-03-22T00:08:50.544878Z","last_updated":"2026-03-22T00:54:22.230624Z"}
{"provider":"c5","item_id":2,"market_hash_name":"'Blueberries' Buckshot | NSWC SEAL","phase":null,"lowest_ask":3156,"quantity":57,"link":"https://cs2c.app/r/c5/2","url":"https://www.c5game.com/csgo/808836530722177024/item/sell","timestamp":"2026-03-22T01:27:20.020270Z","last_updated":"2026-03-22T01:42:46.706601Z"}
```

- Requires a real `sk_*` API key. Session JWTs are not accepted.
- Output is always in USD.
- There is no request body, no pagination, and no alternate currency support.
- You can optionally repeat the `providers` query parameter to restrict the stream to specific providers.
- The snapshot is captured once at request start and then streamed in full.

---

### Batch Prices Lookup
>
> Returns current best asks for up to 100 items in one request, grouped by item ID across the selected providers.

- Endpoint: POST `/prices/batch`
- Tiers: `pro` · `quant`
- Rate Limit: **Pro**: 100/min · **Quant**: 300/min

**Payload:**

| Field | Type | Description |
|-------|------|-------------|
| item_ids | integer[] | **Required.** Array of item IDs to fetch. Must contain 1–100 items. |
| providers | string[] | Provider keys to include. If omitted, all providers are queried. |
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
- Items that are not found on any queried provider are listed in `items_not_found`.
- Maximum batch size is 100 items.

---

### Price Candles
>
> Returns composite OHLCV candles across all providers for the resolved item, using `5m`, `1h`, or `1d` intervals. Empty buckets can be forward-filled if needed.

- Endpoint: GET `/prices/candles`
- Tiers: `free` · `pro` · `quant`
- Rate Limit: **Free**: 20/min · **Pro**: 100/min · **Quant**: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | integer | Item ID to query. Required if `market_hash_name` is not provided. |
| market_hash_name | string | Exact item name. Required if `item_id` is not provided. |
| phase | string | Doppler/Gamma phase filter. One of: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`. |
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
            "v": 24,
            "q": 54792,
            "providers": {
                "h": "steam",
                "l": "csfloat"
            }
        },
        {
            "t": 1773776700,
            "o": 1748,
            "h": 2517,
            "l": 1434,
            "c": 1747,
            "v": 18,
            "q": 91342
        }
    ],
    "pagination": {...}
}
```

- `t` is a Unix timestamp in seconds.
- `o`, `h`, `l`, and `c` are returned in minor units of the response currency.
- `o` and `c` are unweighted averages across providers.
- `l` is the minimum low.
- `h` is capped at `median(highs) * 1.5`.
- `v` is the non-negative depletion flow across providers for the bucket.
- `q` is the summed close-side listing count at the end of the bucket when available. Older `1d` windows may return `null`.
- `pagination.total = -1` is intentional on cursor endpoints.

**Retention windows:** `5m` — 7 days · `1h` — 30 days · `1d` — 365 days.

**Free-tier restrictions:** only `interval=1d` is allowed. `fill=true` and `start`/`end` are not allowed on free tier. Use `lookback` instead.

---

### Price History
>
> Returns historical price records for one item, optionally filtered to a single provider. Results use cursor pagination and are ordered newest first.

- Endpoint: GET `/prices/history`
- Tiers: `pro` · `quant`
- Rate Limit: **Pro**: 100/min · **Quant**: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | integer | Filter by item ID. If provided, it takes precedence over `market_hash_name` and `phase`. |
| market_hash_name | string | Exact item name as it appears in inventory. |
| phase | string | Doppler/Gamma phase filter. One of: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`. |
| provider | string | A single provider key, for example `provider=steam`. |
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
- `pagination.total = -1` is intentional on cursor endpoints because counting is skipped for performance.
