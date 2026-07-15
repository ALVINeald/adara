"use client";

import { useMemo, useState } from "react";
import {
  MessageCirclePlus,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import type { Conversation } from "./types";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (
    id: string,
    title: string
  ) => void;
}

export default function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
}: ChatSidebarProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] =
    useState<string | null>(null);
  const [editingTitle, setEditingTitle] =
    useState("");

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) =>
      conversation.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, conversations]);

  function saveRename(id: string) {
    onRenameConversation(id, editingTitle);
    setEditingId(null);
    setEditingTitle("");
  }

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
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-transparent text-sm outline-none"
          />

        </div>

      </div>

      {/* Conversations */}
            <div className="flex-1 overflow-y-auto p-4">

        {filteredConversations.length === 0 ? (
          <p className="px-2 text-sm text-slate-500">
            No conversations found.
          </p>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`mb-3 flex items-center justify-between rounded-2xl p-4 transition ${
                conversation.id === activeConversationId
                  ? "bg-cyan-100 ring-1 ring-cyan-200"
                  : "hover:bg-cyan-50"
              }`}
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() =>
                  onSelectConversation(conversation.id)
                }
              >
                {editingId === conversation.id ? (
                  <input
                    autoFocus
                    value={editingTitle}
                    onChange={(e) =>
                      setEditingTitle(e.target.value)
                    }
                    onBlur={() =>
                      saveRename(conversation.id)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveRename(conversation.id);
                      }
                    }}
                    className="w-full rounded-md border border-cyan-300 bg-white px-2 py-1 text-sm font-semibold outline-none"
                  />
                ) : (
                  <>
                    <h3 className="truncate font-semibold text-slate-800">
                      {conversation.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {conversation.updatedAt}
                    </p>
                  </>
                )}
              </div>

              <div className="ml-3 flex items-center gap-1">

                <button
                  onClick={() => {
                    setEditingId(conversation.id);
                    setEditingTitle(conversation.title);
                  }}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  onClick={() =>
                    onDeleteConversation(conversation.id)
                  }
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

              </div>

            </div>
          ))
        )}

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