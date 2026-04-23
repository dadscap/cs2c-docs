---
title: Bids
description: Current buy orders and full-catalog bid streaming.
order: 12
---

## Buy Orders

### List Bids
>
> Returns the current highest buy order across buy-order-enabled providers for CS2 items. Results can be filtered by item, phase, provider, and currency.

- Endpoint: GET `/bids`
- Tiers: `pro` · `quant`
- Rate Limit: **Pro**: 100/min · **Quant**: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | integer | Filter by item ID. If provided, it takes precedence over `market_hash_name` and `phase`. |
| market_hash_name | string | Exact item name as it appears in inventory. |
| phase | string | Doppler/Gamma phase filter. One of: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`. Can be used without `market_hash_name`. |
| providers | string[] | Buy-order provider keys to include. Repeat the parameter to pass more than one, for example `providers=steam&providers=buff163`. One of: `buff163`, `buffmarket`, `c5`, `csfloat`, `dmarket`, `ecosteam`, `marketcsgo`, `steam`, `waxpeer`, `whitemarket`, `youpin`. |
| currency | string | Target currency. 160+ ISO 4217 codes are supported. See `/fx` for the full list. Default: `USD`. |
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

- `highest_bid` is returned in minor units of the response currency, for example `3923` = €39.23 with `currency=EUR`.
- If the item exists in the catalog but none of the selected providers currently has a bid, the endpoint still returns `200` with `items=[]`.
- This endpoint reads from the live bids index only. There is no database fallback. If the index is unavailable or fails integrity checks, the response is `503 BIDS_INDEX_UNAVAILABLE`.

---

### Stream Full Bids Snapshot
>
> Streams the full live buy-order catalog as NDJSON, with one JSON object per line. The snapshot is fixed at request start.

- Endpoint: POST `/bids`
- Tiers: `pro` · `quant`
- Rate Limit: 1 per 30 seconds per API key

**Response Example:**

```ndjson
{"provider":"buff163","item_id":12632,"market_hash_name":"AK-47 | Redline (Field-Tested)","phase":null,"highest_bid":3001,"num_bids":232,"timestamp":"2026-03-21T05:22:39.570895Z","last_updated":"2026-03-21T05:22:43.400024Z"}
{"provider":"csfloat","item_id":12632,"market_hash_name":"AK-47 | Redline (Field-Tested)","phase":null,"highest_bid":2946,"num_bids":2,"timestamp":"2026-03-21T04:59:16.565601Z","last_updated":"2026-03-21T05:03:40.837477Z"}
{"provider":"steam","item_id":2,"market_hash_name":"'Blueberries' Buckshot | NSWC SEAL","phase":null,"highest_bid":289,"num_bids":4820,"timestamp":"2026-03-22T01:41:00.000000Z","last_updated":"2026-03-22T01:41:36.221322Z"}
```

- Requires a real `sk_*` API key. Session JWTs are not accepted.
- Output is always in USD.
- There is no request body, no pagination, and no alternate currency support.
- You can optionally repeat the `providers` query parameter to restrict the stream to specific buy-order providers.
- The snapshot is captured once at request start and then streamed in full.

---

### Batch Bids Lookup
>
> Returns current highest buy orders for up to 100 items in one request, grouped by item ID across the selected buy-order providers.

- Endpoint: POST `/bids/batch`
- Tiers: `pro` · `quant`
- Rate Limit: **Pro**: 100/min · **Quant**: 300/min

**Payload:**

| Field | Type | Description |
|-------|------|-------------|
| item_ids | integer[] | Array of item IDs to fetch. Provide at least one of `item_ids` or `market_hash_names`. |
| market_hash_names | string[] | Array of market hash names to fetch. Provide at least one of `item_ids` or `market_hash_names`. For phased items (Dopplers, Gammas), see the note below. |
| providers | string[] | Buy-order provider keys to include. If omitted, all supported buy-order providers are queried. One of: `buff163`, `buffmarket`, `c5`, `csfloat`, `dmarket`, `ecosteam`, `marketcsgo`, `steam`, `waxpeer`, `whitemarket`, `youpin`. |
| currency | string | Target currency. Use `/fx` for supported ISO 4217 codes. Default: `USD`. |

The combined length of `item_ids` and `market_hash_names` must be between 1 and 100. You cannot pass 100 item IDs and 100 names in the same request to get 200 results — the combined cap is hard.

> **⚠️ Phased items (Dopplers / Gammas):** `market_hash_name` resolves only to the phaseless catalog entry, which returns the cheapest variant regardless of phase. To target a specific phase (for example `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Sapphire`, `Ruby`, `Emerald`, or `Black Pearl`), pass the corresponding `item_id` instead.

```json
{
  "item_ids": [12632, 2],
  "market_hash_names": ["AK-47 | Redline (Field-Tested)"],
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
  ],
  "items_not_found": [],
  "names_not_found": []
}
```

- `highest_bid` is returned in minor units of the response currency.
- `items_not_found` lists item IDs (including those resolved from `market_hash_names`) that returned no bids on any queried provider.
- `names_not_found` lists any `market_hash_names` that could not be resolved to a catalog item at all.
- Maximum batch size is 100 items, applied to the combined length of `item_ids` and `market_hash_names`.
