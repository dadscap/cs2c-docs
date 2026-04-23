---
title: Webhooks
description: Outbound webhook management for authenticated accounts.
order: 19
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
- `last_success_at` and `last_failure_at` stay `null` until deliveries happen.

---

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

---

### List Webhook Deliveries
>
> Returns outbound webhook delivery jobs for the authenticated account, newest first.

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

---

### Get Webhook Delivery
>
> Returns one webhook delivery job and its attempt history.

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

---

### Update Webhook
>
> Updates the editable fields of a webhook destination.

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
- Set a field to `null` only if the API allows clearing it.

---

### Delete Webhook
>
> Deletes an outbound webhook destination owned by the authenticated account.

- Endpoint: DELETE `/account/webhooks/{webhook_id}`
- Auth: Bearer token
- Rate Limit: Standard per-tier RPM

**Response Example:**

```json
{
  "ok": true
}
```

---

### Rotate Webhook Secret
>
> Rotates a webhook signing secret and returns the new secret once.

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
