"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, SendHorizontal, Users } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useCommunities } from "@/hooks/useCommunities";
import { useCommunityMessages } from "@/hooks/useCommunityMessages";
import { getCommunityMemberNames } from "@/lib/communityMembers";
import CommunityChatMessage from "@/components/community/CommunityChatMessage";
import AppShell from "@/components/navigation/AppShell";

export default function CommunityChatPage() {
  const params = useParams();
  const router = useRouter();
  const communityId = params.id as string;

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, user, router]);
  const { communities, loading: communitiesLoading } = useCommunities(
    user?.id
  );
  const { messages, loading: messagesLoading, sendMessage } =
    useCommunityMessages(communityId);

  const [memberNames, setMemberNames] = useState<Record<string, string>>({});
  const [showMembers, setShowMembers] = useState(false);
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
    <AppShell>
    <main className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)]">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
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
        </div>

        <button
          onClick={() => setShowMembers((prev) => !prev)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
            showMembers
              ? "bg-cyan-100 text-cyan-700"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Users className="h-4 w-4" />
          {Object.keys(memberNames).length}
        </button>
      </header>

      {showMembers && (
        <div className="border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur-xl">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Members ({Object.keys(memberNames).length})
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(memberNames).map(([userId, name]) => (
              <span
                key={userId}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
              >
                {name}
                {userId === user?.id && (
                  <span className="text-slate-400"> (You)</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

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

      <div className="mx-4 mb-4 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur-xl md:mx-0 md:mb-0 md:rounded-none md:border-0 md:border-t md:bg-white/70 md:p-4 md:shadow-none">
        <div className="mx-auto flex w-full max-w-3xl items-end gap-3">
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
    </AppShell>
  );
}