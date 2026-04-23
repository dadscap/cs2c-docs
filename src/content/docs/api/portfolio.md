---
title: Portfolio Management
description: Create portfolios, track transactions, import inventories, and value holdings.
order: 13
---

The Portfolio API supports two use cases:

- **Stateless valuation** for one-off item lists you send in the request
- **Saved portfolios** that store items and transactions under your account

Portfolio item limits depend on tier:

- `free`: up to `1000` items per portfolio
- `pro`: up to `5000` items per portfolio
- `quant`: up to `10000` items per portfolio

The same limit applies whether items were added manually, imported from Steam, or imported from CSV.

## Portfolio Management

### Create Portfolio
>
> Creates a new empty portfolio. The maximum number of portfolios depends on tier.

- Endpoint: POST `/portfolio`
- Auth: API key required

**Payload:**

```json
{
  "name": "Main Inventory"
}
```

---

### List Portfolios
>
> Returns all saved portfolios for the authenticated user.

- Endpoint: GET `/portfolio`
- Auth: API key required

---

### Value Ad-hoc List
>
> Values a user-supplied item list using the current best ask across the selected providers. The response includes per-item totals and the overall portfolio value.

- Endpoint: POST `/portfolio/value`
- Tiers: `free` · `pro` · `quant`
- Rate Limit: Free: 20/min · Pro: 100/min · Quant: 300/min

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| items | array[object] | **Required.** Array of `{item_id: int, quantity: int}`. Max 100 items. |
| providers | string[] | Optional provider filter. |
| currency | string | Target currency (ISO 4217). Default: `USD`. |

**Response Example:**

```json
{
  "meta": {
    "currency": "USD",
    "generated_at": "2026-03-24T12:00:00Z",
    "providers_queried": ["steam", "buff163"]
  },
  "data": {
    "line_items": [
      {
        "item_id": 1,
        "market_hash_name": "AK-47 | Redline (Field-Tested)",
        "phase": null,
        "quantity": 3,
        "best_ask": 2550,
        "item_value": 7650,
        "providers": []
      }
    ],
    "total_value": 7650,
    "items_valued": 1,
    "items_not_found": []
  }
}
```

---

### Delete Portfolio
>
> Deletes a portfolio and all of its saved items and transactions.

- Endpoint: DELETE `/portfolio/{portfolio_id}`
- Auth: API key required

---

## Import / Export

### Import From Steam
>
> Imports items from the user's linked Steam inventory. If `asset_ids` is omitted, the full inventory is imported.

- Endpoint: POST `/portfolio/{portfolio_id}/import`
- Auth: API key required plus linked Steam account

**Payload:**

```json
{
  "asset_ids": ["1234567890", "1234567891"]
}
```

- Items already saved under the same Steam asset ID are skipped.
- Items that cannot be matched are returned in `unresolved` and are not stored.

---

### CSV Import
>
> Uploads a CSV file to bulk import transactions or snapshot-style holdings.

- Endpoint: POST `/portfolio/{portfolio_id}/import/csv`
- Auth: API key required

- Supports both ledger and snapshot formats.
- The format is detected automatically from the CSV headers.
- Buy transactions imported from CSV can create missing portfolio items automatically.

---

### CSV Export
>
> Downloads portfolio data as CSV.

- Endpoint: GET `/portfolio/{portfolio_id}/export?type=transactions`
- Auth: API key required

**Query Parameter:**

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | `transactions` or `items`. Defaults to `transactions`. |

---

## Portfolio Items

### List Items
>
> Returns the items currently stored in a portfolio.

- Endpoint: GET `/portfolio/{portfolio_id}/items`
- Auth: API key required

---

### Add Item
>
> Manually adds one item to a portfolio by `item_id` or `market_hash_name`.

- Endpoint: POST `/portfolio/{portfolio_id}/items`
- Auth: API key required

**Payload:**

```json
{
  "item_id": 12632,
  "quantity": 2,
  "phase": null
}
```

- Use this route for manual entry when the item did not come from a Steam import.

---

### Remove Item
>
> Removes a saved portfolio entry.

- Endpoint: DELETE `/portfolio/{portfolio_id}/items/{entry_id}`
- Auth: API key required

- `entry_id` is the portfolio entry UUID, not the catalog `item_id`.

---

## Transactions and Valuation

### Value Saved Portfolio
>
> Values all items in a saved portfolio using current market prices.

- Endpoint: GET `/portfolio/{portfolio_id}/value`
- Auth: API key required

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| currency | string | Target currency. Default: `USD`. |
| providers | string[] | Optional provider filter. Repeat to pass multiple values. |

- This is a live valuation based on current indexed prices, not a historical replay.

---

### Historical Saved Portfolio Valuation
>
> Rebuilds daily portfolio values from the transaction ledger.

- Endpoint: GET `/portfolio/{portfolio_id}/history`
- Auth: API key required

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| start_date | string | Inclusive start date (`YYYY-MM-DD`). |
| end_date | string | Inclusive end date. Defaults to today. |
| lookback | string | Optional window such as `30d`. Overrides `start_date`. |
| currency | string | Target currency. Default: `USD`. |
| providers | string[] | Optional provider filter. Repeat to pass multiple values. |
| limit | integer | Maximum daily points to return. |
| cursor | string | Opaque cursor from the previous page. |

- This endpoint is daily only. Transactions are stored as calendar dates, not timestamps.
- Holdings are rebuilt from the transaction ledger, not from the portfolio's current saved item list.
- Each day uses the best provider close after FX conversion, with provider carry-forward.
- `pagination.total = -1` is intentional on this cursor endpoint.

---

### List Transactions
>
> Returns the portfolio's buy/sell ledger, newest first.

- Endpoint: GET `/portfolio/{portfolio_id}/transactions`
- Auth: API key required

---

### Record Transaction
>
> Records a buy or sell transaction for an item in the portfolio.

- Endpoint: POST `/portfolio/{portfolio_id}/transactions`
- Auth: API key required

**Payload:**

```json
{
  "item_id": 1,
  "type": "buy",
  "quantity": 1,
  "price": 2500,
  "date": "2026-03-24",
  "marketplace": "skinport",
  "currency": "USD"
}
```

- `item_id` or `market_hash_name` must be provided.
- Buy transactions can create portfolio items for items that are not already tracked.

---

### Update Transaction
>
> Partially updates a portfolio transaction.

- Endpoint: PATCH `/portfolio/{portfolio_id}/transactions/{transaction_id}`
- Auth: API key required

**Patchable Fields:**

- `quantity`
- `price`
- `date`
- `fee_amount`
- `fee_percentage`
- `marketplace`
- `note`
- `currency`

---

### Delete Transaction
>
> Deletes a transaction from the portfolio ledger.

- Endpoint: DELETE `/portfolio/{portfolio_id}/transactions/{transaction_id}`
- Auth: API key required
