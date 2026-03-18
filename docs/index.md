---
hide:
  - toc
---

# CS2C-API Docs

<div class="docs-home-intro" markdown>
<div class="docs-home-kicker">Reference</div>
<p class="docs-home-dek">
CS2C-API is a REST API for normalized CS2 prices, bids, sales, and market analytics across multiple providers.
</p>
</div>

<div class="docs-home-grid" markdown>

<div class="docs-home-card" markdown>
## Start Here

- [Quickstart](getting-started.md)
- [Authentication](api-reference.md#authentication)
- [Rate limits and tiers](api-reference.md#rate-limits)
- [Core concepts](core-concepts.md)
</div>

<div class="docs-home-card" markdown>
## Response Conventions

- Prices and bids use minor units: `2550 USD` means `$25.50`
- `providers` is repeatable; `provider` is a single string
- `/v1/prices` and `/v1/bids` are indexed-only and may return retryable `503`s
</div>

</div>

## Core Endpoints

<div class="grid cards" markdown>

- **Prices** · `GET /v1/prices`

    ---

    Best ask snapshots across providers.

- **History** · `GET /v1/prices/history`

    ---

    Historical price records and candles.

- **Bids** · `GET /v1/bids`

    ---

    Current buy orders for supported providers.

- **Sales** · `GET /v1/sales`

    ---

    Recent transaction history with live fetch on cache miss.

- **Market** · `GET /v1/market/arbitrage`

    Arbitrage and item-level market indicators.

- **FX** · `GET /v1/fx`

    Currency conversion rates used across responses.

</div>

## First Request

```bash
curl -sS \
  -H "Authorization: Bearer $CS2C_API_KEY" \
  "https://api.cs2c.app/v1/prices?market_hash_name=AK-47+%7C+Redline+(Field-Tested)&providers=steam&currency=USD&limit=1"
```

```json
{
  "items": [
    {
      "provider": "steam",
      "lowest_ask": 2550,
      "quantity": 1247,
      "currency": "USD"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 1,
    "offset": 0
  }
}
```

<div class="docs-home-meta" markdown>
Need tiers, quotas, and account flows? See the [API Reference](api-reference.md).
</div>
