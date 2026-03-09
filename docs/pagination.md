# Pagination

CS2C-API uses three pagination patterns across the public surface.

## Pagination Types

1. Offset pagination
2. Cursor pagination
3. Bounded responses

## Offset Pagination

Use `limit` and `offset`.

Typical shape:

```json
{
  "items": [],
  "pagination": {
    "limit": 100,
    "offset": 0,
    "total": 1234,
    "has_next": true,
    "has_prev": false
  }
}
```

Common offset endpoints:

- `/v1/items`
- `/v1/prices`
- `/v1/bids`

Iteration rule:

- start at `offset=0`
- increase by `limit`
- stop when `has_next=false` or `items` is empty

## Cursor Pagination

Use `limit` and `cursor`.

Typical shape:

```json
{
  "items": [],
  "limit": 50,
  "has_next": true,
  "next_cursor": "opaque_token"
}
```

Common cursor endpoints:

- `/v1/prices/history`
- `/v1/prices/candles`
- `/v1/market/rankings/{metric}`
- `/v1/market/arbitrage`

Iteration rule:

- omit `cursor` on the first request
- pass `next_cursor` from the previous response
- stop when `has_next=false` or `next_cursor` is `null`

## Bounded Responses

Some endpoints return bounded datasets and do not expose offset or cursor contracts.

Examples:

- `/v1/sales`
- `/v1/market/items/{item_id}`
- `/v1/market/indicators`

## Python Cursor Loop

```python
import os
import requests

base = os.environ["CS2C_API_BASE"]
key = os.environ["CS2C_API_KEY"]
headers = {"Authorization": f"Bearer {key}"}

cursor = None
rows = []

while True:
    params = {
        "market_hash_name": "AK-47 | Redline (Field-Tested)",
        "provider": "steam",
        "limit": 100,
    }
    if cursor:
        params["cursor"] = cursor

    response = requests.get(
        f"{base}/v1/prices/history",
        headers=headers,
        params=params,
        timeout=20,
    )
    response.raise_for_status()
    payload = response.json()

    batch = payload.get("items", [])
    rows.extend(batch)

    if not payload.get("has_next") or not payload.get("next_cursor"):
        break

    cursor = payload["next_cursor"]
```

## JavaScript Offset Loop

```javascript
const base = process.env.CS2C_API_BASE;
const key = process.env.CS2C_API_KEY;
const limit = 100;
let offset = 0;

while (true) {
  const url = new URL(`${base}/v1/prices`);
  url.searchParams.set('market_hash_name', 'AK-47 | Redline (Field-Tested)');
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);

  const payload = await response.json();
  const batch = payload.items ?? [];

  if (!payload.pagination?.has_next || batch.length === 0) break;
  offset += limit;
}
```

## Best Practices

- keep `limit` at or below your tier cap
- prefer cursor pagination for long historical scans
- do not infer cursor totals from offset-style assumptions
- add retry and backoff handling for `429` and temporary `503` responses

## Related Guides

- [Getting Started](getting-started.md)
- [API Reference](api-reference.md)
