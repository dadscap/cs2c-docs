---
title: Portfolio Valuation
description: Value an inventory at current market prices.
order: 13
---

## Portfolio

### Value Portfolio
>
> Values a user-submitted inventory list at current best-ask prices across selected providers, returning per-item line totals and an aggregate portfolio value.

- Endpoint: POST `/portfolio/value`
- Tiers: `free` · `pro` · `quant`
- Rate Limit: Free: 20/min · Pro: 100/min · Quant: 300/min

**Payload:**

| Field | Type | Description |
|-------|------|-------------|
| items | array[object] | **Required.** Array of items with their quantities. Each object has `item_id` (integer, normalized catalog item ID) and `quantity` (integer, units held, must be ≥ 1). |
| providers | string[] | Provider keys to include. If omitted, queries all providers. |
| currency | string | Target currency. Use `/fx` for supported ISO 4217 codes. Default: `USD`. |

```json
{
  "items": [
    {"item_id": 4994, "quantity": 2},
    {"item_id": 12632, "quantity": 5},
    {"item_id": 9999, "quantity": 1}
  ],
  "providers": ["buff163", "steam"],
  "currency": "USD"
}
```

**Response Example:**

```json
{
  "meta": {...},
  "data": {
    "line_items": [
      {
        "item_id": 4994,
        "market_hash_name": "★ Karambit | Doppler (Factory New)",
        "phase": "Sapphire",
        "quantity": 2,
        "best_ask": 528841,
        "item_value": 1057682
      },
      {
        "item_id": 12632,
        "market_hash_name": "AK-47 | Redline (Field-Tested)",
        "phase": null,
        "quantity": 5,
        "best_ask": 3187,
        "item_value": 15935
      }
    ],
    "total_value": 1073617,
    "items_valued": 2,
    "items_not_found": [9999]
  }
}
```

- `best_ask` is the minimum price across all queried providers, in minor units of the response currency (e.g. `528841` = $5,288.41).
- `item_value` = `best_ask` × `quantity`, in minor units.
- `total_value` = sum of all `item_value` amounts, in minor units.
- Items not found in any provider are listed in `items_not_found`.
- Max batch size: 100 items per request.

---
