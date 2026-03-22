---
title: Account
description: API key management, watchlists, and price alerts.
order: 16
---

## POST /account/key/reset-ip

**Parameters:**

No parameters

**Notes:**

- Available to: all tiers
- Authentication: Bearer API key
- Free tier: rebinds the active API key to the caller's current IP
- Pro/Quant: succeeds but does not change account state
- Cooldown: once every 24 hours per account
- Monthly quota: exempt

---

## POST /account/watchlist

**Parameters:**

No parameters

**Request Body:**

- `item_id` | `integer` | Use this for a single-item add.
- `item_ids` | `integer[]` | Use this for a batch add.

**Notes:**

- Available to: tiers with watchlist access
- Authentication: Bearer API key or session JWT
- Every submitted item ID must exist in `/v1/items`
- Batch creates are all-or-nothing
- Duplicate saves return `409`
- Hitting the tier watchlist cap returns `409`

---

## GET /account/watchlist

**Parameters:**

- `limit` | `integer` | `default: 50` | Page size. Clamped to `1..200`.
- `offset` | `integer` | `default: 0` | Zero-based starting position.
- `search` | `string` | Exact numeric `item_id` match or case-insensitive item-name substring.

**Notes:**

- Available to: tiers with watchlist access
- Authentication: Bearer API key or session JWT
- Ordered by newest saved first
- Offset pagination with a real `pagination.total`

---

## DELETE /account/watchlist/{item_id}

**Path Variables:**

- `item_id` | `integer` | Normalized catalog item ID to remove from the default watchlist.

**Parameters:**

No parameters

**Notes:**

- Available to: tiers with watchlist access
- Authentication: Bearer API key or session JWT
- This path uses the catalog item ID, not the watchlist entry UUID
- Returns `404` if that item is not currently saved by the authenticated user

---

## POST /account/alerts

**Parameters:**

No parameters

**Request Body:**

- `item_id` | `integer` | Normalized catalog item ID for the alert target.
- `kind` | `Literal["price_below", "price_above", "spread_exceeds"]` | Alert kind.
- `threshold_value` | `decimal string` | Threshold value. Must be greater than zero.
- `threshold_currency` | `string` | Currency for price alerts. Omit for `spread_exceeds`.
- `is_enabled` | `boolean` | Whether the alert is enabled at creation time.

**Notes:**

- Available to: tiers with alert access
- Authentication: Bearer API key or session JWT
- `price_below` and `price_above` compare against the current best ask
- `spread_exceeds` compares percentage spread: `((best_ask - best_bid) / best_ask) * 100`
- `threshold_currency` defaults to the account preferred currency for price alerts when omitted. Accounts that have not changed it use USD
- Alert emails are enabled by default and can be disabled in account preferences
- Verified email is required only for enabled alerts
- Disabled alerts can be created first and enabled later
- Enabled-alert count is tier-capped

---

## GET /account/alerts

**Parameters:**

- `limit` | `integer` | `default: 50` | Page size. Clamped to `1..200`.
- `offset` | `integer` | `default: 0` | Zero-based starting position.
- `search` | `string` | Exact numeric `item_id` match or case-insensitive item-name substring.

**Notes:**

- Available to: tiers with alert access
- Authentication: Bearer API key or session JWT
- Ordered by newest created first
- Offset pagination with a real `pagination.total`

---

## PATCH /account/alerts/{alert_id}

**Path Variables:**

- `alert_id` | `uuid` | Alert definition ID.

**Parameters:**

No parameters

**Request Body:**

- `threshold_value` | `decimal string` | Optional updated threshold value. Must be greater than zero if supplied.
- `threshold_currency` | `string` | Optional updated currency for price alerts. Ignored for spread alerts.
- `is_enabled` | `boolean` | Optional enabled-state change.

**Notes:**

- Available to: tiers with alert access
- Authentication: Bearer API key or session JWT
- Provide at least one request-body field
- Enabling an alert re-runs the same checks as creation
- Returns `404` if the alert does not belong to the authenticated user

---

## DELETE /account/alerts/{alert_id}

**Path Variables:**

- `alert_id` | `uuid` | Alert definition ID.

**Parameters:**

No parameters

**Notes:**

- Available to: tiers with alert access
- Authentication: Bearer API key or session JWT
- Returns `404` if the alert does not exist for the authenticated user

---

## GET /account/alerts/events

**Parameters:**

- `limit` | `integer` | `default: 50` | Cursor page size. Clamped to `1..100`.
- `cursor` | `string` | Opaque next-page cursor from a previous response.

**Notes:**

- Available to: tiers with alert access
- Authentication: Bearer API key or session JWT
- Ordered by newest first
- Cursor endpoint with `pagination.total = -1`
- Delivery rows currently reflect email delivery attempts only
