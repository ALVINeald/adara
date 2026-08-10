"use client";

import { Phone } from "lucide-react";

interface EmergencyFABProps {
  onClick: () => void;
}

export default function EmergencyFAB({ onClick }: EmergencyFABProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open emergency support options"
      className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transition active:scale-95 md:hidden"
      style={{ bottom: "max(6rem, calc(env(safe-area-inset-bottom) + 5rem))" }}
    >
      <Phone className="h-6 w-6" fill="currentColor" />
    </button>
  );
}
