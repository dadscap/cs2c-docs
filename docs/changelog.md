# Changelog

Public-facing API, documentation, and platform changes that affect integrators.

Internal refactors and ops-only maintenance are intentionally omitted unless they change the public integration experience.

<div class="docs-release-overview" markdown>

<div class="docs-home-card docs-release-stat" markdown>
<div class="docs-release-stat__label">Tracks</div>
<div class="docs-release-stat__value">API surface and docs UX</div>
Request shapes, onboarding guidance, navigation changes, and notable platform-facing updates.
</div>

<div class="docs-home-card docs-release-stat" markdown>
<div class="docs-release-stat__label">Source</div>
<div class="docs-release-stat__value">Curated from repo history</div>
Entries summarize recent shipped work instead of mirroring raw commit subjects line by line.
</div>

<div class="docs-home-card docs-release-stat" markdown>
<div class="docs-release-stat__label">Use it for</div>
<div class="docs-release-stat__value">Upgrade checks</div>
Skim this page first, then verify details in the [API Reference](api-reference.md) and [Quickstart](getting-started.md).
</div>

</div>

## March 21, 2026

<div class="docs-release" markdown>
<div class="docs-release-eyebrow">Account and analytics</div>

### Watchlists, alerts, and indicators

- Added batch watchlist creates and paginated alert listings on the account surface.
- Added composite indicators computed from live composite candle data across providers.
- Kept alert event history cursor-based and aligned the public account contract with the latest market behavior.
</div>

## March 19, 2026

<div class="docs-release" markdown>
<div class="docs-release-eyebrow">Items and parsing</div>

### Catalog and item filtering

- Simplified `/v1/items` pagination so omitting `limit` returns the full matched payload.
- Added support for additional date formats and cleaned up StatTrak references in item filtering and history flows.
</div>

## March 18, 2026

<div class="docs-release" markdown>
<div class="docs-release-eyebrow">Documentation refresh</div>

### Public docs restructure

- Reorganized the public docs into a tighter top-level flow: Home, Quickstart, API Reference, Core Concepts, and Changelog.
- Removed standalone authentication and pagination pages from navigation in favor of consolidating those details into the main reference.
- Refreshed the landing page, theme styling, and supporting guide copy.

### Navigation and reading tools

- Added page-level `Copy Markdown`, `Copy to LLM`, and `Share` actions for quicker handoff into AI tools and internal team workflows.
- Improved sidebar accessibility and navigation behavior for longer reference pages.
- Versioned the custom CSS and JavaScript assets to reduce stale cached UI after deploys.

### Reference coverage

- Updated API reference sections, guides, and configuration notes to match the current public surface.
- Expanded coverage around account endpoints, authentication, and snapshot-oriented flows.
</div>

## March 17, 2026

<div class="docs-release" markdown>
<div class="docs-release-eyebrow">Catalog and platform</div>

### Catalog data pipeline

- Integrated the `CS2-APY` submodule for local catalog data fetching and background catalog sync.
- Updated the catalog submodule to the latest available revision used by this repo.

### Resilience work

- Improved inspect-link generation.
- Landed infrastructure hardening work aimed at making those flows more reliable.
</div>

## Upgrade Notes

<div class="docs-release" markdown>
<div class="docs-release-eyebrow">Before you ship</div>

### Re-check these pages

- Use [Quickstart](getting-started.md) to verify your first successful request still matches the current guidance.
- Use [API Reference](api-reference.md) as the source of truth for request parameters, response fields, and tier behavior.
- Use [Core Concepts](core-concepts.md) when validating minor units, provider keys, and indexed-only endpoint behavior.

### Pay attention to

- Navigation and docs UX updates that change where guidance lives.
- Response-shape corrections that clarify the latest documented contract.
- Platform notes that may change how you source catalog data or inspect links.
</div>
