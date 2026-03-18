# Quickstart

Get from zero to a successful request with one API key and one endpoint.

## 1. Set Environment Variables

```bash
export CS2C_API_BASE="https://api.cs2c.app/v1"
export CS2C_API_KEY="your_api_key_here"
```

## 2. Make Your First Request

=== "cURL"

    ```bash
    curl -sS \
      -H "Authorization: Bearer $CS2C_API_KEY" \
      "$CS2C_API_BASE/prices?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&providers=steam&currency=USD&limit=5"
    ```

=== "Python"

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

=== "JavaScript"

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

## 3. Response

List endpoints generally return:

- `items`: returned records
- `meta`: applied filters and response context when relevant
- `pagination`: page state and limits

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
            "url": "https://market.csgo.com/%E2%98%85%20Falchion%20Knife%20%7C%20Doppler%20%28Minimal%20Wear%29?phase-product=phase1",
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

# Get all marketplace-specific IDs
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/items/market-ids"

# Get current buy orders (`pro`/`quant`)
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/bids?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&providers=steam&limit=5"

# Get recent sales (`pro`/`quant`)
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/sales?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&providers=csfloat&limit=10"

# Get historical prices (`pro`/`quant`)
curl -sS -H "Authorization: Bearer $CS2C_API_KEY" \
  "$CS2C_API_BASE/prices/history?market_hash_name=AK-47%20%7C%20Redline%20(Field-Tested)&provider=steam&limit=50"
```

## 5. Common Failures

- `401` with `AUTH_INVALID_API_KEY`: missing or invalid Bearer token
- `403` with `AUTH_FREE_TIER_IP_RESTRICTED`: free-tier key is being used from a different source IP
- If that happens on free tier, call `POST /account/key/reset-ip` from the new IP to rebind the
  key. The endpoint is limited to once every 24 hours.
- `429` with `RATE_LIMIT_EXCEEDED`: slow down and respect `Retry-After`
- `429` with `RATE_LIMIT_MONTHLY_QUOTA_EXCEEDED`: tier quota exhausted
- `503` with `PRICES_INDEX_UNAVAILABLE` or `BIDS_INDEX_UNAVAILABLE`: retry shortly
- `422` with `VALIDATION_ERROR`: request shape or parameter values are invalid

## 6. Go Deeper

- [API Reference](api-reference.md)
- [Core Concepts](core-concepts.md)
