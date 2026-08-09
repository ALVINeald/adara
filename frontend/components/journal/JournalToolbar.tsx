"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  ChevronDown,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";

interface JournalToolbarProps {
  editor: Editor | null;
}

const HEADING_LEVELS = [
  { level: 0 as const, label: "Text" },
  { level: 1 as const, label: "Heading 1" },
  { level: 2 as const, label: "Heading 2" },
  { level: 3 as const, label: "Heading 3" },
];

function ToolbarButton({
  active,
  disabled,
  title,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
        disabled
          ? "cursor-not-allowed text-slate-300"
          : active
            ? "bg-violet-100 text-violet-700"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

export default function JournalToolbar({ editor }: JournalToolbarProps) {
  const [headingMenuOpen, setHeadingMenuOpen] = useState(false);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  if (!editor) return null;

  const activeHeadingLevel = HEADING_LEVELS.find(({ level }) =>
    level === 0
      ? editor.isActive("paragraph")
      : editor.isActive("heading", { level })
  );

  function setHeading(level: 0 | 1 | 2 | 3) {
    if (level === 0) {
      editor?.chain().focus().setParagraph().run();
    } else {
      editor?.chain().focus().toggleHeading({ level }).run();
    }
    setHeadingMenuOpen(false);
  }

  function openLinkPopover() {
    const existingUrl = editor?.getAttributes("link").href as
      | string
      | undefined;
    setLinkUrl(existingUrl ?? "");
    setLinkPopoverOpen(true);
  }

  function applyLink() {
    if (!editor) return;

    const trimmed = linkUrl.trim();
    if (!trimmed) {
      editor.chain().focus().unsetLink().run();
    } else {
      const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setLinkPopoverOpen(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-white/95 px-2 py-2 backdrop-blur">
      {/* Heading dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setHeadingMenuOpen((open) => !open)}
          className="flex h-8 items-center gap-1 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          {activeHeadingLevel?.label ?? "Text"}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        {headingMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setHeadingMenuOpen(false)}
            />
            <div className="absolute left-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
              {HEADING_LEVELS.map(({ level, label }) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setHeading(level)}
                  className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50 ${
                    activeHeadingLevel?.level === level
                      ? "text-violet-700"
                      : "text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mx-1 h-5 w-px bg-slate-200" />

      <ToolbarButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-slate-200" />

      <ToolbarButton
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-slate-200" />

      <div className="relative">
        <ToolbarButton
          title="Link"
          active={editor.isActive("link")}
          onClick={openLinkPopover}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        {linkPopoverOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setLinkPopoverOpen(false)}
            />
            <div className="absolute left-0 top-full z-20 mt-1 flex w-64 items-center gap-2 rounded-xl border border-slate-100 bg-white p-2 shadow-lg">
              <input
                autoFocus
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyLink();
                  if (e.key === "Escape") setLinkPopoverOpen(false);
                }}
                placeholder="Paste a link..."
                className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-violet-400"
              />
              <button
                type="button"
                onClick={applyLink}
                className="shrink-0 rounded-lg bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-700"
              >
                {linkUrl.trim() ? "Add" : "Remove"}
              </button>
            </div>
          </>
        )}
      </div>

      <ToolbarButton
        title="Divider"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>

      {/* Photo attachments need a Supabase Storage bucket + upload
          flow that's out of scope for this pass -- shown disabled
          with a clear reason rather than wired up to nothing, or
          left out and silently missing from a toolbar the reference
          design shows it in. */}
      <ToolbarButton
        title="Photo attachments -- coming soon"
        disabled
      >
        <ImageIcon className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}
