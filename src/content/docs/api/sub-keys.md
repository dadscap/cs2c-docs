---
title: Sub-Keys
description: Quant child API key management for authenticated accounts.
order: 18
---

## Sub-Key Management

Quant v1 supports child API keys under a single active root key.

- Availability: `quant` only
- Auth: session JWT or root API key for all management routes
- Child keys can use data endpoints but cannot create, update, revoke, or rotate keys
- Per-child quota and RPM overrides are optional and can only be lower than the parent tier limits

### List Sub-Keys
>
> Returns active child keys with their current-month request counts.

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

- If you omit the override fields, the child key inherits the parent tier ceiling with no extra child-specific cap.
- Requests that exceed the child-key count cap return `409`.
- Overrides above the parent tier limit return a validation error.

---

### Get Sub-Key
>
> Returns one active child key and its current-month request count.

- Endpoint: GET `/account/sub-keys/{key_id}`
- Tiers: `quant`
- Rate Limit: Standard per-tier RPM

---

### Update Sub-Key
>
> Updates a child key's name and optional quota/RPM overrides.

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
> Revokes an active child key.

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
> Replaces an active child key and returns the new plaintext key once.

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
