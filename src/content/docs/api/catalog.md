---
title: Catalog
description: Item search, provider metadata, and FX rates.
order: 14
---

## Items

### List Items
>
> Searches the CS2 item catalog and returns full item metadata for every match.

- Endpoint: GET `/items`
- Tiers: `free` · `pro` · `quant`
- Rate Limit: **Free**: 20/min · **Pro**: 100/min · **Quant**: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Case-insensitive substring search by name. |
| item_id | integer | Exact item ID match. |
| market_hash_name | string | Exact market hash name match, case-insensitive. |
| item_type | string | One of: `Weapon`, `Sticker`, `Sticker Slab`, `Graffiti`, `Charm`, `Crate`, `Music Kit`, `Patch`, `Collectible`, `Agent`, `Key`, `Tool`. |
| item_subtype | string | One of: `Autograph`, `Autograph Capsule`, `Capsule Key`, `Case Key`, `Collection Package`, `Counter-Terrorist`, `Equipment`, `Event`, `Gift`, `Gloves`, `Graffiti Box`, `Heavy`, `Highlight Reel`, `Knives`, `Music Kit Box`, `Normal`, `Operation Pass`, `Other`, `Patch Capsule`, `Pin`, `Pins Capsule`, `Pistols`, `Rifles`, `SMGs`, `Souvenir Highlight`, `Souvenir Package`, `StatTrak`, `Sticker Capsule`, `Team`, `Terrorist`, `Tournament Pass`, `Weapon Case`. |
| weapon_type | string | One of: `Wearable`, `Assault Rifle`, `Knife`, `Sniper Rifle`, `SMG`, `Pistol`, `Machinegun`, `Shotgun`. |
| base_name | string | Exact base name match, case-insensitive. |
| skin_name | string | Exact skin name match, case-insensitive. |
| wear_name | string | One of: `Factory New`, `Minimal Wear`, `Field-Tested`, `Well-Worn`, `Battle-Scarred`. |
| phase | string | One of: `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, `Ruby`, `Sapphire`, `Black Pearl`, `Emerald`. |
| collection | string | Exact collection match, case-insensitive. |
| crates | string | Filter by crate name. Repeat to pass multiple values. |
| rarity_name | string | One of: `Base Grade`, `Consumer Grade`, `Industrial Grade`, `Mil-Spec Grade`, `High Grade`, `Distinguished`, `Restricted`, `Remarkable`, `Exceptional`, `Classified`, `Exotic`, `Superior`, `Covert`, `Extraordinary`, `Master`, `Contraband`. |
| rarity_color | string | Rarity color hex. `b0c3d9`/`white`, `5e98d9`/`light blue`, `4b69ff`/`blue`, `8847ff`/`purple`, `d32ce6`/`pink`, `eb4b4b`/`red`, `e4ae39`/`orange`. |
| style_name | string | One of: `None`, `Gunsmith`, `Patina`, `Custom Paint Job`, `Hydrographic`, `Spray-Paint`, `Anodized Multicolored`, `Anodized Airbrushed`, `Solid Color`, `Anodized`, `Case Hardening`. |
| is_stattrak | boolean | Filter by StatTrak items. |
| is_souvenir | boolean | Filter by Souvenir items. |
| limit | integer | Max items to return (`1–1000`). Omit it to return the full matched payload. |

**Response Example:**

```json
{
    "items": [
        {
            "item_id": 9062,
            "market_hash_name": "★ Specialist Gloves | Crimson Kimono (Factory New)",
            "phase": null,
            "item_type": "Weapon",
            "item_subtype": "Gloves",
            "weapon_type": "Wearable",
            "base_name": "Specialist Gloves",
            "skin_name": "Crimson Kimono",
            "wear_name": "Factory New",
            "def_index": "5034",
            "paint_index": 10033,
            "collection": null,
            "crates": ["Glove Case", "Operation Hydra Case"],
            "rarity_name": "Extraordinary",
            "rarity_color": "eb4b4b",
            "style_name": "None",
            "is_stattrak": false,
            "is_souvenir": false,
            "min_float": 0.06,
            "max_float": 0.8,
            "image_url": "https://cdn.cs2c.app/images/econ/default_generated/specialist_gloves_specialist_kimono_diamonds_red_light_png.png",
            "supply": 48
        }
    ]
}
```

- If `limit` is omitted, all matched items are returned in a single response.
- `supply` is optional and appears only when that approximate circulating supply value is available.

### Get Item Catalog Metadata
>
> Returns catalog summary counts and filter option values for frontend search controls.

- Endpoint: GET `/items/metadata`
- Tiers: `free` · `pro` · `quant`
- Rate Limit: **Free**: 20/min · **Pro**: 100/min · **Quant**: 300/min

**Parameters:**

- None

**Response Example:**

```json
{
    "catalog": {
        "total_items": 39007
    },
    "filters": {
        "item_type": ["Weapon", "Sticker", "Charm"],
        "item_subtype": ["Rifles", "Pistols", "Knives"],
        "weapon_type": ["Assault Rifle", "Pistol", "Knife"],
        "wear_name": ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"],
        "phase": ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Ruby", "Sapphire", "Black Pearl", "Emerald"],
        "collection": ["The Arms Deal Collection", "The Dust Collection"],
        "rarity_name": ["Restricted", "Classified", "Covert"],
        "rarity_color": ["4b69ff", "8847ff", "d32ce6", "eb4b4b"],
        "style_name": ["Gunsmith", "Patina", "Custom Paint Job"]
    }
}
```

- Use this route to pre-load valid filter values before calling `GET /items`.

## Utilities

### List Providers
>
> Returns metadata, fee information, and live health data for enabled providers. You can optionally filter to one provider.

- Endpoint: GET `/providers`
- Tiers: `free` · `pro` · `quant`
- Rate Limit: **Free**: 20/min · **Pro**: 100/min · **Quant**: 300/min

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| provider | string | Optional provider key filter. Omit it to return all providers. One of: `avanmarket`, `bitskins`, `buff163`, `buffmarket`, `c5`, `csdeals`, `csfloat`, `csgo500`, `csgoempire`, `csmoney_m`, `csmoney_t`, `cstrade`, `dmarket`, `ecosteam`, `gamerpay`, `haloskins`, `itradegg`, `lisskins`, `lootfarm`, `mannco`, `marketcsgo`, `pirateswap`, `rapidskins`, `shadowpay`, `skinbaron`, `skinflow`, `skinout`, `skinplace`, `skinport`, `skinscom`, `skinsmonkey`, `skinswap`, `skinvault`, `steam`, `swapgg`, `tradeit`, `waxpeer`, `whitemarket`, `youpin`. |

**Response Example:**

```json
{
    "Avan Market": {
        "key": "avanmarket",
        "code": "AVAN",
        "market_type": "STORE",
        "default_currency": "USD",
        "fees": {
            "sell_fee": null,
            "insta_sell_fee": 0.14,
            "trading_spread_fee": null
        },
        "features": {
            "has_buy_orders": false,
            "has_recent_sales": false
        },
        "health": {
            "status": "up",
            "last_checked_at": "2026-03-21T05:47:49.308777+00:00",
            "total_offers": 221316,
            "unique_items": 14792,
            "market_coverage": 37.93,
            "total_value": 696770885,
            "total_value_usd": 696770885
        }
    },
    "BUFF163": {
        "key": "buff163",
        "code": "B163",
        "market_type": "P2P",
        "default_currency": "CNY",
        "fees": {
            "sell_fee": 0.025,
            "insta_sell_fee": null,
            "trading_spread_fee": null
        },
        "features": {
            "has_buy_orders": true,
            "has_recent_sales": true
        },
        "health": {
            "status": "up",
            "last_checked_at": "2026-03-21T05:45:55.403317+00:00",
            "total_offers": 4239178,
            "unique_items": 32235,
            "market_coverage": 82.66,
            "total_value": 101161038598,
            "total_value_usd": 14661379184
        }
    }
}
```

- `health.total_value` is in the provider's native `default_currency`.
- `health.total_value_usd` is the same value converted to USD.
- `fees` values are decimal fractions, for example `0.025` = 2.5%. `null` means that fee type does not apply.

---

### Get FX Rates
>
> Returns the current FX table with USD as the base currency. These rates are used to convert minor-unit price values into other currencies.

- Endpoint: GET `/fx`
- Tiers: `free` · `pro` · `quant`
- Rate Limit: **Free**: 20/min · **Pro**: 100/min · **Quant**: 300/min

**Response Example:**

```json
{
    "timestamp": "2026-03-20T22:00:48.904741+00:00",
    "rates": {
        "USD": 1,
        "BRL": 5.257551,
        "CAD": 1.372665,
        "CHF": 0.790629,
        "CNY": 6.899831,
        "EUR": 0.866447,
        "GBP": 0.747866,
        "PLN": 3.70293,
        "SGD": 1.279595
    }
}
```

- 160+ ISO 4217 currency codes are supported. The example above is shortened.
- Use the `currency` query parameter on market-data endpoints to receive values already converted.
