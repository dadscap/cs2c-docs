---
title: Account
description: Account profile, API key lifecycle, preferences, watchlists, alerts, exports, and recovery.
order: 16
---

## Account Overview

### Get Account
>
> Returns the authenticated user's account profile, current tier, usage summary, linked providers, limits, and required actions.

- Endpoint: GET `/account`
- Auth: API key required
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Response Notes:**

- Includes `tier_info`, `usage`, `active_key_summary`, `linked_providers`, `limits`, and `required_actions`.
- `limits.max_watchlist_items`, `limits.max_active_alerts`, `limits.max_webhook_destinations`, `limits.max_portfolios`, and `limits.max_portfolio_items` reflect the caller's effective tier.
- `active_key_summary` exposes metadata only, never the full plaintext key.

---

### Get Usage
>
> Returns dashboard-style usage data for the current billing period, including daily usage, top endpoints, and an exhaustion projection.

- Endpoint: GET `/account/usage`
- Auth: API key required
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Response Notes:**

- Includes current month totals plus `daily_usage`, `top_endpoints`, and `projection`.
- Intended for dashboards and self-service quota visibility.
- Legacy summary fields remain present for backward compatibility.

---

## API Key Management

### Get API Key Metadata
>
> Returns metadata for the active API key backing the current request.

- Endpoint: GET `/account/key`
- Auth: API key required
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Response Notes:**

- Returns `id`, `key_prefix`, `created_at`, `last_used_at`, `expires_at`, and IP-binding fields.
- Does not return the plaintext key value.

---

### Reissue API Key
>
> Revokes the current active key and returns a replacement API key one time.

- Endpoint: POST `/account/key/reissue`
- Auth: API key required
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Response Example:**

```json
{
  "key": "sk_live_<redacted>",
  "key_prefix": "sk_live_ex",
  "id": "6de7dba2-b4cf-4cda-9d64-34114d1922e1",
  "created_at": "2026-03-02T11:20:00Z",
  "message": "Store this key securely. It will not be shown again."
}
```

- Email must be present and verified before key issuance or reissue.
- Responses containing plaintext keys are intentionally non-cacheable.

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

## Preferences

### Get Preferences
>
> Returns mutable account preferences such as preferred currency, timezone, and non-essential email settings.

- Endpoint: GET `/account/preferences`
- Auth: API key required
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Response Fields:**

- `preferred_currency`
- `timezone`
- `alert_emails_enabled`
- `product_update_emails_enabled`

---

### Update Preferences
>
> Partially updates account preferences.

- Endpoint: PATCH `/account/preferences`
- Auth: API key required
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Payload:**

| Field | Type | Description |
|-------|------|-------------|
| preferred_currency | string | Supported ISO 4217 currency code. |
| timezone | string | Valid IANA timezone. |
| alert_emails_enabled | boolean | Enables or disables non-essential alert emails. |
| product_update_emails_enabled | boolean | Enables or disables non-essential product update emails. |

- At least one field must be provided.
- This does not disable essential account/security emails.

---

## Webhooks

### List Webhooks
>
> Returns configured outbound webhook destinations for the authenticated account.

- Endpoint: GET `/account/webhooks`
- Auth: API key required
- Tiers: tiers with webhook access

- Each row includes destination metadata, active state, `secret_last4`, and the last observed success/failure timestamps.
- Plaintext signing secrets are never returned by this route.

### Create Webhook
>
> Creates an outbound webhook destination and returns the signing secret once.

- Endpoint: POST `/account/webhooks`
- Auth: API key required
- Tiers: tiers with webhook access

- Enforces the tier-backed `limits.max_webhook_destinations` cap.
- The response includes destination metadata plus a one-time plaintext secret. Store it on the receiver side.

### Update / Delete / Rotate Secret
>
> Mutable webhook management routes for existing destinations.

- Endpoints:
  - PATCH `/account/webhooks/{webhook_id}`
  - DELETE `/account/webhooks/{webhook_id}`
  - POST `/account/webhooks/{webhook_id}/rotate-secret`
- Auth: API key required
- Tiers: tiers with webhook access

- Rotating the secret returns a new one-time plaintext secret.
- Deleting or deactivating a destination only affects future alert fan-out.

### Delivery History
>
> Delivery logs for outbound webhook jobs created from alert events.

- Endpoints:
  - GET `/account/webhooks/deliveries`
  - GET `/account/webhooks/deliveries/{delivery_id}`
- Auth: API key required
- Tiers: tiers with webhook access

- List responses include status, attempts, last HTTP status, and next retry timestamp when applicable.
- Detail responses include the immutable payload snapshot and per-attempt history.

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

## Data Export

### Create Account Export
>
> Starts an asynchronous account export job.

- Endpoint: POST `/account/export`
- Auth: API key required
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

- Export contents include account profile, tier summary, key metadata, preferences, watchlist items, alerts, and lightweight usage data.
- If an export job is already running, the endpoint returns a conflict-style error.

---

### Get Account Export Job
>
> Returns status metadata for an existing export job owned by the authenticated user.

- Endpoint: GET `/account/export/{job_id}`
- Auth: API key required
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

---

### Download Account Export
>
> Downloads the completed `json.gz` artifact for an export job.

- Endpoint: GET `/account/export/{job_id}/download`
- Auth: API key required
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

---

## Email Verification And Recovery

### Send Verification Email
>
> Sends a verification email to the current account email address.

- Endpoint: POST `/account/verify-email/send`
- Auth: API key required
- Rate Limit: Cooldown-protected resend flow

- Requires an email to already exist on the account.
- Resend is throttled.

---

### Set Initial Email
>
> Sets an email address for accounts that currently do not have one and immediately starts verification.

- Endpoint: POST `/account/email`
- Auth: API key required
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

- Intended for OAuth users who authenticated without an account email.
- If email delivery fails after the email is saved, the email remains saved and the route returns `503`.

---

### Change Email
>
> Starts the verified email-change flow for the current user.

- Endpoint: PATCH `/account/email`
- Auth: API key required
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

- Sends a confirmation flow to the new email address.
- Returns `409` if the target email is already in use.

---

### Confirm Email Verification
>
> Confirms a verification or email-change token. If the account does not yet have an active API key, this can also return the initial key one time.

- Endpoint: POST `/account/verify-email/confirm`
- Auth: Public endpoint

**Payload:**

```json
{
  "token": "token-from-email-link"
}
```

- Responses that include a plaintext key are intentionally non-cacheable.

---

### Request Account Recovery
>
> Starts account recovery by email. Always returns success to avoid account enumeration.

- Endpoint: POST `/account/recover`
- Auth: Public endpoint

**Payload:**

```json
{
  "email": "user@example.com"
}
```

- Cooldown-limited per normalized email digest.

---

### Confirm Account Recovery
>
> Consumes a recovery token and rotates the account API key.

- Endpoint: POST `/account/recover/confirm`
- Auth: Public endpoint

**Payload:**

```json
{
  "token": "token-from-email-link"
}
```

**Response Example:**

```json
{
  "key": "sk_live_<redacted>",
  "key_id": "6de7dba2-b4cf-4cda-9d64-34114d1922e1",
  "user_id": "f66f15b1-3f2a-4c79-8cf3-77f14fb84f48"
}
```

---

## Account Lifecycle

### Delete Account
>
> Deactivates and anonymizes the current account while preserving aggregate usage analytics.

- Endpoint: DELETE `/account`
- Auth: API key required
- Rate Limit: Standard per-tier RPM (exempt from monthly quota)

**Confirmation:**

- Send `confirm=DELETE` as a query parameter.
- The legacy JSON body `{ "confirm": "DELETE" }` is still accepted.
