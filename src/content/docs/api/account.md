---
title: Account
description: API key IP reset, watchlists, and alerts for authenticated accounts.
order: 16
---

## API Key Management

### Reset IP Binding
>
> Rebinds the active API key to the caller's current source IP. For Pro/Quant tiers this succeeds but has no effect since those keys are not IP-bound.

- Endpoint: POST `/account/key/reset-ip`
- Tiers: `free` · `pro` · `quant`
- Rate Limit: 1 per 24 hours per account

**Response Example:**

```json
{
  "ok": true,
  "key_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "cooldown_sec": 86400
}
```

- Free tier: rebinds the key to the caller's current IP. Required when calling from a new IP.
- Pro/Quant: succeeds but does not change account state.
- Monthly quota: exempt.

---

## Items Watchlist

### Create Watchlist Entry
>
> Adds one or multiple catalog items to the authenticated user's watchlist in a single all-or-nothing batch operation.

- Endpoint: POST `/account/watchlist`
- Tiers: all tiers with watchlist access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Payload:**

Use `item_ids` for a batch add or `item_id` for a single item:

```json
{
  "item_ids": [21325, 9153, 821]
}
```

**Response Example:**

```json
{
  "items": [
    {
      "id": "11ac91b1-4a76-410a-8f95-3f069bbf195d",
      "item_id": 21325,
      "market_hash_name": "Sticker | Summer (Foil) | Boston 2018",
      "phase": null,
      "created_at": "2026-03-21T06:15:13.942677Z"
    },
    {
      "id": "f15c5e58-0bc8-4303-9ea4-239dae8b1322",
      "item_id": 9153,
      "market_hash_name": "★ StatTrak™ Huntsman Knife | Boreal Forest (Factory New)",
      "phase": null,
      "created_at": "2026-03-21T06:15:13.942677Z"
    }
  ],
  "created_count": 3
}
```

- Every submitted item ID must exist in `/v1/items`.
- Batch creates are all-or-nothing.
- Duplicates return `409`. Hitting the tier watchlist cap also returns `409`.

---

### Get Watchlist
>
> Returns the authenticated user's saved watchlist entries, ordered newest first, with optional item name or ID search filter.

- Endpoint: GET `/account/watchlist`
- Tiers: all tiers with watchlist access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Page size, clamped to `1–200`. Default: `50`. |
| offset | integer | Zero-based starting position. Default: `0`. |
| search | string | Exact numeric `item_id` match or case-insensitive item-name substring. |

---

### Delete Watchlist Entry
>
> Removes a single item from the authenticated user's watchlist by its catalog item ID.

- Endpoint: DELETE `/account/watchlist/{item_id}`
- Tiers: all tiers with watchlist access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

- Uses the catalog `item_id`, not the watchlist entry UUID.
- Returns `404` if the item is not currently saved by the authenticated user.

---

## Market Alerts

### Create Alert
>
> Creates a new price or spread alert for a catalog item, optionally enabling it immediately or saving it in a disabled state for later activation.

- Endpoint: POST `/account/alerts`
- Tiers: all tiers with alert access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Payload:**

| Field | Type | Description |
|-------|------|-------------|
| item_id | integer | **Required.** Normalized catalog item ID for the alert target. |
| kind | string | **Required.** One of: `price_below`, `price_above`, `spread_exceeds`. |
| threshold_value | string | **Required.** Decimal string greater than zero. |
| threshold_currency | string | Currency for price alerts. Ignored for `spread_exceeds`. |
| is_enabled | boolean | Set to `false` to create a muted alert. Default: `true`. |

- `price_below` and `price_above` compare against the current best ask.
- `spread_exceeds` compares `((best_ask - best_bid) / best_ask) * 100`.
- After a successful email delivery, the alert automatically disables itself until re-enabled.
- Verified email is required only for enabled alerts.

---

### Create Alerts Batch
>
> Creates multiple alert definitions in one request and returns ordered per-item created/error results.

- Endpoint: POST `/account/alerts/batch`
- Tiers: tiers with `batch_alert_creation_access`
- Rate Limit: Standard per-tier RPM (counts as one request regardless of batch size)

**Payload:**

| Field | Type | Description |
|-------|------|-------------|
| alerts | array | **Required.** One to 100 alert payloads shaped the same as `POST /account/alerts`. |

- Exact duplicate alert payloads in the same request are rejected inline.
- Multiple alerts for the same `item_id` are allowed when kind or threshold differ.
- Requests that would exceed the enabled-alert cap fail up front with `402`.

---

### Get Alerts
>
> Returns all configured alert rules for the authenticated user, ordered newest first, with optional item name or ID filter.

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
> Partially updates an existing alert's threshold value, currency, or enabled state.

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
- Enabling an alert re-runs the same checks as creation.

---

### Delete Alert
>
> Permanently deletes an alert rule for the authenticated user.

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
> Returns recent alert trigger events and their email delivery attempts for the authenticated user, ordered newest first.

- Endpoint: GET `/account/alerts/events`
- Tiers: all tiers with alert access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Page size, clamped to `1–100`. Default: `50`. |
| offset | integer | Zero-based starting position. Default: `0`. |

- `triggered_currency` is `null` for `spread_exceeds` alerts.
- `deliveries` currently reflects email delivery attempts only.
- `cursor` is not supported; use offset pagination.
