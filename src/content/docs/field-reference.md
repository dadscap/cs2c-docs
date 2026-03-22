---
title: Field Reference
description: Type definitions and descriptions for fields returned across CS2C-API endpoints.
order: 4
---

## Field Availability

Fields marked "Yes" are returned by the endpoint. Fields marked "–" are not part of that response.

| Field | /prices | /bids | /sales | /items |
| ----- | ------- | ----- | ------ | ------ |
| item_id | Yes | Yes | Yes | Yes |
| market_hash_name | Yes | Yes | Yes | Yes |
| phase | Yes | Yes | Yes | Yes |
| provider | Yes | Yes | Yes | – |
| lowest_ask | Yes | – | – | – |
| highest_bid | – | Yes | – | – |
| price | – | – | Yes | – |
| quantity | Yes | – | Yes | – |
| num_bids | – | Yes | – | – |
| link | Yes | – | – | – |
| url | Yes (paid) | – | – | – |
| timestamp | Yes | Yes | – | – |
| last_updated | Yes | Yes | – | – |
| sold_at | – | – | Yes | – |
| recorded_at | – | – | Yes | – |

---

## Item Identity

These fields identify an item and appear in nearly every response across the API.

| Field | Type | Description |
| ----- | ---- | ----------- |
| item_id | integer | Normalized catalog item ID assigned by this API. Stable across providers. <br>Prefer this over `market_hash_name` once your application has resolved it once. |
| market_hash_name | string | Canonical Steam market hash name for the item, e.g. `★ Gut Knife \| Fade (Factory New)`. Used to look up items when `item_id` is not available. |
| phase | string | Doppler or Gamma Doppler variant label, for example `Phase 1` or `Emerald`.<br> `null` when the field is not applicable to that item. |
| provider | string | Provider key used by this API, e.g. `steam`, `buff163`, or `csfloat`. <br>Always use keys — not brand names — in request parameters. |

---

## Price Fields

All price fields are returned in **minor units** of the response currency. Divide by 100 for display.

For example, `lowest_ask = 2550` with `currency = USD` = **us$25.50**

| Field | Type | Endpoint | Description |
| ----- | ---- | -------- | ----------- |
| lowest_ask | integer | `/prices` | Current best ask price across listed offers. |
| highest_bid | integer | `/bids` | Current best buy order price. |
| price | integer | `/sales` | Completed sale transaction price.  |
| best_ask | integer | `/portfolio/value` | Minimum ask across all queried providers for the item. |
| item_value | integer | `/portfolio/value` | `best_ask` × `quantity`. |
| total_value | integer | `/portfolio/value` | Sum of all `item_value` amounts in the response. |

---

## Sale Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| quantity | integer | Number of units in the listing (`/prices`) or units sold in the transaction (`/sales`). |
| num_bids | integer | Count of active buy orders at the reported `highest_bid` price level. |
| sold_at | datetime | ISO 8601 UTC timestamp for when the sale occurred on the provider's marketplace. |
| recorded_at | datetime | ISO 8601 UTC timestamp for when this system ingested or recorded the sale event. |
| currency | string | ISO 4217 currency code for the values in this record, for example `USD`. |

---

## Timestamp Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| timestamp | datetime | Timestamp for when the current `price` + `quantity` combination was tracked for a provider. |
| last_updated | datetime | ISO 8601 UTC timestamp for when this system last ingested or processed the record. Distinct from `timestamp`, which reflects the provider's own observation time. |
| sold_at | datetime | ISO 8601 UTC timestamp for the sale event time as reported by the provider. |
| recorded_at | datetime | ISO 8601 UTC timestamp for when this system stored the sale record. |

---

## Link Fields

| Field | Type | Tier | Description |
| ----- | ---- | ---- | ----------- |
| link | string | All tiers | Tracked redirect URL via this API's domain (`/r/:provider/:item_id`). Resolves to the provider marketplace listing. May include affiliate or referral tracking. |
| url | string | `pro` `quant` | Raw direct marketplace URL with no API-domain redirect. |

---

## Pagination

List endpoints return a `pagination` object alongside `items`.

| Field | Type | Description |
| ----- | ---- | ----------- |
| limit | integer | Items per page, as requested. |
| offset | integer | Zero-based starting position for offset endpoints. |
| total | integer | Total matching items available. Returns `-1` on cursor-based endpoints where counting is intentionally skipped for performance. |
| has_next | boolean | Whether additional items exist after the current page. |
| has_prev | boolean | Whether items exist before the current page. |
| next_cursor | string | Opaque cursor string for cursor-based endpoints. Pass this as the `cursor` parameter to retrieve the next page. `null` when no further pages exist. |

---

## Response Envelope

| Field | Type | Description |
| ----- | ---- | ----------- |
| items | array | Primary data payload for all list endpoints. |
| pagination | object | Pagination metadata. See [Pagination](#pagination) above. |
| meta | object | Response context: active currency, effective filters, queried providers, etc. |
| meta.currency | string | ISO 4217 currency code that all price values in this response are expressed in. |
| meta.returned_providers | array[string] | Provider keys that returned data in this response. May be a subset of what was requested if some providers had no matching data. |
| meta.filters | object | Echo of the effective filters applied to this request, including `market_hash_name`, `phase`, and `requested_providers`. |

---

## Item Catalog Fields

Fields returned by `/items`. All are nullable — a `null` value means the attribute is not applicable or not known for that item.

| Field | Type | Description |
| ----- | ---- | ----------- |
| item_type | string | Top-level item class, for example `weapon`, `gloves`, or `sticker`. |
| item_subtype | string | Sub-classification within `item_type`, for example weapon family. |
| weapon_type | string | Weapon-specific classification when applicable. |
| base_name | string | Base weapon or item name without finish or wear qualifiers. |
| skin_name | string | Finish or paint name applied to the base item. |
| wear_name | string | Exterior/wear bucket, for example `Factory New` or `Field-Tested`. |
| rarity_name | string | Human-readable rarity tier, for example `Classified` or `Covert`. |
| rarity_color | string | Rarity color as a normalized hex alias. |
| collection | string | Collection name the item belongs to, when the value exists. |
| crates | array[string] | Case or crate sources the item can be unboxed from. |
| is_stattrak | boolean | Whether the item is a StatTrak variant. |
| is_souvenir | boolean | Whether the item is a Souvenir variant. |
| min_float | float | Minimum possible float value for this item variant. |
| max_float | float | Maximum possible float value for this item variant. |
| def_index | string | CS2 definition index identifying the base item type. |
| paint_index | integer | CS2 paint index for the skin variant. |
| image_url | string | Item artwork served through our CDN. |
| supply | integer | Approximate total circulating supply, when available. |

---

## Related

- [Core Concepts](/core-concepts) — terminology and data semantics
- [API Reference](/api-reference) — authentication, rate limits, and error codes
