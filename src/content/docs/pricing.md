---
title: Pricing & Plans
description: Compare Free, Pro, and Quant tiers across endpoints, quotas, and features.
order: 2
---

cs2cap is currently in late beta. Access is granted manually and is free for
approved users during the beta window. Below is the full list of what each tier
unlocks once billing is live.

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
| `GET /v1/prices/batch` — multi-item price lookup | — | ✅ | ✅ |
| `GET /v1/prices/candles` — OHLC candles | ⚠️ daily only, per-provider | ✅ | ✅ |
| `GET /v1/prices/history` — historical prices (up to 365 d) | — | ✅ | ✅ |
| `GET /v1/bids` — highest buy orders | — | ✅ | ✅ |
| `GET /v1/bids/batch` — multi-item buy-order lookup | — | ✅ | ✅ |
| `GET /v1/sales` — recent sales | — | ✅ | ✅ |
| `GET /v1/items` — item catalog | ✅ | ✅ | ✅ |
| `GET /v1/providers` — marketplace catalog | ✅ | ✅ | ✅ |
| `GET /v1/fx` — currency conversion | ✅ | ✅ | ✅ |
| `GET /v1/portfolio` — portfolio management | ✅ | ✅ | ✅ |
| `GET /v1/portfolio/value` — portfolio valuation | ✅ | ✅ | ✅ |
| `GET /v1/inventory/steam` — Steam inventory import | ✅ | ✅ | ✅ |
| `GET /v1/market/items` — enriched item metadata | — | ✅ | ✅ |
| `GET /v1/market/arbitrage` — cross-market arbitrage | — | — | ✅ |
| `GET /v1/market/indicators` — technical indicators | — | — | ✅ |

> **Free-tier candles caveat.** Free keys can only query `/v1/prices/candles` with
> `interval=1d`, a named `provider`, no forward-fill, and a lookback-only time
> window. Pro and Quant have no such restrictions.

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

- **One active key per account** on all tiers. Quant additionally supports up to
  25 child keys for sub-leasing, each with optional quota and rate-limit caps.
- **Free keys are IP-bound.** The first successful request locks the key to that
  source IP. You can rebind once every 24 hours via
  `POST /v1/account/key/reset-ip`. Pro and Quant keys are not IP-bound.

## Included on Every Tier

- **39 supported marketplaces** — BUFF163, Youpin898, C5, CSFloat, Skinport,
  Skinbid, DMarket, Waxpeer, Bitskins, Haloskins, Market.csgo, Tradeit, and more.
- **Doppler phase differentiation** in prices, buy orders, and recent sales where
  the underlying marketplace exposes phase data.
- **5–10 minute data freshness** across most providers. Prices and bids are
  served from a Redis-first index, so they stay fresh even under heavy load.
- **Stable, machine-readable error codes** on every error response.
- **Consistent minor-unit pricing** — all monetary values are integers in the
  smallest unit of the currency (e.g. `2550` ⇒ `$25.50`).

## Billing

Paid tiers are billed monthly through Stripe.

- **Upgrading** (e.g. Pro → Quant) takes effect immediately with a prorated
  charge on the current invoice.
- **Downgrading** (e.g. Quant → Pro) is scheduled for the next billing cycle.
  You keep your current tier's access until then, and you can cancel the pending
  downgrade at any time before it applies.
- **Payment failures** put the subscription in `past_due` and drop you to the
  Free tier until Stripe resolves the retry. No data is lost.
- **Cancellation** is self-service through the Stripe customer portal. You
  return to the Free tier immediately on cancellation.
- **No trial period** is configured — during the beta, approved users are
  granted Pro or Quant access directly without billing.

## FAQ

**Can I upgrade or downgrade at any time?**
Yes. Upgrades are instant and prorated. Downgrades take effect at the end of
your current billing cycle and can be cancelled before then.

**What happens if I hit my monthly quota?**
Further requests return `429 RATE_LIMIT_MONTHLY_QUOTA_EXCEEDED` until the start
of your next billing period. Per-minute limits return `429 RATE_LIMIT_EXCEEDED`
with a `Retry-After` header.

**Is historical data really 365 days?**
Yes, on Pro and Quant. `/v1/prices/history` exposes up to one year of per-item,
per-provider history.

**Do I get all 39 marketplaces on Free?**
You can discover the full provider catalog on any tier, but live price, bid, and
sales data across all markets require Pro or Quant — Free is limited to current
prices.

**How do I get a key?**
While the API is in beta, keys are granted manually. Head to
[Quickstart](/getting-started) for the first-request walkthrough once you have
one.
