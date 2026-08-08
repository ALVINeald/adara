import { NextRequest } from "next/server";

import { streamAIResponse } from "@/lib/ai";
import type { AIMessage } from "@/lib/ai/types";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

// Without this, the route was callable by anyone who found the URL --
// no session required -- which meant unauthenticated requests could
// burn the Groq quota directly. The client already has a Supabase
// session (see useCompanionChat's requestAIReply), so we just require
// it to prove that via a bearer token instead of trusting the caller.
async function getAuthedUserId(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  return data.user.id;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthedUserId(request);
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

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