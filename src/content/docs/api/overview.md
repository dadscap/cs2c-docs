---
title: API Reference
description: Authentication, tiers, response conventions, and error handling.
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
2. Set and verify an email address associated with the account.
3. Save the initial, or reissue a new, API key through the account flow.
4. Use the key with `Authorization: Bearer {api_key}` when sending requests.

Constraints:

- Maximum 1 active API key per account
- Free-tier keys bind to the first source IP that uses them
- Email verification is required before initial API key issuance or reissue

## Rate Limits

Rate limits are enforced per API key based on the user's tier:

| Tier | Requests/Minute | Requests/Month | Max `limit` Param |
| ---- | --------------- | -------------- | ----------------- |
| `free` | 20 | 1,000 | 100 |
| `pro` | 100 | 50,000 | 1,000 |
| `quant` | 300 | 200,000 | None* |

\* Unlimited streaming applies only to `POST /prices` and `POST /bids`. Most endpoints still use
per-route caps.

The standard limiter tracks the full 60-second tier window, so burst handling matches the
published per-minute rate instead of compressing it into a 1-second bucket.

**Per-endpoint special limits:**

- `POST /prices` and `POST /bids` have an additional per-key cooldown of **1 request per 30 seconds**, regardless of tier RPM.
- `POST /account/key/reset-ip` is limited to **1 request per 24 hours** per account.

`429` responses can include:

```http
Retry-After: 12345
X-RateLimit-Limit: 50000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 12345
X-RateLimit-Tier: pro
```

Monthly quota is charged only on public core market-data endpoints. Non-core account, billing,
verification, recovery, and alert/watchlist routes keep burst protection but do not consume the
advertised monthly quota.

## Response Conventions

- Most list endpoints return `items` plus `meta` and `pagination` when relevant.
- **Catalog query**: `GET /v1/items` returns all matched items in a single response if `limit` is omitted.
- Cursor endpoints intentionally use `pagination.total = -1`.
- Price fields such as `lowest_ask`, `highest_bid`, and `price` are returned in minor units of the response currency.
- `providers`, `providers_buy`, and `providers_sell` are repeatable query parameters.
- `provider` is a single provider-key string.

## Error Handling

Errors always return a stable machine-readable `code` plus a human-readable `detail`.

| Status | Meaning |
| ------ | ------- |
| `400` | Bad request |
| `401` | Missing or invalid API key |
| `403` | Valid credentials but insufficient permissions |
| `404` | Resource not found |
| `409` | Conflict with current account or resource state |
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
