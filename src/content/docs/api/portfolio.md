---
title: Portfolio Valuation
description: Value an inventory at current market prices.
order: 13
---

## POST /portfolio/value

**Parameters:**

- `items` | `array[object]` | Required. Array of items with their quantities.
  - `item_id` | `integer` | Item ID to value.
  - `quantity` | `integer` | Quantity held. Must be >= 1.
- `providers` | `array[Enum[provider key]]` | Optional. Provider keys to include. If omitted, queries all providers.
- `currency` | `string` | `default: USD` | Target currency. Use `/fx` for the supported ISO 4217 codes.

**Request Body Example:**

```json
{
  "items": [
    {"item_id": 1, "quantity": 3},
    {"item_id": 2, "quantity": 1},
    {"item_id": 5, "quantity": 2}
  ],
  "providers": ["steam", "buff163"],
  "currency": "USD"
}
```

**Response:**

Returns the current market valuation of your inventory, with per-item best ask prices and line-item totals.

```json
{
  "meta": {
    "currency": "USD",
    "generated_at": "2026-03-22T15:30:45Z",
    "providers_queried": ["steam", "buff163"]
  },
  "data": {
    "line_items": [
      {
        "item_id": 1,
        "market_hash_name": "AK-47 | Redline (Field-Tested)",
        "phase": null,
        "quantity": 3,
        "best_ask": 2400,
        "item_value": 7200
      }
    ],
    "total_value": 12200,
    "items_valued": 2,
    "items_not_found": [5]
  }
}
```

**Notes:**

- Available to: `free` / `pro` / `quant`
- Authentication: Bearer API key
- `best_ask` is the minimum price across all queried providers, returned in minor units of the response currency
- `item_value` = `best_ask` × `quantity`, in minor units
- `total_value` = sum of all `item_value` amounts, in minor units
- Items not found in any provider are listed in `items_not_found` array
- Max batch size: 100 items per request
