---
title: Core Concepts
description: Canonical public terminology used across CS2C-API endpoints.
order: 3
---

## Terminology

| Term | Meaning | Common Fields | Primary Endpoints |
| ---- | ------- | ------------- | ----------------- |
| **Quote** | Current listing snapshot for one item on one provider. | `provider`, `item_id`, `lowest_ask`, `quantity`, `timestamp` | `/v1/prices` |
| **BuyOrderRecord** | Current highest bid snapshot for one item on one provider. | `provider`, `item_id`, `highest_bid`, `num_bids`, `timestamp` | `/v1/bids` |
| **SaleRecord** | Completed sale event. | `provider`, `item_id`, `price`, `date` | `/v1/sales` |
| **Provider** | Marketplace source such as `steam`, `skinport`, or `buff163`. | provider key, fee data, health metadata | `/v1/providers` |
| **Phase** | Doppler or Gamma Doppler variant marker. | `phase` | `/v1/items`, `/v1/prices`, `/v1/bids`, `/v1/sales`, `/v1/market/*` |
| **Wear** | Condition bucket from Factory New to Battle-Scarred. | item naming and float context | `/v1/items`, `/v1/sales` |
| **Liquidity Score** | Composite tradability score based on activity and supply. | liquidity metrics | `/v1/market/items/{item_id}` |
| **Arbitrage** | Cross-provider net edge after fee-aware comparison. | buy provider, sell provider, edge metrics | `/v1/market/arbitrage` |
| **Technical Indicators** | Live signals computed from composite candle data across providers. | RSI, MACD, SMA/EMA, Bollinger Bands, ATR, VWAP, OBV | `/v1/market/indicators` |
| **FX Conversion** | Currency normalization or response-time conversion of returned values. | `currency` query parameter | most market-data endpoints, `/v1/fx` |

## Data Semantics

### Prices Use Minor Units

Price integers are returned in minor units.

Examples:

- `USD`: cents
- `lowest_ask = 2550` means `$25.50`

This applies to fields such as `lowest_ask`, `highest_bid`, and `price`.

### Prices and Bids Are Indexed-Only

`/v1/prices` and `/v1/bids` are served from indexed Redis payloads.

- Temporary index unavailability or integrity failures return `503`.
- Clients should treat `PRICES_INDEX_UNAVAILABLE` and `BIDS_INDEX_UNAVAILABLE` as retryable conditions.

### Provider Keys Matter

Use provider keys in request parameters.

Examples:

- `steam`
- `skinport`
- `csfloat`

Do not substitute display names where provider keys are required.

### Item Identity

Most item lookup endpoints accept:

- `item_id` for stable production integration
- `market_hash_name` for human-readable lookup

Prefer `item_id` after your application has resolved it once.

### Optional Item Attributes

Some metadata is item-dependent rather than universal.

Examples:

- `phase`
- `wear_name`
- `min_float`
- `max_float`

Null often means the field is not relevant to that item.

## Common Pitfalls

- Treating price integers as major units
- Using provider display names instead of provider keys
- Assuming all items support phase metadata
- Confusing tracked redirect links with direct marketplace URLs
- Assuming prices and bids fall back to a non-indexed runtime path

## Related Guides

- [Getting Started](/quickstart)
- [API Reference](/api-reference)
