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
    title: "Fundamentals",
    href: "/api-reference",
    items: [
      { label: "Introduction", href: "/api-reference" },
      { label: "Quickstart Guide", href: "/quickstart" },
      { label: "Core Concepts", href: "/core-concepts" },
      { label: "Authentication", href: "/api-reference#authentication" },
      { label: "Rate Limits", href: "/api-reference#rate-limits" },
      { label: "Field Reference", href: "/field-reference" },
      { label: "Error Codes", href: "/api-reference#error-handling" },
    ],
  },
  {
    title: "Market Reference",
    href: "/api-reference/catalog",
    items: [
      { method: "GET", label: "/items", href: "/api-reference/catalog#get-items" },
      { method: "GET", label: "/items/market-ids", href: "/api-reference/catalog#get-market-ids" },
      { method: "GET", label: "/providers", href: "/api-reference/catalog#list-providers" },
      { method: "GET", label: "/fx", href: "/api-reference/catalog#get-fx-rates" },
    ],
  },
  {
    title: "Market Data",
    href: "/api-reference/prices",
    items: [
      { method: "GET", label: "/prices", href: "/api-reference/prices#list-prices" },
      { method: "POST", label: "/prices", href: "/api-reference/prices#stream-full-prices-snapshot" },
      { method: "POST", label: "/prices/batch", href: "/api-reference/prices#batch-prices-lookup" },
      { method: "GET", label: "/bids", href: "/api-reference/bids#list-bids" },
      { method: "POST", label: "/bids", href: "/api-reference/bids#stream-full-bids-snapshot" },
      { method: "POST", label: "/bids/batch", href: "/api-reference/bids#batch-bids-lookup" },
      { method: "GET", label: "/sales", href: "/api-reference/sales#get-sales" },
    ],
  },
  {
    title: "Market Intelligence",
    href: "/api-reference/prices",
    items: [
      { method: "GET", label: "/prices/history", href: "/api-reference/prices#price-history" },
      { method: "GET", label: "/prices/candles", href: "/api-reference/prices#price-candles" },
      { method: "GET", label: "/market/arbitrage", href: "/api-reference/market-analytics#get-marketarbitrage" },
      { method: "GET", label: "/market/indicators", href: "/api-reference/market-analytics#get-marketindicators" },
      { method: "GET", label: "/market/items/{id}", href: "/api-reference/market-analytics#get-marketitemsitem_id" },
    ],
  },
  {
    title: "Portfolio Operations",
    href: "/api-reference/portfolio",
    items: [
      { method: "GET", label: "/portfolio", href: "/api-reference/portfolio#list-portfolios" },
      { method: "POST", label: "/portfolio", href: "/api-reference/portfolio#create-portfolio" },
      { method: "GET", label: "/portfolio/{id}/items", href: "/api-reference/portfolio#list-items" },
      { method: "POST", label: "/portfolio/{id}/items", href: "/api-reference/portfolio#add-item" },
      { method: "GET", label: "/portfolio/{id}/value", href: "/api-reference/portfolio#value-saved-portfolio" },
      { method: "POST", label: "/portfolio/value", href: "/api-reference/portfolio#value-ad-hoc-list" },
      { method: "GET", label: "/portfolio/{id}/transactions", href: "/api-reference/portfolio#list-transactions" },
      { method: "POST", label: "/portfolio/{id}/transactions", href: "/api-reference/portfolio#record-transaction" },
      { method: "POST", label: "/portfolio/{id}/import", href: "/api-reference/portfolio#import-from-steam" },
      { method: "GET", label: "/portfolio/{id}/export", href: "/api-reference/portfolio#csv-export" },
      { method: "POST", label: "/portfolio/{id}/import/csv", href: "/api-reference/portfolio#csv-import" },
    ],
  },
  {
    title: "Account & Alerts",
    href: "/api-reference/account",
    items: [
      { method: "POST", label: "/account/key/reset-ip", href: "/api-reference/account#reset-ip-binding" },
      { method: "GET", label: "/account/watchlist", href: "/api-reference/account#get-watchlist" },
      { method: "POST", label: "/account/watchlist", href: "/api-reference/account#create-watchlist-entry" },
      { method: "GET", label: "/account/alerts", href: "/api-reference/account#get-alerts" },
      { method: "POST", label: "/account/alerts", href: "/api-reference/account#create-alert" },
      { method: "GET", label: "/account/alerts/events", href: "/api-reference/account#list-alert-events" },
    ],
  },
  {
    title: "Platform",
    href: "/changelog",
    items: [
      { label: "Changelog", href: "/changelog" },
      { label: "Status Page", href: "https://status.cs2c.app" },
    ],
  },
];
