---
title: Prices
description: Real-time and historical price data across all supported marketplaces.
order: 11
---

Price data is normalized to USD by default and refreshed at provider-specific intervals.

## Prices

### List Prices
> Returns a paginated list of current best-ask prices across all providers.

- **Endpoint**: `GET /v1/prices`
- **Tiers**: `free` · `pro` · `quant`

---

### Stream Full Prices Snapshot
> Captures the entire price index and streams it as NDJSON. Recommended for initial cache warming.

- **Endpoint**: `POST /v1/prices`
- **Tiers**: `quant`

---

### Batch Prices Lookup
> Returns current best-ask prices for up to 100 items in a single request.

- **Endpoint**: `POST /v1/prices/batch`
- **Tiers**: `pro` · `quant`

---

### Price History
> Returns historical price data for a single item.

- **Endpoint**: `GET /v1/prices/history`
- **Tiers**: `pro` · `quant`

---

### Price Candles
> Returns OHLCV candle aggregates for technical analysis.

- **Endpoint**: `GET /v1/prices/candles`
- **Tiers**: `pro` · `quant`
