---
title: Alerts
description: Market alert management for authenticated accounts.
order: 17
---

## Market Alerts

### Create Alert
>
> Creates a new price or spread alert for a catalog item. You can enable it immediately or save it disabled for later.

- Endpoint: POST `/account/alerts`
- Tiers: all tiers with alert access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Payload:**

| Field | Type | Description |
|-------|------|-------------|
| item_id | integer | **Required.** Catalog item ID for the alert target. |
| kind | string | **Required.** One of: `price_below`, `price_above`, `spread_exceeds`. |
| threshold_value | string | **Required.** Decimal string greater than zero. |
| threshold_currency | string | Currency for price alerts. Ignored for `spread_exceeds`. |
| is_enabled | boolean | Set to `false` to create the alert in a disabled state. Default: `true`. |

- `price_below` and `price_above` compare against the current best ask.
- `spread_exceeds` compares `((best_ask - best_bid) / best_ask) * 100`.
- After a successful email delivery, the alert automatically disables itself until it is re-enabled.
- Verified email is required only for enabled alerts.

---

### Create Alerts Batch
>
> Creates multiple alerts in one request and returns ordered per-item created/error results.

- Endpoint: POST `/account/alerts/batch`
- Tiers: tiers with `batch_alert_creation_access`
- Rate Limit: Standard per-tier RPM (counts as one request regardless of batch size)

**Payload:**

| Field | Type | Description |
|-------|------|-------------|
| alerts | array | **Required.** One to 100 alert payloads shaped like `POST /account/alerts`. |

- Exact duplicate alert payloads in the same request are rejected inline.
- Multiple alerts for the same `item_id` are allowed when kind or threshold differ.
- Requests that would exceed the enabled-alert cap fail up front with `402`.

---

### Get Alerts
>
> Returns all configured alerts for the authenticated user, newest first, with an optional item name or item ID filter.

- Endpoint: GET `/account/alerts`
- Tiers: all tiers with alert access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Page size, clamped to `1–200`. Default: `50`. |
| offset | integer | Zero-based starting position. Default: `0`. |
| search | string | Exact numeric `item_id` match or case-insensitive item-name substring. |

---

### Update Alert
>
> Partially updates an alert's threshold value, currency, or enabled state.

- Endpoint: PATCH `/account/alerts/{alert_id}`
- Tiers: all tiers with alert access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Payload:**

| Field | Type | Description |
|-------|------|-------------|
| threshold_value | string | Updated threshold value as a decimal string. |
| threshold_currency | string | Updated currency for price alerts. |
| is_enabled | boolean | Updated enabled state. |

- At least one field must be provided.
- Enabling an alert runs the same checks as alert creation.

---

### Delete Alert
>
> Permanently deletes an alert rule.

- Endpoint: DELETE `/account/alerts/{alert_id}`
- Tiers: all tiers with alert access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Response Example:**

```json
{
  "ok": true
}
```

---

### List Alert Events
>
> Returns recent alert trigger events and their email delivery attempts, newest first.

- Endpoint: GET `/account/alerts/events`
- Tiers: all tiers with alert access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Page size, clamped to `1–100`. Default: `50`. |
| offset | integer | Zero-based starting position. Default: `0`. |

- `triggered_currency` is `null` for `spread_exceeds` alerts.
- `deliveries` currently includes email delivery attempts only.
- `cursor` is not supported here. Use offset pagination.
