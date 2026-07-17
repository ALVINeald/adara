import { streamGeminiResponse } from "./gemini";
import { streamGroqResponse } from "./groq";
import type { AIMessage } from "./types";

export type { AIMessage } from "./types";

type AIProvider = "gemini" | "groq";

const CURRENT_PROVIDER: AIProvider = "groq";

export function streamAIResponse(
  messages: AIMessage[]
): AsyncGenerator<string> {
  switch (CURRENT_PROVIDER) {
    case "gemini":
      return streamGeminiResponse(messages);
    case "groq":
      return streamGroqResponse(messages);
    default:
      throw new Error(`Unsupported AI provider: ${CURRENT_PROVIDER}`);
  }
}