import { streamGeminiResponse } from "./gemini";
import type { AIMessage } from "./types";

export type { AIMessage } from "./types";

type AIProvider = "gemini";

const CURRENT_PROVIDER: AIProvider = "gemini";

export function streamAIResponse(
  messages: AIMessage[]
): AsyncGenerator<string> {
  switch (CURRENT_PROVIDER) {
    case "gemini":
      return streamGeminiResponse(messages);
    default:
      throw new Error(`Unsupported AI provider: ${CURRENT_PROVIDER}`);
  }
}