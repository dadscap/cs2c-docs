---
title: Catalog
description: Item search, provider-native IDs, provider metadata, and FX rates.
order: 14
---

## GET /items

**Parameters:**

- `q` | `string` | Search by name substring (case-insensitive).
- `item_id` | `integer` | Exact item ID match.
- `market_hash_name` | `string` | Exact market hash name match (case-insensitive).
- `item_type` | `string` | Exact item type match (case-insensitive).
- `item_subtype` | `string` | Exact item subtype match (case-insensitive).
- `weapon_type` | `string` | Exact weapon type match (case-insensitive).
- `base_name` | `string` | Exact base name match (case-insensitive).
- `skin_name` | `string` | Exact skin name match (case-insensitive).
- `wear_name` | `string` | Exact wear name match (case-insensitive).
- `phase` | `string` | Exact phase match (case-insensitive).
- `collection` | `string` | Exact collection match (case-insensitive).
- `crates` | `string` | Filter by crate names. Repeat the parameter or pass multiple values as supported by your client.
- `rarity_name` | `string` | Exact rarity name match (case-insensitive).
- `rarity_color` | `string` | Exact rarity color hex or alias match (case-insensitive).
- `style_name` | `string` | Exact style name match (case-insensitive).
- `is_stattrak` | `boolean` | Filter by StatTrak items.
- `is_souvenir` | `boolean` | Filter by Souvenir items.
- `limit` | `integer` | `1-1000` | Maximum number of returned items when provided. Omit to return the full matched payload.

**Notes:**

- Available to: `free` / `pro` / `quant`
- Authentication: Bearer API key
- If `limit` is omitted, `/items` returns all matched items in a single response
- Item payloads can include optional `supply`

---

## GET /items/market-ids

**Parameters:**

No parameters

**Notes:**

- Available to: `free` / `pro` / `quant`
- Authentication: Bearer API key
- Returns a mapping of every `market_hash_name` to provider-native item identifiers

---

## GET /providers

**Parameters:**

- `provider` | `Enum[provider key]` | Optional single provider-key filter. Omit to return all providers.

**Notes:**

- Available to: `free` / `pro` / `quant`
- Authentication: Bearer API key
- `health.total_value` is in the provider's native `default_currency`
- `health.total_value_usd` is the same value normalized to USD

---

## GET /fx

**Parameters:**

No parameters

**Notes:**

- Available to: `free` / `pro` / `quant`
- Authentication: Bearer API key
- Returns the current FX table with base currency `USD`
