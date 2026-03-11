# Authentication

Public market-data routes use API key authentication.

## Authorization Header

Send your API key in the `Authorization` header:

```http
Authorization: Bearer your_api_key_here
```

## Getting an API Key

1. Sign up with a supported OAuth provider.
2. Set and verify an email address for the account.
3. Read the initial API key, or reissue one, through the account flow.
4. Use the key for market-data requests with `Authorization: Bearer {api_key}`.

Notes:

- Max 1 active API key per account.
- Free-tier API keys are bound to a single source IP.
- Free-tier keys can be rebound to the current caller IP with `POST /v1/account/key/reset-ip`
  once every 24 hours.
- Email verification is required before initial key issuance.

## Authentication Scope

Use API keys for:

- `GET /v1/items`
- `GET /v1/providers`
- `GET /v1/prices`
- `GET /v1/bids`
- `GET /v1/sales`
- market analytics routes

Do not use API keys for:

- internal operational surfaces

## Rate-Limit Context

API keys are tied to account tiers:

| Tier | Requests/Minute | Requests/Month | Max `limit` |
| ---- | --------------- | -------------- | ----------- |
| `free` | 20 | 1,000 | 100 |
| `pro` | 100 | 50,000 | 1,000 |
| `quant` | 300 | 200,000 | 1,000 |

Free tier specifics:

- first successful use binds the key to a source IP
- `POST /v1/account/key/reset-ip` rebinds the active key to the caller IP
- analytics access is limited compared to higher tiers

Monthly quota applies to public core market-data endpoints. Non-core account, billing, recovery,
and verification routes keep burst protection but do not consume the advertised monthly quota.

## Common Auth Errors

| Status | Code | Meaning |
| ------ | ---- | ------- |
| `401` | `AUTH_INVALID_API_KEY` | API key is missing or invalid |
| `401` | `AUTH_API_KEY_REVOKED` | API key is no longer active |
| `403` | `AUTH_ACCOUNT_DISABLED` | Account is disabled |
| `403` | `AUTH_FREE_TIER_IP_RESTRICTED` | Free-tier key is being used from a different IP |
| `429` | `RATE_LIMIT_EXCEEDED` | Per-minute rate limit exceeded |
| `429` | `RATE_LIMIT_MONTHLY_QUOTA_EXCEEDED` | Monthly quota exhausted |

## Example Request

```bash
curl -H "Authorization: Bearer your_api_key_here" \
  "https://api.cs2c.app/v1/prices?item_id=1&currency=USD"
```

## Related Guides

- [Getting Started](getting-started.md)
- [API Reference](api-reference.md)
