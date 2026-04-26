import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const SITE_URL = "https://docs.cs2cap.com";
const API_BASE_URL = "https://api.cs2c.app/v1";
const ROOT_DIR = fileURLToPath(new URL("../..", import.meta.url));
const DOCS_DIR = join(ROOT_DIR, "src", "content", "docs");
const OPENAPI_PATH = join(ROOT_DIR, "openapi", "openapi.json");

const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "options", "head"] as const;

interface DocPage {
  title: string;
  description: string;
  url: string;
  path: string;
}

interface OpenApiOperation {
  tags?: string[];
  summary?: string;
  description?: string;
}

interface OpenApiSpec {
  paths?: Record<string, Record<string, OpenApiOperation>>;
}

export const docPages: DocPage[] = [
  {
    title: "Quickstart",
    description: "First request, authentication setup, examples, and integration basics.",
    url: "/quickstart",
    path: "getting-started.md",
  },
  {
    title: "API Reference",
    description: "Authentication, response conventions, rate limits, errors, and endpoint groups.",
    url: "/api-reference",
    path: "api/overview.md",
  },
  {
    title: "Prices",
    description: "Current asks, price batches, history, and candles.",
    url: "/api-reference/prices",
    path: "api/prices.md",
  },
  {
    title: "Bids",
    description: "Current bids and batch bid lookup.",
    url: "/api-reference/bids",
    path: "api/bids.md",
  },
  {
    title: "Sales",
    description: "Recent marketplace sale records and cache behavior.",
    url: "/api-reference/sales",
    path: "api/sales.md",
  },
  {
    title: "Catalog",
    description: "Item search, provider metadata, and FX rates.",
    url: "/api-reference/catalog",
    path: "api/catalog.md",
  },
  {
    title: "Market Analytics",
    description: "Arbitrage, market indexes, indicators, and item analytics.",
    url: "/api-reference/market-analytics",
    path: "api/market-analytics.md",
  },
  {
    title: "Inventory",
    description: "Steam inventory valuation and lookup.",
    url: "/api-reference/inventory",
    path: "api/inventory.md",
  },
  {
    title: "Portfolio",
    description: "Portfolio creation, import, valuation, history, exports, and transactions.",
    url: "/api-reference/portfolio",
    path: "api/portfolio.md",
  },
  {
    title: "Alerts",
    description: "Account alert creation, events, updates, and deletion.",
    url: "/api-reference/alerts",
    path: "api/alerts.md",
  },
  {
    title: "Sub-keys",
    description: "Child API keys, scopes, limits, reissue, and revocation.",
    url: "/api-reference/sub-keys",
    path: "api/sub-keys.md",
  },
  {
    title: "Webhooks",
    description: "Webhook endpoints, secrets, signing, deliveries, and rotation.",
    url: "/api-reference/webhooks",
    path: "api/webhooks.md",
  },
  {
    title: "Account",
    description: "Active key inspection and reissue behavior.",
    url: "/api-reference/account",
    path: "api/account.md",
  },
  {
    title: "Core Concepts",
    description: "Minor units, provider keys, phases, pagination, freshness, and indexed paths.",
    url: "/core-concepts",
    path: "core-concepts.md",
  },
  {
    title: "Field Reference",
    description: "Response fields and semantic definitions used across the API.",
    url: "/field-reference",
    path: "field-reference.md",
  },
  {
    title: "Pricing",
    description: "Plans, quotas, limits, and billing behavior.",
    url: "/pricing",
    path: "pricing.md",
  },
  {
    title: "Changelog",
    description: "Public docs changelog.",
    url: "/changelog",
    path: "changelog.md",
  },
];

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

function readDoc(path: string): string {
  return readFileSync(join(DOCS_DIR, path), "utf8");
}

function stripFrontmatter(markdown: string): string {
  return markdown.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
}

function readOpenApiSpec(): OpenApiSpec {
  return JSON.parse(readFileSync(OPENAPI_PATH, "utf8")) as OpenApiSpec;
}

function firstParagraph(value: string | undefined): string {
  if (!value) return "";
  return value
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .find(Boolean) ?? "";
}

export function buildEndpointMap(): string {
  const spec = readOpenApiSpec();
  const paths = spec.paths ?? {};
  const lines: string[] = [];

  Object.keys(paths).sort().forEach((path) => {
    const operations = paths[path] ?? {};
    HTTP_METHODS.forEach((method) => {
      const operation = operations[method];
      if (!operation) return;

      const summary = operation.summary ? ` - ${operation.summary}` : "";
      const tags = operation.tags?.length ? ` [${operation.tags.join(", ")}]` : "";
      const description = firstParagraph(operation.description);
      const descriptionText = description ? ` ${description}` : "";
      lines.push(`- ${method.toUpperCase()} ${path}${summary}${tags}.${descriptionText}`.trim());
    });
  });

  return lines.join("\n");
}

export function buildDocumentationMap(): string {
  return docPages
    .map((page) => `- [${page.title}](${absoluteUrl(page.url)}): ${page.description}`)
    .join("\n");
}

export function buildLlmsTxt(): string {
  return `# CS2Cap Docs

> Documentation for the CS2Cap CS2 market data API. Use the API Reference and OpenAPI JSON as the canonical machine-readable contract.

CS2Cap uses bearer API keys. Prices and bids use indexed data paths. Currency amounts are represented in minor units, so \`lowest_ask=2550\` means $25.50. Prefer the OpenAPI JSON and API Reference for exact endpoint shapes, parameters, response fields, and error semantics.

## LLM Context Files

- [Full LLM Context](${absoluteUrl("/llms-full.txt")}): Expanded documentation context with source docs and endpoint map.
- [OpenAPI JSON](${absoluteUrl("/openapi/openapi.json")}): Canonical public API schema for tools, SDKs, and agents.

## Documentation Map

${buildDocumentationMap()}

## API Base URL

\`\`\`text
${API_BASE_URL}
\`\`\`
`;
}

export function buildLlmsFullTxt(): string {
  const contentSections = docPages
    .map((page) => {
      const body = stripFrontmatter(readDoc(page.path));
      return `## ${page.title}

Source: ${absoluteUrl(page.url)}

${body}`;
    })
    .join("\n\n---\n\n");

  return `# CS2Cap Documentation - Full LLM Context

> Expanded documentation context for AI assistants and coding agents using the CS2Cap public API.

Use this file when you need more than the short index at ${absoluteUrl("/llms.txt")}. For strict request and response schemas, use ${absoluteUrl("/openapi/openapi.json")}.

## High-Priority API Facts

- API base URL: \`${API_BASE_URL}\`
- Authentication uses \`Authorization: Bearer <api_key>\`.
- Prices, bids, and sale prices are returned in minor currency units.
- \`providers\` is a repeatable query parameter where documented.
- Cursor endpoints intentionally use \`pagination.total = -1\`.
- Prices and bids are indexed data paths; unavailable index data can return retryable service errors.
- Error responses include a stable machine-readable \`code\` and human-readable \`detail\`.

## Documentation Map

${buildDocumentationMap()}

## Public Endpoint Map

${buildEndpointMap()}

---

# Documentation Content

${contentSections}
`;
}

export function textResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
