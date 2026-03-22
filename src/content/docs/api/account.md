---
title: Account
description: API key management, watchlists, and price alerts.
order: 16
---

## IP Address

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
            "id": "b9ec2101-33ec-4755-bcfb-ce02be757e89",
            "item_id": 12632,
            "market_hash_name": "AK-47 | Redline (Field-Tested)",
            "phase": null,
            "created_at": "2026-03-21T06:11:00.556965Z"
        }
    ],
    "pagination": {
        "limit": 50,
        "offset": 0,
        "total": 5,
        "has_next": false,
        "has_prev": false,
        "next_cursor": null
    }
}
```

---

### Delete Watchlist Entry
>
> Removes a single item from the authenticated user's watchlist by its catalog item ID.

- Endpoint: DELETE `/account/watchlist/:item_id`
- Tiers: all tiers with watchlist access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Path Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| item_id | integer | Normalized catalog item ID to remove. |

**Response Example:**

```json
{
    "ok": true
}
```

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
| item_id | integer | **Required.** Normalized catalog item ID for the alert target. One item can have multiple alerts. |
| kind | string | **Required.** One of: `price_below`, `price_above`, `spread_exceeds`. |
| threshold_value | string | **Required.** Decimal string greater than zero. Represents a price (in `threshold_currency`) for price alerts, or a percentage for `spread_exceeds`. |
| threshold_currency | string | Currency for price alerts. Ignored for `spread_exceeds`. Default: `USD`. |
| is_enabled | boolean | Set to `false` to create a muted alert. Default: `true`. |

```json
{
  "item_id": 1,
  "kind": "price_above",
  "threshold_value": "49.99",
  "threshold_currency": "USD",
  "is_enabled": true
}
```

**Response Example:**

```json
{
    "id": "a85c9053-8308-40af-ae9c-c4256374fd29",
    "kind": "price_above",
    "threshold_value": "49.9900",
    "threshold_currency": "USD",
    "is_enabled": true,
    "last_triggered_at": null,
    "created_at": "2026-03-21T05:48:47.850690Z",
    "updated_at": "2026-03-21T05:48:47.850690Z",
    "item": {
        "item_id": 1,
        "market_hash_name": "Bloody Darryl The Strapped | The Professionals",
        "phase": null
    }
}
```

- `price_below` and `price_above` compare against the current best ask.
- `spread_exceeds` compares percentage spread: `((best_ask - best_bid) / best_ask) * 100`.
- After a successful email delivery, the alert automatically disables itself until re-enabled.
- Verified email is required only for enabled alerts; disabled alerts can be created without one.
- Enabled-alert count is tier-capped.

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

**Response Example:**

```json
{
    "alerts": [
        {
            "id": "33ebd1f0-2c8a-47c3-99b7-a229154f53d5",
            "kind": "price_above",
            "threshold_value": "51.9900",
            "threshold_currency": "USD",
            "is_enabled": true,
            "last_triggered_at": null,
            "created_at": "2026-03-21T06:23:54.471216Z",
            "updated_at": "2026-03-21T06:23:54.471216Z",
            "item": {
                "item_id": 1,
                "market_hash_name": "Bloody Darryl The Strapped | The Professionals",
                "phase": null
            }
        }
    ],
    "pagination": {
        "limit": 50,
        "offset": 0,
        "total": 2,
        "has_next": false,
        "has_prev": false,
        "next_cursor": null
    }
}
```

---

### Update Alert
>
> Partially updates an existing alert's threshold value, currency, or enabled state. At least one field must be provided.

- Endpoint: PATCH `/account/alerts/{alert_id}`
- Tiers: all tiers with alert access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Path Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| alert_id | uuid | Alert definition ID. Use `GET /account/alerts` to fetch IDs. |

**Payload:**

| Field | Type | Description |
|-------|------|-------------|
| threshold_value | string | Updated threshold value as a decimal string. Must be greater than zero. |
| threshold_currency | string | Updated currency for price alerts. Ignored for spread alerts. |
| is_enabled | boolean | Updated enabled state. |

```json
{
  "threshold_value": "55.00",
  "threshold_currency": "USD",
  "is_enabled": false
}
```

**Response Example:**

```json
{
    "id": "a85c9053-8308-40af-ae9c-c4256374fd29",
    "kind": "price_above",
    "threshold_value": "55.0000",
    "threshold_currency": "USD",
    "is_enabled": false,
    "last_triggered_at": null,
    "created_at": "2026-03-21T05:48:47.850690Z",
    "updated_at": "2026-03-21T05:51:03.727950Z",
    "item": {
        "item_id": 1,
        "market_hash_name": "Bloody Darryl The Strapped | The Professionals",
        "phase": null
    }
}
```

- Enabling an alert re-runs the same checks as creation (verified email required).
- Returns `404` if the alert does not belong to the authenticated user.

---

### Delete Alert
>
> Permanently deletes an alert rule for the authenticated user.

- Endpoint: DELETE `/account/alerts/{alert_id}`
- Tiers: all tiers with alert access
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Path Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| alert_id | uuid | Alert definition ID. Use `GET /account/alerts` to fetch IDs. |

**Response Example:**

```json
{
    "ok": true
}
```

- Returns `404` if the alert does not exist for the authenticated user.

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

**Response Example:**

```json
{
    "events": [
        {
            "id": "b3c1a2e4-5d6f-7890-abcd-ef1234567890",
            "alert_id": "a85c9053-8308-40af-ae9c-c4256374fd29",
            "kind": "price_above",
            "item": {
                "item_id": 1,
                "market_hash_name": "Bloody Darryl The Strapped | The Professionals",
                "phase": null
            },
            "triggered_value": "51.22",
            "triggered_currency": "USD",
            "reason": "Price rose above threshold of $49.99",
            "created_at": "2026-03-21T08:15:30.123456Z",
            "deliveries": [
                {
                    "channel": "email",
                    "status": "delivered",
                    "error": null,
                    "created_at": "2026-03-21T08:15:31.456789Z"
                }
            ]
        }
    ],
    "pagination": {
        "limit": 50,
        "offset": 0,
        "total": 2,
        "has_next": false,
        "has_prev": false,
        "next_cursor": null
    }
}
```

- `triggered_currency` is `null` for `spread_exceeds` alerts.
- `deliveries` currently reflects email delivery attempts only.

---
