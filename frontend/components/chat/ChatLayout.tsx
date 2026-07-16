"use client";

import { useEffect, useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import SuggestedPrompts from "./SuggestedPrompts";

import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";

const MOCK_RESPONSES = [
  "Thank you for sharing that with me. I'm here to listen.",
  "That sounds difficult. Would you like to tell me a little more about what's been happening?",
  "You're not alone in this. We can take things one step at a time together.",
  "I'm glad you felt comfortable enough to share that. Your feelings are valid.",
  "Let's slow down for a moment. Take a deep breath. What's weighing on you the most today?",
];

export default function ChatLayout() {
  const { user, loading: authLoading } = useAuth();

  const {
    conversations,
    loading: conversationsLoading,
    addConversation,
    updateConversation,
    removeConversation,
  } = useConversations(user?.id);

  const [activeConversationId, setActiveConversationId] = useState("");

  const { messages, sendMessage: saveMessage } = useMessages(
    activeConversationId
  );

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId
  );

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    if (!activeConversationId) return;

    await saveMessage("user", text);

    if (activeConversation?.title === "New Conversation") {
      await updateConversation(
        activeConversationId,
        text.length > 35 ? text.slice(0, 35) + "..." : text
      );
    }

    setIsTyping(true);

    setTimeout(async () => {
      const reply =
        MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

      await saveMessage("assistant", reply);
      setIsTyping(false);
    }, 1500);
  }

  async function startNewConversation() {
    const conversation = await addConversation();
    if (!conversation) return;
    setActiveConversationId(conversation.id);
  }

  async function deleteConversation(id: string) {
    await removeConversation(id);

    const remaining = conversations.filter(
      (conversation) => conversation.id !== id
    );

    if (activeConversationId === id) {
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : "");
    }
  }

  async function renameConversation(id: string, title: string) {
    if (!title.trim()) return;
    await updateConversation(id, title);
  }

  // Only block the full screen on the very first load —
  // never again after that, so actions don't cause a full re-render.
  if (authLoading || conversationsLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
      <div className="mx-auto flex h-[90vh] max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_25px_80px_rgba(15,118,110,0.12)] backdrop-blur-xl">

        <aside className="hidden w-80 border-r border-slate-200 bg-white/70 lg:block">
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onNewConversation={startNewConversation}
            onDeleteConversation={deleteConversation}
            onRenameConversation={renameConversation}
          />
        </aside>

        <section className="flex flex-1 flex-col">
          <ChatHeader />

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <ChatWindow messages={messages} isTyping={isTyping} />
          </div>

          <div className="border-t border-slate-200 bg-white/60 px-8 py-6">
            <SuggestedPrompts onSelect={sendMessage} />

            <div className="mt-5">
              <ChatInput onSend={sendMessage} />
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}