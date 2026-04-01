---
title: Market Analytics
description: Arbitrage scanning, technical indicators, and item-level analytics.
order: 15
---

## Market Intelligence

### Get Arbitrage Opportunities
>
> Scans all buy-side and sell-side providers for cross-market arbitrage opportunities, ranked by estimated net profit after fees.

- Endpoint: GET `/market/arbitrage`
- Tiers: `quant`
- Rate Limit: Quant: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| min_spread_pct | number | Minimum gross spread percentage to include. Default: `1.0`. |
| providers_buy | string[] | Buy-side provider key filters. Repeat to pass multiple. One of: `avanmarket`, `bitskins`, `buff163`, `buffmarket`, `c5`, `csdeals`, `csfloat`, `csgo500`, `csgoempire`, `csmoney_m`, `csmoney_t`, `cstrade`, `dmarket`, `ecosteam`, `gamerpay`, `haloskins`, `itradegg`, `lisskins`, `lootfarm`, `mannco`, `marketcsgo`, `pirateswap`, `rapidskins`, `shadowpay`, `skinbaron`, `skinflow`, `skinout`, `skinplace`, `skinport`, `skinscom`, `skinsmonkey`, `skinswap`, `skinvault`, `steam`, `swapgg`, `tradeit`, `waxpeer`, `whitemarket`, `youpin`. |
| providers_sell | string[] | Sell-side provider key filters (buy-order providers only). Repeat to pass multiple. One of: `buff163`, `buffmarket`, `c5`, `csfloat`, `dmarket`, `ecosteam`, `marketcsgo`, `steam`, `waxpeer`, `whitemarket`, `youpin`. |
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

- `buy_price_usd`, `sell_price_usd`, `estimated_fees_usd`, and `net_profit_usd` are decimal strings in USD (not minor units).
- Sell-side providers are limited to those with buy orders enabled.
- `pagination.total = -1` is intentional — ranking is computed live without a count pass.
- Passing `cursor` returns HTTP 400; use `offset` for pagination.

---

### Get Technical Indicators
>
> Computes technical analysis indicators (RSI, MACD, Bollinger Bands, ATR, VWAP, OBV, and more) from composite OHLCV candle data across all providers for a specified item.

- Endpoint: GET `/market/indicators`
- Tiers: `quant`
- Rate Limit: Quant: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | integer | Item ID to query. Takes precedence over `market_hash_name` if provided. |
| market_hash_name | string | Exact item name as it appears in inventory. |
| phase | string | Doppler/Gamma phase filter. One of: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`. |
| interval | string | Candle interval for indicator computation. One of: `1h`, `1d`. Default: `1d`. |
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

- Indicators are computed from composite candle data across all providers — no `provider` filter is supported on this endpoint.
- `close_price_usd` is retained for compatibility even when `currency` is not USD.
- `coverage.insufficient_for` lists indicators that could not be computed due to insufficient candle history.
- Price-level indicator values (SMA, EMA, Bollinger Bands, etc.) are in the requested `currency`.

---

### Get Item Analytics
>
> Returns per-item market analytics across providers for a specified time window, including best ask/bid summary, liquidity scoring, and per-provider depth and volume metrics.

- Endpoint: GET `/market/items/:item_id`
- Tiers: `pro` · `quant`
- Rate Limit: Pro: 100/min · Quant: 300/min

**Path Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| item_id | integer | Normalized catalog item ID to analyze. Use `/items` to look up IDs. |

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| timeframe | string | Analysis time window. One of: `1h`, `24h`, `7d`, `30d`. Default: `24h`. Note: `1h` reuses the 24h liquidity horizon. |

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
      "total_volume_24h": 3,
      "best_ask_usd": "58.41",
      "best_bid_usd": "61.74",
      "avg_spread_pct": 41.59,
      "liquidity_score": 46,
      "listing_score": 8,
      "gap_score": 18,
      "volume_score": 20,
      "doppler_bonus": false,
      "price_anomaly": false,
      "high_tier_override": false,
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
        "bid_anomaly": false
      }
    ],
    "coverage": {
      "provider_count": 5,
      "providers_with_volume": 3,
      "providers_with_bid_side": 5
    }
  }
}
```

- `best_ask_usd`, `ask_usd`, `bid_usd`, `spread_usd`, and `total_value_24h_usd` are decimal strings in USD (not minor units).
- Negative `spread_pct` means the best bid is higher than the best ask — flagged as `bid_anomaly: true`.
- `volume_24h` and `volume_7d` are `null` when the provider does not report sale history.

---
