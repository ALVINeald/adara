import { GoogleGenAI } from "@google/genai";

import { ADARA_SYSTEM_PROMPT } from "./prompt";
import type { AIMessage } from "./types";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    "GEMINI_API_KEY is not set. AI responses will fail until it's added to .env.local."
  );
}

const ai = new GoogleGenAI({ apiKey });

const MODEL = "gemini-3.5-flash";

export async function* streamGeminiResponse(
  messages: AIMessage[]
): AsyncGenerator<string> {
  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  const stream = await ai.models.generateContentStream({
    model: MODEL,
    contents,
    config: {
      systemInstruction: ADARA_SYSTEM_PROMPT,
    },
  });

  for await (const chunk of stream) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}