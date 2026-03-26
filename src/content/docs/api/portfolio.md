---
title: Portfolio Management
description: Manage named portfolios, track transactions, and value inventories.
order: 13
---

The Portfolio API supports both stateless valuation of ad-hoc item lists and stateful management of named portfolios. Users can import items from Steam, record buy/sell transactions, and export data as CSV.

Portfolio item capacity is tier-based: free users can store up to 1,000 items per portfolio,
Pro users up to 5,000, and Quant users up to 10,000. Manual item adds, Steam imports, and CSV
imports all enforce the same per-portfolio cap.

## Stateless Valuation

### Value Ad-hoc List
>
> Values a user-submitted inventory list at current best-ask prices across selected providers, returning per-item line totals and an aggregate portfolio value.

- **Endpoint**: `POST /v1/portfolio/value`
- **Tiers**: `free` · `pro` · `quant`
- **Rate Limit**: Free: 20/min · Pro: 100/min · Quant: 300/min

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| `items` | array[object] | **Required.** Array of `{item_id: int, quantity: int}`. Max 100 items. |
| `providers` | string[] | Optional provider keys filter. |
| `currency` | string | Target currency (ISO 4217). Default: `USD`. |

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
        "providers": [...]
      }
    ],
    "total_value": 7650,
    "items_valued": 1,
    "items_not_found": []
  }
}
```

---

## Portfolio Management

### List Portfolios

- **Endpoint**: `GET /v1/portfolio`
- **Description**: Returns all named portfolios for the authenticated user.

### Create Portfolio

- **Endpoint**: `POST /v1/portfolio`
- **Payload**: `{"name": "String"}`
- **Description**: Creates a new empty portfolio. The maximum number of portfolios is tier-controlled.

### Delete Portfolio

- **Endpoint**: `DELETE /v1/portfolio/{portfolio_id}`
- **Description**: Deletes a portfolio and all associated items and transactions.

---

## Portfolio Items

### List Items

- **Endpoint**: `GET /v1/portfolio/{portfolio_id}/items`
- **Description**: List all items currently stored in the portfolio.

### Add Item

- **Endpoint**: `POST /v1/portfolio/{portfolio_id}/items`
- **Payload**: `{"item_id": int, "quantity": int, "phase": string}`
- **Description**: Manually add an item to the portfolio.

### Import from Steam

- **Endpoint**: `POST /v1/portfolio/{portfolio_id}/import`
- **Payload**: `{"asset_ids": string[]}`
- **Description**: Imports items from the user's linked Steam inventory. If `asset_ids` is omitted, the entire inventory is imported.

---

## Transactions & Valuation

### Value Saved Portfolio

- **Endpoint**: `GET /v1/portfolio/{portfolio_id}/value`
- **Description**: Values all items in the saved portfolio at current market prices. Supports `currency` and `providers` query parameters.

### List Transactions

- **Endpoint**: `GET /v1/portfolio/{portfolio_id}/transactions`
- **Description**: Returns the buy/sell ledger for the portfolio, newest first.

### Record Transaction

- **Endpoint**: `POST /v1/portfolio/{portfolio_id}/transactions`
- **Payload**:

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

- **Description**: Records a trade event. Buy transactions can automatically add items to the portfolio if they aren't already tracked.

---

## Import / Export

### CSV Export

- **Endpoint**: `GET /v1/portfolio/{portfolio_id}/export?type=transactions`
- **Description**: Download portfolio data as a CSV file. Supported types: `transactions` and `items`.

### CSV Import

- **Endpoint**: `POST /v1/portfolio/{portfolio_id}/import/csv`
- **Description**: Upload a CSV file to bulk-import transactions. Supports ledger and snapshot formats.
