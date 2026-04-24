export interface SidebarItem {
  method?: string;
  label: string;
  href: string;
}

export interface SidebarGroup {
  title: string;
  href: string;
  items: SidebarItem[];
}

export const sidebarGroups: SidebarGroup[] = [
  {
    title: "Overview",
    href: "/api-reference",
    items: [
      { label: "Base URL", href: "/api-reference#base-url" },
      { label: "Authentication", href: "/api-reference#authentication" },
      { label: "Getting an API Key", href: "/api-reference#getting-an-api-key" },
      { label: "Rate Limits", href: "/api-reference#rate-limits" },
      { label: "Response Conventions", href: "/api-reference#response-conventions" },
      { label: "Error Handling", href: "/api-reference#error-handling" },
    ],
  },
  {
    title: "Account",
    href: "/api-reference/account",
    items: [
      { method: "GET", label: "/account/key", href: "/api-reference/account#get-active-key" },
      { method: "POST", label: "/account/key/reissue", href: "/api-reference/account#reissue-active-key" },
    ],
  },
  {
    title: "Prices",
    href: "/api-reference/prices",
    items: [
      { method: "GET", label: "/prices", href: "/api-reference/prices#list-prices" },
      { method: "POST", label: "/prices", href: "/api-reference/prices#stream-full-prices-snapshot" },
      { method: "POST", label: "/prices/batch", href: "/api-reference/prices#batch-prices-lookup" },
      { method: "GET", label: "/prices/candles", href: "/api-reference/prices#price-candles" },
      { method: "GET", label: "/prices/history", href: "/api-reference/prices#price-history" },
    ],
  },
  {
    title: "Bids",
    href: "/api-reference/bids",
    items: [
      { method: "GET", label: "/bids", href: "/api-reference/bids#list-bids" },
      { method: "POST", label: "/bids", href: "/api-reference/bids#stream-full-bids-snapshot" },
      { method: "POST", label: "/bids/batch", href: "/api-reference/bids#batch-bids-lookup" },
    ],
  },
  {
    title: "Sales",
    href: "/api-reference/sales",
    items: [
      { method: "GET", label: "/sales", href: "/api-reference/sales#list-recent-sales" },
    ],
  },
  {
    title: "Catalog",
    href: "/api-reference/catalog",
    items: [
      { method: "GET", label: "/items", href: "/api-reference/catalog#list-items" },
      { method: "GET", label: "/items/metadata", href: "/api-reference/catalog#get-item-catalog-metadata" },
      { method: "GET", label: "/providers", href: "/api-reference/catalog#list-providers" },
      { method: "GET", label: "/fx", href: "/api-reference/catalog#get-fx-rates" },
    ],
  },
  {
    title: "Market Analytics",
    href: "/api-reference/market-analytics",
    items: [
      { method: "GET", label: "/market/arbitrage", href: "/api-reference/market-analytics#get-arbitrage-opportunities" },
      { method: "GET", label: "/market/indices", href: "/api-reference/market-analytics#get-market-indices" },
      { method: "GET", label: "/market/indicators", href: "/api-reference/market-analytics#get-technical-indicators" },
      { method: "GET", label: "/market/items", href: "/api-reference/market-analytics#get-market-item-snapshot" },
      { method: "GET", label: "/market/items/{item_id}", href: "/api-reference/market-analytics#get-item-analytics" },
    ],
  },
  {
    title: "Inventory",
    href: "/api-reference/inventory",
    items: [
      { method: "GET", label: "/inventory/steam", href: "/api-reference/inventory#fetch-steam-inventory" },
      { method: "GET", label: "/inventory/steam/lookup", href: "/api-reference/inventory#fetch-steam-inventory-by-steam-id" },
    ],
  },
  {
    title: "Portfolio",
    href: "/api-reference/portfolio",
    items: [
      { method: "POST", label: "/portfolio", href: "/api-reference/portfolio#create-portfolio" },
      { method: "GET", label: "/portfolio", href: "/api-reference/portfolio#list-portfolios" },
      { method: "POST", label: "/portfolio/value", href: "/api-reference/portfolio#value-ad-hoc-list" },
      { method: "DELETE", label: "/portfolio/{id}", href: "/api-reference/portfolio#delete-portfolio" },
      { method: "POST", label: "/portfolio/{id}/import", href: "/api-reference/portfolio#import-from-steam" },
      { method: "POST", label: "/portfolio/{id}/import/csv", href: "/api-reference/portfolio#csv-import" },
      { method: "GET", label: "/portfolio/{id}/export", href: "/api-reference/portfolio#csv-export" },
      { method: "GET", label: "/portfolio/{id}/items", href: "/api-reference/portfolio#list-items" },
      { method: "POST", label: "/portfolio/{id}/items", href: "/api-reference/portfolio#add-item" },
      { method: "DELETE", label: "/portfolio/{id}/items/{entry_id}", href: "/api-reference/portfolio#remove-item" },
      { method: "GET", label: "/portfolio/{id}/value", href: "/api-reference/portfolio#value-saved-portfolio" },
      { method: "GET", label: "/portfolio/{id}/history", href: "/api-reference/portfolio#historical-saved-portfolio-valuation" },
      { method: "GET", label: "/portfolio/{id}/transactions", href: "/api-reference/portfolio#list-transactions" },
      { method: "POST", label: "/portfolio/{id}/transactions", href: "/api-reference/portfolio#record-transaction" },
      { method: "PATCH", label: "/portfolio/{id}/transactions/{tx_id}", href: "/api-reference/portfolio#update-transaction" },
      { method: "DELETE", label: "/portfolio/{id}/transactions/{tx_id}", href: "/api-reference/portfolio#delete-transaction" },
    ],
  },
  {
    title: "Alerts",
    href: "/api-reference/alerts",
    items: [
      { method: "POST", label: "/account/alerts", href: "/api-reference/alerts#create-alert" },
      { method: "POST", label: "/account/alerts/batch", href: "/api-reference/alerts#create-alerts-batch" },
      { method: "GET", label: "/account/alerts", href: "/api-reference/alerts#get-alerts" },
      { method: "PATCH", label: "/account/alerts/{id}", href: "/api-reference/alerts#update-alert" },
      { method: "DELETE", label: "/account/alerts/{id}", href: "/api-reference/alerts#delete-alert" },
      { method: "GET", label: "/account/alerts/events", href: "/api-reference/alerts#list-alert-events" },
    ],
  },
  {
    title: "Sub-keys",
    href: "/api-reference/sub-keys",
    items: [
      { method: "GET", label: "/account/sub-keys", href: "/api-reference/sub-keys#list-sub-keys" },
      { method: "POST", label: "/account/sub-keys", href: "/api-reference/sub-keys#create-sub-key" },
      { method: "GET", label: "/account/sub-keys/{key_id}", href: "/api-reference/sub-keys#get-sub-key" },
      { method: "PATCH", label: "/account/sub-keys/{key_id}", href: "/api-reference/sub-keys#update-sub-key" },
      { method: "DELETE", label: "/account/sub-keys/{key_id}", href: "/api-reference/sub-keys#delete-sub-key" },
      { method: "POST", label: "/account/sub-keys/{key_id}/reissue", href: "/api-reference/sub-keys#reissue-sub-key" },
    ],
  },
  {
    title: "Webhooks",
    href: "/api-reference/webhooks",
    items: [
      { method: "GET", label: "/account/webhooks", href: "/api-reference/webhooks#list-webhooks" },
      { method: "POST", label: "/account/webhooks", href: "/api-reference/webhooks#create-webhook" },
      { method: "GET", label: "/account/webhooks/deliveries", href: "/api-reference/webhooks#list-webhook-deliveries" },
      { method: "GET", label: "/account/webhooks/deliveries/{delivery_id}", href: "/api-reference/webhooks#get-webhook-delivery" },
      { method: "PATCH", label: "/account/webhooks/{webhook_id}", href: "/api-reference/webhooks#update-webhook" },
      { method: "DELETE", label: "/account/webhooks/{webhook_id}", href: "/api-reference/webhooks#delete-webhook" },
      { method: "POST", label: "/account/webhooks/{webhook_id}/rotate-secret", href: "/api-reference/webhooks#rotate-webhook-secret" },
    ],
  },
];
