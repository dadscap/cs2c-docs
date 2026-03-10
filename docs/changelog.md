# Changelog

Public-facing API and platform changes.

## 2026-03-09

- Prices and bids continue to use indexed-only delivery, with temporary `503` responses (`PRICES_INDEX_UNAVAILABLE`, `BIDS_INDEX_UNAVAILABLE`) when indexed data is unavailable or fails integrity checks.
- Removed the old market movers and rankings routes. The active market analytics surface is now:
  - `GET /v1/market/arbitrage`
  - `GET /v1/market/items/{item_id}`
  - `GET /v1/market/indicators`
- Item analytics now support explicit `start_at` and `end_at` windows and return effective window metadata in `meta.window`.
- Indicators support non-USD output via the `currency` parameter.

## 2026-03-07

- Added `GET /v1/items/market-ids` to expose provider-native identifiers in one authenticated response.
- Added optional `supply` to `/v1/items`.
- Updated market item analytics to support explicit time-range filters in addition to preset timeframes.
- Volume analytics now use depletion-activity semantics while preserving stable response field names.

## 2026-03-04 to 2026-03-06

- Added OAuth signup/login for Steam, Google, and Discord.
- Email verification is required before initial API key issuance.
- Free-tier keys remain bound to a single source IP unless reset through the account flow.
- Added Stripe-backed billing and tier-management flows.
