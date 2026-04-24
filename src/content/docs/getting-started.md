---
title: Quickstart
description: Go from zero to your first successful request with one API key and one endpoint.
order: 1
---

## 1. Set Environment Variables

```bash
export CS2C_API_BASE="https://api.cs2c.app/v1"
export CS2C_API_KEY="your_api_key_here"
```

## 2. Make Your First Request

### cURL

```bash
curl -sS \
  -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/prices?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&providers=steam&currency=USD&limit=5"
```

### Python

```python
import os
import requests

base = os.environ["CS2C_API_BASE"]
key = os.environ["CS2C_API_KEY"]

response = requests.get(
    f"{base}/prices",
    headers={"Authorization": f"Bearer {key}"},
    params={
        "market_hash_name": "AK-47 | Redline (Field-Tested)",
        "providers": "steam",
        "currency": "USD",
        "limit": 5,
    },
    timeout=20,
)
response.raise_for_status()
print(response.json())
```

### JavaScript

```javascript
const base = process.env.CS2C_API_BASE;
const key = process.env.CS2C_API_KEY;

const url = new URL(`${base}/prices`);
url.searchParams.set('market_hash_name', 'AK-47 | Redline (Field-Tested)');
url.searchParams.set('providers', 'steam');
url.searchParams.set('currency', 'USD');
url.searchParams.set('limit', '5');

const response = await fetch(url, {
  headers: { Authorization: `Bearer ${key}` },
});

if (!response.ok) {
  throw new Error(`${response.status} ${await response.text()}`);
}

console.log(await response.json());
```

## 3. Understand the Response

Most list endpoints return three top-level fields:

- `items`: the records you asked for
- `meta`: response context such as currency, filters, and returned providers
- `pagination`: page information

Example:

```json
{
  "meta": {
    "currency": "USD",
    "filters": {
      "market_hash_name": "★ Falchion Knife | Doppler (Minimal Wear)",
      "phase": "Phase 1",
      "requested_providers": [
        "gamerpay",
        "marketcsgo"
      ]
    },
    "returned_providers": [
      "marketcsgo"
    ]
  },
  "items": [
    {
      "provider": "marketcsgo",
      "item_id": 3739,
      "market_hash_name": "★ Falchion Knife | Doppler (Minimal Wear)",
      "phase": "Phase 1",
      "lowest_ask": 58915,
      "quantity": 1,
      "link": "https://cs2c.app/r/marketcsgo/3739",
      "url": "https://market.csgo.com/...",
      "timestamp": "2026-03-18T16:14:41.493719Z",
      "last_updated": "2026-03-18T16:54:58.782196Z"
    }
  ],
  "pagination": {
    "limit": 658,
    "offset": 0,
    "total": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

`lowest_ask: 2550` with `currency: USD` means `$25.50`.

## 4. Common Next Requests

```bash
# Get an item's `item_id`
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/items?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&limit=1"

# Get current buy orders (pro/quant)
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/bids?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&providers=steam&limit=5"

# Get recent sales (pro/quant)
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/sales?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&providers=csfloat&limit=10"

# Get historical prices (pro/quant)
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/prices/history?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&provider=steam&limit=50"
```

## 5. Common Failures

- `401` with `AUTH_INVALID_API_KEY`  
  Missing or invalid Bearer token.

- `429` with `RATE_LIMIT_EXCEEDED`  
  You are sending requests too quickly. Slow down and respect `Retry-After`.

- `429` with `RATE_LIMIT_MONTHLY_QUOTA_EXCEEDED`  
  You have used your monthly request quota.

- `503` with `PRICES_INDEX_UNAVAILABLE` or `BIDS_INDEX_UNAVAILABLE`  
  Temporary index issue. Retry shortly.

- `422` with `VALIDATION_ERROR`  
  One or more parameters are missing, malformed, or invalid.

## 6. Go Deeper

- [API Reference](/api-reference)
- [Core Concepts](/core-concepts)
