---
title: Core Concepts
description: Plain-language explanations of the terms used across CS2Cap endpoints.
order: 3
---

## Terminology

| Term | Meaning | Common Fields | Primary Endpoints |
| ---- | ------- | ------------- | ----------------- |
| **Quote** | The current listing snapshot for one item on one provider. | `provider`, `item_id`, `lowest_ask`, `quantity`, `timestamp` | `/v1/prices` |
| **BuyOrderRecord** | The current highest bid snapshot for one item on one provider. | `provider`, `item_id`, `highest_bid`, `num_bids`, `timestamp` | `/v1/bids` |
| **SaleRecord** | A completed sale. | `provider`, `item_id`, `price`, `date` | `/v1/sales` |
| **Provider** | A marketplace source such as `steam`, `skinport`, or `buff163`. | provider key, fee data, health metadata | `/v1/providers` |
| **Phase** | A Doppler or Gamma Doppler variant label. | `phase` | `/v1/items`, `/v1/prices`, `/v1/bids`, `/v1/sales`, `/v1/market/*` |
| **Wear** | The item's condition bucket, from Factory New to Battle-Scarred. | item naming and float context | `/v1/items`, `/v1/sales` |
| **Liquidity Score** | A 0–100 score reflecting how tradable an item is. It combines listing depth, bid/ask gap ratio, 24h consumption churn, price stability over the last 24h, and external volume signals. Items with fewer than 2 active hours of history are scored from the first three components only, rescaled to 100. | liquidity metrics | `/v1/market/items/{item_id}` |
| **Arbitrage** | A cross-provider price edge after marketplace fees are taken into account. | buy provider, sell provider, edge metrics | `/v1/market/arbitrage` |
| **Technical Indicators** | Trading signals calculated from composite candle data across providers. | RSI, MACD, SMA/EMA, Bollinger Bands, ATR, VWAP, OBV | `/v1/market/indicators` |
| **FX Conversion** | Currency conversion applied to returned values. | `currency` query parameter | most market-data endpoints, `/v1/fx` |

## Data Semantics

### Prices Use Minor Units

Price fields are returned as integers in the smallest unit of the response currency.

Examples:

- `USD`: cents
- `lowest_ask = 2550` means `$25.50`

This applies to fields such as `lowest_ask`, `highest_bid`, and `price`.

### Prices and Bids Come From Indexed Data Only

`/v1/prices` and `/v1/bids` are served from indexed Redis payloads.

- If the index is temporarily unavailable or fails an integrity check, the API returns `503`.
- Treat `PRICES_INDEX_UNAVAILABLE` and `BIDS_INDEX_UNAVAILABLE` as temporary errors and retry.

There is no slower non-indexed fallback path for these endpoints.

### Provider Keys Matter

When a request expects a provider, use the provider key.

Examples:

- `steam`
- `skinport`
- `csfloat`

Do not use display names where provider keys are required.

### Item Identity

Most item lookup endpoints accept:

- `item_id` for stable production use
- `market_hash_name` for human-readable lookup

Once your application has resolved an `item_id`, prefer using that.

### Optional Item Attributes

Some metadata only applies to certain items.

Examples:

- `phase`
- `wear_name`
- `min_float`
- `max_float`

A `null` value often means the field is not relevant to that item.

## Common Pitfalls

- Treating price integers as full currency amounts instead of minor units
- Using provider display names instead of provider keys
- Assuming every item supports phase metadata
- Confusing tracked redirect links with direct marketplace URLs
- Assuming prices and bids fall back to a live non-indexed path

## Related Guides

- [Getting Started](/quickstart)
- [API Reference](/api-reference)
