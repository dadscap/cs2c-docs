# Authentication

Public market-data endpoints use API key authentication:

```http
Authorization: Bearer your_api_key_here
```

For the public docs surface, API keys are the only authentication method documented. Account, session, and admin flows are intentionally excluded from the public OpenAPI bundle.
