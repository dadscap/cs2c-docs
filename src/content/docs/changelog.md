---
title: Changelog
description: Public-facing API, documentation, and platform changes that affect integrators.
order: 4
---

Internal refactors and ops-only maintenance are intentionally omitted unless they change the public integration experience.

## March 24, 2026

### Portfolio transactions and CSV import

- Added a full buy/sell transaction ledger for stateful portfolios.
- Added CSV import/export for both portfolio items (snapshots) and transaction ledgers.
- Added auto-detection of CSV formats to simplify bulk onboarding.

## March 23, 2026

### Stateful portfolio management

- Launched named portfolios for persistent item tracking.
- Added Steam inventory import to automatically sync inventories with portfolios.
- Added asset metadata support for portfolio items (floats, pattern seeds, stickers).
- Consolidated provider ID data into the `cs2c-provider-ids` submodule for more stable catalog mapping.

## March 22, 2026

### Batch lookups and tier flexibility

- Added `POST /v1/prices/batch` and `POST /v1/bids/batch` for efficient multi-item lookups (up to 100 items).
- Added `/v1/portfolio/value` as a standalone valuation service for ad-hoc item lists.
- Implemented internal tier visibility and more flexible capability gating for user accounts.
- Refined the price/bid candles with provider-specific meta data handling.

## March 21, 2026

### Watchlists, alerts, and indicators

- Added batch watchlist creates and paginated alert listings on the account surface.
- Added composite indicators computed from live composite candle data across providers.
- Kept alert event history cursor-based and aligned the public account contract with the latest market behavior.

## March 19, 2026

### Catalog and item filtering

- Simplified `/v1/items` pagination so omitting `limit` returns the full matched payload.
- Added support for additional date formats and cleaned up StatTrak references in item filtering and history flows.

## March 18, 2026

### Public docs restructure

- Reorganized the public docs into a tighter top-level flow: Home, Quickstart, API Reference, Core Concepts, and Changelog.
- Removed standalone authentication and pagination pages from navigation in favor of consolidating those details into the main reference.
- Refreshed the landing page, theme styling, and supporting guide copy.

### Navigation and reading tools

- Added page-level Copy Markdown, Copy to LLM, and Share actions for quicker handoff into AI tools and internal team workflows.
- Improved sidebar accessibility and navigation behavior for longer reference pages.
- Versioned the custom CSS and JavaScript assets to reduce stale cached UI after deploys.

### Reference coverage

- Updated API reference sections, guides, and configuration notes to match the current public surface.
- Expanded coverage around account endpoints, authentication, and snapshot-oriented flows.

## March 17, 2026

### Catalog data pipeline

- Integrated the `CS2-APY` submodule for local catalog data fetching and background catalog sync.
- Updated the catalog submodule to the latest available revision used by this repo.

### Resilience work

- Improved inspect-link generation.
- Landed infrastructure hardening work aimed at making those flows more reliable.

## Upgrade Notes

### Re-check these pages

- Use [Quickstart](/quickstart) to verify your first successful request still matches the current guidance.
- Use [API Reference](/api-reference) as the source of truth for request parameters, response fields, and tier behavior.
- Use [Core Concepts](/core-concepts) when validating minor units, provider keys, and indexed-only endpoint behavior.

### Pay attention to

- Navigation and docs UX updates that change where guidance lives.
- Response-shape corrections that clarify the latest documented contract.
- Platform notes that may change how you source catalog data or inspect links.
