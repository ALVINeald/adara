"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ArrowLeft, Bold, Italic, List, ListOrdered } from "lucide-react";

import { MOOD_SCALE } from "@/components/mood/moodScale";
import type { JournalEntry } from "@/hooks/useJournalEntries";

interface JournalEditorProps {
  entry?: JournalEntry;
  onSave: (
    title: string,
    content: string,
    moodLevel: number | null
  ) => Promise<void>;
  onCancel: () => void;
}

export default function JournalEditor({
  entry,
  onSave,
  onCancel,
}: JournalEditorProps) {
  const [title, setTitle] = useState(entry?.title ?? "");
  const [moodLevel, setMoodLevel] = useState<number | null>(
    entry?.moodLevel ?? null
  );
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: entry?.content ?? "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[240px] rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
      },
    },
  });

  async function handleSave() {
    if (!editor) return;

    const content = editor.getHTML();
    const trimmedTitle = title.trim() || "Untitled Entry";

    setSaving(true);
    await onSave(trimmedTitle, content, moodLevel);
    setSaving(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={onCancel}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to entries
      </button>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Entry title..."
        className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-lg font-semibold outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
      />

      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`rounded-lg p-2 transition ${
            editor?.isActive("bold")
              ? "bg-cyan-100 text-cyan-700"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`rounded-lg p-2 transition ${
            editor?.isActive("italic")
              ? "bg-cyan-100 text-cyan-700"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`rounded-lg p-2 transition ${
            editor?.isActive("bulletList")
              ? "bg-cyan-100 text-cyan-700"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`rounded-lg p-2 transition ${
            editor?.isActive("orderedList")
              ? "bg-cyan-100 text-cyan-700"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>

      <EditorContent editor={editor} />

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-slate-600">
          Tag a mood (optional)
        </p>

        <div className="flex items-center gap-2">
          {MOOD_SCALE.map((option) => (
            <button
              key={option.level}
              type="button"
              onClick={() =>
                setMoodLevel(moodLevel === option.level ? null : option.level)
              }
              title={option.label}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition ${
                moodLevel === option.level
                  ? "bg-cyan-100 ring-2 ring-cyan-500"
                  : "bg-slate-50 hover:bg-cyan-50"
              }`}
            >
              {option.emoji}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-6 rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Entry"}
      </button>
    </div>
  );
}