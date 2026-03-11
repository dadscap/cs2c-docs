# Changelog

Public-facing API and platform changes.

## 2026-03-09

- Prices and bids continue to use indexed-only delivery, with temporary `503` responses (`PRICES_INDEX_UNAVAILABLE`, `BIDS_INDEX_UNAVAILABLE`) when indexed data is unavailable or fails integrity checks.
- Removed the old market movers and rankings routes. The active market analytics surface is now:
  - `GET /v1/market/arbitrage`
  - `GET /v1/market/items/{item_id}`
  - `GET /v1/market/indicators`
- Indicators support non-USD output via the `currency` parameter.

## 2026-03-11

- `GET /v1/market/items/{item_id}` now uses preset `timeframe` windows only.
- The selected `timeframe` now affects the item-level liquidity summary only.
- Provider `volume_24h` and `volume_7d` remain literal trailing windows.
- Item analytics now return one item-level liquidity summary instead of provider-level liquidity metrics.
- Missing or stale item liquidity is recomputed on read from live Redis market state.
- Liquidity recomputation failures now degrade to stale-or-null liquidity instead of failing the item analytics response.
- Steam sold counts now feed liquidity scoring when available, with depletion activity as the fallback volume signal.
- Steam sold snapshots now carry per-item freshness metadata so stale sold counters are ignored.
- Item analytics volume reads now use aggregate-backed depletion data instead of raw history scans.

## 2026-03-07

- Added `GET /v1/items/market-ids` to expose provider-native identifiers in one authenticated response.
- Added optional `supply` to `/v1/items`.
- Volume analytics now use depletion-activity semantics while preserving stable response field names.

## 2026-03-04 to 2026-03-06

- Added OAuth signup/login for Steam, Google, and Discord.
- Email verification is required before initial API key issuance.
- Free-tier keys remain bound to a single source IP unless reset through the account flow.
- Added Stripe-backed billing and tier-management flows.
