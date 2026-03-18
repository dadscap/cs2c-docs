---
hide:
  - toc
---

# CS2C-API Docs

<div class="docs-home-intro" markdown>
<div class="docs-home-kicker">CS2 Market Data API</div>
<p class="docs-home-dek">
CS2C-API exposes normalized CS2 prices, bids, sales, and market analytics through a single integration surface.
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
- List endpoints use both offset and cursor pagination depending on the route
</div>

</div>

## Core Endpoints

<div class="grid cards" markdown>

- **Prices** · `GET /prices`

    ---

    Best ask snapshots across providers.

- **History** · `GET /prices/history`

    ---

    Historical price records and candles.

- **Bids** · `GET /bids`

    ---

    Current buy orders for supported providers.

- **Sales** · `GET /sales`

    ---

    Recent transaction history with live fetch on cache miss.

- **Market** · `GET /market/arbitrage`

    Arbitrage and item-level market indicators.

- **FX** · `GET /fx`
 
    ---

    Conversion rates across 160+ currencies used across responses.

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
