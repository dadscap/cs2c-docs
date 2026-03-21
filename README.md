# CS2C-API Public Docs

Public documentation source for CS2C-API.

## Contents

- `docs/` contains the public markdown guides.
- `openapi/openapi.json` contains the filtered public OpenAPI spec.
- `mkdocs.yml` defines the published docs navigation.

## Local Workflow

Install docs dependencies:

```bash
poetry install --with docs
```

Preview locally:

```bash
poetry run mkdocs serve -f docs/public-docs/mkdocs.yml
```

Build locally:

```bash
poetry run mkdocs build -f docs/public-docs/mkdocs.yml
```

The private repo remains the source of truth. Public docs and SDK repos should be synced from this bundle.
