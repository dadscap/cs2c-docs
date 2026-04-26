import { buildLlmsTxt, textResponse } from "../lib/llms";

export function GET(): Response {
  return textResponse(buildLlmsTxt());
}

