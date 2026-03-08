# API Reference

This page documents the public CS2C-API market-data surface only.

For exact request and response schemas, use `../openapi/openapi.json`.

## Public Endpoint Groups

- Health: `/health`, `/ready`
- Catalog: `/v1/items`, `/v1/items/market-ids`, `/v1/providers`
- Prices and FX: `/v1/prices`, `/v1/prices/history`, `/v1/prices/candles`, `/v1/fx`
- Order flow: `/v1/bids`, `/v1/sales`
- Market analytics: `/v1/market/movers`, `/v1/market/rankings/{metric}`, `/v1/market/arbitrage`, `/v1/market/items/{item_id}`, `/v1/market/indicators`

## Notes

- Monetary values are returned in minor units unless otherwise documented.
- `providers` query params are repeatable.
- The bundled public OpenAPI spec is the schema source of truth.
