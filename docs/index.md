---
hide:
  - toc
  - navigation
---

<div class="cs2c-hero" markdown>

# CS2C-API

<p class="cs2c-hero__sub">
  Real-time Counter-Strike 2 market data. Prices, bids, sales, and analytics
  — aggregated across providers, accessible via a single REST API.
</p>

<div class="cs2c-tags">
  <span class="cs2c-tag">REST</span>
  <span class="cs2c-tag">JSON</span>
  <span class="cs2c-tag">Bearer Auth</span>
  <span class="cs2c-tag">USD · EUR · CNY · +more</span>
  <span class="cs2c-tag">Steam · Skinport · CSFloat · +more</span>
</div>

<div class="cs2c-hero__actions" markdown>
[Get Started](getting-started.md){ .md-button .md-button--primary }
[API Reference](api-reference.md){ .md-button }
</div>

</div>

## What you can build

<div class="grid cards" markdown>

-   :material-tag-multiple: **Price Comparison**

    ---

    Query `GET /v1/prices` to retrieve the lowest ask and available quantity
    for any CS2 item across multiple providers simultaneously.

    [View prices endpoint](api-reference.md)

-   :material-chart-line: **Price History & Candles**

    ---

    Retrieve timestamped price history and OHLCV candles for trend analysis,
    backtesting, or charting — with cursor-based pagination for deep scans.

    [View history endpoints](api-reference.md)

-   :material-swap-horizontal: **Arbitrage Detection**

    ---

    `GET /v1/market/arbitrage` returns fee-aware cross-provider edges so you
    can surface actionable spreads between Steam, Skinport, CSFloat, and more.

    [View arbitrage endpoint](api-reference.md)

-   :material-receipt-text: **Recent Sales**

    ---

    `GET /v1/sales` fetches timestamped sale records across 10+ providers.
    Live-queried with a 1-hour cache per item/provider — useful for demand
    analysis and fair-value pricing.

    [View sales endpoint](api-reference.md#recent-sales)

-   :material-gavel: **Buy Orders**

    ---

    `GET /v1/bids` returns the highest bid and bid depth per provider across
    9 marketplaces. Surface buy-side demand to time listings or spot
    undervalued items.

    [View bids endpoint](api-reference.md#buy-orders)

-   :material-currency-usd: **FX Conversion**

    ---

    Pass a `currency` query parameter on any market-data endpoint and receive
    prices converted at response time — no client-side math required.

    [View FX support](api-reference.md)

</div>

## Start in minutes

!!! tip "No SDK required"
    The API is plain JSON over HTTPS. Any HTTP client works.

=== "cURL"

    ```bash
    export CS2C_API_KEY="your_api_key_here"

    curl -sS \
      -H "Authorization: Bearer $CS2C_API_KEY" \
      "https://api.cs2c.app/v1/prices?market_hash_name=AK-47%20%7C%20Redline%20%28Field-Tested%29&providers=steam&currency=USD&limit=5"
    ```

=== "Python"

    ```python
    import os, requests

    r = requests.get(
        "https://api.cs2c.app/v1/prices",
        headers={"Authorization": f"Bearer {os.environ['CS2C_API_KEY']}"},
        params={"market_hash_name": "AK-47 | Redline (Field-Tested)",
                "providers": "steam", "currency": "USD", "limit": 5},
        timeout=20,
    )
    r.raise_for_status()
    print(r.json())
    ```

=== "JavaScript"

    ```javascript
    const url = new URL("https://api.cs2c.app/v1/prices");
    url.searchParams.set("market_hash_name", "AK-47 | Redline (Field-Tested)");
    url.searchParams.set("providers", "steam");
    url.searchParams.set("currency", "USD");
    url.searchParams.set("limit", "5");

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.CS2C_API_KEY}` },
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    console.log(await res.json());
    ```

## Key concepts

<div class="grid cards" markdown>

-   :material-information-outline: **Minor units**

    ---

    All price integers are in minor currency units.
    `lowest_ask: 2550` with `currency: USD` = **$25.50**.

-   :material-key-variant: **Provider keys**

    ---

    Use provider keys (`steam`, `skinport`, `csfloat`) in request params —
    not display names.

-   :material-identifier: **Item identity**

    ---

    Accept either `item_id` or `market_hash_name`. Resolve once and
    prefer `item_id` for stable production integrations.

-   :material-book-open-page-variant: **Pagination patterns**

    ---

    Offset, cursor, or bounded — depending on the endpoint.
    See [Pagination](pagination.md) for loop examples.

</div>

## Tier limits

| Tier | Req / min | Req / month | Max `limit` |
|------|-----------|-------------|-------------|
| `free` | 20 | 1,000 | 100 |
| `pro` | 100 | 50,000 | 1,000 |
| `quant` | 300 | 200,000 | 1,000 |

!!! warning "Free tier IP binding"
    The first successful request from a free-tier key binds it to that source IP.

## OpenAPI spec

The bundled public OpenAPI spec covers the full externally-documented
market-data surface and can be used for SDK generation and tooling.

```text
../openapi/openapi.json
```
