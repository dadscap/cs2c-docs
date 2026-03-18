---
hide:
  - toc
  - navigation
---

<div class="cs2c-hero" markdown>

<div class="cs2c-hero__eyebrow">CS2C-API</div>

# Real-time CS2 market data

<p class="cs2c-hero__sub">
  Prices, bids, sales, and analytics across 10+ providers. One REST API.
</p>

<div class="cs2c-tags">
  <span class="cs2c-tag">REST</span>
  <span class="cs2c-tag">JSON</span>
  <span class="cs2c-tag">Bearer Auth</span>
  <span class="cs2c-tag">Multi-Currency</span>
</div>

<div class="cs2c-hero__actions" markdown>
[Quick Start](getting-started.md){ .md-button .md-button--primary }
[API Reference](api-reference.md){ .md-button }
</div>

</div>

## Endpoints

<div class="grid cards" markdown>

- :material-tag-multiple: **Prices** · `GET /v1/prices`

    ---

    Lowest ask + quantity across 39 marketplaces.

- :material-chart-line: **History** · `GET /v1/prices/history`

    ---

    Timestamped price records for all marketplaces.

- :material-swap-horizontal: **Arbitrage** · `GET /v1/market/arbitrage`

    ---

    Fee-aware cross-markets spreads.

- :material-receipt-text: **Sales** · `GET /v1/sales`

    ---

    Detailed record of recent sales w/ float, pattern, stickers, etc.

- :material-gavel: **Bids** · `GET /v1/bids`

    ---

    Highest buy orders + depth on BUFF163, CSFloat, Steam, etc.

- :material-currency-usd: **FX** · `currency=USD`

    ---

    Conversion to 160+ currencies on the fly

</div>

## Try it

```bash
curl -H "Authorization: Bearer $CS2C_API_KEY" \
  "https://api.cs2c.app/v1/prices?market_hash_name=AK-47+%7C+Redline+(Field-Tested)&currency=USD"
```

```json
{
  "items": [{ "provider": "steam", "lowest_ask": 2550, "quantity": 1247, "currency": "USD" }],
  "pagination": { "total": 1, "limit": 100, "offset": 0 }
}
```

!!! tip "Minor units"
    `lowest_ask: 2550` + `currency: USD` = **$25.50**

## Limits

| | Free | Pro | Quant |
|---|:---:|:---:|:---:|
| **Req / min** | 20 | 100 | 300 |
| **Req / month** | 1,000 | 50,000 | 200,000 |
| **Max `limit`** | 100 | 1,000 | 1,000 |
