---
title: Pricing & Plans
description: Compare Free, Pro, and Quant by endpoint access, quotas, and features.
order: 2
---

## At a Glance

| | **Free** | **Pro** | **Quant** |
|---|---|---|---|
| Monthly price | **$0** | **$79** | **$179** |
| Requests / month | 1,000 | 500,000 | 1,000,000 |
| Requests / minute | 20 | 100 | 300 |
| `limit` query param cap | 100 | 1,000 | 1,000 |
| Support | — | Basic | Priority (24 h SLA) |
| Best for | Evaluation & hobby use | Traders, bots, tooling | Analytics, B2B, resellers |

## Endpoint Access

| Endpoint | Free | Pro | Quant |
|---|:---:|:---:|:---:|
| `GET /v1/prices` — current lowest asks | ✅ | ✅ | ✅ |
| `POST /v1/prices` — full prices snapshot (NDJSON stream) | — | ✅ | ✅ |
| `POST /v1/prices/batch` — multi-item price lookup | — | ✅ | ✅ |
| `GET /v1/prices/candles` — OHLC candles | ⚠️ daily only | ✅ | ✅ |
| `GET /v1/prices/history` — historical prices (up to 365 d) | — | ✅ | ✅ |
| `GET /v1/bids` — highest buy orders | — | ✅ | ✅ |
| `POST /v1/bids` — full bids snapshot (NDJSON stream) | — | ✅ | ✅ |
| `POST /v1/bids/batch` — multi-item buy-order lookup | — | ✅ | ✅ |
| `GET /v1/sales` — recent sales | — | ✅ | ✅ |
| `GET /v1/items` — item catalog | ✅ | ✅ | ✅ |
| `GET /v1/items/metadata` — catalog filter metadata | ✅ | ✅ | ✅ |
| `GET /v1/providers` — marketplace catalog | ✅ | ✅ | ✅ |
| `GET /v1/fx` — currency conversion | ✅ | ✅ | ✅ |
| `GET /v1/portfolio` — portfolio management | ✅ | ✅ | ✅ |
| `GET /v1/portfolio/value` — portfolio valuation | ✅ | ✅ | ✅ |
| `GET /v1/inventory/steam` — Steam inventory import | ✅ | ✅ | ✅ |
| `GET /v1/market/items` — enriched item metadata | — | ✅ | ✅ |
| `GET /v1/market/arbitrage` — cross-market arbitrage | — | — | ✅ |
| `GET /v1/market/indicators` — technical indicators | — | — | ✅ |

> **Free-tier candles limitation:** Free keys can only use `/v1/prices/candles` with `interval=1d`, no forward-fill, and a lookback-only time window measured in days (for example `7d` or `7`). Pro and Quant do not have these restrictions.

## Features & Add-ons

| Feature | Free | Pro | Quant |
|---|:---:|:---:|:---:|
| Raw provider listing URLs in responses | — | ✅ | ✅ |
| Bulk snapshot exports | — | ✅ | ✅ |
| Cross-market arbitrage scanner | — | — | ✅ |
| Technical indicators (RSI, MACD, EMA, …) | — | — | ✅ |
| Customer webhooks | — | — | ✅ |
| Child API keys for sub-leasing | — | — | ✅ up to **25** per account |
| Per-child key quota & rate overrides | — | — | ✅ |

## Portfolio Limits

| Limit | Free | Pro | Quant |
|---|---:|---:|---:|
| Max portfolios | 20 | 50 | 1,000 |
| Max items per portfolio | 1,000 | 5,000 | 10,000 |

## API Key Rules

- **One active key per account** on all tiers.
- **Quant supports child keys.** Quant accounts can create up to 25 child keys for sub-leasing, each with optional quota and rate-limit caps.
- **Free keys are IP-bound.** The first successful request binds the key to that source IP. You can rebind it once every 24 hours with `POST /account/key/reset-ip`. Pro and Quant keys are not IP-bound.

## Included on Every Tier

- **39 supported marketplaces**, including BUFF163, Youpin898, C5, CSFloat, Skinport, Skinbid, DMarket, Waxpeer, Bitskins, Haloskins, Market.csgo, Tradeit, and more.
- **Doppler phase differentiation** in prices, buy orders, and recent sales when the underlying marketplace exposes phase data.
- **5–10 minute data freshness** across most providers. Prices and bids are served from a Redis-first index to stay responsive under load.
- **Stable, machine-readable error codes** on every error response.
- **Consistent minor-unit pricing** for all monetary values, for example `2550` = `$25.50`.

## Billing

Paid tiers are billed monthly through Stripe.

- **Upgrades** take effect immediately and are prorated on the current invoice.
- **Downgrades** take effect at the start of the next billing cycle. Until then, you keep your current tier's access.
- **Payment failures** move the subscription to `past_due` and drop the account to the Free tier until Stripe resolves the retry. No data is lost.
- **Cancellation** is self-service through the Stripe customer portal. Cancelled subscriptions remain active until the end of the current billing cycle, then revert to the Free tier.

## FAQ

**Can I upgrade or downgrade at any time?**  
Yes. Upgrades are immediate and prorated. Downgrades take effect at the end of the current billing cycle and can be cancelled before then.

**What happens if I hit my monthly quota?**  
Further requests return `429 RATE_LIMIT_MONTHLY_QUOTA_EXCEEDED` until the next billing period begins. Per-minute limits return `429 RATE_LIMIT_EXCEEDED` with a `Retry-After` header.

**Is historical data really 365 days?**  
Yes. Pro and Quant include up to one year of per-item, per-provider history through `/v1/prices/history`.

**Do I get all 39 marketplaces on Free?**  
You can view the provider catalog on every tier, but live cross-market price, bid, and sales coverage requires Pro or Quant. Free is limited to current prices.

**How do I get a key?**  
Visit [cs2cap.com](https://cs2cap.com/), create an account if you have not already done so, verify your email address, and then generate an API key from [Account API Keys](https://cs2cap.com/account/api-keys).
