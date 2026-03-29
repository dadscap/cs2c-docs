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
    title: "Prices",
    href: "/api-reference/prices",
    items: [
      { method: "GET", label: "/prices", href: "/api-reference/prices#list-prices" },
      { method: "GET", label: "/prices/candles", href: "/api-reference/prices#price-candles" },
      { method: "POST", label: "/prices", href: "/api-reference/prices#stream-full-prices-snapshot" },
      { method: "POST", label: "/prices/batch", href: "/api-reference/prices#batch-prices-lookup" },
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
    title: "Portfolio",
    href: "/api-reference/portfolio",
    items: [
      { method: "POST", label: "/portfolio/value", href: "/api-reference/portfolio#value-ad-hoc-list" },
      { method: "GET", label: "/portfolio", href: "/api-reference/portfolio#list-portfolios" },
      { method: "POST", label: "/portfolio", href: "/api-reference/portfolio#create-portfolio" },
      { method: "DELETE", label: "/portfolio/{id}", href: "/api-reference/portfolio#delete-portfolio" },
      { method: "GET", label: "/portfolio/{id}/items", href: "/api-reference/portfolio#list-items" },
      { method: "POST", label: "/portfolio/{id}/items", href: "/api-reference/portfolio#add-item" },
      { method: "DELETE", label: "/portfolio/{id}/items/{entry_id}", href: "/api-reference/portfolio#remove-item" },
      { method: "POST", label: "/portfolio/{id}/import", href: "/api-reference/portfolio#import-from-steam" },
      { method: "GET", label: "/portfolio/{id}/value", href: "/api-reference/portfolio#value-saved-portfolio" },
      { method: "GET", label: "/portfolio/{id}/history", href: "/api-reference/portfolio#historical-saved-portfolio-valuation" },
      { method: "GET", label: "/portfolio/{id}/transactions", href: "/api-reference/portfolio#list-transactions" },
      { method: "POST", label: "/portfolio/{id}/transactions", href: "/api-reference/portfolio#record-transaction" },
      { method: "PATCH", label: "/portfolio/{id}/transactions/{tx_id}", href: "/api-reference/portfolio#update-transaction" },
      { method: "DELETE", label: "/portfolio/{id}/transactions/{tx_id}", href: "/api-reference/portfolio#delete-transaction" },
      { method: "GET", label: "/portfolio/{id}/export", href: "/api-reference/portfolio#csv-export" },
      { method: "POST", label: "/portfolio/{id}/import/csv", href: "/api-reference/portfolio#csv-import" },
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
      { method: "GET", label: "/providers", href: "/api-reference/catalog#list-providers" },
      { method: "GET", label: "/fx", href: "/api-reference/catalog#get-fx-rates" },
    ],
  },
  {
    title: "Market Analytics",
    href: "/api-reference/market-analytics",
    items: [
      { method: "GET", label: "/market/arbitrage", href: "/api-reference/market-analytics#get-arbitrage-opportunities" },
      { method: "GET", label: "/market/indicators", href: "/api-reference/market-analytics#get-technical-indicators" },
      { method: "GET", label: "/market/items/{id}", href: "/api-reference/market-analytics#get-item-analytics" },
    ],
  },
  {
    title: "Account",
    href: "/api-reference/account",
    items: [
      { method: "GET", label: "/account", href: "/api-reference/account#get-account" },
      { method: "GET", label: "/account/usage", href: "/api-reference/account#get-usage" },
      { method: "GET", label: "/account/key", href: "/api-reference/account#get-api-key-metadata" },
      { method: "POST", label: "/account/key/reissue", href: "/api-reference/account#reissue-api-key" },
      { method: "POST", label: "/account/key/reset-ip", href: "/api-reference/account#reset-ip-binding" },
      { method: "GET", label: "/account/preferences", href: "/api-reference/account#get-preferences" },
      { method: "PATCH", label: "/account/preferences", href: "/api-reference/account#update-preferences" },
      { method: "POST", label: "/account/watchlist", href: "/api-reference/account#create-watchlist-entry" },
      { method: "GET", label: "/account/watchlist", href: "/api-reference/account#get-watchlist" },
      { method: "DELETE", label: "/account/watchlist/{id}", href: "/api-reference/account#delete-watchlist-entry" },
      { method: "POST", label: "/account/alerts", href: "/api-reference/account#create-alert" },
      { method: "POST", label: "/account/alerts/batch", href: "/api-reference/account#create-alerts-batch" },
      { method: "GET", label: "/account/alerts", href: "/api-reference/account#get-alerts" },
      { method: "PATCH", label: "/account/alerts/{id}", href: "/api-reference/account#update-alert" },
      { method: "DELETE", label: "/account/alerts/{id}", href: "/api-reference/account#delete-alert" },
      { method: "GET", label: "/account/alerts/events", href: "/api-reference/account#list-alert-events" },
      { method: "POST", label: "/account/export", href: "/api-reference/account#create-account-export" },
      { method: "GET", label: "/account/export/{id}", href: "/api-reference/account#get-account-export-job" },
      { method: "GET", label: "/account/export/{id}/download", href: "/api-reference/account#download-account-export" },
      { method: "POST", label: "/account/verify-email/send", href: "/api-reference/account#send-verification-email" },
      { method: "POST", label: "/account/email", href: "/api-reference/account#set-initial-email" },
      { method: "PATCH", label: "/account/email", href: "/api-reference/account#change-email" },
      { method: "POST", label: "/account/verify-email/confirm", href: "/api-reference/account#confirm-email-verification" },
      { method: "POST", label: "/account/recover", href: "/api-reference/account#request-account-recovery" },
      { method: "POST", label: "/account/recover/confirm", href: "/api-reference/account#confirm-account-recovery" },
      { method: "DELETE", label: "/account", href: "/api-reference/account#delete-account" },
    ],
  },
];
