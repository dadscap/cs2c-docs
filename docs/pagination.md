# Pagination

- Offset pagination is used on broad listing endpoints such as `/v1/items`, `/v1/prices`, and `/v1/bids`.
- Cursor pagination is used on time-series and some analytics endpoints.

Always follow the response pagination fields rather than assuming a single pagination model across all endpoints.
