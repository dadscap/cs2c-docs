# Getting Started

Make your first successful CS2C-API request in a few minutes.

## Prerequisites

- Base URL: `https://api.cs2c.app`
- An API key
- `curl`, Python, or a JavaScript runtime

If you do not have a key yet, follow [Authentication](authentication.md). Initial API key issuance requires a verified email, and free-tier keys bind to a single source IP on first successful use.

## 1. Set Environment Variables

```bash
export CS2C_API_BASE="https://api.cs2c.app"
export CS2C_API_KEY="your_api_key_here"
```

## 2. Make Your First Request

`GET /v1/prices` is the fastest path to a useful first response. Prices and bids are indexed-only runtime endpoints, so temporary indexed-data issues return `503` and should be retried shortly.

### cURL

```bash
curl -sS \
  -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/v1/prices?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&providers=steam&currency=USD&limit=5"
```

### Python

```python
import os
import requests

base = os.environ["CS2C_API_BASE"]
key = os.environ["CS2C_API_KEY"]

response = requests.get(
    f"{base}/v1/prices",
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

const url = new URL(`${base}/v1/prices`);
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

## 3. Read the Response

Typical `GET /v1/prices` fields:

- `items[]`: provider quote rows
- `provider`: marketplace key
- `lowest_ask`: price in minor units
- `quantity`: available listing count
- `currency`: response currency
- `link`: tracked redirect URL
- `pagination`: result-window metadata

Example:

- `lowest_ask: 2550` with `currency: USD` means `$25.50`

## 4. Common Next Requests

### Resolve canonical item IDs

```bash
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/v1/items?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&limit=1"
```

### Fetch provider-native market IDs in bulk

```bash
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/v1/items/market-ids"
```

### Fetch bids

```bash
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/v1/bids?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&providers=steam&limit=5"
```

### Fetch recent sales

```bash
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/v1/sales?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&providers=csfloat&limit=10"
```

### Scan price history

```bash
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/v1/prices/history?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&provider=steam&limit=50"
```

## 5. Quick Troubleshooting

- `401` with `AUTH_INVALID_API_KEY`: missing or invalid Bearer token
- `403` with `AUTH_FREE_TIER_IP_RESTRICTED`: free-tier key is being used from a different source IP
- If that happens on free tier, call `POST /v1/account/key/reset-ip` from the new IP to rebind the
  key. The endpoint is limited to once every 24 hours.
- `429` with `RATE_LIMIT_EXCEEDED`: slow down and respect `Retry-After`
- `429` with `RATE_LIMIT_MONTHLY_QUOTA_EXCEEDED`: tier quota exhausted
- `503` with `PRICES_INDEX_UNAVAILABLE` or `BIDS_INDEX_UNAVAILABLE`: retry shortly
- `422` with `VALIDATION_ERROR`: request shape or parameter values are invalid

## 6. Where To Go Next

- [Authentication](authentication.md)
- [API Reference](api-reference.md)
- [Pagination](pagination.md)
- [Core Concepts](core-concepts.md)
