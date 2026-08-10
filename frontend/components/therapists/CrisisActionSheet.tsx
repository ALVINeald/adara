"use client";

import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { Phone, X } from "lucide-react";

import { UGANDA_CRISIS_CONTACTS } from "./crisisResources";

interface CrisisActionSheetProps {
  open: boolean;
  onClose: () => void;
}

const DISMISS_THRESHOLD_PX = 100;

function vibrateIfSupported(pattern: number | number[]) {
  // navigator.vibrate isn't supported on iOS Safari at all -- this is
  // a progressive enhancement, not something every user will feel.
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(pattern);
  }
}

export default function CrisisActionSheet({ open, onClose }: CrisisActionSheetProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!open) return null;

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > DISMISS_THRESHOLD_PX || info.velocity.y > 500) {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-labelledby="crisis-sheet-title">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={handleDragEnd}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={
          prefersReducedMotion ? { duration: 0.15 } : { type: "spring", damping: 30, stiffness: 300 }
        }
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl"
      >
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-10 rounded-full bg-slate-200" />
        </div>

        <div className="flex items-center justify-between px-6 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
              <Phone className="h-4 w-4 text-red-600" />
            </div>
            <h2 id="crisis-sheet-title" className="text-lg font-semibold text-slate-900">
              Need immediate support?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="px-6 pt-2 text-sm text-slate-500">
          You are not alone. Help is available right now.
        </p>

        <div className="space-y-2 px-6 py-5">
          {UGANDA_CRISIS_CONTACTS.map((contact) => (
            <a
              key={contact.name}
              href={`tel:${contact.number}`}
              onClick={() => vibrateIfSupported(40)}
              className="flex min-h-[44px] items-center gap-3 rounded-2xl bg-red-50 px-4 py-3 transition active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                <Phone className="h-4 w-4 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {contact.name}
                </p>
                <p className="text-xs text-slate-500">
                  {contact.number}
                  {contact.hours ? ` · ${contact.hours}` : ""}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-slate-100 py-3 text-sm font-medium text-slate-600"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
