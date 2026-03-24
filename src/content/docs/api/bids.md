---
title: Buy Orders
description: Real-time highest bids (buy orders) across all supported marketplaces.
order: 12
---

Buy order data is normalized to USD and refreshed concurrently with price data.

## Bids

### List Bids
> Returns a paginated list of current highest buy orders across all providers.

- **Endpoint**: `GET /v1/bids`
- **Tiers**: `free` · `pro` · `quant`

---

### Stream Full Bids Snapshot
> Captures the entire buy-order index and streams it as NDJSON.

- **Endpoint**: `POST /v1/bids`
- **Tiers**: `quant`

---

### Batch Bids Lookup
> Returns current highest buy orders for up to 100 items in a single request.

- **Endpoint**: `POST /v1/bids/batch`
- **Tiers**: `pro` · `quant`
