---
title: Inventory
description: Live Steam inventory fetch endpoints for authenticated accounts.
order: 14.5
---

## Steam Inventory

### Fetch Steam Inventory
>
> Returns the authenticated user's live CS2 inventory from Steam. Requires a linked Steam account. No data is persisted.

- Endpoint: GET `/inventory/steam`
- Auth: Bearer token
- Rate Limit: Standard per-tier RPM

**Response Example:**

```json
{
  "data": [
    {
      "assetid": "12345678901234567",
      "market_hash_name": "AK-47 | Redline (Field-Tested)",
      "phase": null,
      "name": "AK-47 | Redline",
      "icon_url": "https://steamcommunity-a.akamaihd.net/economy/image/...",
      "tradable": true,
      "marketable": true,
      "quantity": 1,
      "float_value": 0.234512,
      "paint_seed": 123,
      "inspect_link": "steam://rungame/730/...",
      "name_tag": "Collector's piece",
      "stickers": [],
      "charms": []
    }
  ],
  "total_count": 1
}
```

- `total_count` is the total number of items Steam reported for the inventory.
- `stickers` and `charms` may be `null` when the item has none.

### Fetch Steam Inventory by Steam ID
>
> Looks up the CS2 inventory for any Steam account by Steam64ID or vanity URL name. Vanity URL resolution requires a Steam Web API key.

- Endpoint: GET `/inventory/steam/lookup`
- Auth: Bearer token
- Rate Limit: Standard per-tier RPM

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| steam_id | string | 17-digit Steam64ID or vanity URL name. |

**Response Example:**

```json
{
  "data": [
    {
      "assetid": "12345678901234567",
      "market_hash_name": "AK-47 | Redline (Field-Tested)",
      "phase": null,
      "name": "AK-47 | Redline",
      "icon_url": "https://steamcommunity-a.akamaihd.net/economy/image/...",
      "tradable": true,
      "marketable": true,
      "quantity": 1,
      "float_value": 0.234512,
      "paint_seed": 123,
      "inspect_link": "steam://rungame/730/...",
      "name_tag": null,
      "stickers": null,
      "charms": null
    }
  ],
  "total_count": 1
}
```

- The response envelope matches `GET /inventory/steam`.
- No data is persisted; this is a live fetch only.
