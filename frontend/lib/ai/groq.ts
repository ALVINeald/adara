import Groq from "groq-sdk";

import { ADARA_SYSTEM_PROMPT } from "./prompt";
import type { AIMessage } from "./types";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.error(
    "GROQ_API_KEY is not set. AI responses will fail until it's added to .env.local."
  );
}

const groq = new Groq({ apiKey });

const MODEL = "llama-3.3-70b-versatile";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;
const IDLE_TIMEOUT_MS = 3500;
// Worst case (both attempts time out with zero response): 3.5s + 0.5s + 3.5s = 7.5s,
// leaving a real margin under Vercel's 10s free-tier function limit.

class StreamTimeoutError extends Error {
  constructor() {
    super("Groq stream timed out");
    this.name = "StreamTimeoutError";
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new StreamTimeoutError()), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof StreamTimeoutError) return true;
  const status = (error as { status?: number })?.status;
  return status === 503 || status === 429;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function* streamGroqResponse(
  messages: AIMessage[]
): AsyncGenerator<string> {
  const chatMessages = [
    { role: "system" as const, content: ADARA_SYSTEM_PROMPT },
    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const stream = await withTimeout(
        groq.chat.completions.create({
          model: MODEL,
          messages: chatMessages,
          stream: true,
        }),
        IDLE_TIMEOUT_MS
      );

      const iterator = stream[Symbol.asyncIterator]();

      while (true) {
        const { value: chunk, done } = await withTimeout(
          iterator.next(),
          IDLE_TIMEOUT_MS
        );

        if (done) break;

        const text = chunk.choices[0]?.delta?.content;
        if (text) {
          yield text;
        }
      }

      return;
    } catch (error) {
      const isLastAttempt = attempt === MAX_RETRIES - 1;

      if (!isRetryableError(error) || isLastAttempt) {
        throw error;
      }

      console.warn(
        `Groq request failed (attempt ${attempt + 1}/${MAX_RETRIES}), retrying...`
      );
      await delay(RETRY_DELAY_MS * (attempt + 1));
    }
  }
}