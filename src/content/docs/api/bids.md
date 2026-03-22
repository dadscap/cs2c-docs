---
title: Bids
description: Current buy orders and full-catalog bid streaming.
order: 12
---

## Buy Orders

### List Bids
>
> Returns the current highest buy-order snapshot across buy-order-enabled providers for CS2 items, paginated and filterable by item, phase, provider, and currency.

- Endpoint: GET `/bids`
- Tiers: `pro` · `quant`
- Rate Limit: <ol>**Pro**: 100/min</ol><ol>**Quant**: 300/min</ol>

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | integer | Filter by specific item ID. Takes precedence over `market_hash_name` and `phase` if provided. |
| market_hash_name | string | Exact item name as it appears in inventory. |
| phase | string | Doppler/Gamma phase filter. One of: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`. Can be used without `market_hash_name`. |
| providers | string[] | Buy-order provider keys to include. Repeat to pass multiple, e.g. `providers=steam&providers=buff163`. One of: `buff163`, `buffmarket`, `csfloat`, `dmarket`, `ecosteam`, `marketcsgo`, `steam`, `waxpeer`, `whitemarket`. |
| currency | string | Target currency. 160+ ISO 4217 codes supported (see `/fx` for the full list). Default: `USD`. |
| limit | integer | Results per page. Range: `1–1000`. Defaults to the caller's effective tier cap. |
| offset | integer | Pagination offset. Default: `0`. |

**Response Example:**

```json
{
    "meta": {...},
    "items": [
        {
            "item_id": 12632,
            "market_hash_name": "AK-47 | Redline (Field-Tested)",
            "phase": null,
            "provider": "buff163",
            "highest_bid": 3001,
            "num_bids": 232,
            "timestamp": "2026-03-21T05:22:39.570895Z",
            "last_updated": "2026-03-21T05:22:43.400024Z"
        },
        {
            "item_id": 12632,
            "market_hash_name": "AK-47 | Redline (Field-Tested)",
            "phase": null,
            "provider": "steam",
            "highest_bid": 3923,
            "num_bids": 57053,
            "timestamp": "2026-03-21T05:00:30.858070Z",
            "last_updated": "2026-03-21T05:00:34.493615Z"
        },
        {
            "item_id": 12632,
            "market_hash_name": "AK-47 | Redline (Field-Tested)",
            "phase": null,
            "provider": "dmarket",
            "highest_bid": 3081,
            "num_bids": 310,
            "timestamp": "2026-03-21T05:22:07.475923Z",
            "last_updated": "2026-03-21T05:22:10.170889Z"
        }
    ],
    "pagination": {...}
}
```

- `highest_bid` is returned in minor units of the response currency (e.g. `3923` = €39.23 with `currency=EUR`).
- Indexed-only path — no DB fallback. Returns `503` with `BIDS_INDEX_UNAVAILABLE` on index failure.

---

### Stream Full Bids Snapshot
>
> Streams the complete live buy-orders catalog as NDJSON, one BuyOrderItem JSON object per line, with a stable snapshot captured at request start.

- Endpoint: POST `/bids`
- Tiers: `quant`
- Rate Limit: 1 per 5 minutes

**Response Example:**

```ndjson
{"provider":"buff163","item_id":12632,"market_hash_name":"AK-47 | Redline (Field-Tested)","phase":null,"highest_bid":3001,"num_bids":232,"timestamp":"2026-03-21T05:22:39.570895Z","last_updated":"2026-03-21T05:22:43.400024Z"}
{"provider":"csfloat","item_id":12632,"market_hash_name":"AK-47 | Redline (Field-Tested)","phase":null,"highest_bid":2946,"num_bids":2,"timestamp":"2026-03-21T04:59:16.565601Z","last_updated":"2026-03-21T05:03:40.837477Z"}
{"provider":"steam","item_id":2,"market_hash_name":"'Blueberries' Buckshot | NSWC SEAL","phase":null,"highest_bid":289,"num_bids":4820,"timestamp":"2026-03-22T01:41:00.000000Z","last_updated":"2026-03-22T01:41:36.221322Z"}
```

- Requires a real `sk_*` API key — session JWTs are not accepted.
- Fixed USD output. No filters, request body, pagination, or alternate currencies.
- Snapshot is captured at request start and streamed in full.

---

### Batch Bids Lookup
>
> Returns current highest buy orders for up to 100 items in a single request, grouped by item ID across all queried buy-order providers.

- Endpoint: POST `/bids/batch`
- Tiers: `quant`
- Rate Limit: <ol>**Quant**: 300/min</ol>

**Payload:**

| Field | Type | Description |
|-------|------|-------------|
| item_ids | integer[] | **Required.** Array of item IDs to fetch. Must contain 1–100 items. |
| providers | string[] | Buy-order provider keys to include. If omitted, queries all buy-order providers. |
| currency | string | Target currency. Use `/fx` for supported ISO 4217 codes. Default: `USD`. |

```json
{
  "item_ids": [12632, 2, 9999],
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
      "item_id": 12632,
      "market_hash_name": "AK-47 | Redline (Field-Tested)",
      "phase": null,
      "quotes": [
        {
          "provider": "buff163",
          "highest_bid": 3001,
          "num_bids": 232,
          "timestamp": "2026-03-21T05:22:39Z",
          "last_updated": "2026-03-21T05:22:43Z"
        },
        {
          "provider": "steam",
          "highest_bid": 3923,
          "num_bids": 57053,
          "timestamp": "2026-03-21T05:00:30Z",
          "last_updated": "2026-03-21T05:00:34Z"
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
          "highest_bid": 224,
          "num_bids": 1,
          "timestamp": "2026-03-21T05:27:20Z",
          "last_updated": "2026-03-21T05:27:22Z"
        }
      ]
    }
  ]
}
```

- `highest_bid` is returned in minor units of the response currency.
- Items not found in any provider are listed in `items_not_found`.
- Max batch size: 100 items per request.

---
