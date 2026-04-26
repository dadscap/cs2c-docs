---
title: Market Analytics
description: Arbitrage scanning, category indexes, technical indicators, and item-level analytics.
order: 15
---

## Market Intelligence

### Get Arbitrage Opportunities
>
> Scans buy-side and sell-side providers for cross-market arbitrage opportunities, then ranks the results by estimated net profit after fees.

- Endpoint: GET `/market/arbitrage`
- Tiers: `quant`
- Rate Limit: Quant: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| min_spread_pct | number | Minimum gross spread percentage to include. Default: `1.0`. |
| providers_buy | string[] | Buy-side provider keys. Repeat the parameter to pass more than one. One of: `avanmarket`, `bitskins`, `buff163`, `buffmarket`, `c5`, `csdeals`, `csfloat`, `csgo500`, `csgoempire`, `csmoney_m`, `csmoney_t`, `cstrade`, `dmarket`, `ecosteam`, `gamerpay`, `haloskins`, `itradegg`, `lisskins`, `lootfarm`, `mannco`, `marketcsgo`, `pirateswap`, `rapidskins`, `shadowpay`, `skinbaron`, `skinflow`, `skinout`, `skinplace`, `skinport`, `skinscom`, `skinsmonkey`, `skinswap`, `skinvault`, `steam`, `swapgg`, `tradeit`, `waxpeer`, `whitemarket`, `youpin`. |
| providers_sell | string[] | Sell-side provider keys. Repeat the parameter to pass more than one. Only providers with buy orders are valid here: `buff163`, `buffmarket`, `c5`, `csfloat`, `dmarket`, `ecosteam`, `marketcsgo`, `steam`, `waxpeer`, `whitemarket`, `youpin`. |
| limit | integer | Results per page. |
| offset | integer | Pagination offset. Default: `0`. |

**Response Example:**

```json
{
    "meta": {...},
    "data": {
        "items": [
            {
                "item_id": 10108,
                "market_hash_name": "★ M9 Bayonet | Fade (Factory New)",
                "phase": null,
                "buy_provider": "skinscom",
                "sell_provider": "steam",
                "buy_price_usd": "1119.70",
                "sell_price_usd": "1427.03",
                "gross_spread_pct": 27.45,
                "estimated_fees_usd": "185.51",
                "net_profit_usd": "121.82",
                "last_updated": "2026-03-21T06:30:32.692372Z"
            },
            {
                "item_id": 9505,
                "market_hash_name": "★ StatTrak™ Flip Knife | Bright Water (Well-Worn)",
                "phase": null,
                "buy_provider": "csfloat",
                "sell_provider": "buff163",
                "buy_price_usd": "150.19",
                "sell_price_usd": "217.30",
                "gross_spread_pct": 44.68,
                "estimated_fees_usd": "5.43",
                "net_profit_usd": "61.68",
                "last_updated": "2026-03-21T06:30:32.692372Z"
            }
        ]
    },
    "pagination": {...}
}
```

- `buy_price_usd`, `sell_price_usd`, `estimated_fees_usd`, and `net_profit_usd` are decimal strings in USD, not minor units.
- Sell-side providers are limited to providers that support buy orders.
- `pagination.total = -1` is intentional because the ranking is computed live without a count pass.
- `cursor` is not supported here. Passing it returns HTTP 400. Use `offset` pagination instead.

---

### Get Market Indexes
>
> Aggregates the cached 24h market snapshot into category-level market cap indexes using either `item_type` or `weapon_type`.

- Endpoint: GET `/market/indexes`
- Tiers: `quant`
- Rate Limit: Quant: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| group_by | string | Catalog dimension to group by. One of: `item_type`, `weapon_type`. Default: `item_type`. |

**Response Example:**

```json
{
  "meta": {
    "generated_at": "2026-01-20T12:06:10Z",
    "data_source": "cache",
    "freshness_sec": 18,
    "window": {
      "timeframe": "24h"
    },
    "group_by": "item_type"
  },
  "data": {
    "total_marketcap_usd": "576594.00",
    "groups": [
      {
        "group": "weapon",
        "marketcap_usd": "576594.00",
        "item_count": 2,
        "included_count": 2,
        "excluded_count": 0
      },
      {
        "group": "wearable",
        "marketcap_usd": "0.00",
        "item_count": 1,
        "included_count": 0,
        "excluded_count": 1
      }
    ]
  }
}
```

- `meta.window.timeframe` is always `24h`.
- `groups` are sorted by `marketcap_usd` descending.
- Item contribution uses an internal spread threshold; it is not user-configurable.
- Items missing the requested grouping field are omitted instead of being bucketed as `unknown`.
- Groups remain in the response even when every item in that group was excluded from the total.

---

### Get Technical Indicators
>
> Computes technical indicators such as RSI, MACD, Bollinger Bands, ATR, VWAP, and OBV from composite OHLCV candles across all providers for a single item.

- Endpoint: GET `/market/indicators`
- Tiers: `quant`
- Rate Limit: Quant: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | integer | Item ID to query. If provided, it takes precedence over `market_hash_name`. |
| market_hash_name | string | Exact item name as it appears in inventory. |
| phase | string | Doppler/Gamma phase filter. One of: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`. |
| interval | string | Candle interval used for indicator computation. One of: `1h`, `1d`. Default: `1d`. |
| currency | string | Output currency for price-level indicators. Default: `USD`. |

**Response Example:**

```json
{
    "meta": {...},
    "data": {
        "item_id": 156,
        "market_hash_name": "AK-47 | Redline (Field-Tested)",
        "phase": null,
        "provider": "All Providers",
        "interval": "1d",
        "close_price_usd": "25.50",
        "momentum": {
            "rsi_14": 62.5,
            "macd_line": 0.45,
            "macd_signal": 0.32,
            "macd_histogram": 0.13,
            "sma_20": 25.30,
            "sma_50": 24.80,
            "sma_200": 23.50,
            "ema_12": 25.45,
            "ema_26": 25.00,
            "bb_upper": 27.10,
            "bb_middle": 25.30,
            "bb_lower": 23.50
        },
        "volatility": {
            "atr_14": 1.25,
            "historical_volatility_20": 0.35,
            "kc_upper": 27.95,
            "kc_middle": 25.45,
            "kc_lower": 22.95
        },
        "volume": {
            "vwap": 25.15,
            "obv": 12500,
            "volume_sma_20": 520
        },
        "signals": {
            "rsi": "neutral",
            "macd": "bullish",
            "trend": "bullish",
            "bollinger": "neutral",
            "volatility": "normal",
            "composite_score": 0.55
        },
        "coverage": {
            "candle_count": 250,
            "first_bucket": "2025-06-26T00:00:00Z",
            "last_bucket": "2026-02-20T00:00:00Z",
            "sufficient_for": ["rsi_14", "macd", "sma_20", "sma_50", "sma_200"],
            "insufficient_for": []
        }
    }
}
```

- Indicators are computed from composite candles across all providers. This endpoint does not support a `provider` filter.
- `close_price_usd` is kept for compatibility even when `currency` is not USD.
- `coverage.insufficient_for` lists indicators that could not be calculated because there was not enough candle history.
- Price-level indicators such as SMA, EMA, and Bollinger Bands are returned in the requested `currency`.

---

### Get Market Analytics Snapshot
>
> Returns a cached market-wide summary snapshot with one row per catalog item.

- Endpoint: GET `/market/items`
- Tiers: `pro` · `quant`
- Rate Limit: Pro: 100/min · Quant: 300/min

No query parameters. Liquidity is always scored against the 24h horizon.

**Response Example:**

```json
{
  "meta": {...},
  "data": {
    "items": [
      {
        "item_id": 156,
        "market_hash_name": "AK-47 | Redline (Field-Tested)",
        "phase": null,
        "summary": {
          "provider_count": 2,
          "best_ask_usd": "24.90",
          "best_bid_usd": "24.90",
          "avg_spread_pct": 2.78,
          "liquidity": 78,
          "supply": 9060,
          "rank": 1292,
          "marketcap": "225594.00",
          "price_rate_24h": 3.75,
          "price_diff_24h": "0.90",
          "price_rate_7d": 8.26,
          "price_diff_7d": "1.90",
          "price_rate_30d": -2.73,
          "price_diff_30d": "-0.70",
          "sales_1d": 107,
          "total_volume_24h": 107,
          "sales_7d": 687,
          "sales_30d": 2096,
          "steam_sales_7d": 34,
          "steam_sales_30d": 587,
          "listing_score": 12,
          "gap_score": 7,
          "volume_score": 24,
          "stability_score": 15,
          "external_score": 14,
          "liquidity_last_updated": "2026-03-21T06:48:43.193895Z"
        }
      }
    ]
  }
}
```

- This endpoint returns summary rows only. There is no `pagination`, `providers`, or `coverage` section.
- Rows are sorted by rank, then by item ID.
- `summary.provider_count` is the number of providers that currently have at least one active listing for the item.
- `summary.best_ask_usd` and the `summary.price_*` fields are calculated from that same current ask-provider set.
- `summary.best_bid_usd` is still the highest bid across all providers, including providers that may not currently have an ask.
- `summary.supply` uses extended catalog `supply` when available. If not, it falls back to the current summed listing count across marketplaces.
- `summary.marketcap` is `best_ask_usd * supply`, in USD major units.
- `summary.price_diff_24h`, `summary.price_diff_7d`, and `summary.price_diff_30d` are USD deltas versus the latest provider-scoped historical close at or before each cutoff.
- `summary.price_rate_24h`, `summary.price_rate_7d`, and `summary.price_rate_30d` are the same changes as percentages.
- Each time window independently chooses the current cheapest provider that has usable history for that window.
- `summary.sales_*` and `summary.total_volume_24h` are depletion-based trade proxies. They are useful estimates, but not guaranteed exact sale counts.
- `summary.steam_sales_*` comes from the Steam bulk feed when available.
- If the cached snapshot is stale, the API tries to rebuild it. If that refresh fails, it falls back to the last good snapshot.

---

### Get Item Analytics
>
> Returns per-item market analytics, including a summary plus per-provider depth, spread, and volume data. Liquidity is always scored against the 24h horizon.

- Endpoint: GET `/market/items/{item_id}`
- Tiers: `pro` · `quant`
- Rate Limit: Pro: 100/min · Quant: 300/min

**Path Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| item_id | integer | Catalog item ID to analyze. Use `/items` to look up IDs. |

**Response Example:**

```json
{
  "meta": {...},
  "data": {
    "item_id": 15652,
    "market_hash_name": "StatTrak™ SCAR-20 | Cardiac (Factory New)",
    "phase": null,
    "summary": {
      "provider_count": 5,
      "best_ask_usd": "58.41",
      "best_bid_usd": "61.74",
      "avg_spread_pct": 41.59,
      "liquidity": 46,
      "supply": 9060,
      "rank": 1292,
      "marketcap": "529194.60",
      "price_rate_24h": -4.48,
      "price_diff_24h": "-2.74",
      "price_rate_7d": 6.11,
      "price_diff_7d": "3.36",
      "price_rate_30d": 12.37,
      "price_diff_30d": "6.43",
      "sales_1d": 3,
      "total_volume_24h": 3,
      "sales_7d": 18,
      "sales_30d": 71,
      "steam_sales_7d": 34,
      "steam_sales_30d": 587,
      "listing_score": 9,
      "gap_score": 5,
      "volume_score": 18,
      "stability_score": 7,
      "external_score": 7,
      "liquidity_last_updated": "2026-03-21T06:48:43.193895Z"
    },
    "providers": [
      {
        "provider": "buff163",
        "ask_usd": "66.67",
        "bid_usd": "41.60",
        "spread_usd": "25.07",
        "spread_pct": 37.61,
        "ask_depth": 16,
        "bid_depth": 9,
        "volume_24h": 2,
        "volume_7d": 8,
        "total_value_24h_usd": "133.34",
        "price_rate_24h": -1.96,
        "price_diff_24h": "-1.33",
        "price_rate_7d": 4.17,
        "price_diff_7d": "2.67",
        "price_rate_30d": null,
        "price_diff_30d": null,
        "bid_anomaly": false
      },
      {
        "provider": "steam",
        "ask_usd": "92.41",
        "bid_usd": "61.32",
        "spread_usd": "31.09",
        "spread_pct": 33.64,
        "ask_depth": 1,
        "bid_depth": 150,
        "volume_24h": 1,
        "volume_7d": 0,
        "total_value_24h_usd": "92.41",
        "price_rate_24h": null,
        "price_diff_24h": null,
        "price_rate_7d": 2.13,
        "price_diff_7d": "1.93",
        "price_rate_30d": 9.16,
        "price_diff_30d": "7.76",
        "bid_anomaly": false
      },
      {
        "provider": "skinport",
        "ask_usd": "58.41",
        "bid_usd": null,
        "spread_usd": null,
        "spread_pct": null,
        "ask_depth": 3,
        "bid_depth": null,
        "volume_24h": null,
        "volume_7d": null,
        "total_value_24h_usd": null,
        "price_rate_24h": -4.48,
        "price_diff_24h": "-2.74",
        "price_rate_7d": null,
        "price_diff_7d": null,
        "price_rate_30d": null,
        "price_diff_30d": null,
        "bid_anomaly": null
      }
    ],
    "coverage": {
      "provider_count": 5,
      "providers_with_volume": 3,
      "providers_with_bid_side": 2
    }
  }
}
```

- `best_ask_usd`, `ask_usd`, `bid_usd`, `spread_usd`, and `total_value_24h_usd` are decimal strings in USD, not minor units.
- `data.providers[]` is ask-driven. Providers with a live ask but no current bid still appear, with `bid_usd`, `spread_usd`, `spread_pct`, and `bid_depth` set to `null`.
- `summary.provider_count` and `coverage.provider_count` count providers with at least one active listing, even if a spread is not available for every provider.
- `summary.marketcap` is `best_ask_usd * supply`, in USD major units.
- `summary.supply` uses extended catalog `supply` when available. If not, it falls back to the current summed listing count across marketplaces.
- `data.providers[].price_diff_*` values are USD deltas versus the latest provider-scoped historical close at or before each cutoff.
- `data.providers[].price_rate_*` values are the same changes as percentages.
- `data.summary.best_ask_usd` and `data.summary.price_*` are calculated from that same current ask-provider set.
- `data.summary.best_bid_usd` is the highest bid across all providers, even if that top bid comes from a provider that does not appear in `data.providers[]`.
- `data.summary.price_*` fields are chosen separately for each time window from the current cheapest provider that has usable history for that window.
- `summary.sales_*` and `summary.total_volume_24h` are depletion-based trade proxies. They are useful estimates, but not guaranteed exact sale counts.
- `summary.steam_sales_*` comes from the Steam bulk feed when available.
- A negative `spread_pct` means the best bid is higher than the best ask. That case is flagged as `bid_anomaly: true`.
- `volume_24h` and `volume_7d` are `null` when the provider does not report sale history.
