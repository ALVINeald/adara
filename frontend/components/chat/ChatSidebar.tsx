import { MessageCirclePlus, Search } from "lucide-react";

import type { Conversation } from "./types";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export default function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}: ChatSidebarProps) {
  return (
    <div className="flex h-full flex-col">

      {/* Header */}

      <div className="border-b border-slate-200 p-6">

        <h2 className="text-xl font-bold text-slate-900">
          Conversations
        </h2>

        <button
          onClick={onNewConversation}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 font-medium text-white transition hover:bg-cyan-700"
        >
          <MessageCirclePlus className="h-5 w-5" />
          New Conversation
        </button>

      </div>

      {/* Search */}

      <div className="border-b border-slate-200 p-5">

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">

          <Search className="h-5 w-5 text-slate-400" />

          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-transparent text-sm outline-none"
          />

        </div>

      </div>

      {/* Conversations */}

      <div className="flex-1 overflow-y-auto p-4">

        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`mb-3 w-full rounded-2xl p-4 text-left transition ${
              conversation.id === activeConversationId
                ? "bg-cyan-100 ring-1 ring-cyan-200"
                : "hover:bg-cyan-50"
            }`}
          >
            <h3 className="truncate font-semibold text-slate-800">
              {conversation.title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {conversation.updatedAt}
            </p>

          </button>
        ))}

      </div>

      {/* Footer */}

      <div className="border-t border-slate-200 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 font-semibold text-white">
            A
          </div>

          <div>

            <p className="font-semibold text-slate-900">
              Alvin
            </p>

            <p className="text-sm text-slate-500">
              Your safe space 💙
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}