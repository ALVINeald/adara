"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Search,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

import type { Conversation } from "./types";
import { formatConversationTimestamp } from "@/lib/format";

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
  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) =>
      conversation.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, conversations]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function saveRename(id: string) {
    onRenameConversation(id, editingTitle);
    setEditingId(null);
    setEditingTitle("");
  }

  function startRename(conversation: Conversation) {
    setEditingId(conversation.id);
    setEditingTitle(conversation.title);
    setOpenMenuId(null);
  }

  function handleDelete(id: string) {
    onDeleteConversation(id);
    setOpenMenuId(null);
  }

  return (
    <div className="flex h-full flex-col">

      {/* Header */}

      <div className="border-b border-slate-200 p-6">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Conversations
          </h2>

          <button
            onClick={onNewConversation}
            title="New conversation"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600 text-white transition hover:bg-cyan-700"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

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
              className={`relative mb-2 rounded-2xl p-3 transition ${
                conversation.id === activeConversationId
                  ? "border border-cyan-200 bg-cyan-50"
                  : "border border-transparent hover:bg-slate-50"
              }`}
            >
              <div
                className="cursor-pointer"
                onClick={() =>
                  editingId !== conversation.id &&
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
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {conversation.title}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === conversation.id
                            ? null
                            : conversation.id
                        );
                      }}
                      className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {editingId !== conversation.id && (
                  <p
                    className={`mt-1 text-xs ${
                      conversation.id === activeConversationId
                        ? "text-cyan-700"
                        : "text-slate-400"
                    }`}
                  >
                    {formatConversationTimestamp(
                      conversation.updatedAt
                    )}
                  </p>
                )}
              </div>

              {openMenuId === conversation.id && (
                <div
                  ref={menuRef}
                  className="absolute right-2 top-10 z-10 min-w-[130px] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200"
                >
                  <button
                    onClick={() => startRename(conversation)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Rename
                  </button>
                  <button
                    onClick={() => handleDelete(conversation.id)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              )}
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