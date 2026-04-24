---
title: Account
description: API key management for authenticated accounts.
order: 16
---

## API Key Management

### Get Active Key
>
> Returns metadata for the authenticated key. If you call this route with a session JWT, it resolves to the account's active root key.

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
    "quota_requests_per_month_override": null,
    "rate_requests_per_minute_override": null,
    "effective_quota_requests_per_month": 500000,
    "effective_rate_requests_per_minute": 300
  }
}
```

- Child keys can authenticate normal data requests, and this route returns that child key's metadata when called with the child token.
- Quant child keys inherit the parent tier and can only reduce quota or RPM limits, not increase them.

---

### Reissue Active Key
>
> Replaces the active root key and revokes the entire child-key tree under it as part of the same security event.

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

- Email verification is required before a key can be issued or reissued.
- Child keys cannot call this route.
