"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, SendHorizontal } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useCommunities } from "@/hooks/useCommunities";
import { useCommunityMessages } from "@/hooks/useCommunityMessages";
import { getCommunityMemberNames } from "@/lib/communityMembers";
import CommunityChatMessage from "@/components/community/CommunityChatMessage";

export default function CommunityChatPage() {
  const params = useParams();
  const router = useRouter();
  const communityId = params.id as string;

  const { user, loading: authLoading } = useAuth();
  const { communities, loading: communitiesLoading } = useCommunities(
    user?.id
  );
  const { messages, loading: messagesLoading, sendMessage } =
    useCommunityMessages(communityId);

  const [memberNames, setMemberNames] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const community = communities.find((c) => c.id === communityId);

  useEffect(() => {
    async function loadNames() {
      const { data } = await getCommunityMemberNames(communityId);
      const map: Record<string, string> = {};
      (data ?? []).forEach((row: any) => {
        map[row.user_id] = row.profiles?.full_name ?? "Member";
      });
      setMemberNames(map);
    }

    if (communityId) loadNames();
  }, [communityId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend() {
    if (!user || !input.trim()) return;
    const text = input;
    setInput("");
    await sendMessage(user.id, text);
  }

  if (authLoading || communitiesLoading || messagesLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)]">
      <header className="flex items-center gap-4 border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur-xl">
        <button
          onClick={() => router.push("/communities")}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-semibold text-slate-900">
            {community?.name ?? "Community"}
          </h1>
          <p className="text-xs text-slate-500">
            {community?.category}
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-slate-400">
            No messages yet. Be the first to say hello.
          </p>
        ) : (
          messages.map((message) => (
            <div key={message.id}>
              {message.userId !== user?.id && (
                <p className="mb-1 ml-1 text-xs font-medium text-slate-400">
                  {memberNames[message.userId] ?? "Member"}
                </p>
              )}
              <CommunityChatMessage
                message={message}
                isOwnMessage={message.userId === user?.id}
              />
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-200 bg-white/70 p-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message this community..."
            className="min-h-[48px] flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  );
}