---
title: Account
description: API key management, Quant sub-keys, watchlists, alerts, and webhooks for authenticated accounts.
order: 16
---

## API Key Management

### Get Active Key
>
> Returns metadata for the authenticated key. When called with a session JWT, this resolves to the account's active root key instead.

- Endpoint: GET `/account/key`
- Tiers: `free` · `pro` · `quant`
- Auth: session JWT or API key
- Rate Limit: Standard per-tier RPM

**Response Example:**

```json
{
  "key": {
    "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "key_prefix": "sk_live_root",
    "name": null,
    "root_key_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "is_root_key": true,
    "is_active": true,
    "created_at": "2026-03-02T10:30:00Z",
    "last_used_at": "2026-03-02T11:15:00Z",
    "expires_at": null,
    "bound_ip": "203.0.113.10",
    "bound_ip_set_at": "2026-03-02T10:31:00Z",
    "quota_requests_per_month_override": null,
    "rate_requests_per_minute_override": null,
    "effective_quota_requests_per_month": 500000,
    "effective_rate_requests_per_minute": 300
  }
}
```

- Child keys can authenticate normal data requests, and this route will return that child key's metadata when called with the child token.
- Quant child keys inherit the parent account tier and can only narrow monthly quota or RPM limits.

---

### Reissue Active Key
>
> Rotates the active root key and revokes the entire child-key tree under it as part of the same security event.

- Endpoint: POST `/account/key/reissue`
- Tiers: `free` · `pro` · `quant`
- Auth: session JWT or root API key
- Rate Limit: Standard per-tier RPM

**Response Example:**

```json
{
  "key": "sk_live_<xxxx>",
  "key_prefix": "sk_live_root",
  "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "created_at": "2026-03-02T11:20:00Z",
  "message": "Store this key securely. It will not be shown again."
}
```

- Email verification is required before key issuance or reissuance.
- Child keys cannot call this route.
- Free tier still uses this as the self-service path to replace an IP-bound root key.

---

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

## Sub-Key Management

Quant v1 supports child API keys under a single active root key.

- Availability: `quant` only
- Auth: session JWT or root API key for all management routes
- Child keys can use data endpoints but cannot create, update, revoke, or rotate keys
- Per-child quota/RPM overrides are optional and can only be lower than the parent tier limits

### List Sub-Keys
>
> Returns active child API keys with per-key current-month request counts.

- Endpoint: GET `/account/sub-keys`
- Tiers: `quant`
- Rate Limit: Standard per-tier RPM

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Page size, clamped to `1–100`. Default: `25`. |
| offset | integer | Zero-based starting position. Default: `0`. |

**Response Example:**

```json
{
  "keys": [
    {
      "key": {
        "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
        "key_prefix": "sk_live_child",
        "name": "research-bot",
        "root_key_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "is_root_key": false,
        "is_active": true,
        "created_at": "2026-03-02T12:00:00Z",
        "last_used_at": "2026-03-03T08:10:00Z",
        "expires_at": null,
        "bound_ip": null,
        "bound_ip_set_at": null,
        "quota_requests_per_month_override": 50000,
        "rate_requests_per_minute_override": 120,
        "effective_quota_requests_per_month": 50000,
        "effective_rate_requests_per_minute": 120
      },
      "requests_this_month": 812
    }
  ],
  "pagination": {
    "limit": 25,
    "offset": 0,
    "total": 1
  }
}
```

---

### Create Sub-Key
>
> Creates a new child API key and returns the plaintext key once.

- Endpoint: POST `/account/sub-keys`
- Tiers: `quant`
- Rate Limit: Standard per-tier RPM

**Payload:**

```json
{
  "name": "research-bot",
  "quota_requests_per_month_override": 50000,
  "rate_requests_per_minute_override": 120
}
```

- Omitting override fields means the child key inherits the parent tier ceiling with no extra child-specific cap.
- Requests exceeding the tier child-key count cap return `409`.
- Overrides above the parent tier limit return a validation error.

---

### Get Sub-Key
>
> Returns one active child API key plus its current-month request count.

- Endpoint: GET `/account/sub-keys/{key_id}`
- Tiers: `quant`
- Rate Limit: Standard per-tier RPM

---

### Update Sub-Key
>
> Updates a child key's user-visible name and optional quota/RPM overrides.

- Endpoint: PATCH `/account/sub-keys/{key_id}`
- Tiers: `quant`
- Rate Limit: Standard per-tier RPM

**Payload:**

```json
{
  "name": "research-bot-v2",
  "quota_requests_per_month_override": 25000,
  "rate_requests_per_minute_override": 60
}
```

- Set an override field to `null` to remove that child-specific cap.

---

### Delete Sub-Key
>
> Revokes one active child API key.

- Endpoint: DELETE `/account/sub-keys/{key_id}`
- Tiers: `quant`
- Rate Limit: Standard per-tier RPM

**Response Example:**

```json
{
  "ok": true,
  "key_id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
  "revoked_at": "2026-03-03T08:12:00+00:00"
}
```

---

### Reissue Sub-Key
>
> Rotates one active child API key and returns the replacement plaintext key once.

- Endpoint: POST `/account/sub-keys/{key_id}/reissue`
- Tiers: `quant`
- Rate Limit: Standard per-tier RPM

**Response Example:**

```json
{
  "key": "sk_live_<xxxx>",
  "key_info": {
    "id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
    "key_prefix": "sk_live_child",
    "name": "research-bot",
    "root_key_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "is_root_key": false,
    "is_active": true,
    "created_at": "2026-03-03T08:15:00Z",
    "last_used_at": null,
    "expires_at": null,
    "bound_ip": null,
    "bound_ip_set_at": null,
    "quota_requests_per_month_override": 50000,
    "rate_requests_per_minute_override": 120,
    "effective_quota_requests_per_month": 50000,
    "effective_rate_requests_per_minute": 120
  },
  "message": "Store this key securely. It will not be shown again."
}
```

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

---

## Webhooks

### List Webhooks
>
> Returns all outbound webhook destinations configured for the authenticated account.

- Endpoint: GET `/account/webhooks`
- Auth: Bearer token
- Rate Limit: Standard per-tier RPM

**Response Example:**

```json
{
  "webhooks": [
    {
      "id": "3b1f1d4c-7b8e-4cc8-bb7b-5d8d0d2a7e11",
      "label": "Production alerts",
      "url": "https://hooks.example.com/cs2c",
      "secret_last4": "9f2a",
      "is_active": true,
      "last_success_at": "2026-04-12T18:20:11Z",
      "last_failure_at": null,
      "last_failure_message": null,
      "created_at": "2026-04-01T12:00:00Z",
      "updated_at": "2026-04-12T18:20:11Z"
    }
  ]
}
```

- `secret_last4` is the only secret material shown after creation.
- `last_success_at` and `last_failure_at` are `null` until deliveries have occurred.

### Create Webhook
>
> Creates one outbound webhook destination and returns its signing secret once.

- Endpoint: POST `/account/webhooks`
- Auth: Bearer token
- Rate Limit: Standard per-tier RPM

**Payload:**

```json
{
  "label": "Production alerts",
  "url": "https://hooks.example.com/cs2c",
  "is_active": true
}
```

**Response Example:**

```json
{
  "webhook": {
    "id": "3b1f1d4c-7b8e-4cc8-bb7b-5d8d0d2a7e11",
    "label": "Production alerts",
    "url": "https://hooks.example.com/cs2c",
    "secret_last4": "9f2a",
    "is_active": true,
    "last_success_at": null,
    "last_failure_at": null,
    "last_failure_message": null,
    "created_at": "2026-04-12T18:20:11Z",
    "updated_at": "2026-04-12T18:20:11Z"
  },
  "secret": "whsec_live_8f4f4f4c"
}
```

- The secret is shown only once.
- `url` must be a valid HTTP or HTTPS destination.

### List Webhook Deliveries
>
> Returns outbound webhook delivery jobs for the authenticated account, ordered newest first.

- Endpoint: GET `/account/webhooks/deliveries`
- Auth: Bearer token
- Rate Limit: Standard per-tier RPM

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Page size, clamped to `1–100`. Default: `25`. |
| offset | integer | Zero-based starting position. Default: `0`. |

**Response Example:**

```json
{
  "deliveries": [
    {
      "id": "deliv_01J0Y8QYVQW4H6Q3S9JX3B4G6H",
      "event_id": "evt_01J0Y8QYVQW4H6Q3S9JX3B4G6H",
      "endpoint_id": "3b1f1d4c-7b8e-4cc8-bb7b-5d8d0d2a7e11",
      "endpoint_label": "Production alerts",
      "endpoint_url": "https://hooks.example.com/cs2c",
      "event_type": "alert.triggered",
      "status": "succeeded",
      "attempt_count": 1,
      "last_http_status": 200,
      "error": null,
      "next_attempt_at": null,
      "created_at": "2026-04-12T18:20:11Z",
      "completed_at": "2026-04-12T18:20:12Z"
    }
  ],
  "pagination": {
    "limit": 25,
    "offset": 0,
    "total": 1
  }
}
```

### Get Webhook Delivery
>
> Returns one outbound webhook delivery job with its attempt history.

- Endpoint: GET `/account/webhooks/deliveries/{delivery_id}`
- Auth: Bearer token
- Rate Limit: Standard per-tier RPM

**Response Example:**

```json
{
  "id": "deliv_01J0Y8QYVQW4H6Q3S9JX3B4G6H",
  "event_id": "evt_01J0Y8QYVQW4H6Q3S9JX3B4G6H",
  "endpoint_id": "3b1f1d4c-7b8e-4cc8-bb7b-5d8d0d2a7e11",
  "endpoint_label": "Production alerts",
  "endpoint_url": "https://hooks.example.com/cs2c",
  "event_type": "alert.triggered",
  "status": "succeeded",
  "attempt_count": 1,
  "last_http_status": 200,
  "error": null,
  "next_attempt_at": null,
  "created_at": "2026-04-12T18:20:11Z",
  "completed_at": "2026-04-12T18:20:12Z",
  "payload": {
    "alert_id": "6a49b4bc-95c6-4c98-8d40-5e3fca7b15e4",
    "item_id": 156,
    "market_hash_name": "AK-47 | Redline (Field-Tested)"
  },
  "attempts": [
    {
      "attempt_number": 1,
      "status": "succeeded",
      "http_status": 200,
      "error": null,
      "response_body_excerpt": null,
      "created_at": "2026-04-12T18:20:12Z"
    }
  ]
}
```

### Update Webhook
>
> Updates mutable outbound webhook destination fields.

- Endpoint: PATCH `/account/webhooks/{webhook_id}`
- Auth: Bearer token
- Rate Limit: Standard per-tier RPM

**Payload:**

```json
{
  "label": "Production alerts",
  "url": "https://hooks.example.com/cs2c",
  "is_active": true
}
```

- Omit a field to leave it unchanged.
- Set a field to `null` only when the API allows clearing it.

### Delete Webhook
>
> Deletes one outbound webhook destination owned by the authenticated account.

- Endpoint: DELETE `/account/webhooks/{webhook_id}`
- Auth: Bearer token
- Rate Limit: Standard per-tier RPM

**Response Example:**

```json
{
  "ok": true
}
```

### Rotate Webhook Secret
>
> Rotates one webhook destination signing secret and returns the new secret once.

- Endpoint: POST `/account/webhooks/{webhook_id}/rotate-secret`
- Auth: Bearer token
- Rate Limit: Standard per-tier RPM

**Response Example:**

```json
{
  "webhook": {
    "id": "3b1f1d4c-7b8e-4cc8-bb7b-5d8d0d2a7e11",
    "label": "Production alerts",
    "url": "https://hooks.example.com/cs2c",
    "secret_last4": "4c11",
    "is_active": true,
    "last_success_at": "2026-04-12T18:20:11Z",
    "last_failure_at": null,
    "last_failure_message": null,
    "created_at": "2026-04-01T12:00:00Z",
    "updated_at": "2026-04-12T18:20:11Z"
  },
  "secret": "whsec_live_9b1e2c3d"
}
```

- The rotated secret is shown only once.
