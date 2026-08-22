"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface CompanionSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanionSlideOver({
  isOpen,
  onClose,
}: CompanionSlideOverProps) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close companion"
        onClick={onClose}
        className={[
          "fixed inset-0 z-[90]",
          "bg-slate-950/20 backdrop-blur-[2px]",
          "transition-opacity duration-300",
        ].join(" ")}
      />

      {/* COMPANION PANEL */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Adara Companion"
        className={[
          "fixed z-[100]",
          "flex flex-col",
          "overflow-hidden",
          "bg-white",
          "shadow-[-20px_0_70px_rgba(44,30,90,0.18)]",

          /*
           * MOBILE:
           * Full viewport experience.
           */
          "inset-0 h-[100dvh] w-full",

          /*
           * DESKTOP:
           * Right-side panel.
           */
          "md:inset-y-0 md:right-0 md:left-auto",
          "md:h-full md:w-[440px]",
          "md:max-w-[calc(100vw-24px)]",
        ].join(" ")}
      >
        {/* HEADER */}
        <header
          className={[
            "flex shrink-0 items-center justify-between",
            "border-b border-slate-100",
            "bg-white/95 backdrop-blur-xl",
            "px-4 py-3",
            "sm:px-5 sm:py-4",
          ].join(" ")}
          style={{
            paddingTop:
              "max(0.75rem, env(safe-area-inset-top))",
          }}
        >
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-slate-900 sm:text-lg">
              Adara Companion
            </p>

            <p className="truncate text-xs text-slate-400 sm:text-sm">
              A quiet space to talk
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Adara Companion"
            className={[
              "ml-3 flex h-10 w-10 shrink-0",
              "items-center justify-center",
              "rounded-full",
              "bg-slate-100 text-slate-500",
              "transition",
              "hover:bg-slate-200 hover:text-slate-700",
              "active:scale-95",
              "focus:outline-none focus:ring-2",
              "focus:ring-violet-300",
            ].join(" ")}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {/* 
            IMPORTANT:
            Keep your existing Companion content here.

            If your original component already contains the actual
            Companion chat UI, move that existing JSX into this area
            rather than replacing the chat functionality.
          */}

          <div className="flex min-h-full items-center justify-center p-6">
            <div className="max-w-sm text-center">
              <h2 className="text-xl font-bold text-slate-900">
                Your Companion
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your private space to pause, reflect, and talk.
              </p>
            </div>
          </div>
        </div>

        {/* SAFE AREA */}
        <div
          className="shrink-0 bg-white"
          style={{
            height: "env(safe-area-inset-bottom)",
          }}
        />
      </aside>
    </>
  );
}