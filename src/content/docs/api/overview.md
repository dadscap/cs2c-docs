---
title: API Reference
description: Authentication, tiers, response format, and error handling.
order: 10
---

## Base URL

```url
https://api.cs2c.app/v1
```

## Authentication

Market-data endpoints require an API key in the `Authorization` header:

```http
Authorization: Bearer <your_api_key_here>
```

### Getting an API Key

1. Sign up with OAuth.
2. Add and verify an email address on the account.
3. Save your initial API key, or reissue a new one from the account flow.
4. Send the key with `Authorization: Bearer {api_key}` on your requests.

Rules:

- Maximum 1 active API key per account
- Free-tier keys bind to the first source IP that uses them
- Email verification is required before initial key issuance or reissue

## Rate Limits

Rate limits are enforced per API key based on tier:

| Tier | Requests/Minute | Requests/Month | Max `limit` Param |
| ---- | --------------- | -------------- | ----------------- |
| `free` | 20 | 1,000 | 100 |
| `pro` | 100 | 500,000 | 1,000 |
| `quant` | 300 | 1,000,000 | 1,000 |

**Special limits:**

- `POST /prices` and `POST /bids` also have a cooldown of **1 request every 30 seconds** per key.
- `POST /account/key/reset-ip` is limited to **1 request every 24 hours** per account.

A `429` response can include headers like these:

```http
Retry-After: 12345
X-RateLimit-Limit: 500000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 12345
X-RateLimit-Tier: pro
```

Monthly quota applies only to public core market-data endpoints. Account, billing, verification, recovery, and alert routes still have burst protection, but they do not consume the advertised monthly quota.

## Response Conventions

- Most list endpoints return `items`, plus `meta` and `pagination` when relevant.
- `GET /items` returns all matches in one response when `limit` is omitted.
- Cursor endpoints intentionally use `pagination.total = -1`.
- Price fields such as `lowest_ask`, `highest_bid`, and `price` are returned in minor units of the response currency.
- `providers`, `providers_buy`, and `providers_sell` are repeatable query parameters.
- `provider` is always a single provider key.

## Error Handling

Every error response includes a stable machine-readable `code` and a human-readable `detail`.

| Status | Meaning |
| ------ | ------- |
| `400` | Bad request |
| `401` | Missing or invalid API key |
| `403` | Valid credentials but insufficient permissions |
| `404` | Resource not found |
| `409` | Conflict with the current account or resource state |
| `422` | Validation error |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `503` | Service temporarily unavailable |

Common error payload:

```json
{
  "code": "AUTH_INVALID_API_KEY",
  "detail": "Invalid API key"
}
```

Common codes:

- `AUTH_INVALID_API_KEY`
- `AUTH_API_KEY_REVOKED`
- `AUTH_ACCOUNT_DISABLED`
- `AUTH_FREE_TIER_IP_RESTRICTED`
- `RATE_LIMIT_EXCEEDED`
- `RATE_LIMIT_MONTHLY_QUOTA_EXCEEDED`
- `PRICES_INDEX_UNAVAILABLE`
- `BIDS_INDEX_UNAVAILABLE`
- `PORTFOLIO_NOT_FOUND`
- `PORTFOLIO_LIMIT_REACHED`
- `PORTFOLIO_ITEM_LIMIT_REACHED`
- `VALIDATION_ERROR`
