import { buildLlmsFullTxt, textResponse } from "../lib/llms";

export function GET(): Response {
  return textResponse(buildLlmsFullTxt());
}

