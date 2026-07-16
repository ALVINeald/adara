import { NextRequest } from "next/server";

import { streamAIResponse } from "@/lib/ai";
import type { AIMessage } from "@/lib/ai/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages = body.messages as AIMessage[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Missing messages", { status: 400 });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamAIResponse(messages)) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error) {
          console.error("AI stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return new Response("Failed to process request", { status: 500 });
  }
}