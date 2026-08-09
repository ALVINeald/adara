"use client";

import { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Loader2,
  PanelRight,
  Redo2,
  Undo2,
  X,
} from "lucide-react";

import JournalToolbar from "./JournalToolbar";
import JournalDetailsPanel from "./JournalDetailsPanel";
import { getMoodBadgeClass, getMoodOption } from "@/components/mood/moodScale";
import { useAutosave, type SaveState } from "@/hooks/useAutosave";
import type { JournalEntry } from "@/hooks/useJournalEntries";
import type { JournalEntryPayload } from "@/lib/journal";

interface JournalCanvasProps {
  entry: JournalEntry | null;
  onBack: () => void;
  onCreate: (payload: JournalEntryPayload) => Promise<JournalEntry | null>;
  onUpdate: (id: string, payload: JournalEntryPayload) => Promise<void>;
}

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function SaveIndicator({
  saveState,
  lastSavedAt,
}: {
  saveState: SaveState;
  lastSavedAt: Date | null;
}) {
  if (saveState === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Saving...
      </span>
    );
  }

  if (saveState === "error") {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
        <AlertCircle className="h-3.5 w-3.5" />
        Save failed
      </span>
    );
  }

  if (saveState === "saved" && lastSavedAt) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
        <Check className="h-3.5 w-3.5" />
        Saved{" "}
        {lastSavedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
      </span>
    );
  }

  return null;
}

export default function JournalCanvas({
  entry,
  onBack,
  onCreate,
  onUpdate,
}: JournalCanvasProps) {
  const [persistedId, setPersistedId] = useState<string | null>(entry?.id ?? null);
  const [title, setTitle] = useState(entry?.title ?? "");
  const [moodLevel, setMoodLevel] = useState<number | null>(entry?.moodLevel ?? null);
  const [energyLevel, setEnergyLevel] = useState<number | null>(
    entry?.energyLevel ?? null
  );
  const [stressLevel, setStressLevel] = useState<number | null>(
    entry?.stressLevel ?? null
  );
  const [tags, setTags] = useState<string[]>(entry?.tags ?? []);
  const [isPrivate, setIsPrivate] = useState(entry?.isPrivate ?? true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit],
    content: entry?.content ?? "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[50vh] px-1 py-4 text-[16px] leading-[26px] text-slate-800 outline-none " +
          "[&_h1]:text-[28px] [&_h1]:font-bold [&_h1]:text-slate-900 " +
          "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-violet-700 " +
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-800 " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-violet-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 " +
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 " +
          "[&_a]:text-violet-600 [&_a]:underline [&_p]:mb-3",
      },
    },
    onUpdate: ({ editor }) => {
      setWordCount(countWords(editor.getText()));
    },
  });

  useEffect(() => {
    if (editor) setWordCount(countWords(editor.getText()));
  }, [editor]);

  const snapshot = useMemo(
    () => ({
      title,
      content: editor?.getHTML() ?? entry?.content ?? "<p></p>",
      moodLevel,
      energyLevel,
      stressLevel,
      tags,
      isPrivate,
      wordCount,
    }),
    // wordCount updates on every keystroke via the editor's onUpdate
    // above, which is what actually drives this snapshot to change
    // while the user types -- editor.getHTML() itself isn't reactive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [title, moodLevel, energyLevel, stressLevel, tags, isPrivate, wordCount]
  );

  const { saveState, lastSavedAt, flush } = useAutosave(
    snapshot,
    async (value) => {
      const trimmedTitle = value.title.trim() || "Untitled Entry";
      const payload: JournalEntryPayload = { ...value, title: trimmedTitle };

      if (persistedId) {
        await onUpdate(persistedId, payload);
      } else {
        const created = await onCreate(payload);
        if (created) setPersistedId(created.id);
      }
    },
    { enabled: !!editor }
  );

  const readMinutes = Math.max(1, Math.round(wordCount / 200));
  const moodOption = moodLevel ? getMoodOption(moodLevel) : undefined;

  async function handleBack() {
    await flush();
    onBack();
  }

  const detailsPanelProps = {
    createdAt: entry?.createdAt ?? new Date().toISOString(),
    moodLevel,
    onMoodLevelChange: setMoodLevel,
    energyLevel,
    onEnergyLevelChange: setEnergyLevel,
    stressLevel,
    onStressLevelChange: setStressLevel,
    tags,
    onTagsChange: setTags,
    isPrivate,
    onIsPrivateChange: setIsPrivate,
  };

  return (
    <div className="flex h-full min-h-0">
      <div className="flex h-full min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            title="Back to entries"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1" />

          <div className="flex shrink-0 items-center gap-3">
            <SaveIndicator saveState={saveState} lastSavedAt={lastSavedAt} />
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 2xl:hidden"
              title="Entry details"
            >
              <PanelRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Title + quick chips */}
        <div className="px-5 pt-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title..."
            className="w-full bg-transparent text-[28px] font-bold text-slate-900 outline-none placeholder:text-slate-300"
          />

          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="mt-2 flex flex-wrap items-center gap-2"
          >
            {moodOption && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getMoodBadgeClass()}`}
              >
                {moodOption.emoji} {moodOption.label}
              </span>
            )}
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
            <span className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-400 hover:border-violet-300 hover:text-violet-500">
              + Add mood or tag
            </span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="mt-4">
          <JournalToolbar editor={editor} />
        </div>

        {/* Writing surface */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          <EditorContent editor={editor} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!editor?.can().undo()}
              onClick={() => editor?.chain().focus().undo().run()}
              title="Undo"
              className="rounded-lg p-1.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={!editor?.can().redo()}
              onClick={() => editor?.chain().focus().redo().run()}
              title="Redo"
              className="rounded-lg p-1.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <span>
            {wordCount} {wordCount === 1 ? "word" : "words"} &middot; {readMinutes} min
            read
          </span>
        </div>
      </div>

      {/* Details panel: permanent column at 2xl+, slide-over drawer below that */}
      <div className="hidden h-full w-80 shrink-0 border-l border-slate-100 2xl:block">
        <JournalDetailsPanel {...detailsPanelProps} />
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-30 2xl:hidden">
          <div
            className="absolute inset-0 bg-slate-900/20"
            onClick={() => setDetailsOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="font-semibold text-slate-900">Details</h3>
              <button
                type="button"
                onClick={() => setDetailsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <JournalDetailsPanel {...detailsPanelProps} />
          </div>
        </div>
      )}
    </div>
  );
}
