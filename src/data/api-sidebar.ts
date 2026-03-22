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
      { label: "Rate Limits", href: "/api-reference#rate-limits" },
      { label: "Response Conventions", href: "/api-reference#response-conventions" },
      { label: "Error Handling", href: "/api-reference#error-handling" },
    ],
  },
  {
    title: "Prices",
    href: "/api-reference/prices",
    items: [
      { method: "GET", label: "/prices", href: "/api-reference/prices#get-prices" },
      { method: "POST", label: "/prices", href: "/api-reference/prices#post-prices" },
      { method: "GET", label: "/prices/history", href: "/api-reference/prices#get-priceshistory" },
      { method: "GET", label: "/prices/candles", href: "/api-reference/prices#get-pricescandles" },
    ],
  },
  {
    title: "Bids",
    href: "/api-reference/bids",
    items: [
      { method: "GET", label: "/bids", href: "/api-reference/bids#get-bids" },
      { method: "POST", label: "/bids", href: "/api-reference/bids#post-bids" },
    ],
  },
  {
    title: "Sales",
    href: "/api-reference/sales",
    items: [
      { method: "GET", label: "/sales", href: "/api-reference/sales#get-sales" },
    ],
  },
  {
    title: "Catalog",
    href: "/api-reference/catalog",
    items: [
      { method: "GET", label: "/items", href: "/api-reference/catalog#get-items" },
      { method: "GET", label: "/items/market-ids", href: "/api-reference/catalog#get-itemsmarket-ids" },
      { method: "GET", label: "/providers", href: "/api-reference/catalog#get-providers" },
      { method: "GET", label: "/fx", href: "/api-reference/catalog#get-fx" },
    ],
  },
  {
    title: "Market Analytics",
    href: "/api-reference/market-analytics",
    items: [
      { method: "GET", label: "/market/arbitrage", href: "/api-reference/market-analytics#get-marketarbitrage" },
      { method: "GET", label: "/market/indicators", href: "/api-reference/market-analytics#get-marketindicators" },
      { method: "GET", label: "/market/items/{id}", href: "/api-reference/market-analytics#get-marketitemsitem_id" },
    ],
  },
  {
    title: "Account",
    href: "/api-reference/account",
    items: [
      { method: "POST", label: "/account/key/reset-ip", href: "/api-reference/account#post-accountkeyreset-ip" },
      { method: "POST", label: "/account/watchlist", href: "/api-reference/account#post-accountwatchlist" },
      { method: "GET", label: "/account/watchlist", href: "/api-reference/account#get-accountwatchlist" },
      { method: "DELETE", label: "/account/watchlist/{id}", href: "/api-reference/account#delete-accountwatchlistitem_id" },
      { method: "POST", label: "/account/alerts", href: "/api-reference/account#post-accountalerts" },
      { method: "GET", label: "/account/alerts", href: "/api-reference/account#get-accountalerts" },
      { method: "PATCH", label: "/account/alerts/{id}", href: "/api-reference/account#patch-accountalertsalert_id" },
      { method: "DELETE", label: "/account/alerts/{id}", href: "/api-reference/account#delete-accountalertsalert_id" },
      { method: "GET", label: "/account/alerts/events", href: "/api-reference/account#get-accountalertsevents" },
    ],
  },
];
