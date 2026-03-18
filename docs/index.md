---
hide:
  - toc
  - navigation
---

<div class="cs2c-hero" markdown>

<div class="cs2c-hero__eyebrow">CS2C-API</div>

# Real-time CS2 market data

<p class="cs2c-hero__sub">
  Prices, bids, sales, and analytics from Steam, Skinport, CSFloat, and 10+
  providers — one REST API, one key, JSON everywhere.
</p>

<div class="cs2c-tags">
  <span class="cs2c-tag">REST / JSON</span>
  <span class="cs2c-tag">Bearer Auth</span>
  <span class="cs2c-tag">10+ Providers</span>
  <span class="cs2c-tag">Multi-Currency</span>
</div>

<div class="cs2c-hero__actions" markdown>
[Quick Start](getting-started.md){ .md-button .md-button--primary }
[API Reference](api-reference.md){ .md-button }
</div>

</div>

## Try it now

=== "cURL"

    ```bash
    curl -H "Authorization: Bearer $CS2C_API_KEY" \
      "https://api.cs2c.app/v1/prices?market_hash_name=AK-47+%7C+Redline+(Field-Tested)&currency=USD"
    ```

=== "Python"

    ```python
    import requests

    r = requests.get(
        "https://api.cs2c.app/v1/prices",
        headers={"Authorization": f"Bearer {API_KEY}"},
        params={"market_hash_name": "AK-47 | Redline (Field-Tested)",
                "currency": "USD"},
    )
    print(r.json())
    ```

=== "JavaScript"

    ```javascript
    const res = await fetch(
      "https://api.cs2c.app/v1/prices?" + new URLSearchParams({
        market_hash_name: "AK-47 | Redline (Field-Tested)",
        currency: "USD",
      }),
      { headers: { Authorization: `Bearer ${API_KEY}` } },
    );
    console.log(await res.json());
    ```

**Response**

```json
{
  "items": [
    {
      "provider": "steam",
      "market_hash_name": "AK-47 | Redline (Field-Tested)",
      "lowest_ask": 2550,
      "quantity": 1247,
      "currency": "USD",
      "link": "https://steamcommunity.com/market/..."
    }
  ],
  "pagination": { "total": 1, "limit": 100, "offset": 0 }
}
```

!!! tip "Minor units"
    `lowest_ask: 2550` with `currency: USD` = **$25.50**. All price fields use minor currency units.

## Endpoints

<div class="grid cards" markdown>

-   :material-tag-multiple: **Price Comparison**

    ---

    `GET /v1/prices` — lowest ask and available quantity for any item across
    multiple providers simultaneously.

    [:material-arrow-right: Reference](api-reference.md)

-   :material-chart-line: **Price History**

    ---

    `GET /v1/prices/history` — timestamped price records with cursor-based
    pagination for trend analysis and backtesting.

    [:material-arrow-right: Reference](api-reference.md)

-   :material-swap-horizontal: **Arbitrage**

    ---

    `GET /v1/market/arbitrage` — fee-aware cross-provider spreads so you
    can surface actionable edges between marketplaces.

    [:material-arrow-right: Reference](api-reference.md)

-   :material-receipt-text: **Recent Sales**

    ---

    `GET /v1/sales` — timestamped sale records across 10+ providers.
    1-hour cache per item — useful for demand analysis.

    [:material-arrow-right: Reference](api-reference.md#recent-sales)

-   :material-gavel: **Buy Orders**

    ---

    `GET /v1/bids` — highest bid and bid depth across 9 marketplaces.
    Surface buy-side demand to time listings.

    [:material-arrow-right: Reference](api-reference.md#buy-orders)

-   :material-currency-usd: **FX Conversion**

    ---

    Pass `currency` on any market-data endpoint — prices converted at
    response time. USD, EUR, CNY, and more.

    [:material-arrow-right: Reference](api-reference.md)

</div>

## Key concepts

| Concept | Detail |
|---------|--------|
| **Minor units** | `lowest_ask: 2550` + `currency: USD` = $25.50 |
| **Provider keys** | Use `steam`, `skinport`, `csfloat` — not display names |
| **Item identity** | Prefer `item_id` for stable integrations; `market_hash_name` for lookups |
| **Pagination** | Offset, cursor, or bounded depending on the endpoint — [details](pagination.md) |

## Tier limits

| | Free | Pro | Quant |
|---|:---:|:---:|:---:|
| **Requests / min** | 20 | 100 | 300 |
| **Requests / month** | 1,000 | 50,000 | 200,000 |
| **Max `limit`** | 100 | 1,000 | 1,000 |

!!! warning "Free tier: IP binding"
    First successful request binds the key to that source IP. Call
    `POST /v1/account/key/reset-ip` to rebind (once per 24 h).

---

<div class="cs2c-footer-links" markdown>

[:material-book-open-variant: Getting Started](getting-started.md) &middot;
[:material-key-variant: Authentication](authentication.md) &middot;
[:material-code-json: API Reference](api-reference.md) &middot;
[:material-book-outline: Core Concepts](core-concepts.md)

</div>
