"use client";

import { useMemo, useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import SuggestedPrompts from "./SuggestedPrompts";

import type { ChatMessage, Conversation } from "./types";

const WELCOME_TEXT =
  "Hello, and welcome to Adara. I'm really glad you're here today. This is your private space where you can talk freely without judgment. \nHow are you feeling today?";

const MOCK_RESPONSES = [
  "Thank you for sharing that with me. I'm here to listen.",
  "That sounds difficult. Would you like to tell me a little more about what's been happening?",
  "You're not alone in this. We can take things one step at a time together.",
  "I'm glad you felt comfortable enough to share that. Your feelings are valid.",
  "Let's slow down for a moment. Take a deep breath. What's weighing on you the most today?",
];

function createConversation(): Conversation {
  return {
    id: crypto.randomUUID(),
    title: "New Conversation",
    updatedAt: "Just now",
  };
}

export default function ChatLayout() {
  const firstConversation = createConversation();

  const [conversations, setConversations] = useState<Conversation[]>([
  {
    id: firstConversation.id,
    title: firstConversation.title,
    updatedAt: firstConversation.updatedAt,
  },
]);

const [messages, setMessages] = useState<ChatMessage[]>([
  {
    id: crypto.randomUUID(),
    conversationId: firstConversation.id,
    sender: "assistant",
    content: WELCOME_TEXT,
    timestamp: "09:00 AM",
  },
]);

const [activeConversationId, setActiveConversationId] = useState(
  firstConversation.id
);
const [isTyping, setIsTyping] = useState(false);


const activeMessages = useMemo(
  () =>
    messages.filter(
      (message) =>
        message.conversationId === activeConversationId
    ),
  [messages, activeConversationId]
);

  function currentTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function updateConversation(
  updater: (conversation: Conversation) => Conversation
) {
  setConversations((previous) => {
    const updated = previous.map((conversation) =>
      conversation.id === activeConversationId
        ? updater(conversation)
        : conversation
    );

    const active = updated.find(
      (conversation) =>
        conversation.id === activeConversationId
    );

    const others = updated.filter(
      (conversation) =>
        conversation.id !== activeConversationId
    );

    return active ? [active, ...others] : updated;
  });
}

  function sendMessage(text: string) {
  if (!text.trim()) return;

  const userMessage: ChatMessage = {
    id: crypto.randomUUID(),
    conversationId: activeConversationId,
    sender: "user",
    content: text,
    timestamp: currentTime(),
  };

  setMessages((previous) => [
    ...previous,
    userMessage,
  ]);

  updateConversation((conversation) => ({
    ...conversation,
    title:
      conversation.title === "New Conversation"
        ? text.length > 35
          ? text.slice(0, 35) + "..."
          : text
        : conversation.title,
    updatedAt: "Just now",
  }));

  setIsTyping(true);

  setTimeout(() => {
    const aiMessage: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId: activeConversationId,
      sender: "assistant",
      content:
        MOCK_RESPONSES[
          Math.floor(Math.random() * MOCK_RESPONSES.length)
        ],
      timestamp: currentTime(),
    };

    setMessages((previous) => [
      ...previous,
      aiMessage,
    ]);

    updateConversation((conversation) => ({
      ...conversation,
      updatedAt: "Just now",
    }));

    setIsTyping(false);
  }, 1500);
}

  function startNewConversation() {
  const conversation = createConversation();

  setConversations((previous) => [
    conversation,
    ...previous,
  ]);

  setMessages((previous) => [
    ...previous,
    {
  id: crypto.randomUUID(),
  conversationId: conversation.id,
  sender: "assistant",
  content: WELCOME_TEXT,
  timestamp: currentTime(),
}
  ]);

  setActiveConversationId(conversation.id);

  setIsTyping(false);
}

  function deleteConversation(id: string) {
  if (conversations.length === 1) return;

  const remaining = conversations.filter(
    (conversation) => conversation.id !== id
  );

  setConversations(remaining);

  if (activeConversationId === id) {
    setActiveConversationId(remaining[0].id);
  }
  }
  
  function renameConversation(
  id: string,
  newTitle: string
) {
  if (!newTitle.trim()) return;

  setConversations((previous) => {
    const updated = previous.map((conversation) =>
      conversation.id === id
        ? {
            ...conversation,
            title: newTitle.trim(),
            updatedAt: "Just now",
          }
        : conversation
    );

    const renamed = updated.find(
      (conversation) => conversation.id === id
    );

    const others = updated.filter(
      (conversation) => conversation.id !== id
    );

    return renamed ? [renamed, ...others] : updated;
  });

  setActiveConversationId(id);
}
    return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
      <div className="mx-auto flex h-[90vh] max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_25px_80px_rgba(15,118,110,0.12)] backdrop-blur-xl">

        {/* Sidebar */}

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

        {/* Chat Area */}

        <section className="flex flex-1 flex-col">

          <ChatHeader />

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <ChatWindow
  messages={activeMessages}
  isTyping={isTyping}
/>
          </div>

          <div className="border-t border-slate-200 bg-white/60 px-8 py-6">

            <SuggestedPrompts
              onSelect={sendMessage}
            />

            <div className="mt-5">
              <ChatInput
                onSend={sendMessage}
              />
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}